/**
 * Apply data/migration/questrade-39-review-resolutions.json (answers + evidence + review).
 * Run: npm run apply:39-review-resolutions
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { canonicalModuleId, canonicalQuestionIntent } from "../packages/shared/src/navigator/module-id-map";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

type Resolution = {
  number: number;
  id?: string;
  question: string;
  experienceModuleId: string;
  experienceLabel?: string;
  librarySection?: string;
  questionIntent: string;
  evidenceStatus: string;
  reviewStatus: "ok" | "needs_review";
  seedKey?: string | null;
  part?: number | null;
  answer: string;
  editType?: string;
  replacesAnswer?: boolean;
  readyToApply?: boolean;
  reviewResolutionBasis?: string;
};

const resolutionsPath = resolve(root, "data/migration/questrade-39-review-resolutions.json");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const reportPath = resolve(root, "data/migration/apply-39-report.json");

const resolutions = JSON.parse(readFileSync(resolutionsPath, "utf8")) as Resolution[];
const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
  preparedQa: Array<Record<string, unknown> & { question: string; answer: string; notes?: string }>;
};
const metaByQuestion: Record<string, Record<string, unknown>> = JSON.parse(
  readFileSync(metaPath, "utf8")
);

const FULL_REPLACEMENT_NUMBERS = new Set([13, 15, 17, 27, 28]);

function normalizeText(s: string): string {
  return s.replace(/\r\n/g, "\n").trim();
}

function seedKeyFromNotes(notes?: string): string | null {
  if (!notes) return null;
  const m = notes.match(/^([A-Z]+-\d+)/);
  return m ? m[1].split("-")[0] : null;
}

function findPreparedQaIndex(res: Resolution): number {
  const moduleId = canonicalModuleId(res.experienceModuleId);
  const q = res.question.trim();

  const candidates: number[] = [];
  for (let i = 0; i < seed.preparedQa.length; i++) {
    const row = seed.preparedQa[i];
    if (row.question.trim() !== q) continue;
    const meta = metaByQuestion[q];
    const rowModule = meta?.experienceModuleId
      ? canonicalModuleId(String(meta.experienceModuleId))
      : null;
    if (rowModule === moduleId) candidates.push(i);
  }

  if (candidates.length === 1) return candidates[0];

  if (res.seedKey) {
    for (const i of candidates.length ? candidates : seed.preparedQa.map((_, i) => i)) {
      const row = seed.preparedQa[i];
      if (row.question.trim() !== q) continue;
      const sk = seedKeyFromNotes(row.notes);
      if (sk === res.seedKey) return i;
    }
  }

  if (res.part != null) {
    for (let i = 0; i < seed.preparedQa.length; i++) {
      const row = seed.preparedQa[i];
      if (row.question.trim() !== q && candidates.length === 0) continue;
      if (candidates.length && !candidates.includes(i)) continue;
      if (Number(row.part) === res.part) return i;
    }
  }

  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) return candidates[0];

  return seed.preparedQa.findIndex((row) => row.question.trim() === q);
}

const unmatched: Resolution[] = [];
const updated: Array<{
  number: number;
  question: string;
  experienceModuleId: string;
  reviewStatus: string;
  evidenceStatus: string;
  answerUpdated: boolean;
  editType?: string;
}> = [];

const fullReplacementResults: Array<{
  number: number;
  question: string;
  applied: boolean;
  reason?: string;
}> = [];

for (const res of resolutions) {
  if (!res.readyToApply) {
    unmatched.push(res);
    continue;
  }

  const idx = findPreparedQaIndex(res);
  if (idx < 0) {
    unmatched.push(res);
    continue;
  }

  const row = seed.preparedQa[idx];
  const q = row.question.trim();
  const moduleId = canonicalModuleId(res.experienceModuleId);
  const prevMeta = metaByQuestion[q] ?? {};
  const metaModule = prevMeta.experienceModuleId
    ? canonicalModuleId(String(prevMeta.experienceModuleId))
    : null;

  if (metaModule && metaModule !== moduleId) {
    unmatched.push({ ...res, question: `${res.question} (meta module ${metaModule} != ${moduleId})` });
    continue;
  }

  const patchAnswer = normalizeText(res.answer);
  const prevAnswer = normalizeText(row.answer);
  const answerChanged = patchAnswer !== prevAnswer;

  if (answerChanged) {
    row.answer = patchAnswer;
  }

  const intent = canonicalQuestionIntent(res.questionIntent);
  const nextMeta = {
    ...prevMeta,
    experienceModuleId: moduleId,
    experienceLabel: res.experienceLabel ?? prevMeta.experienceLabel,
    librarySection: res.librarySection ?? prevMeta.librarySection,
    intent,
    evidenceStatus: res.evidenceStatus,
    reviewStatus: "ok" as const,
    reviewResolutionBasis: res.reviewResolutionBasis,
    reviewResolvedAt: new Date().toISOString(),
    reviewResolutionNumber: res.number,
  };
  if (res.seedKey) nextMeta.seedKey = res.seedKey;
  if (res.part != null) nextMeta.part = res.part;

  metaByQuestion[q] = nextMeta;

  updated.push({
    number: res.number,
    question: q,
    experienceModuleId: moduleId,
    reviewStatus: "ok",
    evidenceStatus: res.evidenceStatus,
    answerUpdated: answerChanged,
    editType: res.editType,
  });

  if (FULL_REPLACEMENT_NUMBERS.has(res.number)) {
    const applied =
      normalizeText(row.answer) === patchAnswer &&
      res.editType === "full_answer_replacement";
    let reason: string | undefined;
    if (!applied) {
      reason = res.editType !== "full_answer_replacement"
        ? `expected editType full_answer_replacement, got ${res.editType}`
        : "answer text mismatch after write";
    }
    if (res.number === 15 && /##|section heading/i.test(row.answer)) {
      reason = "stray section heading may remain";
    }
    fullReplacementResults.push({
      number: res.number,
      question: q,
      applied: applied && !reason,
      reason,
    });
  }
}

writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
writeFileSync(metaPath, JSON.stringify(metaByQuestion, null, 2));
mkdirSync(resolve(root, "data/migration"), { recursive: true });

const remainingReview = Object.values(metaByQuestion).filter(
  (m) => m.reviewStatus === "needs_review"
).length;

const report = {
  appliedAt: new Date().toISOString(),
  source: "data/migration/questrade-39-review-resolutions.json",
  successfullyUpdated: updated.length,
  unmatched,
  updatedRecords: updated,
  fullAnswerReplacements: fullReplacementResults,
  allFiveFullReplacementsApplied:
    fullReplacementResults.length === 5 && fullReplacementResults.every((r) => r.applied),
  remainingNeedsReviewInLibrary: remainingReview,
};

writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
