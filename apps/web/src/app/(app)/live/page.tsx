"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLiveSession } from "@/hooks/use-live-session";
import { useBrowserAudioCapture } from "@/hooks/use-browser-audio-capture";
import { useWebSpeechTranscription } from "@/hooks/use-web-speech-transcription";
import { Button } from "@/components/ui/button";
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
  PanelLeftOpen,
  Pause,
  Play,
  ScrollText,
  Square,
} from "lucide-react";
import { PanelResizeHandle } from "@/components/live/panel-resize-handle";
import { clamp, useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { usePersistedBoolean, usePersistedNumber } from "@/hooks/use-persisted-state";
import { toast } from "sonner";
import { AudioSetupPanel, type AudioSource, type SttEngine } from "@/components/live/audio-setup-panel";
import { SessionRecordingControl } from "@/components/live/session-recording-control";
import { DetectedQuestionConcepts } from "@/components/live/detected-question-concepts";
import { AlternativeAnswerOption } from "@/components/live/alternative-answer-option";
import { MatchedLibraryQuestionBlock } from "@/components/live/matched-library-question";
import { RawTranscriptPanel } from "@/components/live/raw-transcript-panel";
import { DetectedQuestionsPanel } from "@/components/live/detected-questions-panel";
import {
  computeLiveWorkspaceLayout,
  LIVE_DETECTED_QUESTIONS_WIDTH,
  LIVE_NAVIGATOR_WIDTH,
  LIVE_RAW_TRANSCRIPT_WIDTH,
} from "@/lib/live-layout";
import {
  InterviewNavigator,
  focusForWholeQuestion,
  focusFromConceptSpan,
  type QuestionMapFocus,
} from "@/components/live/interview-navigator";
import { useLibraryCommandPalette } from "@/components/live/library-command-palette";
import { ScriptText } from "@/components/live/script-text";
import { useInterviewContext } from "@/hooks/use-interview-context";
import { useSessionRecording } from "@/hooks/use-session-recording";
import type {
  AnalyzeQuestionResult,
  ConceptSpan,
  EnrichedQaRow,
  InterviewSessionContext,
} from "@interview-copilot/shared";
import {
  CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT,
  CONTEXTUAL_FOLLOW_UP_EXPANDED_LIMIT,
  interviewProfileKeyFromLabel,
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  suggestContextualFollowUps,
} from "@interview-copilot/shared";
import { AnswerPreviewCard } from "@/components/live/answer-preview-card";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
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
  const [rawTranscriptCollapsed, setRawTranscriptCollapsed] = usePersistedBoolean("ic-live-transcript-collapsed", false);
  const [rawDrawerOpen, setRawDrawerOpen] = usePersistedBoolean("ic-live-raw-drawer-open", false);
  const [rawTranscriptWidth, setRawTranscriptWidth] = usePersistedNumber("ic-live-transcript-width", LIVE_RAW_TRANSCRIPT_WIDTH);
  const [questionsWidth, setQuestionsWidth] = usePersistedNumber("ic-live-questions-width", LIVE_DETECTED_QUESTIONS_WIDTH);
  const [navigatorWidth, setNavigatorWidth] = usePersistedNumber("ic-live-navigator-width", LIVE_NAVIGATOR_WIDTH);
  const [workspaceWidth, setWorkspaceWidth] = useState(1400);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const skipContextUpdateRef = useRef(false);
  const sessionContextRef = useRef<InterviewSessionContext | undefined>(undefined);
  const [mapFocus, setMapFocus] = useState<QuestionMapFocus | null>(null);
  const [selectedTranscriptIds, setSelectedTranscriptIds] = useState<string[]>([]);
  const [editRetryDraft, setEditRetryDraft] = useState<{ lineId: string; text: string } | null>(null);
  const [pendingAltId, setPendingAltId] = useState<string | null>(null);
  const [contextualExpanded, setContextualExpanded] = useState<Record<string, boolean>>({});
  const [contextualShowMore, setContextualShowMore] = useState(false);

  const session = useLiveSession(profileId, {
    pinnedAnswer: pinned,
    getSessionContext: () => sessionContextRef.current,
  });
  const interviewNav = useInterviewContext(session.library);
  sessionContextRef.current = interviewNav.context;
  const capture = useBrowserAudioCapture();
  const profileNameForRecording =
    profileId == null ? null : profiles.find((p) => p.id === profileId)?.name ?? null;
  const sessionRecording = useSessionRecording({
    profileName: profileNameForRecording,
    micDeviceId,
    getSttStream: capture.getStream,
    sttCaptureSource: capture.source,
  });
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
    options?: {
      announce?: boolean;
      forceMainPanel?: boolean;
      respectLock?: boolean;
      analysisSource?: import("@/hooks/use-live-session").QuestionAnalyzeSource;
      preserveDetectedQuestion?: boolean;
    }
  ) {
    const locked = Boolean(pinned) || session.answerLocked;
    const respectLock = options?.respectLock ?? locked;
    return session.analyze(question, {
      ...options,
      forceMainPanel: options?.forceMainPanel ?? !respectLock,
      respectMainPanelLock: respectLock,
      sessionContext: interviewNav.context,
      analysisSource: options?.analysisSource ?? "auto",
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
    session.openPreparedRow(row, { preserveDetectedQuestion: Boolean(session.currentQuestion) });
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

  const layout = useMemo(() => computeLiveWorkspaceLayout(workspaceWidth), [workspaceWidth]);

  const rawResize = useHorizontalResize((dx) => {
    setRawTranscriptWidth((w) => clamp(w + dx, 200, 320));
  });

  const questionsResize = useHorizontalResize((dx) => {
    setQuestionsWidth((w) => clamp(w + dx, 220, 340));
  });

  const navigatorResize = useHorizontalResize((dx) => {
    setNavigatorWidth((w) => clamp(w + dx, 280, maxNavigatorWidth()));
  });

  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWorkspaceWidth(w);
    });
    ro.observe(el);
    setWorkspaceWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey || e.key.toLowerCase() !== "t") return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      e.preventDefault();
      if (layout.fitsFourColumns) {
        setRawTranscriptCollapsed((c) => !c);
      } else {
        setRawDrawerOpen((c) => !c);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layout.fitsFourColumns, setRawDrawerOpen, setRawTranscriptCollapsed]);

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
  const activePreparedRow = useMemo(
    () => interviewNav.catalog.find((r) => r.id === matchedRowId) ?? null,
    [interviewNav.catalog, matchedRowId]
  );
  const recentDetectedQuestions = useMemo(
    () => session.questionHistory.map((h) => h.question).filter((q) => q && q.length > 2).slice(-5),
    [session.questionHistory]
  );
  const interviewProfileKey = interviewProfileKeyFromLabel(
    profileId == null ? null : profiles.find((p) => p.id === profileId)?.name ?? null
  );
  const contextualFollowUpPool = useMemo(
    () =>
      suggestContextualFollowUps(
        interviewNav.catalog,
        {
          ...interviewNav.context,
          lastDetectedQuestion: session.currentQuestion ?? interviewNav.context.lastDetectedQuestion,
        },
        activePreparedRow,
        recentDetectedQuestions,
        {
          limit: contextualShowMore ? CONTEXTUAL_FOLLOW_UP_EXPANDED_LIMIT : CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT,
          interviewProfile: interviewProfileKey,
          anchorQuestionLabel: activePreparedRow?.question,
        }
      ),
    [
      interviewNav.catalog,
      interviewNav.context.askedQuestionIds,
      interviewNav.context.manualExperienceOverrideId,
      interviewNav.context.activeInterviewRound,
      activePreparedRow,
      recentDetectedQuestions,
      session.currentQuestion,
      contextualShowMore,
      interviewProfileKey,
    ]
  );
  const contextualFollowUps = contextualFollowUpPool;

  useEffect(() => {
    setContextualShowMore(false);
  }, [matchedRowId]);
  const ambiguousAnswerMatch =
    Boolean(session.result?.alternativeMatches?.length) &&
    ((session.result?.confidence ?? 1) < LEXICAL_MATCH_THRESHOLD_PREPARED ||
      (session.result?.alternativeMatches?.length ?? 0) >= 2);

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

  const showRawColumn = layout.fitsFourColumns && !rawTranscriptCollapsed;
  const sttError =
    (webSpeech.error && sttBackend === "web-speech" ? webSpeech.error : null) ??
    (localWhisperOnline === false && session.listening && sttBackend === "whisper"
      ? "Whisper offline"
      : capture.health.error && sttBackend !== "web-speech"
        ? capture.health.error
        : null);

  const captureSourceLabel =
    sttBackend === "web-speech" ? "microphone (all speakers unknown)" : capture.source || "none";

  function handleFindAnswerLine(line: TranscriptLine) {
    if (selectedTranscriptIds.includes(line.id) && selectedTranscriptIds.length > 1) {
      void findAnswerFromTranscript(selectedTranscriptIds);
      return;
    }
    void session.manualAnalyzeTranscript(line.text);
  }

  const rawPanel = (
    <RawTranscriptPanel
      lines={session.lines}
      listening={session.listening}
      voiceLevel={capture.health.voiceLevel}
      voiceActive={capture.health.voiceActive}
      hasAudioTrack={capture.health.hasAudioTrack || sttBackend === "web-speech"}
      sttLabel={sourceLabel}
      captureSourceLabel={captureSourceLabel}
      sttError={sttError}
      selectedTranscriptIds={selectedTranscriptIds}
      editRetryDraft={editRetryDraft}
      onCollapse={
        layout.fitsFourColumns ? () => setRawTranscriptCollapsed(true) : () => setRawDrawerOpen(false)
      }
      onToggleSelect={toggleTranscriptSelect}
      onFindAnswer={handleFindAnswerLine}
      onExploreRelated={openQuestionMap}
      onEditRetry={(line) => setEditRetryDraft({ lineId: line.id, text: line.text })}
      onEditRetryChange={(text) => editRetryDraft && setEditRetryDraft({ ...editRetryDraft, text })}
      onEditRetrySubmit={() => {
        if (!editRetryDraft) return;
        void session.manualAnalyzeTranscript(editRetryDraft.text);
        setEditRetryDraft(null);
      }}
      onEditRetryCancel={() => setEditRetryDraft(null)}
      onAnalyzeCombined={() => void findAnswerFromTranscript(selectedTranscriptIds)}
      onClearSelection={() => setSelectedTranscriptIds([])}
      combinedSelectionText={combinedTranscriptText(selectedTranscriptIds)}
      highlightQuestion={session.currentQuestion}
    />
  );

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
            <SessionRecordingControl
              view={sessionRecording.view}
              onStart={(mode) => void sessionRecording.start(mode)}
              onPause={sessionRecording.pause}
              onResume={sessionRecording.resume}
              onStop={() => void sessionRecording.stop()}
              onDiscard={() => void sessionRecording.discard()}
            />
            {!layout.fitsFourColumns && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 gap-1.5"
                onClick={() => setRawDrawerOpen(true)}
              >
                <ScrollText className="h-4 w-4" />
                Transcript
              </Button>
            )}
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

      <div ref={workspaceRef} className="relative flex min-h-0 flex-1 flex-row overflow-hidden">
        {!layout.fitsFourColumns && rawDrawerOpen && (
          <>
            <button
              type="button"
              className="absolute inset-0 z-10 bg-black/50"
              aria-label="Close raw transcript"
              onClick={() => setRawDrawerOpen(false)}
            />
            <div
              className="absolute inset-y-0 left-0 z-20 flex min-h-0 w-[min(320px,92vw)] flex-col border-r border-border bg-background shadow-xl"
            >
              {rawPanel}
            </div>
          </>
        )}

        {layout.fitsFourColumns && rawTranscriptCollapsed ? (
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
              onClick={() => setRawTranscriptCollapsed(false)}
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
        ) : showRawColumn ? (
          <>
            <section
              className="flex min-h-0 shrink-0 flex-col border-r border-border"
              style={{ width: rawTranscriptWidth, minWidth: 200, maxWidth: 320 }}
            >
              {rawPanel}
            </section>
            <PanelResizeHandle label="Resize raw transcript" onPointerDown={rawResize.onPointerDown} />
          </>
        ) : null}

        {layout.fitsQuestionsColumn && (
          <>
            <section
              className="flex min-h-0 shrink-0 flex-col border-r border-border"
              style={{ width: questionsWidth, minWidth: 220, maxWidth: 340 }}
            >
              <DetectedQuestionsPanel
                questionHistory={session.questionHistory}
                historyIndex={session.historyIndex}
                historySources={session.historySources}
                loading={session.loading}
                candidateText={session.candidate?.text ?? null}
                onSelectIndex={session.goToHistoryIndex}
                onJumpToLatest={session.jumpToLatestHistory}
                onReanalyze={(q) => void runAnalyze(q, { forceMainPanel: !(pinned || session.answerLocked), respectLock: Boolean(pinned) || session.answerLocked })}
                onExplore={openQuestionMap}
              />
            </section>
            <PanelResizeHandle label="Resize detected questions" onPointerDown={questionsResize.onPointerDown} />
          </>
        )}

        {/* Prepared answer */}
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          style={{ minWidth: layout.minAnswerWidth }}
        >
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
            <div className={cn("flex flex-wrap items-baseline justify-between gap-2", liveSemantic.blockDetected)}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={cn("text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelDetected)}>
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
              {!layout.fitsQuestionsColumn && historyCount > 1 && (
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
            <p className={cn("mt-1 text-base font-semibold leading-tight", liveSemantic.textAnswer)}>
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
            <MatchedLibraryQuestionBlock
              detectedQuestion={session.currentQuestion}
              result={session.result}
              matchedMeta={matchedMeta}
              onInspectLibraryQuestion={openQuestionMap}
            />
            <div className="mt-3 max-w-3xl">
              <ScriptText text={displayAnswer} clamp={!showFull} className={liveSemantic.textAnswer} />
            </div>
            {session.result && activePreparedRow && (
              <div className="mt-4 max-w-3xl border-t border-border pt-3">
                <h3 className={cn("text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelSuggested)}>
                  Contextual follow-ups
                </h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Based on: {activePreparedRow.question.length > 72
                    ? `${activePreparedRow.question.slice(0, 72)}…`
                    : activePreparedRow.question}
                </p>
                {contextualFollowUps.length > 0 ? (
                  <>
                    <ul className="mt-2 space-y-1.5">
                      {contextualFollowUps.map((fu) => (
                        <li key={`${fu.reason}-${fu.rowId}`}>
                          <AnswerPreviewCard
                            source={fu}
                            catalog={interviewNav.catalog}
                            semanticAccent="suggested"
                            expanded={Boolean(contextualExpanded[fu.rowId])}
                            onToggle={() =>
                              setContextualExpanded((prev) => ({ ...prev, [fu.rowId]: !prev[fu.rowId] }))
                            }
                            onOpenMain={() => {
                              const row = interviewNav.catalog.find((r) => r.id === fu.rowId);
                              if (row) openInMainPanel(row, { fromBrowse: true });
                            }}
                            onPin={() => {
                              const row = interviewNav.catalog.find((r) => r.id === fu.rowId);
                              if (row) pinRow(row);
                            }}
                            showShortFirst
                          />
                          <p className="px-1 pt-0.5 text-[9px] text-muted-foreground">{fu.reason}</p>
                        </li>
                      ))}
                    </ul>
                    {contextualFollowUpPool.length >= CONTEXTUAL_FOLLOW_UP_DEFAULT_LIMIT && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-7 text-[10px]"
                        onClick={() => setContextualShowMore((v) => !v)}
                      >
                        {contextualShowMore ? "Show fewer follow-ups" : "Show more"}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No strong follow-ups identified for this answer.
                  </p>
                )}
              </div>
            )}
            {session.result?.alternativeMatches && session.result.alternativeMatches.length > 0 && (
              <details
                className="mt-4 max-w-3xl border-t border-border pt-3"
                open={ambiguousAnswerMatch}
              >
                <summary
                  className={cn(
                    "cursor-pointer text-[10px] font-medium uppercase tracking-wide",
                    liveSemantic.labelAlternative
                  )}
                >
                  Other answer matches
                  {!ambiguousAnswerMatch && (
                    <span className="ml-1 font-normal normal-case text-muted-foreground">
                      (retrieval recovery)
                    </span>
                  )}
                </summary>
                <ul className="mt-2 space-y-1.5">
                  {session.result.alternativeMatches.map((alt) => (
                    <li key={alt.sourceId}>
                      <AlternativeAnswerOption
                        alt={alt}
                        catalog={interviewNav.catalog}
                        isPending={pendingAltId === alt.sourceId}
                        onSelect={() => {
                          setPendingAltId(alt.sourceId);
                          void runAnalyze(alt.libraryQuestion, {
                            forceMainPanel: !(pinned || session.answerLocked),
                            respectLock: Boolean(pinned) || session.answerLocked,
                            announce: true,
                            preserveDetectedQuestion: true,
                            analysisSource: "manual",
                          }).finally(() => setPendingAltId(null));
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {session.result?.closestSuggestion && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="text-foreground/70">Closest: </span>
                <button
                  type="button"
                  className={cn(
                    "text-left font-medium underline-offset-2 hover:underline",
                    liveSemantic.labelAlternative
                  )}
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
          style={{ width: navigatorWidth, minWidth: 280, maxWidth: maxNavigatorWidth() }}
        >
          {palette}
          <InterviewNavigator
            className="min-h-0 flex-1"
            catalog={interviewNav.catalog}
            context={interviewNav.context}
            topInterviewQuestions={interviewNav.topInterviewQuestions}
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
