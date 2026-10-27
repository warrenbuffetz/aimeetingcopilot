#!/usr/bin/env node
/**
 * Pass 2 prep: reconcile P1 audit rows to live export and write approval table.
 *
 *   node scripts/generate-questrade-tone-audit-p1-review.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const auditPath =
  process.argv[2] ??
  "/Users/johnlee/Downloads/Questrade_Tone_Audit_Complete_Package/Questrade_Tone_Audit_318_Records.json";
const exportPath = resolve(root, "exports/questrade_interview_library.json");

function excerpt(text, max = 220) {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function load() {
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  const lib = JSON.parse(readFileSync(exportPath, "utf8"));
  const byId = new Map(lib.records.map((r) => [r.id, r]));
  return { audit, byId };
}

function main() {
  const { audit, byId } = load();
  const p1 = audit.records.filter((r) => r.priority === "P1");
  const proposed = audit.records.filter((r) => r.proposedSpokenVariant);

  const lines = [
    "# Questrade tone audit — Pass 2 (P1) review table",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Approve rows to include in `apply-questrade-tone-audit-p1.mjs` (not applied automatically).",
    "",
    "| fullId | question | priority | existing excerpt | proposed revised excerpt | what changed | evidenceStatus | approvalNeeded |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const r of p1) {
    const live = byId.get(r.id);
    const existing = live?.spokenAnswer || live?.answer || "";
    const proposedText = r.proposedSpokenVariant || r.recommendedChange || "";
    const stale = live && r.answerSnapshot && live.answer !== r.answerSnapshot;
    const what =
      [r.issueSummary || r.toneIssue || r.recommendation, stale ? "(live answer differs from audit snapshot — re-reviewed)" : ""]
        .filter(Boolean)
        .join(" ")
        .replace(/\|/g, "/");
    lines.push(
      `| \`${r.id}\` | ${excerpt(r.question, 80)} | P1 | ${excerpt(existing)} | ${excerpt(proposedText)} | ${excerpt(what, 120)} | ${live?.evidenceStatus ?? r.evidenceStatus ?? ""} | yes |`,
    );
  }

  lines.push("", "## Proposed spoken variants (editorial — 14 rows)", "");
  for (const r of proposed) {
    if (r.priority === "P0") continue;
    const live = byId.get(r.id);
    lines.push(`### \`${r.id}\` — ${r.question}`, "");
    lines.push(`- **priority:** ${r.priority} · **evidence:** ${live?.evidenceStatus ?? ""}`);
    lines.push(`- **approvalNeeded:** yes (candidate only)`);
    if (r.proposedSpokenVariant) {
      lines.push("", r.proposedSpokenVariant, "");
    }
  }

  const evidence = [
    "# Questrade tone audit — evidence review queue (P0 factual)",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Do not certify by tone polish alone.",
    "",
    "| fullId | question | evidenceStatus | note |",
    "| --- | --- | --- | --- |",
    "| `af5bd3a4-1b6f-4f1c-a319-15475be31b5d` | HBC randomized holdouts | unverified_detail (post-P0) | Confirm holdout cohort and 4pp / 5% lifts vs original analysis |",
    "| `c88f487e-e0d1-44c0-ab54-60f1e19fe79d` | Aeroplan data-driven decision | resume_supported | Verify 10%→14% test definition and audience |",
  ];

  const outDir = resolve(root, "data/review");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "questrade-tone-audit-p1-review.md"), lines.join("\n"));
  writeFileSync(resolve(outDir, "questrade-tone-audit-evidence-queue.md"), evidence.join("\n"));
  console.log(`Wrote ${p1.length} P1 rows and ${proposed.length} proposed-variant notes.`);
}

main();
