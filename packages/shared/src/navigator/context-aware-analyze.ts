import { rankPreparedQaLexical, scoreLexicalSimilarity, type LexicalMatchResult, type LexicalQaRow } from "../lexical-match";
import {
  explicitExperienceModuleFromSpoken,
  isAmbiguousFollowUp,
  resolveInterviewContext,
} from "./context";
import type { EnrichedQaRow, InterviewSessionContext, QuestionIntent } from "./types";
import { emptyInterviewContext } from "./types";

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
  const explicitModule = explicitExperienceModuleFromSpoken(spoken);
  const useSessionContext =
    Boolean(session?.activeExperienceModuleId && isAmbiguousFollowUp(spoken)) || Boolean(explicitModule);
  if (!useSessionContext) {
    return base;
  }

  const resolution = resolveInterviewContext(spoken, enriched, session ?? emptyInterviewContext());
  const targetModule = explicitModule ?? resolution.experienceModuleId;
  const targetIntent = resolution.intent;

  const ambiguous = Boolean(session?.activeExperienceModuleId && isAmbiguousFollowUp(spoken));
  const boosted = base.map((match) => {
    const row = enriched.find((r) => r.id === match.rowId);
    if (!row) return match;
    let score = match.score;
    for (const alt of row.navigator.altPhrasings ?? []) {
      const altScore = scoreLexicalSimilarity(spoken, alt);
      if (altScore > score) score = Math.min(1, altScore + 0.02);
    }
    const inModule = row.navigator.experienceModuleId === targetModule;
    if (inModule) score += explicitModule ? 0.24 : 0.16;
    const employerOverview =
      row.navigator.topicTags?.includes("scope:employer_overview") ||
      row.navigator.experienceModuleId?.endsWith("-overview");
    if (explicitModule?.endsWith("-overview") && employerOverview && row.navigator.intent === "main_story") {
      score += 0.2;
    }
    if (targetIntent && row.navigator.intent === targetIntent) score += 0.12;
    if (resolution.rowId === row.id) score += 0.15;
    if (ambiguous && targetModule && !inModule) score *= 0.82;
    if (session?.activeQuestionId && row.navigator.canonicalQuestionId === session.activeQuestionId) {
      score += 0.28;
      for (const alt of row.navigator.altPhrasings ?? []) {
        if (scoreLexicalSimilarity(spoken, alt) >= 0.42) score += 0.2;
      }
    }
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
