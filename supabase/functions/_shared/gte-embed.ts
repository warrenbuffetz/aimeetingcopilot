export const GTE_MODEL = "gte-small";
export const GTE_DIMENSIONS = 384;

export function validateEmbedding(vec: unknown): number[] {
  if (!Array.isArray(vec)) {
    throw new Error("Embedding is not an array");
  }
  if (vec.length !== GTE_DIMENSIONS) {
    throw new Error(`Expected ${GTE_DIMENSIONS} dimensions, got ${vec.length}`);
  }
  const out: number[] = [];
  for (const v of vec) {
    const n = Number(v);
    if (!Number.isFinite(n)) {
      throw new Error("Embedding contains non-finite value");
    }
    out.push(n);
  }
  return out;
}

export async function embedTextsGte(texts: string[]): Promise<number[][]> {
  const model = new Supabase.ai.Session(GTE_MODEL);
  const embeddings: number[][] = [];
  for (const text of texts) {
    const input = text.trim().slice(0, 2000);
    if (!input) {
      throw new Error("Empty embedding input");
    }
    const raw = await model.run(input, { mean_pool: true, normalize: true });
    embeddings.push(validateEmbedding(raw));
  }
  return embeddings;
}
