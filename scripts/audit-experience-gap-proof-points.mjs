#!/usr/bin/env node
/**
 * Audit experience-gap answers for missing resume headline / short-answer proof tokens.
 * Uses Interview_Experience_Gap_QA_Cursor_Pack.md as source of truth.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseExperienceGapPack } from "./lib/parse-experience-gap-pack.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const PACK = resolve(root, "docs/Interview_Experience_Gap_QA_Cursor_Pack.md");

/** Employer overview cards must touch each anchor phrase (normalized match). */
const OVERVIEW_ANCHORS = {
  "arc-overview": ["5.2", "five vendor", "50 million", "25%"],
  "rbc-overview": ["14-person", "14 person", "$1 million", "1 million", "Avion Select", "ShopPlus"],
  "hbc-overview": ["500", "Neo", "P&L", "portfolio"],
  "air-overview": ["427%", "40%", "Aeroplan", "partnership"],
};

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, " ");
}

function extractProofTokens(text) {
  const tokens = new Set();
  const patterns = [
    /\$[\d,.]+(?:\s*(?:million|m|billion|b))?/gi,
    /\b[\d,.]+\s*(?:million|billion)\b/gi,
    /\b[\d,.]+\s*%/g,
    /\b\d+(?:,\d{3})+\+?\b/g,
    /\b\d+(?:\.\d+)?\s*pp\b/gi,
    /\b100,?000\+?\b/g,
    /\b500,?000\b/g,
    /\b5\.2\b/g,
  ];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const t = m[0].trim();
      if (t.length >= 2) tokens.add(t);
    }
  }
  return [...tokens];
}

function tokenPresent(token, answerNorm) {
  const t = normalize(token);
  if (answerNorm.includes(t)) return true;
  const digits = t.replace(/[^\d.]/g, "");
  if (digits.length >= 2 && answerNorm.includes(digits)) return true;
  return false;
}

function anyAnchorPresent(anchors, answerNorm) {
  return anchors.some((a) => answerNorm.includes(normalize(a)));
}

function main() {
  const cards = parseExperienceGapPack(PACK);
  const gaps = [];
  const byEvidence = {
    resume_supported: [],
    illustrative_scenario: [],
    unverified_detail: [],
    rehearsal_framework: [],
  };

  for (const c of cards) {
    byEvidence[c.evidenceStatus]?.push(c.cardId);
    const answerNorm = normalize(c.answer);
    const shortTokens = extractProofTokens(c.shortAnswer);
    const missingFromFull = shortTokens.filter((tok) => !tokenPresent(tok, answerNorm));

    const overviewAnchors = OVERVIEW_ANCHORS[c.cardId];
    const missingOverview =
      overviewAnchors?.filter((a) => !answerNorm.includes(normalize(a))) ?? [];

    if (missingFromFull.length > 0 || missingOverview.length > 0) {
      gaps.push({
        cardId: c.cardId,
        question: c.canonicalQuestion,
        evidenceStatus: c.evidenceStatus,
        missingShortTokens: missingFromFull,
        missingOverviewAnchors: missingOverview,
        reviewNote: c.reviewNote.split("\n")[0].slice(0, 200),
      });
    }
  }

  const needsConfirmation = cards.filter(
    (c) =>
      c.evidenceStatus === "illustrative_scenario" ||
      c.evidenceStatus === "unverified_detail" ||
      c.reviewNote.toLowerCase().includes("hypothetical") ||
      c.reviewNote.toLowerCase().includes("confirm before")
  );

  const report = {
    at: new Date().toISOString(),
    cardCount: cards.length,
    proofGaps: gaps,
    proofGapCount: gaps.length,
    evidenceCounts: Object.fromEntries(
      Object.entries(byEvidence).map(([k, v]) => [k, v.length])
    ),
    needsConfirmationBeforeAutobiographical: needsConfirmation.map((c) => ({
      cardId: c.cardId,
      evidenceStatus: c.evidenceStatus,
      question: c.canonicalQuestion,
    })),
  };

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const jsonOut = resolve(root, "data/migration/experience-gap-proof-point-audit.json");
  writeFileSync(jsonOut, JSON.stringify(report, null, 2));

  const md = [];
  md.push("# Experience-gap proof-point audit\n");
  md.push(`Generated ${report.at}. Source: pack short-answer metrics + employer overview anchors.\n`);
  md.push(`## Summary\n`);
  md.push(`- **Cards:** ${report.cardCount}`);
  md.push(`- **Answers missing a short-answer metric or overview anchor in the full answer:** ${report.proofGapCount}`);
  md.push(`- **Confirm before presenting as real history:** ${needsConfirmation.length}\n`);
  md.push(`| Evidence bucket | Count |\n|---|---:|\n`);
  for (const [k, n] of Object.entries(report.evidenceCounts)) {
    md.push(`| ${k} | ${n} |`);
  }
  md.push("\n## Proof gaps (full answer should include these)\n");
  if (gaps.length === 0) {
    md.push("_None — every short-answer headline metric appears in the full spoken answer._\n");
  } else {
    for (const g of gaps) {
      md.push(`### ${g.cardId}\n`);
      md.push(`**Q:** ${g.question}\n`);
      md.push(`**Evidence:** ${g.evidenceStatus}\n`);
      if (g.missingShortTokens.length) {
        md.push(`- Missing from full answer (from short): ${g.missingShortTokens.join(", ")}\n`);
      }
      if (g.missingOverviewAnchors.length) {
        md.push(`- Missing overview anchors: ${g.missingOverviewAnchors.join(", ")}\n`);
      }
      md.push(`> ${g.reviewNote}\n`);
    }
  }
  md.push("\n## Confirm before autobiographical use\n");
  md.push(
    "These cards are intentionally bounded or illustrative; they are promoted for **practice retrieval** but review notes still apply.\n"
  );
  for (const c of needsConfirmation) {
    md.push(`- **${c.cardId}** (${c.evidenceStatus}) — ${c.canonicalQuestion}`);
  }
  md.push("\n## Global resume anchors (pack consistency table)\n");
  md.push(
    "Cross-check boundaries when interviewing: Arc CRM 25% is deployment failures not deliverability; RBC $1m withdrawals vs 5m settlements; Aeroplan 40% vs 427%; HBC Quests 6% vs lifecycle metrics; billings vs profit.\n"
  );

  const mdOut = resolve(root, "data/migration/experience-gap-proof-point-audit.md");
  writeFileSync(mdOut, md.join("\n"));

  console.log("Proof gaps:", report.proofGapCount);
  console.log("Needs confirmation:", needsConfirmation.length);
  console.log(jsonOut);
  console.log(mdOut);
}

main();
