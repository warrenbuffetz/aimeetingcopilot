/** People-leadership follow-up rows (importKey simplii-pl-*) linked to parent prompts. */
export const SIMPLII_PL_PARENT_IMPORT_KEYS: Record<string, string[]> = {
  "simplii-pl-01": ["simplii-pl-04", "simplii-pl-06", "simplii-pl-14", "simplii-pl-16"],
  "simplii-pl-05": ["simplii-pl-06", "simplii-pl-16", "simplii-pl-04"],
  "simplii-pl-09": ["simplii-pl-11", "simplii-pl-10", "simplii-pl-17", "simplii-pl-14"],
  "simplii-pl-02": ["simplii-pl-17", "simplii-pl-15", "simplii-pl-19"],
  "simplii-pl-10": ["simplii-pl-11", "simplii-pl-20"],
};

export function simpliiPlChildrenForParentImportKey(parentImportKey: string | undefined): string[] {
  if (!parentImportKey) return [];
  return SIMPLII_PL_PARENT_IMPORT_KEYS[parentImportKey] ?? [];
}
