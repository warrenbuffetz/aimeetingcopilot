import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  rankPreparedQaLexical,
  scoreLexicalSimilarity,
  type LexicalMatchResult,
  type LexicalQaRow,
} from "./lexical-match";
import { isLikelyQuestion } from "./question-heuristics";

/** Default pause after last speech fragment before classifying the turn (~human reaction time). */
export const TURN_SILENCE_MS = 2000;
/** Shorter finalize when the buffer already looks like a finished question. */
export const TURN_SILENCE_MS_QUESTION_END = 850;

/** How often to flush audio to Whisper while one continuous recording is open. */
export const AUDIO_CHUNK_MS = 2000;

export function turnSilenceMs(bufferText: string): number {
  const t = bufferText.trim();
  if (!t) return TURN_SILENCE_MS;
  if (t.endsWith("?")) return TURN_SILENCE_MS_QUESTION_END;
  if (/[.!]["']?\s*$/.test(t)) return 1200;
  return TURN_SILENCE_MS;
}
export const PROMOTE_COOLDOWN_MS = 5_000;
/** Auto-promote when lexical score is at or above this (and not duplicate / not in cooldown). */
export const AUTO_PROMOTE_SCORE = LEXICAL_MATCH_THRESHOLD_PREPARED;
const DUPLICATE_SIMILARITY = 0.82;
const MIN_WORDS_FOR_SPEECH = 3;

const FILLER_EXACT = new Set(
  [
    "thanks",
    "thank you",
    "great",
    "perfect",
    "okay",
    "ok",
    "sure",
    "yeah",
    "yep",
    "mm-hmm",
    "uh-huh",
    "got it",
    "makes sense",
    "sounds good",
    "awesome",
    "wonderful",
    "hi",
    "hello",
  ].map((s) => s.toLowerCase())
);

const FILLER_PREFIXES = [
  /^thanks for (joining|coming|your time)/i,
  /^how are you/i,
  /^let'?s (get started|begin|jump in)/i,
  /^we('re| are) (running short on time|almost out of time)/i,
  /^that('s| is) (helpful|great|good)/i,
  /^anything else/i,
  /^before we (wrap|go)/i,
  /^i('ll| will) (let you go|give you back)/i,
];

export type TurnAction = "ignore" | "candidate" | "promote";

export interface TurnClassification {
  action: TurnAction;
  reason: string;
  isFiller: boolean;
  isQuestionLike: boolean;
  bestMatch: LexicalMatchResult | null;
  score: number;
}

export function isFillerTurn(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  const lower = t.toLowerCase().replace(/[.!?]+$/, "");
  if (FILLER_EXACT.has(lower)) return true;
  if (t.split(/\s+/).length <= 2 && !t.includes("?")) {
    const words = lower.split(/\s+/);
    if (words.every((w) => FILLER_EXACT.has(w) || w.length <= 2)) return true;
  }
  return FILLER_PREFIXES.some((re) => re.test(t));
}

export interface ClassifyTurnOptions {
  library: LexicalQaRow[];
  currentPreparedQuestion?: string | null;
  lastPromoteAt?: number | null;
  cooldownMs?: number;
  /** When true, only return promote for very strong / clear new questions. */
  conservative?: boolean;
}

/**
 * After a full transcribed turn: always show the text; optionally surface a library hint for the user to accept.
 * No auto-promote, no filler discard.
 */
export function surfaceTurnSuggestion(text: string, library: LexicalQaRow[]): TurnClassification {
  const trimmed = text.trim();
  const questionLike = isLikelyQuestion(trimmed);
  const ranked = library.length ? rankPreparedQaLexical(trimmed, library) : [];
  const best = ranked[0] ?? null;
  const score = best?.score ?? 0;
  const reason =
    questionLike
      ? "question_phrasing"
      : score >= LEXICAL_MATCH_THRESHOLD_WEAK
        ? "library_match"
        : "review";

  return {
    action: "candidate",
    reason,
    isFiller: false,
    isQuestionLike: questionLike,
    bestMatch: best,
    score,
  };
}

export function classifyTurn(text: string, opts: ClassifyTurnOptions): TurnClassification {
  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (!trimmed) {
    return {
      action: "ignore",
      reason: "empty",
      isFiller: true,
      isQuestionLike: false,
      bestMatch: null,
      score: 0,
    };
  }

  if (isFillerTurn(trimmed)) {
    return {
      action: "ignore",
      reason: "filler",
      isFiller: true,
      isQuestionLike: false,
      bestMatch: null,
      score: 0,
    };
  }

  const questionLike = isLikelyQuestion(trimmed);
  const ranked = opts.library.length ? rankPreparedQaLexical(trimmed, opts.library) : [];
  const best = ranked[0] ?? null;
  const score = best?.score ?? 0;

  if (wordCount < MIN_WORDS_FOR_SPEECH && score < LEXICAL_MATCH_THRESHOLD_WEAK && !questionLike) {
    return {
      action: "ignore",
      reason: "too_short",
      isFiller: false,
      isQuestionLike: questionLike,
      bestMatch: best,
      score,
    };
  }

  const currentQ = opts.currentPreparedQuestion?.trim();
  if (currentQ) {
    const dup = scoreLexicalSimilarity(trimmed, currentQ);
    if (dup >= DUPLICATE_SIMILARITY) {
      return {
        action: "ignore",
        reason: "duplicate_of_current",
        isFiller: false,
        isQuestionLike: questionLike,
        bestMatch: best,
        score,
      };
    }
  }

  const cooldownMs = opts.cooldownMs ?? PROMOTE_COOLDOWN_MS;
  const last = opts.lastPromoteAt ?? 0;
  const inCooldown = last > 0 && Date.now() - last < cooldownMs;

  const strongEnough = score >= AUTO_PROMOTE_SCORE;
  const weakButQuestion = score >= LEXICAL_MATCH_THRESHOLD_WEAK && questionLike;
  const newQuestionVsCurrent =
    !currentQ ||
    !best ||
    scoreLexicalSimilarity(best.parentQuestion, currentQ) < DUPLICATE_SIMILARITY;

  if (strongEnough && newQuestionVsCurrent && !inCooldown) {
    return {
      action: "promote",
      reason: "strong_library_match",
      isFiller: false,
      isQuestionLike: questionLike,
      bestMatch: best,
      score,
    };
  }

  if (strongEnough && newQuestionVsCurrent && inCooldown) {
    return {
      action: "candidate",
      reason: "cooldown",
      isFiller: false,
      isQuestionLike: questionLike,
      bestMatch: best,
      score,
    };
  }

  if (weakButQuestion || (questionLike && score >= LEXICAL_MATCH_THRESHOLD_WEAK * 0.85)) {
    return {
      action: "candidate",
      reason: questionLike ? "question_phrasing" : "weak_match",
      isFiller: false,
      isQuestionLike: questionLike,
      bestMatch: best,
      score,
    };
  }

  if (questionLike && wordCount >= MIN_WORDS_FOR_SPEECH) {
    return {
      action: "candidate",
      reason: "unmatched_question",
      isFiller: false,
      isQuestionLike: true,
      bestMatch: best,
      score,
    };
  }

  if (opts.conservative) {
    return {
      action: "ignore",
      reason: "no_signal",
      isFiller: false,
      isQuestionLike: questionLike,
      bestMatch: best,
      score,
    };
  }

  return {
    action: "ignore",
    reason: "speech_only",
    isFiller: false,
    isQuestionLike: questionLike,
    bestMatch: best,
    score,
  };
}
