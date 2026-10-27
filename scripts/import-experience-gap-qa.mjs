#!/usr/bin/env node
/**
 * Import 61-card experience-gap packages for Questrade and/or Simplii.
 * Draft rows only by default (retrievalExcluded, not authoritative).
 * Never upserts by sourceQuestradeRecordId.
 *
 * Usage:
 *   node scripts/import-experience-gap-qa.mjs                    # dry-run both
 *   node scripts/import-experience-gap-qa.mjs --apply            # apply both
 *   node scripts/import-experience-gap-qa.mjs --apply --embed    # apply + embed both profiles
 *   node scripts/import-experience-gap-qa.mjs --apply --profile=questrade
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import {
  QUESTRADE_PROFILE_ID,
  QUESTRADE_PROFILE_NAME,
  SIMPLII_PROFILE_NAME,
  DEFAULT_QT_PATH,
  DEFAULT_SIM_PATH,
  buildNavigatorMeta,
  indexExistingRows,
  planRecordAction,
  validatePackages,
} from "./lib/experience-gap-import.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");
const profileArg = process.argv.find((a) => a.startsWith("--profile="));
const profileFilter = profileArg?.split("=")[1] ?? "both";

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

loadEnv();

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

async function findUserId() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email === seedEmail) ?? data.users[0];
  if (!user) throw new Error("No user found");
  return user.id;
}

async function resolveProfile(userId, pkg) {
  const name = pkg.targetProfile?.name;
  if (pkg.targetProfile?.id) {
    const { data } = await admin
      .from("interview_profiles")
      .select("id, name")
      .eq("id", pkg.targetProfile.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return data;
  }
  const { data, error } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`Target profile not found: ${name}`);
  return data;
}

async function applyPackage({ pkg, jsonPath, profile, userId, report }) {
  const { data: existingRows, error } = await admin
    .from("prepared_qa")
    .select("id, question, answer, is_preferred, is_authoritative, navigator_meta")
    .eq("profile_id", profile.id);
  if (error) throw error;

  const existing = indexExistingRows(existingRows);
  const externalIdToUuid = new Map();
  for (const rec of pkg.records) {
    const hit = existing.byImportKey.get(rec.externalId);
    if (hit) externalIdToUuid.set(rec.externalId, hit.id);
  }

  const profileReport = {
    profileId: profile.id,
    profileName: profile.name,
    planned: [],
    applied: { insert: 0, update: 0, skipped: 0 },
    relationshipIssues: [],
  };

  for (const rec of pkg.records) {
    const plan = planRecordAction(rec, existing);
    profileReport.planned.push({ externalId: rec.externalId, ...plan });
    if (!apply) continue;

    const follow_ups = (rec.followUps ?? []).map((fu) => ({
      question: fu.question,
      answer: fu.answer,
      notes: fu.notes ?? undefined,
    }));

    const basePayload = {
      user_id: userId,
      profile_id: profile.id,
      question: rec.canonicalQuestion,
      answer: rec.answer,
      category: rec.category ?? null,
      is_preferred: rec.isPreferred ?? false,
      is_authoritative: rec.isAuthoritative ?? false,
      follow_ups,
      updated_at: new Date().toISOString(),
    };

    if (plan.action === "update_by_import_key") {
      const meta = buildNavigatorMeta(rec, externalIdToUuid, jsonPath);
      const { error: upErr } = await admin
        .from("prepared_qa")
        .update({ ...basePayload, navigator_meta: meta })
        .eq("id", plan.existingId);
      if (upErr) throw upErr;
      externalIdToUuid.set(rec.externalId, plan.existingId);
      profileReport.applied.update++;
      continue;
    }

    if (plan.action === "insert_draft" || plan.action === "insert_draft_sibling") {
      const meta = buildNavigatorMeta(rec, externalIdToUuid, jsonPath);
      if (plan.existingLiveId) meta.linkedLivePreparedQaId = plan.existingLiveId;
      if (plan.collidesWithId) meta.draftCollisionPreparedQaId = plan.collidesWithId;
      const { data, error: insErr } = await admin
        .from("prepared_qa")
        .insert({ ...basePayload, navigator_meta: meta })
        .select("id")
        .single();
      if (insErr) throw insErr;
      externalIdToUuid.set(rec.externalId, data.id);
      existing.byImportKey.set(rec.externalId, { id: data.id, ...basePayload, navigator_meta: meta });
      profileReport.applied.insert++;
      continue;
    }

    profileReport.applied.skipped++;
  }

  if (!apply) return profileReport;

  for (const rec of pkg.records) {
    const id = externalIdToUuid.get(rec.externalId);
    if (!id) continue;
    let meta = buildNavigatorMeta(rec, externalIdToUuid, jsonPath);

    if (rec.parentExternalId) {
      const parentId = externalIdToUuid.get(rec.parentExternalId);
      if (!parentId) {
        profileReport.relationshipIssues.push({
          type: "missing_parent",
          externalId: rec.externalId,
          parentExternalId: rec.parentExternalId,
        });
      } else {
        meta.parentPreparedQaId = parentId;
        const { data: parentRow } = await admin
          .from("prepared_qa")
          .select("navigator_meta")
          .eq("id", parentId)
          .single();
        const parentMeta = parentRow?.navigator_meta ?? {};
        const related = new Set(parentMeta.relatedQuestionIds ?? []);
        related.add(id);
        await admin
          .from("prepared_qa")
          .update({
            navigator_meta: { ...parentMeta, relatedQuestionIds: [...related] },
            updated_at: new Date().toISOString(),
          })
          .eq("id", parentId);
      }
    }

    const { error: metaErr } = await admin.from("prepared_qa").update({ navigator_meta: meta }).eq("id", id);
    if (metaErr) throw metaErr;
  }

  return profileReport;
}

async function runEmbed(profileNameFilter) {
  await new Promise((resolvePromise, reject) => {
    const child = spawn("npm", ["run", "embed:qa:gte"], {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, EMBED_PROFILE_NAME: profileNameFilter },
    });
    child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed ${profileNameFilter} exited ${code}`))));
  });
}

async function main() {
  const qtPath = resolve(root, DEFAULT_QT_PATH);
  const simPath = resolve(root, DEFAULT_SIM_PATH);
  if (!existsSync(qtPath) || !existsSync(simPath)) {
    console.error("Missing import JSON. Expected:", qtPath, "and", simPath);
    process.exit(1);
  }

  const qtPkg = JSON.parse(readFileSync(qtPath, "utf8"));
  const simPkg = JSON.parse(readFileSync(simPath, "utf8"));
  const validation = validatePackages(qtPkg, simPkg);

  const report = {
    at: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    validation,
    profiles: {},
  };

  if (!validation.valid) {
    mkdirSync(resolve(root, "data/migration"), { recursive: true });
    const out = resolve(root, "data/migration/experience-gap-import-apply-report.json");
    writeFileSync(out, JSON.stringify(report, null, 2));
    console.error("Validation failed:", out);
    validation.qtVal.errors.forEach((e) => console.error("  qt", e.path, e.message));
    validation.simVal.errors.forEach((e) => console.error("  sim", e.path, e.message));
    validation.cross.forEach((e) => console.error("  cross", e));
    process.exit(1);
  }

  const userId = await findUserId();
  const runQuestrade = profileFilter === "both" || profileFilter === "questrade";
  const runSimplii = profileFilter === "both" || profileFilter === "simplii";

  if (runQuestrade) {
    const profile =
      qtPkg.targetProfile?.id === QUESTRADE_PROFILE_ID
        ? { id: QUESTRADE_PROFILE_ID, name: QUESTRADE_PROFILE_NAME }
        : await resolveProfile(userId, qtPkg);
    report.profiles.questrade = await applyPackage({
      pkg: qtPkg,
      jsonPath: qtPath,
      profile,
      userId,
      report,
    });
  }

  if (runSimplii) {
    const profile = await resolveProfile(userId, simPkg);
    if (profile.name !== SIMPLII_PROFILE_NAME) {
      throw new Error(`Simplii profile name mismatch: ${profile.name}`);
    }
    report.profiles.simplii = await applyPackage({
      pkg: simPkg,
      jsonPath: simPath,
      profile,
      userId,
      report,
    });
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const out = resolve(root, "data/migration/experience-gap-import-apply-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(apply ? "Apply complete." : "Dry-run complete.", report.mode);
  for (const [k, pr] of Object.entries(report.profiles)) {
    console.log(
      k,
      apply ? pr.applied : { planned: pr.planned.length },
      apply ? "" : `(insert~${pr.planned.filter((p) => p.action.startsWith("insert")).length}, update~${pr.planned.filter((p) => p.action === "update_by_import_key").length})`
    );
  }
  console.log("Report:", out);

  if (apply && embed) {
    if (runQuestrade) await runEmbed("Questrade");
    if (runSimplii) await runEmbed("Simplii");
  } else if (apply) {
    console.log("Tip: node scripts/import-experience-gap-qa.mjs --apply --embed");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
