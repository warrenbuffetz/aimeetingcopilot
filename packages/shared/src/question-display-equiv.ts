/** Conservative normalization for UI collapse only — not retrieval. */
function normalizeForDisplayCompare(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[''']/g, "'")
    .replace(/[?.!,;:]+$/g, "")
    .replace(/^tell (me|us) about /i, "")
    .trim();
}

/**
 * True when detected and library questions are close enough to avoid repeating both in full.
 */
export function questionsEquivalentForDisplay(a: string, b: string): boolean {
  const na = normalizeForDisplayCompare(a);
  const nb = normalizeForDisplayCompare(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if (shorter.length >= 12 && longer.includes(shorter)) {
    return shorter.length / longer.length >= 0.72;
  }
  return false;
}
