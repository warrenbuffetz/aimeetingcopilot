#!/usr/bin/env node
/**
 * Import simplii_people_leadership_20_qa.md — Simplii profile only.
 * Usage: node scripts/apply-simplii-people-leadership.mjs [--apply] [--embed]
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const SIMPLII_PL_PARENT_IMPORT_KEYS = {
  "simplii-pl-01": ["simplii-pl-04", "simplii-pl-06", "simplii-pl-14", "simplii-pl-16"],
  "simplii-pl-05": ["simplii-pl-06", "simplii-pl-16", "simplii-pl-04"],
  "simplii-pl-09": ["simplii-pl-11", "simplii-pl-10", "simplii-pl-17", "simplii-pl-14"],
  "simplii-pl-02": ["simplii-pl-17", "simplii-pl-15", "simplii-pl-19"],
  "simplii-pl-10": ["simplii-pl-11", "simplii-pl-20"],
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const MD_PATH = resolve(root, "data/migration/simplii_people_leadership_20_qa.md");

const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");

const PL_ALIASES = {
  "simplii-pl-01": [
    "how many people have reported to you",
    "how many direct reports",
    "tell me about your leadership style",
  ],
  "simplii-pl-05": [
    "how big was your avion team",
    "was the rbc team 14 or 15",
    "how do you lead a team without authority",
    "lead without formal authority",
  ],
  "simplii-pl-06": ["did you manage developers at rbc", "were developers your direct reports"],
  "simplii-pl-04": ["have you managed managers"],
  "simplii-pl-10": ["how do you deal with underperformance", "how do you handle poor performance"],
  "simplii-pl-09": ["how do you coach"],
};

/** Existing Simplii questions to merge into PL import keys (norm substring). */
const MERGE_BY_QUESTION = [
  {
    match: /how did you lead the 14.person cross.functional team at rbc/i,
    importKey: "simplii-pl-05",
    title: "How did you lead a 15-person RBC squad with no direct reports?",
  },
];

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

function rowHash(row) {
  return createHash("sha256")
    .update(JSON.stringify({ q: row.question, a: row.answer, m: row.navigator_meta, f: row.follow_ups }))
    .digest("hex");
}

