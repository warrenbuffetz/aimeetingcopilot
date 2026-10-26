/**
 * Import approved follow-up expansion entries into seed + navigator meta.
 * Default: dry-run (writes preview only). Use --apply to mutate seed files.
 *
 * Prerequisite: node scripts/reconcile-followup-expansion-92.mjs
 *
 * Run: npx tsx scripts/import-followup-expansion-92.ts
 *      npx tsx scripts/import-followup-expansion-92.ts --apply
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import {
  canonicalModuleId,
  canonicalQuestionIntent,
  libraryCategoryFromSection,
} from "../packages/shared/src/navigator/module-id-map";
import type { InterviewRound, LibrarySection, RoundPriority } from "../packages/shared/src/navigator/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const apply = process.argv.includes("--apply");
const p0Only = process.argv.includes("--p0-only");

const expansionPath = resolve(
  root,
  "data/migration/questrade-followup-expansion-current-arcteryx.json"
);
const reconcilePath = resolve(root, "data/migration/followup-expansion-92-reconciliation.json");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const registryPath = resolve(root, "data/migration/import-registry-followup-expansion-92.json");
const reportPath = resolve(root, "data/migration/followup-expansion-92-import-report.json");
const previewPath = resolve(root, "data/migration/followup-expansion-92-import-preview.json");

type ExpansionEntry = {
  importKey: string;
  canonicalQuestion: string;
  fullAnswer: string;
  librarySection: LibrarySection;
  experienceModuleId: string;
  sourceParentId: string;
  sourceParentQuestion?: string;
  priority: string;
  evidenceType: string;
  suggestedRoundRelevance?: Record<string, RoundPriority>;
};

const EVIDENCE_MAP: Record<string, { evidenceStatus: string; reviewStatus: string }> = {
  scenario_framework: { evidenceStatus: "rehearsal_framework", reviewStatus: "needs_review" },
  resume_supported_review: { evidenceStatus: "resume_supported", reviewStatus: "needs_review" },
  needs_personal_example: { evidenceStatus: "unverified_detail", reviewStatus: "needs_review" },
};

/** User-approved: skip duplicate career row (covered by Sperro Q4 + Why leave Arc'teryx). */
const SKIP_IMPORT_KEYS = new Set(["followup-expansion-current-employer-bcf3c6da0f44f120"]);

/** User-approved: alias only — do not create a second canonical Q&A. */
const FORCE_ALIAS: Record<string, { attachToQuestion: string; aliasQuestion: string }> = {
  "followup-expansion-2026-10-d13d503e478400a0": {
    attachToQuestion: "Tell me about a product decision you got wrong.",
    aliasQuestion: "Tell me about a product decision you got wrong. What changed your mind?",
  },
};

function normalizeAnswer(s: string): string {
  return s.replace(/\r\n/g, "\n").trim();
}

function spokenPreview(answer: string, maxWords = 88): string {
  const words = answer.replace(/\s+/g, " ").trim().split(" ");
  return words.length <= maxWords ? words.join(" ") : `${words.slice(0, maxWords).join(" ")}…`;
}

function mapRoundRelevance(raw: Record<string, RoundPriority> | undefined) {
  const out: Partial<Record<InterviewRound, RoundPriority>> = {};
  if (!raw) return out;
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

function loadRegistry(): Record<string, { question: string; action: string; at: string; id?: string }> {
  try {
    return JSON.parse(readFileSync(registryPath, "utf8"));
  } catch {
    return {};
  }
}

const expansion = JSON.parse(readFileSync(expansionPath, "utf8")) as { entries: ExpansionEntry[] };
const reconcile = JSON.parse(readFileSync(reconcilePath, "utf8")) as {
  byCategory: { newDistinct: { importKey: string }[]; aliasCandidates: { importKey: string; attachToQuestion: string; suggestedAlias: string }[] };
  parentLinkPlan: { importKey: string; parentId: string; parentQuestion: string }[];
};

const newKeys = new Set(reconcile.byCategory.newDistinct.map((x) => x.importKey));
const aliasByKey = new Map(
  reconcile.byCategory.aliasCandidates.map((x) => [x.importKey, x])
);

const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
  preparedQa: Array<
    Record<string, unknown> & {
      id?: string;
      question: string;
      answer: string;
      followUps?: { question: string; answer: string }[];
    }
  >;
};
const meta: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(metaPath, "utf8"));
const registry = loadRegistry();

const inventory = JSON.parse(
  readFileSync(resolve(root, "docs/questrade-interview-ranked-inventory.json"), "utf8")
) as { records: { id: string; canonicalQuestion: string }[] };

const questionToId = new Map(
  inventory.records.map((r) => [r.canonicalQuestion.trim(), r.id])
);

function findQa(question: string) {
  return seed.preparedQa.find((q) => q.question.trim() === question.trim());
}

function mergeMeta(question: string, patch: Record<string, unknown>) {
  meta[question] = { ...(meta[question] ?? {}), ...patch };
}

function linkParent(parentQuestion: string, childId: string, childQuestion: string) {
  const parentId = questionToId.get(parentQuestion.trim());
  if (!parentId) return;
  const related = new Set<string>((meta[parentQuestion]?.relatedQuestionIds as string[]) ?? []);
  related.add(childId);
  mergeMeta(parentQuestion, { relatedQuestionIds: [...related] });
  mergeMeta(childQuestion, {
    canonicalQuestionId: parentId,
    relatedQuestionIds: parentId ? [parentId] : [],
  });
}

