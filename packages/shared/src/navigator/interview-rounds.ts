import type { InterviewRound, PanelDiscipline, RoundPriority } from "./types";

export type { InterviewRound, PanelDiscipline, RoundPriority };

export const INTERVIEW_ROUND_LABELS: Record<InterviewRound, string> = {
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
  cross_functional_panel: "Cross-Functional Panel",
};

const ROUND_BOOST: Record<RoundPriority, number> = {
  very_high: 0.06,
  high: 0.04,
  medium: 0.02,
  low: 0,
};

/** Secondary signal only — must not dominate a strong lexical/semantic match. */
export function roundRelevanceBoost(
  round: InterviewRound | null | undefined,
  roundRelevance: Partial<Record<InterviewRound, RoundPriority>> | undefined,
  baseScore: number
): number {
  if (!round || !roundRelevance) return baseScore;
  const priority = roundRelevance[round];
  if (!priority) return baseScore;
  const boost = ROUND_BOOST[priority];
  if (baseScore >= 0.82) return Math.min(1, baseScore + boost * 0.5);
  return Math.min(1, baseScore + boost);
}

export function sortByRoundPriority(
  rows: { question: string; navigator: { roundRelevance?: Partial<Record<InterviewRound, RoundPriority>> } }[],
  round: InterviewRound
): typeof rows {
  const weight = (p?: RoundPriority) =>
    p === "very_high" ? 4 : p === "high" ? 3 : p === "medium" ? 2 : p === "low" ? 1 : 0;
  return [...rows].sort(
    (a, b) => weight(b.navigator.roundRelevance?.[round]) - weight(a.navigator.roundRelevance?.[round])
  );
}
