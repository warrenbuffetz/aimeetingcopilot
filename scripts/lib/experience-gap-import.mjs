/**
 * Shared helpers for experience-gap Q&A import (dry-run + apply).
 */
import { createHash } from "crypto";
import { validateImportPackage, normQ } from "./validate-interview-qa-import.mjs";

export const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
export const QUESTRADE_PROFILE_NAME = "Questrade — Senior PM, Everyday Banking";
export const SIMPLII_PROFILE_NAME = "Simplii Financial — Senior Product Manager";

export const DEFAULT_QT_PATH = "imports/questrade_experience_gap_qa.json";
export const DEFAULT_SIM_PATH = "imports/simplii_experience_gap_qa.json";

export function sharedConceptKey(rec) {
  const tag = rec.topicTags?.find((t) => t.startsWith("shared-concept:") || t.startsWith("sharedConcept:"));
  if (!tag) return null;
  return tag.replace(/^shared-concept:/, "").replace(/^sharedConcept:/, "");
}

export function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

export function buildNavigatorMeta(rec, externalIdToUuid, sourcePath) {
  const topicTags = [...(rec.topicTags ?? [])];
  if (rec.preparationTier && !topicTags.includes(rec.preparationTier)) topicTags.push(rec.preparationTier);

  const shared = sharedConceptKey(rec);
  if (shared && !topicTags.includes(`shared-concept:${shared}`)) {
    topicTags.push(`shared-concept:${shared}`);
  }

  const relatedQuestionIds = (rec.relatedExternalIds ?? [])
    .map((eid) => externalIdToUuid.get(eid))
    .filter(Boolean);

  const meta = {
    importKey: rec.externalId,
    externalContentId: rec.externalId,
    contentPackage: "john-experience-depth-v1",
    adaptationType: rec.adaptationType,
    sourceQuestradeRecordId: rec.sourceQuestradeRecordId ?? undefined,
    librarySection: rec.librarySection,
    libraryCategory: rec.libraryCategory,
    experienceModuleId: rec.experienceModuleId,
    experienceLabel: rec.experienceLabel,
    intent: rec.questionIntent ?? "general",
    evidenceStatus: rec.evidenceStatus ?? "resume_supported",
    altPhrasings: rec.aliases ?? [],
    topicTags,
    keywords: rec.keywords ?? [],
    relatedQuestionIds,
    roundRelevance: rec.roundRelevance,
    panelDiscipline: rec.panelDiscipline,
    spokenAnswer: rec.spokenAnswer,
    shortAnswer: rec.shortAnswer,
    revisionStatus: rec.revisionStatus ?? "current",
    retrievalExcluded: rec.retrievalExcluded ?? true,
    reviewStatus: rec.reviewRequired ? "needs_review" : rec.reviewStatus ?? "needs_review",
    preparationTier: rec.preparationTier,
    primaryInterviewRound: rec.primaryInterviewRound,
    sourceFile: rec.sourceFile ?? sourcePath,
  };

  if (rec.reviewNotes) meta.reviewNotes = rec.reviewNotes;
  if (rec.notes) meta.authorNotes = rec.notes;
  if (rec.parentExternalId) {
    const parentUuid = externalIdToUuid.get(rec.parentExternalId);
    if (parentUuid) meta.parentPreparedQaId = parentUuid;
  }

  return meta;
}

export function indexExistingRows(rows) {
  const byImportKey = new Map();
  const byNormQ = new Map();
  const byIntentModule = new Map();

  for (const r of rows ?? []) {
    const key = r.navigator_meta?.importKey ?? r.navigator_meta?.externalContentId;
    if (key) byImportKey.set(key, r);
    const nq = normQ(r.question);
    if (!byNormQ.has(nq)) byNormQ.set(nq, r);
    const intent = r.navigator_meta?.intent ?? "general";
    const mod = r.navigator_meta?.experienceModuleId ?? "unknown";
    const ik = `${mod}::${intent}`;
    if (!byIntentModule.has(ik)) byIntentModule.set(ik, []);
    byIntentModule.get(ik).push(r);
  }

  return { byImportKey, byNormQ, byIntentModule, rows: rows ?? [] };
}

function isArchived(row) {
  const rs = row.navigator_meta?.revisionStatus;
  return rs === "superseded" || rs === "archived";
}

/**
 * Decide apply action. Never select rows to update via sourceQuestradeRecordId.
 */
export function planRecordAction(rec, existing) {
  const byKey = existing.byImportKey.get(rec.externalId);
  if (byKey) {
    return { action: "update_by_import_key", existingId: byKey.id };
  }

  const nq = normQ(rec.canonicalQuestion);
  const sameQ = existing.byNormQ.get(nq);
  if (sameQ && !isArchived(sameQ)) {
    const live =
      sameQ.is_authoritative !== false &&
      sameQ.navigator_meta?.reviewStatus !== "needs_review" &&
      !sameQ.navigator_meta?.retrievalExcluded;
    if (live) {
      return {
        action: "insert_draft_sibling",
        existingLiveId: sameQ.id,
        note: "Preserve live row; add rehearsal draft with new importKey",
      };
    }
    return {
      action: "insert_draft",
      note: "Existing row is draft/review; insert separate draft (no overwrite by question text)",
      collidesWithId: sameQ.id,
    };
  }

  return { action: "insert_draft" };
}

export function validateCrossProfile(qtPkg, simPkg) {
  const errors = [];
  const qtBy = new Map();
  const simBy = new Map();
  for (const r of qtPkg.records) {
    const k = sharedConceptKey(r);
    if (k) qtBy.set(k, r);
  }
  for (const r of simPkg.records) {
    const k = sharedConceptKey(r);
    if (k) simBy.set(k, r);
  }
  for (const [k, qt] of qtBy) {
    const sim = simBy.get(k);
    if (!sim) {
      errors.push({ type: "missing_simplii_concept", sharedConcept: k });
      continue;
    }
    for (const field of ["answer", "spokenAnswer", "shortAnswer", "reviewNotes"]) {
      if ((qt[field] ?? "") !== (sim[field] ?? "")) {
        errors.push({ type: "cross_profile_drift", sharedConcept: k, field });
      }
    }
  }
  return errors;
}

export function validatePackages(qtPkg, simPkg) {
  const qtVal = validateImportPackage(qtPkg);
  const simVal = validateImportPackage(simPkg);
  const cross = validateCrossProfile(qtPkg, simPkg);
  return { qtVal, simVal, cross, valid: qtVal.valid && simVal.valid && cross.length === 0 };
}
