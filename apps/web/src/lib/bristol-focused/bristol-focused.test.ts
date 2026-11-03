import { describe, expect, it } from "vitest";
import {
  bristolAskQuestions,
  bristolBattlecard,
  bristolPinnedQuestions,
  bristolQuestions,
  bristolWeaknessTracker,
  validateBristolDataset,
  BRISTOL_NEEDS_GPT_MARKER,
} from "./dataset";
import { chooseClassicLiveProfile } from "@/lib/focused-live-routing";
import { isBristolFocusedProfileName } from "./profile";
import { searchBristolQuestions } from "./search";
import { mapIdsForQuestionId } from "./map-links";

describe("bristol focused dataset", () => {
  it("loads curated profile with resolver metadata", () => {
    expect(validateBristolDataset()).toEqual([]);
    expect(bristolQuestions).toHaveLength(111);
    expect(bristolQuestions.filter((q) => q.category === "Live Product Scenarios")).toHaveLength(13);
    expect(bristolQuestions.filter((q) => q.category === "Industry POV & Strategic Judgment").length).toBeGreaterThanOrEqual(12);
    expect(bristolBattlecard?.sections.length).toBeGreaterThanOrEqual(6);
    expect(bristolWeaknessTracker.length).toBeGreaterThanOrEqual(7);
    expect(bristolAskQuestions).toHaveLength(7);
    expect(bristolPinnedQuestions.length).toBeGreaterThanOrEqual(10);
    expect(bristolQuestions.every((q) => !q.answer.includes(BRISTOL_NEEDS_GPT_MARKER))).toBe(true);
  });

  it("maps B03 to Bristol override not legacy OpenTable import label", () => {
    const b03 = bristolQuestions.find((q) => q.curatedKey === "B03")!;
    expect(b03.opentableRecordId).toMatch(/^opentable-bristol-20261103-/);
    expect(b03.title).toMatch(/Restaurant Product team/i);
  });

  it("scenario SC01 includes twist response metadata", () => {
    const sc01 = bristolQuestions.find((q) => q.curatedKey === "SC01")!;
    expect(sc01.scenario?.responseToTwist).toBeTruthy();
    expect(sc01.answer.length).toBeGreaterThan(200);
  });

  it("includes new global/FOH questions B61 and B66", () => {
    expect(bristolQuestions.find((q) => q.curatedKey === "B61")).toBeTruthy();
    expect(bristolQuestions.find((q) => q.curatedKey === "B66")).toBeTruthy();
  });

  it("reuses OpenTable and shared answers without Questrade closings", () => {
    const intro = bristolQuestions.find((q) => q.curatedKey === "B01")!;
    expect(intro.answerSource).toBe("opentable");
    expect(intro.answer).toContain("OpenTable");
    expect(intro.answer).not.toMatch(/Questrade's everyday-banking/i);
  });

  it("B40 uses Bristol OpenTable override when present", () => {
    const interac = bristolQuestions.find((q) => q.curatedKey === "B40")!;
    expect(interac.answerSource).toBe("opentable");
    expect(interac.answer).toMatch(/Interac/);
  });

  it("searches role keywords", () => {
    const hit = searchBristolQuestions(bristolQuestions, "RevPASH")[0];
    const key = bristolQuestions.find((q) => q.id === hit?.questionId)?.curatedKey;
    expect(["B11", "B-R04"]).toContain(key);
  });

  it("links experience answers to story maps", () => {
    expect(mapIdsForQuestionId("bristol-B40")).toEqual(["rbc-payouts"]);
  });
});

describe("bristol profile routing", () => {
  it("recognizes focused profile name", () => {
    expect(isBristolFocusedProfileName("OpenTable — Bristol (Focused)")).toBe(true);
    expect(isBristolFocusedProfileName("Questrade — Jaz (Focused)")).toBe(false);
  });

  it("routes bristol focused profile to bristol kind", () => {
    const bristol = { id: "local", name: "OpenTable — Bristol (Focused)" };
    expect(chooseClassicLiveProfile([bristol], null)).toEqual({ kind: "bristol" });
  });
});
