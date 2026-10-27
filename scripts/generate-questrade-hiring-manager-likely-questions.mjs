#!/usr/bin/env node
/**
 * Hiring-manager likely-question reference (editorial top-40 + library scoring).
 *   node scripts/generate-questrade-hiring-manager-likely-questions.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const lib = JSON.parse(readFileSync(resolve(root, "exports/questrade_interview_library.json"), "utf8"));
const top115 = JSON.parse(
  readFileSync(resolve(root, "data/editorial/questrade-top115-curated-contextual-followups.json"), "utf8"),
);
const inv = JSON.parse(readFileSync(resolve(root, "docs/questrade-interview-ranked-inventory.json"), "utf8"));

const byId = new Map(lib.records.filter((r) => r.status === "active").map((r) => [r.id, r]));
const byQuestion = new Map(
  lib.records.filter((r) => r.status === "active").map((r) => [r.question.trim().toLowerCase(), r]),
);

function resolveId(anchor) {
  if (anchor.anchorSourceId && byId.has(anchor.anchorSourceId)) return anchor.anchorSourceId;
  const q = anchor.anchorCanonicalQuestion?.trim().toLowerCase();
  return byQuestion.get(q)?.id ?? null;
}

function hmScore(r) {
  const rr = r.roundRelevance ?? r.navigatorMeta?.roundRelevance ?? {};
  const hm = rr.hiring_manager;
  let s = 0;
  if (hm === "very_high") s += 4;
  else if (hm === "high") s += 2;
  else if (hm === "medium") s += 1;
  if (r.primaryInterviewRound === "hiring_manager") s += 3;
  if (r.isPreferred) s += 1;
  if (r.isAuthoritative) s += 1;
  return s;
}

const hmAnchors = top115.rounds.hiring_manager ?? [];
const anchorRows = hmAnchors.map((a) => ({
  rank: a.anchorRoundRank,
  tier: a.anchorTier,
  question: a.anchorCanonicalQuestion,
  id: resolveId(a),
  module: a.anchorExperienceModuleId,
  followUps: (a.followUps ?? []).slice(0, 5).map((f) => ({
    question: f.targetCanonicalQuestion,
    intent: f.intent,
  })),
}));

const invTop = (inv.topByRound?.hiring_manager ?? []).slice(0, 12);

const extraHigh = lib.records
  .filter((r) => r.status === "active" && hmScore(r) >= 7)
  .map((r) => ({ id: r.id, question: r.question, score: hmScore(r) }))
  .sort((a, b) => b.score - a.score);

const seen = new Set(anchorRows.map((a) => a.question?.toLowerCase()));
const supplements = extraHigh.filter((x) => !seen.has(x.question.toLowerCase())).slice(0, 15);

const lines = [
  "# Questrade — Hiring manager: most likely questions",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Reference for interview prep (not a guarantee). Sources:",
  "",
  "- **Top 40 HM anchors** — `data/editorial/questrade-top115-curated-contextual-followups.md` (VH/H tiers)",
  "- **HM likelihood ranks** — `docs/questrade-interview-ranked-inventory.json` (`likelihoodByRound.hiring_manager`)",
  "- **Live library** — `exports/questrade_interview_library.json` (`roundRelevance.hiring_manager`, `primaryInterviewRound`)",
  "",
  "In the copilot, use the **spoken** variant when present; full canonical answers stay in the library for depth.",
  "",
  "---",
  "",
  "## 1. How the HM round usually flows",
  "",
  "Typical arc: **fit & motivation** → **Questbank strategy** (primary banking, payroll, metrics) → **proof from RBC / HBC / Arc'teryx** → **judgment** (trade-offs, mistakes, cross-functional conflict) → **sharp follow-ups** on anything you claimed.",
  "",
  "---",
  "",
  "## 2. Tier A — Very likely anchors (editorial VH, start here)",
  "",
  "| # | Question | Library ID |",
  "| --- | --- | --- |",
];

for (const a of anchorRows.filter((x) => x.tier === "VH")) {
  lines.push(`| ${a.rank} | ${a.question} | \`${a.id ?? "— reconcile"}\` |`);
}

lines.push("", "## 3. Tier B — Other curated HM anchors (H)", "", "| # | Question | Library ID |", "| --- | --- | --- |");
for (const a of anchorRows.filter((x) => x.tier === "H")) {
  lines.push(`| ${a.rank} | ${a.question} | \`${a.id ?? "—"}\` |`);
}

lines.push("", "## 4. Model-ranked HM likelihood (inventory top 12)", "", "| Rank | Question | ID |", "| --- | --- | --- |");
for (const t of invTop) {
  lines.push(`| ${t.rank} | ${t.question} | \`${t.id}\` |`);
}

lines.push(
  "",
  "## 5. High-scoring HM questions not in the top-40 anchor list",
  "",
  "Strong `hiring_manager` relevance in the live library; worth skimming if time is short.",
  "",
  "| Question | ID |",
  "| --- | --- |",
);
for (const s of supplements) {
  lines.push(`| ${s.question} | \`${s.id}\` |`);
}

lines.push("", "---", "", "## 6. Likely follow-ups by theme", "");

const themes = [
  {
    title: "Questbank / primary banking",
    ids: [
      "6844c2e7-03c5-434e-b64c-ca9febec68dd",
      "06e233ae-5d45-42d3-b560-84baf56a8948",
      "735da866-20fc-4837-b67d-c91a6b4e2c77",
      "50313c26-9a05-42e6-b88e-cc571be4b272",
      "d6e02f71-bdb1-4dbc-b373-4c7958d83e04",
      "47a2ee59-f62e-4b8c-a95b-abab90b7891b",
      "0d2ba56b-828d-4eeb-bbc4-b099d740e800",
      "c4eabdaa-ab91-4b85-8d46-cd2cacdf8d42",
      "dd28e2fe-24d1-4012-98d0-e951276439c6",
    ],
  },
  {
    title: "Arc'teryx / current role",
    ids: [
      "1fd9478b-7396-4778-bc00-e62aee52de52",
      "7c4b9e12-3a6f-4d8e-9b01-5e2c8f7a1d30",
      "439ccf45-857e-431f-ab0e-1312d6998f02",
      "f8074663-5773-4b95-a25b-1e32a764c1a9",
      "15aa03e2-46af-4d60-9d73-90ed342c6ccc",
    ],
  },
  {
    title: "RBC payments / Avion",
    ids: [
      "244e239c-2f88-4b6e-968f-ef8ce65daa70",
      "e09deee1-3efa-4774-9274-2f18848b739f",
      "91cd5cac-65b4-41e6-be3b-76ba3c49e9b1",
    ],
  },
  {
    title: "HBC / card economics",
    ids: [
      "140caed9-55a1-48ac-9190-5d2256afd262",
      "89ded97e-dc5a-420c-a4ee-a7372c2937a9",
      "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
      "9b0f399e-6750-463a-9570-805c82449eb8",
    ],
  },
  {
    title: "Behavioural / leadership",
    ids: [
      "2f3a780e-6b54-42b8-b56d-8936a471fa68",
      "c1d638b6-1858-487d-9ac2-5b6cc5327eb8",
      "a292f433-831a-440c-a196-dbf8c38fbddd",
      "56065bcd-e97e-4d82-ac21-e35a44296ae7",
      "2b7b68cd-d7ae-4358-b609-405c36f1f6b6",
      "d47c60d3-510e-4373-abf0-0749fcc41ebc",
    ],
  },
];

for (const th of themes) {
  lines.push(`### ${th.title}`, "");
  for (const id of th.ids) {
    const r = byId.get(id);
    if (!r) continue;
    lines.push(`- ${r.question} — \`${id}\``);
  }
  lines.push("");
}

lines.push("## 7. Curated follow-up chains (selected VH anchors)", "");
for (const a of anchorRows.filter((x) => x.tier === "VH").slice(0, 8)) {
  lines.push(`### ${a.question}`, "");
  if (a.id) lines.push(`*Anchor:* \`${a.id}\``, "");
  for (const [i, fu] of a.followUps.entries()) {
    lines.push(`${i + 1}. ${fu.question} *(${fu.intent?.replace(/_/g, " ")})*`);
  }
  lines.push("");
}

const out = resolve(root, "data/review/questrade-hiring-manager-likely-questions.md");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join("\n"));
console.log("Wrote", out);
