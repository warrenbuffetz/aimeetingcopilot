#!/usr/bin/env node
/**
 * Reconcile Top115 curated contextual follow-ups to live Questrade prepared_qa IDs.
 * Output: data/migration/questrade-curated-contextual-followups-resolved.json
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const CURATED_PATH = resolve(root, "data/editorial/questrade-top115-curated-contextual-followups.json");
const EXPORT_PATH = resolve(root, "exports/questrade_interview_library.json");
const REGISTRY_PATH = resolve(root, "data/migration/import-registry-followup-expansion-92.json");
const SPERRO_PATH = resolve(root, "data/seed/questrade-sperro-five-qa-import.json");

const FIVE_PACK_LOCAL = {
  F1: "sperro-five-qa-2026-q01",
  F2: "sperro-five-qa-2026-q02",
  F3: "sperro-five-qa-2026-q03",
  F4: "sperro-five-qa-2026-q04",
  F5: "sperro-five-qa-2026-q05",
};

function loadEnv() {
  const path = resolve(root, "apps/web/.env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function normQ(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isInactive(meta) {
  if (!meta) return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function buildIndexes(records) {
  const byId = new Map();
  const byImportKey = new Map();
  const byNormQuestion = new Map();

  for (const r of records) {
    if (r.status === "inactive") continue;
    byId.set(r.id, r);
    const ik = r.navigatorMeta?.importKey;
    if (ik) byImportKey.set(ik, r);
    const nq = normQ(r.question);
    if (!byNormQuestion.has(nq)) byNormQuestion.set(nq, []);
    byNormQuestion.get(nq).push(r);
  }
  return { byId, byImportKey, byNormQuestion };
}

function resolveRef(ref, ctx, label) {
  const { byId, byImportKey, byNormQuestion } = ctx.indexes;
  const source = ref.anchorSource ?? ref.targetSource;
  const sourceId = ref.anchorSourceId ?? ref.targetSourceId;
  const canonical = ref.anchorCanonicalQuestion ?? ref.targetCanonicalQuestion;
  const localKey = ref.anchorLocalKey ?? ref.targetLocalKey;
  const provenance = [];

  if (source === "signed-off-five-pack" && localKey && FIVE_PACK_LOCAL[localKey]) {
    const ik = FIVE_PACK_LOCAL[localKey];
    const row = byImportKey.get(ik);
    if (row) {
      provenance.push(`five-pack:${ik}`);
      return { id: row.id, provenance, question: row.question };
    }
    provenance.push(`five-pack-miss:${ik}`);
  }

  if (source === "followup-expansion-92" && sourceId) {
    const reg = ctx.registry[sourceId];
    if (reg?.id && byId.has(reg.id)) {
      provenance.push(`registry:${sourceId}`);
      return { id: reg.id, provenance, question: byId.get(reg.id).question };
    }
    if (reg?.action === "skipped_dedup") {
      return { id: null, provenance: [`skipped_dedup:${sourceId}`], question: canonical, skip: true };
    }
    provenance.push(`registry-miss:${sourceId}`);
  }

  if (sourceId && /^[0-9a-f-]{36}$/i.test(sourceId)) {
    const row = byId.get(sourceId);
    if (row && row.profileId === QUESTRADE_PROFILE_ID) {
      if (normQ(row.question) === normQ(canonical) || !canonical) {
        provenance.push(`uuid:${sourceId}`);
        return { id: row.id, provenance, question: row.question };
      }
      provenance.push(`uuid-question-mismatch:${sourceId}`);
    }
  }

  const matches = byNormQuestion.get(normQ(canonical)) ?? [];
  const active = matches.filter((r) => r.profileId === QUESTRADE_PROFILE_ID && !isInactive(r.navigatorMeta));
  if (active.length === 1) {
    provenance.push("text:unique");
    return { id: active[0].id, provenance, question: active[0].question };
  }
  if (active.length > 1) {
    return { id: null, provenance: ["text:ambiguous"], question: canonical, ambiguous: active.map((r) => r.id) };
  }

  return { id: null, provenance: ["unresolved"], question: canonical };
}

function intentReason(intent, experienceLabel) {
  const base =
    {
      experience_deep_dive: "Deep dive",
      decision_or_tradeoff: "Follow-up to current decision",
      natural_followup: "Natural follow-up",
      measurement_or_economics: "Measurement follow-up",
      risk_or_exception: "Risk & controls follow-up",
      technical_or_architecture: "Technical deep dive",
      ownership_followup: "Ownership follow-up",
    }[intent] ?? "Curated follow-up";
  if (experienceLabel) return `${base} · ${experienceLabel}`;
  return base;
}

async function main() {
  loadEnv();
  const curated = JSON.parse(readFileSync(CURATED_PATH, "utf8"));
  const exp = JSON.parse(readFileSync(EXPORT_PATH, "utf8"));
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
  const records = exp.records.filter((r) => r.profileId === QUESTRADE_PROFILE_ID);

  const ctx = { indexes: buildIndexes(records), registry };

  const stats = {
    placementsExamined: 0,
    uniqueAnchorKeys: new Set(),
    edgesExamined: 0,
    edgesResolved: 0,
    unresolvedAnchors: [],
    unresolvedTargets: [],
    skippedDedup: 0,
    excludedInactive: 0,
    duplicateEdgesAvoided: 0,
    anchorsWithNoChildren: [],
  };

  const paths = [];
  const edgeSet = new Set();

  for (const [round, placements] of Object.entries(curated.rounds)) {
    for (const placement of placements) {
      stats.placementsExamined++;
      const anchorRef = {
        anchorSource: placement.anchorSource,
        anchorSourceId: placement.anchorSourceId,
        anchorCanonicalQuestion: placement.anchorCanonicalQuestion,
        anchorLocalKey: placement.anchorLocalKey,
      };
      const anchorRes = resolveRef(anchorRef, ctx, "anchor");
      const anchorKey = `${round}:${placement.anchorRoundRank}:${placement.anchorLocalKey}`;
      stats.uniqueAnchorKeys.add(anchorKey);

      if (!anchorRes.id) {
        stats.unresolvedAnchors.push({
          round,
          rank: placement.anchorRoundRank,
          question: placement.anchorCanonicalQuestion,
          provenance: anchorRes.provenance,
          ambiguous: anchorRes.ambiguous,
        });
        continue;
      }

      const children = [];
      const seenChild = new Set();

      for (const fu of placement.followUps ?? []) {
        stats.edgesExamined++;
        const edgeKey = `${anchorRes.id}:${round}:${fu.order}:${fu.targetLocalKey}`;
        if (edgeSet.has(edgeKey)) {
          stats.duplicateEdgesAvoided++;
          continue;
        }
        edgeSet.add(edgeKey);

        const targetRes = resolveRef(
          {
            targetSource: fu.targetSource,
            targetSourceId: fu.targetSourceId,
            targetCanonicalQuestion: fu.targetCanonicalQuestion,
            targetLocalKey: fu.targetLocalKey,
          },
          ctx
        );

        if (targetRes.skip) {
          stats.skippedDedup++;
          continue;
        }
        if (!targetRes.id) {
          stats.unresolvedTargets.push({
            round,
            anchor: placement.anchorCanonicalQuestion,
            target: fu.targetCanonicalQuestion,
            provenance: targetRes.provenance,
            ambiguous: targetRes.ambiguous,
          });
          continue;
        }

        const row = ctx.indexes.byId.get(targetRes.id);
        if (isInactive(row.navigatorMeta)) {
          stats.excludedInactive++;
          continue;
        }
        if (seenChild.has(targetRes.id)) {
          stats.duplicateEdgesAvoided++;
          continue;
        }
        seenChild.add(targetRes.id);

        stats.edgesResolved++;
        children.push({
          questionId: targetRes.id,
          order: fu.order,
          intent: fu.intent,
          reason: intentReason(fu.intent, row.navigatorMeta?.experienceLabel),
          question: row.question,
          provenance: targetRes.provenance,
        });
      }

      children.sort((a, b) => a.order - b.order);

      if (children.length === 0) {
        stats.anchorsWithNoChildren.push({
          round,
          anchorId: anchorRes.id,
          question: placement.anchorCanonicalQuestion,
        });
      }

      paths.push({
        anchorQuestionId: anchorRes.id,
        anchorQuestion: placement.anchorCanonicalQuestion,
        round,
        anchorRoundRank: placement.anchorRoundRank,
        anchorTier: placement.anchorTier,
        children,
      });
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    profileId: QUESTRADE_PROFILE_ID,
    sourceFile: "data/editorial/questrade-top115-curated-contextual-followups.json",
    stats: {
      ...stats,
      uniqueAnchorKeys: stats.uniqueAnchorKeys.size,
    },
    paths,
  };

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const outPath = resolve(root, "data/migration/questrade-curated-contextual-followups-resolved.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  const md = [
    "# Questrade curated contextual follow-ups — reconciliation",
    "",
    `Generated: ${out.generatedAt}`,
    "",
    `- Placements examined: ${stats.placementsExamined}`,
    `- Unique anchor placements: ${stats.uniqueAnchorKeys.size}`,
    `- Edges examined: ${stats.edgesExamined}`,
    `- Edges resolved: ${stats.edgesResolved}`,
    `- Unresolved anchors: ${stats.unresolvedAnchors.length}`,
    `- Unresolved targets: ${stats.unresolvedTargets.length}`,
    `- Skipped (dedup registry): ${stats.skippedDedup}`,
    `- Excluded inactive: ${stats.excludedInactive}`,
    `- Anchors with no eligible children: ${stats.anchorsWithNoChildren.length}`,
    "",
  ];
  if (stats.unresolvedAnchors.length) {
    md.push("## Unresolved anchors", "");
    for (const u of stats.unresolvedAnchors.slice(0, 40)) {
      md.push(`- [${u.round} #${u.rank}] ${u.question}`);
    }
    md.push("");
  }
  if (stats.unresolvedTargets.length) {
    md.push("## Unresolved targets (sample)", "");
    for (const u of stats.unresolvedTargets.slice(0, 40)) {
      md.push(`- ${u.anchor} → ${u.target}`);
    }
  }
  writeFileSync(resolve(root, "data/migration/questrade-curated-contextual-followups-reconcile.md"), md.join("\n"));

  console.log(JSON.stringify(out.stats, null, 2));
  console.log("Wrote", outPath);
  if (stats.unresolvedAnchors.length || stats.unresolvedTargets.length > 50) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
