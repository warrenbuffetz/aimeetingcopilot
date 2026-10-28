#!/usr/bin/env node
/**
 * Full Simplii profile Q&A review pack (all active prepared rows).
 *   node scripts/generate-simplii-all-qa-review.mjs
 * Output: data/review/simplii-all-questions-and-answers.md
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const SIMPLII_PROFILE_NAME = "Simplii Financial — Senior Product Manager";
const OUT_PATH = resolve(root, "data/review/simplii-all-questions-and-answers.md");
const FALLBACK_JSON = resolve(root, "imports/simplii_final_qa.json");

const SECTION_ORDER = [
  "career_motivation",
  "product_experience",
  "product_banking_knowledge",
  "questrade_cases",
  "leadership_behavioural",
  "people_leadership",
  "_other",
];

const SECTION_LABELS = {
  career_motivation: "Career & Motivation",
  product_experience: "My Product Experience",
  product_banking_knowledge: "Product & Banking Knowledge",
  questrade_cases: "Questrade Product Cases",
  leadership_behavioural: "Leadership & Behavioural",
  people_leadership: "People Leadership & Direct Reports",
  _other: "Other / Unsectioned",
};

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

function isInactive(meta) {
  if (!meta) return false;
  if (meta.retrievalExcluded) return true;
  return meta.revisionStatus === "superseded" || meta.revisionStatus === "archived";
}

function normCompare(s) {
  return (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function looksTruncated(text) {
  if (!text?.trim()) return true;
  const t = text.trim();
  return t.endsWith("…") || t.endsWith("...") || t.endsWith("\u2026");
}

function pickAnswer(row) {
  const canonical = row.answer?.trim() || "";
  const spoken = (row.spokenAnswer ?? row.navigatorMeta?.spokenAnswer)?.trim() || "";
  if (spoken && !looksTruncated(spoken)) return { body: spoken, source: "spoken" };
  if (canonical) return { body: canonical, source: spoken ? "canonical_fallback" : "canonical" };
  return { body: spoken || "—", source: "missing" };
}

function normalizeDbRow(r) {
  const meta = r.navigator_meta ?? {};
  return {
    id: r.id,
    question: r.question,
    answer: r.answer,
    spokenAnswer: r.spokenAnswer ?? meta.spokenAnswer,
    category: r.category,
    navigatorMeta: meta,
    externalId: meta.importKey ?? meta.externalContentId ?? r.id,
    librarySection: meta.librarySection ?? "_other",
    experienceLabel: meta.experienceLabel ?? "",
    preparationTier: meta.preparationTier,
    followUps: r.follow_ups ?? [],
  };
}

function normalizeImportRecord(r) {
  return {
    id: r.externalId,
    question: r.canonicalQuestion ?? r.question,
    answer: r.answer,
    spokenAnswer: r.spokenAnswer,
    category: r.category,
    navigatorMeta: {
      librarySection: r.librarySection,
      experienceLabel: r.experienceLabel,
      importKey: r.externalId,
      preparationTier: r.preparationTier,
    },
    externalId: r.externalId,
    librarySection: r.librarySection ?? "_other",
    experienceLabel: r.experienceLabel ?? "",
    preparationTier: r.preparationTier,
    followUps: r.followUps ?? [],
  };
}

async function loadFromSupabase() {
  loadEnv();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data, error } = await admin
    .from("prepared_qa")
    .select("*")
    .eq("profile_id", SIMPLII_PROFILE_ID)
    .order("question", { ascending: true });

  if (error) throw error;
  return (data ?? [])
    .filter((r) => !isInactive(r.navigator_meta))
    .map(normalizeDbRow);
}

function loadFromImportFallback() {
  const pkg = JSON.parse(readFileSync(FALLBACK_JSON, "utf8"));
  return (pkg.records ?? [])
    .filter((r) => r.revisionStatus !== "superseded" && r.revisionStatus !== "archived" && !r.retrievalExcluded)
    .map(normalizeImportRecord);
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function renderRow(lines, row, indexInSection) {
  const q = row.question?.trim() || "—";
  const pick = pickAnswer(row);
  const meta = row.navigatorMeta ?? {};
  const anchor = slug(`${row.externalId || row.id}-${q}`);

  lines.push(`### ${indexInSection}. ${q}`, "");
  lines.push(`<a id="${anchor}"></a>`, "");
  lines.push(`- **Import key:** \`${row.externalId ?? row.id}\``);
  if (row.id && row.id !== row.externalId) lines.push(`- **Library ID:** \`${row.id}\``);
  if (row.experienceLabel) lines.push(`- **Experience:** ${row.experienceLabel}`);
  if (row.preparationTier || meta.preparationTier) {
    lines.push(`- **Tier:** ${row.preparationTier ?? meta.preparationTier}`);
  }
  if (meta.evidenceStatus) lines.push(`- **Evidence:** ${meta.evidenceStatus}`);
  lines.push(
    "",
    pick.source === "spoken"
      ? "**Answer (spoken):**"
      : pick.source === "canonical_fallback"
        ? "**Answer (canonical — spoken was truncated/missing):**"
        : "**Answer:**",
    "",
    pick.body,
    ""
  );

  const fus = row.followUps ?? [];
  if (fus.length > 0) {
    lines.push(`**Embedded follow-ups (${fus.length}):**`, "");
    for (const fu of fus) {
      lines.push(`- **Q:** ${fu.question}`, "", fu.answer, "");
    }
  }
  lines.push("---", "");
}

async function main() {
  let rows;
  let source = "supabase";
  try {
    rows = await loadFromSupabase();
    if (!rows?.length) {
      rows = loadFromImportFallback();
      source = "imports/simplii_final_qa.json (DB empty or unavailable)";
    }
  } catch (e) {
    console.warn("Supabase load failed, using import JSON:", e.message);
    rows = loadFromImportFallback();
    source = "imports/simplii_final_qa.json (fallback)";
  }

  rows.sort((a, b) => a.question.localeCompare(b.question));

  const bySection = new Map();
  for (const s of SECTION_ORDER) bySection.set(s, []);
  for (const row of rows) {
    const sec = SECTION_LABELS[row.librarySection] ? row.librarySection : "_other";
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec).push(row);
  }

  const lines = [];
  lines.push("# Simplii — All prepared questions & answers", "");
  lines.push(`Generated: ${new Date().toISOString()}`, "");
  lines.push(`Profile: **${SIMPLII_PROFILE_NAME}** (\`${SIMPLII_PROFILE_ID}\`).`, "");
  lines.push(`Source: ${source}.`, "");
  lines.push(`**Total active rows:** ${rows.length}`, "");
  lines.push("## Table of contents", "");
  for (const sec of SECTION_ORDER) {
    const group = bySection.get(sec) ?? [];
    if (group.length === 0) continue;
    lines.push(`- [${SECTION_LABELS[sec] ?? sec}](#${slug(SECTION_LABELS[sec] ?? sec)}) (${group.length})`);
  }
  lines.push("", "---", "");

  for (const sec of SECTION_ORDER) {
    const group = bySection.get(sec) ?? [];
    if (group.length === 0) continue;
    const title = SECTION_LABELS[sec] ?? sec;
    lines.push(`## ${title}`, "");
    lines.push(`<a id="${slug(title)}"></a>`, "");
    group.sort((a, b) => a.question.localeCompare(b.question));
    group.forEach((row, i) => renderRow(lines, row, i + 1));
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, lines.join("\n"), "utf8");
  console.log(`Wrote ${rows.length} Q&As → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
