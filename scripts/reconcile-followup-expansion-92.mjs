#!/usr/bin/env node
/**
 * Reconcile proposed follow-up expansion (92 entries) against seed + ranked inventory.
 * Does not modify seed. Writes JSON + Markdown reports under data/migration/.
 *
 * Usage: node scripts/reconcile-followup-expansion-92.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const expansionPath = resolve(
  root,
  "data/migration/questrade-followup-expansion-current-arcteryx.json"
);
const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
const inventoryPath = resolve(root, "docs/questrade-interview-ranked-inventory.json");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
const registryPath = resolve(root, "data/migration/import-registry-followup-expansion-92.json");

const SIM_ALIAS = 0.78;
const SIM_EQUIVALENT = 0.9;
const SIM_ANSWER_NEAR_DUP = 0.92;

const CAREER_CANONICAL = [
  "Tell me about yourself.",
  "Why are you looking to leave Arc'teryx?",
  "Why Questrade instead of continuing at Arc'teryx?",
  "What would it take for you to leave your current role?",
  "Why does joining Questrade during its expansion into banking appeal to you?",
  "Why move into everyday banking from rewards and loyalty?",
  "What are you currently working on at Arc'teryx?",
  "How would you manage transitioning away from an ongoing membership initiative?",
];

const FORBIDDEN_CAREER_PATTERNS = [
  { id: "left_arcteryx_jan_2026", re: /\b(january|jan\.?)\s*2026\b.*\b(left|leave|depart)/i },
  { id: "unemployed", re: /\b(unemployed|between jobs|between roles|career gap)\b/i },
  { id: "layoff", re: /\b(laid off|layoff|redundan)/i },
  { id: "past_tense_employment", re: /\b(i (left|was at) arc'?teryx)\b/i },
  {
    id: "membership_launched_claim",
    re: /\b(launched the (full )?membership|membership platform (is|was) live|platform launched successfully)\b/i,
  },
  {
    id: "funding_equals_adoption",
    re: /\b(\$5\.2\s*m(illion)?|5\.2m).*(adoption|roi|members signed up)/i,
  },
];

const EVIDENCE_MAP = {
  scenario_framework: { evidenceStatus: "rehearsal_framework", reviewStatus: "needs_review" },
  resume_supported_review: { evidenceStatus: "resume_supported", reviewStatus: "needs_review" },
  needs_personal_example: { evidenceStatus: "unverified_detail", reviewStatus: "needs_review" },
};

function tokenSet(s) {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^\w\s']/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  );
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "you",
  "your",
  "how",
  "what",
  "why",
  "did",
  "was",
  "were",
  "that",
  "this",
  "with",
  "from",
  "about",
  "have",
  "has",
  "had",
  "are",
  "our",
  "their",
]);

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

function normalizeQ(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeA(s) {
  return s.replace(/\r\n/g, "\n").trim();
}

function answerSim(a, b) {
  const x = normalizeA(a).slice(0, 2000);
  const y = normalizeA(b).slice(0, 2000);
  if (x === y) return 1;
  return jaccard(x, y);
}

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function scanCareerIssues(text) {
  const hits = [];
  for (const { id, re } of FORBIDDEN_CAREER_PATTERNS) {
    if (re.test(text)) hits.push(id);
  }
  return hits;
}

function proposedId(importKey) {
  return createHash("sha256").update(`followup-expansion-92:${importKey}`).digest("hex").slice(0, 8);
}

const expansion = loadJson(expansionPath, null);
if (!expansion?.entries?.length) {
  console.error("Missing expansion file:", expansionPath);
  process.exit(1);
}

const seed = loadJson(seedPath, { preparedQa: [] });
const inventory = loadJson(inventoryPath, { records: [] });
const meta = loadJson(metaPath, {});
const registry = loadJson(registryPath, {});

const idToQuestion = new Map();
const questionToId = new Map();
for (const r of inventory.records ?? []) {
  if (r.inactive) continue;
  idToQuestion.set(r.id, r.canonicalQuestion);
  questionToId.set(normalizeQ(r.canonicalQuestion), r.id);
}

const canonicalRows = [];
const embeddedRows = [];
for (const qa of seed.preparedQa ?? []) {
  canonicalRows.push({
    question: qa.question,
    answer: qa.answer,
    kind: "canonical",
    parent: null,
  });
  for (const fu of qa.followUps ?? []) {
    embeddedRows.push({
      question: fu.question,
      answer: fu.answer,
      kind: "embedded",
      parent: qa.question,
    });
  }
}

for (const r of inventory.records ?? []) {
  if (r.inactive) continue;
  if (!canonicalRows.some((c) => normalizeQ(c.question) === normalizeQ(r.canonicalQuestion))) {
    canonicalRows.push({
      question: r.canonicalQuestion,
      answer: r.fullAnswer ?? "",
      kind: "inventory_canonical",
      parent: null,
    });
  }
  for (const fu of r.embeddedFollowUps ?? []) {
    embeddedRows.push({
      question: fu.question,
      answer: fu.answer ?? "",
      kind: "inventory_embedded",
      parent: r.canonicalQuestion,
    });
  }
}

const allQuestions = [...canonicalRows, ...embeddedRows];

const byCategory = {
  newDistinct: [],
  existingEquivalent: [],
  aliasCandidates: [],
  embeddedEquivalent: [],
  unresolvedConflicts: [],
  needsFactualReview: [],
  alreadyImported: [],
};

const parentLinkPlan = [];
const gapProposals = [];

for (const entry of expansion.entries) {
  const q = entry.canonicalQuestion?.trim() ?? "";
  const a = normalizeA(entry.fullAnswer ?? "");
  const importKey = entry.importKey;
  const parentId = entry.sourceParentId;
  const parentQ =
    entry.sourceParentQuestion?.trim() ??
    idToQuestion.get(parentId) ??
    null;

  const item = {
    importKey,
    priority: entry.priority,
    evidenceType: entry.evidenceType,
    status: entry.status,
    canonicalQuestion: q,
    sourceParentId: parentId,
    sourceParentQuestion: parentQ,
    experienceModuleId: entry.experienceModuleId,
    librarySection: entry.librarySection,
    proposedMeta: EVIDENCE_MAP[entry.evidenceType] ?? {
      evidenceStatus: "unverified_detail",
      reviewStatus: "needs_review",
    },
  };

  if (registry[importKey]) {
    byCategory.alreadyImported.push({ ...item, registry: registry[importKey] });
    continue;
  }

  if (!parentId || !idToQuestion.has(parentId)) {
    byCategory.unresolvedConflicts.push({
      ...item,
      reason: "sourceParentId not found in active inventory records",
    });
    continue;
  }

  const seedParent = seed.preparedQa.find((x) => normalizeQ(x.question) === normalizeQ(parentQ ?? ""));
  if (!seedParent && parentQ) {
    byCategory.unresolvedConflicts.push({
      ...item,
      reason: "Parent question exists in inventory but not in seed file",
      parentQ,
    });
  }

  const careerFlags = scanCareerIssues(`${q}\n${a}`);
  if (entry.evidenceType === "needs_personal_example" || careerFlags.length) {
    byCategory.needsFactualReview.push({
      ...item,
      careerFlags,
      evidenceNote: entry.evidenceType,
    });
  }

  const exactCanon = canonicalRows.find((r) => normalizeQ(r.question) === normalizeQ(q));
  if (exactCanon) {
    const sameAnswer = answerSim(exactCanon.answer, a) >= SIM_ANSWER_NEAR_DUP;
    byCategory.existingEquivalent.push({
      ...item,
      matchedQuestion: exactCanon.question,
      sameAnswer,
      action: sameAnswer ? "meta_only_refresh" : "conflict_existing_answer",
    });
    if (!sameAnswer) {
      byCategory.unresolvedConflicts.push({
        ...item,
        reason: "Exact question text exists with different answer (do not auto-overwrite)",
        matchedQuestion: exactCanon.question,
      });
    }
    continue;
  }

  let best = { sim: 0, row: null, kind: null };
  for (const row of allQuestions) {
    const sim = jaccard(q, row.question);
    if (sim > best.sim) best = { sim, row, kind: row.kind };
  }

  if (best.sim >= SIM_EQUIVALENT && best.row) {
    const sameAnswer = answerSim(best.row.answer, a) >= SIM_ANSWER_NEAR_DUP;
    byCategory.existingEquivalent.push({
      ...item,
      matchedQuestion: best.row.question,
      matchedKind: best.row.kind,
      similarity: best.sim,
      sameAnswer,
      parent: best.row.parent,
    });
    if (!sameAnswer) {
      byCategory.unresolvedConflicts.push({
        ...item,
        reason: "High question similarity but materially different answer",
        matchedQuestion: best.row.question,
        similarity: best.sim,
      });
    }
    continue;
  }

  if (best.sim >= SIM_ALIAS && best.row?.kind === "canonical") {
    byCategory.aliasCandidates.push({
      ...item,
      attachToQuestion: best.row.question,
      similarity: best.sim,
      suggestedAlias: q,
    });
    continue;
  }

  const emb = embeddedRows.find((r) => normalizeQ(r.question) === normalizeQ(q));
  if (emb) {
    byCategory.embeddedEquivalent.push({
      ...item,
      parent: emb.parent,
      promoteToCanonical: answerSim(emb.answer, a) < SIM_ANSWER_NEAR_DUP,
    });
    continue;
  }

  byCategory.newDistinct.push(item);
  parentLinkPlan.push({
    importKey,
    childQuestion: q,
    parentId,
    parentQuestion: parentQ,
    relatedQuestionIds: [parentId],
    canonicalQuestionId: parentId,
  });
}

// Career audit on existing seed (proposals only)
const careerAudit = [];
for (const title of CAREER_CANONICAL) {
  const qa = seed.preparedQa.find((x) => normalizeQ(x.question) === normalizeQ(title));
  if (!qa) {
    careerAudit.push({ question: title, status: "missing_from_seed" });
    continue;
  }
  const flags = scanCareerIssues(qa.answer);
  const m = meta[qa.question.trim()] ?? {};
  careerAudit.push({
    question: title,
    id: questionToId.get(normalizeQ(title)) ?? null,
    careerFlags: flags,
    reviewStatus: m.reviewStatus ?? null,
    evidenceStatus: m.evidenceStatus ?? null,
    notes: flags.length ? "Review wording; do not auto-edit seed answer." : "No forbidden-pattern hits.",
  });
}

// Targeted gap audit (second-level probes not covered by proposed set)
const proposedNorm = new Set(expansion.entries.map((e) => normalizeQ(e.canonicalQuestion)));
const GAP_SEEDS = [
  {
    parentMatch: /walk me through the interac/i,
    missing: [
      "How did you prevent duplicate payouts?",
      "What if the Interac payout failed after the customer was debited?",
    ],
  },
  {
    parentMatch: /how would you manage transitioning/i,
    missing: ["What happens to the membership program if you leave?"],
  },
];

for (const g of GAP_SEEDS) {
  const parent = seed.preparedQa.find((x) => g.parentMatch.test(x.question));
  if (!parent) continue;
  for (const probe of g.missing) {
    const covered =
      proposedNorm.has(normalizeQ(probe)) ||
      (parent.followUps ?? []).some((fu) => jaccard(fu.question, probe) >= SIM_ALIAS) ||
      canonicalRows.some((r) => jaccard(r.question, probe) >= SIM_ALIAS);
    if (!covered) {
      gapProposals.push({
        suggestedQuestion: probe,
        suggestedParent: parent.question,
        rationale: "Realistic follow-up not in expansion batch or embedded follow-ups",
      });
    }
  }
}

const counts = {
  proposed: expansion.entries.length,
  p0: expansion.entries.filter((e) => e.priority === "P0").length,
  p1: expansion.entries.filter((e) => e.priority === "P1").length,
  newDistinct: byCategory.newDistinct.length,
  existingEquivalent: byCategory.existingEquivalent.length,
  aliasCandidates: byCategory.aliasCandidates.length,
  embeddedEquivalent: byCategory.embeddedEquivalent.length,
  unresolvedConflicts: byCategory.unresolvedConflicts.length,
  needsFactualReview: byCategory.needsFactualReview.length,
  alreadyImported: byCategory.alreadyImported.length,
  seedCanonicalCount: seed.preparedQa.length,
  embeddedFollowUpCount: embeddedRows.length,
};

const report = {
  generatedAt: new Date().toISOString(),
  expansionMeta: expansion.meta,
  counts,
  byCategory,
  parentLinkPlan,
  careerAudit,
  gapProposals,
  importReady: byCategory.unresolvedConflicts.length === 0,
  nextSteps: [
    "Review data/migration/followup-expansion-92-reconciliation.md",
    "Approve P0 newDistinct entries first",
    "Run: npx tsx scripts/import-followup-expansion-92.ts (dry-run) then --apply",
    "After apply: npm run embed:qa:gte for new/changed rows only",
  ],
};

mkdirSync(resolve(root, "data/migration"), { recursive: true });
const jsonOut = resolve(root, "data/migration/followup-expansion-92-reconciliation.json");
writeFileSync(jsonOut, JSON.stringify(report, null, 2) + "\n");

const md = renderMarkdown(report);
const mdOut = resolve(root, "data/migration/followup-expansion-92-reconciliation.md");
writeFileSync(mdOut, md);

console.log(JSON.stringify(counts, null, 2));
console.log("Wrote:", jsonOut);
console.log("Wrote:", mdOut);

function renderMarkdown(r) {
  const lines = [];
  lines.push("# Follow-up expansion reconciliation (92 proposed)");
  lines.push("");
  lines.push(`Generated: ${r.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  for (const [k, v] of Object.entries(r.counts)) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");
  lines.push(`**Import ready (no blocking conflicts):** ${r.importReady ? "yes" : "no — resolve conflicts first"}`);
  lines.push("");
  lines.push("## New distinct canonical Q&As");
  lines.push("");
  for (const x of r.byCategory.newDistinct) {
    lines.push(`- **${x.priority}** \`${x.importKey}\` — ${x.canonicalQuestion}`);
    lines.push(`  - Parent: ${x.sourceParentQuestion} (\`${x.sourceParentId}\`)`);
  }
  lines.push("");
  lines.push("## Alias candidates (attach phrasing, do not create row)");
  lines.push("");
  for (const x of r.byCategory.aliasCandidates) {
    lines.push(`- ${x.canonicalQuestion}`);
    lines.push(`  - → alias on: "${x.attachToQuestion}" (sim ${x.similarity.toFixed(2)})`);
  }
  lines.push("");
  lines.push("## Existing equivalents");
  lines.push("");
  for (const x of r.byCategory.existingEquivalent.slice(0, 40)) {
    lines.push(`- ${x.canonicalQuestion} → "${x.matchedQuestion}" (${x.sameAnswer ? "same answer" : "answer differs"})`);
  }
  if (r.byCategory.existingEquivalent.length > 40) {
    lines.push(`- … and ${r.byCategory.existingEquivalent.length - 40} more (see JSON)`);
  }
  lines.push("");
  lines.push("## Unresolved conflicts");
  lines.push("");
  for (const x of r.byCategory.unresolvedConflicts) {
    lines.push(`- ${x.canonicalQuestion}: ${x.reason}`);
  }
  lines.push("");
  lines.push("## Career answer consistency (existing seed — proposals only)");
  lines.push("");
  for (const c of r.careerAudit) {
    lines.push(`### ${c.question}`);
    lines.push(`- ${c.notes}`);
    if (c.careerFlags?.length) lines.push(`- Flags: ${c.careerFlags.join(", ")}`);
  }
  lines.push("");
  lines.push("## Remaining gap proposals");
  lines.push("");
  for (const g of r.gapProposals) {
    lines.push(`- **${g.suggestedQuestion}** (under: ${g.suggestedParent})`);
  }
  lines.push("");
  return lines.join("\n");
}
