import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  enrichLibrary,
  isRetrievalExcluded,
  lexicalRowsFromEnriched,
  normalizeInterviewQuery,
  rankPreparedQaHybrid,
  type AnalyzeQuestionResult,
  type InterviewSessionContext,
  type LexicalQaRow,
  type PreparedFollowUp,
  type PersistedNavigatorMeta,
  type RetrievalMatch,
} from "@interview-copilot/shared";
import { isSemanticSearchEnabled } from "@/lib/env";
import { semanticSearchPrepared } from "@/lib/retrieval/semantic";
import { sanitizeUserContent } from "@/lib/sanitize";

function parseFollowUps(raw: unknown): PreparedFollowUp[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x === "object")
    .map((x) => {
      const o = x as { question?: string; answer?: string };
      return {
        question: String(o.question ?? "").trim(),
        answer: String(o.answer ?? "").trim(),
      };
    })
    .filter((x) => x.question.length >= 3 && x.answer.length >= 1);
}

function spokenPreview(
  enriched: ReturnType<typeof enrichLibrary>[number] | undefined,
  fullAnswer: string
): string[] {
  const spoken =
    enriched?.navigator.spokenAnswer?.trim() ||
    enriched?.navigator.shortAnswer?.trim();
  if (spoken) return [spoken];
  const words = fullAnswer.split(/\s+/).slice(0, 85).join(" ");
  return words.length > 20 ? [words] : [];
}

export async function analyzeQuestionLocal(
  supabase: SupabaseClient,
  opts: {
    question: string;
    profileId: string | null;
    sessionContext?: InterviewSessionContext | null;
  }
): Promise<AnalyzeQuestionResult> {
  const sanitized = sanitizeUserContent(opts.question, 2000);
  const { query: question, corrections: queryCorrections } = normalizeInterviewQuery(sanitized);

  const baseCols = "id, question, answer, is_preferred, category";
  const colsWithMeta = `${baseCols}, follow_ups, navigator_meta`;

  let query = supabase.from("prepared_qa").select(colsWithMeta);
  if (opts.profileId) {
    query = query.eq("profile_id", opts.profileId);
  }
  let { data: rows, error } = await query;

  if (error && /follow_ups|navigator_meta/i.test(error.message)) {
    let fallback = supabase.from("prepared_qa").select(baseCols);
    if (opts.profileId) {
      fallback = fallback.eq("profile_id", opts.profileId);
    }
    const res = await fallback;
    rows = res.data?.map((r) => ({ ...r, follow_ups: [], navigator_meta: {} })) ?? null;
    error = res.error;
  }

  if (error) throw error;

  const allRows = rows ?? [];
  const activeRows = allRows.filter((r) => {
    const meta = (r.navigator_meta ?? {}) as PersistedNavigatorMeta;
    const enriched = enrichLibrary([
      {
        id: r.id,
        question: r.question,
        answer: r.answer,
        navigatorMeta: meta,
      },
    ])[0];
    return !isRetrievalExcluded(enriched.navigator);
  });

  const enriched = enrichLibrary(
    activeRows.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      isPreferred: r.is_preferred,
      followUps: parseFollowUps(r.follow_ups),
      category: r.category,
      navigatorMeta: (r.navigator_meta ?? {}) as PersistedNavigatorMeta,
    }))
  );

  const dbFollowUpsById = new Map(
    activeRows.map((r) => [r.id, parseFollowUps(r.follow_ups)])
  );
  const library: LexicalQaRow[] = lexicalRowsFromEnriched(enriched, dbFollowUpsById);

  let semanticBySourceId: Map<string, number> | null = null;
  let matchMethod: AnalyzeQuestionResult["matchMethod"] = "lexical";
  let semanticStatus: AnalyzeQuestionResult["semanticStatus"] = isSemanticSearchEnabled()
    ? "unavailable"
    : "lexical_only";

  if (library.length === 0) {
    return {
      question: sanitized,
      queryCorrections,
      outcome: "GENERATED",
      confidence: 0,
      answer:
        "No prepared answers in your library yet. Add Q&A in the Answer library or run the Questrade seed.",
      sourceLabel: "Local match",
      talkingPoints: [],
      matches: [],
      matchMethod: "lexical",
      semanticStatus,
    };
  }

  if (isSemanticSearchEnabled()) {
    try {
      const { matches: semantic, status } = await semanticSearchPrepared(
        supabase,
        question,
        opts.profileId
      );
      semanticStatus = status;
      if (semantic.length > 0) {
        semanticBySourceId = new Map(
          semantic
            .filter((m) => m.contentType === "prepared_qa")
            .map((m) => [m.sourceId, m.similarity])
        );
        if (semanticBySourceId.size > 0) matchMethod = "hybrid";
      }
    } catch (e) {
      console.warn("semantic search unavailable, lexical only", e);
      semanticStatus = "error";
    }
  }

  const activeRound = opts.sessionContext?.activeInterviewRound ?? null;
  const ranked = rankPreparedQaHybrid(
    question,
    library,
    enriched,
    opts.sessionContext ?? null,
    semanticBySourceId,
    activeRound
  );

  const best = ranked[0];
  const alternatives = ranked.slice(1, 4).map((r) => ({
    libraryQuestion: r.parentQuestion,
    matchedLabel: r.matchQuestion,
    score: r.score,
    sourceId: r.rowId,
  }));
  const matches: RetrievalMatch[] = ranked.slice(0, 8).map((r) => ({
    id: r.rowId,
    contentType: "prepared_qa",
    sourceId: r.rowId,
    title: r.matchQuestion,
    content: r.answer,
    similarity: r.score,
    metadata: { kind: r.kind, parentQuestion: r.parentQuestion },
  }));

  if (!best || best.score < LEXICAL_MATCH_THRESHOLD_WEAK) {
    return {
      question: sanitized,
      queryCorrections,
      outcome: "GENERATED",
      confidence: best?.score ?? 0,
      answer:
        "No close prepared match. Try manual analyze with shorter wording, or add this question to your library.",
      sourceLabel: matchMethod === "hybrid" ? "Hybrid match" : "Local match",
      talkingPoints: [],
      closestSuggestion: best
        ? {
            libraryQuestion: best.parentQuestion,
            matchedLabel: best.matchQuestion,
            score: best.score,
            sourceId: best.rowId,
          }
        : undefined,
      matches,
      matchMethod,
      semanticStatus,
    };
  }

  const review = best.score < LEXICAL_MATCH_THRESHOLD_PREPARED;
  const isFollowUp = best.kind === "follow_up";
  const enrichedBest = enriched.find((r) => r.id === best.rowId);

  return {
    question: sanitized,
    queryCorrections,
    outcome: "PREPARED",
    confidence: best.score,
    preparedQuestion: best.parentQuestion,
    matchedFollowUpQuestion:
      isFollowUp && best.matchQuestion !== best.parentQuestion ? best.matchQuestion : undefined,
    answer: best.answer,
    sourceLabel: review
      ? "Closest prepared answer — confirm before speaking"
      : isFollowUp
        ? "Prepared follow-up (verbatim)"
        : matchMethod === "hybrid"
          ? "Your prepared answer (hybrid match)"
          : "Your prepared answer (verbatim)",
    talkingPoints: spokenPreview(enrichedBest, best.answer),
    followUps: (best.followUps ?? []).filter((fu) => fu.answer.trim() !== best.answer.trim()),
    matches,
    matchMethod,
    semanticStatus,
    alternativeMatches: alternatives.length > 0 ? alternatives : undefined,
  };
}
