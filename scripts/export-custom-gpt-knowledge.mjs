#!/usr/bin/env node
/**
 * Build a single markdown file for ChatGPT Custom GPT knowledge upload.
 * Usage: node scripts/export-custom-gpt-knowledge.mjs [path-to-seed-json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input =
  process.argv[2] ?? path.join(root, "data/seed/questrade-interview-full.json");
const outDir = path.join(root, "data/export");
const outFile = path.join(outDir, "questrade-interview-playbook.md");

const seed = JSON.parse(fs.readFileSync(input, "utf8"));
const profile = seed.profile ?? {};
const items = [...(seed.preparedQa ?? [])].sort((a, b) => (a.part ?? 0) - (b.part ?? 0));

const lines = [
  `# ${profile.name ?? "Interview playbook"}`,
  "",
  `Role: ${profile.role_title ?? ""} at ${profile.employer ?? ""}`,
  "",
  "Use this document as the authoritative source for prepared answers. Prefer verbatim scripted answers when the question matches. Do not invent employers, metrics, or outcomes.",
  "",
  "---",
  "",
];

for (const qa of items) {
  lines.push(`## Q: ${qa.question}`);
  if (qa.category) lines.push(`*Category: ${qa.category} · Part ${qa.part ?? "?"}*`);
  if (qa.notes) lines.push(`*Note: ${qa.notes}*`);
  lines.push("");
  lines.push(qa.answer.trim());
  lines.push("");
  lines.push("---");
  lines.push("");
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, lines.join("\n"), "utf8");
console.log(`Wrote ${items.length} Q&As → ${outFile}`);