const report = {
  mode: apply ? "apply" : "dry-run",
  processed: 0,
  created: [] as string[],
  aliasesAdded: [] as string[],
  skipped: [] as string[],
  parentLinks: [] as { child: string; parent: string }[],
  embeddingCandidates: [] as string[],
};

for (const entry of expansion.entries) {
  if (p0Only && entry.priority !== "P0") continue;

  if (SKIP_IMPORT_KEYS.has(entry.importKey)) {
    report.skipped.push(`${entry.importKey}: skipped (user dedup — existing career answers)`);
    if (apply) {
      registry[entry.importKey] = {
        question: entry.canonicalQuestion,
        action: "skipped_dedup",
        at: new Date().toISOString(),
      };
    }
    continue;
  }

  const forcedAlias = FORCE_ALIAS[entry.importKey];
  if (forcedAlias) {
    report.processed += 1;
    const target = forcedAlias.attachToQuestion;
    if (!findQa(target)) {
      report.skipped.push(`${entry.importKey}: alias target missing (${target})`);
      continue;
    }
    const alt = new Set([
      ...((meta[target]?.altPhrasings as string[]) ?? []),
      forcedAlias.aliasQuestion,
      entry.canonicalQuestion.trim(),
    ]);
    if (apply) {
      mergeMeta(target, { altPhrasings: [...alt] });
      registry[entry.importKey] = {
        question: target,
        action: "alias_attached",
        at: new Date().toISOString(),
      };
    }
    report.aliasesAdded.push(entry.importKey);
    continue;
  }

  const alias = aliasByKey.get(entry.importKey);
  if (alias) {
    report.processed += 1;
    const parent = findQa(alias.attachToQuestion);
    if (!parent) {
      report.skipped.push(`${entry.importKey}: alias target missing`);
      continue;
    }
    const alt = new Set([
      ...((meta[alias.attachToQuestion]?.altPhrasings as string[]) ?? []),
      alias.suggestedAlias,
    ]);
    if (apply) {
      mergeMeta(alias.attachToQuestion, { altPhrasings: [...alt] });
      registry[entry.importKey] = {
        question: alias.attachToQuestion,
        action: "alias_attached",
        at: new Date().toISOString(),
      };
    }
    report.aliasesAdded.push(entry.importKey);
    continue;
  }

  if (!newKeys.has(entry.importKey)) {
    if (registry[entry.importKey]) continue;
    report.skipped.push(`${entry.importKey}: not in newDistinct reconciliation bucket`);
    continue;
  }

  if (registry[entry.importKey]?.action === "created") {
    report.skipped.push(`${entry.importKey}: already imported`);
    continue;
  }

  report.processed += 1;
  const answer = normalizeAnswer(entry.fullAnswer);
  const q = entry.canonicalQuestion.trim();
  if (findQa(q)) {
    report.skipped.push(`${entry.importKey}: question already in seed`);
    continue;
  }

  const childId = randomUUID();
  const moduleId = canonicalModuleId(entry.experienceModuleId);
  const intent = canonicalQuestionIntent("general");
  const roundRelevance = mapRoundRelevance(entry.suggestedRoundRelevance);
  const ev = EVIDENCE_MAP[entry.evidenceType] ?? {
    evidenceStatus: "unverified_detail",
    reviewStatus: "needs_review",
  };

  const metaPatch = {
    librarySection: entry.librarySection,
    libraryCategory: libraryCategoryFromSection(entry.librarySection),
    experienceModuleId: moduleId,
    intent,
    evidenceStatus: ev.evidenceStatus,
    reviewStatus: ev.reviewStatus,
    altPhrasings: [],
    topicTags: [`priority:${entry.priority}`, `parent:${entry.sourceParentId}`],
    importKey: entry.importKey,
    roundRelevance,
    primaryInterviewRound: primaryRound(roundRelevance),
    spokenAnswer: spokenPreview(answer),
    shortAnswer: spokenPreview(answer, 55),
    sourceFile: "questrade-followup-expansion-current-arcteryx.json",
    relatedQuestionIds: [entry.sourceParentId],
    canonicalQuestionId: entry.sourceParentId,
    expansionStatus: "draft_review_required",
  };

  const parentQ =
    entry.sourceParentQuestion ??
    inventory.records.find((r) => r.id === entry.sourceParentId)?.canonicalQuestion;

  if (apply) {
    seed.preparedQa.push({
      id: childId,
      question: q,
      answer,
      category: entry.librarySection.replace(/_/g, " "),
      part: entry.librarySection === "career_motivation" ? 1 : 9,
      isPreferred: entry.priority === "P0",
      notes: entry.importKey,
    });
    mergeMeta(q, metaPatch);
    if (parentQ) linkParent(parentQ, childId, q);
    registry[entry.importKey] = {
      question: q,
      action: "created",
      at: new Date().toISOString(),
      id: childId,
    };
  }

  report.created.push(entry.importKey);
  report.embeddingCandidates.push(q);
  if (parentQ) report.parentLinks.push({ child: q, parent: parentQ });
}

mkdirSync(resolve(root, "data/migration"), { recursive: true });

const fullReport = {
  ...report,
  at: new Date().toISOString(),
  seedCountAfter: apply ? seed.preparedQa.length : undefined,
  registryKeys: Object.keys(registry).length,
};

writeFileSync(previewPath, JSON.stringify(fullReport, null, 2) + "\n");
writeFileSync(reportPath, JSON.stringify(fullReport, null, 2) + "\n");

if (apply) {
  writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));
}

console.log(JSON.stringify(fullReport, null, 2));
if (!apply) {
  console.log("\nDry-run only. Re-run with --apply after reviewing reconciliation + import preview.");
}
