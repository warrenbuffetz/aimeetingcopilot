/** Deterministic links from curated question keys (Q01–Q33) to product story map ids. */
export const QUESTION_CURATED_KEY_TO_MAP_IDS: Record<string, readonly string[]> = {
  Q09: ["hbc-portfolio"],
  Q14: ["rbc-payouts", "rbc-select"],
  Q15: ["rbc-payouts"],
  Q18: ["rbc-payouts", "hbc-portfolio"],
  Q19: ["hbc-app"],
  Q20: ["rbc-shopplus"],
  Q21: ["rbc-payouts"],
  Q22: ["rbc-payouts"],
  Q23: ["rbc-payouts"],
  Q24: ["arc-membership"],
  Q25: ["arc-membership"],
  Q26: ["arc-membership"],
  Q27: ["hbc-app", "hbc-portfolio"],
  Q28: ["arc-membership"],
  Q29: ["arc-membership"],
  Q30: ["arc-membership"],
  Q31: ["rbc-payouts", "rbc-shopplus", "rbc-select"],
  Q32: ["hbc-app", "hbc-portfolio"],
  Q33: ["aeroplan-acq"],
  Q03: ["arc-membership"],
  Q17: ["arc-membership"],
};

export function mapIdsForQuestionId(questionId: string): string[] {
  const key = questionId.replace(/^jaz-/, "");
  return [...(QUESTION_CURATED_KEY_TO_MAP_IDS[key] ?? [])];
}

export const STORY_ID_TO_ROLE_ID: Record<string, string> = {
  "rbc-payouts": "rbc",
  "rbc-shopplus": "rbc",
  "rbc-select": "rbc",
  "hbc-app": "hbc",
  "hbc-portfolio": "hbc",
  "arc-membership": "arc",
  "aeroplan-acq": "aeroplan",
};
