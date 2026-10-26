"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Mic,
  Monitor,
  Settings,
} from "lucide-react";

export type AudioSource = "microphone" | "meeting-tab";
export type SttEngine = "whisper" | "web-speech";

type Props = {
  listening: boolean;
  paused: boolean;
  voiceActive: boolean;
  hasAudioTrack: boolean;
  sttBackend: SttEngine | null;
  captureSource: string;
  localWhisperOnline: boolean | null;
  webSpeechSupported: boolean;
  micDeviceId: string;
  audioInputDevices: MediaDeviceInfo[];
  onMicDeviceChange: (id: string) => void;
  onStart: (source: AudioSource, engine: SttEngine) => void;
  audioWarning?: boolean;
};

function captureStatusLabel(hasAudioTrack: boolean, listening: boolean) {
  if (!listening) return "Capture off";
  if (hasAudioTrack) return "Mic/tab connected";
  return "Connecting capture…";
}

function transcriptionStatusLabel(
  listening: boolean,
  paused: boolean,
  sttBackend: SttEngine | null,
  localWhisperOnline: boolean | null,
  webSpeechSupported: boolean
) {
  if (!listening) return "Engine idle";
  if (paused) return "Transcription paused";
  if (sttBackend === "web-speech") return webSpeechSupported ? "Web Speech active" : "Web Speech unavailable";
  if (sttBackend === "whisper") {
    return localWhisperOnline ? "Whisper active" : "Whisper unavailable";
  }
  return "Starting engine…";
}

function sessionStatusLabel(listening: boolean, paused: boolean) {
  if (!listening) return "Session off";
  if (paused) return "Session paused";
  return "Session listening";
}

function SourceOption({
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: typeof Mic;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full gap-3 rounded-lg border p-3 text-left transition-colors",
        selected
          ? "border-sky-500/70 bg-sky-500/10 ring-1 ring-sky-500/40"
          : "border-border/80 bg-muted/20 hover:bg-muted/35"
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
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

export function AudioSetupPanel({
  listening,
  paused,
  voiceActive,
  hasAudioTrack,
  sttBackend,
  captureSource,
  localWhisperOnline,
  webSpeechSupported,
  micDeviceId,
  audioInputDevices,
  onMicDeviceChange,
  onStart,
  audioWarning,
}: Props) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<AudioSource>("microphone");
  const [engine, setEngine] = useState<SttEngine>("whisper");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sessionStatus = sessionStatusLabel(listening, paused);
  const captureStatus = captureStatusLabel(hasAudioTrack, listening);
  const transcriptionStatus = transcriptionStatusLabel(
    listening,
    paused,
    sttBackend,
    localWhisperOnline,
    webSpeechSupported
  );
  const status = listening ? (paused ? "Paused" : "Live") : "Off";
  const dotClass = !listening
    ? "bg-muted-foreground/60"
    : paused
      ? "bg-amber-400"
      : voiceActive
        ? "bg-emerald-400"
        : "bg-emerald-500";

  const meetingTabDisabled = engine === "web-speech";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        nativeButton
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-9 gap-2 rounded-full px-3 font-normal",
              audioWarning && "border-amber-500/50"
            )}
          />
        }
      >
        <span className={cn("h-2 w-2 shrink-0 rounded-full", dotClass)} />
        <span className="font-semibold text-foreground">Audio</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">{status}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <AudioLines className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-semibold">Audio setup</h2>
            </div>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:bg-muted/50"
              title="Microphone capture requires consent from participants"
            >
              <CircleHelp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Capture interview audio for live transcription and AI assistance.
          </p>
        </div>

        <div className="space-y-4 px-4 py-3">
          <div className="flex items-start gap-2">
            <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotClass)} />
            <div>
              <p className="text-sm font-medium">Audio · {status}</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                <li>Session: {sessionStatus}</li>
                <li>Capture: {captureStatus}</li>
                <li>Transcription: {transcriptionStatus}</li>
              </ul>
            </div>
          </div>

          <Button
            type="button"
            className="h-11 w-full gap-2 bg-emerald-600 text-base font-medium hover:bg-emerald-600/90"
            disabled={listening || (engine === "web-speech" && !webSpeechSupported)}
            onClick={() => {
              const effectiveSource = meetingTabDisabled ? "microphone" : source;
              onStart(effectiveSource, engine);
              setOpen(false);
            }}
          >
            <Mic className="h-5 w-5" />
            Start listening
          </Button>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Audio source</Label>
            <div className="space-y-2">
              <SourceOption
                selected={source === "microphone"}
                onSelect={() => setSource("microphone")}
                icon={Mic}
                title="Microphone"
                description="Capture your microphone. Best for in-person or phone interviews."
              />
              <SourceOption
                selected={source === "meeting-tab"}
                onSelect={() => !meetingTabDisabled && setSource("meeting-tab")}
                icon={Monitor}
                title="Meeting tab audio"
                description="Capture audio from a meeting tab. Best for Google Meet, Zoom, etc."
              />
              {meetingTabDisabled && (
                <p className="text-[10px] text-muted-foreground">Meeting tab requires Whisper (local STT).</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Transcription engine</Label>
            <Select
              value={engine}
              onValueChange={(v) => {
                const next = (v ?? "whisper") as SttEngine;
                setEngine(next);
                if (next === "web-speech") setSource("microphone");
              }}
            >
              <SelectTrigger className="h-auto min-h-10 w-full py-2">
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                    {engine === "whisper" ? "Whisper (local STT)" : "Web Speech (browser)"}
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    {engine === "whisper"
                      ? "More accurate, runs locally. No cloud STT required."
                      : "Chrome sends audio to Google. Mic only — good for quick demos."}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper">Whisper (local STT)</SelectItem>
                <SelectItem value="web-speech" disabled={!webSpeechSupported}>
                  Web Speech (browser)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            {engine === "whisper" && localWhisperOnline === true && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-400">Whisper server online</span>
              </>
            )}
            {engine === "whisper" && localWhisperOnline === false && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-amber-400">Whisper offline</span>
              </>
            )}
            {engine === "web-speech" && (
              <span className="text-muted-foreground">Browser transcription</span>
            )}
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            <Settings className="h-3.5 w-3.5" />
            Advanced settings
          </button>
        </div>

        {showAdvanced && (
          <div className="border-t border-border px-4 py-3">
            <Label className="text-[10px] text-muted-foreground">Microphone device</Label>
            <Select value={micDeviceId} onValueChange={(v) => onMicDeviceChange(v ?? "default")}>
              <SelectTrigger className="mt-1 h-9 w-full">
                <span className="truncate text-xs">
                  {micDeviceId === "default"
                    ? "System default"
                    : audioInputDevices.find((d) => d.deviceId === micDeviceId)?.label || "Microphone"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">System default</SelectItem>
                {audioInputDevices.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label || `Microphone ${d.deviceId.slice(0, 8)}…`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
