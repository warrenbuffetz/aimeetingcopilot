"use client";

import { cn } from "@/lib/utils";

type Props = {
  onPointerDown: (e: React.PointerEvent) => void;
  className?: string;
  label?: string;
};

export function PanelResizeHandle({ onPointerDown, className, label = "Resize panel" }: Props) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "group relative z-10 w-1.5 shrink-0 cursor-col-resize touch-none bg-transparent hover:bg-border/80",
        "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border/60",
        className
      )}
    />
  );
}
