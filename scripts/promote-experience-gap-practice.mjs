#!/usr/bin/env node
/**
 * After content review: enable practice retrieval for experience-gap rows.
 *
 * Default: dry-run.
 *   --apply --employer-overviews-only   # 4 broad employer cards per profile (live match, still needs_review)
 *   --apply --package-all               # all 61 cards (only after you confirm hypothetical stories)
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
} from "./lib/experience-gap-import.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const apply = process.argv.includes("--apply");
const overviewsOnly = process.argv.includes("--employer-overviews-only");
const packageAll = process.argv.includes("--package-all");

if (!overviewsOnly && !packageAll) {
  console.error("Specify --employer-overviews-only or --package-all");
  process.exit(1);
}

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

function selectRecords(pkg) {
  if (packageAll) return pkg.records;
  return pkg.records.filter((r) => r.topicTags?.includes("scope:employer_overview"));
}

async function promoteProfile(profileId, pkg) {
  const recs = selectRecords(pkg);
  const report = { profileId, targets: recs.length, updated: 0, rows: [] };

  const { data: allRows, error: listErr } = await admin
    .from("prepared_qa")
    .select("id, navigator_meta, is_preferred")
    .eq("profile_id", profileId);
  if (listErr) throw listErr;
  const byKey = new Map();
  for (const r of allRows ?? []) {
    const k = r.navigator_meta?.importKey ?? r.navigator_meta?.externalContentId;
    if (k) byKey.set(k, r);
  }

  for (const rec of recs) {
    const row = byKey.get(rec.externalId);
    if (!row) {
      report.rows.push({ externalId: rec.externalId, status: "missing" });
      continue;
    }
    const meta = { ...(row.navigator_meta ?? {}) };
    meta.retrievalExcluded = false;
    meta.reviewStatus = meta.reviewStatus === "ok" ? "ok" : "needs_review";
    const isOverview = rec.topicTags?.includes("scope:employer_overview");
    const isPreferred = overviewsOnly || isOverview ? true : rec.isPreferred ?? false;

    report.rows.push({
      externalId: rec.externalId,
      id: row.id,
      retrievalExcluded: false,
      isPreferred,
      reviewStatus: meta.reviewStatus,
    });

    if (!apply) continue;

    const { error } = await admin
      .from("prepared_qa")
      .update({
        is_preferred: isPreferred,
        navigator_meta: meta,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) throw error;
    report.updated++;
  }
  return report;
}

async function main() {
  const qtPkg = JSON.parse(readFileSync(resolve(root, DEFAULT_QT_PATH), "utf8"));
  const simPkg = JSON.parse(readFileSync(resolve(root, DEFAULT_SIM_PATH), "utf8"));

  const { data: simProfile } = await admin
    .from("interview_profiles")
    .select("id")
    .eq("name", SIMPLII_PROFILE_NAME)
    .single();

  const report = {
    at: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    scope: packageAll ? "package-all" : "employer-overviews-only",
    questrade: await promoteProfile(QUESTRADE_PROFILE_ID, qtPkg),
    simplii: await promoteProfile(simProfile.id, simPkg),
  };

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const out = resolve(root, "data/migration/experience-gap-practice-promote-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(apply ? "Promoted for practice retrieval." : "Dry-run promote.", report.scope);
  console.log("Questrade:", report.questrade.updated, "/", report.questrade.targets);
  console.log("Simplii:", report.simplii.updated, "/", report.simplii.targets);
  console.log(out);
  if (apply) {
    console.log("Next: EMBED_INCLUDE_REVIEW_DRAFTS=1 npm run embed:qa:gte (per profile)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
