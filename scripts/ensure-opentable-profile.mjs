#!/usr/bin/env node
/**
 * Ensure OpenTable profile exists (metadata only — no Q&A content).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const OPENTABLE_PROFILE_NAME =
  "OpenTable — Senior Product Manager, Restaurant Product (AI/ML Revenue Optimization)";

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

const JD_HEADER = `INTERVIEW STAGES: Recruiter → Hiring Manager → Cross-functional / Technical Panel
LOCATION: Toronto (hybrid)
PREPARATION STATUS: Active

`;

let JD_BODY = "";
try {
  JD_BODY = readFileSync(resolve(root, "data/migration/opentable-job-description-excerpt.txt"), "utf8");
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
    .eq("name", OPENTABLE_PROFILE_NAME)
    .maybeSingle();

  if (existing) {
    await admin
      .from("interview_profiles")
      .update({
        employer: "OpenTable",
        role_title: "Senior Product Manager, Restaurant Product",
        job_description: jobDescription,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    console.log(JSON.stringify({ profileId: existing.id, name: OPENTABLE_PROFILE_NAME, action: "updated" }));
    return;
  }

  const { data: created, error } = await admin
    .from("interview_profiles")
    .insert({
      user_id: user.id,
      name: OPENTABLE_PROFILE_NAME,
      employer: "OpenTable",
      role_title: "Senior Product Manager, Restaurant Product",
      job_description: jobDescription,
    })
    .select("id")
    .single();
  if (error) throw error;
  console.log(JSON.stringify({ profileId: created.id, name: OPENTABLE_PROFILE_NAME, action: "created" }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
