"use client";

import { cn } from "@/lib/utils";

export function ScriptText({
  text,
  className,
  clamp,
}: {
  text: string;
  className?: string;
  clamp?: boolean;
}) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  return (
    <div
      className={cn(
        "space-y-1.5 text-[13px] leading-[1.42] text-foreground/95 sm:text-[13.5px]",
        clamp && "line-clamp-[22]",
        className
      )}
    >
      {paragraphs.map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </div>
  );
}
