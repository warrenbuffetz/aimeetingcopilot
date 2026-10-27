import { describe, expect, it } from "vitest";
import {
  experienceModulesForProfile,
  isExperienceModuleEligibleForProfile,
} from "../experience-modules";

describe("experience module profile eligibility", () => {
  it("hides Questrade case modules on Simplii", () => {
    expect(isExperienceModuleEligibleForProfile("questrade-primary", "simplii")).toBe(false);
    expect(isExperienceModuleEligibleForProfile("questrade-temenos", "simplii")).toBe(false);
    const simpliiIds = experienceModulesForProfile("simplii").map((m) => m.id);
    expect(simpliiIds.some((id) => id.startsWith("questrade-"))).toBe(false);
    expect(simpliiIds).toContain("digital-banking-engagement");
  });

  it("hides digital-banking modules on Questrade", () => {
    expect(isExperienceModuleEligibleForProfile("digital-banking-hub", "questrade")).toBe(false);
    const qtIds = experienceModulesForProfile("questrade").map((m) => m.id);
    expect(qtIds).toContain("questrade-primary");
    expect(qtIds.some((id) => id.startsWith("digital-banking-"))).toBe(false);
  });

  it("keeps shared resume modules on both profiles", () => {
    expect(isExperienceModuleEligibleForProfile("rbc-cashback", "simplii")).toBe(true);
    expect(isExperienceModuleEligibleForProfile("rbc-cashback", "questrade")).toBe(true);
  });
});
