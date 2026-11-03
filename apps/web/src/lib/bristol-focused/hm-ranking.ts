import ranking from "@/data/bristol-hm-ranking.json";
import type { BristolQuestion } from "./dataset";

export const BRISTOL_HM_MOST_LIKELY_IDS: readonly string[] = ranking.uiBuckets.mostLikely;
export const BRISTOL_HM_NEXT_MOST_LIKELY_IDS: readonly string[] = ranking.uiBuckets.nextMostLikely;

export function bristolQuestionsForHmIds(
  questions: BristolQuestion[],
  ids: readonly string[]
): BristolQuestion[] {
  const byKey = new Map(questions.map((q) => [q.curatedKey, q]));
  return ids.map((id) => byKey.get(id)).filter((q): q is BristolQuestion => Boolean(q));
}

export function validateBristolHmRanking(questions: BristolQuestion[]): string[] {
  const issues: string[] = [];
  const keys = new Set(questions.map((q) => q.curatedKey));

  if (BRISTOL_HM_MOST_LIKELY_IDS.length !== 10) {
    issues.push(`mostLikely expected 10 ids, found ${BRISTOL_HM_MOST_LIKELY_IDS.length}`);
  }
  if (BRISTOL_HM_NEXT_MOST_LIKELY_IDS.length !== 12) {
    issues.push(`nextMostLikely expected 12 ids, found ${BRISTOL_HM_NEXT_MOST_LIKELY_IDS.length}`);
  }

  for (const id of BRISTOL_HM_MOST_LIKELY_IDS) {
    if (!keys.has(id)) issues.push(`mostLikely missing question ${id}`);
  }
  for (const id of BRISTOL_HM_NEXT_MOST_LIKELY_IDS) {
    if (!keys.has(id)) issues.push(`nextMostLikely missing question ${id}`);
  }

  const overlap = BRISTOL_HM_MOST_LIKELY_IDS.filter((id) =>
    (BRISTOL_HM_NEXT_MOST_LIKELY_IDS as string[]).includes(id)
  );
  if (overlap.length) issues.push(`HM buckets overlap: ${overlap.join(", ")}`);

  return issues;
}

export function defaultBristolActiveCuratedKey(): string {
  return BRISTOL_HM_MOST_LIKELY_IDS[0] ?? "B01";
}
