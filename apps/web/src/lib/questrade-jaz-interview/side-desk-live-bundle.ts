import {
  SIDE_DESK_CHEAT_SHEETS,
  SIDE_DESK_PANEL_KEYS,
  type SideDeskCheatSheet,
  type SideDeskCheatSheetId,
} from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import {
  SIDE_DESK_LIVE_CATALOGS,
  getLiveCard,
  type SideDeskLiveCard,
} from "@/lib/questrade-jaz-interview/side-desk-live-catalog";
import { jazInterviewQuestions } from "@/lib/questrade-jaz-interview/dataset";
import type { ProductSensePanelLink } from "@/lib/questrade-jaz-interview/product-sense-panel-links";

export type SideDeskSpeakLine = {
  label: string;
  text: string;
};

export type SideDeskLiveBundle = {
  card: SideDeskLiveCard;
  speakLines: SideDeskSpeakLine[];
  panelLinks: ProductSensePanelLink[];
  sourceRow?: string[];
};

function fold(s: string): string {
  return s.toLowerCase().replace(/[★\u2605]/g, "").replace(/\s+/g, " ").trim();
}

function findRow(sheet: SideDeskCheatSheet, needles: string[]): string[] | null {
  const norms = needles.map(fold);
  let best: { row: string[]; score: number } | null = null;
  for (const section of sheet.sections) {
    for (const row of section.table?.rows ?? []) {
      const hay = fold(row.join(" "));
      for (const n of norms) {
        if (!n) continue;
        if (hay.includes(n)) {
          const score = n.length + (row.some((c) => fold(c).startsWith(n)) ? 20 : 0);
          if (!best || score > best.score) best = { row, score };
        }
      }
    }
    for (const p of section.prose ?? []) {
      const hay = fold(p);
      for (const n of norms) {
        if (n && hay.includes(n) && (!best || n.length > best.score)) {
          best = { row: [p], score: n.length };
        }
      }
    }
  }
  return best?.row ?? null;
}

function pickCells(row: string[]): { title: string; detail: string } {
  const withStar = row.find((c) => /★|\u2605/.test(c));
  const title = (withStar ?? row[0] ?? "").replace(/\s*[★\u2605]\s*/g, "").trim();
  const detail = row.filter((c) => c !== withStar && c !== row[0]).join(" · ") || row.slice(1).join(" · ");
  return { title, detail: detail.trim() };
}

function relatedRow(
  sheet: SideDeskCheatSheet,
  sectionIdPrefix: string,
  needles: string[]
): string[] | null {
  const section = sheet.sections.find((s) => s.id.startsWith(sectionIdPrefix) || s.id.includes(sectionIdPrefix));
  if (!section?.table) return findRow(sheet, needles);
  const norms = needles.map(fold);
  for (const row of section.table.rows) {
    const hay = fold(row.join(" "));
    if (norms.some((n) => n && hay.includes(n))) return row;
  }
  return null;
}

function panelLinksFor(sheetId: SideDeskCheatSheetId, card: SideDeskLiveCard): ProductSensePanelLink[] {
  let keys = [...SIDE_DESK_PANEL_KEYS[sheetId]];
  if (card.id.includes("balance") || card.id.includes("txn-history") || card.id.includes("available")) {
    keys = ["P04", ...keys.filter((k) => k !== "P04")];
  }
  if (card.id.includes("dd") || card.id.includes("direct-deposit") || card.id.includes("volume")) {
    keys = sheetId === "diagnostic" ? ["P05"] : keys;
  }
  const out: ProductSensePanelLink[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) continue;
    const q = jazInterviewQuestions.find((item) => item.curatedKey === key);
    if (!q) continue;
    seen.add(key);
    out.push({ curatedKey: key, shortLabel: q.shortLabel, questionId: q.id });
  }
  return out;
}

function systemBundle(card: SideDeskLiveCard, sheet: SideDeskCheatSheet): SideDeskSpeakLine[] {
  const row = findRow(sheet, card.match);
  const lines: SideDeskSpeakLine[] = [];
  if (row) {
    const { title, detail } = pickCells(row);
    lines.push({ label: card.kind === "failure" ? "Failure" : card.kind === "state" ? "States" : "Focus", text: `${title}: ${detail}` });
  } else {
    lines.push({ label: "Focus", text: `${card.label} — ${card.subtitle}` });
  }

  if (card.kind === "requirement" || card.kind === "mechanism") {
    const fail = relatedRow(sheet, "e-common-failure", ["timeout", "duplicate", "partial", "stale"]);
    if (fail) {
      const { title, detail } = pickCells(fail);
      lines.push({ label: "Failure to design for", text: `${title}: ${detail}` });
    }
    const control = relatedRow(sheet, "f-common-controls", ["Idempotency", "Reconciliation"]);
    if (control) {
      const { title, detail } = pickCells(control);
      lines.push({ label: "Control", text: `${title}: ${detail}` });
    }
  }

  if (card.kind === "failure") {
    const control = relatedRow(sheet, "f-common-controls", ["Idempotency", "Reconciliation", "Atomic"]);
    if (control) {
      const { title, detail } = pickCells(control);
      lines.push({ label: "Control", text: `${title}: ${detail}` });
    }
    const trade = relatedRow(sheet, "g-common-system-design", ["Immediate feedback", "Synchronous"]);
    if (trade) {
      const { title, detail } = pickCells(trade);
      lines.push({ label: "Trade-off", text: `${title}: ${detail}` });
    }
  }

  if (card.kind === "state") {
    lines.push({
      label: "Say",
      text: "Walk the customer through each state and what they see; name the system of record for each transition.",
    });
  }

  if (card.kind === "control") {
    lines.push({
      label: "Say",
      text: "State the trade-off explicitly, pick a default for the MVP, and say what you’d revisit with evidence.",
    });
  }

  lines.push({
    label: "Always ask",
    text: "Who’s allowed → validations → system of record → customer-visible states → recovery/reconciliation.",
  });

  return lines.slice(0, 5);
}

