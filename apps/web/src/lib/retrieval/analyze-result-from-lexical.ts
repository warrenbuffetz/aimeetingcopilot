import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  type AnalyzeQuestionResult,
  type LexicalMatchResult,
  type RetrievalMatch,
} from "@interview-copilot/shared";

/** Fast client-side preview from lexical rank only (staged optimistic match). */
export function analyzeResultFromLexicalRank(
  sanitizedQuestion: string,
  ranked: LexicalMatchResult[],
  queryCorrections?: string[]
): AnalyzeQuestionResult | null {
  const best = ranked[0];
  if (!best || best.score < LEXICAL_MATCH_THRESHOLD_PREPARED) {
    return null;
  }

  const matches: RetrievalMatch[] = ranked.slice(0, 8).map((r) => ({
    id: r.rowId,
    contentType: "prepared_qa",
    sourceId: r.rowId,
    title: r.matchQuestion,
    content: r.answer,
    similarity: r.score,
    metadata: { kind: r.kind, parentQuestion: r.parentQuestion },
  }));

  const alternatives = ranked.slice(1, 4).map((r) => ({
    libraryQuestion: r.parentQuestion,
    matchedLabel: r.matchQuestion,
    score: r.score,
    sourceId: r.rowId,
  }));

  const review = best.score < LEXICAL_MATCH_THRESHOLD_PREPARED;
  const isFollowUp = best.kind === "follow_up";

  return {
    question: sanitizedQuestion,
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
        : "Your prepared answer (quick match)",
    talkingPoints: [],
    followUps: (best.followUps ?? []).filter((fu) => fu.answer.trim() !== best.answer.trim()),
    matches,
    matchMethod: "lexical",
    semanticStatus: "lexical_only",
    matchPhase: "optimistic",
    alternativeMatches: alternatives.length > 0 ? alternatives : undefined,
  };
}

export function hybridTopSourceId(result: AnalyzeQuestionResult): string | undefined {
  const top = result.matches[0];
  if (!top?.sourceId) return undefined;
  if (result.outcome !== "PREPARED" && result.confidence < LEXICAL_MATCH_THRESHOLD_WEAK) {
    return result.closestSuggestion?.sourceId;
  }
  return top.sourceId;
}

export function shouldReplaceOptimisticWithHybrid(
  optimistic: AnalyzeQuestionResult,
  hybrid: AnalyzeQuestionResult
): boolean {
  const optId = optimistic.matches[0]?.sourceId;
  const hybridId = hybridTopSourceId(hybrid);
  if (!optId || !hybridId) return true;
  return optId !== hybridId;
}
