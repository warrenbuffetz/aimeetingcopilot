#!/usr/bin/env node
/**
 * Build GPT-friendly Questrade library packs from exports/questrade_interview_library.json
 * (active Q&As for tone review; optional inactive appendix).
 *
 *   node scripts/generate-questrade-gpt-review-pack.mjs
 *   node scripts/generate-questrade-gpt-review-pack.mjs --include-inactive
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const EXPORT = resolve(root, "exports/questrade_interview_library.json");
const OUT_DIR = resolve(root, "data/review");
const includeInactive = process.argv.includes("--include-inactive");

function sectionKey(r) {
  const m = r.navigatorMeta ?? {};
  return (
    m.librarySection ??
    r.librarySection ??
    m.libraryCategory ??
    r.category ??
    "uncategorized"
  );
}

function rowMeta(r) {
  const m = r.navigatorMeta ?? {};
  return {
    id: r.id,
    question: r.question,
    answer: r.answer,
    spokenAnswer: m.spokenAnswer ?? r.spokenAnswer ?? null,
    shortAnswer: m.shortAnswer ?? r.shortAnswer ?? null,
    category: r.category ?? null,
    librarySection: sectionKey(r),
    experienceModuleId: m.experienceModuleId ?? r.experienceModuleId ?? null,
    experienceLabel: m.experienceLabel ?? r.experienceLabel ?? null,
    intent: m.intent ?? r.questionIntent ?? null,
    evidenceStatus: m.evidenceStatus ?? r.evidenceStatus ?? null,
    reviewStatus: m.reviewStatus ?? r.reviewStatus ?? null,
    revisionStatus: m.revisionStatus ?? r.revisionStatus ?? null,
    retrievalExcluded: Boolean(m.retrievalExcluded),
    status: r.status,
    importKey: m.importKey ?? r.importKey ?? null,
    supplementalTalkingPoints: m.supplementalTalkingPoints ?? r.supplementalTalkingPoints ?? [],
    altPhrasings: m.altPhrasings ?? r.aliases ?? [],
  };
}

function main() {
  const exp = JSON.parse(readFileSync(EXPORT, "utf8"));
  const active = exp.records.filter((r) => r.status === "active").map(rowMeta);
  const inactive = includeInactive
    ? exp.records.filter((r) => r.status === "inactive").map(rowMeta)
    : [];

  active.sort((a, b) => {
    const s = a.librarySection.localeCompare(b.librarySection);
    if (s !== 0) return s;
    const l = (a.experienceLabel ?? "").localeCompare(b.experienceLabel ?? "");
    if (l !== 0) return l;
    return a.question.localeCompare(b.question);
  });

  mkdirSync(OUT_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();
  const profileName = exp.source?.profileName ?? "Questrade";

  const slimJson = {
    packVersion: "questrade-gpt-review-1",
    generatedAt,
    sourceExport: "exports/questrade_interview_library.json",
    profileName,
    activeCount: active.length,
    inactiveIncluded: includeInactive,
    records: active,
    inactiveRecords: inactive,
  };
  const jsonPath = resolve(OUT_DIR, "questrade-gpt-review-pack.json");
  writeFileSync(jsonPath, JSON.stringify(slimJson, null, 2));

  const bySection = new Map();
  for (const r of active) {
    const k = r.librarySection;
    if (!bySection.has(k)) bySection.set(k, []);
    bySection.get(k).push(r);
  }

  const md = [];
  md.push(`# ${profileName} — Q&A library (GPT tone review pack)`);
  md.push("");
  md.push(`Generated: ${generatedAt}`);
  md.push(`Source: \`exports/questrade_interview_library.json\` (active records only: **${active.length}**)`);
  md.push("");
  md.push("## How to use this file in ChatGPT");
  md.push("");
  md.push("1. Upload this markdown **or** `data/review/questrade-gpt-review-pack.json` from the same repo export.");
  md.push("2. Ask for **tone-only** feedback: cadence, first-person consistency, hedge level, interview speakability — not new facts or metrics.");
  md.push("3. Respect **evidenceStatus**: `illustrative_scenario`, `rehearsal_framework`, and `unverified_detail` must not be rewritten as verified history.");
  md.push("4. Each entry includes \`id\` so you can map suggestions back to Interview Copilot rows.");
  md.push("");
  md.push("## Section index");
  md.push("");
  for (const [section, rows] of [...bySection.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    md.push(`- **${section}** (${rows.length})`);
  }
  md.push("");
  md.push("---");
  md.push("");

  for (const [section, rows] of [...bySection.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    md.push(`## ${section}`);
    md.push("");
    for (const r of rows) {
      md.push(`### ${r.question}`);
      md.push("");
      md.push(
        `- **id:** \`${r.id}\`` +
          (r.experienceLabel ? ` · **experience:** ${r.experienceLabel}` : "") +
          (r.evidenceStatus ? ` · **evidence:** ${r.evidenceStatus}` : "") +
          (r.reviewStatus ? ` · **review:** ${r.reviewStatus}` : "")
      );
      if (r.altPhrasings?.length) {
        md.push(`- **also matches:** ${r.altPhrasings.slice(0, 6).join(" · ")}${r.altPhrasings.length > 6 ? " …" : ""}`);
      }
      md.push("");
      md.push("**Answer (canonical full body):**");
      md.push("");
      md.push(r.answer.trim());
      md.push("");
      if (r.supplementalTalkingPoints?.length) {
        md.push("**Supplemental talking points (if pressed):**");
        md.push("");
        for (const tp of r.supplementalTalkingPoints) {
          md.push(`- *${tp.label}:* ${tp.content}`);
        }
        md.push("");
      }
      md.push("---");
      md.push("");
    }
  }

  if (inactive.length) {
    md.push("## Inactive / archived (reference only — not live retrieval)");
    md.push("");
    for (const r of inactive) {
      md.push(`- \`${r.id}\` — ${r.question} (${r.revisionStatus ?? "inactive"})`);
    }
    md.push("");
  }

  const mdPath = resolve(OUT_DIR, "questrade-gpt-review-pack.md");
  writeFileSync(mdPath, md.join("\n"), "utf8");

  const readme = `# Questrade GPT review packs

Regenerate after library changes:

\`\`\`bash
npm run export:questrade-library
npm run export:questrade:gpt-review
\`\`\`

## Files

| File | Best for |
|------|----------|
| \`questrade-gpt-review-pack.md\` | Upload to ChatGPT — readable tone pass on all **active** answers |
| \`questrade-gpt-review-pack.json\` | Structured review, scripts, or Custom GPT with JSON knowledge |
| \`exports/questrade_interview_library.json\` | Full system export (embeddings metadata, relationships) |

## Suggested ChatGPT prompt (tone)

\`\`\`
You are reviewing my Questrade Senior PM interview answer library for TONE only.

Rules:
- Do not invent metrics, employers, or experiments.
- Flag anything that sounds AI-smooth, overly formal, or unlike a senior PM speaking in an interview.
- Note inconsistent tense (especially Arc'teryx current-employment rehearsal).
- Respect evidenceStatus on each row; do not suggest claiming unverified_detail as fact.
- Output: table with id, question (short), issue, suggested micro-edit (optional), priority P0/P1/P2.

[Paste or attach the pack]
\`\`\`

Optional: \`node scripts/generate-questrade-gpt-review-pack.mjs --include-inactive\` appends archived rows list.
`;
  writeFileSync(resolve(OUT_DIR, "README-gpt-review.md"), readme, "utf8");

  console.log(`Wrote ${active.length} active Q&As`);
  console.log("  ", mdPath);
  console.log("  ", jsonPath);
  console.log("  ", resolve(OUT_DIR, "README-gpt-review.md"));
}

main();
