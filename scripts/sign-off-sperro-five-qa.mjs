#!/usr/bin/env node
/**
 * Mark reviewed Sperro five-pack as reviewStatus ok (evidence flags unchanged).
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");

const QUESTIONS = [
  "What are you currently working on at Arc'teryx?",
  "How did you decide what to include in the smaller Sperro SV release?",
  "Tell me about a product decision you got wrong.",
  "You've secured a significant investment and are still building the product. Why would you leave before seeing it launch?",
  "How would you manage transitioning away from an ongoing membership initiative?",
];

const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const signed = [];
for (const q of QUESTIONS) {
  if (!meta[q]) {
    console.warn("Missing meta:", q);
    continue;
  }
  meta[q] = {
    ...meta[q],
    reviewStatus: "ok",
    signedOffAt: new Date().toISOString(),
    signedOffNote: "User sign-off after Sperro five-pack import (evidenceStatus preserved).",
  };
  signed.push(q);
}
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log(JSON.stringify({ signedOff: signed.length, questions: signed }, null, 2));
