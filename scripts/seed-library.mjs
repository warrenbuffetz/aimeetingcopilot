#!/usr/bin/env node
/**
 * Seed prepared Q&A from data/seed/*.json into Supabase for a given user.
 * Usage: node scripts/seed-library.mjs [path-to-json]
 * Loads env from apps/web/.env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { expandPreparedQa } from "./expand-seed-detect.mjs";

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
const openaiKey = process.env.OPENAI_API_KEY;
const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local");
  process.exit(1);
}

const jsonPath = resolve(root, process.argv[2] ?? "data/seed/questrade-interview.json");
const seed = JSON.parse(readFileSync(jsonPath, "utf8"));

if (seed.doNotSeedUntilRevisions && process.env.FORCE_SEED !== "1") {
  console.error(
    `Seed file is marked draft (${jsonPath}). Send revisions first, set doNotSeedUntilRevisions to false, or run with FORCE_SEED=1 to override.`
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function findUserId() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email === seedEmail) ?? data.users[0];
  if (!user) throw new Error(`No user found. Sign in once (POC) or set SEED_USER_EMAIL.`);
  return user.id;
}

async function embed(text) {
  if (!openaiKey || openaiKey.startsWith("sk-...")) return null;
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000), dimensions: 1536 }),
  });
  if (!res.ok) {
    console.warn("Embedding skipped:", (await res.text()).slice(0, 200));
    return null;
  }
  const body = await res.json();
  return body.data[0].embedding;
}

async function upsertEmbedding(userId, profileId, row) {
  const content = `${row.question}\n\n${row.answer}`;
  const embedding = await embed(content);
  if (!embedding) return;
  await admin.from("search_embeddings").upsert(
    {
      user_id: userId,
      profile_id: profileId,
      content_type: "prepared_qa",
      source_id: row.id,
      title: row.question,
      content,
      embedding,
      metadata: {
        is_preferred: row.is_preferred,
        category: row.category,
        part: row.part,
        notes: row.notes,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,content_type,source_id" }
  );
}

async function main() {
  const userId = await findUserId();
  console.log("Seeding for user:", seedEmail, userId);

  let profileId = null;
  if (seed.profile) {
    const { data: existing } = await admin
      .from("interview_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("name", seed.profile.name)
      .maybeSingle();

    if (existing) {
      profileId = existing.id;
      await admin
        .from("interview_profiles")
        .update({
          employer: seed.profile.employer,
          role_title: seed.profile.role_title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);
    } else {
      const { data: created, error } = await admin
        .from("interview_profiles")
        .insert({
          user_id: userId,
          name: seed.profile.name,
          employer: seed.profile.employer,
          role_title: seed.profile.role_title,
        })
        .select("id")
        .single();
      if (error) throw error;
      profileId = created.id;
    }
    console.log("Profile:", seed.profile.name, profileId);
  }

  if (seed.retireQuestions?.length) {
    for (const q of seed.retireQuestions) {
      const { data: rows } = await admin.from("prepared_qa").select("id").eq("user_id", userId).eq("question", q);
      for (const r of rows ?? []) {
        await admin.from("prepared_qa").delete().eq("id", r.id);
        await admin.from("search_embeddings").delete().eq("content_type", "prepared_qa").eq("source_id", r.id);
        console.log("Retired:", q.slice(0, 50));
      }
    }
  }

  for (const qa of seed.preparedQa.map(expandPreparedQa)) {
    const { data: existing } = await admin
      .from("prepared_qa")
      .select("id")
      .eq("user_id", userId)
      .eq("question", qa.question)
      .maybeSingle();

    let row;
    if (existing) {
      const { data, error } = await admin
        .from("prepared_qa")
        .update({
          answer: qa.answer,
          category: qa.category,
          is_preferred: qa.isPreferred ?? false,
          profile_id: profileId,
          follow_ups: qa.followUps ?? [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      row = data;
      console.log("Updated:", qa.question.slice(0, 50));
    } else {
      const { data, error } = await admin
        .from("prepared_qa")
        .insert({
          user_id: userId,
          profile_id: profileId,
          question: qa.question,
          answer: qa.answer,
          category: qa.category,
          is_preferred: qa.isPreferred ?? false,
          is_authoritative: true,
          follow_ups: qa.followUps ?? [],
        })
        .select()
        .single();
      if (error) throw error;
      row = data;
      console.log("Created:", qa.question.slice(0, 50));
    }

    await upsertEmbedding(userId, profileId, {
      id: row.id,
      question: row.question,
      answer: row.answer,
      is_preferred: row.is_preferred,
      category: row.category,
      part: qa.part,
      notes: qa.notes,
    });
  }

  console.log("Done.", seed.preparedQa.length, "Q&A items.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
