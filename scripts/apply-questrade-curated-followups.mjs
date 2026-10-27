#!/usr/bin/env node
/**
 * Persist curated contextual follow-up paths into navigator_meta on anchor rows (idempotent).
 * Does not change question/answer text or embeddings.
 *
 *   node scripts/apply-questrade-curated-followups.mjs --dry-run
 *   node scripts/apply-questrade-curated-followups.mjs --apply
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const RESOLVED = resolve(root, "data/migration/questrade-curated-contextual-followups-resolved.json");
const apply = process.argv.includes("--apply");
const dryRun = !apply || process.argv.includes("--dry-run");

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

function stableChildren(children) {
  return children.map((c) => ({
    questionId: c.questionId,
    order: c.order,
    intent: c.intent,
    reason: c.reason,
  }));
}

function childrenEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  const resolved = JSON.parse(readFileSync(RESOLVED, "utf8"));
  const byAnchor = new Map();

  for (const p of resolved.paths) {
    if (!byAnchor.has(p.anchorQuestionId)) {
      byAnchor.set(p.anchorQuestionId, {});
    }
    byAnchor.get(p.anchorQuestionId)[p.round] = stableChildren(p.children);
  }

  const report = {
    at: new Date().toISOString(),
    apply: apply && !dryRun,
    anchors: byAnchor.size,
    updated: 0,
    unchanged: 0,
    missing: [],
    errors: [],
  };

  for (const [anchorId, byRound] of byAnchor) {
    const { data: row, error } = await admin
      .from("prepared_qa")
      .select("id, question, navigator_meta")
      .eq("id", anchorId)
      .maybeSingle();

    if (error) {
      report.errors.push({ anchorId, error: error.message });
      continue;
    }
    if (!row) {
      report.missing.push(anchorId);
      continue;
    }

    const meta = { ...(row.navigator_meta ?? {}) };
    const prev = meta.curatedContextualFollowUpsByRound ?? {};
    if (childrenEqual(prev, byRound)) {
      report.unchanged++;
      continue;
    }

    meta.curatedContextualFollowUpsByRound = byRound;
    meta.curatedContextualFollowUpsVersion = resolved.generatedAt;

    if (apply && !dryRun) {
      const { error: upErr } = await admin.from("prepared_qa").update({ navigator_meta: meta }).eq("id", anchorId);
      if (upErr) {
        report.errors.push({ anchorId, error: upErr.message });
        continue;
      }
    }
    report.updated++;
  }

  const out = resolve(root, "data/migration/questrade-curated-followups-apply-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(report);
  console.log("Wrote", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
