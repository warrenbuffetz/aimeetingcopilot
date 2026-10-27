#!/usr/bin/env node
/**
 * Diff HEAD vs working-tree export for tone-audit before/after (answer + spoken).
 *   node scripts/generate-questrade-tone-audit-before-after.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const exportPath = resolve(root, "exports/questrade_interview_library.json");

const P0_IDS = new Set([
  "93f1f35c-cd54-49c3-8d6d-6a95d262fd4b",
  "009d20a6-a8cf-458a-a7ea-9ef696c693e0",
  "f7e403b2-26b8-4da4-83c1-ea58c2e3371b",
  "8150bb81-67d5-48dc-82e0-b8bf223984f0",
  "db88df8e-3a36-4cc6-8b84-4fb24e2136c3",
  "c8d4a611-d174-48b1-911c-e2db8f3acc3e",
  "7c079cf5-b153-435d-a4b3-e83ad3139a2b",
  "a8fe6bd5-ecc2-4c0f-95d5-63bb51f0c20c",
  "6844c2e7-03c5-434e-b64c-ca9febec68dd",
  "0e33272e-0d91-49a8-8d6d-e74881372454",
  "722da43e-9883-44ce-800c-97a0aafbc694",
  "af5bd3a4-1b6f-4f1c-a319-15475be31b5d",
  "c88f487e-e0d1-44c0-ab54-60f1e19fe79d",
]);

function norm(s) {
  return (s ?? "").replace(/\r\n/g, "\n").trim();
}

function loadHeadExport() {
  try {
    const raw = execSync("git show HEAD:exports/questrade_interview_library.json", {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function spokenOf(r) {
  return r?.spokenAnswer ?? r?.navigatorMeta?.spokenAnswer ?? null;
}

function shortOf(r) {
  return r?.shortAnswer ?? r?.navigatorMeta?.shortAnswer ?? null;
}

function fence(text) {
  return "```text\n" + (text || "(empty)") + "\n```";
}

function main() {
  const beforeLib = loadHeadExport();
  if (!beforeLib) {
    console.error("No HEAD export; commit or stash baseline first.");
    process.exit(1);
  }
  const afterLib = JSON.parse(readFileSync(exportPath, "utf8"));
  const beforeById = new Map(beforeLib.records.map((r) => [r.id, r]));
  const afterById = new Map(afterLib.records.map((r) => [r.id, r]));

  const changedIds = new Set([...P0_IDS]);
  for (const r of afterLib.records) {
    if (r.navigatorMeta?.toneAuditP1) changedIds.add(r.id);
  }

  const lines = [
    "# Questrade tone audit — before / after",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Baseline: `git HEAD` → `exports/questrade_interview_library.json` (pre–working-tree export).",
    "After: current export (post P0 + P1 apply).",
    "",
    "---",
    "",
  ];

  const sorted = [...changedIds].filter((id) => afterById.has(id)).sort();

  for (const id of sorted) {
    const b = beforeById.get(id);
    const a = afterById.get(id);
    if (!a) continue;

    const pass = P0_IDS.has(id) ? "P0" : a.navigatorMeta?.toneAuditP1 ? "P1" : "?";
    const q = a.question;
    const answerChanged = norm(b?.answer) !== norm(a.answer);
    const spokenChanged = norm(spokenOf(b)) !== norm(spokenOf(a));
    const shortChanged = norm(shortOf(b)) !== norm(shortOf(a));
    const metaOnly = pass === "P0" && id === "93f1f35c-cd54-49c3-8d6d-6a95d262fd4b";

    if (!answerChanged && !spokenChanged && !shortChanged && !metaOnly) continue;

    lines.push(`## ${pass} · \`${id}\``);
    lines.push("");
    lines.push(`**Question:** ${q}`);
    lines.push("");
    if (metaOnly) {
      lines.push("- **Change:** `navigator_meta.reviewNotes` only (canonical answer unchanged).");
      lines.push("");
      continue;
    }

    lines.push(
      `**Fields changed:** ${[
        answerChanged && "`answer`",
        spokenChanged && "`spokenAnswer`",
        shortChanged && "`shortAnswer`",
      ]
        .filter(Boolean)
        .join(", ")}`,
    );
    lines.push("");

    if (answerChanged) {
      lines.push("### Canonical `answer`");
      lines.push("");
      lines.push("**Before**");
      lines.push("");
      lines.push(fence(b?.answer));
      lines.push("");
      lines.push("**After**");
      lines.push("");
      lines.push(fence(a.answer));
      lines.push("");
    } else if (spokenChanged || shortChanged) {
      lines.push("*Canonical `answer` unchanged (spoken-layer update only).*");
      lines.push("");
    }

    if (spokenChanged) {
      lines.push("### `spokenAnswer`");
      lines.push("");
      lines.push("**Before**");
      lines.push("");
      lines.push(fence(spokenOf(b)));
      lines.push("");
      lines.push("**After**");
      lines.push("");
      lines.push(fence(spokenOf(a)));
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  const out = resolve(root, "data/review/questrade-tone-audit-before-after.md");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, lines.join("\n"));
  console.log(`Wrote ${out} (${sorted.length} IDs scanned)`);
}

main();
