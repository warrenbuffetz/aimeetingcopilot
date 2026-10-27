"use client";

import { cn } from "@/lib/utils";

type Props = {
  onPointerDown: (e: React.PointerEvent) => void;
  className?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
};

export function PanelResizeHandle({
  onPointerDown,
  className,
  label = "Resize panel",
  orientation = "vertical",
}: Props) {
  const horizontal = orientation === "horizontal";
  return (
    <div
      role="separator"
      aria-orientation={horizontal ? "horizontal" : "vertical"}
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "group relative z-10 shrink-0 touch-none bg-transparent hover:bg-border/80",
        horizontal
          ? "h-1.5 w-full cursor-row-resize before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-border/60"
          : "w-1.5 cursor-col-resize before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border/60",
        className
      )}
    />
  );
}
