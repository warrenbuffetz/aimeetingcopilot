#!/usr/bin/env node
/**
 * Merge an addon seed into questrade-interview-full.json (dedupe by question text).
 * Usage: node scripts/merge-questrade-full.mjs [addon.json]
 * Default addon: data/seed/questrade-q48-q112.json
 * Updates data/seed/README.md Q&A count.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fullPath = path.join(root, "data/seed/questrade-interview-full.json");
const addPath = path.resolve(
  process.argv[2] ||
    path.join(root, "data/seed/questrade-q48-q112.json")
);
const readmePath = path.join(root, "data/seed/README.md");

const full = JSON.parse(fs.readFileSync(fullPath, "utf8"));
const add = JSON.parse(fs.readFileSync(addPath, "utf8"));

if (addPath.includes("resume-deepdives")) {
  const before = full.preparedQa.length;
  full.preparedQa = full.preparedQa.filter((q) => q.part !== 12);
  console.log(`Replaced part 12: removed ${before - full.preparedQa.length} prior entries`);
}

const existing = new Set(full.preparedQa.map((q) => q.question));
let appended = 0;
for (const qa of add.preparedQa) {
  if (existing.has(qa.question)) continue;
  full.preparedQa.push(qa);
  existing.add(qa.question);
  appended++;
}

fs.writeFileSync(fullPath, JSON.stringify(full, null, 2) + "\n");

const total = full.preparedQa.length;
let readme = fs.readFileSync(readmePath, "utf8");
readme = readme.replace(
  /\*\*\d+ Q&As\*\*/,
  `**${total} Q&As**`
);
fs.writeFileSync(readmePath, readme);

console.log(`Merged: appended ${appended}, total ${total} Q&As`);
console.log(`Updated ${readmePath}`);
