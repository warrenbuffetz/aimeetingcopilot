#!/usr/bin/env node
/**
 * Create or update the POC admin Supabase user and attach existing library data.
 *
 * Usage: npm run admin:ensure
 * Env (apps/web/.env.local):
 *   ADMIN_EMAIL — default poc-demo@interviewcopilot.app (same as seed)
 *   ADMIN_PASSWORD — required for production; default InterviewCopilot-Poc-Demo-2026 locally
 *   POC_DATA_EMAIL — when ADMIN_EMAIL differs, reassign rows from this user (default poc-demo@…)
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
const adminEmail = process.env.ADMIN_EMAIL ?? "poc-demo@interviewcopilot.app";
const pocDataEmail = process.env.POC_DATA_EMAIL ?? "poc-demo@interviewcopilot.app";
const password =
  process.env.ADMIN_PASSWORD ?? process.env.POC_DEMO_PASSWORD ?? "InterviewCopilot-Poc-Demo-2026";

const USER_TABLES = [
  "interview_profiles",
  "prepared_qa",
  "experience_stories",
  "documents",
  "document_chunks",
  "search_embeddings",
  "interview_sessions",
  "transcript_segments",
];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function findUserByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 500 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureAdminUser() {
  let user = await findUserByEmail(adminEmail);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
      user_metadata: { role: "admin", poc: true },
    });
    if (error) throw error;
    user = data.user;
    console.log("Created admin user:", adminEmail);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { ...user.user_metadata, role: "admin", poc: true },
    });
    if (error) throw error;
    console.log("Updated password for existing user:", adminEmail);
  }

  return user.id;
}

async function reassignPocData(targetUserId) {
  if (adminEmail.toLowerCase() === pocDataEmail.toLowerCase()) {
    return;
  }
  const source = await findUserByEmail(pocDataEmail);
  if (!source) {
    console.log("No POC data user to migrate:", pocDataEmail);
    return;
  }
  if (source.id === targetUserId) return;

  console.log("Reassigning POC data from", pocDataEmail, "→", adminEmail);
  for (const table of USER_TABLES) {
    const { error, count } = await admin.from(table).update({ user_id: targetUserId }).eq("user_id", source.id);
    if (error) {
      console.warn(`  ${table}:`, error.message);
    } else if (count) {
      console.log(`  ${table}: updated`);
    }
  }
}

async function countLibrary(userId) {
  const { count } = await admin.from("prepared_qa").select("id", { count: "exact", head: true }).eq("user_id", userId);
  return count ?? 0;
}

async function main() {
  const userId = await ensureAdminUser();
  await reassignPocData(userId);
  const qaCount = await countLibrary(userId);

  console.log("\n--- POC admin (use on /login when NEXT_PUBLIC_POC_MODE=false) ---");
  console.log("Email:   ", adminEmail);
  console.log("Password:", password);
  console.log("User id: ", userId);
  console.log("Library: ", qaCount, "prepared Q&A row(s)");
  console.log("\nSet SEED_USER_EMAIL=" + adminEmail + " before npm run seed:questrade:full");
  console.log("Set POC_DEMO_PASSWORD / ADMIN_PASSWORD in Vercel to match for POC bootstrap.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