function diagnosticBundle(card: SideDeskLiveCard, sheet: SideDeskCheatSheet): SideDeskSpeakLine[] {
  const row = findRow(sheet, card.match);
  const lines: SideDeskSpeakLine[] = [];
  if (row) {
    const { title, detail } = pickCells(row);
    lines.push({ label: "Symptom / lens", text: `${title}: ${detail}` });
  } else {
    lines.push({ label: "Focus", text: `${card.label} — ${card.subtitle}` });
  }

  // Decomposition helper for volume-like symptoms
  if (card.id.includes("volume") || card.id.includes("payment") || card.id.includes("dd")) {
    const decomp = findRow(sheet, ["Completed transactions", "Active transactors", "Transaction volume"]);
    if (decomp) {
      lines.push({ label: "Decompose", text: decomp.join(" · ") });
    } else {
      lines.push({
        label: "Decompose",
        text: "Completed = active transactors × attempts × completion rate — which factor moved?",
      });
    }
  }

  const seg = relatedRow(sheet, "d-segmentation", ["Time", "Transaction type", "Processing stage", "Platform"]);
  if (seg) {
    const { title, detail } = pickCells(seg);
    lines.push({ label: "Segment", text: `${title}: ${detail}` });
  }

  if (card.flowStepId !== "act") {
    const test = relatedRow(sheet, "f-common-analytical", ["Funnel", "Error-code", "Ledger reconciliation", "Pre/post"]);
    if (test) {
      const { title, detail } = pickCells(test);
      lines.push({ label: "First test", text: `${title}: ${detail}` });
    }
  }

  if (card.flowStepId === "act" || card.id.startsWith("dx-mit")) {
    lines.push({
      label: "Act",
      text: "Mitigate the mechanism you proved — don’t ship a growth feature for an integrity or measurement bug.",
    });
  } else {
    lines.push({
      label: "Discipline",
      text: "Verify → Segment → Hypothesize → Test → Act. Diagnose the mechanism before proposing a fix.",
    });
  }

  return lines.slice(0, 5);
}

function technicalBundle(card: SideDeskLiveCard, sheet: SideDeskCheatSheet): SideDeskSpeakLine[] {
  const row = findRow(sheet, card.match);
  const lines: SideDeskSpeakLine[] = [];

  if (card.kind === "vignette") {
    lines.push({ label: "Scenario", text: card.label });
    lines.push({ label: "PM move", text: card.subtitle });
    if (card.id.includes("timeout")) {
      lines.push({
        label: "Mechanism",
        text: "Treat outcome as unknown: status inquiry + reconciliation; never blindly retry a mutating payment.",
      });
    } else if (card.id.includes("double")) {
      lines.push({
        label: "Mechanism",
        text: "Idempotency key on the logical payment; client and API must share the same key across retries.",
      });
    } else {
      lines.push({
        label: "Mechanism",
        text: "Status events can be late or reordered — design transitions that tolerate duplicates and out-of-order updates.",
      });
    }
  } else if (row) {
    const { title, detail } = pickCells(row);
    lines.push({ label: "Concept", text: title });
    lines.push({ label: "Mechanism / when", text: detail || card.subtitle });
  } else {
    lines.push({ label: "Concept", text: card.label });
    lines.push({ label: "When", text: card.subtitle });
  }

  const risk = relatedRow(sheet, "d-common-technical-risks", card.match.concat(["Duplicate", "Uncertain", "Stale"]));
  if (risk && card.kind !== "vignette") {
    const { title, detail } = pickCells(risk);
    lines.push({ label: "Risk", text: `${title}: ${detail}` });
  }

  const verify = relatedRow(sheet, "f-verification", ["Idempotency test", "Timeout test", "Reconciliation test", "State transition"]);
  if (verify) {
    const { title, detail } = pickCells(verify);
    lines.push({ label: "Verify", text: `${title}: ${detail}` });
  }

  lines.push({
    label: "Depth rule",
    text: "Define → mechanism → application → risks → verification. Stop at PM fluency unless asked to go deeper.",
  });

  return lines.slice(0, 5);
}

export function getSideDeskLiveBundle(sheetId: SideDeskCheatSheetId, cardId: string): SideDeskLiveBundle | null {
  const card = getLiveCard(sheetId, cardId);
  if (!card) return null;
  const sheet = SIDE_DESK_CHEAT_SHEETS[sheetId];
  const sourceRow = findRow(sheet, card.match) ?? undefined;

  let speakLines: SideDeskSpeakLine[];
  if (sheetId === "system-design") speakLines = systemBundle(card, sheet);
  else if (sheetId === "diagnostic") speakLines = diagnosticBundle(card, sheet);
  else speakLines = technicalBundle(card, sheet);

  return {
    card,
    speakLines,
    panelLinks: panelLinksFor(sheetId, card),
    sourceRow,
  };
}

export function validateLiveCatalogBundles(): string[] {
  const issues: string[] = [];
  for (const sheetId of ["system-design", "diagnostic", "technical"] as const) {
    for (const card of SIDE_DESK_LIVE_CATALOGS[sheetId].cards.filter((c) => c.priority)) {
      const bundle = getSideDeskLiveBundle(sheetId, card.id);
      if (!bundle || bundle.speakLines.length === 0) {
        issues.push(`${sheetId}/${card.id}: empty bundle`);
      }
    }
  }
  return issues;
}
