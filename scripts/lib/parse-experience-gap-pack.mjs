/**
 * Parse Interview_Experience_Gap_QA_Cursor_Pack.md into structured cards (verbatim text).
 */
import { readFileSync } from "fs";

const SECTION_MARKERS = [
  "**Full spoken answer**",
  "**Short alternative**",
  "**Also matches:**",
  "**Story parent:**",
  "**Suggested next questions, in default order:**",
  "**Next step:**",
  "**Review note, not spoken:**",
];

function stripMarker(line) {
  for (const m of SECTION_MARKERS) {
    if (line.startsWith(m)) return line.slice(m.length).trim();
  }
  return null;
}

function parseStageRelevance(line) {
  const out = {};
  const map = {
    recruiter: "recruiter",
    "hiring manager": "hiring_manager",
    panel: "cross_functional_panel",
  };
  const priority = {
    "very high": "very_high",
    high: "high",
    medium: "medium",
    low: "low",
  };
  const body = line.replace(/^\*\*Stage relevance:\*\*\s*/i, "");
  for (const part of body.split(";")) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^(.+?)\s+(Very High|High|Medium|Low)$/i);
    if (!m) continue;
    const roundKey = map[m[1].trim().toLowerCase()];
    const priKey = priority[m[2].trim().toLowerCase()];
    if (roundKey && priKey) out[roundKey] = priKey;
  }
  return out;
}

function parseCardMeta(line) {
  const card = line.match(/\*\*Card:\*\*\s*([^\s·]+)/)?.[1];
  const module = line.match(/\*\*Module:\*\*\s*([^·]+)/)?.[1]?.trim();
  const tier = line.match(/\*\*Prepare:\*\*\s*(P\d)/)?.[1];
  return { card, module, tier };
}

function parseSuggestedNext(lines) {
  const items = [];
  for (const line of lines) {
    const m = line.match(/^-\s+(.+?)\s+\(([a-z0-9-]+)\)\s*$/);
    if (m) items.push({ question: m[1].trim(), cardId: m[2] });
  }
  return items;
}

