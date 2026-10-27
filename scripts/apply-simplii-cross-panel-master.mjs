#!/usr/bin/env node
/**
 * Apply simplii_cross_panel_qa_master.md to Simplii profile only.
 * Usage: node scripts/apply-simplii-cross-panel-master.mjs [--apply] [--embed]
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SIMPLII_PROFILE_ID = "1aff0813-6615-4a12-bfd6-ce7603604f6b";
const QUESTRADE_PROFILE_ID = "f96f6db8-c0e9-4341-be68-c29f6975dc5e";
const MD_PATH = resolve(root, "data/migration/simplii_cross_panel_qa_master.md");

const apply = process.argv.includes("--apply");
const embed = process.argv.includes("--embed");

const HP_PARENTS = {
  "simplii-hp-01": ["simplii-jd-002", "simplii-panel-gap-01"],
  "simplii-hp-02": ["simplii-jd-015", "simplii-panel-gap-02", "simplii-panel-gap-03"],
  "simplii-hp-03": [
    "simplii-panel-gap-07",
    "simplii-from-11375f03-31fa-45da-8557-488a8cc63beb",
  ],
  "simplii-hp-04": [
    "simplii-jd-005",
    "simplii-from-3c199d05-67ba-4f4c-aa98-d7f06a2cc3c6",
    "simplii-from-bfaa86a1-2c06-4c4f-880a-bf2718e8a330",
    "simplii-john-experience-depth-v1-rbc-discovery-context",
    "simplii-from-11375f03-31fa-45da-8557-488a8cc63beb",
  ],
  "simplii-hp-05": ["simplii-jd-007", "simplii-panel-gap-02"],
  "simplii-hp-06": ["simplii-jd-002", "simplii-panel-gap-01"],
  "simplii-hp-07": ["simplii-jd-004", "simplii-panel-gap-04", "simplii-panel-bank-01"],
  "simplii-hp-08": ["simplii-from-557cbeab-d17e-48bc-99de-1a54625ee37f", "simplii-panel-gap-05"],
  "simplii-hp-09": ["simplii-jd-003", "simplii-jd-021", "simplii-panel-gap-03"],
  "simplii-hp-10": ["simplii-jd-007", "simplii-panel-gap-02"],
};

const HP_SPECS = [
  {
    importKey: "simplii-hp-01",
    title: "HBC — Which step had the highest drop-off, what changed, and how did you measure the 15%?",
    probes: [
      "Which step had the highest drop-off",
      "how did you measure the 15%",
      "what did you change in the HBC application funnel",
    ],
  },
  {
    importKey: "simplii-hp-02",
    title: "RBC — What was the most contentious decision with Payments, Risk or Financial Operations?",
    probes: [
      "most contentious decision with Payments",
      "who disagreed with you on the payout",
      "Risk or Financial Operations pushback",
    ],
  },
  {
    importKey: "simplii-hp-03",
    title:
      "RBC — Separate ~3,200 requests, ~$1.2M in annualized payouts, ~99% within 24 hours and 5M+ enterprise events.",
    probes: [
      "what is the denominator",
      "3,200 withdrawal requests",
      "5 million settlement events",
      "annualized payouts",
    ],
  },
  {
    importKey: "simplii-hp-04",
    title: "RBC — After a timeout, how do you prevent duplicates and establish payment status without owning the rail?",
    probes: [
      "payment timeout",
      "prevent duplicate payment",
      "duplicate submission",
      "without owning the enterprise payment",
    ],
  },
  {
    importKey: "simplii-hp-05",
    title: "Arc'teryx — What was deliberately deferred, and what was approved before you left?",
    probes: [
      "what did you defer at Arc'teryx",
      "deliberately deferred",
      "approved before you left",
    ],
  },
  {
    importKey: "simplii-hp-06",
    title: "Discovery — When did evidence overturn a hypothesis you personally preferred?",
    probes: [
      "hypothesis proved wrong",
      "evidence overturn",
      "original hypothesis was wrong",
    ],
  },
  {
    importKey: "simplii-hp-07",
    title: "Prioritization — Which two genuine initiatives competed, and what exactly did you defer?",
    probes: ["what did you actually defer", "two initiatives competed", "opportunity cost"],
  },
  {
    importKey: "simplii-hp-08",
    title: "Metrics — Give a rigorous numerator, denominator, window, segments and guardrail.",
    probes: ["numerator and denominator", "what's the denominator", "guardrail metric"],
  },
  {
    importKey: "simplii-hp-09",
    title: "Delivery — Give an actual acceptance-criteria change after engineering or QA raised an issue.",
    probes: [
      "acceptance criteria change",
      "QA raised",
      "engineering raised a concern about the story",
    ],
  },
  {
    importKey: "simplii-hp-10",
    title: "Leadership — Describe a decision a partner disagreed with, what happened, and what you learned.",
    probes: [
      "partner disagreed",
      "what would you do differently",
      "who disagreed with your decision",
    ],
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

function extractBlockquote(section) {
  const lines = section
    .split("\n")
    .filter((l) => l.startsWith(">"))
    .map((l) => l.replace(/^>\s?/, "").trimEnd());
  return lines.join("\n\n").trim();
}

function extractSpokenAnswer(section) {
  const block = extractBlockquote(section);
  if (block) return block;
  const m = section.match(/\*\*Spoken answer[^*]*\*\*\s*\n+([\s\S]*?)(?=\n\*\*|$)/i);
  if (!m) return "";
  return m[1].replace(/^>\s?/gm, "").trim();
}

function parsePartI(content) {
  const part = content.match(/## Part I[\s\S]*?(?=## Part II)/)?.[0] ?? "";
  const items = [];
  const re =
    /#### \d+\. ([^\n]+)\n\*\*Key:\*\* `([^`]+)`([\s\S]*?)(?=\n#### \d+\. |\n### Keep mostly)/g;
  for (const m of part.matchAll(re)) {
    items.push({
      title: m[1].trim(),
      importKey: m[2].trim(),
      answer: extractSpokenAnswer(m[3]),
      part: "I",
    });
  }
  return items;
}

function parsePartII_fixed(content) {
  const part = content.match(/## Part II[\s\S]*?(?=## Part III)/)?.[0] ?? "";
  const items = [];
  const re =
    /#### ([A-Z]\d+)\. ([^\n]+)\n\*\*Key:\*\* `([^`]+)`[^\n]*(?:\*\*Priority:\*\* (P\d))?([\s\S]*?)(?=\n#### [A-Z]\d+\. |\n### [A-Z]\.)/g;
  for (const m of part.matchAll(re)) {
    const priority = (m[4] ?? "P1").trim();
    const section = m[5] ?? "";
    let spoken = "";
    const spokenBlock = section.match(/\*\*Spoken answer\*\*\s*\n+([\s\S]*?)(?=\n\*\*Follow-up|\n#### |\n### )/i);
    if (spokenBlock) spoken = spokenBlock[1].replace(/^>\s?/gm, "").trim();
    else spoken = extractSpokenAnswer(section);
    items.push({
      code: m[1],
      title: m[2].trim(),
      importKey: m[3].trim(),
      priority,
      answer: spoken,
      part: "II",
    });
  }
  return items;
}

function parseHP(content) {
  const out = new Map();
  const re = /### (HP\d+)\. ([^\n]+)\n([\s\S]*?)(?=\n---\n\n### HP|\n### Cross-question)/g;
  for (const m of content.matchAll(re)) {
    const body = m[3];
    const spokenMatch = body.match(/\*\*Spoken answer[^*]*\*\*\s*\n+([\s\S]*?)(?=\n\*\*If pressed|\n\*\*Evidence|\n\*\*Integrity|\n\*\*Related)/i);
    let spoken = "";
    if (spokenMatch) spoken = spokenMatch[1].replace(/^>\s?/gm, "").trim();
    else spoken = extractBlockquote(body);
    const evidence = body.match(/\*\*Not established:\*\*([^\n]+)/i)?.[1]?.trim();
    out.set(m[1], { title: m[2].trim(), answer: spoken, evidenceNotes: evidence });
  }
  return out;
}

function normQ(s) {
  return (s ?? "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function panelRoundMeta(priority, tags = []) {
  const tier = priority === "P0" ? "P0" : priority === "P1" ? "P1" : "P2";
  const rr = {
    recruiter: priority === "P0" ? "high" : "medium",
    hiring_manager: "very_high",
    cross_functional_panel: priority === "P0" ? "very_high" : priority === "P1" ? "high" : "medium",
  };
  return {
    preparationTier: tier,
    topicTags: [...tags, tier, "cross_panel_2026"],
    roundRelevance: rr,
    isPreferred: priority === "P0",
  };
}

async function snapshotProfile(profileId) {
  const { data } = await admin.from("prepared_qa").select("*").eq("profile_id", profileId);
  const hash = createHash("sha256")
    .update((data ?? []).map((r) => rowHash(r)).sort().join("|"))
    .digest("hex");
  return { rows: data ?? [], hash, count: data?.length ?? 0 };
}

async function main() {
  const md = readFileSync(MD_PATH, "utf8");
  const partI = parsePartI(md);
  const partII = parsePartII_fixed(md);
  const hpParsed = parseHP(md);

  const report = {
    at: new Date().toISOString(),
    mode: apply ? "apply" : "dry-run",
    partI: partI.length,
    partII: partII.length,
    hp: HP_SPECS.length,
    updated: 0,
    created: 0,
    skipped: [],
    errors: [],
    questradeIntegrity: null,
  };

  const qtBefore = await snapshotProfile(QUESTRADE_PROFILE_ID);
  mkdirSync(resolve(root, "data/migration/baselines"), { recursive: true });
  writeFileSync(
    resolve(root, "data/migration/baselines/questrade-pre-cross-panel.json"),
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

  const simpliiBefore = await snapshotProfile(SIMPLII_PROFILE_ID);
  writeFileSync(
    resolve(root, "data/migration/baselines/simplii-pre-cross-panel.json"),
    JSON.stringify({ hash: simpliiBefore.hash, count: simpliiBefore.count, at: report.at })
  );

  const userId = simpliiRows?.[0]?.user_id;
  if (!userId) throw new Error("No Simplii rows / user_id");

  const upsertRow = async (payload, importKey) => {
    const existing = byImportKey.get(importKey);
    if (!apply) {
      if (existing) report.updated++;
      else report.created++;
      return existing?.id;
    }
    if (existing) {
      const { error } = await admin.from("prepared_qa").update(payload).eq("id", existing.id);
      if (error) throw error;
      report.updated++;
      return existing.id;
    }
    const { data, error } = await admin.from("prepared_qa").insert(payload).select("id").single();
    if (error) throw error;
    byImportKey.set(importKey, { ...payload, id: data.id });
    report.created++;
    return data.id;
  };

  for (const item of partI) {
    if (!item.answer) {
      report.skipped.push({ importKey: item.importKey, reason: "empty_answer" });
      continue;
    }
    const existing = byImportKey.get(item.importKey);
    const meta = { ...(existing?.navigator_meta ?? {}) };
    meta.reviewNotes = item.title;
    Object.assign(meta, panelRoundMeta("P0", ["part_I_revision"]));
    const shortAnswer = item.answer.split("\n\n")[0].slice(0, 320);
    meta.spokenAnswer = item.answer;
    meta.shortAnswer = shortAnswer;

    await upsertRow(
      {
        user_id: userId,
        profile_id: SIMPLII_PROFILE_ID,
        question: existing?.question ?? item.title,
        answer: item.answer,
        category: existing?.category ?? "Panel",
        is_preferred: true,
        is_authoritative: true,
        follow_ups: existing?.follow_ups ?? [],
        navigator_meta: meta,
        updated_at: new Date().toISOString(),
      },
      item.importKey
    );
  }

  for (const item of partII) {
    if (!item.answer) {
      report.skipped.push({ importKey: item.importKey, reason: "empty_answer" });
      continue;
    }
    const existing = byImportKey.get(item.importKey);
    const dupRow = !existing ? byNormQ.get(normQ(item.title)) : null;
    if (dupRow && !existing) {
      report.skipped.push({ importKey: item.importKey, reason: "semantic_duplicate", existingId: dupRow.id });
      const meta = { ...(dupRow.navigator_meta ?? {}) };
      meta.spokenAnswer = item.answer;
      meta.shortAnswer = item.answer.split("\n\n")[0].slice(0, 320);
      if (apply) {
        await admin
          .from("prepared_qa")
          .update({ answer: item.answer, navigator_meta: meta, updated_at: new Date().toISOString() })
          .eq("id", dupRow.id);
        report.updated++;
      }
      continue;
    }

    const meta = { ...(existing?.navigator_meta ?? {}) };
    Object.assign(meta, panelRoundMeta(item.priority, ["part_II_new", item.code]));
    meta.importKey = item.importKey;
    meta.spokenAnswer = item.answer;
    meta.shortAnswer = item.answer.split("\n\n")[0].slice(0, 320);
    meta.adaptationType = existing ? meta.adaptationType ?? "lightly_edited" : "newly_authored";
    meta.sourceFile = "simplii_cross_panel_qa_master.md";

    await upsertRow(
      {
        user_id: userId,
        profile_id: SIMPLII_PROFILE_ID,
        question: existing?.question ?? item.title,
        answer: item.answer,
        category: existing?.category ?? "Panel",
        is_preferred: item.priority === "P0",
        is_authoritative: true,
        follow_ups: existing?.follow_ups ?? [],
        navigator_meta: meta,
        updated_at: new Date().toISOString(),
      },
      item.importKey
    );
  }

  for (const spec of HP_SPECS) {
    const hpIndex = String(parseInt(spec.importKey.replace("simplii-hp-", ""), 10));
    const parsed = hpParsed.get(`HP${hpIndex}`);
    const answer = parsed?.answer ?? "";
    if (!answer) {
      report.errors.push({ importKey: spec.importKey, reason: "missing_hp_parse" });
      continue;
    }
    const existing = byImportKey.get(spec.importKey);
    const meta = { ...(existing?.navigator_meta ?? {}) };
    meta.importKey = spec.importKey;
    meta.hpFollowUp = true;
    meta.evidenceBoundary = parsed?.evidenceNotes;
    meta.intent = "challenges_lessons";
    meta.retrievalRole = "high_pressure_followup";
    Object.assign(meta, panelRoundMeta("P1", ["HP", hpIndex]));
    meta.altPhrasings = spec.probes;
    meta.spokenAnswer = answer;
    meta.shortAnswer = answer.split("\n\n")[0].slice(0, 280);

    const id = await upsertRow(
      {
        user_id: userId,
        profile_id: SIMPLII_PROFILE_ID,
        question: spec.title,
        answer,
        category: "Follow-up",
        is_preferred: false,
        is_authoritative: true,
        follow_ups: [],
        navigator_meta: meta,
        updated_at: new Date().toISOString(),
      },
      spec.importKey
    );

  }

  if (apply) {
    const { data: afterSimplii } = await admin.from("prepared_qa").select("*").eq("profile_id", SIMPLII_PROFILE_ID);
    const byKey = new Map(afterSimplii.map((r) => [r.navigator_meta?.importKey, r]));

    for (const [hpKey, parents] of Object.entries(HP_PARENTS)) {
      const hpRow = byKey.get(hpKey);
      if (!hpRow) continue;
      for (const parentKey of parents) {
        const parent = byKey.get(parentKey);
        if (!parent) continue;
        const fu = Array.isArray(parent.follow_ups) ? [...parent.follow_ups] : [];
        const probe = hpRow.question.slice(0, 80);
        if (!fu.some((f) => f.question === probe)) {
          fu.push({ question: probe, answer: hpRow.answer });
        }
        const related = new Set(parent.navigator_meta?.relatedQuestionIds ?? []);
        related.add(hpRow.id);
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
  }

  const qtAfter = await snapshotProfile(QUESTRADE_PROFILE_ID);
  report.questradeIntegrity = {
    unchanged: qtBefore.hash === qtAfter.hash,
    before: qtBefore.hash,
    after: qtAfter.hash,
    countBefore: qtBefore.count,
    countAfter: qtAfter.count,
  };

  writeFileSync(resolve(root, "data/migration/simplii-cross-panel-apply-report.json"), JSON.stringify(report, null, 2));
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
