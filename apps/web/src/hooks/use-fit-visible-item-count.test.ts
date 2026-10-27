import { describe, expect, it } from "vitest";
import { collapsedRowHeightForFit, computeFitVisibleCount } from "./use-fit-visible-item-count";

describe("computeFitVisibleCount", () => {
  it("fills available height with row + gap", () => {
    expect(computeFitVisibleCount(400, 64, 6, 20)).toBe(5);
    expect(computeFitVisibleCount(400, 64, 6, 3)).toBe(3);
  });

  it("returns at least one when space allows", () => {
    expect(computeFitVisibleCount(80, 64, 6, 10)).toBe(1);
  });

  it("returns zero when no items or no space", () => {
    expect(computeFitVisibleCount(0, 64, 6, 10)).toBe(0);
    expect(computeFitVisibleCount(400, 64, 6, 0)).toBe(0);
  });
});

describe("collapsedRowHeightForFit", () => {
  it("ignores expanded sample height and keeps last collapsed baseline", () => {
    const el = { offsetHeight: 420 } as HTMLElement;
    expect(collapsedRowHeightForFit(el, 72, 68)).toBe(68);
  });

  it("updates when sample is collapsed", () => {
    const el = { offsetHeight: 64 } as HTMLElement;
    expect(collapsedRowHeightForFit(el, 72, 0)).toBe(64);
  });
});
