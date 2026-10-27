import { describe, expect, it } from "vitest";
import { librarySectionsForProfile } from "../library-sections";

describe("librarySectionsForProfile", () => {
  it("hides Questrade-only sections on Simplii", () => {
    const sections = librarySectionsForProfile("simplii");
    expect(sections).not.toContain("questrade_cases");
    expect(sections).toContain("people_leadership");
  });

  it("shows people leadership on Questrade (shared content; count may be 0)", () => {
    const sections = librarySectionsForProfile("questrade");
    expect(sections).toContain("people_leadership");
    expect(sections).toContain("questrade_cases");
  });

  it("shows all sections when profile is unknown", () => {
    expect(librarySectionsForProfile("unknown")).toContain("questrade_cases");
    expect(librarySectionsForProfile("unknown")).toContain("people_leadership");
  });
});
