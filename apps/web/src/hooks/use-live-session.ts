"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeResultFromPreparedRow } from "@/lib/prepared-row-result";
import {
  analyzeResultFromLexicalRank,
  shouldReplaceOptimisticWithHybrid,
} from "@/lib/retrieval/analyze-result-from-lexical";
import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  LEXICAL_MATCH_THRESHOLD_WEAK,
  classifyTurn,
  isInterviewPrompt,
  mergeTranscriptFragments,
  normalizeInterviewQuery,
  rankPreparedQaLexical,
  shouldFinalizeTurnImmediately,
  turnSilenceMs,
  type AnalyzeQuestionResult,
  type InterviewSessionContext,
  type LexicalQaRow,
  type PersistedNavigatorMeta,
  type TurnClassification,
} from "@interview-copilot/shared";
import { createClient } from "@/lib/supabase/client";
import { segmentTranscriptForDisplay } from "@/lib/transcript-display";
import { toast } from "sonner";

export type TranscriptLineKind = "filler" | "speech" | "candidate" | "question" | "readback";

export type TranscriptLine = {
  id: string;
  sequenceId: number;
  text: string;
  isFinal: boolean;
  isQuestion: boolean;
  kind: TranscriptLineKind;
  createdAt?: number;
  /** Multiple display rows from one finalized STT turn */
  speechGroupId?: string;
  segmentIndex?: number;
  segmentTotal?: number;
  /** Full utterance when split across segments (for expand / question matching) */
  fullText?: string;
};

export type QuestionAnalyzeSource = "auto" | "manual" | "candidate" | "browse";

export type TurnCandidate = {
  text: string;
  classification: TurnClassification;
};

function parseFollowUps(raw: unknown): LexicalQaRow["followUps"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x === "object")
    .map((x) => {
      const o = x as { question?: string; answer?: string };
      return { question: String(o.question ?? "").trim(), answer: String(o.answer ?? "").trim() };
    })
    .filter((x) => x.question.length >= 3 && x.answer.length >= 1);
}

/** Skip near-empty MediaRecorder slices (silence / partial WebM headers). */
const MIN_TRANSCRIBE_BYTES = 400;

const SIMULATION_SCRIPT = [
  "Thanks for joining today.",
  "Can you walk me through how you prioritize roadmap items when stakeholders disagree?",
  "How do you handle cross-functional disagreements?",
  "What metrics would you use to measure success for a new onboarding flow?",
];

export type MatchPreview = { question: string; result: AnalyzeQuestionResult };

