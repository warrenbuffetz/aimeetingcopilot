/**
 * Apply data/seed/questrade-56-library-assignments.json to navigator_meta (metadata only).
 * Run: npm run apply:56-classifications
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { EXPERIENCE_MODULES } from "../packages/shared/src/navigator/experience-modules";
import {
  canonicalModuleId,
  canonicalQuestionIntent,
  libraryCategoryFromSection,
  wasModuleRemapped,
} from "../packages/shared/src/navigator/module-id-map";
import type { LibrarySection } from "../packages/shared/src/navigator/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

type Assignment = {
  number: number;
  question: string;
  librarySection: LibrarySection;
  experienceModuleId: string;
  questionIntent: string;
  evidenceStatus: string;
  reviewStatus: "ok" | "needs_review";
};

const assignmentsPath = resolve(root, "data/seed/questrade-56-library-assignments.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const reportPath = resolve(root, "data/migration/apply-56-report.json");

const assignments = JSON.parse(readFileSync(assignmentsPath, "utf8")) as Assignment[];
const metaByQuestion: Record<string, Record<string, unknown>> = JSON.parse(
  readFileSync(metaPath, "utf8")
);
const seed = JSON.parse(readFileSync(seedPath, "utf8")) as { preparedQa: { question: string }[] };

const seedQuestions = new Set(seed.preparedQa.map((q) => q.question.trim()));

let updated = 0;
let unmatched: { number: number; question: string }[] = [];
const moduleMappings: { from: string; to: string; count: number }[] = [];
const mappingCounts = new Map<string, number>();

for (const row of assignments) {
  const q = row.question.trim();
  if (!seedQuestions.has(q)) {
    unmatched.push({ number: row.number, question: q });
    continue;
  }

  const originalModule = row.experienceModuleId;
  const moduleId = canonicalModuleId(originalModule);
  if (wasModuleRemapped(originalModule)) {
    mappingCounts.set(`${originalModule}→${moduleId}`, (mappingCounts.get(`${originalModule}→${moduleId}`) ?? 0) + 1);
  }

  const mod = EXPERIENCE_MODULES[moduleId];
  const intent = canonicalQuestionIntent(row.questionIntent);
  const librarySection = row.librarySection;
  const libraryCategory = libraryCategoryFromSection(librarySection);

  const prev = metaByQuestion[q] ?? {};
  const topicTags = Array.isArray(prev.topicTags) ? [...(prev.topicTags as string[])] : [];
  if (wasModuleRemapped(originalModule) && !topicTags.includes(`alias:${originalModule}`)) {
    topicTags.push(`alias:${originalModule}`);
  }

  metaByQuestion[q] = {
    ...prev,
    librarySection,
    libraryCategory,
    experienceModuleId: moduleId,
    experienceLabel: mod?.label ?? String(prev.experienceLabel ?? moduleId),
    intent,
    evidenceStatus: row.evidenceStatus,
    reviewStatus: row.reviewStatus,
    topicTags,
    classificationSource: "questrade-56-library-assignments.json",
    classificationNumber: row.number,
  };
  updated += 1;
}

for (const [key, count] of mappingCounts) {
  const [from, to] = key.split("→");
  moduleMappings.push({ from, to, count });
}

const stillNeedsReview = Object.values(metaByQuestion).filter((m) => m.reviewStatus === "needs_review").length;
const assigned56NeedsReview = assignments.filter((a) => a.reviewStatus === "needs_review").length;

mkdirSync(resolve(root, "data/migration"), { recursive: true });
writeFileSync(metaPath, JSON.stringify(metaByQuestion, null, 2));

const report = {
  appliedAt: new Date().toISOString(),
  source: "data/seed/questrade-56-library-assignments.json",
  successfullyUpdated: updated,
  unmatchedQuestions: unmatched,
  duplicateModuleMappings: moduleMappings,
  remainingReviewItemsInFullLibrary: stillNeedsReview,
  reviewItemsAmong56: assigned56NeedsReview,
  note: "Answer bodies and IDs unchanged; only navigator_meta updated for matched questions.",
};
writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
