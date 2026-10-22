"use client";

import { cn } from "@/lib/utils";

const BAR_COUNT = 8;

type AudioInputMeterProps = {
  listening: boolean;
  captureActive: boolean;
  voiceLevel: number;
  voiceActive: boolean;
  hasAudioTrack: boolean;
  className?: string;
};

export function AudioInputMeter({
  listening,
  captureActive,
  voiceLevel,
  voiceActive,
  hasAudioTrack,
  className,
}: AudioInputMeterProps) {
  if (!listening) {
    return (
      <div className={cn("flex h-9 items-center gap-2 text-xs text-muted-foreground", className)}>
        <MeterBars level={0} active={false} />
        <span>Not listening</span>
      </div>
    );
  }

  const boosted = Math.min(1, voiceLevel);
  const label = !captureActive
    ? "Starting audio…"
    : !hasAudioTrack
      ? "No audio track"
      : voiceActive
        ? "Speech detected"
        : "Listening (waiting for speech)";

  return (
    <div
      className={cn("flex h-9 items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <MeterBars level={boosted} active={voiceActive && hasAudioTrack} />
      <span
        className={cn(
          "text-xs",
          !hasAudioTrack && captureActive && "text-amber-400",
          hasAudioTrack && voiceActive && "font-medium text-emerald-400",
          hasAudioTrack && !voiceActive && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function MeterBars({ level, active }: { level: number; active: boolean }) {
  const filledBars = Math.round(level * BAR_COUNT);
  return (
    <div className="flex h-[22px] items-end gap-0.5" aria-hidden>
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const on = i < filledBars;
        return (
          <span
            key={i}
            className={cn(
              "w-1 rounded-sm transition-[height,background-color] duration-100",
              on
                ? active
                  ? "bg-emerald-400"
                  : "bg-muted-foreground/35"
                : "bg-muted-foreground/20"
            )}
            style={{ height: 10 + (i + 1) * 1.75 }}
          />
        );
      })}
    </div>
  );
}
