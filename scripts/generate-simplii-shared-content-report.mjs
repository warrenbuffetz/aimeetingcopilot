#!/usr/bin/env node
/**
 * Report shared Questrade/Simplii rows and inherited numeric/measurement claims (no Simplii writes).
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function normQ(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function loadExport(name) {
  const path = resolve(root, `exports/${name}`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  return data.records.filter((r) => r.status === "active");
}

function main() {
  const qt = loadExport("questrade_interview_library.json");
  let simplii = [];
  try {
    simplii = loadExport("simplii_interview_library.json");
  } catch {
    console.warn("simplii_interview_library.json not found — shared report will be empty");
  }

  const byNormQt = new Map();
  for (const r of qt) {
    const n = normQ(r.question);
    if (!byNormQt.has(n)) byNormQt.set(n, r);
  }

  const shared = [];
  for (const r of simplii) {
    const n = normQ(r.question);
    const qRow = byNormQt.get(n);
    if (!qRow) continue;
    const qtMeta = r.navigatorMeta ?? {};
    const smMeta = r.navigatorMeta ?? {};
    const experimentSignals =
      /\b8,?000\b|\b4,?000\b|randomly assigned|fourteen days|10% to 14%|57\.5%/.test(r.answer) ||
      /\b8,?000\b|\b4,?000\b|randomly assigned|fourteen days|10% to 14%|57\.5%/.test(qRow.answer);
    shared.push({
      question: r.question,
      questradeId: qRow.id,
      simpliiId: r.id,
      questradeEvidence: qRow.navigatorMeta?.evidenceStatus ?? qRow.evidenceStatus,
      simpliiEvidence: smMeta.evidenceStatus ?? r.evidenceStatus,
      answersDiffer: normQ(r.answer) !== normQ(qRow.answer),
      inheritedExperimentClaims: experimentSignals,
      sharedImportKey: qtMeta.importKey && qtMeta.importKey === smMeta.importKey ? qtMeta.importKey : null,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    simpliiRecordCount: simplii.length,
    sharedQuestionCount: shared.length,
    sharedWithExperimentSignals: shared.filter((s) => s.inheritedExperimentClaims),
    sharedWithAnswerDiff: shared.filter((s) => s.answersDiffer),
    shared,
    note: "No Simplii changes applied. Review before aligning profiles.",
  };

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonPath = resolve(root, "data/migration/simplii-shared-content-report.json");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log("Wrote", jsonPath, "shared:", shared.length);
}

main();
