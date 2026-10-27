#!/usr/bin/env node
/**
 * Update Questrade "What are your compensation expectations?" answer.
 *   node scripts/patch-questrade-compensation-expectations.mjs --apply [--embed]
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");

const ROW_ID = "93f1f35c-cd54-49c3-8d6d-6a95d262fd4b";
const QUESTION = "What are your compensation expectations?";
const ANSWER =
  "Based on the scope of the position, my experience and the published range, I'd be targeting somewhere around $185,000 to $205,000 in base salary.\n\n" +
  "For me, base salary is one component of the overall package — what matters is how the full compensation is structured, including bonus and any longer-term incentives.\n\n" +
  "The role and the opportunity to own a meaningful product outcome are important to me, so I'm open to discussing the right total package if there's a strong mutual fit.";

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

function syncSeed() {
  const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  const row = seed.preparedQa.find((r) => r.question.trim() === QUESTION);
  if (row) row.answer = ANSWER;
  writeFileSync(seedPath, JSON.stringify(seed, null, 2));
}

async function main() {
  if (apply) {
    const { error } = await admin
      .from("prepared_qa")
      .update({ answer: ANSWER, updated_at: new Date().toISOString() })
      .eq("id", ROW_ID);
    if (error) throw error;
    syncSeed();
    if (embed) {
      await new Promise((resolvePromise, reject) => {
        const child = spawn("node", [resolve(root, "scripts/embed-qa-gte.mjs")], {
          env: { ...process.env, EMBED_QA_IDS: ROW_ID },
          stdio: "inherit",
        });
        child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
      });
    }
  }
  console.log(JSON.stringify({ apply, embed, rowId: ROW_ID, question: QUESTION, answerPreview: ANSWER.slice(0, 120) + "…" }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
