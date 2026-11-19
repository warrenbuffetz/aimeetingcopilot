import type { AmenaQuestion } from "./dataset";

/**
 * Deterministic primary-question pivots. Follow-ups on the open answer stay
 * ahead of these in the UI. Keys only point at curated questions.
 */
const RELATED_KEYS: Record<string, string[]> = {
  A01: ["A02", "A06", "A08"],
  A02: ["A04", "A10", "A03"],
  A03: ["A02", "A07", "A01"],
  A04: ["A02", "A05", "A10"],
  A05: ["A04", "A02", "A01"],
  A06: ["A09", "A11", "A12"],
  A07: ["A13", "A06", "A03"],
  A08: ["A09", "A12", "A10"],
  A09: ["A11", "A08", "A14"],
  A10: ["A11", "A12", "A02"],
  A11: ["A10", "A12", "A09"],
  A12: ["A10", "A11", "A08"],
  A13: ["A07", "A10", "A11"],
  A14: ["A09", "A08", "A01"],
};

export function relatedQuestionKeys(curatedKey: string): string[] {
  return RELATED_KEYS[curatedKey] ?? [];
}

export function relatedQuestions(question: AmenaQuestion, all: AmenaQuestion[]): AmenaQuestion[] {
  const byKey = new Map(all.map((item) => [item.curatedKey, item]));
  const explicit = relatedQuestionKeys(question.curatedKey)
    .map((key) => byKey.get(key))
    .filter((item): item is AmenaQuestion => Boolean(item && item.id !== question.id));
  if (explicit.length) return explicit.slice(0, 3);
  return all.filter((item) => item.category === question.category && item.id !== question.id).slice(0, 2);
}
