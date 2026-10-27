#!/usr/bin/env node
/**
 * Recruiter-screen likely questions + prepared answers (editorial top-35 + library).
 *   node scripts/generate-questrade-recruiter-likely-questions.mjs
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

function recruiterScore(r) {
  const rr = r.roundRelevance ?? r.navigatorMeta?.roundRelevance ?? {};
  const rec = rr.recruiter;
  let s = 0;
  if (rec === "very_high") s += 4;
  else if (rec === "high") s += 2;
  else if (rec === "medium") s += 1;
  if (r.primaryInterviewRound === "recruiter") s += 3;
  if (r.isPreferred) s += 1;
  if (r.isAuthoritative) s += 1;
  if (r.libraryCategory === "career_recruiter" || r.navigatorMeta?.libraryCategory === "career_recruiter") s += 2;
  return s;
}

/** UI preview fields — never use as primary prep text. */
function looksTruncated(text) {
  if (!text?.trim()) return true;
  const t = text.trim();
  return t.endsWith("…") || t.endsWith("...") || t.endsWith("\u2026");
}

function normCompare(s) {
  return (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function pickAnswer(r) {
  if (!r) {
    return { primary: "— *not in live library*", source: "missing", spokenRaw: null, canonical: null };
  }

  const canonical = r.answer?.trim() || null;
  const spokenRaw = (r.spokenAnswer?.trim() || r.navigatorMeta?.spokenAnswer?.trim() || null);

  let primary = spokenRaw;
  let source = "spoken";

  if (!primary || looksTruncated(primary)) {
    if (canonical) {
      primary = canonical;
      source =
        spokenRaw && looksTruncated(spokenRaw) ? "canonical_fallback_truncated_spoken" : "canonical";
    } else {
      primary = primary || "—";
      source = primary === "—" ? "missing" : "spoken";
    }
  }

  const showCanonicalDetails =
    canonical &&
    normCompare(canonical) !== normCompare(primary) &&
    source === "spoken";

  return { primary, source, spokenRaw, canonical, showCanonicalDetails };
}

function mdEscapeBlock(text) {
  return text.replace(/\r\n/g, "\n");
}

function pushAnswerBlocks(lines, pick) {
  const label =
    pick.source === "spoken"
      ? "**Prepared answer (spoken — complete):**"
      : pick.source === "canonical_fallback_truncated_spoken"
        ? "**Prepared answer (canonical — library `spokenAnswer` was truncated):**"
        : "**Prepared answer (canonical):**";
  lines.push(label, "", mdEscapeBlock(pick.primary), "");
  if (pick.source === "canonical_fallback_truncated_spoken" && pick.spokenRaw) {
    lines.push(
      "<details>",
      "<summary>Truncated spoken variant in library</summary>",
      "",
      mdEscapeBlock(pick.spokenRaw),
      "",
      "</details>",
      ""
    );
  }
  if (pick.showCanonicalDetails && pick.canonical) {
    lines.push(
      "<details>",
      "<summary>Full canonical answer (longer)</summary>",
      "",
      mdEscapeBlock(pick.canonical),
      "",
      "</details>",
      ""
    );
  }
}

const recAnchors = top115.rounds.recruiter ?? [];
const anchorRows = recAnchors.map((a) => ({
  rank: a.anchorRoundRank,
  tier: a.anchorTier,
  question: a.anchorCanonicalQuestion,
  id: resolveId(a),
  module: a.anchorExperienceModuleId,
  followUps: (a.followUps ?? []).slice(0, 4).map((f) => ({
    question: f.targetCanonicalQuestion,
    intent: f.intent,
  })),
}));

const invTop = (inv.topByRound?.recruiter ?? []).slice(0, 12);

const seen = new Set(anchorRows.map((a) => a.question?.toLowerCase()));
const supplements = lib.records
  .filter((r) => r.status === "active" && recruiterScore(r) >= 6)
  .map((r) => ({ id: r.id, question: r.question, score: recruiterScore(r) }))
  .sort((a, b) => b.score - a.score)
  .filter((x) => !seen.has(x.question.toLowerCase()))
  .slice(0, 12);

const logisticsKeywords = [
  "compensation",
  "salary",
  "notice",
  "start date",
  "work authorization",
  "remote",
  "hybrid",
  "relocation",
  "visa",
];

const logistics = lib.records
  .filter((r) => {
    if (r.status !== "active") return false;
    const q = r.question.toLowerCase();
    const cat = (r.libraryCategory ?? r.navigatorMeta?.libraryCategory ?? "").toLowerCase();
    return cat.includes("logistics") || logisticsKeywords.some((k) => q.includes(k));
  })
  .slice(0, 8);

const lines = [
  "# Questrade — Recruiter screen: likely questions & prepared answers",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Reference for interview prep (not a guarantee). Sources:",
  "",
  "- **Top 35 recruiter anchors** — `data/editorial/questrade-top115-curated-contextual-followups.json`",
  "- **Recruiter likelihood** — `docs/questrade-interview-ranked-inventory.json` (`topByRound.recruiter`)",
  "- **Live library** — `exports/questrade_interview_library.json`",
  "",
  "**What to say (recruiter):** prefer **spoken** in the live copilot when it is complete (~90–120 seconds). This file always shows **complete** text: full spoken when available, otherwise canonical (never `shortAnswer` previews). Canonical is for depth and HM-style follow-ups.",
  "",
  "---",
  "",
  "## 1. How the recruiter screen usually flows",
  "",
  "Typical arc: **screening & motivation** (why Questrade, why leave Arc'teryx, career story) → **role fit** (everyday banking vs loyalty background, AI/tools if asked) → **proof points** (1–2 experience highlights, not deep HM case studies) → **logistics** (comp, notice, work setup) → schedule **hiring manager**.",
  "",
  "---",
  "",
  "## 2. Tier A — Very likely (editorial VH) — questions & answers",
  "",
];

const truncWarnings = [];

for (const a of anchorRows.filter((x) => x.tier === "VH")) {
  const r = a.id ? byId.get(a.id) : byQuestion.get(a.question?.trim().toLowerCase());
  const pick = pickAnswer(r);
  if (looksTruncated(pick.primary)) truncWarnings.push({ q: a.question, id: a.id });
  lines.push(`### ${a.rank}. ${a.question}`, "");
  lines.push(`- **Library ID:** \`${a.id ?? "— reconcile"}\``);
  lines.push(`- **Experience module:** ${a.module ?? "—"}`, "");
  pushAnswerBlocks(lines, pick);
  lines.push("---", "");
}

lines.push("## 3. Tier B — Other curated recruiter anchors (H) — questions & answers", "");

for (const a of anchorRows.filter((x) => x.tier === "H")) {
  const r = a.id ? byId.get(a.id) : byQuestion.get(a.question?.trim().toLowerCase());
  const pick = pickAnswer(r);
  if (looksTruncated(pick.primary)) truncWarnings.push({ q: a.question, id: a.id });
  lines.push(`### ${a.rank}. ${a.question}`, "");
  lines.push(`- **Library ID:** \`${a.id ?? "— reconcile"}\``);
  lines.push(`- **Experience module:** ${a.module ?? "—"}`, "");
  pushAnswerBlocks(lines, pick);
  lines.push("");
}

lines.push("---", "", "## 4. Model-ranked recruiter likelihood (inventory top 12)", "", "| Rank | Question | ID |", "| --- | --- | --- |");
for (const t of invTop) {
  lines.push(`| ${t.rank} | ${t.question} | \`${t.id}\` |`);
}

lines.push(
  "",
  "## 5. High recruiter relevance (not in top-35 anchor list)",
  "",
  "| Question | ID |",
  "| --- | --- |",
);
for (const s of supplements) {
  lines.push(`| ${s.question} | \`${s.id}\` |`);
}

if (logistics.length) {
  lines.push("", "---", "", "## 6. Logistics & comp (often end of recruiter call)", "");
  for (const r of logistics) {
    const pick = pickAnswer(r);
    if (looksTruncated(pick.primary)) truncWarnings.push({ q: r.question, id: r.id });
    lines.push(`### ${r.question}`, "");
    lines.push(`- **Library ID:** \`${r.id}\``, "");
    pushAnswerBlocks(lines, pick);
  }
}

lines.push("", "---", "", "## 7. Curated follow-up chains (VH anchors)", "");

for (const a of anchorRows.filter((x) => x.tier === "VH")) {
  lines.push(`### ${a.question}`, "");
  if (a.id) lines.push(`*Anchor:* \`${a.id}\``, "");
  for (const [i, fu] of a.followUps.entries()) {
    lines.push(`${i + 1}. ${fu.question} *(${fu.intent?.replace(/_/g, " ")})*`);
  }
  lines.push("");
}

const out = resolve(root, "data/review/questrade-recruiter-likely-questions.md");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join("\n"));
console.log("Wrote", out, `(${anchorRows.length} anchors)`);
if (truncWarnings.length) {
  console.warn("Still truncated primary text:", truncWarnings.length);
  for (const w of truncWarnings) console.warn(" -", w.id, w.q);
} else {
  console.log("All primary answers complete (no trailing ellipsis).");
}
