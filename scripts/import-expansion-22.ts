/**
 * Idempotent import: data/seed/questrade-expansion-ai-22-qa-import.json
 * Run: npm run import:expansion-22
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

type ImportEntry = {
  importKey: string;
  sourceQuestionNumber: number;
  question: string;
  preparedAnswer: string;
  librarySection: LibrarySection;
  experienceModuleIdHint: string;
  questionIntentHint: string;
  evidenceStatusHint: string;
  reviewStatusHint: string;
  roundRelevance: Record<string, RoundPriority>;
  panelDisciplines: string[];
  alternatePhrasings: string[];
  topicTags: string[];
};

const MAIN_AI_QUESTION = "How are you using AI in your product management work?";
const WHY_QUESTRADE_QUESTION = "Why Questrade? Why this role?";

/** Import keys attached as follow-ups on MAIN_AI (still counted as processed). */
const AI_FOLLOW_UP_KEYS = new Set([
  "questrade-expansion-ai-2026-q09",
  "questrade-expansion-ai-2026-q10",
  "questrade-expansion-ai-2026-q22",
]);

/** Merge into existing canonical question instead of creating a new row. */
const MERGE_INTO_EXISTING: Record<string, string> = {
  "questrade-expansion-ai-2026-q04":
    "How would you convince existing Questrade investors to make Questbank their primary bank?",
  "questrade-expansion-ai-2026-q03":
    "How would you build product on top of Temenos core banking without owning the ledger?",
};

/** Supersede prior audit-only rows when canonical import replaces them. */
const SUPERSEDE_WHEN_IMPORTING: Record<string, string> = {
  "questrade-expansion-ai-2026-q01":
    "Why is Questbank expanding into everyday banking now, and what changes for product?",
};

const importPath = resolve(root, "data/seed/questrade-expansion-ai-22-qa-import.json");
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const registryPath = resolve(root, "data/migration/import-registry-expansion-22.json");
const reportPath = resolve(root, "data/migration/import-expansion-22-report.json");

const payload = JSON.parse(readFileSync(importPath, "utf8")) as {
  entries: ImportEntry[];
  supplementalTalkingPoints: {
    importKey: string;
    attachToImportKey: string;
    label: string;
    content: string;
  }[];
};

const seed = JSON.parse(readFileSync(seedPath, "utf8")) as {
  preparedQa: Array<Record<string, unknown> & { question: string; answer: string; followUps?: { question: string; answer: string }[] }>;
};
const meta: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(metaPath, "utf8"));
const registry: Record<string, { question: string; action: string; at: string }> = existsRegistry();

function existsRegistry() {
  try {
    return JSON.parse(readFileSync(registryPath, "utf8")) as Record<string, { question: string; action: string; at: string }>;
  } catch {
    return {};
  }
}

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

function findQa(question: string) {
  return seed.preparedQa.find((q) => q.question.trim() === question.trim());
}

function mergeMeta(question: string, patch: Record<string, unknown>) {
  meta[question] = { ...(meta[question] ?? {}), ...patch };
}

function upsertFollowUp(parentQuestion: string, fu: { question: string; answer: string }, importKey: string) {
  const parent = findQa(parentQuestion);
  if (!parent) return false;
  const list = parent.followUps ?? [];
  const exists = list.some((x) => x.question.trim() === fu.question.trim());
  if (!exists) list.push(fu);
  parent.followUps = list;
  const alt = (meta[parentQuestion]?.altPhrasings as string[]) ?? [];
  mergeMeta(parentQuestion, {
    altPhrasings: [...new Set([...alt, fu.question, ...(meta[parentQuestion]?.altPhrasings as string[] ?? [])])],
    relatedQuestionIds: meta[parentQuestion]?.relatedQuestionIds ?? [],
  });
  registry[importKey] = {
    question: parentQuestion,
    action: "follow_up_attached",
    at: new Date().toISOString(),
  };
  return true;
}

const report = {
  processed: 0,
  created: [] as string[],
  matched: [] as string[],
  followUpsAttached: [] as string[],
  proposedAnswerUpdates: [] as { importKey: string; question: string }[],
  superseded: [] as string[],
  unresolved: [] as string[],
  roundAssignments: [] as { importKey: string; roundRelevance: unknown }[],
};

