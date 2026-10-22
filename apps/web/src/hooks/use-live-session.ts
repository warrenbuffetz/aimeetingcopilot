"use client";

import { useCallback, useRef, useState } from "react";
import { isLikelyQuestion, type AnalyzeQuestionResult } from "@interview-copilot/shared";

export type TranscriptLine = {
  id: string;
  sequenceId: number;
  text: string;
  isFinal: boolean;
  isQuestion: boolean;
};

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
  const seqRef = useRef(0);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simIndexRef = useRef(0);
  const seenTextsRef = useRef<Set<string>>(new Set());
  const partialLineIdRef = useRef<string | null>(null);

  const onPartialTranscript = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLines((prev) => {
      if (partialLineIdRef.current) {
        return prev.map((l) =>
          l.id === partialLineIdRef.current ? { ...l, text: trimmed, isFinal: false } : l
        );
      }
      seqRef.current += 1;
      const id = crypto.randomUUID();
      partialLineIdRef.current = id;
      return [
        ...prev,
        {
          id,
          sequenceId: seqRef.current,
          text: trimmed,
          isFinal: false,
          isQuestion: false,
        },
      ];
    });
  }, []);

  const appendLine = useCallback((text: string, isFinal: boolean) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = `${isFinal}:${trimmed}`;
    if (isFinal && seenTextsRef.current.has(key)) return;
    if (isFinal) seenTextsRef.current.add(key);

    seqRef.current += 1;
    const line: TranscriptLine = {
      id: crypto.randomUUID(),
      sequenceId: seqRef.current,
      text: trimmed,
      isFinal,
      isQuestion: isFinal && isLikelyQuestion(trimmed),
    };
    setLines((prev) => [...prev, line]);
    if (line.isQuestion) {
      setCurrentQuestion(trimmed);
    }
  }, []);

  const analyze = useCallback(
    async (question: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, profileId }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Analyze failed");
        }
        const data = (await res.json()) as AnalyzeQuestionResult;
        setResult(data);
        setQuestionHistory((h) => [...h, data]);
        setHistoryIndex((h) => h + 1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [profileId]
  );

  const onFinalUtterance = useCallback(
    (text: string) => {
      partialLineIdRef.current = null;
      appendLine(text, true);
      if (isLikelyQuestion(text) && !paused) {
        void analyze(text);
      }
    },
    [analyze, appendLine, paused]
  );

  const startSimulation = useCallback(() => {
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
      onFinalUtterance(utterance);
    }, 3500);
  }, [onFinalUtterance]);

  const stopListening = useCallback(() => {
    setListening(false);
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = null;
  }, []);

  const transcribeChunk = useCallback(
    async (blob: Blob) => {
      if (paused) return;
      const form = new FormData();
      form.append("audio", blob);
      const res = await fetch("/api/transcription/chunk", { method: "POST", body: form });
      if (!res.ok) return;
      const data = await res.json();
      if (data.text) onFinalUtterance(data.text as string);
    },
    [onFinalUtterance, paused]
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

  return {
    listening,
    paused,
    setPaused,
    lines,
    currentQuestion,
    result,
    loading,
    appendLine,
    analyze,
    startSimulation,
    stopListening,
    setListening,
    transcribeChunk,
    onFinalUtterance,
    onPartialTranscript,
    goPrev,
    goNext,
    questionHistory,
    historyIndex,
  };
}
