"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadRecordingFile } from "@/lib/session-recording/download";
import type { SessionRecordingView } from "@/hooks/use-session-recording";
import type { SessionRecordingSourceMode } from "@/lib/session-recording/types";
import {
  ChevronDown,
  Circle,
  Download,
  Info,
  Mic,
  Monitor,
  Pause,
  Play,
  Square,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  view: SessionRecordingView;
  onStart: (mode: SessionRecordingSourceMode) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDiscard: () => void;
};

function SourcePick({
  mode,
  onChange,
  disabled,
}: {
  mode: SessionRecordingSourceMode;
  onChange: (m: SessionRecordingSourceMode) => void;
  disabled?: boolean;
}) {
  const options: { id: SessionRecordingSourceMode; label: string; hint: string; icon: typeof Mic }[] = [
    {
      id: "microphone",
      label: "Microphone only",
      hint: "Your mic. Best for in-person or phone interviews.",
      icon: Mic,
    },
    {
      id: "meeting-tab",
      label: "Meeting tab audio",
      hint: "Capture audio from a meeting tab. Best for Google Meet, Zoom, etc.",
      icon: Monitor,
    },
    {
      id: "microphone-and-meeting",
      label: "Microphone + meeting audio",
      hint: "Mixes both into one file. Desktop apps often cannot share system audio.",
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const selected = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex w-full gap-3 rounded-lg border p-3 text-left transition-colors",
              selected
                ? "border-sky-500/70 bg-sky-500/10 ring-1 ring-sky-500/40"
                : "border-border/80 bg-muted/20 hover:bg-muted/35",
              disabled && "pointer-events-none opacity-60"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                selected ? "border-sky-400" : "border-muted-foreground/50"
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-sky-400" />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {opt.label}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{opt.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function sourcesLabel(view: SessionRecordingView): string {
  const { microphone, meeting } = view.sourcesActive;
  if (microphone && meeting) return "Microphone + meeting tab";
  if (meeting) return "Meeting tab audio";
  if (microphone) return "Microphone";
  return "No live audio tracks";
}

export function SessionRecordingControl({
  view,
  onStart,
  onPause,
  onResume,
  onStop,
  onDiscard,
}: Props) {
  const [open, setOpen] = useState(false);
  const [sourceMode, setSourceMode] = useState<SessionRecordingSourceMode>("microphone");
  const busy = view.phase === "recording" || view.phase === "paused";
  const recordingActive = view.isRecordingActive || view.phase === "paused";

  const previewUrl = useMemo(
    () => (view.phase === "stopped" && view.blob ? URL.createObjectURL(view.blob) : null),
    [view.blob, view.phase]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleDownload() {
    if (!view.blob || !view.filename) return;
    try {
      const method = await downloadRecordingFile(view.blob, view.filename);
      toast.success(method === "save-picker" ? "Recording saved" : "Download started");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.error(e instanceof Error ? e.message : "Download failed");
    }
  }

  const triggerLabel = recordingActive
    ? view.phase === "paused"
      ? `REC · paused`
      : `REC ${view.elapsedLabel}`
    : "Record";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        nativeButton
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 gap-1.5 px-2.5 font-normal",
              recordingActive && "border-border bg-muted/30 hover:bg-muted/40"
            )}
          />
        }
      >
        <Circle
          className={cn(
            "h-2.5 w-2.5 shrink-0",
            recordingActive
              ? "fill-red-500 text-red-500 animate-pulse"
              : "fill-transparent text-muted-foreground"
          )}
        />
        <span
          className={cn(
            "text-sm tabular-nums",
            recordingActive && "font-semibold text-red-500"
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(22rem,calc(100vw-2rem))] p-0"
        sideOffset={6}
      >
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Session recording</h2>
          <p className="mt-1 text-xs text-muted-foreground">Recorded locally. Not uploaded.</p>
        </div>

        <div className="space-y-3 px-4 py-3">
          {busy && (
            <p className="text-xs text-muted-foreground">
              Capturing: <span className="text-foreground/90">{sourcesLabel(view)}</span>
              {view.warning && <span className="mt-1 block text-amber-300/90">{view.warning}</span>}
              {view.persistWarning && (
                <span className="mt-1 block text-amber-300/90">{view.persistWarning}</span>
              )}
            </p>
          )}

          {(view.phase === "idle" || view.phase === "error" || busy) && (
            <SourcePick mode={sourceMode} onChange={setSourceMode} disabled={busy} />
          )}

          {view.error && (view.phase === "idle" || view.phase === "error") && (
            <p className="text-xs text-red-400/90">{view.error}</p>
          )}

          {view.phase === "idle" || view.phase === "error" ? (
            <Button
              type="button"
              className="h-10 w-full bg-red-600 font-medium text-white hover:bg-red-600/90"
              onClick={() => {
                onStart(sourceMode);
              }}
            >
              <Circle className="mr-1.5 h-3 w-3 fill-current" />
              Start recording
            </Button>
          ) : null}

          {busy && (
            <div className="flex flex-col gap-2">
              {view.phase === "recording" ? (
                <Button type="button" variant="outline" className="h-10 w-full" onClick={onPause}>
                  <Pause className="h-4 w-4" /> Pause recording
                </Button>
              ) : (
                <Button type="button" variant="outline" className="h-10 w-full" onClick={onResume}>
                  <Play className="h-4 w-4" /> Resume recording
                </Button>
              )}
              <Button
                type="button"
                className="h-10 w-full bg-red-600 font-medium text-white hover:bg-red-600/90"
                onClick={() => void onStop()}
              >
                <Square className="h-4 w-4" /> Stop &amp; save
              </Button>
            </div>
          )}

          {view.phase === "stopped" && view.completedOk && view.blob && (
            <>
              <ul className="space-y-0.5 text-xs text-muted-foreground">
                <li>Duration: {view.durationLabel}</li>
                <li>Size: {view.fileSizeLabel}</li>
                <li>Sources: {sourcesLabel(view)}</li>
              </ul>
              {previewUrl && <audio controls className="h-8 w-full" src={previewUrl} />}
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" className="flex-1" onClick={() => void handleDownload()}>
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => void onDiscard()}>
                  <Trash2 className="h-4 w-4" /> Discard
                </Button>
              </div>
            </>
          )}

          {view.phase === "error" && view.error && !busy && (
            <Button type="button" size="sm" variant="ghost" className="w-full" onClick={() => void onDiscard()}>
              Clear error
            </Button>
          )}
        </div>

        <div className="flex gap-2 border-t border-border px-4 py-2.5 text-[10px] leading-snug text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <p>
            Recording is independent of transcription — your audio is saved locally on this device only.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
