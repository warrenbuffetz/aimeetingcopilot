/**
 * High-pressure follow-up rows (importKey simplii-hp-*) linked to parent prompts.
 */
export const SIMPLII_HP_PARENT_IMPORT_KEYS: Record<string, string[]> = {
  "simplii-hp-01": ["simplii-jd-002", "simplii-panel-gap-01"],
  "simplii-hp-02": ["simplii-jd-015", "simplii-panel-gap-02", "simplii-panel-gap-03"],
  "simplii-hp-03": [
    "simplii-panel-gap-07",
    "simplii-from-11375f03-31fa-45da-8557-488a8cc63beb",
  ],
  "simplii-hp-04": [
    "simplii-jd-005",
    "simplii-from-3c199d05-67ba-4f4c-aa98-d7f06a2cc3c6",
    "simplii-from-bfaa86a1-2c06-4c4f-880a-bf2718e8a330",
    "simplii-john-experience-depth-v1-rbc-discovery-context",
    "simplii-from-11375f03-31fa-45da-8557-488a8cc63beb",
  ],
  "simplii-hp-05": ["simplii-jd-007", "simplii-panel-gap-02"],
  "simplii-hp-06": ["simplii-jd-002", "simplii-panel-gap-01"],
  "simplii-hp-07": ["simplii-jd-004", "simplii-panel-gap-04", "simplii-panel-bank-01"],
  "simplii-hp-08": ["simplii-from-557cbeab-d17e-48bc-99de-1a54625ee37f", "simplii-panel-gap-05"],
  "simplii-hp-09": ["simplii-jd-003", "simplii-jd-021", "simplii-panel-gap-03"],
  "simplii-hp-10": ["simplii-jd-007", "simplii-panel-gap-02"],
};

/** Parent importKey → HP importKeys (inverse index). */
export function simpliiHpChildrenForParentImportKey(parentImportKey: string | undefined): string[] {
  if (!parentImportKey) return [];
  const out: string[] = [];
  for (const [hpKey, parents] of Object.entries(SIMPLII_HP_PARENT_IMPORT_KEYS)) {
    if (parents.includes(parentImportKey)) out.push(hpKey);
  }
  return out;
}
