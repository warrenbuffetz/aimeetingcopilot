import OpenAI from "openai";
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "@interview-copilot/shared";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  if (!client) {
    client = new OpenAI({ apiKey: key });
  }
  return client;
}

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAI();
  const input = text.trim().slice(0, 8000);
  const res = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return res.data[0].embedding;
}
