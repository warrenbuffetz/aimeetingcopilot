import { describe, expect, it } from "vitest";
import { SIDE_DESK_LIVE_CATALOGS } from "@/lib/questrade-jaz-interview/side-desk-live-catalog";
import { getSideDeskLiveBundle, validateLiveCatalogBundles } from "@/lib/questrade-jaz-interview/side-desk-live-bundle";
import { searchSideDeskCheatSheets } from "@/lib/questrade-jaz-interview/side-desk-search";

describe("side desk live catalogs", () => {
  it("priority cards resolve to non-empty bundles", () => {
    expect(validateLiveCatalogBundles()).toEqual([]);
  });

  it("system design money movement bundle has speak lines and panel links", () => {
    const bundle = getSideDeskLiveBundle("system-design", "sd-money-movement");
    expect(bundle).toBeTruthy();
    expect(bundle!.speakLines.length).toBeGreaterThanOrEqual(2);
    expect(bundle!.panelLinks.some((l) => l.curatedKey === "P06")).toBe(true);
  });

  it("diagnostic volume-down bundle includes decompose guidance", () => {
    const bundle = getSideDeskLiveBundle("diagnostic", "dx-volume-down");
    expect(bundle!.speakLines.some((l) => /decompose|active transactor|completion/i.test(l.label + l.text))).toBe(
      true
    );
  });

  it("each sheet has flow steps with at least one card", () => {
    for (const catalog of Object.values(SIDE_DESK_LIVE_CATALOGS)) {
      expect(catalog.flowSteps.length).toBeGreaterThanOrEqual(4);
      for (const step of catalog.flowSteps) {
        expect(step.cardIds.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("side desk search → cards", () => {
  it("finds idempotency as a technical card", () => {
    const hits = searchSideDeskCheatSheets("idempotency", "technical");
    expect(hits[0]?.cardId).toBeTruthy();
    expect(hits[0]?.label.toLowerCase()).toContain("idempotency");
  });

  it("finds transaction volume as a diagnostic card", () => {
    const hits = searchSideDeskCheatSheets("transaction volume", "diagnostic");
    expect(hits.some((h) => h.cardId === "dx-volume-down")).toBe(true);
  });

  it("finds money movement as a system design card", () => {
    const hits = searchSideDeskCheatSheets("money movement", "system-design");
    expect(hits.some((h) => h.cardId === "sd-money-movement")).toBe(true);
  });
});
