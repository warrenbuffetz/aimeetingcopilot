import { rankPreparedQaLexical, scoreLexicalSimilarity, type LexicalMatchResult, type LexicalQaRow } from "../lexical-match";
import { isAmbiguousFollowUp, resolveInterviewContext } from "./context";
import type { EnrichedQaRow, InterviewSessionContext, QuestionIntent } from "./types";

/**
 * Lexical rank with session context — ambiguous follow-ups stay on active experience/intent.
 */
export function rankPreparedQaWithContext(
  spoken: string,
  library: LexicalQaRow[],
  enriched: EnrichedQaRow[],
  session: InterviewSessionContext | null | undefined
): LexicalMatchResult[] {
  const base = rankPreparedQaLexical(spoken, library);
  if (!session?.activeExperienceModuleId || !isAmbiguousFollowUp(spoken)) {
    return base;
  }

  const resolution = resolveInterviewContext(spoken, enriched, session);
  const targetModule = resolution.experienceModuleId;
  const targetIntent = resolution.intent;

  const boosted = base.map((match) => {
    const row = enriched.find((r) => r.id === match.rowId);
    if (!row) return match;
    let score = match.score;
    if (row.navigator.experienceModuleId === targetModule) score += 0.12;
    if (targetIntent && row.navigator.intent === targetIntent) score += 0.1;
    if (resolution.rowId === row.id) score += 0.15;
    return { ...match, score: Math.min(1, score) };
  });

  return boosted.sort((a, b) => b.score - a.score);
}

export function bestIntentForAmbiguous(spoken: string): QuestionIntent {
  const q = spoken.toLowerCase();
  if (/incremental|attribut/.test(q)) return "attribution";
  if (/measure/.test(q)) return "measurement_impact";
  if (/decide|own/.test(q)) return "personal_ownership";
  if (/differently|change/.test(q)) return "what_differently";
  return "general";
}

export function scoreInModule(
  spoken: string,
  rows: EnrichedQaRow[],
  moduleId: string,
  preferredIntent?: QuestionIntent | null
): { rowId: string; score: number } | null {
  let best: { rowId: string; score: number } | null = null;
  for (const row of rows) {
    if (row.navigator.experienceModuleId !== moduleId) continue;
    let s = scoreLexicalSimilarity(spoken, row.question);
    if (preferredIntent && row.navigator.intent === preferredIntent) s += 0.12;
    if (!best || s > best.score) best = { rowId: row.id, score: s };
  }
  return best;
}
