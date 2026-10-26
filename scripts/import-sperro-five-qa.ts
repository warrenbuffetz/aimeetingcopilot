/**
 * Import five reviewed Sperro / career / HBC Q&As into seed + navigator meta.
 * Run: npx tsx scripts/import-sperro-five-qa.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  canonicalModuleId,
  canonicalQuestionIntent,
  libraryCategoryFromSection,
} from "../packages/shared/src/navigator/module-id-map";
import type { InterviewRound, LibrarySection, RoundPriority } from "../packages/shared/src/navigator/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");

const importPath = resolve(root, "data/seed/questrade-sperro-five-qa-import.json");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const registryPath = resolve(root, "data/migration/import-registry-sperro-five-qa.json");
const reportPath = resolve(root, "data/migration/import-sperro-five-qa-report.json");

type Entry = {
  importKey: string;
  id: string;
  question: string;
  preparedAnswer: string;
  librarySection: LibrarySection;
  experienceModuleId: string;
  questionIntentHint: string;
  evidenceStatusHint: string;
  reviewStatusHint: string;
  alternatePhrasings: string[];
  roundRelevance: Record<string, RoundPriority>;
  relatedQuestionIds?: string[];
  canonicalQuestionId?: string;
  topicTags?: string[];
  isPreferred?: boolean;
  part?: number;
};

function normalizeAnswer(s: string): string {
  return s.replace(/\r\n/g, "\n").trim();
}

function spokenPreview(answer: string, maxWords = 88): string {
  const words = answer.replace(/\s+/g, " ").trim().split(" ");
  return words.length <= maxWords ? words.join(" ") : `${words.slice(0, maxWords).join(" ")}…`;
}

function mapRoundRelevance(raw: Record<string, RoundPriority>) {
  const out: Partial<Record<InterviewRound, RoundPriority>> = {};
  for (const [k, v] of Object.entries(raw)) {
    const round = k === "panel" ? "cross_functional_panel" : (k as InterviewRound);
    if (round === "recruiter" || round === "hiring_manager" || round === "cross_functional_panel") {
      out[round] = v;
    }
  }
  return out;
}

function primaryRound(rr: Partial<Record<InterviewRound, RoundPriority>>): InterviewRound | undefined {
  const order: InterviewRound[] = ["recruiter", "hiring_manager", "cross_functional_panel"];
  const weight = (p?: RoundPriority) =>
    p === "very_high" ? 4 : p === "high" ? 3 : p === "medium" ? 2 : p === "low" ? 1 : 0;
  let best: InterviewRound | undefined;
  let bestW = 0;
  for (const r of order) {
    const w = weight(rr[r]);
    if (w > bestW) {
      bestW = w;
      best = r;
    }
  }
  return best;
}

function loadRegistry(): Record<string, { question: string; id: string; action: string; at: string }> {
  try {
    return JSON.parse(readFileSync(registryPath, "utf8"));
  } catch {
    return {};
  }
}

const payload = JSON.parse(readFileSync(importPath, "utf8")) as {
  entries: Entry[];
  metaPatches?: Record<string, { relatedQuestionIdsAppend?: string[] }>;
};

const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
  preparedQa: Array<{
    id?: string;
    question: string;
    answer: string;
    category?: string;
    part?: number;
    isPreferred?: boolean;
    detect?: string[];
    notes?: string;
  }>;
};
const meta: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(metaPath, "utf8"));
const registry = loadRegistry();

const report = {
  mode: apply ? "apply" : "dry-run",
  created: [] as string[],
  updated: [] as string[],
  skipped: [] as string[],
  conflicts: [] as { importKey: string; question: string; reason: string }[],
  parentLinks: [] as { child: string; parentId?: string }[],
  recordIds: {} as Record<string, string>,
  embeddingsNeeded: [] as string[],
};

function findByQuestion(q: string) {
  return seed.preparedQa.find((x) => x.question.trim() === q.trim());
}

function findById(id: string) {
  return seed.preparedQa.find((x) => x.id === id);
}

function mergeMeta(question: string, patch: Record<string, unknown>) {
  meta[question] = { ...(meta[question] ?? {}), ...patch };
}

function upsertEntry(entry: Entry) {
  const q = entry.question.trim();
  const answer = normalizeAnswer(entry.preparedAnswer);
  const existingByQ = findByQuestion(q);
  const existingById = findById(entry.id);
  const roundRelevance = mapRoundRelevance(entry.roundRelevance);
  const moduleId = canonicalModuleId(entry.experienceModuleId);
  const intent = canonicalQuestionIntent(entry.questionIntentHint);

  if (existingByQ && existingById && existingByQ.question !== existingById.question) {
    report.conflicts.push(`${entry.importKey}: id and question mismatch in seed`);
    return;
  }

  const target = existingByQ ?? existingById;
  if (target && normalizeAnswer(target.answer) !== answer) {
    const reg = registry[entry.importKey];
    if (reg?.action === "created" && reg.question === q) {
      report.updated.push(entry.importKey);
    } else if (
      target &&
      normalizeAnswer(target.answer) !== answer &&
      target.answer.length > 50 &&
      !target.notes?.includes(entry.importKey)
    ) {
      report.conflicts.push({
        importKey: entry.importKey,
        question: q,
        reason: "existing answer differs; manual review required",
      });
      return;
    }
  }

  const metaPatch: Record<string, unknown> = {
    librarySection: entry.librarySection,
    libraryCategory: libraryCategoryFromSection(entry.librarySection),
    experienceModuleId: moduleId,
    intent,
    evidenceStatus: entry.evidenceStatusHint,
    reviewStatus: entry.reviewStatusHint,
    altPhrasings: entry.alternatePhrasings,
    topicTags: [...(entry.topicTags ?? []), entry.importKey, "sperro-five-qa-2026"],
    importKey: entry.importKey,
    roundRelevance,
    primaryInterviewRound: primaryRound(roundRelevance),
    spokenAnswer: spokenPreview(answer),
    shortAnswer: spokenPreview(answer, 55),
    sourceFile: "questrade-sperro-five-qa-import.json",
    relatedQuestionIds: entry.relatedQuestionIds ?? [],
  };
  if (entry.canonicalQuestionId) {
    metaPatch.canonicalQuestionId = entry.canonicalQuestionId;
  }

  report.recordIds[entry.importKey] = entry.id;

  if (!target) {
    if (!apply) {
      report.created.push(entry.importKey);
      report.embeddingsNeeded.push(q);
      if (entry.canonicalQuestionId) {
        report.parentLinks.push({ child: q, parentId: entry.canonicalQuestionId });
      }
      return;
    }
    seed.preparedQa.push({
      id: entry.id,
      question: q,
      answer,
      category: entry.librarySection.replace(/_/g, " "),
      part: entry.part ?? 1,
      isPreferred: entry.isPreferred ?? false,
      detect: entry.alternatePhrasings,
      notes: entry.importKey,
    });
    mergeMeta(q, metaPatch);
    registry[entry.importKey] = { question: q, id: entry.id, action: "created", at: new Date().toISOString() };
    report.created.push(entry.importKey);
    report.embeddingsNeeded.push(q);
  } else {
    if (!apply) {
      report.updated.push(entry.importKey);
      report.embeddingsNeeded.push(q);
      return;
    }
    target.id = entry.id;
    target.answer = answer;
    target.detect = entry.alternatePhrasings;
    target.notes = entry.importKey;
    target.isPreferred = entry.isPreferred ?? target.isPreferred;
    mergeMeta(q, metaPatch);
    registry[entry.importKey] = {
      question: q,
      id: entry.id,
      action: "updated",
      at: new Date().toISOString(),
    };
    report.updated.push(entry.importKey);
    report.embeddingsNeeded.push(q);
  }

  if (entry.canonicalQuestionId) {
    report.parentLinks.push({ child: q, parentId: entry.canonicalQuestionId });
  }
}

for (const entry of payload.entries) {
  upsertEntry(entry);
}

const INVENTORY_ID_TO_QUESTION: Record<string, string> = {
  "2f3a780e-6b54-42b8-b56d-8936a471fa68": "Tell me about yourself.",
  "439ccf45-857e-431f-ab0e-1312d6998f02": "How did you secure $5.2 million in capital funding at Arc'teryx?",
  "a85b536e-5e20-468f-87d9-fb447ae796f6":
    "Why did you choose a headless membership platform rather than building everything internally?",
  "2a1ed160-bfa6-4f2a-91ea-d280a3ef0418": "Tell me about something you took from an idea into a product.",
  "f9022f65-91fb-4094-ae8f-b4dc87edcca7": "What did you personally decide or deprioritize?",
  "28571e7f-620f-4880-9cd7-cdfc2e146aa8": "Why are you looking to leave Arc'teryx?",
  "92a7cf55-18dc-4d94-93d7-db3303028b9b": "Did Quests reach six million active credit cardholders?",
  "15aa03e2-46af-4d60-9d73-90ed342c6ccc": "Tell me about a product initiative that didn't go according to plan.",
};

function appendRelated(questionKey: string, id: string) {
  if (!meta[questionKey]) return;
  const rel = new Set<string>((meta[questionKey].relatedQuestionIds as string[]) ?? []);
  rel.add(id);
  mergeMeta(questionKey, { relatedQuestionIds: [...rel] });
}

function appendRelatedByUuid(uuid: string, id: string) {
  const q = INVENTORY_ID_TO_QUESTION[uuid] ?? payload.entries.find((e) => e.id === uuid)?.question;
  if (q) appendRelated(q, id);
}

if (apply) {
  const [q1, q2, q4, q5] = payload.entries;
  mergeMeta(q1.question, { relatedQuestionIds: q1.relatedQuestionIds, canonicalQuestionId: undefined });
  for (const pid of q1.relatedQuestionIds ?? []) appendRelatedByUuid(pid, q1.id);
  appendRelated(q1.question, q2.id);
  appendRelated(q2.question, q4.id);
  appendRelated(q4.question, q5.id);
  appendRelated(q1.question, q4.id);
  appendRelated(q1.question, q5.id);

  if (payload.metaPatches) {
    for (const [question, patch] of Object.entries(payload.metaPatches)) {
      for (const id of patch.relatedQuestionIdsAppend ?? []) appendRelated(question, id);
    }
  }
}

mkdirSync(resolve(root, "data/migration"), { recursive: true });
report.at = new Date().toISOString();

if (apply) {
  writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (!apply) console.log("\nDry-run. Re-run with --apply to write seed + meta.");
