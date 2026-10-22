const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "you",
  "your",
  "me",
  "my",
  "i",
  "we",
  "our",
  "they",
  "their",
  "it",
  "its",
  "that",
  "this",
  "with",
  "from",
  "as",
  "by",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
]);

/** Minimum lexical score (0–1) to return a prepared script with confidence */
export const LEXICAL_MATCH_THRESHOLD_PREPARED = 0.38;
/** Below prepared but above this → return closest script with a review warning */
export const LEXICAL_MATCH_THRESHOLD_WEAK = 0.22;

export function tokenizeForMatch(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Token Jaccard similarity with light boosts for substring overlap (interview paraphrases).
 */
export function scoreLexicalSimilarity(spoken: string, candidate: string): number {
  const a = tokenizeForMatch(spoken);
  const b = tokenizeForMatch(candidate);
  if (a.length === 0 || b.length === 0) return 0;

  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const w of setA) {
    if (setB.has(w)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  let score = union > 0 ? intersection / union : 0;

  const joinedA = a.join(" ");
  const joinedB = b.join(" ");
  const shorter = joinedA.length <= joinedB.length ? joinedA : joinedB;
  const longer = joinedA.length > joinedB.length ? joinedA : joinedB;
  if (shorter.length >= 8 && longer.includes(shorter)) {
    score = Math.min(1, score + 0.12);
  }

  return score;
}

export interface PreparedFollowUp {
  question: string;
  answer: string;
}

export interface LexicalQaRow {
  id: string;
  question: string;
  answer: string;
  isPreferred?: boolean;
  followUps?: PreparedFollowUp[];
  category?: string | null;
}

export interface LexicalMatchResult {
  rowId: string;
  parentQuestion: string;
  matchQuestion: string;
  answer: string;
  score: number;
  kind: "main" | "follow_up";
  followUps: PreparedFollowUp[];
  isPreferred: boolean;
}

export function rankPreparedQaLexical(spoken: string, rows: LexicalQaRow[]): LexicalMatchResult[] {
  const results: LexicalMatchResult[] = [];

  for (const row of rows) {
    let mainScore = scoreLexicalSimilarity(spoken, row.question);
    if (row.isPreferred) mainScore = Math.min(1, mainScore + 0.04);

    results.push({
      rowId: row.id,
      parentQuestion: row.question,
      matchQuestion: row.question,
      answer: row.answer,
      score: mainScore,
      kind: "main",
      followUps: row.followUps ?? [],
      isPreferred: Boolean(row.isPreferred),
    });

    for (const fu of row.followUps ?? []) {
      let fuScore = scoreLexicalSimilarity(spoken, fu.question);
      if (row.isPreferred) fuScore = Math.min(1, fuScore + 0.02);
      results.push({
        rowId: row.id,
        parentQuestion: row.question,
        matchQuestion: fu.question,
        answer: fu.answer,
        score: fuScore,
        kind: "follow_up",
        followUps: row.followUps ?? [],
        isPreferred: Boolean(row.isPreferred),
      });
    }
  }

  return results.sort((x, y) => y.score - x.score);
}
