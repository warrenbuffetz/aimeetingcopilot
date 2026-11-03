import type { BristolQuestion } from "./dataset";

const RELATED_KEYS: Record<string, string[]> = {
  B01: ["B02", "B03", "B40"],
  B02: ["B03", "B06", "B17"],
  B06: ["B17", "B18", "B02"],
  B07: ["B09", "B16", "B28"],
  B09: ["B07", "B16", "B33"],
  B17: ["B18", "B20", "B06"],
  B40: ["B41", "B45", "B49"],
  B43: ["B48", "B53", "B52"],
  B49: ["B50", "B52", "B53"],
};

export function relatedQuestionKeys(curatedKey: string): string[] {
  return RELATED_KEYS[curatedKey] ?? [];
}

export function relatedQuestions(question: BristolQuestion, all: BristolQuestion[]): BristolQuestion[] {
  const byKey = new Map(all.map((item) => [item.curatedKey, item]));
  const explicit = relatedQuestionKeys(question.curatedKey)
    .map((key) => byKey.get(key))
    .filter((item): item is BristolQuestion => Boolean(item && item.id !== question.id));
  if (explicit.length) return explicit.slice(0, 3);
  return all.filter((item) => item.category === question.category && item.id !== question.id).slice(0, 2);
}
