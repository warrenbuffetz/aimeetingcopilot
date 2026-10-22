"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LEXICAL_MATCH_THRESHOLD_PREPARED,
  mergeTranscriptFragments,
  surfaceTurnSuggestion,
  turnSilenceMs,
  type AnalyzeQuestionResult,
  type LexicalQaRow,
  type TurnClassification,
} from "@interview-copilot/shared";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export type TranscriptLineKind = "filler" | "speech" | "candidate" | "question";

export type TranscriptLine = {
  id: string;
  sequenceId: number;
  text: string;
  isFinal: boolean;
  isQuestion: boolean;
  kind: TranscriptLineKind;
};

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

export function useLiveSession(profileId: string | null) {
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeQuestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<AnalyzeQuestionResult[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [library, setLibrary] = useState<LexicalQaRow[]>([]);
  const [candidate, setCandidate] = useState<TurnCandidate | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [interimTurn, setInterimTurn] = useState("");
  const [statusAnnouncement, setStatusAnnouncement] = useState<string | null>(null);

  const seqRef = useRef(0);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simIndexRef = useRef(0);
  const turnBufferRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      let query = supabase
        .from("prepared_qa")
        .select("id, question, answer, is_preferred, follow_ups, category");
      if (profileId) query = query.eq("profile_id", profileId);
      const first = await query;
      let data = first.data;
      if (first.error && /follow_ups/i.test(first.error.message)) {
        let fallback = supabase.from("prepared_qa").select("id, question, answer, is_preferred, category");
        if (profileId) fallback = fallback.eq("profile_id", profileId);
        const res = await fallback;
        data = res.data?.map((r) => ({ ...r, follow_ups: [] })) ?? null;
      } else if (first.error) {
        console.error("prepared_qa load", first.error);
      }
      setLibrary(
        (data ?? []).map((r) => ({
          id: r.id,
          question: r.question,
          answer: r.answer,
          isPreferred: r.is_preferred,
          followUps: parseFollowUps(r.follow_ups),
          category: r.category,
        }))
      );
    })();
  }, [profileId]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
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
        },
      ];
    });
  }, [clearLiveSttLine]);

  const addTranscriptLine = useCallback(
    (text: string, kind: TranscriptLineKind) => {
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
      };
      setLines((prev) => {
        const last = prev[prev.length - 1];
        if (last?.isFinal && last.text === trimmed && last.kind === kind) return prev;
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
      }
    ): Promise<AnalyzeQuestionResult | null> => {
      setLoading(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, profileId }),
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
        const lowConfidence = data.confidence < LEXICAL_MATCH_THRESHOLD_PREPARED;
        const skipMainUpdate =
          !options?.forceMainPanel && options?.respectMainPanelLock && lowConfidence;

        if (!skipMainUpdate) {
          setResult(data);
          setCurrentQuestion(question);
          setQuestionHistory((h) => [...h, data]);
          setHistoryIndex((h) => h + 1);
          setAnswerLocked(true);
        }
        setCandidate(null);
        lastPromoteAtRef.current = Date.now();
        if (options?.announce) {
          setStatusAnnouncement(
            skipMainUpdate ? `Low-confidence match — see navigator` : `Matched: ${data.question}`
          );
        }
        return data;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Analyze failed";
        console.error(e);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [profileId]
  );

  const processFinalizedTurn = useCallback(
    (text: string) => {
      if (paused) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      addTranscriptLine(trimmed, "speech");

      const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
      if (wordCount < 2) return;

      const classification = surfaceTurnSuggestion(trimmed, libraryRef.current);
      setCandidate({ text: trimmed, classification });
    },
    [addTranscriptLine, paused]
  );

  const finalizeTurn = useCallback(() => {
    clearSilenceTimer();
    const text = turnBufferRef.current.trim();
    turnBufferRef.current = "";
    setInterimTurn("");
    clearLiveSttLine();
    if (text) processFinalizedTurn(text);
  }, [clearLiveSttLine, clearSilenceTimer, processFinalizedTurn]);

  finalizeTurnRef.current = finalizeTurn;

  const scheduleSilenceFinalize = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => finalizeTurn(), turnSilenceMs(turnBufferRef.current));
  }, [clearSilenceTimer, finalizeTurn]);

  const ingestWebSpeechInterim = useCallback(
    (interim: string) => {
      if (paused) return;
      const preview = [turnBufferRef.current.trim(), interim.trim()].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      if (!preview) {
        clearLiveSttLine();
        return;
      }
      setInterimTurn(preview);
      syncLiveSttLine(preview);
    },
    [clearLiveSttLine, paused, syncLiveSttLine]
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

      if (options?.finalizeImmediately) {
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
    void analyze(text, { announce: true, forceMainPanel: true });
  }, [analyze, candidate]);

  const dismissCandidate = useCallback(() => setCandidate(null), []);

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
    if (turnBufferRef.current.trim()) {
      finalizeTurnRef.current();
    } else {
      setInterimTurn("");
      clearLiveSttLine();
    }
  }, [clearLiveSttLine, clearSilenceTimer]);

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
      return next;
    });
  }, [questionHistory]);

  const goNext = useCallback(() => {
    setHistoryIndex((i) => {
      const next = Math.min(questionHistory.length - 1, i + 1);
      setResult(questionHistory[next] ?? null);
      return next;
    });
  }, [questionHistory]);

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
    analyze,
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
    library,
  };
}
