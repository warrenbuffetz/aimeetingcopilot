import { amenaAskQuestions, type AmenaQuestion } from "./dataset";

export type AmenaSearchHit = {
  questionId: string;
  followUpId: string | null;
  label: string;
  detail: string;
  score: number;
  kind: "question" | "follow-up";
};

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "of",
  "and",
  "or",
  "you",
  "your",
  "how",
  "what",
  "would",
  "me",
  "i",
  "do",
  "with",
  "for",
  "in",
  "on",
  "is",
  "it",
  "if",
  "my",
  "about",
  "tell",
  "walk",
]);

/** Query phrase -> extra phrases scored only against titles, labels, aliases, tags, and follow-up questions. */
const EXPANSIONS: [string, string[]][] = [
  ["cashback", ["interac", "withdrawal", "avion"]],
  ["interac", ["cashback", "withdrawal", "timeout"]],
  ["timeout", ["paid twice", "double pay", "idempotency"]],
  ["double pay", ["timeout", "paid twice"]],
  ["mvp", ["prioritization", "membership", "web-first"]],
  ["membership", ["arcteryx", "mvp"]],
  ["activation", ["hbc", "incremental", "lifetime value"]],
  ["neo", ["hbc", "application", "conversion"]],
  ["approval", ["credit losses", "delinquency", "risk"]],
  ["delinquency", ["credit losses", "approval"]],
  ["checkout", ["conversion", "financing", "merchant"]],
  ["merchant", ["checkout", "financing", "conversion"]],
  ["financing", ["flexiti", "checkout", "approval"]],
  ["everyday banking", ["questrade", "flexiti"]],
  ["questrade", ["everyday banking", "flexiti"]],
  ["influence", ["without authority", "standards"]],
  ["aeroplan", ["air canada", "partnerships", "acquisition"]],
];

const MAX_RESULTS = 7;

export function foldAmenaText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/['']/g, "")
    .replace(/&/g, " and ")
    .replace(/[/-]/g, " ")
    .replace(/[^a-z0-9\s.+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokensOf(folded: string): string[] {
  return folded.split(" ").filter((token) => token.length >= 2 && !STOPWORDS.has(token) && !/^\d$/.test(token));
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, index) => index);
  let previous = prev;
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min((current[j - 1] ?? 0) + 1, (previous[j] ?? 0) + 1, (previous[j - 1] ?? 0) + cost);
    }
    previous = current;
  }
  return previous[b.length] ?? 2;
}

function phraseScore(query: string, field: string, weight: number): number {
  if (!query || !field) return 0;
  if (field === query) return weight + 30;
  if (field.includes(query)) return weight;
  return 0;
}

function tokenScore(queryTokens: string[], field: string, weight: number): number {
  if (!queryTokens.length || !field) return 0;
  const words = field.split(" ");
  let score = 0;
  for (const token of queryTokens) {
    if (field.includes(token)) {
      score += weight;
      continue;
    }
    if (token.length < 5) continue;
    if (words.some((word) => word.length >= 5 && levenshtein(token, word) <= 1)) score += Math.round(weight * 0.7);
  }
  return score;
}

type Field = { text: string; weight: number; followUpId?: string };

function scoreFields(query: string, queryTokens: string[], fields: Field[]): number {
  return fields.reduce((sum, field) => {
    const folded = foldAmenaText(field.text);
    return sum + phraseScore(query, folded, field.weight) + tokenScore(queryTokens, folded, Math.round(field.weight / 5));
  }, 0);
}

export function searchAmenaQuestions(questions: readonly AmenaQuestion[], rawQuery: string): AmenaSearchHit[] {
  const query = foldAmenaText(rawQuery);
  if (query.length < 2) return [];
  const queryTokens = tokensOf(query);
  if (!queryTokens.length && query.length < 8) return [];

  const expansions = EXPANSIONS.filter(([needle]) => query === needle || query.includes(needle))
    .flatMap(([, extras]) => extras)
    .map((extra) => foldAmenaText(extra))
    .filter((extra) => extra && extra !== query);

  const hits: AmenaSearchHit[] = [];
  for (const question of questions) {
    const parentFields: Field[] = [
      { text: question.title, weight: 120 },
      { text: question.navigationLabel, weight: 110 },
      { text: question.shortLabel, weight: 100 },
      ...question.aliases.map((alias) => ({ text: alias, weight: 100 })),
      ...question.projectTags.map((tag) => ({ text: tag, weight: 70 })),
      { text: question.category, weight: 36 },
    ];
    const corpus = foldAmenaText(
      [question.title, question.navigationLabel, question.shortLabel, ...question.aliases, ...question.projectTags, ...question.followUps.map((follow) => follow.question)].join(" ")
    );
    const covered = queryTokens.filter((token) => {
      if (corpus.includes(token)) return true;
      if (token.length < 5) return false;
      return corpus.split(" ").some((word) => word.length >= 5 && levenshtein(token, word) <= 1);
    });
    let parentScore = scoreFields(query, queryTokens, parentFields);
    if (queryTokens.length >= 2 && covered.length === queryTokens.length) parentScore += 36 + queryTokens.length * 8;
    for (const extra of expansions) {
      parentScore += scoreFields(extra, tokensOf(extra), parentFields.map((field) => ({
        ...field,
        weight: Math.round(field.weight * 0.72),
      })));
    }
    if (query.length >= 8) {
      parentScore += phraseScore(query, foldAmenaText(question.answer), 18);
    }

    let bestFollowUp: { id: string; score: number; question: string } | null = null;
    for (const follow of question.followUps) {
      const followFields: Field[] = [{ text: follow.question, weight: 96 }];
      let followScore = scoreFields(query, queryTokens, followFields);
      for (const extra of expansions) {
        followScore += scoreFields(extra, tokensOf(extra), [{ text: follow.question, weight: 70 }]);
      }
      if (query.length >= 8) followScore += phraseScore(query, foldAmenaText(follow.answer), 22);
      if (!bestFollowUp || followScore > bestFollowUp.score) {
        bestFollowUp = { id: follow.id, score: followScore, question: follow.question };
      }
    }

    const followScore = bestFollowUp?.score ?? 0;
    const score = Math.max(parentScore, followScore) + (question.suggestedPinned ? 6 : 0) + (question.priority === 1 ? 3 : 0);
    if (score < 48) continue;
    const openFollowUp = Boolean(bestFollowUp && followScore >= 80 && followScore + 12 >= parentScore);
    hits.push({
      questionId: question.id,
      followUpId: openFollowUp && bestFollowUp ? bestFollowUp.id : null,
      label: openFollowUp && bestFollowUp ? bestFollowUp.question : question.shortLabel,
      detail: openFollowUp ? question.shortLabel : question.category,
      score,
      kind: openFollowUp ? "follow-up" : "question",
    });
  }

  hits.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  if (!hits.length) return [];
  const best = hits[0]!.score;
  const floor = Math.max(48, Math.round(best * 0.56));
  return hits.filter((hit) => hit.score >= floor).slice(0, MAX_RESULTS);
}

export function searchAsksForAmena(query: string): boolean {
  const folded = foldAmenaText(query);
  if (!folded) return false;
  if (folded.includes("questions for amena") || folded === "amena" || folded.includes("ask amena")) return true;
  if (folded.length < 6) return false;
  return amenaAskQuestions.some((item) => {
    const text = foldAmenaText(
      [item.topic, item.question, ...item.followUps.map((follow) => follow.question)].join(" ")
    );
    return text.includes(folded);
  });
}
