/** Links from Bristol curated keys to experience story map ids. */
export const QUESTION_CURATED_KEY_TO_MAP_IDS: Record<string, readonly string[]> = {
  B40: ["rbc-payouts"],
  B41: ["rbc-select"],
  B42: ["hbc-app", "hbc-portfolio"],
  B43: ["arc-membership"],
  B44: ["aeroplan-acq"],
  B45: ["rbc-shopplus"],
  B47: ["rbc-payouts", "rbc-shopplus", "rbc-select"],
  B48: ["arc-membership"],
  B49: ["arc-membership"],
  B51: ["arc-membership"],
  B53: ["arc-membership"],
};

export function mapIdsForQuestionId(questionId: string): string[] {
  const key = questionId.replace(/^bristol-/, "");
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
