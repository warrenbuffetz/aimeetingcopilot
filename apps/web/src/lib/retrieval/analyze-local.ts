import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  normalizeInterviewQuery,
  rankPreparedQaHybrid,
  type AnalyzeQuestionResult,
  type InterviewSessionContext,
  type RetrievalMatch,
} from "@interview-copilot/shared";
import { isSemanticSearchEnabled } from "@/lib/env";
import { getPreparedLibraryForAnalyze } from "@/lib/retrieval/analyze-library-cache";
import { semanticSearchPrepared } from "@/lib/retrieval/semantic";
import { sanitizeUserContent } from "@/lib/sanitize";

function spokenPreview(
  enriched: Awaited<ReturnType<typeof getPreparedLibraryForAnalyze>>["enriched"][number] | undefined,
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
  const totalStart = performance.now();
  const sanitized = sanitizeUserContent(opts.question, 2000);
  const { query: question, corrections: queryCorrections } = normalizeInterviewQuery(sanitized);

  let fetchMs = 0;
  let semanticMs = 0;
  let rankMs = 0;

  const fetchStart = performance.now();
  const libraryPromise = getPreparedLibraryForAnalyze(supabase, opts.profileId).then((lib) => {
    fetchMs = performance.now() - fetchStart;
    return lib;
  });

  const semanticStart = performance.now();
  const semanticPromise = (
    isSemanticSearchEnabled()
      ? semanticSearchPrepared(supabase, question, opts.profileId).catch((e) => {
          console.warn("semantic search unavailable, lexical only", e);
          return { matches: [], status: "error" as const };
        })
      : Promise.resolve({ matches: [], status: "lexical_only" as const })
  ).then((pack) => {
    semanticMs = performance.now() - semanticStart;
    return pack;
  });

  const [libPack, semanticPack] = await Promise.all([libraryPromise, semanticPromise]);

  const { enriched, library } = libPack;

  let semanticBySourceId: Map<string, number> | null = null;
  let matchMethod: AnalyzeQuestionResult["matchMethod"] = "lexical";
  let semanticStatus: AnalyzeQuestionResult["semanticStatus"] = isSemanticSearchEnabled()
    ? semanticPack.status
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
      matchPhase: "confirmed",
      analyzeTimingMs: {
        fetchMs: Math.round(fetchMs),
        semanticMs: Math.round(semanticMs),
        rankMs: 0,
        totalMs: Math.round(performance.now() - totalStart),
      },
    };
  }

  if (semanticPack.matches.length > 0) {
    semanticBySourceId = new Map(
      semanticPack.matches
        .filter((m) => m.contentType === "prepared_qa")
        .map((m) => [m.sourceId, m.similarity])
    );
    if (semanticBySourceId.size > 0) matchMethod = "hybrid";
  }

  const rankStart = performance.now();
  const activeRound = opts.sessionContext?.activeInterviewRound ?? null;
  const ranked = rankPreparedQaHybrid(
    question,
    library,
    enriched,
    opts.sessionContext ?? null,
    semanticBySourceId,
    activeRound
  );
  rankMs = performance.now() - rankStart;

  const timing = {
    fetchMs: Math.round(fetchMs),
    semanticMs: Math.round(semanticMs),
    rankMs: Math.round(rankMs),
    totalMs: Math.round(performance.now() - totalStart),
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("[analyze]", { profileId: opts.profileId, ...timing });
  }

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
      matchPhase: "confirmed",
      analyzeTimingMs: timing,
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
    matchPhase: "confirmed",
    alternativeMatches: alternatives.length > 0 ? alternatives : undefined,
    analyzeTimingMs: timing,
  };
}
