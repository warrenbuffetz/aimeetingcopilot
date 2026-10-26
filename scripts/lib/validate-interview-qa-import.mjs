/**
 * Lightweight validator for interview Q&A import packages (no external JSON Schema runtime).
 */
const SCHEMA_VERSION = "1.0.0";

const ADAPTATION = new Set(["reused", "lightly_edited", "rewritten", "newly_authored"]);
const REVISION = new Set(["current", "superseded", "archived"]);
const EVIDENCE = new Set([
  "verified_accomplishment",
  "resume_supported",
  "illustrative_scenario",
  "rehearsal_framework",
  "unverified_detail",
]);
const INTENT = new Set([
  "main_story",
  "problem_discovery",
  "prioritization",
  "solution_alternatives",
  "personal_ownership",
  "technical_implementation",
  "measurement_impact",
  "attribution",
  "tradeoffs",
  "challenges_lessons",
  "what_differently",
  "general",
]);
const ROUND_PRIORITY = new Set(["very_high", "high", "medium", "low"]);
const ROUNDS = new Set(["recruiter", "hiring_manager", "cross_functional_panel"]);
const TIERS = new Set(["P0", "P1", "P2"]);

export function normQ(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUuid(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

/**
 * @returns {{ valid: boolean, errors: { path: string, message: string }[], warnings: { path: string, message: string }[] }}
 */
export function validateImportPackage(pkg) {
  const errors = [];
  const warnings = [];

  const push = (path, message) => errors.push({ path, message });
  const warn = (path, message) => warnings.push({ path, message });

  if (!pkg || typeof pkg !== "object") {
    push("$", "Root must be an object");
    return { valid: false, errors, warnings };
  }

  if (pkg.schemaVersion !== SCHEMA_VERSION) {
    push("schemaVersion", `Must be ${SCHEMA_VERSION}`);
  }

  if (!pkg.targetProfile?.name || typeof pkg.targetProfile.name !== "string") {
    push("targetProfile.name", "Required");
  } else if (pkg.targetProfile.id && !isUuid(pkg.targetProfile.id)) {
    push("targetProfile.id", "Must be a UUID when provided");
  }

  if (!Array.isArray(pkg.records) || pkg.records.length === 0) {
    push("records", "Must be a non-empty array");
    return { valid: errors.length === 0, errors, warnings };
  }

  const externalIds = new Set();
  const normQuestions = new Map();

  pkg.records.forEach((rec, i) => {
    const base = `records[${i}]`;
    if (!rec || typeof rec !== "object") {
      push(base, "Must be an object");
      return;
    }

    if (!rec.externalId || typeof rec.externalId !== "string") push(`${base}.externalId`, "Required string");
    else if (externalIds.has(rec.externalId)) push(`${base}.externalId`, `Duplicate externalId: ${rec.externalId}`);
    else externalIds.add(rec.externalId);

    if (!rec.canonicalQuestion?.trim()) push(`${base}.canonicalQuestion`, "Required");
    if (rec.answer === undefined || rec.answer === null || String(rec.answer).length === 0) {
      push(`${base}.answer`, "Required (may be whitespace-only only if intentional — prefer non-empty)");
    }
    if (!ADAPTATION.has(rec.adaptationType)) push(`${base}.adaptationType`, "Invalid adaptationType");

    if (rec.revisionStatus && !REVISION.has(rec.revisionStatus)) push(`${base}.revisionStatus`, "Invalid");
    if (rec.evidenceStatus && !EVIDENCE.has(rec.evidenceStatus)) push(`${base}.evidenceStatus`, "Invalid");
    if (rec.questionIntent && !INTENT.has(rec.questionIntent)) push(`${base}.questionIntent`, "Invalid");
    if (rec.preparationTier && !TIERS.has(rec.preparationTier)) push(`${base}.preparationTier`, "Invalid");

    if (rec.sourceQuestradeRecordId && !isUuid(rec.sourceQuestradeRecordId)) {
      warn(
        `${base}.sourceQuestradeRecordId`,
        `Not a RFC-4122 UUID (${rec.sourceQuestradeRecordId}); stored as provenance reference only`
      );
    }

    if (rec.roundRelevance && typeof rec.roundRelevance === "object") {
      for (const [k, v] of Object.entries(rec.roundRelevance)) {
        if (!ROUNDS.has(k)) push(`${base}.roundRelevance.${k}`, "Unknown round");
        if (!ROUND_PRIORITY.has(v)) push(`${base}.roundRelevance.${k}`, "Invalid priority");
      }
    }

    if (Array.isArray(rec.aliases)) {
      rec.aliases.forEach((a, j) => {
        if (!a?.trim()) push(`${base}.aliases[${j}]`, "Empty alias");
      });
    }

    if (Array.isArray(rec.followUps)) {
      rec.followUps.forEach((fu, j) => {
        if (!fu?.question?.trim()) push(`${base}.followUps[${j}].question`, "Required");
        if (!fu?.answer?.trim()) push(`${base}.followUps[${j}].answer`, "Required");
      });
    }

    const nq = normQ(rec.canonicalQuestion);
    if (nq) {
      if (!normQuestions.has(nq)) normQuestions.set(nq, []);
      normQuestions.get(nq).push(rec.externalId);
    }
  });

  // Second pass: parent / related refs
  for (let i = 0; i < pkg.records.length; i++) {
    const rec = pkg.records[i];
    const base = `records[${i}]`;
    if (rec.parentExternalId && !externalIds.has(rec.parentExternalId)) {
      push(`${base}.parentExternalId`, `Unknown parentExternalId: ${rec.parentExternalId}`);
    }
    for (const rid of rec.relatedExternalIds ?? []) {
      if (!externalIds.has(rid)) push(`${base}.relatedExternalIds`, `Unknown externalId: ${rid}`);
    }
    if (rec.supersededByExternalId && !externalIds.has(rec.supersededByExternalId)) {
      push(`${base}.supersededByExternalId`, `Unknown externalId: ${rec.supersededByExternalId}`);
    }
  }

  for (const [nq, ids] of normQuestions) {
    if (ids.length > 1) {
      warn("records", `Duplicate normalized canonical questions: "${nq}" → ${ids.join(", ")}`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
