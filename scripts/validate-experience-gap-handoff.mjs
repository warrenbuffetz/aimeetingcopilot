#!/usr/bin/env node
/**
 * Validates experience-gap handoff per Interview_Experience_Gap_QA_Cursor_Pack.md.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  QUESTRADE_PROFILE_ID,
  SIMPLII_PROFILE_NAME,
  DEFAULT_QT_PATH,
  DEFAULT_SIM_PATH,
  sharedConceptKey,
  validatePackages,
  planRecordAction,
  indexExistingRows,
} from "./lib/experience-gap-import.mjs";
import { parseExperienceGapPack, contentFingerprint } from "./lib/parse-experience-gap-pack.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const PACK = resolve(root, "docs/Interview_Experience_Gap_QA_Cursor_Pack.md");

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

function sha(s) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

async function main() {
  loadEnv();
  const qtPath = resolve(root, DEFAULT_QT_PATH);
  const simPath = resolve(root, DEFAULT_SIM_PATH);
  const qtPkg = JSON.parse(readFileSync(qtPath, "utf8"));
  const simPkg = JSON.parse(readFileSync(simPath, "utf8"));
  const validation = validatePackages(qtPkg, simPkg);

  const report = {
    at: new Date().toISOString(),
    packageValidation: validation,
    textPreservation: { answerMatchesPack: 0, answerDrift: [], reviewNoteDrift: 0 },
    db: null,
    linkIntegrity: { questrade: [], simplii: [] },
    idempotency: null,
    employerOverviews: [],
  };

  if (existsSync(PACK)) {
    const cards = parseExperienceGapPack(PACK);
    const byConcept = new Map(qtPkg.records.map((r) => [sharedConceptKey(r), r]));
    for (const c of cards) {
      const concept = `john-experience-depth-v1-${c.cardId}`;
      const rec = byConcept.get(concept);
      if (!rec) {
        report.textPreservation.answerDrift.push({ cardId: c.cardId, issue: "missing_record" });
        continue;
      }
      if (rec.answer === c.answer) report.textPreservation.answerMatchesPack++;
      else report.textPreservation.answerDrift.push({ cardId: c.cardId, issue: "answer" });
      if (rec.reviewNotes !== c.reviewNote) report.textPreservation.reviewNoteDrift++;
    }
    report.textPreservation.cardCount = cards.length;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
    const user = users.users.find((u) => u.email === seedEmail);
    const { data: simProfile } = await admin
      .from("interview_profiles")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("name", SIMPLII_PROFILE_NAME)
      .single();

    async function checkProfile(profileId, pkg, label) {
      const { data: rows } = await admin
        .from("prepared_qa")
        .select("id, question, is_authoritative, is_preferred, navigator_meta")
        .eq("profile_id", profileId);
      const existing = indexExistingRows(rows);
      const issues = [];
      const idMap = new Map();
      for (const rec of pkg.records) {
        const row = existing.byImportKey.get(rec.externalId);
        if (!row) issues.push({ externalId: rec.externalId, issue: "missing_import_row" });
        else idMap.set(rec.externalId, row.id);
      }
      for (const rec of pkg.records) {
        const row = existing.byImportKey.get(rec.externalId);
        if (!row) continue;
        const meta = row.navigator_meta ?? {};
        if (rec.parentExternalId) {
          const pid = idMap.get(rec.parentExternalId);
          if (!pid) issues.push({ externalId: rec.externalId, issue: "unresolved_parent", ref: rec.parentExternalId });
          else if (meta.parentPreparedQaId !== pid) {
            issues.push({ externalId: rec.externalId, issue: "parent_uuid_mismatch", expected: pid, got: meta.parentPreparedQaId });
          }
        }
        const related = rec.relatedExternalIds ?? [];
        const resolved = related.filter((eid) => idMap.has(eid));
        if (resolved.length !== related.length) {
          issues.push({ externalId: rec.externalId, issue: "related_external_unresolved", missing: related.filter((e) => !idMap.has(e)) });
        }
      }
      const plans = pkg.records.map((rec) => ({
        externalId: rec.externalId,
        ...planRecordAction(rec, existing),
      }));
      return { rowCount: rows?.length, issues, plans, rows };
    }

    const qt = await checkProfile(QUESTRADE_PROFILE_ID, qtPkg, "questrade");
    const sim = await checkProfile(simProfile.id, simPkg, "simplii");
    report.db = {
      questrade: { imported: qt.plans.filter((p) => p.action === "update_by_import_key").length, issues: qt.issues.length },
      simplii: { imported: sim.plans.filter((p) => p.action === "update_by_import_key").length, issues: sim.issues.length },
    };
    report.linkIntegrity.questrade = qt.issues;
    report.linkIntegrity.simplii = sim.issues;
    report.idempotency = {
      questradeUpdatesExpected: qtPkg.records.length,
      questradeReady: qt.plans.every((p) => p.action === "update_by_import_key"),
      simpliiReady: sim.plans.every((p) => p.action === "update_by_import_key"),
    };

    for (const label of ["questrade", "simplii"]) {
      const pkg = label === "questrade" ? qtPkg : simPkg;
      const data = label === "questrade" ? qt : sim;
      for (const rec of pkg.records) {
        if (!rec.topicTags?.includes("scope:employer_overview")) continue;
        const row = data.rows?.find((r) => r.navigator_meta?.importKey === rec.externalId);
        report.employerOverviews.push({
          profile: label,
          externalId: rec.externalId,
          isPreferred: row?.is_preferred ?? null,
          retrievalExcluded: row?.navigator_meta?.retrievalExcluded ?? null,
          experienceModuleId: rec.experienceModuleId,
        });
      }
    }
  }

  const ok =
    validation.valid &&
    report.textPreservation.answerDrift.length === 0 &&
    (report.linkIntegrity.questrade.length === 0 && report.linkIntegrity.simplii.length === 0) &&
    (report.idempotency?.questradeReady && report.idempotency?.simpliiReady);

  report.pass = ok;

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonOut = resolve(root, "data/migration/experience-gap-handoff-validation.json");
  writeFileSync(jsonOut, JSON.stringify(report, null, 2));

  const md = [
    "# Experience-gap handoff validation",
    "",
    `**Pass:** ${ok ? "yes" : "no"} · ${report.at}`,
    "",
    "## Package",
    `- Schema/cross-profile: ${validation.valid ? "OK" : "FAILED"}`,
    `- Answers match pack (${report.textPreservation.cardCount ?? "?"} cards): ${report.textPreservation.answerMatchesPack} OK, ${report.textPreservation.answerDrift.length} drift`,
    `- Review-note label drift vs pack (expected): ${report.textPreservation.reviewNoteDrift} cards`,
    "",
    "## Database",
    report.db
      ? `- Questrade import keys: ${report.db.questrade.imported}/61, link issues: ${report.db.questrade.issues}`
      : "- (no Supabase env)",
    report.db ? `- Simplii import keys: ${report.db.simplii.imported}/61, link issues: ${report.db.simplii.issues}` : "",
    report.idempotency
      ? `- Idempotent re-import ready: QT ${report.idempotency.questradeReady}, Simplii ${report.idempotency.simpliiReady}`
      : "",
    "",
    "## Employer overviews (routing)",
    ...report.employerOverviews.map(
      (o) =>
        `- ${o.profile} \`${o.externalId}\` preferred=${o.isPreferred} retrievalExcluded=${o.retrievalExcluded} module=${o.experienceModuleId}`
    ),
    "",
    `JSON: \`${jsonOut}\``,
    "",
  ].join("\n");
  writeFileSync(resolve(root, "data/migration/experience-gap-handoff-validation.md"), md);
  console.log(ok ? "Handoff validation PASS" : "Handoff validation FAIL", jsonOut);
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