for (const entry of payload.entries) {
  report.processed += 1;
  const answer = normalizeAnswer(entry.preparedAnswer);
  const moduleId = canonicalModuleId(entry.experienceModuleIdHint);
  const intent = canonicalQuestionIntent(entry.questionIntentHint);
  const roundRelevance = mapRoundRelevance(entry.roundRelevance);
  const metaPatch = {
    librarySection: entry.librarySection,
    libraryCategory: libraryCategoryFromSection(entry.librarySection),
    experienceModuleId: moduleId,
    intent,
    evidenceStatus: entry.evidenceStatusHint,
    reviewStatus: entry.reviewStatusHint,
    altPhrasings: entry.alternatePhrasings,
    topicTags: [...entry.topicTags, ...entry.panelDisciplines.map((d) => `panel:${d}`)],
    importKey: entry.importKey,
    roundRelevance,
    primaryInterviewRound: primaryRound(roundRelevance),
    spokenAnswer: spokenPreview(answer),
    shortAnswer: spokenPreview(answer, 55),
    sourceFile: "questrade-expansion-ai-22-qa-import.json",
    classificationSource: entry.importKey,
  };

  report.roundAssignments.push({ importKey: entry.importKey, roundRelevance });

  if (AI_FOLLOW_UP_KEYS.has(entry.importKey)) {
    if (upsertFollowUp(MAIN_AI_QUESTION, { question: entry.question, answer }, entry.importKey)) {
      report.followUpsAttached.push(entry.importKey);
      mergeMeta(MAIN_AI_QUESTION, {
        altPhrasings: [
          ...new Set([
            ...((meta[MAIN_AI_QUESTION]?.altPhrasings as string[]) ?? []),
            ...entry.alternatePhrasings,
            entry.question,
          ]),
        ],
      });
    } else {
      report.unresolved.push(entry.importKey);
    }
    continue;
  }

  if (registry[entry.importKey]?.question) {
    const regQ = registry[entry.importKey].question;
    if (findQa(regQ)) {
      mergeMeta(regQ, metaPatch);
      registry[entry.importKey] = { ...registry[entry.importKey], at: new Date().toISOString() };
      continue;
    }
  }

  const mergeTarget = MERGE_INTO_EXISTING[entry.importKey];
  if (mergeTarget) {
    const existing = findQa(mergeTarget);
    if (!existing) {
      report.unresolved.push(entry.importKey);
      continue;
    }
    const existingAnswer = normalizeAnswer(existing.answer);
    const alt = [
      ...new Set([
        ...((meta[mergeTarget]?.altPhrasings as string[]) ?? []),
        entry.question,
        ...entry.alternatePhrasings,
      ]),
    ];
    const firstPara = answer.split(/\n\n/)[0]?.trim() ?? "";
    const mergeAlreadyApplied =
      Boolean((meta[mergeTarget] as { answerMergeAppliedAt?: string })?.answerMergeAppliedAt) ||
      (firstPara.length > 0 && existingAnswer.includes(firstPara));
    if (existingAnswer !== answer && !mergeAlreadyApplied) {
      mergeMeta(mergeTarget, { ...metaPatch, altPhrasings: alt, proposedAnswerUpdate: answer });
      report.proposedAnswerUpdates.push({ importKey: entry.importKey, question: mergeTarget });
    } else {
      mergeMeta(mergeTarget, { ...metaPatch, altPhrasings: alt });
    }
    registry[entry.importKey] = { question: mergeTarget, action: "matched_existing", at: new Date().toISOString() };
    report.matched.push(entry.importKey);
    continue;
  }

  const existing = findQa(entry.question);
  if (existing) {
    mergeMeta(entry.question, metaPatch);
    registry[entry.importKey] = { question: entry.question, action: "matched_existing", at: new Date().toISOString() };
    report.matched.push(entry.importKey);
    continue;
  }

  const supersedeQ = SUPERSEDE_WHEN_IMPORTING[entry.importKey];
  if (supersedeQ && findQa(supersedeQ)) {
    mergeMeta(supersedeQ, {
      revisionStatus: "superseded",
      retrievalExcluded: true,
      supersededByQuestion: entry.question,
    });
    report.superseded.push(supersedeQ);
  }

  seed.preparedQa.push({
    question: entry.question,
    answer,
    category: entry.librarySection.replace(/_/g, " "),
    part: entry.librarySection === "career_motivation" ? 1 : entry.librarySection === "questrade_cases" ? 3 : 9,
    isPreferred: false,
    detect: entry.alternatePhrasings,
    notes: entry.importKey,
  });
  mergeMeta(entry.question, metaPatch);
  registry[entry.importKey] = { question: entry.question, action: "created", at: new Date().toISOString() };
  report.created.push(entry.importKey);
}

const supplemental = payload.supplementalTalkingPoints?.[0];
if (supplemental) {
  const label = "Optional: Mention Questrade's MCP strategy.";
  mergeMeta(WHY_QUESTRADE_QUESTION, {
    supplementalTalkingPoints: [
      {
        label,
        content: normalizeAnswer(supplemental.content),
        importKey: supplemental.importKey,
      },
    ],
  });
  registry[supplemental.importKey] = {
    question: WHY_QUESTRADE_QUESTION,
    action: "supplemental_attached",
    at: new Date().toISOString(),
  };
}

writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
writeFileSync(metaPath, JSON.stringify(meta, null, 2));
writeFileSync(registryPath, JSON.stringify(registry, null, 2));
mkdirSync(resolve(root, "data/migration"), { recursive: true });

const reviewRemaining = Object.values(meta).filter((m) => m.reviewStatus === "needs_review").length;

writeFileSync(
  reportPath,
  JSON.stringify(
    {
      appliedAt: new Date().toISOString(),
      seedCount: seed.preparedQa.length,
      ...report,
      registryKeys: Object.keys(registry).length,
      remainingReviewItems: reviewRemaining,
    },
    null,
    2
  )
);

console.log(JSON.stringify(report, null, 2));
