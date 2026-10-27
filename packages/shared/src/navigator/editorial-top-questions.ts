import curated from "./questrade-editorial-top-questions.json";
import simpliiCurated from "./simplii-editorial-top-questions.json";
import type { InterviewProfileKey } from "./profile-content-eligibility";
import type { InterviewRound } from "./types";

export type EditorialTier = "VH" | "H" | "M" | "L";

export type EditorialTopQuestion = {
  rank: number;
  tier: EditorialTier;
  question: string;
};

export const EDITORIAL_TOP_QUESTIONS_BY_ROUND: Record<InterviewRound, EditorialTopQuestion[]> =
  curated as Record<InterviewRound, EditorialTopQuestion[]>;

export const SIMPLII_EDITORIAL_TOP_QUESTIONS_BY_ROUND: Record<InterviewRound, EditorialTopQuestion[]> =
  simpliiCurated as Record<InterviewRound, EditorialTopQuestion[]>;

export function editorialTopQuestionsForProfile(
  profile: InterviewProfileKey,
  round: InterviewRound
): EditorialTopQuestion[] {
  if (profile === "simplii") {
    return SIMPLII_EDITORIAL_TOP_QUESTIONS_BY_ROUND[round] ?? [];
  }
  return EDITORIAL_TOP_QUESTIONS_BY_ROUND[round] ?? [];
}

const ROUND_SHORT: Record<InterviewRound, string> = {
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
  cross_functional_panel: "Panel",
};

export function editorialReasonLabel(round: InterviewRound, rank: number, tier: EditorialTier): string {
  return `${ROUND_SHORT[round]} #${rank} · ${tier}`;
}

export function editorialTierRankBoost(tier: EditorialTier): number {
  if (tier === "VH") return 4;
  if (tier === "H") return 3;
  if (tier === "M") return 2;
  return 1;
}

export function editorialTopQuestionLimit(
  round: InterviewRound,
  profile: InterviewProfileKey = "questrade"
): number {
  if (profile === "simplii") {
    return SIMPLII_EDITORIAL_TOP_QUESTIONS_BY_ROUND[round]?.length ?? 0;
  }
  return EDITORIAL_TOP_QUESTIONS_BY_ROUND[round]?.length ?? 0;
}
