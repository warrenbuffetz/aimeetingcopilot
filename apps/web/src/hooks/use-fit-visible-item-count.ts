import { useLayoutEffect, useRef, useState, type RefObject } from "react";

const DEFAULT_ROW_PX = 72;
const GAP_PX = 6;
/** Expanded cards exceed this; treat larger measurements as collapsed baseline for fit math. */
const COLLAPSED_ROW_MAX_PX = 112;

export function collapsedRowHeightForFit(
  sampleEl: HTMLElement | null,
  fallbackRowPx: number,
  lastCollapsedPx: number
): number {
  if (!sampleEl) return lastCollapsedPx || fallbackRowPx;
  const h = sampleEl.offsetHeight;
  if (h <= COLLAPSED_ROW_MAX_PX) return h;
  return lastCollapsedPx || fallbackRowPx;
}

/** How many list rows fit in a scroll region (collapsed row height + gap). */
export function computeFitVisibleCount(
  availablePx: number,
  rowPx: number,
  gapPx: number,
  max: number
): number {
  if (max <= 0 || availablePx <= 0 || rowPx <= 0) return 0;
  const per = rowPx + gapPx;
  return Math.max(1, Math.min(max, Math.floor((availablePx + gapPx) / per)));
}

type Options = {
  enabled: boolean;
  itemCount: number;
  gapPx?: number;
  fallbackRowPx?: number;
};

/**
 * Observes a flex scroll region and estimates how many fixed-height rows fit without scrolling.
 */
export function useFitVisibleItemCount(
  scrollRef: RefObject<HTMLElement | null>,
  sampleRowRef: RefObject<HTMLElement | null>,
  { enabled, itemCount, gapPx = GAP_PX, fallbackRowPx = DEFAULT_ROW_PX }: Options
): number {
  const [fit, setFit] = useState(() => Math.min(8, Math.max(itemCount, 1)));
  const lastCollapsedRowPx = useRef(fallbackRowPx);

  useLayoutEffect(() => {
    if (!enabled || itemCount <= 0) {
      setFit(itemCount);
      return;
    }

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const measure = () => {
      const raw = sampleRowRef.current?.offsetHeight ?? 0;
      if (raw > 0 && raw <= COLLAPSED_ROW_MAX_PX) {
        lastCollapsedRowPx.current = raw;
      }
      const rowPx = collapsedRowHeightForFit(
        sampleRowRef.current,
        fallbackRowPx,
        lastCollapsedRowPx.current
      );
      const next = computeFitVisibleCount(scrollEl.clientHeight, rowPx, gapPx, itemCount);
      setFit(next);
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(scrollEl);
    if (sampleRowRef.current) ro.observe(sampleRowRef.current);
    measure();

    return () => ro.disconnect();
  }, [enabled, itemCount, scrollRef, sampleRowRef, gapPx, fallbackRowPx]);

  return enabled ? Math.min(fit, itemCount) : itemCount;
}
