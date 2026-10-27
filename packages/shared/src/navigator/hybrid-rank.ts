import type { LexicalMatchResult, LexicalQaRow } from "../lexical-match";
import { LEXICAL_MATCH_THRESHOLD_PREPARED } from "../lexical-match";
import { rankPreparedQaWithContext } from "./context-aware-analyze";
import { isAmbiguousFollowUp, resolveInterviewContext } from "./context";
import { applyConversationalBoost, conversationalBoostForQuery } from "./conversational-retrieval";
import type { EnrichedQaRow, InterviewSessionContext } from "./types";
import { roundRelevanceBoost } from "./interview-rounds";
import type { InterviewRound } from "./interview-rounds";

export type SemanticRowScore = {
  sourceId: string;
  similarity: number;
};

const SEMANTIC_WEIGHT = 0.62;
const LEXICAL_WEIGHT = 0.38;

/**
 * Merge semantic embedding scores with lexical + session context ranking.
 * Semantic is primary when present; lexical anchors exact/near-exact library questions.
 */
export function rankPreparedQaHybrid(
  spoken: string,
  library: LexicalQaRow[],
  enriched: EnrichedQaRow[],
  session: InterviewSessionContext | null | undefined,
  semanticBySourceId: Map<string, number> | null | undefined,
  activeRound?: InterviewRound | null
): LexicalMatchResult[] {
  const ambiguous = Boolean(session?.activeExperienceModuleId && isAmbiguousFollowUp(spoken));
  const convBoost = conversationalBoostForQuery(spoken, session, enriched);
  const lexicalRanked = rankPreparedQaWithContext(spoken, library, enriched, session);
  if (!semanticBySourceId || semanticBySourceId.size === 0) {
    let ranked = lexicalRanked;
    if (convBoost) {
      ranked = lexicalRanked
        .map((m) => {
          const row = enriched.find((r) => r.id === m.rowId);
          if (!row) return m;
          const score = applyConversationalBoost(m.score, row, convBoost);
          return { ...m, score: Math.min(1, score) };
        })
        .sort((a, b) => b.score - a.score);
    }
    return applyRoundBoost(ranked, enriched, activeRound, ambiguous);
  }

  const lexicalById = new Map(lexicalRanked.map((r) => [r.rowId, r]));
  const allIds = new Set<string>([
    ...lexicalRanked.map((r) => r.rowId),
    ...semanticBySourceId.keys(),
  ]);

  const merged: LexicalMatchResult[] = [];
  for (const rowId of allIds) {
    const lex = lexicalById.get(rowId);
    const sem = semanticBySourceId.get(rowId) ?? 0;
    const lexScore = lex?.score ?? 0;
    const combined =
      sem > 0 || lexScore > 0
        ? SEMANTIC_WEIGHT * sem + LEXICAL_WEIGHT * lexScore
        : 0;
    if (!lex && combined < 0.2) continue;
    const libRow = library.find((r) => r.id === rowId);
    merged.push({
      rowId,
      score: combined,
      kind: lex?.kind ?? "main",
      parentQuestion: lex?.parentQuestion ?? enriched.find((r) => r.id === rowId)?.question ?? "",
      matchQuestion: lex?.matchQuestion ?? enriched.find((r) => r.id === rowId)?.question ?? "",
      answer: lex?.answer ?? enriched.find((r) => r.id === rowId)?.answer ?? "",
      followUps: lex?.followUps ?? [],
      isPreferred: lex?.isPreferred ?? Boolean(libRow?.isPreferred),
    });
  }

  merged.sort((a, b) => b.score - a.score);

  const lexicalTop = lexicalRanked[0];
  const hybridTop = merged[0];
  if (
    lexicalTop &&
    hybridTop &&
    lexicalTop.rowId !== hybridTop.rowId &&
    lexicalTop.score >= LEXICAL_MATCH_THRESHOLD_PREPARED &&
    hybridTop.score - lexicalTop.score < 0.1
  ) {
    const pinned = merged.find((m) => m.rowId === lexicalTop.rowId);
    if (pinned) {
      const rest = merged.filter((m) => m.rowId !== lexicalTop.rowId);
      merged.length = 0;
      merged.push({ ...pinned, score: Math.max(pinned.score, hybridTop.score) }, ...rest);
    }
  }

  if (ambiguous && session) {
    const resolution = resolveInterviewContext(spoken, enriched, session);
    const targetModule = resolution.experienceModuleId;
    const targetIntent = resolution.intent;
    for (let i = 0; i < merged.length; i++) {
      const row = enriched.find((r) => r.id === merged[i].rowId);
      if (!row) continue;
      let score = merged[i].score;
      if (row.navigator.experienceModuleId === targetModule) score += 0.12;
      if (targetIntent && row.navigator.intent === targetIntent) score += 0.1;
      if (resolution.rowId === row.id) score += 0.15;
      score = applyConversationalBoost(score, row, convBoost);
      merged[i] = { ...merged[i], score: Math.min(1, score) };
    }
    merged.sort((a, b) => b.score - a.score);
  } else if (convBoost) {
    for (let i = 0; i < merged.length; i++) {
      const row = enriched.find((r) => r.id === merged[i].rowId);
      if (!row) continue;
      const score = applyConversationalBoost(merged[i].score, row, convBoost);
      merged[i] = { ...merged[i], score: Math.min(1, score) };
    }
    merged.sort((a, b) => b.score - a.score);
  }

  return applyRoundBoost(merged, enriched, activeRound, ambiguous);
}

function applyRoundBoost(
  ranked: LexicalMatchResult[],
  enriched: EnrichedQaRow[],
  activeRound?: InterviewRound | null,
  dampenRoundBoost = false
): LexicalMatchResult[] {
  if (!activeRound) return ranked;
  const dampen = dampenRoundBoost ? 0.4 : 1;
  return ranked
    .map((m) => {
      const row = enriched.find((r) => r.id === m.rowId);
      let boosted = roundRelevanceBoost(
        activeRound,
        row?.navigator.roundRelevance,
        m.score
      );
      if (dampenRoundBoost && boosted > m.score) {
        boosted = m.score + (boosted - m.score) * dampen;
      }
      return { ...m, score: boosted };
    })
    .sort((a, b) => b.score - a.score);
}
