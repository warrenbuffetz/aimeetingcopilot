import overrides from "./questrade-editorial-question-overrides.json";
import simpliiOverrides from "./simplii-editorial-question-overrides.json";
import type { InterviewProfileKey } from "./profile-content-eligibility";
import type { EnrichedQaRow } from "./types";

const EDITORIAL_ROW_ID_OVERRIDES = overrides as Record<string, string>;
const SIMPLII_EDITORIAL_IMPORT_KEY_OVERRIDES = simpliiOverrides as Record<string, string>;

export function normalizeEditorialQuestion(s: string): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(s: string): Set<string> {
  return new Set(
    normalizeEditorialQuestion(s)
      .split(" ")
      .filter((t) => t.length > 2)
  );
}

/** Jaccard + substring boost — tuned for editorial ↔ library phrasing drift. */
export function editorialQuestionSimilarity(a: string, b: string): number {
  const na = normalizeEditorialQuestion(a);
  const nb = normalizeEditorialQuestion(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.92;
  const ta = tokenSet(a);
  const tb = tokenSet(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function catalogMatchTexts(row: EnrichedQaRow): string[] {
  const nav = row.navigator;
  return [row.question, nav.canonicalQuestion, ...(nav.altPhrasings ?? [])].filter(
    (t): t is string => Boolean(t?.trim())
  );
}

export function editorialRowIdOverride(editorialQuestion: string): string | undefined {
  return EDITORIAL_ROW_ID_OVERRIDES[editorialQuestion.trim()];
}

export function findBestCatalogMatchForEditorial(
  editorialQuestion: string,
  catalog: EnrichedQaRow[],
  opts?: { minScore?: number; excludeRowIds?: Set<string>; interviewProfile?: InterviewProfileKey }
): { row: EnrichedQaRow; score: number; matchedText: string } | null {
  const minScore = opts?.minScore ?? 0.55;
  const exclude = opts?.excludeRowIds;
  const profile = opts?.interviewProfile ?? "questrade";

  if (profile === "simplii") {
    const importKey = SIMPLII_EDITORIAL_IMPORT_KEY_OVERRIDES[editorialQuestion.trim()];
    if (importKey) {
      const row = catalog.find((r) => r.navigator.importKey === importKey);
      if (row && !exclude?.has(row.id)) {
        return { row, score: 1, matchedText: row.question };
      }
    }
  }

  const overrideId = editorialRowIdOverride(editorialQuestion);
  if (overrideId && !exclude?.has(overrideId)) {
    const row = catalog.find((r) => r.id === overrideId);
    if (row) {
      return { row, score: 1, matchedText: row.question };
    }
  }
  let best: { row: EnrichedQaRow; score: number; matchedText: string } | null = null;

  for (const row of catalog) {
    if (exclude?.has(row.id)) continue;
    for (const text of catalogMatchTexts(row)) {
      const score = editorialQuestionSimilarity(editorialQuestion, text);
      if (!best || score > best.score) {
        best = { row, score, matchedText: text };
      }
    }
  }

  if (!best || best.score < minScore) return null;
  return best;
}
