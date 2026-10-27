#!/usr/bin/env node
/**
 * Career / motivation / job-specific Q&A alignment (Simplii ↔ Questrade).
 * Output: data/review/career-motivation-profile-alignment.md
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SIMPLII_PATH = resolve(root, "imports/simplii_final_qa.json");
const QUESTRADE_PATH = resolve(root, "exports/questrade_interview_library.json");
const OUT_PATH = resolve(root, "data/review/career-motivation-profile-alignment.md");

const SIMPLII_MARKERS = /\b(simplii(?:\s+financial)?)\b/i;
const QUESTRADE_MARKERS = /\b(questrade|questbank)\b/i;
const WHY_JOB =
  /\bwhy\s+(questrade|simplii|questbank|this\s+(role|company|opportunity)|are you interested)\b/i;

function normQ(q) {
  return (q ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[?.!]+$/g, "");
}

function isInactive(r) {
  const m = r.navigatorMeta ?? r.navigator_meta ?? {};
  if (r.status === "inactive") return true;
  if (m.retrievalExcluded) return true;
  return m.revisionStatus === "superseded" || m.revisionStatus === "archived";
}

function isCareerRow(r, questionField = "canonicalQuestion") {
  const q = r[questionField] ?? r.question ?? "";
  const sec = r.librarySection ?? r.navigatorMeta?.librarySection;
  const cat = r.libraryCategory ?? r.navigatorMeta?.libraryCategory;
  const mod = r.experienceModuleId ?? r.navigatorMeta?.experienceModuleId;
  if (mod === "career-general") return true;
  if (sec === "career_motivation" || cat === "career_recruiter") return true;
  if (SIMPLII_MARKERS.test(q) || WHY_JOB.test(q)) return true;
  if (/\btell me about yourself\b/i.test(q)) return true;
  if (/\bwhy\s+.+\b(arcteryx|move|leaving|instead)\b/i.test(q) && QUESTRADE_MARKERS.test(q)) return true;
  if (/\bwhy\s+.+\b(arcteryx|move|leaving|instead)\b/i.test(q) && SIMPLII_MARKERS.test(q)) return true;
  return false;
}

function classifyRow(question) {
  const q = question ?? "";
  if (/\btell me about yourself\b/i.test(q)) return "tmay-pair";
  if (WHY_JOB.test(q)) return "job-specific-pair";
  if (SIMPLII_MARKERS.test(q) && !QUESTRADE_MARKERS.test(q)) return "simplii-only";
  if (QUESTRADE_MARKERS.test(q) && !SIMPLII_MARKERS.test(q)) return "questrade-only";
  return "generic-career";
}

function classifyPair(simQ, qtQ) {
  const qt = qtQ && qtQ !== "—" ? qtQ : "";
  if (simQ && qt) {
    if (normQ(simQ) === normQ(qt)) return classifyRow(simQ);
    if (WHY_JOB.test(simQ) || WHY_JOB.test(qt)) return "job-specific-pair";
    if (SIMPLII_MARKERS.test(simQ) && QUESTRADE_MARKERS.test(qt)) return "job-specific-pair";
    if (SIMPLII_MARKERS.test(simQ) && !SIMPLII_MARKERS.test(qt)) return "job-specific-pair";
  }
  return classifyRow(simQ);
}

function recommendShared(kind, adaptationType, hasQtLink) {
  if (kind === "simplii-only") return { shared: "N", exclusive: "simplii", action: "Keep Simplii-only row; tag `profileExclusive: simplii`." };
  if (kind === "questrade-only") return { shared: "N", exclusive: "questrade", action: "Keep Questrade-only row; tag `profileExclusive: questrade`." };
  if (kind === "tmay-pair") {
    return {
      shared: "Partial",
      exclusive: "—",
      action: "Merge to one shared body; use `employerClosing` for last paragraph (Questrade vs Simplii).",
    };
  }
  if (kind === "job-specific-pair") {
    return {
      shared: hasQtLink ? "Partial" : "Review",
      exclusive: "split",
      action:
        "Two rows (Simplii Q + Questrade Q); share body where possible, `profileExclusive` per side, or shared body + `employerClosing`.",
    };
  }
  if (adaptationType === "reused" && hasQtLink) {
    return { shared: "Y", exclusive: "—", action: "Candidate for single shared row + closings if answers still diverge only at end." };
  }
  return { shared: "Review", exclusive: "—", action: "Compare answers; shared body + closings or keep two rows." };
}

function escCell(s) {
  return (s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function main() {
  const simplii = JSON.parse(readFileSync(SIMPLII_PATH, "utf8"));
  const qt = JSON.parse(readFileSync(QUESTRADE_PATH, "utf8"));

  const qtById = new Map();
  const qtByNorm = new Map();
  for (const r of qt.records ?? []) {
    if (isInactive(r)) continue;
    qtById.set(r.id, r);
    const cq = r.canonicalQuestion ?? r.question;
    const n = normQ(cq);
    if (!qtByNorm.has(n)) qtByNorm.set(n, r);
  }

  const simRows = (simplii.records ?? []).filter((r) => isCareerRow(r, "canonicalQuestion"));
  const usedQtIds = new Set();
  const tableRows = [];

  for (const s of simRows) {
    const q = s.canonicalQuestion ?? "";
    const srcId = s.sourceQuestradeRecordId ?? null;
    let qtRow = srcId ? qtById.get(srcId) : null;
    if (!qtRow) qtRow = qtByNorm.get(normQ(q)) ?? null;
    if (qtRow) usedQtIds.add(qtRow.id);

    const qtQ = qtRow ? qtRow.canonicalQuestion ?? qtRow.question : "—";
    const kind = classifyPair(q, qtQ);
    const rec = recommendShared(kind, s.adaptationType, Boolean(srcId || qtRow));
    const tier = s.preparationTier ?? "—";
    const qtId = qtRow?.id ?? "—";
    const qtKey = qtRow?.navigatorMeta?.importKey ?? qtRow?.importKey ?? "—";

    tableRows.push({
      tier,
      kind,
      questionSimplii: q,
      questionQuestrade: qtQ,
      shared: rec.shared,
      profileExclusive: rec.exclusive,
      simpliiExternalId: s.externalId,
      questradeId: qtId,
      questradeImportKey: qtKey,
      sourceQuestradeRecordId: srcId ?? "—",
      adaptationType: s.adaptationType ?? "—",
      employerClosingSimplii: "",
      employerClosingQuestrade: "",
      nextAction: rec.action,
    });
  }

  // Questrade career rows with no Simplii counterpart
  for (const r of qt.records ?? []) {
    if (isInactive(r)) continue;
    if (!isCareerRow(r, "question")) continue;
    if (usedQtIds.has(r.id)) continue;
    const q = r.canonicalQuestion ?? r.question;
    const kind = classifyRow(q);
    const rec = recommendShared(kind, null, false);
    tableRows.push({
      tier: r.navigatorMeta?.preparationTier ?? "—",
      kind,
      questionSimplii: "—",
      questionQuestrade: q,
      shared: rec.shared,
      profileExclusive: rec.exclusive,
      simpliiExternalId: "—",
      questradeId: r.id,
      questradeImportKey: r.navigatorMeta?.importKey ?? "—",
      sourceQuestradeRecordId: "—",
      adaptationType: "—",
      employerClosingSimplii: "",
      employerClosingQuestrade: "",
      nextAction: rec.action + (kind === "questrade-only" ? " Add Simplii variant only if needed." : ""),
    });
  }

  const order = { P0: 0, P1: 1, P2: 2, "—": 3 };
  tableRows.sort((a, b) => {
    const ta = order[a.tier] ?? 9;
    const tb = order[b.tier] ?? 9;
    if (ta !== tb) return ta - tb;
    return a.questionSimplii.localeCompare(b.questionSimplii);
  });

  const lines = [];
  lines.push("# Career & motivation — profile alignment workbook");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Use this table to decide **shared library** vs **profile-exclusive** rows and to draft `employerClosing` text.");
  lines.push("");
  lines.push("**Legend — Shared?** `Y` = one canonical row for both profiles; `N` = keep separate; `Partial` = same story, different employer question or closing; `Review` = you still need to diff answers.");
  lines.push("");
  lines.push("**Legend — profileExclusive** `simplii` / `questrade` / `split` / `—` (shared).");
  lines.push("");
  lines.push(`| P | Shared? | profileExclusive | Simplii question | Questrade question | simplii \`externalId\` | Questrade UUID | QT \`importKey\` | \`sourceQuestradeRecordId\` | adapt | employerClosing (Simplii) | employerClosing (Questrade) | Next action |`);
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const r of tableRows) {
    lines.push(
      `| ${escCell(r.tier)} | ${r.shared} | ${escCell(r.profileExclusive)} | ${escCell(r.questionSimplii)} | ${escCell(r.questionQuestrade)} | ${escCell(r.simpliiExternalId)} | ${escCell(r.questradeId)} | ${escCell(r.questradeImportKey)} | ${escCell(r.sourceQuestradeRecordId)} | ${escCell(r.adaptationType)} | | | ${escCell(r.nextAction)} |`
    );
  }

  lines.push("");
  lines.push("## Priority starter set (edit these first)");
  lines.push("");
  lines.push("| Topic | Simplii `externalId` | Questrade UUID | Suggested approach |");
  lines.push("| --- | --- | --- | --- |");

  const starters = [
    ["Tell me about yourself", "simplii-from-2f3a780e-6b54-42b8-b56d-8936a471fa68", "2f3a780e-6b54-42b8-b56d-8936a471fa68", "Shared body + `employerClosing` (already linked by source ID)."],
    ["Why this company / role", "simplii-from-c1d638b6-1858-487d-9ac2-5b6cc5327eb8", "c1d638b6-1858-487d-9ac2-5b6cc5327eb8", "`profileExclusive` each side OR shared intro + two closings."],
    ["Motivation / move to this bank", "simplii-from-28571e7f-620f-4880-9cd7-cdfc2e146aa8", "28571e7f-620f-4880-9cd7-cdfc2e146aa8", "Linked by `sourceQuestradeRecordId`; Simplii Q names Simplii. QT also has Arc'teryx variant `bfd102e5-…`."],
    ["Strongest reason to hire you", "simplii-from-de31db47-3aea-4d26-be40-e0fa92423dd1", "—", "Mostly shared; tweak closing for Simplii squad framing."],
  ];

  for (const [topic, sid, qid, approach] of starters) {
    lines.push(`| ${topic} | \`${sid}\` | \`${qid}\` | ${approach} |`);
  }

  lines.push("");
  lines.push("## After editing");
  lines.push("");
  lines.push("1. Update `imports/simplii_final_qa.json` (and Questrade export/seed as needed).");
  lines.push("2. `npm run import:simplii:final:apply`");
  lines.push("3. Spot-check Live → Simplii profile → All Answers → Career & Motivation.");
  lines.push("");
  lines.push("See `docs/profile-content-strategy.md`.");

  writeFileSync(OUT_PATH, lines.join("\n"), "utf8");
  console.log(`Wrote ${tableRows.length} rows → ${OUT_PATH}`);
}

main();