export function useLiveSession(
  profileId: string | null,
  options?: {
    pinnedAnswer?: string | null;
    getSessionContext?: () => InterviewSessionContext | undefined;
  }
) {
  const pinnedAnswer = options?.pinnedAnswer ?? null;
  const getSessionContext = options?.getSessionContext;
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeQuestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<AnalyzeQuestionResult[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [historySources, setHistorySources] = useState<QuestionAnalyzeSource[]>([]);
  const [library, setLibrary] = useState<LexicalQaRow[]>([]);
  const [candidate, setCandidate] = useState<TurnCandidate | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [interimTurn, setInterimTurn] = useState("");
  const [statusAnnouncement, setStatusAnnouncement] = useState<string | null>(null);
  const [matchPreview, setMatchPreview] = useState<MatchPreview | null>(null);

  const seqRef = useRef(0);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simIndexRef = useRef(0);
  const turnBufferRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interimFinalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestWebSpeechInterimRef = useRef("");
  const lastPromoteAtRef = useRef<number | null>(null);
  const lastTranscribeErrorToastAtRef = useRef(0);
  const listeningRef = useRef(false);
  const transcribeChainRef = useRef<Promise<void>>(Promise.resolve());
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const liveSttLineIdRef = useRef<string | null>(null);
  const finalizeTurnRef = useRef<() => void>(() => {});
  const libraryRef = useRef(library);
  libraryRef.current = library;
  const resultRef = useRef(result);
  resultRef.current = result;
  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;
  const analyzeSeqRef = useRef(0);
  const analyzeCacheRef = useRef<Map<string, { at: number; data: AnalyzeQuestionResult }>>(new Map());
  const optimisticResultRef = useRef<{ seq: number; result: AnalyzeQuestionResult } | null>(null);
  const ANALYZE_CACHE_MS = 45_000;

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      let query = supabase
        .from("prepared_qa")
        .select("id, question, answer, is_preferred, follow_ups, category, navigator_meta");
      if (profileId) query = query.eq("profile_id", profileId);
      const first = await query;
      let data = first.data;
      if (first.error && /follow_ups|navigator_meta/i.test(first.error.message)) {
        let fallback = supabase.from("prepared_qa").select("id, question, answer, is_preferred, category");
        if (profileId) fallback = fallback.eq("profile_id", profileId);
        const res = await fallback;
        data = res.data?.map((r) => ({ ...r, follow_ups: [], navigator_meta: {} })) ?? null;
      } else if (first.error) {
        console.error("prepared_qa load", first.error);
      }
      setLibrary(
        (data ?? [])
          .filter((r) => {
            const meta = (r as { navigator_meta?: PersistedNavigatorMeta }).navigator_meta;
            if (meta?.retrievalExcluded) return false;
            if (meta?.revisionStatus === "superseded" || meta?.revisionStatus === "archived") return false;
            return true;
          })
          .map((r) => {
            const meta = (r as { navigator_meta?: PersistedNavigatorMeta }).navigator_meta;
            return {
              id: r.id,
              question: r.question,
              answer: r.answer,
              isPreferred: r.is_preferred,
              followUps: parseFollowUps(r.follow_ups),
              category: r.category,
              part: meta?.part ?? undefined,
              notes: meta?.notes ?? meta?.seedKey ?? undefined,
              navigatorMeta: meta ?? null,
            };
          })
      );
    })();
  }, [profileId]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  }, []);

  const clearInterimFinalizeTimer = useCallback(() => {
    if (interimFinalizeTimerRef.current) clearTimeout(interimFinalizeTimerRef.current);
    interimFinalizeTimerRef.current = null;
  }, []);

  const clearLiveSttLine = useCallback(() => {
    const id = liveSttLineIdRef.current;
    if (!id) return;
    liveSttLineIdRef.current = null;
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const syncLiveSttLine = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      clearLiveSttLine();
      return;
    }
    setLines((prev) => {
      if (liveSttLineIdRef.current) {
        return prev.map((l) =>
          l.id === liveSttLineIdRef.current ? { ...l, text: trimmed, isFinal: false, kind: "speech" } : l
        );
      }
      const id = crypto.randomUUID();
      liveSttLineIdRef.current = id;
      seqRef.current += 1;
      return [
        ...prev,
        {
          id,
          sequenceId: seqRef.current,
          text: trimmed,
          isFinal: false,
          isQuestion: false,
          kind: "speech" as TranscriptLineKind,
          createdAt: Date.now(),
        },
      ];
    });
  }, [clearLiveSttLine]);

  const addTranscriptLine = useCallback(
    (
      text: string,
      kind: TranscriptLineKind,
      meta?: Pick<TranscriptLine, "speechGroupId" | "segmentIndex" | "segmentTotal" | "fullText">
    ) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      seqRef.current += 1;
      const isQuestion = kind === "question" || kind === "candidate";
      const line: TranscriptLine = {
        id: crypto.randomUUID(),
        sequenceId: seqRef.current,
        text: trimmed,
        isFinal: true,
        isQuestion,
        kind,
        createdAt: Date.now(),
        ...meta,
      };
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (
          last?.isFinal &&
          last.text === trimmed &&
          last.kind === kind &&
          last.speechGroupId === meta?.speechGroupId
        ) {
          return prev;
        }
        return [...prev, line];
      });
    },
    []
  );

  const analyze = useCallback(
    async (
      question: string,
      options?: {
        announce?: boolean;
        /** When true, do not replace main panel result (pinned / locked). */
        respectMainPanelLock?: boolean;
        forceMainPanel?: boolean;
        sessionContext?: InterviewSessionContext;
        analysisSource?: QuestionAnalyzeSource;
        /** Keep center-panel detected question when swapping prepared answer (e.g. alternatives). */
        preserveDetectedQuestion?: boolean;
      }
    ): Promise<AnalyzeQuestionResult | null> => {
      const normalizedKey = question.trim().toLowerCase().replace(/\s+/g, " ");
      const cached = analyzeCacheRef.current.get(normalizedKey);
      const now = Date.now();
      if (cached && now - cached.at < ANALYZE_CACHE_MS) {
        const data = cached.data;
        if (!options?.respectMainPanelLock || options?.forceMainPanel) {
          setResult(data);
          if (!options?.preserveDetectedQuestion) {
            setCurrentQuestion(question);
          }
        }
        return data;
      }

      const seq = ++analyzeSeqRef.current;
      optimisticResultRef.current = null;

      const canShowOptimisticMain =
        (!options?.respectMainPanelLock || options?.forceMainPanel) && libraryRef.current.length > 0;
      let optimistic: AnalyzeQuestionResult | null = null;
      if (canShowOptimisticMain) {
        const { query, corrections } = normalizeInterviewQuery(question.trim());
        const ranked = rankPreparedQaLexical(query, libraryRef.current);
        optimistic = analyzeResultFromLexicalRank(question.trim(), ranked, corrections);
        if (optimistic) {
          optimisticResultRef.current = { seq, result: optimistic };
          setResult(optimistic);
          if (!options?.preserveDetectedQuestion) {
            setCurrentQuestion(question);
          }
          setAnswerLocked(true);
          setMatchPreview(null);
        }
      }

      setLoading(true);
      try {
        const ctx = options?.sessionContext ?? getSessionContext?.();
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            profileId,
            sessionContext: ctx
              ? {
                  activeExperienceModuleId: ctx.activeExperienceModuleId,
                  activeIntent: ctx.activeIntent,
                  activeQuestionId: ctx.activeQuestionId,
                  lastDetectedQuestion: ctx.lastDetectedQuestion,
                  askedQuestionIds: ctx.askedQuestionIds,
                  manualExperienceOverrideId: ctx.manualExperienceOverrideId,
                  activeInterviewRound: ctx.activeInterviewRound,
                }
              : undefined,
          }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          const message =
            typeof err.error === "string"
              ? err.error
              : res.status === 401
                ? "Not signed in — refresh the page to restart POC session."
                : `Analyze failed (${res.status})`;
          throw new Error(message);
        }
        const data = (await res.json()) as AnalyzeQuestionResult;
        const confirmed: AnalyzeQuestionResult = { ...data, matchPhase: "confirmed" };
        if (seq !== analyzeSeqRef.current) {
          return null;
        }

        analyzeCacheRef.current.set(normalizedKey, { at: Date.now(), data: confirmed });

        if (process.env.NODE_ENV === "development" && confirmed.analyzeTimingMs) {
          console.debug("[analyze] server", confirmed.analyzeTimingMs);
        }

        const lowConfidence = confirmed.confidence < LEXICAL_MATCH_THRESHOLD_PREPARED;
        const skipMainUpdate =
          !options?.forceMainPanel && options?.respectMainPanelLock && lowConfidence;

        const source = options?.analysisSource ?? "auto";
        const pendingOptimistic =
          optimisticResultRef.current?.seq === seq ? optimisticResultRef.current.result : null;
        optimisticResultRef.current = null;

        if (!skipMainUpdate) {
          const swapTop =
            pendingOptimistic && shouldReplaceOptimisticWithHybrid(pendingOptimistic, confirmed);
          if (!pendingOptimistic || swapTop || pendingOptimistic.answer !== confirmed.answer) {
            setResult(confirmed);
          } else {
            setResult({
              ...confirmed,
              answer: pendingOptimistic.answer,
              matchPhase: "confirmed",
            });
          }
          if (!options?.preserveDetectedQuestion) {
            setCurrentQuestion(question);
            setQuestionHistory((h) => [...h, confirmed]);
            setHistorySources((s) => [...s, source]);
            setHistoryIndex((h) => h + 1);
          }
          setAnswerLocked(true);
          setMatchPreview(null);
        } else {
          setMatchPreview({ question, result: confirmed });
        }
        setCandidate(null);
        lastPromoteAtRef.current = Date.now();
        if (options?.announce) {
          setStatusAnnouncement(
            skipMainUpdate ? `Low-confidence match — see navigator` : `Matched: ${confirmed.question}`
          );
        }
        return confirmed;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Analyze failed";
        console.error(e);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getSessionContext, profileId]
  );

  const applyMatchPreview = useCallback(() => {
    if (!matchPreview) return;
    const { question, result: data } = matchPreview;
    setResult(data);
    setCurrentQuestion(question);
    setQuestionHistory((h) => [...h, data]);
    setHistorySources((s) => [...s, "manual"]);
    setHistoryIndex((h) => h + 1);
    setAnswerLocked(true);
    setMatchPreview(null);
  }, [matchPreview]);

  const dismissMatchPreview = useCallback(() => setMatchPreview(null), []);

  const processFinalizedTurn = useCallback(
    (text: string) => {
      if (paused) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
      if (wordCount < 2) {
        addTranscriptLine(trimmed, "speech");
        return;
      }

      const displayAnswer = pinnedAnswer ?? resultRef.current?.answer ?? null;
      const classification = classifyTurn(trimmed, {
        library: libraryRef.current,
        displayAnswer,
        currentPreparedQuestion: currentQuestionRef.current,
        lastPromoteAt: lastPromoteAtRef.current,
        conservative: false,
      });

      if (classification.reason === "reading_displayed_answer") {
        addTranscriptLine(trimmed, "readback");
        setCandidate(null);
        return;
      }

      const promptLike = classification.isQuestionLike || isInterviewPrompt(trimmed);
      const lineKind = promptLike ? "question" : "speech";

      const displaySegments = segmentTranscriptForDisplay(trimmed);
      const speechGroupId = displaySegments.length > 1 ? crypto.randomUUID() : undefined;
      displaySegments.forEach((seg, index) => {
        addTranscriptLine(seg, lineKind, {
          speechGroupId,
          segmentIndex: index,
          segmentTotal: displaySegments.length,
          fullText: speechGroupId ? trimmed : undefined,
        });
      });

      const autoRetrieve =
        classification.action === "promote" ||
        (promptLike &&
          (classification.score >= LEXICAL_MATCH_THRESHOLD_WEAK ||
            classification.reason === "unmatched_question"));

      if (autoRetrieve) {
        setCandidate(null);
        void analyze(trimmed, {
          announce: true,
          respectMainPanelLock: Boolean(pinnedAnswer) || answerLocked,
          analysisSource: "auto",
        });
        return;
      }

      if (classification.action === "candidate" || promptLike) {
        setCandidate({ text: trimmed, classification });
        return;
      }

      setCandidate(null);
    },
    [addTranscriptLine, analyze, answerLocked, paused, pinnedAnswer]
  );

  const finalizeTurn = useCallback(() => {
    clearSilenceTimer();
    clearInterimFinalizeTimer();
    const text = turnBufferRef.current.trim();
    turnBufferRef.current = "";
    setInterimTurn("");
    clearLiveSttLine();
    if (text) processFinalizedTurn(text);
  }, [clearInterimFinalizeTimer, clearLiveSttLine, clearSilenceTimer, processFinalizedTurn]);

  finalizeTurnRef.current = finalizeTurn;

  const scheduleSilenceFinalize = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => finalizeTurn(), turnSilenceMs(turnBufferRef.current));
  }, [clearSilenceTimer, finalizeTurn]);

  const ingestWebSpeechInterim = useCallback(
    (interim: string) => {
      if (paused) return;
      latestWebSpeechInterimRef.current = interim;
      const preview = [turnBufferRef.current.trim(), interim.trim()].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      if (!preview) {
        clearLiveSttLine();
        clearInterimFinalizeTimer();
        return;
      }
      setInterimTurn(preview);
      syncLiveSttLine(preview);

      if (shouldFinalizeTurnImmediately(preview)) {
        clearInterimFinalizeTimer();
        interimFinalizeTimerRef.current = setTimeout(() => {
          const current = [turnBufferRef.current.trim(), latestWebSpeechInterimRef.current.trim()]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          if (!shouldFinalizeTurnImmediately(current)) return;
          turnBufferRef.current = current;
          finalizeTurnRef.current();
        }, 280);
      } else {
        clearInterimFinalizeTimer();
      }
    },
    [clearInterimFinalizeTimer, clearLiveSttLine, paused, syncLiveSttLine]
  );

  const ingestSpeechFragment = useCallback(
    (fragment: string, options?: { finalizeImmediately?: boolean }) => {
      if (paused) return;
      const t = fragment.trim();
      if (!t) return;

      const buffer = turnBufferRef.current.trim();
      // Split turns at clear question boundaries only (avoid chopping on "." mid-conversation).
      if (buffer.endsWith("?")) {
        clearSilenceTimer();
        turnBufferRef.current = "";
        setInterimTurn("");
        clearLiveSttLine();
        processFinalizedTurn(buffer);
      }

      const merged = mergeTranscriptFragments(turnBufferRef.current, t);
      if (merged === turnBufferRef.current.trim()) {
        scheduleSilenceFinalize();
        return;
      }

      turnBufferRef.current = merged;
      setInterimTurn(merged);
      syncLiveSttLine(merged);

      if (options?.finalizeImmediately || shouldFinalizeTurnImmediately(merged)) {
        finalizeTurn();
      } else {
        scheduleSilenceFinalize();
      }
    },
    [
      clearLiveSttLine,
      clearSilenceTimer,
      finalizeTurn,
      paused,
      processFinalizedTurn,
      scheduleSilenceFinalize,
      syncLiveSttLine,
    ]
  );

  const acceptCandidate = useCallback(() => {
    if (!candidate) return;
    const text = candidate.text;
    setCurrentQuestion(text);
    setLines((prev) =>
      prev.map((line) =>
        line.text === text && line.kind === "speech"
          ? { ...line, kind: "question" as TranscriptLineKind, isQuestion: true }
          : line
      )
    );
    setCandidate(null);
    void analyze(text, { announce: true, forceMainPanel: true, analysisSource: "candidate" });
  }, [analyze, candidate]);

  const dismissCandidate = useCallback(() => setCandidate(null), []);

  const manualAnalyzeTranscript = useCallback(
    (
      text: string,
      options?: { forceMainPanel?: boolean; respectLock?: boolean }
    ) => {
      const trimmed = text.trim().replace(/\s+/g, " ");
      if (trimmed.length < 3) return Promise.resolve(null);
      setLines((prev) =>
        prev.map((line) =>
          line.text === trimmed && (line.kind === "speech" || line.kind === "candidate")
            ? { ...line, kind: "question" as TranscriptLineKind, isQuestion: true }
            : line
        )
      );
      setCandidate(null);
      const locked = Boolean(pinnedAnswer) || answerLocked;
      const respectLock = options?.respectLock ?? locked;
      return analyze(trimmed, {
        announce: true,
        forceMainPanel: options?.forceMainPanel ?? !respectLock,
        respectMainPanelLock: respectLock,
        analysisSource: "manual",
      });
    },
    [analyze, answerLocked, pinnedAnswer]
  );

  const promoteNextQuestion = useCallback(() => {
    if (candidate) {
      acceptCandidate();
      return;
    }
    const lastSpeech = [...lines].reverse().find((l) => l.isFinal && l.kind === "speech");
    if (lastSpeech) {
      setCurrentQuestion(lastSpeech.text);
      void analyze(lastSpeech.text, { announce: true });
      return;
    }
    toast.message("No pending question — wait for the interviewer to finish a turn.");
  }, [acceptCandidate, analyze, candidate, lines]);

  const startSimulation = useCallback(() => {
    listeningRef.current = true;
    setListening(true);
    setPaused(false);
    simIndexRef.current = 0;
    simTimerRef.current = setInterval(() => {
      const idx = simIndexRef.current;
      if (idx >= SIMULATION_SCRIPT.length) {
        if (simTimerRef.current) clearInterval(simTimerRef.current);
        return;
      }
      const utterance = SIMULATION_SCRIPT[idx];
      simIndexRef.current += 1;
      ingestSpeechFragment(utterance, { finalizeImmediately: true });
    }, 3500);
  }, [ingestSpeechFragment]);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    transcribeChainRef.current = Promise.resolve();
    setListening(false);
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = null;
    clearSilenceTimer();
    clearInterimFinalizeTimer();
    if (turnBufferRef.current.trim()) {
      finalizeTurnRef.current();
    } else {
      setInterimTurn("");
      clearLiveSttLine();
    }
  }, [clearInterimFinalizeTimer, clearLiveSttLine, clearSilenceTimer]);

  const setListeningActive = useCallback((active: boolean) => {
    listeningRef.current = active;
    setListening(active);
  }, []);

  const transcribeChunk = useCallback(
    (blob: Blob) => {
      if (!listeningRef.current || pausedRef.current) return;
      if (blob.size < MIN_TRANSCRIBE_BYTES) return;

      transcribeChainRef.current = transcribeChainRef.current
        .then(async () => {
          if (!listeningRef.current || pausedRef.current) return;

          const form = new FormData();
          form.append("audio", blob);

          const res = await fetch("/api/transcription/whisper", { method: "POST", body: form });
          if (!listeningRef.current) return;
          if (res.ok) {
            const data = (await res.json()) as { text?: string };
            if (data.text?.trim()) ingestSpeechFragment(data.text.trim());
            return;
          }

          if (res.status !== 503) return;

          const err = (await res.json().catch(() => ({}))) as { error?: string };
          const now = Date.now();
          if (now - lastTranscribeErrorToastAtRef.current < 45_000) return;
          lastTranscribeErrorToastAtRef.current = now;
          toast.error(err.error ?? "Local Whisper unavailable — run npm run whisper:server");
        })
        .catch((e) => {
          console.error("transcribeChunk", e);
        });
    },
    [ingestSpeechFragment]
  );

  const goPrev = useCallback(() => {
    setHistoryIndex((i) => {
      const next = Math.max(0, i - 1);
      setResult(questionHistory[next] ?? null);
      setCurrentQuestion(questionHistory[next]?.question ?? null);
      return next;
    });
  }, [questionHistory]);

  const goNext = useCallback(() => {
    setHistoryIndex((i) => {
      const next = Math.min(questionHistory.length - 1, i + 1);
      setResult(questionHistory[next] ?? null);
      setCurrentQuestion(questionHistory[next]?.question ?? null);
      return next;
    });
  }, [questionHistory]);

  const goToHistoryIndex = useCallback(
    (index: number) => {
      if (questionHistory.length === 0) return;
      const next = Math.max(0, Math.min(index, questionHistory.length - 1));
      setHistoryIndex(next);
      setResult(questionHistory[next] ?? null);
      setCurrentQuestion(questionHistory[next]?.question ?? null);
    },
    [questionHistory]
  );

  const jumpToLatestHistory = useCallback(() => {
    if (questionHistory.length === 0) return;
    const last = questionHistory.length - 1;
    setHistoryIndex(last);
    setResult(questionHistory[last] ?? null);
    setCurrentQuestion(questionHistory[last]?.question ?? null);
  }, [questionHistory]);

  /** Clear transcript, Q&A history, and analyze cache without stopping audio capture. */
  const resetPracticeSession = useCallback(() => {
    clearSilenceTimer();
    clearInterimFinalizeTimer();
    turnBufferRef.current = "";
    latestWebSpeechInterimRef.current = "";
    liveSttLineIdRef.current = null;
    analyzeCacheRef.current.clear();
    analyzeSeqRef.current = 0;
    setLines([]);
    setCurrentQuestion(null);
    setResult(null);
    setLoading(false);
    setQuestionHistory([]);
    setHistoryIndex(-1);
    setHistorySources([]);
    setCandidate(null);
    setAnswerLocked(false);
    setInterimTurn("");
    setMatchPreview(null);
    setStatusAnnouncement("Session reset — ready for a fresh interview");
  }, [clearInterimFinalizeTimer, clearSilenceTimer]);

  const openPreparedRow = useCallback(
    (row: import("@interview-copilot/shared").EnrichedQaRow, opts?: { preserveDetectedQuestion?: boolean }) => {
      const detected = opts?.preserveDetectedQuestion ? currentQuestionRef.current : null;
      const data = analyzeResultFromPreparedRow(row, { preserveDetectedQuestion: detected });
      setResult(data);
      if (!opts?.preserveDetectedQuestion) {
        setCurrentQuestion(row.question);
        setQuestionHistory((h) => [...h, data]);
        setHistorySources((s) => [...s, "browse"]);
        setHistoryIndex((h) => h + 1);
      }
      setAnswerLocked(true);
      setMatchPreview(null);
      setCandidate(null);
      setStatusAnnouncement(`Loaded: ${row.question}`);
    },
    []
  );

  useEffect(() => () => clearSilenceTimer(), [clearSilenceTimer]);

  useEffect(() => {
    if (!statusAnnouncement) return;
    const t = setTimeout(() => setStatusAnnouncement(null), 4000);
    return () => clearTimeout(t);
  }, [statusAnnouncement]);

  return {
    listening,
    paused,
    setPaused,
    lines,
    currentQuestion,
    result,
    loading,
    candidate,
    answerLocked,
    interimTurn,
    statusAnnouncement,
    setAnswerLocked,
    acceptCandidate,
    dismissCandidate,
    promoteNextQuestion,
    manualAnalyzeTranscript,
    matchPreview,
    applyMatchPreview,
    dismissMatchPreview,
    analyze,
    openPreparedRow,
    startSimulation,
    stopListening,
    setListening: setListeningActive,
    transcribeChunk,
    ingestSpeechFragment,
    ingestWebSpeechInterim,
    goPrev,
    goNext,
    questionHistory,
    historyIndex,
    historySources,
    goToHistoryIndex,
    jumpToLatestHistory,
    resetPracticeSession,
    library,
  };
}
