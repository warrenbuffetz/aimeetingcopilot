"use client";

import { useCallback, useEffect, useRef } from "react";

export function useVerticalResize(onDelta: (deltaY: number) => void, onEnd?: () => void) {
  const dragging = useRef(false);
  const lastY = useRef(0);
  const onDeltaRef = useRef(onDelta);
  const onEndRef = useRef(onEnd);
  onDeltaRef.current = onDelta;
  onEndRef.current = onEnd;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      const dy = e.clientY - lastY.current;
      lastY.current = e.clientY;
      onDeltaRef.current(dy);
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
