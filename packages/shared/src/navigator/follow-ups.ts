import { transitionScore } from "./intent-transitions";
import type { EnrichedQaRow, FollowUpSuggestion, InterviewSessionContext, QuestionIntent } from "./types";

const INTENT_LABELS: Record<QuestionIntent, string> = {
  main_story: "Main Story",
  problem_discovery: "Problem Discovery",
  prioritization: "Prioritization",
  solution_alternatives: "Solution & Alternatives",
  personal_ownership: "Personal Ownership",
  technical_implementation: "Technical Implementation",
  measurement_impact: "Measurement & Impact",
  tradeoffs: "Trade-offs",
  challenges_lessons: "Challenges & Lessons",
  what_differently: "What I'd Do Differently",
  general: "General",
};

export function intentLabel(intent: QuestionIntent): string {
  return INTENT_LABELS[intent] ?? intent;
}

export function suggestFollowUps(
  catalog: EnrichedQaRow[],
  ctx: InterviewSessionContext,
  opts?: { limit?: number; includeAllModule?: boolean }
): FollowUpSuggestion[] {
  const limit = opts?.limit ?? 5;
  const moduleId = ctx.manualExperienceOverrideId ?? ctx.activeExperienceModuleId;
  if (!moduleId) {
    return [];
  }

  const pool = catalog.filter((r) => r.navigator.experienceModuleId === moduleId);
  const scored: FollowUpSuggestion[] = [];

  for (const row of pool) {
    if (ctx.askedQuestionIds.includes(row.id)) continue;
    const tScore = transitionScore(ctx.activeIntent, row.navigator.intent);
    if (tScore < 0.1 && !opts?.includeAllModule) continue;
    const reason = ctx.activeIntent
      ? `Natural follow-up after ${intentLabel(ctx.activeIntent)}`
      : "Related to active experience";
    scored.push({
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceModuleId: row.navigator.experienceModuleId,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      rank: tScore + (row.isPreferred ? 0.05 : 0),
      reason,
    });
  }

  scored.sort((a, b) => b.rank - a.rank);
  return scored.slice(0, limit);
}

export function moduleCatalog(catalog: EnrichedQaRow[], moduleId: string): EnrichedQaRow[] {
  return catalog
    .filter((r) => r.navigator.experienceModuleId === moduleId)
    .sort((a, b) => intentSortKey(a.navigator.intent) - intentSortKey(b.navigator.intent));
}

function intentSortKey(intent: QuestionIntent): number {
  const order: QuestionIntent[] = [
    "main_story",
    "problem_discovery",
    "prioritization",
    "solution_alternatives",
    "personal_ownership",
    "technical_implementation",
    "measurement_impact",
    "tradeoffs",
    "challenges_lessons",
    "what_differently",
    "general",
  ];
  return order.indexOf(intent);
}