function parseAliases(rest) {
  if (!rest) return [];
  return rest
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

function evidenceFromReviewNote(note) {
  const n = note.toLowerCase();
  if (n.includes("hypothetical") || n.includes("illustrative")) return "illustrative_scenario";
  if (n.includes("forward-looking") || n.includes("not a claimed historical")) return "rehearsal_framework";
  if (n.includes("resume-supported")) return "resume_supported";
  if (n.includes("unconfirmed") || n.includes("confirm before")) return "unverified_detail";
  return "resume_supported";
}

function reviewRequiredFromNote(note) {
  const n = note.toLowerCase();
  return (
    n.includes("hypothetical") ||
    n.includes("illustrative") ||
    n.includes("confirm before") ||
    n.includes("forward-looking") ||
    n.includes("needs confirmation") ||
    n.includes("validate that")
  );
}

function intentFromCardId(cardId) {
  if (cardId.endsWith("-overview") || cardId.endsWith("-story")) return "main_story";
  if (cardId.includes("discovery") || cardId.includes("context")) return "problem_discovery";
  if (cardId.includes("ownership")) return "personal_ownership";
  if (cardId.includes("measurement") || cardId.includes("definition") || cardId.includes("validation"))
    return "measurement_impact";
  if (cardId.includes("attribution")) return "attribution";
  if (cardId.includes("tradeoff") || cardId.includes("disagreement") || cardId.includes("conflict"))
    return "tradeoffs";
  if (cardId.includes("failure") || cardId.includes("lesson")) return "challenges_lessons";
  if (cardId.includes("prioritization") || cardId.includes("rollout") || cardId.includes("choice"))
    return "prioritization";
  if (cardId.includes("transfer-to-banking")) return "general";
  return "general";
}

/** Map pack module labels to navigator experience module IDs (employer overviews route to company hub modules). */
export const MODULE_LABEL_TO_ID = {
  "Arc'teryx — Employer Overview": "arcteryx-membership",
  "Arc'teryx — CRM & Customer Communications": "arcteryx-crm",
  "Arc'teryx — Membership Platform": "arcteryx-membership",
  "RBC — Employer Overview": "rbc-core",
  "RBC — Core Web, Mobile & Travel": "rbc-core",
  "RBC — ShopPlus": "rbc-shopplus",
  "RBC — Avion Select": "rbc-avion",
  "RBC — Cashback Withdrawals": "rbc-cashback",
  "HBC — Employer Overview": "hbc-portfolio",
  "HBC — Post-Approval Activation": "hbc-activation",
  "HBC — Quests": "hbc-quests",
  "HBC — Cardholder Portfolio & P&L": "hbc-portfolio",
  "HBC — Mastercard Acquisition": "hbc-mastercard-app",
  "Air Canada / Aeroplan — Employer Overview": "aeroplan-cobrand",
  "Aeroplan — Commercial Partnerships": "aeroplan-partnerships",
  "Aeroplan — Co-brand Card Acquisition": "aeroplan-cobrand",
};

const OVERVIEW_CARD_IDS = new Set(["arc-overview", "rbc-overview", "hbc-overview", "air-overview"]);

export function parseExperienceGapPack(mdPath) {
  const raw = readFileSync(mdPath, "utf8");
  const start = raw.indexOf("## Complete Q&A");
  if (start === -1) throw new Error("Missing ## Complete Q&A section");
  const body = raw.slice(start);

  const chunks = body.split(/\n#### \d+\.\s+/).slice(1);
  const cards = [];

  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const canonicalQuestion = lines[0].trim();
    let cardMeta = null;
    let stageLine = null;
    let i = 1;
    while (i < lines.length && !lines[i].startsWith("**Full spoken answer**")) {
      if (lines[i].startsWith("**Card:**")) cardMeta = parseCardMeta(lines[i]);
      if (lines[i].startsWith("**Stage relevance:**")) stageLine = lines[i];
      i++;
    }

    if (!cardMeta?.card) throw new Error(`Missing card id for: ${canonicalQuestion}`);

    const sections = {
      fullParas: [],
      shortParas: [],
      fullBuf: [],
      shortBuf: [],
      aliases: [],
      parent: null,
      suggestedNext: [],
      nextStep: null,
      reviewNote: null,
    };
    let mode = null;
    const suggestedBuf = [];

    const flushPara = (which) => {
      const buf = which === "full" ? sections.fullBuf : sections.shortBuf;
      const paras = which === "full" ? sections.fullParas : sections.shortParas;
      const text = buf.join(" ").trim();
      if (text) paras.push(text);
      buf.length = 0;
    };

    for (; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("**Full spoken answer**")) {
        mode = "full";
        continue;
      }
      if (line.startsWith("**Short alternative**")) {
        flushPara("full");
        mode = "short";
        continue;
      }
      if (line.startsWith("**Also matches:**")) {
        flushPara("short");
        mode = "aliases";
        sections.aliases = parseAliases(stripMarker(line));
        continue;
      }
      if (line.startsWith("**Story parent:**")) {
        flushPara(mode === "short" ? "short" : "full");
        mode = null;
        sections.parent = stripMarker(line);
        continue;
      }
      if (line.startsWith("**Suggested next questions")) {
        flushPara(mode === "short" ? "short" : "full");
        mode = "suggested";
        suggestedBuf.length = 0;
        continue;
      }
      if (line.startsWith("**Next step:**")) {
        mode = null;
        sections.nextStep = stripMarker(line);
        if (suggestedBuf.length) sections.suggestedNext = parseSuggestedNext(suggestedBuf);
        continue;
      }
      if (line.startsWith("**Review note")) {
        flushPara(mode === "short" ? "short" : "full");
        mode = "review";
        const inline = stripMarker(line);
        sections.reviewNote = inline || "";
        continue;
      }
      if (line.startsWith("### ") || line.startsWith("## ")) break;

      if (mode === "full") {
        if (!line.trim()) flushPara("full");
        else sections.fullBuf.push(line.trim());
      } else if (mode === "short") {
        if (!line.trim()) flushPara("short");
        else sections.shortBuf.push(line.trim());
      } else if (mode === "suggested" && line.trim().startsWith("-")) suggestedBuf.push(line);
      else if (mode === "review") sections.reviewNote += (sections.reviewNote ? "\n" : "") + line;
    }

    if (!sections.suggestedNext.length && suggestedBuf.length) {
      sections.suggestedNext = parseSuggestedNext(suggestedBuf);
    }
    flushPara("full");
    flushPara("short");

    const answer = sections.fullParas.join("\n\n").trim();
    const shortAnswer = sections.shortParas.join("\n\n").trim();
    const reviewNote = (sections.reviewNote ?? "").trim();

    cards.push({
      cardId: cardMeta.card,
      canonicalQuestion,
      moduleLabel: cardMeta.module,
      experienceModuleId: MODULE_LABEL_TO_ID[cardMeta.module] ?? "unclassified-review",
      isEmployerOverview: OVERVIEW_CARD_IDS.has(cardMeta.card),
      preparationTier: cardMeta.tier ?? "P1",
      roundRelevance: stageLine ? parseStageRelevance(stageLine) : {},
      answer,
      spokenAnswer: answer,
      shortAnswer,
      aliases: sections.aliases,
      parentCardId: sections.parent,
      suggestedNext: sections.suggestedNext,
      nextStep: sections.nextStep,
      reviewNote,
      evidenceStatus: evidenceFromReviewNote(reviewNote),
      reviewRequired: true,
      questionIntent: intentFromCardId(cardMeta.card),
    });
  }

  if (cards.length !== 61) {
    throw new Error(`Expected 61 cards, parsed ${cards.length}`);
  }

  const cardIds = new Set(cards.map((c) => c.cardId));
  for (const c of cards) {
    if (c.parentCardId && !cardIds.has(c.parentCardId)) {
      throw new Error(`Unknown parent ${c.parentCardId} for ${c.cardId}`);
    }
    for (const sn of c.suggestedNext) {
      if (!cardIds.has(sn.cardId)) {
        throw new Error(`Unknown suggested next ${sn.cardId} from ${c.cardId}`);
      }
    }
  }

  return cards;
}

export function contentFingerprint(c) {
  return JSON.stringify({
    q: c.canonicalQuestion,
    a: c.answer,
    s: c.shortAnswer,
    aliases: c.aliases,
    review: c.reviewNote,
  });
}
