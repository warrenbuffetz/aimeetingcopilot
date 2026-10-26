import type { EnrichedQaRow } from "./navigator/types";
import { EXPERIENCE_MODULES } from "./navigator/experience-modules";

export type ConceptSpan = {
  start: number;
  end: number;
  label: string;
  moduleId?: string;
  kind: "employer" | "product" | "technical" | "intent";
};

const STATIC_PHRASES: { pattern: RegExp; label: string; moduleId?: string; kind: ConceptSpan["kind"] }[] = [
  { pattern: /\bArc'?teryx\b/i, label: "Arc'teryx", moduleId: "arcteryx-membership", kind: "employer" },
  { pattern: /\bRBC\b/i, label: "RBC", kind: "employer" },
  { pattern: /\bHBC\b|Hudson'?s Bay/i, label: "HBC", kind: "employer" },
  { pattern: /\bAeroplan\b/i, label: "Aeroplan", moduleId: "aeroplan-cobrand", kind: "employer" },
  { pattern: /\bQuestrade\b/i, label: "Questrade", kind: "employer" },
  { pattern: /\bQuestbank\b/i, label: "Questbank", moduleId: "questrade-primary", kind: "product" },
  { pattern: /\bInterac\b/i, label: "Interac", moduleId: "rbc-cashback", kind: "technical" },
  { pattern: /\bTemenos\b/i, label: "Temenos", kind: "technical" },
  { pattern: /\bMCP\b|Model Context Protocol/i, label: "MCP", moduleId: "questrade-mcp", kind: "technical" },
  { pattern: /\bmembership platform\b/i, label: "Membership", moduleId: "arcteryx-membership", kind: "product" },
  { pattern: /\bcashback\b/i, label: "Cashback", moduleId: "rbc-cashback", kind: "product" },
  { pattern: /\bAvion\b/i, label: "Avion", moduleId: "rbc-avion", kind: "product" },
];

function overlaps(a: ConceptSpan, b: ConceptSpan): boolean {
  return a.start < b.end && b.start < a.end;
}

/** Longest non-overlapping concept spans for click-to-explore. */
export function findConceptSpans(question: string, _catalog?: EnrichedQaRow[]): ConceptSpan[] {
  const text = question;
  const found: ConceptSpan[] = [];
  for (const { pattern, label, moduleId, kind } of STATIC_PHRASES) {
    const m = text.match(pattern);
    if (!m || m.index === undefined) continue;
    found.push({
      start: m.index,
      end: m.index + m[0].length,
      label,
      moduleId,
      kind,
    });
  }
  for (const mod of Object.values(EXPERIENCE_MODULES)) {
    if (!mod.company) continue;
    const re = new RegExp(`\\b${mod.company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const m = text.match(re);
    if (m && m.index !== undefined) {
      found.push({
        start: m.index,
        end: m.index + m[0].length,
        label: mod.company,
        moduleId: mod.id,
        kind: "employer",
      });
    }
  }
  found.sort((a, b) => b.end - b.start - (a.end - a.start));
  const kept: ConceptSpan[] = [];
  for (const span of found) {
    if (kept.some((k) => overlaps(k, span))) continue;
    kept.push(span);
  }
  return kept.sort((a, b) => a.start - b.start);
}

export function moduleIdsForConcept(label: string, catalog: EnrichedQaRow[]): string[] {
  const lower = label.toLowerCase();
  const ids = new Set<string>();
  for (const row of catalog) {
    const mod = row.navigator.experienceModuleId;
    const lab = row.navigator.experienceLabel?.toLowerCase() ?? "";
    const q = row.question.toLowerCase();
    if (lab.includes(lower) || q.includes(lower) || mod.toLowerCase().includes(lower.replace(/'/g, ""))) {
      ids.add(mod);
    }
  }
  return [...ids];
}
