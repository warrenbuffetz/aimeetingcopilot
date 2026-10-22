"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLiveSession, type TranscriptLineKind } from "@/hooks/use-live-session";
import { useBrowserAudioCapture } from "@/hooks/use-browser-audio-capture";
import { useWebSpeechTranscription } from "@/hooks/use-web-speech-transcription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Copy,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { PanelResizeHandle } from "@/components/live/panel-resize-handle";
import { clamp, useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { usePersistedBoolean, usePersistedNumber } from "@/hooks/use-persisted-state";
import { toast } from "sonner";
import { AudioInputMeter } from "@/components/live/audio-input-meter";
import { InterviewNavigator } from "@/components/live/interview-navigator";
import { useLibraryCommandPalette } from "@/components/live/library-command-palette";
import { ScriptText } from "@/components/live/script-text";
import { useInterviewContext } from "@/hooks/use-interview-context";
import type { EnrichedQaRow } from "@interview-copilot/shared";
import { intentLabel } from "@interview-copilot/shared";

function transcriptLineClass(kind: TranscriptLineKind, isFinal: boolean) {
  return cn(
    "rounded-md px-2 py-1",
    !isFinal && "opacity-60 italic",
    kind === "filler" && "text-muted-foreground/70 text-xs",
    kind === "speech" && "text-foreground/80",
    kind === "candidate" && "border border-amber-500/50 bg-amber-500/10 text-amber-50/90",
    kind === "question" && "border border-emerald-500/40 bg-emerald-500/10"
  );
}

export default function LiveInterviewPage() {
  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [manualQuestion, setManualQuestion] = useState("");
  const [showFull, setShowFull] = useState(true);
  const [pinned, setPinned] = useState<string | null>(null);
  const [pinnedQuestion, setPinnedQuestion] = useState<string | null>(null);
  const [localWhisperOnline, setLocalWhisperOnline] = useState<boolean | null>(null);
  const [micDeviceId, setMicDeviceId] = useState<string>("default");
  const [sttBackend, setSttBackend] = useState<"whisper" | "web-speech" | null>(null);
  const [transcriptCollapsed, setTranscriptCollapsed] = usePersistedBoolean("ic-live-transcript-collapsed", false);
  const [transcriptWidth, setTranscriptWidth] = usePersistedNumber("ic-live-transcript-width", 268);
  const [navigatorWidth, setNavigatorWidth] = usePersistedNumber("ic-live-navigator-width", 400);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const session = useLiveSession(profileId);
  const interviewNav = useInterviewContext(session.library);
  const capture = useBrowserAudioCapture();
  const webSpeech = useWebSpeechTranscription({
    onFinalSegment: (segment) => session.ingestSpeechFragment(segment),
    onInterim: (text) => session.ingestWebSpeechInterim(text),
    onError: (message) => toast.error(message),
  });

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("interview_profiles").select("id, name");
      const list = data ?? [];
      setProfiles(list);
      if (list.length === 1) {
        setProfileId(list[0].id);
      } else {
        const preferred = list.find((p) => /questrade/i.test(p.name));
        if (preferred) setProfileId(preferred.id);
      }
    })();
  }, []);

  useEffect(() => {
    void fetch("/api/health")
      .then((r) => r.json())
      .then((h: { localWhisper?: boolean }) => setLocalWhisperOnline(Boolean(h.localWhisper)))
      .catch(() => setLocalWhisperOnline(false));
  }, []);

  useEffect(() => {
    void capture.refreshAudioInputs();
  }, [capture.refreshAudioInputs]);

  useEffect(() => {
    const r = session.questionHistory[session.historyIndex];
    if (!r?.question) return;
    interviewNav.registerDetection(r.question, r.matches[0]?.sourceId);
  }, [session.historyIndex, session.questionHistory, interviewNav.registerDetection]);

  async function runAnalyze(
    question: string,
    options?: { announce?: boolean; forceMainPanel?: boolean }
  ) {
    return session.analyze(question, {
      ...options,
      respectMainPanelLock: Boolean(pinned) || session.answerLocked,
    });
  }

  function openInMainPanel(row: EnrichedQaRow) {
    void runAnalyze(row.question, { forceMainPanel: true });
  }

  function pinRow(row: EnrichedQaRow) {
    setPinned(row.answer);
    setPinnedQuestion(row.question);
  }

  const { palette, setPaletteOpen } = useLibraryCommandPalette(openInMainPanel, interviewNav.catalog);

  const maxNavigatorWidth = useCallback(() => {
    const w = workspaceRef.current?.clientWidth ?? 1200;
    return Math.max(320, Math.floor(w * 0.45));
  }, []);

  const transcriptResize = useHorizontalResize((dx) => {
    setTranscriptWidth((w) => clamp(w + dx, 220, 360));
  });

  const navigatorResize = useHorizontalResize((dx) => {
    setNavigatorWidth((w) => clamp(w + dx, 320, maxNavigatorWidth()));
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey || e.key.toLowerCase() !== "t") return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      e.preventDefault();
      setTranscriptCollapsed((c) => !c);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setTranscriptCollapsed]);

  useEffect(() => {
    const onResize = () => {
      setNavigatorWidth((w) => clamp(w, 320, maxNavigatorWidth()));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [maxNavigatorWidth, setNavigatorWidth]);

  function outcomeBadge(outcome: string | undefined) {
    if (outcome === "PREPARED") return <Badge className="bg-emerald-600/90">Prepared</Badge>;
    if (outcome === "ADAPTED") return <Badge variant="secondary">Adapted</Badge>;
    return <Badge variant="outline">No match</Badge>;
  }

  function matchBadge(method: string | undefined) {
    if (method === "lexical") return <Badge variant="outline" className="text-[10px]">Local match</Badge>;
    return null;
  }

  async function copyAnswer() {
    const text = session.result?.answer;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  async function startLocalWhisperTab() {
    webSpeech.stop();
    setSttBackend("whisper");
    await capture.startDisplay();
    session.setListening(true);
    capture.startContinuousTranscription((blob) => void session.transcribeChunk(blob));
    if (localWhisperOnline === false) {
      toast.message("Start Whisper in another terminal: npm run whisper:server");
    }
  }

  async function startLocalWhisperMic() {
    webSpeech.stop();
    setSttBackend("whisper");
    const deviceId = micDeviceId === "default" ? undefined : micDeviceId;
    await capture.startMicrophone(deviceId);
    session.setListening(true);
    capture.startContinuousTranscription((blob) => void session.transcribeChunk(blob));
    if (localWhisperOnline === false) {
      toast.message("Start Whisper in another terminal: npm run whisper:server");
    }
  }

  function startWebSpeechMic() {
    if (!webSpeech.isSupported) {
      toast.error("Web Speech API is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    capture.stop();
    setSttBackend("web-speech");
    session.setListening(true);
    webSpeech.start();
    toast.message("Web Speech (Joist-style) — mic only, uses Google’s cloud STT");
  }

  function stopAll() {
    session.stopListening();
    webSpeech.stop();
    capture.stop();
    setSttBackend(null);
  }

  const displayAnswer = pinned ?? session.result?.answer ?? "Start listening or run simulation to detect questions.";
  const matchedRowId = session.result?.matches[0]?.sourceId;
  const matchedMeta = interviewNav.catalog.find((r) => r.id === matchedRowId)?.navigator;

  const profileLabel =
    profileId == null
      ? "No profile"
      : profiles.find((p) => p.id === profileId)?.name ?? "Profile";

  const audioWarning =
    sttBackend !== "web-speech" && (localWhisperOnline === false || Boolean(capture.health.error));

  const sourceLabel =
    sttBackend === "web-speech"
      ? "web-speech (microphone)"
      : sttBackend === "whisper"
        ? capture.source
        : "idle";

  const historyCount = session.questionHistory.length;
  const historyPosition = historyCount > 0 ? session.historyIndex + 1 : 0;

  return (
    <div className="flex h-[calc(100vh)] max-h-[calc(100vh)] flex-col overflow-hidden">
      <header className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">Live interview</h1>
            <p className="text-xs text-muted-foreground">
              Listening is explicit — inform participants and comply with local rules.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={profileId ?? "all"}
              onValueChange={(v) => setProfileId(v === "all" ? null : v)}
            >
              <SelectTrigger id="live-profile" className="h-9 min-w-0 w-[14rem] max-w-[14rem]">
                <SelectValue className="sr-only" />
                <span className="truncate" title={profileLabel}>{profileLabel}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">No profile</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 rounded-md border border-border bg-muted/20 p-1">
              <Button
                size="sm"
                variant={session.paused ? "secondary" : "ghost"}
                className="h-8"
                onClick={() => session.setPaused(!session.paused)}
              >
                {session.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {session.paused ? "Resume" : "Pause"}
              </Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={stopAll} disabled={!session.listening}>
                <Square className="h-4 w-4" /> Stop
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton
                render={
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn("gap-1.5", audioWarning && "border-amber-500/50")}
                  />
                }
              >
                Audio
                {localWhisperOnline === true && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" title="Whisper online" />
                )}
                {sttBackend !== "web-speech" && localWhisperOnline === false && (
                  <span className="h-2 w-2 rounded-full bg-amber-500" title="Whisper offline" />
                )}
                {sttBackend === "web-speech" && (
                  <span className="h-2 w-2 rounded-full bg-sky-500" title="Web Speech active" />
                )}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[17rem]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Web Speech (Joist demo)</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => startWebSpeechMic()}
                    disabled={!webSpeech.isSupported}
                  >
                    Start — microphone
                  </DropdownMenuItem>
                  <p className="px-2 pb-2 text-[10px] text-muted-foreground">
                    Browser STT (Chrome → Google). Compare accuracy vs local Whisper. Mic only — no tab
                    capture.
                  </p>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Whisper (local STT)</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => void startLocalWhisperTab()}>
                    Start — meeting tab audio
                  </DropdownMenuItem>
                  <div className="px-2 py-1.5">
                    <Label className="text-[10px] text-muted-foreground">Microphone</Label>
                    <Select
                      value={micDeviceId}
                      onValueChange={(v) => setMicDeviceId(v ?? "default")}
                    >
                      <SelectTrigger className="mt-1 h-8 w-full" title="Microphone input">
                        <span className="truncate text-xs">
                          {micDeviceId === "default"
                            ? "System default"
                            : capture.audioInputDevices.find((d) => d.deviceId === micDeviceId)?.label ||
                              "Microphone"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">System default</SelectItem>
                        {capture.audioInputDevices.map((d) => (
                          <SelectItem key={d.deviceId} value={d.deviceId}>
                            {d.label || `Microphone ${d.deviceId.slice(0, 8)}…`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 w-full"
                      onClick={() => void startLocalWhisperMic()}
                    >
                      Start — microphone
                    </Button>
                  </div>
                  {localWhisperOnline === true && (
                    <p className="px-2 pb-1 text-[10px] text-emerald-400">Whisper server online</p>
                  )}
                  {localWhisperOnline === false && (
                    <p className="px-2 pb-1 text-[10px] text-amber-400">
                      Whisper offline — run npm run whisper:server
                    </p>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div ref={workspaceRef} className="flex min-h-0 flex-1 flex-row">
        {transcriptCollapsed ? (
          <aside
            className="flex w-10 shrink-0 flex-col items-center gap-2 border-r border-border bg-card/20 py-2"
            aria-label="Transcript collapsed"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Expand transcript (⌘⇧T)"
              onClick={() => setTranscriptCollapsed(false)}
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            {session.listening && !session.paused && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" title="Listening" />
            )}
            {session.listening && session.paused && (
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" title="Paused" />
            )}
            {capture.health.voiceActive && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Voice detected" />
            )}
          </aside>
        ) : (
          <>
            <section
              className="flex min-h-0 shrink-0 flex-col border-r border-border"
              style={{ width: transcriptWidth, minWidth: 220, maxWidth: 360 }}
            >
              <div className="flex items-start justify-between gap-1 border-b border-border px-2 py-2">
                <div className="min-w-0 flex-1 space-y-2">
                  <AudioInputMeter
                    listening={session.listening}
                    captureActive={sttBackend !== "web-speech" && capture.active}
                    voiceLevel={capture.health.voiceLevel}
                    voiceActive={capture.health.voiceActive}
                    hasAudioTrack={capture.health.hasAudioTrack}
                  />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">STT:</span> {sourceLabel}
                    {session.interimTurn ? " · buffering…" : ""}
                    {capture.health.error && sttBackend !== "web-speech" && (
                      <span className="text-amber-400"> · {capture.health.error}</span>
                    )}
                    {localWhisperOnline === false && session.listening && sttBackend === "whisper" && (
                      <span className="text-amber-400"> · Whisper offline</span>
                    )}
                    {webSpeech.error && sttBackend === "web-speech" && (
                      <span className="text-amber-400"> · {webSpeech.error}</span>
                    )}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 shrink-0 p-0"
                  title="Collapse transcript (⌘⇧T)"
                  onClick={() => setTranscriptCollapsed(true)}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="min-h-0 flex-1 p-3">
                <ul className="space-y-2 text-sm">
                  {session.lines.map((line) => (
                    <li key={line.id} className={transcriptLineClass(line.kind, line.isFinal)}>
                      {line.text}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </section>
            <PanelResizeHandle
              label="Resize transcript"
              onPointerDown={transcriptResize.onPointerDown}
            />
          </>
        )}

        {/* Center: answer */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/15 px-4 py-2.5">
            {session.listening && !session.paused && (
              <Badge variant="destructive" className="animate-pulse text-xs">Listening</Badge>
            )}
            {session.listening && session.paused && (
              <Badge variant="secondary" className="text-xs">Paused</Badge>
            )}
            {!session.listening && (
              <Badge variant="outline" className="text-xs text-muted-foreground">Not listening</Badge>
            )}
            {session.candidate && (
              <Badge className="border-amber-500/40 bg-amber-500/20 text-amber-100 text-xs">
                New question waiting
              </Badge>
            )}
            {session.answerLocked && (
              <Badge variant="outline" className="border-emerald-500/40 text-xs text-emerald-200/90">
                Answer locked
              </Badge>
            )}
            {session.result && outcomeBadge(session.result.outcome)}
            {session.result && matchBadge(session.result.matchMethod)}
            {session.result && (
              <span className="text-xs text-muted-foreground">
                {(session.result.confidence * 100).toFixed(0)}% · {session.result.sourceLabel}
              </span>
            )}
            {session.loading && (
              <span className="text-xs text-muted-foreground">Retrieving…</span>
            )}
            {session.statusAnnouncement && (
              <span className="text-xs font-medium text-emerald-400/95">{session.statusAnnouncement}</span>
            )}
          </div>
          {session.candidate && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-amber-200/80">
                  Heard — use as interview question?
                </p>
                <p className="truncate text-sm font-medium text-amber-50/95">{session.candidate.text}</p>
                <p className="text-[10px] text-amber-200/60">
                  {(session.candidate.classification.score * 100).toFixed(0)}% library match ·{" "}
                  {session.candidate.classification.isQuestionLike ? "sounds like a question" : "tap Load if this was the question"}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <Button size="sm" onClick={() => session.acceptCandidate()}>
                  Load answer
                </Button>
                <Button size="sm" variant="ghost" onClick={() => session.dismissCandidate()}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
            <Button size="sm" variant="secondary" onClick={() => void copyAnswer()} disabled={!session.result?.answer}>
              <Copy className="h-4 w-4" />
              Copy answer
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowFull((v) => !v)}>
              {showFull ? "Condense" : "Full answer"}
            </Button>
            {session.answerLocked && (
              <Button
                size="sm"
                variant="outline"
                  onClick={() => {
                  setPinned(null);
                  setPinnedQuestion(null);
                  session.setAnswerLocked(false);
                }}
              >
                Unlock
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton
                render={<Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" />}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  disabled={!session.result?.answer}
                  onClick={() => {
                    setPinned(session.result?.answer ?? null);
                    setPinnedQuestion(session.currentQuestion);
                  }}
                >
                  Pin current answer
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!session.currentQuestion}
                  onClick={() => session.currentQuestion && void runAnalyze(session.currentQuestion, { forceMainPanel: true })}
                >
                  Re-analyze detected question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 overflow-auto px-4 py-3 md:px-5 md:py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Detected question
              </h2>
              {historyCount > 1 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    disabled={session.historyIndex <= 0}
                    onClick={session.goPrev}
                  >
                    Previous
                  </Button>
                  <span className="tabular-nums">{historyPosition} / {historyCount}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2"
                    disabled={session.historyIndex >= historyCount - 1}
                    onClick={session.goNext}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-1 text-base font-semibold leading-tight">{session.currentQuestion ?? "—"}</p>
            {matchedMeta && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {matchedMeta.experienceLabel}
                {matchedMeta.intent !== "general" && ` · ${intentLabel(matchedMeta.intent)}`}
                {matchedMeta.evidenceStatus === "illustrative_scenario" && (
                  <span className="text-amber-400/90"> · illustrative</span>
                )}
              </p>
            )}
            <div className="mt-3 max-w-3xl">
              <ScriptText text={displayAnswer} clamp={!showFull} />
            </div>
            {session.result?.preparedQuestion &&
              session.result.preparedQuestion.trim() !== (session.currentQuestion ?? "").trim() && (
                <div className="mt-2 rounded-md border border-border/80 bg-muted/20 px-2.5 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Library question for this answer
                  </p>
                  <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">
                    {session.result.preparedQuestion}
                  </p>
                  {session.result.matchedFollowUpQuestion &&
                    session.result.matchedFollowUpQuestion !== session.result.preparedQuestion && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Matched via alias:{" "}
                        <span className="text-foreground/90">{session.result.matchedFollowUpQuestion}</span>
                      </p>
                    )}
                </div>
              )}
            {session.result?.closestSuggestion && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="text-foreground/70">Closest: </span>
                <button
                  type="button"
                  className="text-left font-medium text-emerald-400/95 underline-offset-2 hover:underline"
                  onClick={() =>
                    void runAnalyze(session.result!.closestSuggestion!.libraryQuestion, {
                      forceMainPanel: true,
                      announce: true,
                    })
                  }
                >
                  {session.result.closestSuggestion.matchedLabel}
                </button>
                <span className="text-muted-foreground">
                  {" "}
                  ({(session.result.closestSuggestion.score * 100).toFixed(0)}% word overlap)
                </span>
              </p>
            )}
            {session.result?.talkingPoints && session.result.talkingPoints.length > 0 && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {session.result.talkingPoints.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {session.result?.followUps && session.result.followUps.length > 0 && (
              <div className="mt-4 max-w-3xl border-t border-border pt-3">
                <h3 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Likely follow-ups (read-ahead)
                </h3>
                <ul className="mt-2 space-y-2">
                  {session.result.followUps.map((fu) => (
                    <li key={fu.question} className="rounded-md border border-border/80 bg-muted/25 px-2.5 py-2">
                      <p className="text-xs font-medium leading-snug">{fu.question}</p>
                      <ScriptText text={fu.answer} className="mt-1 text-muted-foreground" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {!session.candidate && (
            <div className="flex justify-end border-t border-border px-4 py-2">
              <Button size="sm" variant="outline" onClick={() => session.promoteNextQuestion()}>
                Next question
              </Button>
            </div>
          )}
        </section>

        <PanelResizeHandle
          label="Resize interview navigator"
          onPointerDown={navigatorResize.onPointerDown}
        />

        {/* Right: Interview Navigator */}
        <section
          className="flex min-h-0 shrink-0 flex-col overflow-hidden border-l border-border"
          style={{ width: navigatorWidth, minWidth: 320, maxWidth: maxNavigatorWidth() }}
        >
          {palette}
          <InterviewNavigator
            className="min-h-0 flex-1"
            catalog={interviewNav.catalog}
            context={interviewNav.context}
            suggestions={interviewNav.suggestions}
            pinnedQuestion={pinnedQuestion}
            onOpenInMainPanel={openInMainPanel}
            onPin={pinRow}
            onSetExperience={interviewNav.setManualExperience}
            onClearContext={interviewNav.clearContext}
            onSearchOpen={() => setPaletteOpen(true)}
            practiceFooter={
              <details className="px-2 py-2 text-sm">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Practice &amp; debug
                </summary>
                <div className="mt-2 space-y-3 pb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => session.startSimulation()}
                    disabled={session.listening}
                  >
                    Simulate transcript
                  </Button>
                  <div>
                    <Label className="text-xs text-muted-foreground">Manual question</Label>
                    <div className="mt-1 flex gap-2">
                      <Input
                        value={manualQuestion}
                        onChange={(e) => setManualQuestion(e.target.value)}
                        placeholder="Type to test retrieval"
                        className="h-9"
                      />
                      <Button
                        size="sm"
                        onClick={() => void runAnalyze(manualQuestion, { forceMainPanel: true })}
                        disabled={!manualQuestion}
                      >
                        Analyze
                      </Button>
                    </div>
                  </div>
                </div>
              </details>
            }
          />
        </section>
      </div>
    </div>
  );
}
