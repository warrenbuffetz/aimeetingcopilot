#!/usr/bin/env node
/**
 * Non-destructive Questrade content consistency report (no answer rewrites).
 * Reads exports/questrade_interview_library.json only.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const EXPORT = resolve(root, "exports/questrade_interview_library.json");

const FAMILIES = [
  {
    id: "aeroplan-40-measurement",
    label: "Aeroplan 40% conversion measurement",
    recordIds: [
      "8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4",
      "0e33272e-0d91-49a8-8d6d-e74881372454",
    ],
    risk: "Panel cross-exam may surface contradictory cohort math or design claims.",
    recommendedWhenReady:
      "Pick one primary measurement answer; archive or alias the other with supplemental talking points.",
  },
  {
    id: "hbc-15-measurement",
    label: "HBC 15% measurement",
    recordIds: ["3218b561-2159-442e-a3aa-074756f877c0"],
    extraMatch: /avoid claiming specific experimental design|how did you measure the 15/i,
    risk: "Detailed vs cautious measurement stories may alternate on follow-ups.",
    recommendedWhenReady: "Same pattern as Aeroplan after per-metric confirmation.",
  },
  {
    id: "failure-weakness",
    label: "Failure / weakness",
    extraMatch: /biggest weakness|tell me about a failure|time you failed/i,
    risk: "Wrong story or missing illustrative label in main view.",
    recommendedWhenReady: "One canonical weakness/failure for Questrade; evidence visible everywhere.",
  },
];

function excerpt(s, n = 220) {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

function tenseFlags(answer) {
  const a = answer ?? "";
  const past = /\bwhile I was there\b|\bwhen I was at\b/i.test(a);
  const present = /\bI'm currently\b|\bI am currently\b|\bmy current role\b/i.test(a);
  if (past && present) return ["mixed_past_present"];
  if (past) return ["past_employer_tense"];
  if (present) return ["present_rehearsal_tense"];
  return [];
}

function main() {
  const exp = JSON.parse(readFileSync(EXPORT, "utf8"));
  const active = exp.records.filter((r) => r.status === "active");
  const byId = new Map(active.map((r) => [r.id, r]));

  const report = {
    generatedAt: new Date().toISOString(),
    source: EXPORT,
    userDecision: "confirm_later_on_measurement_math",
    families: [],
    arcteryxTense: [],
    notes: [
      "No prose was modified by this script.",
      "Resolve measurement families only after you confirm cohort numbers per metric.",
    ],
  };

  for (const fam of FAMILIES) {
    const rows = [];
    for (const id of fam.recordIds ?? []) {
      const r = byId.get(id);
      if (r) rows.push(r);
    }
    if (fam.extraMatch) {
      for (const r of active) {
        if (fam.recordIds?.includes(r.id)) continue;
        if (fam.extraMatch.test(r.question)) rows.push(r);
      }
    }
    const entries = rows.map((r) => ({
      id: r.id,
      question: r.question,
      evidenceStatus: r.navigatorMeta?.evidenceStatus ?? r.evidenceStatus,
      reviewStatus: r.navigatorMeta?.reviewStatus,
      answerExcerpt: excerpt(r.answer),
      metricSnippets: (r.answer.match(/\b\d[\d,]*\s*(users|customers|members|per week|per month|%)/gi) ?? []).slice(
        0,
        8
      ),
    }));
    report.families.push({
      ...fam,
      entries,
      conflictSignals: entries.length > 1
        ? ["multiple_active_answers_same_intent"]
        : entries.length === 0
          ? ["no_matching_records_in_export"]
          : [],
    });
  }

  for (const r of active) {
    const mod = r.navigatorMeta?.experienceModuleId ?? r.experienceModuleId;
    if (!mod?.startsWith("arcteryx")) continue;
    const flags = tenseFlags(r.answer);
    if (flags.includes("mixed_past_present")) {
      report.arcteryxTense.push({
        id: r.id,
        question: r.question,
        flags,
        excerpt: excerpt(r.answer, 160),
      });
    }
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonPath = resolve(root, "data/migration/questrade-content-consistency-report.json");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = [
    "# Questrade content consistency report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    report.notes.map((n) => `- ${n}`).join("\n"),
    "",
    "## Measurement & weakness families",
    "",
  ];
  for (const fam of report.families) {
    md.push(`### ${fam.label}`, "", fam.risk, "", `*When ready:* ${fam.recommendedWhenReady}`, "");
    for (const e of fam.entries) {
      md.push(`- **${e.question}** (\`${e.id}\`)`);
      md.push(`  - evidence: ${e.evidenceStatus ?? "—"}`);
      if (e.metricSnippets.length) md.push(`  - numbers mentioned: ${e.metricSnippets.join("; ")}`);
      md.push(`  - excerpt: ${e.answerExcerpt}`, "");
    }
  }
  md.push("## Arc'teryx mixed tense (candidates for 1–2 sentence alignment)", "");
  if (!report.arcteryxTense.length) md.push("_None flagged with mixed past/present in one answer._", "");
  else {
    for (const row of report.arcteryxTense.slice(0, 25)) {
      md.push(`- ${row.question} (\`${row.id}\`): ${row.flags.join(", ")}`);
    }
  }
  const mdPath = resolve(root, "data/migration/questrade-content-consistency-report.md");
  writeFileSync(mdPath, md.join("\n"));
  console.log("Wrote", jsonPath);
  console.log("Wrote", mdPath);
}

main();
