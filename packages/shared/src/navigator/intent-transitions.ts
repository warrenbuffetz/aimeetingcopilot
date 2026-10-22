import type { QuestionIntent } from "./types";

/** Likely next intents after the current one (ordered by priority). */
export const INTENT_TRANSITIONS: Record<QuestionIntent, QuestionIntent[]> = {
  main_story: ["problem_discovery", "personal_ownership", "measurement_impact", "solution_alternatives"],
  problem_discovery: ["prioritization", "solution_alternatives", "personal_ownership"],
  prioritization: ["solution_alternatives", "tradeoffs", "measurement_impact"],
  solution_alternatives: ["technical_implementation", "tradeoffs", "personal_ownership"],
  personal_ownership: ["technical_implementation", "measurement_impact", "tradeoffs"],
  technical_implementation: ["challenges_lessons", "measurement_impact", "tradeoffs"],
  measurement_impact: ["attribution", "tradeoffs", "challenges_lessons", "what_differently"],
  attribution: ["tradeoffs", "measurement_impact", "what_differently"],
  tradeoffs: ["challenges_lessons", "what_differently", "technical_implementation"],
  challenges_lessons: ["what_differently", "measurement_impact"],
  what_differently: ["main_story", "technical_implementation", "measurement_impact"],
  general: ["problem_discovery", "personal_ownership", "measurement_impact", "main_story"],
};

export function transitionScore(from: QuestionIntent | null, to: QuestionIntent): number {
  if (!from) return to === "main_story" ? 1 : 0.4;
  const list = INTENT_TRANSITIONS[from] ?? INTENT_TRANSITIONS.general;
  const idx = list.indexOf(to);
  if (idx === -1) return 0.15;
  return 1 - idx * 0.12;
}
