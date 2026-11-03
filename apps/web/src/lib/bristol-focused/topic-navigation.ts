import overlay from "@/data/bristol-topic-navigation-overlay.json";
import type { BristolQuestion } from "./dataset";

export type BristolSectionTier = "P1" | "P2" | "REF";

type OverlayRecord = {
  questionId: string;
  category: string;
  shortLabel: string;
  sectionTier: BristolSectionTier;
  sectionOrder: number;
  searchAliasesAdd?: string[];
};

const EXPECTED_CATEGORY_COUNTS: Record<string, number> = {
  "Career & Motivation": 9,
  "Industry POV & Strategic Judgment": 13,
  "Live Product Scenarios": 13,
  "Restaurant Product & Marketplace Strategy": 14,
  "AI/ML & Revenue Optimization": 10,
  "Restaurant Economics, Workflows & Metrics": 17,
  "Product Craft, Discovery & Experimentation": 15,
  "Experience Stories": 9,
  "Leadership & Judgment": 11,
};

const overlayRecords = (overlay as { records: OverlayRecord[] }).records;
const overlayById = new Map(overlayRecords.map((r) => [r.questionId, r]));

function foldAlias(value: string): string {
  return value.trim().toLowerCase();
}

function mergeAliases(existing: string[], add: string[] | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [...existing, ...(add ?? [])]) {
    const t = String(raw).trim();
    if (!t) continue;
    const key = foldAlias(t);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function applyTopicNavigationOverlay(questions: BristolQuestion[]): BristolQuestion[] {
  return questions.map((q) => {
    const row = overlayById.get(q.curatedKey);
    if (!row) return q;
    const navCompactLabel = row.shortLabel.trim();
    return {
      ...q,
      navCompactLabel,
      sectionTier: row.sectionTier,
      sectionOrder: row.sectionOrder,
      shortLabel: navCompactLabel,
      aliases: mergeAliases(q.aliases, row.searchAliasesAdd),
    };
  });
}

export function sortQuestionsForTopicsNav(items: BristolQuestion[]): BristolQuestion[] {
  return [...items].sort((a, b) => {
    const order = (a.sectionOrder ?? 999) - (b.sectionOrder ?? 999);
    if (order !== 0) return order;
    const la = a.navCompactLabel ?? a.shortLabel;
    const lb = b.navCompactLabel ?? b.shortLabel;
    return la.localeCompare(lb) || a.curatedKey.localeCompare(b.curatedKey);
  });
}

export function validateTopicNavigationOverlay(questions: BristolQuestion[]): string[] {
  const issues: string[] = [];
  const keys = new Set(questions.map((q) => q.curatedKey));

  if (overlayRecords.length !== 111) {
    issues.push(`overlay expected 111 records, found ${overlayRecords.length}`);
  }

  for (const row of overlayRecords) {
    if (!keys.has(row.questionId)) issues.push(`overlay orphan ${row.questionId}`);
    if (row.shortLabel.length > 28) issues.push(`${row.questionId} shortLabel exceeds 28 chars`);
  }

  for (const q of questions) {
    if (!overlayById.has(q.curatedKey)) issues.push(`question missing overlay ${q.curatedKey}`);
  }

  const tiers = { P1: 0, P2: 0, REF: 0 };
  for (const row of overlayRecords) {
    tiers[row.sectionTier] += 1;
  }
  if (tiers.P1 !== 35) issues.push(`expected 35 P1, found ${tiers.P1}`);
  if (tiers.P2 !== 56) issues.push(`expected 56 P2, found ${tiers.P2}`);
  if (tiers.REF !== 20) issues.push(`expected 20 REF, found ${tiers.REF}`);

  const byCat: Record<string, number> = {};
  for (const q of questions) {
    byCat[q.category] = (byCat[q.category] ?? 0) + 1;
  }
  for (const [cat, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
    if (byCat[cat] !== expected) issues.push(`category ${cat}: expected ${expected}, found ${byCat[cat] ?? 0}`);
  }

  const labelsByCat = new Map<string, Set<string>>();
  for (const q of questions) {
    const label = q.navCompactLabel ?? q.shortLabel;
    if (!labelsByCat.has(q.category)) labelsByCat.set(q.category, new Set());
    const set = labelsByCat.get(q.category)!;
    if (set.has(label)) issues.push(`duplicate compact label in ${q.category}: ${label}`);
    set.add(label);
  }

  return issues;
}
