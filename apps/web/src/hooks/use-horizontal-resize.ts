"use client";

import { useCallback, useEffect, useRef } from "react";

export function useHorizontalResize(onDelta: (deltaX: number) => void, onEnd?: () => void) {
  const dragging = useRef(false);
  const lastX = useRef(0);
  const onDeltaRef = useRef(onDelta);
  const onEndRef = useRef(onEnd);
  onDeltaRef.current = onDelta;
  onEndRef.current = onEnd;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      onDeltaRef.current(dx);
    }
    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      onEndRef.current?.();
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return { onPointerDown };
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
