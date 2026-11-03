import bundle from "@/data/bristol-canonical-answers.json";

export type CanonicalSnippet = {
  question: string;
  answer: string;
  shortAnswer: string;
  evidenceStatus: string;
};

type Bundle = {
  version: number;
  questrade: Record<string, CanonicalSnippet>;
  opentable: Record<string, CanonicalSnippet>;
};

const data = bundle as Bundle;

export function canonicalFromQuestradeId(id: string | null | undefined): CanonicalSnippet | null {
  if (!id) return null;
  return data.questrade[id] ?? null;
}

export function canonicalFromOpenTableId(id: string | null | undefined): CanonicalSnippet | null {
  if (!id) return null;
  return data.opentable[id] ?? null;
}