function normQ(s) {
  return (s ?? "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function extractSpoken(section) {
  const lines = section
    .split("\n")
    .filter((l) => l.startsWith(">"))
    .map((l) => l.replace(/^>\s?/, "").trimEnd());
  return lines.join("\n\n").trim();
}

function parsePeopleLeadership(md) {
  const headerRe = /## (PL\d+)\.\s+(.+?)\n\n- \*\*Priority:\*\*\s*(P\d+)/g;
  const items = [];
  let m;
  while ((m = headerRe.exec(md)) !== null) {
    const pl = m[1];
    const num = pl.replace(/^PL/i, "").padStart(2, "0");
    const title = m[2].trim();
    const priority = m[3];
    const start = m.index;
    const next = md.indexOf("\n## PL", start + 4);
    const section = md.slice(start, next === -1 ? md.length : next);
    const category = section.match(/\*\*Category:\*\*\s*([^\n]+)/)?.[1]?.trim() ?? "";
    const answer = extractSpoken(section);
    const evidenceNote =
      section.match(/\*\*Evidence[^*]*\*\*\s*([^\n]+)/)?.[1]?.trim() ?? "";
    if (!answer) continue;
    items.push({
      pl,
      importKey: `simplii-pl-${num}`,
      title,
      priority,
      category,
      answer,
      evidenceNote,
    });
  }
  return items;
}

function evidenceStatus(item) {
  const n = item.evidenceNote.toLowerCase();
  if (item.pl === "11" || /illustrative scenario/i.test(n)) return "illustrative_scenario";
  if (/forward-looking|not substantiated|do not imply|general philosophy|general approach/i.test(n)) {
    return "rehearsal_framework";
  }
  if (/not established|unknown|do not assert/i.test(n)) return "unverified_detail";
  return "resume_supported";
}

function reviewNotes(item) {
  if (item.pl === "11") return `${item.evidenceNote} Needs authentic behavioural example.`;
  return item.evidenceNote;
}

function peopleMeta(item, extra = {}) {
  const tier = item.priority;
  return {
    importKey: item.importKey,
    librarySection: "people_leadership",
    libraryCategory: "leadership_behavioural",
    experienceModuleId: "leadership-general",
    experienceLabel: "People Leadership & Direct Reports",
    intent: "general",
    evidenceStatus: evidenceStatus(item),
    reviewNotes: reviewNotes(item),
    spokenAnswer: item.answer,
    shortAnswer: item.answer.split("\n\n")[0].slice(0, 320),
    preparationTier: tier,
    topicTags: [tier, "people_leadership", item.category, "simplii"],
    roundRelevance: {
      recruiter: "medium",
      hiring_manager: tier === "P0" ? "very_high" : "high",
      cross_functional_panel: tier === "P0" ? "very_high" : tier === "P1" ? "high" : "medium",
    },
    altPhrasings: PL_ALIASES[item.importKey] ?? [],
    sourceFile: "simplii_people_leadership_20_qa.md",
    adaptationType: "newly_authored",
    reviewStatus: "ok",
    revisionStatus: "current",
    ...extra,
  };
}

function fixRbcSquadText(text) {
  if (!text || typeof text !== "string") return text;
  let s = text;
  s = s.replace(/14-person cross-functional team/gi, "15-person cross-functional squad");
  s = s.replace(/14-person cross-functional squad/gi, "15-person cross-functional squad");
  s = s.replace(/leading a 14-person/gi, "leading a 15-person cross-functional squad including myself");
  s = s.replace(/with a 14-person cross-functional team/gi, "with a 15-person cross-functional squad, including myself");
  s = s.replace(/The 14-person figure describes/gi, "The squad was 15 people including me; the 14 teammates");
  s = s.replace(/The 14 people were a cross-functional team/gi, "The 14 teammates were a cross-functional squad");
  s = s.replace(/led a 14-person squad/gi, "led a 15-person cross-functional squad including myself");
  return s;
}

async function snapshotProfile(profileId) {
  const { data } = await admin.from("prepared_qa").select("*").eq("profile_id", profileId);
  const hash = createHash("sha256")
    .update((data ?? []).map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");
  return { hash, count: data?.length ?? 0 };
}

async function main() {
  const md = readFileSync(MD_PATH, "utf8");
  const items = parsePeopleLeadership(md);
  const report = {
    at: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    parsed: items.length,
    created: 0,
    updated: 0,
    merged: 0,
    rbcCorrections: 0,
    peopleLeadershipCount: 0,
    errors: [],
    questradeIntegrity: null,
  };

  if (items.length !== 20) {
    report.errors.push({ reason: "expected_20_pl_items", got: items.length });
  }

  const qtBefore = await snapshotProfile(QUESTRADE_PROFILE_ID);
  mkdirSync(resolve(root, "data/migration/baselines"), { recursive: true });
  writeFileSync(
    resolve(root, "data/migration/baselines/questrade-pre-people-leadership.json"),
    JSON.stringify({ hash: qtBefore.hash, count: qtBefore.count, at: report.at })
  );

  const { data: simpliiRows } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
  const byImportKey = new Map();
  const byNormQ = new Map();
  for (const r of simpliiRows ?? []) {
    const ik = r.navigator_meta?.importKey;
    if (ik) byImportKey.set(ik, r);
    byNormQ.set(normQ(r.question), r);
  }
  const userId = simpliiRows?.[0]?.user_id;
  if (!userId) throw new Error("No Simplii user_id");

  const upsert = async (payload, importKey, existingRowId) => {
    const existing = existingRowId
      ? { id: existingRowId }
      : byImportKey.get(importKey);
    if (!apply) {
      existing?.id ? report.updated++ : report.created++;
      return existing?.id;
    }
    if (existing?.id) {
      const { error } = await admin.from("prepared_qa").update(payload).eq("id", existing.id);
      if (error) throw error;
      report.updated++;
      byImportKey.set(importKey, { ...payload, id: existing.id });
      return existing.id;
    }
    const { data, error } = await admin.from("prepared_qa").insert(payload).select("id").single();
    if (error) throw error;
    byImportKey.set(importKey, { ...payload, id: data.id });
    report.created++;
    return data.id;
  };

  for (const item of items) {
    const meta = peopleMeta(item);
    const merge = MERGE_BY_QUESTION.find((m) => m.importKey === item.importKey);
    let existing = byImportKey.get(item.importKey);
    if (!existing && merge) {
      for (const r of simpliiRows ?? []) {
        if (merge.match.test(r.question)) {
          existing = r;
          report.merged++;
          break;
        }
      }
    }
    if (!existing) {
      const dup = byNormQ.get(normQ(item.title));
      if (dup && !dup.navigator_meta?.importKey?.startsWith("simplii-pl-")) {
        existing = dup;
        report.merged++;
      }
    }

    const question = merge?.title ?? item.title;
    await upsert(
      {
        user_id: userId,
        profile_id: SIMPLII_PROFILE_ID,
        question,
        answer: item.answer,
        category: "People Leadership",
        is_preferred: item.priority === "P0",
        is_authoritative: true,
        follow_ups: existing?.follow_ups ?? [],
        navigator_meta: { ...(existing?.navigator_meta ?? {}), ...meta },
        updated_at: new Date().toISOString(),
      },
      item.importKey,
      existing?.id
    );
  }

  if (apply) {
    const { data: afterRows } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
    const byKey = new Map(afterRows.map((r) => [r.navigator_meta?.importKey, r]));

    for (const [parentKey, children] of Object.entries(SIMPLII_PL_PARENT_IMPORT_KEYS)) {
      const parent = byKey.get(parentKey);
      if (!parent) continue;
      for (const childKey of children) {
        const child = byKey.get(childKey);
        if (!child) continue;
        const fu = Array.isArray(parent.follow_ups) ? [...parent.follow_ups] : [];
        const probe = child.question.slice(0, 80);
        if (!fu.some((f) => f.question === probe)) {
          fu.push({ question: probe, answer: child.answer });
        }
        const related = new Set(parent.navigator_meta?.relatedQuestionIds ?? []);
        related.add(child.id);
        await admin
          .from("prepared_qa")
          .update({
            follow_ups: fu,
            navigator_meta: { ...parent.navigator_meta, relatedQuestionIds: [...related] },
            updated_at: new Date().toISOString(),
          })
          .eq("id", parent.id);
      }
    }

    for (const row of afterRows) {
      const fixedAnswer = fixRbcSquadText(row.answer);
      const meta = { ...(row.navigator_meta ?? {}) };
      const fixedSpoken = fixRbcSquadText(meta.spokenAnswer);
      const fixedShort = fixRbcSquadText(meta.shortAnswer);
      let q = row.question;
      if (/14-person cross-functional team at rbc/i.test(q)) {
        q = "How did you lead a 15-person RBC squad with no direct reports?";
      }
      const changed =
        fixedAnswer !== row.answer ||
        fixedSpoken !== meta.spokenAnswer ||
        fixedShort !== meta.shortAnswer ||
        q !== row.question;
      if (!changed) continue;
      report.rbcCorrections++;
      if (fixedSpoken) meta.spokenAnswer = fixedSpoken;
      if (fixedShort) meta.shortAnswer = fixedShort;
      await admin
        .from("prepared_qa")
        .update({
          question: q,
          answer: fixedAnswer,
          navigator_meta: meta,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
    }

    report.peopleLeadershipCount = afterRows.filter(
      (r) => r.navigator_meta?.librarySection === "people_leadership"
    ).length;
  } else {
    report.peopleLeadershipCount = items.length;
  }

  const qtAfter = await snapshotProfile(QUESTRADE_PROFILE_ID);
  report.questradeIntegrity = { unchanged: qtBefore.hash === qtAfter.hash, count: qtAfter.count };

  const out = resolve(root, "data/migration/simplii-people-leadership-apply-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (!report.questradeIntegrity.unchanged) {
    console.error("Questrade integrity FAILED");
    process.exit(1);
  }

  if (apply && embed) {
    await new Promise((res, rej) => {
      const child = spawn("npm", ["run", "embed:qa:gte"], {
        cwd: root,
        stdio: "inherit",
        env: { ...process.env, EMBED_PROFILE_NAME: "Simplii" },
      });
      child.on("exit", (c) => (c === 0 ? res() : rej(new Error(`embed ${c}`))));
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
