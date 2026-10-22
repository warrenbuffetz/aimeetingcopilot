import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  enrichLibrary,
  rankPreparedQaWithContext,
  type AnalyzeQuestionResult,
  type InterviewSessionContext,
  type LexicalQaRow,
  type PreparedFollowUp,
  type PersistedNavigatorMeta,
  type RetrievalMatch,
} from "@interview-copilot/shared";
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

export async function analyzeQuestionLocal(
  supabase: SupabaseClient,
  opts: {
    question: string;
    profileId: string | null;
    sessionContext?: InterviewSessionContext | null;
  }
): Promise<AnalyzeQuestionResult> {
  const question = sanitizeUserContent(opts.question, 2000);

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

  const enriched = enrichLibrary(
    (rows ?? []).map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      isPreferred: r.is_preferred,
      followUps: parseFollowUps(r.follow_ups),
      category: r.category,
      navigatorMeta: (r.navigator_meta ?? {}) as PersistedNavigatorMeta,
    }))
  );

  const library: LexicalQaRow[] = (rows ?? []).map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    isPreferred: r.is_preferred,
    followUps: parseFollowUps(r.follow_ups),
    category: r.category,
  }));

  if (library.length === 0) {
    return {
      question,
      outcome: "GENERATED",
      confidence: 0,
      answer:
        "No prepared answers in your library yet. Add Q&A in the Answer library or run the Questrade seed.",
      sourceLabel: "Local match",
      talkingPoints: [],
      matches: [],
      matchMethod: "lexical",
    };
  }

  const ranked = rankPreparedQaWithContext(question, library, enriched, opts.sessionContext ?? null);
  const best = ranked[0];
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
      question,
      outcome: "GENERATED",
      confidence: best?.score ?? 0,
      answer:
        "No close prepared match. Try manual analyze with shorter wording, or add this question to your library.",
      sourceLabel: "Local match",
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
      matchMethod: "lexical",
    };
  }

  const review = best.score < LEXICAL_MATCH_THRESHOLD_PREPARED;
  const isFollowUp = best.kind === "follow_up";
  const enrichedBest = enriched.find((r) => r.id === best.rowId);

  return {
    question,
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
        : "Your prepared answer (verbatim)",
    talkingPoints: enrichedBest?.navigator.shortAnswer
      ? [enrichedBest.navigator.shortAnswer]
      : [],
    followUps: (best.followUps ?? []).filter((fu) => fu.answer.trim() !== best.answer.trim()),
    matches,
    matchMethod: "lexical",
  };
}
