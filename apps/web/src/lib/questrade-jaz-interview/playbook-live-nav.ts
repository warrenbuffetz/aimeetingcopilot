import { jazInterviewQuestions } from "@/lib/questrade-jaz-interview/dataset";
import { getPlaybookCase, type PlaybookCase } from "@/lib/questrade-jaz-interview/playbook-cases";

/** Sidebar / Cases trigger chips → best Priority case (then diagnostic fallback). */
export type LiveCaseTrigger = {
  id: string;
  label: string;
  /** Search / interviewer language hints */
  hints: string[];
  primaryCaseId: string;
  secondaryCaseIds?: string[];
};

export const LIVE_CASE_TRIGGERS: LiveCaseTrigger[] = [
  {
    id: "history",
    label: "History",
    hints: ["transaction history", "find a charge", "merchant", "search"],
    primaryCaseId: "T01",
    secondaryCaseIds: ["Q10.1-02", "Q10.1-03"],
  },
  {
    id: "balance",
    label: "Balance",
    hints: ["available balance", "posted", "holds", "spendable"],
    primaryCaseId: "T05",
    secondaryCaseIds: ["Q10.1-05", "Q10.5-02"],
  },
  {
    id: "pending",
    label: "Pending",
    hints: ["pending transfer", "payment status", "stuck"],
    primaryCaseId: "T04",
    secondaryCaseIds: ["Q10.3-02", "T10"],
  },
  {
    id: "bill",
    label: "Bill paid?",
    hints: ["bill", "hydro", "paid a bill", "receipt"],
    primaryCaseId: "T02",
    secondaryCaseIds: ["Q10.1-08", "T07"],
  },
  {
    id: "primary",
    label: "Primary bank",
    hints: ["primary bank", "direct deposit", "payroll", "switch"],
    primaryCaseId: "T03",
    secondaryCaseIds: ["T08", "Q10.2-04"],
  },
  {
    id: "activation",
    label: "Unfunded",
    hints: ["open but not fund", "activation", "first value"],
    primaryCaseId: "T08",
    secondaryCaseIds: ["Q10.2-02"],
  },
  {
    id: "timeout",
    label: "Timeout",
    hints: ["timeout", "idempotency", "retry", "unknown outcome"],
    primaryCaseId: "T10",
    secondaryCaseIds: ["Q10.6-03"],
  },
  {
    id: "support",
    label: "Support spike",
    hints: ["support contacts", "complaints", "dropped", "failures up"],
    primaryCaseId: "Q10.5-01",
    secondaryCaseIds: ["Q10.5-02", "T04"],
  },
  {
    id: "funding",
    label: "Bank ↔ invest",
    hints: ["investments", "brokerage", "funding", "TFSA"],
    primaryCaseId: "T09",
    secondaryCaseIds: ["Q10.4-06"],
  },
  {
    id: "cashflow",
    label: "Cash flow",
    hints: ["upcoming bills", "cash flow", "insights"],
    primaryCaseId: "T07",
    secondaryCaseIds: ["T06"],
  },
];

export const CASE_SEARCH_SUGGESTIONS = [
  "pending",
  "balance",
  "primary bank",
  "transaction history",
  "dropped",
  "timeout",
  "idempotency",
  "support spike",
  "direct deposit",
  "bill paid",
];

/** Panel script curatedKey → related playbook case IDs */
export const PANEL_TO_CASES: Record<string, string[]> = {
  P03: ["T03", "T08", "T02"],
  P04: ["T01", "T05", "T02"],
  P05: ["Q10.5-01", "T08", "T03"],
  P06: ["T04", "T10", "T05"],
  P08: ["T03", "T12", "T01"],
  P09: ["T03", "T08", "T07"],
};

/** Playbook case ID → related panel curatedKeys */
export const CASE_TO_PANELS: Record<string, string[]> = {
  T01: ["P04"],
  T02: ["P04", "P06"],
  T03: ["P03", "P09"],
  T04: ["P06", "P04"],
  T05: ["P04", "P06"],
  T06: ["P04"],
  T07: ["P04", "P09"],
  T08: ["P03", "P09"],
  T09: ["P04"],
  T10: ["P06", "P05"],
  T11: ["P04"],
  T12: ["P08", "P06"],
  "Q10.5-01": ["P05"],
  "Q10.5-02": ["P04", "P05"],
};

export type CrossLink = {
  curatedKey?: string;
  caseId?: string;
  label: string;
  questionId?: string;
};

export function panelLinksForCase(caseId: string): CrossLink[] {
  const keys = CASE_TO_PANELS[caseId] ?? [];
  const out: CrossLink[] = [];
  for (const key of keys) {
    const q = jazInterviewQuestions.find((item) => item.curatedKey === key);
    if (!q) continue;
    out.push({ curatedKey: key, label: `${key} · ${q.shortLabel}`, questionId: q.id });
  }
  return out;
}

export function caseLinksForPanel(curatedKey: string): CrossLink[] {
  const ids = PANEL_TO_CASES[curatedKey] ?? [];
  const out: CrossLink[] = [];
  for (const id of ids) {
    const c = getPlaybookCase(id);
    if (!c) continue;
    out.push({ caseId: id, label: `${id} · ${c.title}` });
  }
  return out;
}

export function resolveTriggerCase(triggerId: string): PlaybookCase | undefined {
  const t = LIVE_CASE_TRIGGERS.find((x) => x.id === triggerId);
  if (!t) return undefined;
  return getPlaybookCase(t.primaryCaseId);
}

export function casesForTrigger(triggerId: string): PlaybookCase[] {
  const t = LIVE_CASE_TRIGGERS.find((x) => x.id === triggerId);
  if (!t) return [];
  return [t.primaryCaseId, ...(t.secondaryCaseIds ?? [])]
    .map((id) => getPlaybookCase(id))
    .filter((c): c is PlaybookCase => Boolean(c));
}

/** Cheat sheet tab → related practice cases */
export const SHEET_TO_CASES: Record<string, string[]> = {
  "product-sense": ["T01", "T03", "T05", "T08"],
  diagnostic: ["Q10.5-01", "Q10.5-02", "T04"],
  technical: ["T10", "T04", "T12"],
  "system-design": ["T04", "T10", "T05"],
};

export function caseLinksForSheet(sheetId: string): CrossLink[] {
  const ids = SHEET_TO_CASES[sheetId] ?? [];
  const out: CrossLink[] = [];
  for (const id of ids) {
    const c = getPlaybookCase(id);
    if (!c) continue;
    out.push({ caseId: id, label: `${id} · ${c.title}` });
  }
  return out;
}

export function matchLiveTrigger(query: string): LiveCaseTrigger | undefined {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return undefined;
  return LIVE_CASE_TRIGGERS.find(
    (t) =>
      t.label.toLowerCase().includes(q) ||
      t.id === q ||
      t.hints.some((h) => h.includes(q) || q.includes(h))
  );
}
