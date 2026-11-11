import { describe, expect, it } from "vitest";
import {
  playbookCases,
  playbookPriorityCases,
  getPlaybookCase,
} from "@/lib/questrade-jaz-interview/playbook-cases";
import {
  buildReadAloudScript,
  getSpeakingScriptSlots,
  supportsSpeakingScript,
} from "@/lib/questrade-jaz-interview/playbook-speaking-script";

const REQUIRED_SLOT_KEYS = [
  "clarifyQuestion",
  "assumptionDetail",
  "customerTryingTo",
  "todayTheyHaveTo",
  "focusPart",
  "focusBecause",
  "optionA",
  "optionAHelpsWhen",
  "optionB",
  "choiceWhy",
  "customerWalkthrough",
  "tradeoff",
  "successIf",
  "earlySign",
  "concernIf",
  "verifyCompare",
  "changeMindIf",
] as const;

describe("product-sense speaking script", () => {
  it("enables speak mode for priority and product-sense only", () => {
    expect(supportsSpeakingScript(getPlaybookCase("T01")!)).toBe(true);
    expect(supportsSpeakingScript(playbookCases.find((q) => q.liveType === "product-sense")!)).toBe(true);
    expect(supportsSpeakingScript(playbookCases.find((q) => q.liveType === "diagnostic")!)).toBe(false);
    expect(supportsSpeakingScript(playbookCases.find((q) => q.liveType === "technical")!)).toBe(false);
    expect(supportsSpeakingScript(playbookCases.find((q) => q.liveType === "strategy")!)).toBe(false);
  });

  it("Priority 12 has enriched speak slots and readable aloud script", () => {
    expect(playbookPriorityCases).toHaveLength(12);
    for (const item of playbookPriorityCases) {
      const slots = getSpeakingScriptSlots(item);
      expect(slots).toBeTruthy();
      for (const key of REQUIRED_SLOT_KEYS) {
        expect(slots![key].length, `${item.id}.${key}`).toBeGreaterThan(8);
      }
      const script = buildReadAloudScript(slots!);
      expect(script).toContain(slots!.clarifyQuestion);
      expect(script).toContain(slots!.optionA);
      expect(script).toContain("I'd change direction if");
      expect(script.length).toBeGreaterThan(400);
    }
  });

  it("other product-sense cases get heuristic slots without crashing", () => {
    const sample = playbookCases.filter((q) => q.liveType === "product-sense").slice(0, 8);
    expect(sample.length).toBeGreaterThan(0);
    for (const item of sample) {
      const slots = getSpeakingScriptSlots(item);
      expect(slots?.optionA).toBeTruthy();
      expect(slots?.optionB).toBeTruthy();
      expect(buildReadAloudScript(slots!).length).toBeGreaterThan(200);
    }
  });
});
