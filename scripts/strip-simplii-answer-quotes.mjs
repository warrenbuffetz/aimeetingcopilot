#!/usr/bin/env node
/**
 * Remove outer straight/curly quotation marks from Simplii prepared answers.
 * Usage: node scripts/strip-simplii-answer-quotes.mjs [--apply] [--embed]
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createHash } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const PKG_PATH = resolve(root, "imports/simplii_final_qa.json");

const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");

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

const OPEN_CLOSE = [
  ['"', '"'],
  ["\u201c", "\u201d"],
  ["\u2018", "\u2019"],
  ["'", "'"],
];

/** Strip one layer of matching outer quotes; repeat while wrapped. */
export function stripOuterAnswerQuotes(text) {
  if (text == null || typeof text !== "string") return text;
  let s = text;
  let changed = true;
  while (changed) {
    changed = false;
    const t = s.trim();
    for (const [open, close] of OPEN_CLOSE) {
      if (t.length >= 2 && t.startsWith(open) && t.endsWith(close)) {
        s = t.slice(open.length, t.length - close.length);
        changed = true;
        break;
      }
    }
    if (!changed) s = t;
  }
  return s;
}

/** Spoken answers: outer wrap, orphan open/close quotes, migration `---` footers. */
export function stripSpokenAnswerQuotes(text) {
  if (text == null || typeof text !== "string") return text;
  let s = text.trim().replace(/\n+---\s*$/g, "").trim();
  s = stripOuterAnswerQuotes(s);
  const t = s.trim();
  if (t.startsWith('"') && !t.endsWith('"')) {
    s = t.slice(1).trimStart();
  } else if (!t.startsWith('"') && t.endsWith('"')) {
    s = t.slice(0, -1).trimEnd();
  }
  return stripOuterAnswerQuotes(s);
}

function cleanTextField(value) {
  if (typeof value !== "string") return { value, changed: false };
  const cleaned = stripSpokenAnswerQuotes(value);
  return { value: cleaned, changed: cleaned !== value };
}

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta }))
    .digest("hex");
}

async function snapshotProfile(admin, profileId) {
  const { data } = await admin.from("prepared_qa").select("*").eq("profile_id", profileId);
  const hash = createHash("sha256").update((data ?? []).map(rowHash).sort().join("|")).digest("hex");
  return { hash, count: data?.length ?? 0 };
}

loadEnv();
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const report = { at: new Date().toISOString(), mode: apply ? "apply" : "dry-run", db: {}, pkg: {}, questradeIntegrity: null };

const qtBefore = await snapshotProfile(admin, QUESTRADE_PROFILE_ID);

const { data: rows } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
const dbUpdates = [];

for (const row of rows ?? []) {
  const ans = cleanTextField(row.answer);
  const meta = { ...(row.navigator_meta ?? {}) };
  const spoken = cleanTextField(meta.spokenAnswer);
  const short = cleanTextField(meta.shortAnswer);
  let followUps = row.follow_ups;
  let fuChanged = false;
  if (Array.isArray(followUps)) {
    followUps = followUps.map((fu) => {
      if (!fu || typeof fu !== "object") return fu;
      const a = cleanTextField(fu.answer);
      if (a.changed) fuChanged = true;
      return a.changed ? { ...fu, answer: a.value } : fu;
    });
  }
  const changed = ans.changed || spoken.changed || short.changed || fuChanged;
  if (!changed) continue;
  if (spoken.changed) meta.spokenAnswer = spoken.value;
  if (short.changed) meta.shortAnswer = short.value;
  dbUpdates.push({
    id: row.id,
    answer: ans.value,
    navigator_meta: meta,
    follow_ups: followUps,
  });
}

report.db = { candidates: dbUpdates.length, sample: dbUpdates.slice(0, 3).map((u) => u.id) };

if (apply && dbUpdates.length) {
  for (const u of dbUpdates) {
    const { error } = await admin
      .from("prepared_qa")
      .update({
        answer: u.answer,
        navigator_meta: u.navigator_meta,
        follow_ups: u.follow_ups,
        updated_at: new Date().toISOString(),
      })
      .eq("id", u.id);
    if (error) throw error;
  }
}

if (existsSync(PKG_PATH)) {
  const pkg = JSON.parse(readFileSync(PKG_PATH, "utf8"));
  let pkgChanged = 0;
  for (const rec of pkg.records ?? []) {
    for (const key of ["answer", "spokenAnswer", "shortAnswer"]) {
      const c = cleanTextField(rec[key]);
      if (c.changed) {
        rec[key] = c.value;
        pkgChanged++;
      }
    }
    if (Array.isArray(rec.followUps)) {
      for (const fu of rec.followUps) {
        const c = cleanTextField(fu.answer);
        if (c.changed) {
          fu.answer = c.value;
          pkgChanged++;
        }
      }
    }
  }
  report.pkg = { fieldUpdates: pkgChanged };
  if (apply && pkgChanged > 0) {
    writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n");
  }
}

const qtAfter = await snapshotProfile(admin, QUESTRADE_PROFILE_ID);
report.questradeIntegrity = {
  unchanged: qtBefore.hash === qtAfter.hash,
  count: qtAfter.count,
};

const outPath = resolve(root, "data/migration/simplii-strip-quotes-report.json");
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (!report.questradeIntegrity.unchanged) {
  console.error("Questrade integrity check failed");
  process.exit(1);
}

if (apply && embed) {
  await new Promise((res, rej) => {
    const child = spawn("npm", ["run", "embed:qa:gte"], {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, EMBED_PROFILE_NAME: "Simplii" },
    });
    child.on("exit", (c) => (c === 0 ? res() : rej(new Error(`embed exit ${c}`))));
  });
}
