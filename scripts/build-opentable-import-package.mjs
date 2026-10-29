#!/usr/bin/env node
/**
 * Assemble imports/opentable_final_qa.json from ChatGPT-authored verbatim records.
 * Does not modify answer text — only packages metadata + schema envelope.
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { validateImportPackage } from "./lib/validate-interview-qa-import.mjs";
import { OPENTABLE_APPROVED_RECORDS } from "../data/migration/opentable-approved-records.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outPath = resolve(root, "imports/opentable_final_qa.json");

const pkg = {
  schemaVersion: "1.0.0",
  packageId: "opentable-2026-10-29-chatgpt-tier1-v1",
  authoredBy: "ChatGPT",
  authoredAt: new Date().toISOString(),
  targetProfile: {
    name: "OpenTable — Senior Product Manager, Restaurant Product (AI/ML Revenue Optimization)",
  },
  records: OPENTABLE_APPROVED_RECORDS,
};

const validation = validateImportPackage(pkg);
if (!validation.valid) {
  console.error("Package validation failed:");
  validation.errors.forEach((e) => console.error(`  ${e.path}: ${e.message}`));
  process.exit(1);
}

writeFileSync(outPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`Wrote ${outPath} (${pkg.records.length} records)`);
if (validation.warnings.length) {
  console.log(`Warnings: ${validation.warnings.length}`);
}
