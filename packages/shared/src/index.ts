import type { PreparedFollowUp } from "./lexical-match";

/** Legacy OpenAI embeddings (search_embeddings table). */
export const EMBEDDING_MODEL_OPENAI = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS_OPENAI = 1536;

/** Supabase Edge gte-small (prepared_qa_embeddings table). */
export const EMBEDDING_MODEL_GTE = "gte-small";
export const EMBEDDING_DIMENSIONS_GTE = 384;

/** @deprecated Use EMBEDDING_MODEL_OPENAI */
export const EMBEDDING_MODEL = EMBEDDING_MODEL_OPENAI;
/** @deprecated Use EMBEDDING_DIMENSIONS_OPENAI */
export const EMBEDDING_DIMENSIONS = EMBEDDING_DIMENSIONS_OPENAI;

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

export type MatchMethod = "lexical" | "semantic" | "hybrid";

export interface ClosestLibrarySuggestion {
  /** Canonical prepared_qa question to re-run analyze */
  libraryQuestion: string;
  /** Phrasing that matched (may be a follow-up alias) */
  matchedLabel: string;
  score: number;
  sourceId: string;
}

export interface AnalyzeQuestionResult {
  question: string;
  outcome: MatchOutcome;
  confidence: number;
  preparedQuestion?: string;
  answer: string;
  sourceLabel?: string;
  /** When confidence is low, tap to load this library entry in the main panel */
  closestSuggestion?: ClosestLibrarySuggestion;
  talkingPoints?: string[];
  matches: RetrievalMatch[];
  /** Likely follow-ups for the matched parent question (read-ahead) */
  followUps?: PreparedFollowUp[];
  /** When a follow-up script matched more closely than the parent */
  matchedFollowUpQuestion?: string;
  matchMethod?: MatchMethod;
  /** Semantic layer status (separate from STT / mic connectivity). */
  semanticStatus?: "ready" | "unavailable" | "error" | "lexical_only";
  /** Entity alias fixes applied for retrieval (raw transcript unchanged). */
  queryCorrections?: string[];
  /** Top alternative matches for manual disambiguation */
  alternativeMatches?: ClosestLibrarySuggestion[];
  /** Client staged match before hybrid confirm (optional). */
  matchPhase?: "optimistic" | "confirmed";
  /** Server-side analyze breakdown (optional, for tuning). */
  analyzeTimingMs?: {
    fetchMs: number;
    semanticMs: number;
    rankMs: number;
    totalMs: number;
  };
}

export { isInterviewPrompt, isLikelyQuestion } from "./question-heuristics";
export { questionsEquivalentForDisplay } from "./question-display-equiv";
export { normalizeInterviewQuery } from "./query-normalize";
export type { QueryNormalization } from "./query-normalize";
export { findConceptSpans, moduleIdsForConcept } from "./concept-spans";
export type { ConceptSpan } from "./concept-spans";
export { mergeTranscriptFragments, utteranceLooksComplete } from "./transcript-merge";
export {
  AUDIO_CHUNK_MS,
  AUTO_PROMOTE_SCORE,
  PROMOTE_COOLDOWN_MS,
  TURN_SILENCE_MS,
  TURN_SILENCE_MS_QUESTION_END,
  classifyTurn,
  isFillerTurn,
  isLikelyReadingDisplayedAnswer,
  bestAnswerWindowSimilarity,
  spokenTokenCoverageInCorpus,
  surfaceTurnSuggestion,
  turnSilenceMs,
  shouldFinalizeTurnImmediately,
} from "./turn-classify";
export type { ClassifyTurnOptions, SurfaceTurnOptions, TurnAction, TurnClassification } from "./turn-classify";

export {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  rankPreparedQaLexical,
  scoreLexicalSimilarity,
  tokenizeForMatch,
} from "./lexical-match";
export type { LexicalMatchResult, LexicalQaRow, PreparedFollowUp } from "./lexical-match";

export * from "./navigator";

export function boostSimilarity(
  similarity: number,
  opts: { preferred?: boolean; sameProfile?: boolean }
): number {
  let s = similarity;
  if (opts.preferred) s += 0.04;
  if (opts.sameProfile) s += 0.02;
  return Math.min(s, 1);
}
