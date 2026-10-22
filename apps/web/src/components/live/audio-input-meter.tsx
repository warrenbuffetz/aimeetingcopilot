"use client";

import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

const BAR_COUNT = 8;

type AudioInputMeterProps = {
  listening: boolean;
  voiceLevel: number;
  voiceActive: boolean;
  hasAudioTrack: boolean;
  className?: string;
};

export function AudioInputMeter({
  listening,
  voiceLevel,
  voiceActive,
  hasAudioTrack,
  className,
}: AudioInputMeterProps) {
  const boosted = listening ? Math.min(1, voiceLevel) : 0;

  const label = !listening
    ? "Not listening"
    : !hasAudioTrack
      ? "Connecting mic…"
      : voiceActive
        ? "Speech detected"
        : "Listening";

  return (
    <div
      className={cn("flex h-9 items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Mic
        className={cn(
          "h-4 w-4 shrink-0",
          listening && hasAudioTrack && voiceActive && "text-emerald-400",
          listening && hasAudioTrack && !voiceActive && "text-emerald-400/55",
          (!listening || !hasAudioTrack) && "text-muted-foreground"
        )}
        aria-hidden
      />
      <MeterBars level={boosted} voiceActive={listening && voiceActive && hasAudioTrack} />
      <span
        className={cn(
          "text-xs",
          listening && !hasAudioTrack && "text-amber-400",
          listening && hasAudioTrack && voiceActive && "font-medium text-emerald-400",
          listening && hasAudioTrack && !voiceActive && "text-muted-foreground",
          !listening && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function MeterBars({ level, voiceActive }: { level: number; voiceActive: boolean }) {
  const litBars = level > 0.02 ? Math.round(level * BAR_COUNT) : 0;
  return (
    <div className="flex h-[22px] items-end gap-0.5" aria-hidden>
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const on = i < litBars;
        return (
          <span
            key={i}
            className={cn(
              "w-1 rounded-sm transition-[height,background-color] duration-75",
              on
                ? voiceActive
                  ? "bg-emerald-400"
                  : "bg-emerald-400/40"
                : "bg-muted-foreground/25"
            )}
            style={{ height: 10 + (i + 1) * 1.75 }}
          />
        );
      })}
    </div>
  );
}
