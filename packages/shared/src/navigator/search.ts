import { tokenizeForMatch } from "../lexical-match";
import type { EnrichedQaRow } from "./types";

export interface LibrarySearchResult {
  rowId: string;
  question: string;
  answer: string;
  experienceLabel: string;
  intent: string;
  score: number;
  snippet: string;
}

export function searchLibrary(catalog: EnrichedQaRow[], query: string, limit = 12): LibrarySearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const qTokens = new Set(tokenizeForMatch(q));
  const results: LibrarySearchResult[] = [];

  for (const row of catalog) {
    const hay = [
      row.question,
      row.answer.slice(0, 500),
      row.navigator.experienceLabel,
      row.category ?? "",
      ...row.navigator.altPhrasings,
      ...row.navigator.topicTags,
      ...row.navigator.keywords,
    ]
      .join(" ")
      .toLowerCase();

    if (hay.includes(q)) {
      results.push({
        rowId: row.id,
        question: row.question,
        answer: row.answer,
        experienceLabel: row.navigator.experienceLabel,
        intent: row.navigator.intent,
        score: 1,
        snippet: row.question,
      });
      continue;
    }

    let hits = 0;
    for (const t of qTokens) {
      if (hay.includes(t)) hits += 1;
    }
    if (hits === 0) continue;
    const score = hits / Math.max(qTokens.size, 1);
    results.push({
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      score,
      snippet: row.question,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
