"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLiveSession } from "@/hooks/use-live-session";
import { useBrowserAudioCapture } from "@/hooks/use-browser-audio-capture";
import { useWebSpeechTranscription } from "@/hooks/use-web-speech-transcription";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
import { AudioSetupPanel, type AudioSource, type SttEngine } from "@/components/live/audio-setup-panel";
import { TranscriptLineItem } from "@/components/live/transcript-line";
import { DetectedQuestionConcepts } from "@/components/live/detected-question-concepts";
import {
  InterviewNavigator,
  focusForWholeQuestion,
  focusFromConceptSpan,
  type QuestionMapFocus,
} from "@/components/live/interview-navigator";
import { useLibraryCommandPalette } from "@/components/live/library-command-palette";
import { ScriptText } from "@/components/live/script-text";
import { useInterviewContext } from "@/hooks/use-interview-context";
import type {
  AnalyzeQuestionResult,
  ConceptSpan,
  EnrichedQaRow,
  InterviewSessionContext,
} from "@interview-copilot/shared";
import { intentLabel, LEXICAL_MATCH_THRESHOLD_PREPARED } from "@interview-copilot/shared";
import type { TranscriptLine } from "@/hooks/use-live-session";

const SELECTABLE_TRANSCRIPT_KINDS = new Set<TranscriptLine["kind"]>(["speech", "question", "candidate"]);

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
  const skipContextUpdateRef = useRef(false);
  const sessionContextRef = useRef<InterviewSessionContext | undefined>(undefined);
  const [mapFocus, setMapFocus] = useState<QuestionMapFocus | null>(null);
  const [selectedTranscriptIds, setSelectedTranscriptIds] = useState<string[]>([]);
  const [editRetryDraft, setEditRetryDraft] = useState<{ lineId: string; text: string } | null>(null);

  const session = useLiveSession(profileId, {
    pinnedAnswer: pinned,
    getSessionContext: () => sessionContextRef.current,
  });
  const interviewNav = useInterviewContext(session.library);
  sessionContextRef.current = interviewNav.context;
  const capture = useBrowserAudioCapture();
  const webSpeech = useWebSpeechTranscription({
    onFinalSegment: (segment) =>
      session.ingestSpeechFragment(segment, { finalizeImmediately: true }),
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
    if (skipContextUpdateRef.current) {
      skipContextUpdateRef.current = false;
      return;
    }
    const r = session.questionHistory[session.historyIndex];
    if (!r?.question) return;
    interviewNav.registerDetection(r.question, r.matches[0]?.sourceId);
  }, [session.historyIndex, session.questionHistory, interviewNav.registerDetection]);

  async function runAnalyze(
    question: string,
    options?: { announce?: boolean; forceMainPanel?: boolean; respectLock?: boolean }
  ) {
    const locked = Boolean(pinned) || session.answerLocked;
    const respectLock = options?.respectLock ?? locked;
    return session.analyze(question, {
      ...options,
      forceMainPanel: options?.forceMainPanel ?? !respectLock,
      respectMainPanelLock: respectLock,
      sessionContext: interviewNav.context,
    });
  }

  function orderedSelectableLines() {
    return session.lines
      .filter((l) => l.isFinal && SELECTABLE_TRANSCRIPT_KINDS.has(l.kind))
      .sort((a, b) => a.sequenceId - b.sequenceId);
  }

  function combinedTranscriptText(ids: string[]) {
    const idSet = new Set(ids);
    return orderedSelectableLines()
      .filter((l) => idSet.has(l.id))
      .map((l) => l.text)
      .join(" ");
  }

  function toggleTranscriptSelect(lineId: string, shiftKey: boolean) {
    const ordered = orderedSelectableLines();
    const line = ordered.find((l) => l.id === lineId);
    if (!line) return;

    setSelectedTranscriptIds((prev) => {
      if (prev.includes(lineId)) {
        return prev.filter((id) => id !== lineId);
      }
      if (!shiftKey || prev.length === 0) {
        return [lineId];
      }
      const indices = prev
        .map((id) => ordered.findIndex((l) => l.id === id))
        .filter((i) => i >= 0);
      const clickIdx = ordered.findIndex((l) => l.id === lineId);
      if (clickIdx < 0) return [lineId];
      const min = Math.min(...indices, clickIdx);
      const max = Math.max(...indices, clickIdx);
      return ordered.slice(min, max + 1).map((l) => l.id);
    });
  }

  async function findAnswerFromTranscript(lineIds?: string[]) {
    const ids = lineIds ?? (selectedTranscriptIds.length > 0 ? selectedTranscriptIds : []);
    const text =
      ids.length > 0
        ? combinedTranscriptText(ids)
        : undefined;
    if (!text || text.length < 3) return;
    const data = await session.manualAnalyzeTranscript(text);
    setSelectedTranscriptIds([]);
    if (data?.queryCorrections?.length) {
      toast.message(`Retrieval used: ${data.queryCorrections.join("; ")}`, { duration: 6000 });
    }
  }

  function openConceptMap(span: ConceptSpan) {
    setMapFocus(focusFromConceptSpan(span, interviewNav.catalog));
  }

  function openQuestionMap(question: string) {
    setMapFocus(focusForWholeQuestion(question, interviewNav.catalog));
  }

  function openInMainPanel(row: EnrichedQaRow, opts?: { fromBrowse?: boolean }) {
    if (opts?.fromBrowse) skipContextUpdateRef.current = true;
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

  /** User-facing exception messages only — not success/health banners. */
  function centerStatusNotice(result: AnalyzeQuestionResult | null): string | null {
    if (!result) return null;
    if (result.semanticStatus === "unavailable" || result.semanticStatus === "error") {
      return "Using keyword matching";
    }
    const weakPrepared =
      result.outcome === "GENERATED" ||
      (result.outcome === "PREPARED" && result.confidence < LEXICAL_MATCH_THRESHOLD_PREPARED);
    if (weakPrepared) return "No clear prepared answer found";
    const top = result.matches[0];
    const second = result.matches[1];
    if (top && second && top.similarity - second.similarity < 0.06) {
      return "Multiple possible answers";
    }
    return null;
  }

  function preparedAnswerLabel(result: AnalyzeQuestionResult | null) {
    if (!result) return null;
    if (result.outcome === "PREPARED" && result.confidence >= LEXICAL_MATCH_THRESHOLD_PREPARED) {
      return <span className="text-[11px] text-muted-foreground">Prepared answer</span>;
    }
    if (result.outcome === "ADAPTED") {
      return <span className="text-[11px] text-muted-foreground">Adapted from your library</span>;
    }
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

  async function startWebSpeechMic() {
    if (!webSpeech.isSupported) {
      toast.error("Web Speech API is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    capture.stop();
    setSttBackend("web-speech");
    session.setListening(true);
    const deviceId = micDeviceId === "default" ? undefined : micDeviceId;
    await capture.startMicrophone(deviceId);
    webSpeech.start();
    toast.message("Web Speech (Joist-style) — mic only, uses Google’s cloud STT");
  }

  function stopAll() {
    session.stopListening();
    webSpeech.stop();
    capture.stop();
    setSttBackend(null);
  }

  function startListening(audioSource: AudioSource, engine: SttEngine) {
    if (engine === "web-speech") {
      void startWebSpeechMic();
      return;
    }
    if (audioSource === "meeting-tab") {
      void startLocalWhisperTab();
      return;
    }
    void startLocalWhisperMic();
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
  const centerNotice = session.result ? centerStatusNotice(session.result) : null;

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
            <AudioSetupPanel
              listening={session.listening}
              paused={session.paused}
              voiceActive={capture.health.voiceActive}
              hasAudioTrack={capture.health.hasAudioTrack || sttBackend === "web-speech"}
              sttBackend={sttBackend}
              captureSource={capture.source}
              localWhisperOnline={localWhisperOnline}
              webSpeechSupported={webSpeech.isSupported}
              micDeviceId={micDeviceId}
              audioInputDevices={capture.audioInputDevices}
              onMicDeviceChange={setMicDeviceId}
              onStart={startListening}
              audioWarning={audioWarning}
            />
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
                    voiceLevel={capture.health.voiceLevel}
                    voiceActive={capture.health.voiceActive}
                    hasAudioTrack={capture.health.hasAudioTrack}
                  />
                  <p className="text-xs text-muted-foreground">
                    {session.listening && (
                      <>
                        <span className="font-medium text-foreground/80">STT:</span> {sourceLabel}
                        {session.interimTurn ? " · buffering…" : ""}
                      </>
                    )}
                    {!session.listening && <span>Start audio to transcribe</span>}
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
                {selectedTranscriptIds.length >= 2 && (
                  <div className="mb-3 rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-2">
                    <p className="text-[10px] font-medium text-sky-100/90">
                      {selectedTranscriptIds.length} bubbles selected
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                      {combinedTranscriptText(selectedTranscriptIds)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => void findAnswerFromTranscript(selectedTranscriptIds)}
                      >
                        Analyze as one question
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setSelectedTranscriptIds([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
                {editRetryDraft && (
                  <div className="mb-3 space-y-2 rounded-md border border-border px-2 py-2">
                    <Label className="text-[10px] text-muted-foreground">Edit transcript and retry</Label>
                    <Input
                      value={editRetryDraft.text}
                      onChange={(e) => setEditRetryDraft({ ...editRetryDraft, text: e.target.value })}
                      className="h-8 text-xs"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          void session.manualAnalyzeTranscript(editRetryDraft.text);
                          setEditRetryDraft(null);
                        }}
                      >
                        Retry
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setEditRetryDraft(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <p className="mb-2 text-[10px] text-muted-foreground">
                  Click a line to find an answer. Shift+click to combine adjacent lines. Speaker is not
                  separated — verify interviewer lines before selecting.
                </p>
                <ul className="space-y-2 text-sm">
                  {session.lines.map((line) => (
                    <TranscriptLineItem
                      key={line.id}
                      line={line}
                      selected={selectedTranscriptIds.includes(line.id)}
                      onFindAnswer={() => {
                        if (selectedTranscriptIds.includes(line.id) && selectedTranscriptIds.length > 1) {
                          void findAnswerFromTranscript(selectedTranscriptIds);
                          return;
                        }
                        void session.manualAnalyzeTranscript(line.text);
                      }}
                      onToggleSelect={(shift) => toggleTranscriptSelect(line.id, shift)}
                      onExploreRelated={() => openQuestionMap(line.text)}
                      onEditRetry={() => setEditRetryDraft({ lineId: line.id, text: line.text })}
                    />
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
          <div className="flex min-h-[2.25rem] flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-muted/10 px-4 py-2">
            {session.result && preparedAnswerLabel(session.result)}
            {session.candidate && (
              <span className="text-xs text-amber-200/90">New question waiting</span>
            )}
            {centerNotice && <span className="text-xs text-amber-200/85">{centerNotice}</span>}
            {session.loading && <span className="text-xs text-muted-foreground">Retrieving…</span>}
          </div>
          {session.matchPreview && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-500/30 bg-sky-500/10 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-sky-200/80">
                  Preview match (answer locked)
                </p>
                <p className="truncate text-sm font-medium">{session.matchPreview.result.question}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {session.matchPreview.result.answer.slice(0, 200)}
                  {session.matchPreview.result.answer.length > 200 ? "…" : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-1.5">
                <Button size="sm" onClick={() => session.applyMatchPreview()}>
                  Replace locked answer
                </Button>
                <Button size="sm" variant="ghost" onClick={() => session.dismissMatchPreview()}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          {session.candidate && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-amber-200/80">
                  Heard — use as interview question?
                </p>
                <p className="truncate text-sm font-medium text-amber-50/95">{session.candidate.text}</p>
                <p className="text-[10px] text-amber-200/60">
                  {session.candidate.classification.isQuestionLike
                    ? "Sounds like a question"
                    : "Tap Load if this was the question"}
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
            {session.result?.answer && !session.answerLocked && (
              <Button size="sm" variant="outline" onClick={() => session.setAnswerLocked(true)}>
                Lock
              </Button>
            )}
            {session.answerLocked && (
              <Button
                size="sm"
                variant={session.answerLocked ? "secondary" : "outline"}
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
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Detected question
                </h2>
                {session.currentQuestion && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[10px]"
                    onClick={() => openQuestionMap(session.currentQuestion!)}
                  >
                    Explore question
                  </Button>
                )}
              </div>
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
            <p className="mt-1 text-base font-semibold leading-tight">
              {session.currentQuestion ? (
                <DetectedQuestionConcepts
                  question={session.currentQuestion}
                  catalog={interviewNav.catalog}
                  onExploreConcept={openConceptMap}
                />
              ) : (
                "—"
              )}
            </p>
            {session.result?.queryCorrections && session.result.queryCorrections.length > 0 && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Retrieval interpretation: {session.result.queryCorrections.join(" · ")} (transcript unchanged)
              </p>
            )}
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
            {session.result?.alternativeMatches && session.result.alternativeMatches.length > 0 && (
              <div className="mt-4 max-w-3xl border-t border-border pt-3">
                <h3 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Alternative answers
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {session.result.alternativeMatches.map((alt) => (
                    <li key={alt.sourceId}>
                      <button
                        type="button"
                        className="w-full rounded-md border border-border/80 bg-muted/20 px-2.5 py-2 text-left text-xs hover:bg-muted/40"
                        onClick={() =>
                          void runAnalyze(alt.libraryQuestion, {
                            forceMainPanel: !(pinned || session.answerLocked),
                            respectLock: Boolean(pinned) || session.answerLocked,
                            announce: true,
                          })
                        }
                      >
                        <span className="font-medium text-foreground/95">{alt.matchedLabel}</span>
                      </button>
                    </li>
                  ))}
                </ul>
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
              </p>
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
            nextSuggestions={interviewNav.nextSuggestions}
            pinnedQuestion={pinnedQuestion}
            mapFocus={mapFocus}
            onMapFocusChange={setMapFocus}
            onOpenInMainPanel={openInMainPanel}
            onPin={pinRow}
            onSetExperience={interviewNav.setManualExperience}
            onSetInterviewRound={interviewNav.setActiveInterviewRound}
            onClearContext={interviewNav.clearContext}
            onSearchOpen={() => setPaletteOpen(true)}
            practiceFooter={
              <details className="px-2 py-2 text-sm">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Practice &amp; debug
                </summary>
                <div className="mt-2 space-y-3 pb-2">
                  {session.result && (
                    <div className="rounded-md border border-border/80 bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground">
                      <p className="font-medium text-foreground/80">Retrieval diagnostics</p>
                      <ul className="mt-1 space-y-0.5">
                        <li>
                          Match: {session.result.matchMethod ?? "—"}
                          {session.result.semanticStatus && session.result.semanticStatus !== "lexical_only"
                            ? ` · semantic ${session.result.semanticStatus}`
                            : ""}
                        </li>
                        <li>
                          Rank score: {(session.result.confidence * 100).toFixed(1)}% (uncalibrated hybrid rank, not
                          probability)
                        </li>
                        {session.result.sourceLabel && <li>{session.result.sourceLabel}</li>}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-md border border-border/80 bg-muted/20 px-2.5 py-2 text-[11px] text-muted-foreground">
                    <p className="font-medium text-foreground/80">Audio</p>
                    <ul className="mt-1 space-y-0.5">
                      <li>
                        Session: {session.listening ? (session.paused ? "Paused" : "On") : "Off"}
                      </li>
                      <li>
                        Capture:{" "}
                        {sttBackend
                          ? capture.health.hasAudioTrack
                            ? "Connected"
                            : "Connecting"
                          : "Idle"}
                      </li>
                      <li>STT: {sttBackend ?? "none"}</li>
                    </ul>
                  </div>
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
