#!/usr/bin/env node
/**
 * Match editorial top-question lists to Questrade library export; write gap report.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dataPath = resolve(root, "data/editorial/questrade-top-questions-by-round.json");
const overridesPath = resolve(root, "data/editorial/questrade-top-question-library-overrides.json");
const OVERRIDES = JSON.parse(readFileSync(overridesPath, "utf8"));

function normQ(s) {
  return (s ?? "")
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(s) {
  return new Set(normQ(s).split(" ").filter((t) => t.length > 2));
}

function similarity(a, b) {
  const na = normQ(a);
  const nb = normQ(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.92;
  const ta = tokenSet(a);
  const tb = tokenSet(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function textsForRow(row) {
  const meta = row.navigatorMeta ?? {};
  return [row.question, meta.canonicalQuestion, ...(meta.altPhrasings ?? [])].filter(Boolean);
}

function bestMatch(editorialQ, records) {
  let best = null;
  for (const row of records) {
    for (const t of textsForRow(row)) {
      const s = similarity(editorialQ, t);
      if (!best || s > best.score) best = { row, score: s, matched: t };
    }
  }
  if (!best || best.score < 0.55) return null;
  return best;
}

const RECRUITER_LOGISTICS = [
  "What is your required notice period?",
  "What are your hybrid-work expectations?",
  "What is your target total compensation?",
  "Are you interviewing elsewhere?",
];

function main() {
  const curated = JSON.parse(readFileSync(dataPath, "utf8"));
  const exp = JSON.parse(readFileSync(resolve(root, "exports/questrade_interview_library.json"), "utf8"));
  const records = exp.records.filter((r) => r.status !== "inactive");

  const report = {
    at: new Date().toISOString(),
    libraryRecordCount: records.length,
    matchThreshold: 0.55,
    recruiterLogisticsNotInEditorialList: RECRUITER_LOGISTICS,
    rounds: {},
  };

  for (const [round, entries] of Object.entries(curated)) {
    const resolved = [];
    const missing = [];
    for (const entry of entries) {
      const overrideId = OVERRIDES[entry.question];
      if (overrideId) {
        const row = records.find((r) => r.id === overrideId);
        if (row) {
          resolved.push({
            rank: entry.rank,
            tier: entry.tier,
            editorial: entry.question,
            matchedQuestion: row.question,
            rowId: row.id,
            score: 1,
            via: "manual_override",
          });
          continue;
        }
      }
      const m = bestMatch(entry.question, records);
      if (m) {
        resolved.push({
          rank: entry.rank,
          tier: entry.tier,
          editorial: entry.question,
          matchedQuestion: m.row.question,
          rowId: m.row.id,
          score: Math.round(m.score * 1000) / 1000,
        });
      } else {
        missing.push({ rank: entry.rank, tier: entry.tier, question: entry.question });
      }
    }
    report.rounds[round] = { resolved, missing, total: entries.length };
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonOut = resolve(root, "data/migration/editorial-top-questions-library-match.json");
  writeFileSync(jsonOut, JSON.stringify(report, null, 2));

  const mdLines = [
    "# Editorial top questions — library match",
    "",
    `Generated: ${report.at}`,
    "",
    "Each editorial line is matched independently to the best active Questrade library row (≥ 0.55 similarity). Wording variants usually map to an existing prepared answer.",
    "",
    "## Recruiter logistics (prepare even if not in Copilot)",
    "",
    ...RECRUITER_LOGISTICS.map((q) => `- ${q}`),
    "",
  ];

  let missCount = 0;
  for (const [round, data] of Object.entries(report.rounds)) {
    missCount += data.missing.length;
    mdLines.push(`## ${round}`, "");
    mdLines.push(`Matched: ${data.resolved.length} / ${data.total}`);
    const overrides = data.resolved.filter((r) => r.via === "manual_override");
    if (overrides.length) {
      mdLines.push("", "### Wording variants (manual map to library row)", "");
      for (const r of overrides) {
        mdLines.push(`- **#${r.rank} [${r.tier}]** ${r.editorial}`);
        mdLines.push(`  - Library: ${r.matchedQuestion}`);
      }
    }
    if (data.missing.length) {
      mdLines.push("", "### Needs prepared answer (no library match ≥ 0.55)", "");
      for (const m of data.missing) {
        mdLines.push(`- **#${m.rank} [${m.tier}]** ${m.question}`);
      }
    }
    mdLines.push("");
  }

  const mdOut = resolve(root, "data/migration/editorial-top-questions-gaps.md");
  writeFileSync(mdOut, mdLines.join("\n"));

  console.log("Missing (no library row ≥ 0.55):", missCount);
  console.log(jsonOut);
  console.log(mdOut);
  for (const [round, data] of Object.entries(report.rounds)) {
    if (data.missing.length) {
      console.log(`\n${round} missing (${data.missing.length}):`);
      for (const m of data.missing) console.log(`  ${m.rank}. [${m.tier}] ${m.question}`);
    }
  }
}

main();
