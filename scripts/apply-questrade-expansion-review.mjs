#!/usr/bin/env node
/**
 * Apply expansion review metadata, Arc canonical fix, Q5 aliases, P0 alt phrasings.
 * Usage: node scripts/apply-questrade-expansion-review.mjs [--dry-run|--apply]
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const dryRun = !apply || process.argv.includes("--dry-run");

const paths = {
  seed: resolve(root, "data/seed/questrade-interview-full.json"),
  meta: resolve(root, "data/migration/navigator-meta-by-question.json"),
  registry: resolve(root, "data/migration/import-registry-followup-expansion-92.json"),
  review: resolve(root, "data/migration/questrade-expansion-92-review-proposed.json"),
  arcProposal: resolve(root, "data/migration/questrade-arc-current-status-answer-proposal.json"),
  q5Proposal: resolve(root, "data/migration/questrade-membership-transition-alias-proposal.json"),
  altProposal: resolve(root, "data/migration/expansion-alt-phrasings-proposed.json"),
  report: resolve(root, "data/migration/apply-questrade-expansion-review-report.json"),
  backupDir: resolve(root, "data/migration/backups"),
};

const SPERRO_PROTECTED = new Set([
  "What are you currently working on at Arc'teryx?",
  "How did you decide what to include in the smaller Sperro SV release?",
  "Tell me about a product decision you got wrong.",
  "You've secured a significant investment and are still building the product. Why would you leave before seeing it launch?",
  "How would you manage transitioning away from an ongoing membership initiative?",
]);

const SKIP_REVIEW_KEYS = new Set([
  "followup-expansion-current-employer-bcf3c6da0f44f120",
  "followup-expansion-2026-10-d13d503e478400a0",
]);

const SKIPPED_CAREER_ALT_TARGETS = [
  "Why are you looking to leave Arc'teryx?",
  "You've secured a significant investment and are still building the product. Why would you leave before seeing it launch?",
  "Why Questrade instead of continuing at Arc'teryx?",
];

function normalizePhrase(s) {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function mergePhrases(existing, additions) {
  const out = [];
  const seen = new Set();
  for (const p of [...(existing ?? []), ...additions]) {
    const t = String(p).trim();
    if (t.length < 3) continue;
    const n = normalizePhrase(t);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(t);
  }
  return out;
}

function loadJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

const seed = loadJson(paths.seed);
const meta = loadJson(paths.meta);
const registry = loadJson(paths.registry);
const review = loadJson(paths.review);
const arcProposal = loadJson(paths.arcProposal);
const q5Proposal = loadJson(paths.q5Proposal);
const altProposal = loadJson(paths.altProposal);

const report = {
  mode: apply ? "apply" : "dry-run",
  at: new Date().toISOString(),
  reviewStatusChanges: [],
  reviewUnchanged: [],
  reviewSkipped: [],
  arcMigration: null,
  q5Aliases: { added: 0, phrases: [] },
  p0Alts: { byImportKey: [], aliasesSkippedDuplicate: 0, collisions: [] },
  registryMismatches: [],
  embedCandidateIds: new Set(),
  errors: [],
};

const canonicalQuestions = new Set(seed.preparedQa.map((q) => q.question.trim()));

function findSeedByQuestion(q) {
  return seed.preparedQa.find((x) => x.question.trim() === q.trim());
}

function findSeedById(id) {
  return seed.preparedQa.find((x) => x.id === id);
}

function mergeMeta(question, patch) {
  meta[question] = { ...(meta[question] ?? {}), ...patch };
}

function migrateMetaKey(oldQ, newQ) {
  if (oldQ === newQ) return;
  if (!meta[oldQ]) {
    report.errors.push(`migrateMetaKey: missing old meta for ${oldQ}`);
    return;
  }
  if (meta[newQ]) {
    meta[newQ] = { ...meta[newQ], ...meta[oldQ] };
  } else {
    meta[newQ] = { ...meta[oldQ] };
  }
  delete meta[oldQ];
}

function addDetect(seedRow, phrases) {
  seedRow.detect = mergePhrases(seedRow.detect ?? [], phrases);
}

function resolveLiveQuestion(importKey) {
  const reg = registry[importKey];
  if (!reg) return { type: "missing", question: null };
  if (reg.action === "skipped_dedup") return { type: "skipped", question: null };
  if (reg.action === "alias_attached") return { type: "alias", question: reg.question };
  if (reg.action === "created") return { type: "created", question: reg.question, id: reg.id };
  return { type: reg.action, question: reg.question, id: reg.id };
}

// --- 1. Arc canonical migration ---
const arcOld = arcProposal.oldQuestion.trim();
const arcNew = arcProposal.proposedCanonicalQuestion.trim();
const arcRow = findSeedByQuestion(arcOld) ?? findSeedById(registry[arcProposal.importKey]?.id);
if (!arcRow) {
  report.errors.push("Arc migration: seed row not found for old question");
} else {
  report.arcMigration = {
    importKey: arcProposal.importKey,
    id: arcRow.id,
    oldQuestion: arcOld,
    newQuestion: arcNew,
    reviewStatus: "needs_review",
  };
  if (apply) {
    if (SPERRO_PROTECTED.has(arcOld)) report.errors.push("Arc old question unexpectedly in SPERRO_PROTECTED");
    arcRow.question = arcNew;
    arcRow.answer = arcProposal.proposedFullAnswer.trim();
    migrateMetaKey(arcOld, arcNew);
    mergeMeta(arcNew, {
      reviewStatus: "needs_review",
      evidenceStatus: meta[arcNew]?.evidenceStatus ?? "resume_supported",
      expansionStatus: undefined,
      arcStatusCorrectionAt: new Date().toISOString(),
      arcStatusCorrectionNote: arcProposal.note,
    });
    if (meta[arcNew].expansionStatus) delete meta[arcNew].expansionStatus;
    registry[arcProposal.importKey].question = arcNew;
  }
  report.embedCandidateIds.add(arcRow.id);
  canonicalQuestions.delete(arcOld);
  canonicalQuestions.add(arcNew);
}

// --- 2. Review metadata (90 created rows) ---
for (const entry of review.entries) {
  const importKey = entry.importKey;
  if (SKIP_REVIEW_KEYS.has(importKey)) {
    report.reviewSkipped.push({ importKey, reason: "skipped or alias-only per policy" });
    continue;
  }
  const live = resolveLiveQuestion(importKey);
  if (live.type === "missing") {
    report.registryMismatches.push({ importKey, issue: "not in registry" });
    continue;
  }
  if (live.type === "skipped") {
    report.reviewSkipped.push({ importKey, reason: "skipped_dedup in registry" });
    continue;
  }
  if (live.type === "alias") {
    report.reviewSkipped.push({ importKey, reason: "alias_attached — canonical Q3 unchanged" });
    continue;
  }

  let question = live.question?.trim();
  if (importKey === arcProposal.importKey) question = arcNew;

  const seedRow = findSeedByQuestion(question);
  if (!seedRow) {
    report.registryMismatches.push({ importKey, issue: `seed missing: ${question}` });
    continue;
  }
  if (SPERRO_PROTECTED.has(question)) {
    report.reviewSkipped.push({ importKey, question, reason: "Sperro five-pack protected" });
    continue;
  }

  const proposedReview = entry.decision === "ok" ? "ok" : "needs_review";
  const proposedEvidence = entry.proposedEvidenceStatus ?? meta[question]?.evidenceStatus;

  if (importKey === arcProposal.importKey) {
    report.reviewStatusChanges.push({
      importKey,
      question,
      reviewStatus: "needs_review",
      evidenceStatus: proposedEvidence,
      note: "Arc rewrite — content flagged pending user approval",
    });
    if (apply) {
      mergeMeta(question, {
        reviewStatus: "needs_review",
        evidenceStatus: proposedEvidence,
      });
      delete meta[question]?.expansionStatus;
    }
    continue;
  }

  const prev = meta[question]?.reviewStatus;
  if (prev === proposedReview && proposedReview === "ok" && !meta[question]?.expansionStatus) {
    report.reviewUnchanged.push({ importKey, question });
    continue;
  }

  report.reviewStatusChanges.push({
    importKey,
    question,
    reviewStatus: proposedReview,
    evidenceStatus: proposedEvidence,
    from: prev,
  });

  if (apply) {
    const patch = {
      reviewStatus: proposedReview,
      evidenceStatus: proposedEvidence,
    };
    if (proposedReview === "ok") {
      patch.expansionStatus = undefined;
      if (meta[question]?.expansionStatus) delete meta[question].expansionStatus;
    }
    mergeMeta(question, patch);
  }
}

// --- 3. Q5 aliases ---
const q5Q = q5Proposal.targetCanonicalQuestion.trim();
const q5Row = findSeedById(q5Proposal.targetPreparedQaId) ?? findSeedByQuestion(q5Q);
if (!q5Row) {
  report.errors.push("Q5 target not found");
} else {
  const before = (meta[q5Q]?.altPhrasings ?? []).length;
  const merged = mergePhrases(meta[q5Q]?.altPhrasings, q5Proposal.altPhrasings);
  const added = merged.length - before;
  report.q5Aliases = { added, phrases: q5Proposal.altPhrasings, total: merged.length };
  if (apply) {
    mergeMeta(q5Q, { altPhrasings: merged });
    addDetect(q5Row, q5Proposal.altPhrasings);
  }
  report.embedCandidateIds.add(q5Row.id);
}

// --- 4. P0 alternative phrasings ---
for (const item of altProposal.entries) {
  const importKey = item.importKey;
  const live = resolveLiveQuestion(importKey);
  let targetQuestions = [];

  if (live.type === "skipped") {
    targetQuestions = SKIPPED_CAREER_ALT_TARGETS;
  } else if (live.type === "alias") {
    targetQuestions = [live.question];
  } else if (live.type === "created") {
    let q = live.question;
    if (importKey === arcProposal.importKey) q = arcNew;
    targetQuestions = [q];
  } else {
    report.p0Alts.byImportKey.push({ importKey, status: "skipped", reason: live.type });
    continue;
  }

  const phrases = item.proposedAltPhrasings ?? [];
  let addedTotal = 0;
  for (const tq of targetQuestions) {
    const seedRow = findSeedByQuestion(tq);
    if (!seedRow) continue;
    const filtered = [];
    for (const p of phrases) {
      const n = normalizePhrase(p);
      if (canonicalQuestions.has(p.trim())) {
        report.p0Alts.collisions.push({ importKey, phrase: p, reason: "equals other canonical" });
        continue;
      }
      if (normalizePhrase(tq) === n) continue;
      filtered.push(p);
    }
    const before = (meta[tq]?.altPhrasings ?? []).length;
    const merged = mergePhrases(meta[tq]?.altPhrasings, filtered);
    addedTotal += merged.length - before;
    if (apply) {
      mergeMeta(tq, { altPhrasings: merged });
      addDetect(seedRow, filtered);
    }
    if (addedTotal > 0 && seedRow.id) report.embedCandidateIds.add(seedRow.id);
  }
  report.p0Alts.byImportKey.push({
    importKey,
    targets: targetQuestions,
    phrasesProposed: phrases.length,
    phrasesAdded: addedTotal,
  });
}

report.embedCandidateIds = [...report.embedCandidateIds];

if (apply) {
  mkdirSync(paths.backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  copyFileSync(paths.seed, resolve(paths.backupDir, `questrade-interview-full-${stamp}.json`));
  copyFileSync(paths.meta, resolve(paths.backupDir, `navigator-meta-${stamp}.json`));
  writeFileSync(paths.seed, JSON.stringify(seed, null, 2) + "\n");
  writeFileSync(paths.meta, JSON.stringify(meta, null, 2) + "\n");
  writeFileSync(paths.registry, JSON.stringify(registry, null, 2) + "\n");
}

writeFileSync(paths.report, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report, embedCandidateCount: report.embedCandidateIds.length }, null, 2));
if (dryRun && !apply) console.log("\nDry-run only. Pass --apply to write files.");
