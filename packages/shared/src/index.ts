export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;

/** Minimum cosine similarity (0–1) to treat as a direct prepared match */
export const MATCH_THRESHOLD_PREPARED = 0.78;
/** Minimum similarity to suggest adapting an experience story */
export const MATCH_THRESHOLD_STORY = 0.72;
/** Below prepared but above this → weak / general guidance only */
export const MATCH_THRESHOLD_WEAK = 0.65;

export type ContentType = "prepared_qa" | "experience_story" | "document_chunk";

export type MatchOutcome = "PREPARED" | "ADAPTED" | "GENERATED";

export type AnswerFormat = "full" | "thirty_second" | "bullets";

export interface RetrievalMatch {
  id: string;
  contentType: ContentType;
  sourceId: string;
  title: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export interface AnalyzeQuestionResult {
  question: string;
  outcome: MatchOutcome;
  confidence: number;
  preparedQuestion?: string;
  answer: string;
  sourceLabel?: string;
  talkingPoints?: string[];
  matches: RetrievalMatch[];
}

export function isLikelyQuestion(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.endsWith("?")) return true;
  const starters =
    /^(how|what|why|when|where|who|which|can you|could you|would you|tell me|describe|walk me through|give me an example)/i;
  return starters.test(t);
}

export function boostSimilarity(
  similarity: number,
  opts: { preferred?: boolean; sameProfile?: boolean }
): number {
  let s = similarity;
  if (opts.preferred) s += 0.04;
  if (opts.sameProfile) s += 0.02;
  return Math.min(s, 1);
}
