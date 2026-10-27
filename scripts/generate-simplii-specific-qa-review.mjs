#!/usr/bin/env node
/**
 * Simplii-branded + JD-specific Q&A for offline review.
 *   node scripts/generate-simplii-specific-qa-review.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(resolve(root, "imports/simplii_final_qa.json"), "utf8"));
const records = pkg.records ?? [];
const remaps = JSON.parse(
  readFileSync(resolve(root, "data/migration/simplii-question-remaps.json"), "utf8")
);

function questionText(r) {
  return (r.canonicalQuestion || r.question || "").trim();
}

function looksTruncated(text) {
  if (!text?.trim()) return true;
  const t = text.trim();
  return t.endsWith("…") || t.endsWith("...") || t.endsWith("\u2026");
}

function normCompare(s) {
  return (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function pickAnswer(r) {
  const canonical = r.answer?.trim() || null;
  const spokenRaw = r.spokenAnswer?.trim() || null;

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
    canonical && normCompare(canonical) !== normCompare(primary) && source === "spoken";

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

function pushRecord(lines, r, opts = {}) {
  const q = questionText(r);
  const tier = r.preparationTier || r.navigatorMeta?.preparationTier || "—";
  const pick = pickAnswer(r);
  if (looksTruncated(pick.primary)) {
    console.warn("WARN truncated primary:", r.externalId, q.slice(0, 60));
  }
  lines.push(`### ${opts.headingPrefix ?? ""}${q}`, "");
  lines.push(`- **Import key:** \`${r.externalId ?? r.importKey ?? "—"}\``);
  lines.push(`- **Preparation tier:** ${tier}`);
  if (r.navigatorMeta?.reviewNotes || r.reviewNotes) {
    lines.push(`- **Review note:** ${r.reviewNotes || r.navigatorMeta?.reviewNotes}`);
  }
  lines.push("");
  pushAnswerBlocks(lines, pick);
  lines.push("---", "");
}

const byQuestion = new Map();
for (const r of records) {
  const q = questionText(r).toLowerCase();
  if (q) byQuestion.set(q, r);
}

const branded = records
  .filter((r) => /simplii/i.test(questionText(r)))
  .sort((a, b) => {
    const ta = a.preparationTier || "P9";
    const tb = b.preparationTier || "P9";
    if (ta !== tb) return ta.localeCompare(tb);
    return questionText(a).localeCompare(questionText(b));
  });

const jdRecords = records
  .filter((r) => (r.externalId || "").startsWith("simplii-jd-"))
  .sort((a, b) => (a.externalId || "").localeCompare(b.externalId || ""));

const remapTargets = Object.entries(remaps)
  .filter(([, target]) => target && !/simplii/i.test(target))
  .map(([questradeQ, simpliiQ]) => ({ questradeQ, simpliiQ }));

const remappedInLib = [];
for (const { questradeQ, simpliiQ } of remapTargets) {
  const r = byQuestion.get(simpliiQ.trim().toLowerCase());
  if (r && !branded.includes(r) && !jdRecords.includes(r)) {
    remappedInLib.push({ questradeQ, simpliiQ, record: r });
  }
}

const motivationGeneric = records.filter((r) => {
  const q = questionText(r);
  if (/simplii/i.test(q)) return false;
  if ((r.externalId || "").startsWith("simplii-jd-")) return false;
  const body = (r.answer || "") + (r.spokenAnswer || "");
  return /simplii/i.test(body) && /^(tell me about yourself|why move into everyday banking)/i.test(q);
});

const lines = [
  "# Simplii — Specific questions & prepared answers (review pack)",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Source: `imports/simplii_final_qa.json` (Simplii profile package). Complete spoken text when available; otherwise full canonical `answer` (never `shortAnswer` previews).",
  "",
  "| Section | Count |",
  "| --- | ---: |",
  `| A. Simplii-named questions | ${branded.length} |`,
  `| B. JD squad questions (\`simplii-jd-*\`) | ${jdRecords.length} |`,
  `| C. Questrade→Simplii remaps (generic wording) | ${remappedInLib.length} |`,
  `| D. Generic question, Simplii-tailored answer | ${motivationGeneric.length} |`,
  "",
  "Profile: **Simplii Financial — Senior Product Manager** (`1aff0813-6615-4a12-bfd6-ce7603604f6b`).",
  "",
  "---",
  "",
  "## A. Questions that name Simplii",
  "",
];

for (const r of branded) pushRecord(lines, r);

lines.push("## B. Simplii JD / squad-specific questions", "");
lines.push(
  "Net-new prompts for the Senior PM JD (discovery, stories, backlog, risk, onboarding). Most do not include the word Simplii in the question line.",
  ""
);

for (const r of jdRecords) pushRecord(lines, r);

lines.push("## C. Remapped from Questrade (Simplii framing, no brand in question)", "");
for (const { questradeQ, simpliiQ, record: r } of remappedInLib) {
  lines.push(`*Replaces Questrade prompt:* “${questradeQ}”`, "");
  pushRecord(lines, r, { headingPrefix: "" });
}

lines.push("## D. Generic question text, Simplii-specific answer", "");
lines.push("Same interview phrasing as other profiles; body references Simplii.", "");
for (const r of motivationGeneric) pushRecord(lines, r);

const out = resolve(root, "data/review/simplii-specific-questions-and-answers.md");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join("\n"));
console.log("Wrote", out);
