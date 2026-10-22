#!/usr/bin/env node
/**
 * Merge follow-up Q&A into prepared_qa rows (no OpenAI).
 * Input JSON: { "entries": [ { "matchQuestion": "Tell me about yourself.", "followUps": [ { "question": "...", "answer": "..." } ] } ] }
 * Usage: node scripts/import-follow-ups.mjs data/seed/questrade-follow-ups.json
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(path) {
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

loadEnvFile(resolve(root, "apps/web/.env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const inputPath = resolve(root, process.argv[2] ?? "data/seed/questrade-follow-ups.json");
const payload = JSON.parse(readFileSync(inputPath, "utf8"));
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => u.email === seedEmail) ?? users.users[0];
  if (!user) throw new Error("No user found");

  for (const entry of payload.entries ?? []) {
    const { data: row } = await admin
      .from("prepared_qa")
      .select("id, question")
      .eq("user_id", user.id)
      .eq("question", entry.matchQuestion)
      .maybeSingle();

    if (!row) {
      console.warn("Skip — no parent question:", entry.matchQuestion);
      continue;
    }

    const { error } = await admin
      .from("prepared_qa")
      .update({ follow_ups: entry.followUps ?? [], updated_at: new Date().toISOString() })
      .eq("id", row.id);

    if (error) throw error;
    console.log("Updated follow-ups:", row.question.slice(0, 60), `(${(entry.followUps ?? []).length} items)`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
