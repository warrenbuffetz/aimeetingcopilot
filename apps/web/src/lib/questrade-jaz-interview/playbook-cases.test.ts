import { describe, expect, it } from "vitest";
import {
  playbookCases,
  playbookPriorityCases,
  primerLiveData,
  getPlaybookCase,
} from "@/lib/questrade-jaz-interview/playbook-cases";
import { searchPlaybookCases } from "@/lib/questrade-jaz-interview/playbook-search";
import {
  CASE_TO_PANELS,
  LIVE_CASE_TRIGGERS,
  PANEL_TO_CASES,
  caseLinksForPanel,
  caseLinksForSheet,
  panelLinksForCase,
} from "@/lib/questrade-jaz-interview/playbook-live-nav";

describe("everyday banking playbook cases", () => {
  it("loads 90 prepared answers including priority 12", () => {
    expect(playbookCases).toHaveLength(90);
    expect(playbookPriorityCases).toHaveLength(12);
    for (const q of playbookCases) {
      expect(q.spokenAnswer.length).toBeGreaterThan(40);
      expect(q.title.length).toBeGreaterThan(5);
    }
  });

  it("search finds diagnostic and technical cases", () => {
    expect(searchPlaybookCases("payment support contacts").some((h) => h.caseId?.startsWith("Q10.5"))).toBe(true);
    expect(searchPlaybookCases("idempotency").some((h) => h.kind === "case" || h.kind === "trigger")).toBe(true);
    expect(searchPlaybookCases("transaction history").some((h) => h.caseId === "T01" || h.caseId?.startsWith("Q10.1"))).toBe(
      true
    );
  });

  it("primer has distinctions and nav triggers", () => {
    expect(primerLiveData.distinctions.length).toBeGreaterThan(3);
    expect(primerLiveData.navMatrix.length).toBeGreaterThan(5);
  });

  it("live triggers resolve to real cases", () => {
    expect(LIVE_CASE_TRIGGERS.length).toBeGreaterThanOrEqual(8);
    for (const t of LIVE_CASE_TRIGGERS) {
      expect(getPlaybookCase(t.primaryCaseId)).toBeTruthy();
    }
    expect(searchPlaybookCases("primary bank").some((h) => h.caseId === "T03")).toBe(true);
  });

  it("cross-links panel ↔ cases ↔ sheets", () => {
    expect(Object.keys(PANEL_TO_CASES).length).toBeGreaterThan(3);
    expect(Object.keys(CASE_TO_PANELS).length).toBeGreaterThan(5);
    expect(caseLinksForPanel("P03").some((l) => l.caseId === "T03")).toBe(true);
    expect(panelLinksForCase("T03").some((l) => l.curatedKey === "P03")).toBe(true);
    expect(caseLinksForSheet("diagnostic").some((l) => l.caseId?.startsWith("Q10.5"))).toBe(true);
  });
});
