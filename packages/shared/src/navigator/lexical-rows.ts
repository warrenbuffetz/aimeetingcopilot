import type { LexicalQaRow, PreparedFollowUp } from "../lexical-match";
import type { EnrichedQaRow } from "./types";

export function mergePreparedFollowUps(
  answer: string,
  fromDb: PreparedFollowUp[],
  altPhrasings: string[] | undefined
): PreparedFollowUp[] {
  const seen = new Set<string>();
  const out: PreparedFollowUp[] = [];
  for (const fu of fromDb) {
    const key = fu.question.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(fu);
  }
  for (const q of altPhrasings ?? []) {
    const key = q.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ question: q.trim(), answer });
  }
  return out;
}

export function lexicalRowsFromEnriched(
  enriched: EnrichedQaRow[],
  dbFollowUpsById?: Map<string, PreparedFollowUp[]>
): LexicalQaRow[] {
  return enriched.map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    isPreferred: r.isPreferred,
    category: r.category,
    followUps: mergePreparedFollowUps(
      r.answer,
      dbFollowUpsById?.get(r.id) ?? [],
      r.navigator.altPhrasings
    ),
  }));
}
