#!/usr/bin/env node
/**
 * Ensure Simplii profile exists (metadata only — no Q&A content).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SIMPLII_PROFILE_NAME = "Simplii Financial — Senior Product Manager";

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

const JD_HEADER = `INTERVIEW: Wednesday, October 28, 2026, 12:00–12:45 PM Eastern
STAGE: Initial interview (recruiter, hiring manager, and panel preparation)
PREPARATION STATUS: Active

`;

let JD_BODY = "";
try {
  JD_BODY = readFileSync(resolve(root, "data/migration/simplii-job-description-excerpt.txt"), "utf8");
} catch {
  JD_BODY = "";
}

async function main() {
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => u.email === seedEmail) ?? users.users[0];
  if (!user) throw new Error("No user found");

  const jobDescription = JD_HEADER + JD_BODY;

  const { data: existing } = await admin
    .from("interview_profiles")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("name", SIMPLII_PROFILE_NAME)
    .maybeSingle();

  if (existing) {
    await admin
      .from("interview_profiles")
      .update({
        employer: "Simplii Financial (CIBC)",
        role_title: "Senior Product Manager",
        job_description: jobDescription,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    console.log(JSON.stringify({ profileId: existing.id, name: SIMPLII_PROFILE_NAME, action: "updated" }));
    return;
  }

  const { data: created, error } = await admin
    .from("interview_profiles")
    .insert({
      user_id: user.id,
      name: SIMPLII_PROFILE_NAME,
      employer: "Simplii Financial (CIBC)",
      role_title: "Senior Product Manager",
      job_description: jobDescription,
    })
    .select("id")
    .single();
  if (error) throw error;
  console.log(JSON.stringify({ profileId: created.id, name: SIMPLII_PROFILE_NAME, action: "created" }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
