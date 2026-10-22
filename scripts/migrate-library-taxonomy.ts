/**
 * Classify seed Q&A into navigator metadata and emit a migration report.
 * Run: npm run migrate:library
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { enrichQaRow } from "../packages/shared/src/navigator/meta-inference";
import { navigatorMetaToPersisted } from "../packages/shared/src/navigator/navigator-meta-persist";
import { scoreLexicalSimilarity } from "../packages/shared/src/lexical-match";
import type { EnrichedQaRow } from "../packages/shared/src/navigator/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const outDir = resolve(root, "data/migration");

type SeedItem = {
  question: string;
  answer: string;
  category?: string;
  part?: number;
  notes?: string;
  isPreferred?: boolean;
  shortAnswer?: string;
  followUps?: unknown[];
};

const seed = JSON.parse(readFileSync(seedPath, "utf8")) as { preparedQa: SeedItem[] };

const enriched: EnrichedQaRow[] = seed.preparedQa.map((qa, i) =>
  enrichQaRow({
    id: `seed-${i}`,
    question: qa.question,
    answer: qa.answer,
    category: qa.category,
    part: qa.part,
    notes: qa.notes,
    isPreferred: qa.isPreferred,
    shortAnswer: qa.shortAnswer ?? null,
    sourceFile: "questrade-interview-full.json",
    followUps: [],
  })
);

const byModuleAfter = new Map<string, number>();
const moved: { question: string; from: string; to: string }[] = [];
const needsReview: { question: string; moduleId: string; reason: string }[] = [];
const duplicateCandidates: { a: string; b: string; score: number }[] = [];

for (const row of enriched) {
  const mod = row.navigator.experienceModuleId;
  byModuleAfter.set(mod, (byModuleAfter.get(mod) ?? 0) + 1);
  if (row.navigator.reviewStatus === "needs_review") {
    needsReview.push({
      question: row.question.slice(0, 80),
      moduleId: mod,
      reason: row.navigator.evidenceStatus,
    });
  }
  // Legacy bucket proxy: part 3-6 without company → was general-banking
  if ([3, 4, 5, 6].includes(row.navigator.part ?? 0) && mod !== "unclassified-review") {
    moved.push({
      question: row.question.slice(0, 60),
      from: "banking_strategy/general",
      to: mod,
    });
  }
}

for (let i = 0; i < enriched.length; i++) {
  for (let j = i + 1; j < enriched.length; j++) {
    const score = scoreLexicalSimilarity(enriched[i].question, enriched[j].question);
    if (score >= 0.88 && enriched[i].answer !== enriched[j].answer) {
      duplicateCandidates.push({
        a: enriched[i].question.slice(0, 50),
        b: enriched[j].question.slice(0, 50),
        score,
      });
    }
  }
}

const metaByQuestion: Record<string, ReturnType<typeof navigatorMetaToPersisted>> = {};
for (const row of enriched) {
  metaByQuestion[row.question] = {
    ...navigatorMetaToPersisted(row.navigator),
    shortAnswer: row.navigator.shortAnswer,
    sourceFile: row.navigator.sourceFile,
  };
}

mkdirSync(outDir, { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  counts: {
    beforeTotal: seed.preparedQa.length,
    afterTotal: enriched.length,
    byModuleAfter: Object.fromEntries(byModuleAfter),
    needsReview: needsReview.length,
    duplicateCandidates: duplicateCandidates.length,
  },
  movedBetweenCategories: moved.slice(0, 80),
  needsReview: needsReview.slice(0, 50),
  duplicateCandidates: duplicateCandidates.slice(0, 30),
  unclassified: enriched
    .filter((r) => r.navigator.experienceModuleId === "unclassified-review")
    .map((r) => r.question.slice(0, 80)),
};

writeFileSync(resolve(outDir, "taxonomy-report.json"), JSON.stringify(report, null, 2));
writeFileSync(resolve(outDir, "navigator-meta-by-question.json"), JSON.stringify(metaByQuestion, null, 2));

console.log("Migration report:", resolve(outDir, "taxonomy-report.json"));
console.log("Counts:", report.counts);
