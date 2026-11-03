"use client";

import { cn } from "@/lib/utils";

type Props = {
  onPointerDown: (e: React.PointerEvent) => void;
  className?: string;
  label?: string;
  orientation?: "vertical" | "horizontal";
  /** Stronger always-visible grip for primary layout splits (e.g. Jaz interview map). */
  variant?: "default" | "strong";
};

export function PanelResizeHandle({
  onPointerDown,
  className,
  label = "Resize panel",
  orientation = "vertical",
  variant = "default",
}: Props) {
  const horizontal = orientation === "horizontal";
  const strong = variant === "strong";

  return (
    <div
      role="separator"
      aria-orientation={horizontal ? "horizontal" : "vertical"}
      aria-label={label}
      title={label}
      onPointerDown={onPointerDown}
      className={cn(
        "group relative z-20 shrink-0 touch-none select-none",
        horizontal
          ? cn(
              "h-2 w-full cursor-row-resize",
              strong
                ? "bg-border/50 hover:bg-violet-200/70 active:bg-violet-300/80"
                : "bg-border/40 hover:bg-border/70",
              "before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-border",
              strong && "before:h-0.5 before:bg-violet-400/70"
            )
          : cn(
              "min-h-full cursor-col-resize self-stretch",
              strong ? "w-3 bg-violet-200/70 hover:bg-violet-300/80 active:bg-violet-400/70" : "w-2 bg-border/35 hover:bg-border/60",
              "before:absolute before:inset-y-3 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border/80",
              strong && "before:w-0.5 before:bg-violet-500/60 group-hover:before:bg-violet-600/80",
              "after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-10 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-violet-500/25 after:opacity-100 group-hover:after:bg-violet-600/35",
              !strong && "after:hidden"
            ),
        className
      )}
    />
  );
}
