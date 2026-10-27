#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const QT = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";

function loadEnv() {
  const path = resolve(root, "apps/web/.env.local");
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

const profileArg = process.argv.find((a) => a.startsWith("--profile="))?.split("=")[1] ?? "questrade";
const profileId = profileArg === "simplii" ? null : QT;

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let query = admin.from("prepared_qa").select("question, answer, is_preferred, navigator_meta");
if (profileId) query = query.eq("profile_id", profileId);
else {
  const { data: p } = await admin
    .from("interview_profiles")
    .select("id")
    .eq("name", "Simplii Financial — Senior Product Manager")
    .single();
  query = query.eq("profile_id", p.id);
}

const { data, error } = await query;
if (error) throw error;

const rows = (data ?? []).filter(
  (r) =>
    r.navigator_meta?.contentPackage === "john-experience-depth-v1" ||
    String(r.navigator_meta?.importKey ?? "").includes("john-experience-depth-v1")
);

rows.sort((a, b) => (a.navigator_meta?.importKey ?? "").localeCompare(b.navigator_meta?.importKey ?? ""));

const needs = rows.filter(
  (r) => r.navigator_meta?.reviewStatus === "needs_review" || r.navigator_meta?.reviewRequired === true
);

const md = [
  `# Experience-gap current answers (${profileArg})`,
  "",
  `**${needs.length}** cards with \`needs_review\` (full + short from DB). Same answer text on Simplii.`,
  "",
  ...needs.map((r, i) => {
    const card = (r.navigator_meta?.importKey ?? "").replace(/^.*-v1-/, "") || "?";
    const short = r.navigator_meta?.shortAnswer?.trim();
    return [
      `## ${i + 1}. ${r.question}`,
      "",
      `- **Card:** \`${card}\``,
      `- **Evidence:** ${r.navigator_meta?.evidenceStatus ?? "?"}`,
      `- **Preferred:** ${r.is_preferred} · **Retrieval excluded:** ${r.navigator_meta?.retrievalExcluded}`,
      "",
      "### Full answer",
      "",
      r.answer,
      short ? `\n### Short alternative\n\n${short}` : "",
    ].join("\n");
  }),
].join("\n\n---\n\n");

mkdirSync(resolve(root, "data/migration"), { recursive: true });
const out = resolve(root, `data/migration/experience-gap-current-answers-${profileArg}.md`);
writeFileSync(out, md);
console.log(out, needs.length, "cards");
