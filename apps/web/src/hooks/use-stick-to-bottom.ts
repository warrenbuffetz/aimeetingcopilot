"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_PX = 72;

export function useStickToBottom<T extends HTMLElement>(watchKey: string | number) {
  const containerRef = useRef<T | null>(null);
  const stickRef = useRef(true);
  const [showJumpLatest, setShowJumpLatest] = useState(false);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distance < NEAR_BOTTOM_PX;
    stickRef.current = near;
    setShowJumpLatest(!near);
  }, []);

  useEffect(() => {
    if (!stickRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [watchKey]);

  const jumpToLatest = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    stickRef.current = true;
    setShowJumpLatest(false);
  }, []);

  return { containerRef, onScroll, showJumpLatest, jumpToLatest };
}
