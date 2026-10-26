#!/usr/bin/env node
/**
 * Backfill prepared_qa_embeddings via Supabase Edge Function (gte-small).
 * Usage: npm run embed:qa:gte
 * Env: apps/web/.env.local (SUPABASE_URL, SERVICE_ROLE, optional SEED_USER_EMAIL, PROFILE_NAME filter)
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const EMBEDDING_MODEL = "gte-small";
const EMBEDDING_VERSION = "1";
const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 250;

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const seedEmail = process.env.SEED_USER_EMAIL ?? "poc-demo@interviewcopilot.app";
const profileNameFilter = process.env.EMBED_PROFILE_NAME ?? "Questrade";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function hashText(text) {
  return createHash("sha256")
    .update(`${EMBEDDING_MODEL}:${EMBEDDING_VERSION}:${text}`)
    .digest("hex");
}

function isInactive(meta) {
  if (!meta || typeof meta !== "object") return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function buildVariants(row) {
  const meta = row.navigator_meta ?? {};
  const variants = [];
  const canonical = row.question.trim();
  if (canonical.length >= 3) {
    variants.push({ variant_type: "canonical", question_variant: canonical, source_text: canonical });
  }
  for (const alt of meta.altPhrasings ?? []) {
    const t = String(alt).trim();
    if (t.length >= 3 && t !== canonical) {
      variants.push({ variant_type: "alt_phrasing", question_variant: t, source_text: t });
    }
  }
  const short = (meta.spokenAnswer ?? meta.shortAnswer ?? "").trim();
  if (short.length >= 12 && short !== canonical && !canonical.includes(short.slice(0, 40))) {
    const descriptor = short.slice(0, 320);
    variants.push({
      variant_type: "short_descriptor",
      question_variant: descriptor,
      source_text: descriptor,
    });
  }
  const seen = new Set();
  return variants.filter((v) => {
    const key = `${v.variant_type}:${v.question_variant}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function invokeGteEmbed(texts) {
  const res = await fetch(`${url}/functions/v1/gte-embed`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texts }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error ?? `gte-embed HTTP ${res.status}`);
  }
  if (!Array.isArray(body.embeddings) || body.embeddings.length !== texts.length) {
    throw new Error("gte-embed returned unexpected embeddings array");
  }
  return body.embeddings;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { data: users } = await admin.auth.admin.listUsers({ perPage: 200 });
  const user = users.users.find((u) => u.email === seedEmail);
  if (!user) throw new Error(`User not found: ${seedEmail}`);

  let profileQuery = admin.from("interview_profiles").select("id, name").eq("user_id", user.id);
  const { data: profiles } = await profileQuery;
  const profile = profiles?.find((p) => p.name.includes(profileNameFilter)) ?? profiles?.[0];
  if (!profile) throw new Error("No interview profile found");

  const { data: rows, error } = await admin
    .from("prepared_qa")
    .select("id, question, profile_id, navigator_meta")
    .eq("user_id", user.id)
    .eq("profile_id", profile.id);
  if (error) throw error;

  let active = (rows ?? []).filter((r) => !isInactive(r.navigator_meta));
  const filterIds = (process.env.EMBED_QA_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (filterIds.length > 0) {
    active = active.filter((r) => filterIds.includes(r.id));
  }
  const work = [];
  for (const row of active) {
    for (const v of buildVariants(row)) {
      work.push({
        prepared_qa_id: row.id,
        profile_id: row.profile_id,
        ...v,
        source_text_hash: hashText(v.source_text),
      });
    }
  }

  const { data: existing } = await admin
    .from("prepared_qa_embeddings")
    .select("prepared_qa_id, question_variant, embedding_model, embedding_version, source_text_hash")
    .in(
      "prepared_qa_id",
      active.map((r) => r.id)
    );

  const existingKey = new Map(
    (existing ?? []).map((e) => [
      `${e.prepared_qa_id}|${e.question_variant}|${e.embedding_model}|${e.embedding_version}`,
      e.source_text_hash,
    ])
  );

  const toEmbed = work.filter((w) => {
    const key = `${w.prepared_qa_id}|${w.question_variant}|${EMBEDDING_MODEL}|${EMBEDDING_VERSION}`;
    return existingKey.get(key) !== w.source_text_hash;
  });

  const report = {
    at: new Date().toISOString(),
    profile: profile.name,
    profileId: profile.id,
    activeQa: active.length,
    variantTotal: work.length,
    skippedUnchanged: work.length - toEmbed.length,
    embedded: 0,
    failed: [],
  };

  console.log(
    `Embedding ${toEmbed.length} variants (${report.skippedUnchanged} unchanged) for ${active.length} Q&As — ${profile.name}`
  );

  for (let i = 0; i < toEmbed.length; i += BATCH_SIZE) {
    const batch = toEmbed.slice(i, i + BATCH_SIZE);
    const texts = batch.map((b) => b.source_text);
    try {
      const embeddings = await invokeGteEmbed(texts);
      for (let j = 0; j < batch.length; j++) {
        const item = batch[j];
        const embedding = embeddings[j];
        const { error: upsertError } = await admin.from("prepared_qa_embeddings").upsert(
          {
            prepared_qa_id: item.prepared_qa_id,
            profile_id: item.profile_id,
            question_variant: item.question_variant,
            variant_type: item.variant_type,
            embedding,
            embedding_model: EMBEDDING_MODEL,
            embedding_version: EMBEDDING_VERSION,
            source_text_hash: item.source_text_hash,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "prepared_qa_id,question_variant,embedding_model,embedding_version" }
        );
        if (upsertError) {
          report.failed.push({ variant: item.question_variant.slice(0, 60), error: upsertError.message });
        } else {
          report.embedded += 1;
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      for (const item of batch) {
        report.failed.push({ variant: item.question_variant.slice(0, 60), error: message });
      }
    }
    if (i + BATCH_SIZE < toEmbed.length) await sleep(BATCH_DELAY_MS);
    process.stdout.write(`\rProgress ${Math.min(i + BATCH_SIZE, toEmbed.length)}/${toEmbed.length}`);
  }
  console.log("\nDone.");

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  writeFileSync(resolve(root, "data/migration/embed-gte-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("Report:", resolve(root, "data/migration/embed-gte-report.json"));
  console.log(JSON.stringify(report, null, 2));
  if (report.failed.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
