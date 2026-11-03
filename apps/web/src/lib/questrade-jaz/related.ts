import type { JazQuestion } from "./dataset";

/**
 * Deterministic primary-question pivots. Follow-ups on the open answer stay
 * ahead of these in the UI. Keys only point at curated questions.
 */
const RELATED_KEYS: Record<string, string[]> = {
  Q01: ["Q02", "Q30", "Q31"],
  Q02: ["Q36", "Q03", "Q04"],
  Q03: ["Q02", "Q30", "Q01"],
  Q04: ["Q36", "Q08", "Q13"],
  Q05: ["Q06", "Q04", "Q02"],
  Q06: ["Q05", "Q36", "Q04"],
  Q07: ["Q06", "Q14", "Q17"],
  Q08: ["Q04", "Q36", "Q13"],
  Q09: ["Q10", "Q13", "Q18"],
  Q10: ["Q04", "Q36", "Q09"],
  Q11: ["Q36", "Q12", "Q16"],
  Q12: ["Q11", "Q04", "Q16"],
  Q13: ["Q04", "Q08", "Q18"],
  Q14: ["Q15", "Q16", "Q21"],
  Q15: ["Q14", "Q21", "Q20"],
  Q16: ["Q14", "Q11", "Q12"],
  Q17: ["Q35", "Q24", "Q06"],
  Q18: ["Q13", "Q19", "Q09"],
  Q19: ["Q32", "Q18", "Q27"],
  Q20: ["Q15", "Q31", "Q18"],
  Q21: ["Q14", "Q15", "Q07"],
  Q22: ["Q14", "Q23", "Q28"],
  Q23: ["Q22", "Q07", "Q06"],
  Q24: ["Q26", "Q25", "Q17"],
  Q25: ["Q24", "Q26", "Q17"],
  Q26: ["Q24", "Q25", "Q29"],
  Q27: ["Q19", "Q34", "Q18"],
  Q28: ["Q25", "Q07", "Q21"],
  Q29: ["Q26", "Q24", "Q30"],
  Q30: ["Q17", "Q24", "Q25"],
  Q31: ["Q15", "Q20", "Q21"],
  Q32: ["Q19", "Q18", "Q01"],
  Q33: ["Q01", "Q32", "Q31"],
  Q34: ["Q27", "Q32", "Q18"],
  Q35: ["Q17", "Q31", "Q14"],
  Q36: ["Q04", "Q08", "Q06"],
};

export function relatedQuestionKeys(curatedKey: string): string[] {
  return RELATED_KEYS[curatedKey] ?? [];
}

export function relatedQuestions(question: JazQuestion, all: JazQuestion[]): JazQuestion[] {
  const byKey = new Map(all.map((item) => [item.curatedKey, item]));
  const explicit = relatedQuestionKeys(question.curatedKey)
    .map((key) => byKey.get(key))
    .filter((item): item is JazQuestion => Boolean(item && item.id !== question.id));
  if (explicit.length) return explicit.slice(0, 3);
  return all.filter((item) => item.category === question.category && item.id !== question.id).slice(0, 2);
}
