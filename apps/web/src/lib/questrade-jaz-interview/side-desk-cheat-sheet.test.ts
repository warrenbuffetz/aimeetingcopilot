import { describe, expect, it } from "vitest";
import { SIDE_DESK_CHEAT_SHEETS } from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import { searchSideDeskCheatSheets } from "@/lib/questrade-jaz-interview/side-desk-search";

describe("side desk cheat sheets", () => {
  it("loads all three reference sheets with sections", () => {
    for (const id of ["system-design", "diagnostic", "technical"] as const) {
      const sheet = SIDE_DESK_CHEAT_SHEETS[id];
      expect(sheet.sections.length).toBeGreaterThan(4);
      expect(sheet.frameworkNote.length).toBeGreaterThan(20);
    }
  });

  it("finds idempotency in technical sheet", () => {
    const hits = searchSideDeskCheatSheets("idempotency", "technical");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.sheetId).toBe("technical");
  });
});
