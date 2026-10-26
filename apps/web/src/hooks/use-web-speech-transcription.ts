"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sliceWebSpeechResults } from "@/lib/web-speech-results";

const RESTART_DELAY_MS = 250;
const MAX_NETWORK_RETRIES = 3;

export const WEB_SPEECH_NETWORK_ERROR =
  "Web Speech needs internet — Chrome sends audio to Google’s speech service. Try Chrome or Edge, or disable VPN/ad blockers.";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function stitchWebSpeechLive(confirmed: string, interim: string): string {
  return [confirmed.trim(), interim.trim()].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export type UseWebSpeechTranscriptionOptions = {
  lang?: string;
  onFinalSegment: (text: string) => void;
  onInterim: (text: string) => void;
  onError?: (message: string) => void;
};

export function useWebSpeechTranscription(options: UseWebSpeechTranscriptionOptions) {
  const { lang = "en-US", onFinalSegment, onInterim, onError } = options;

  const onFinalRef = useRef(onFinalSegment);
  const onInterimRef = useRef(onInterim);
  const onErrorRef = useRef(onError);
  onFinalRef.current = onFinalSegment;
  onInterimRef.current = onInterim;
  onErrorRef.current = onError;

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const activeRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const networkRetryCountRef = useRef(0);

  const SpeechRecognitionCtor = getSpeechRecognitionCtor();
  const isSupported = SpeechRecognitionCtor !== null;

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const scheduleRestart = useCallback(
    (recognition: SpeechRecognitionInstance) => {
      clearRestartTimer();
      restartTimerRef.current = setTimeout(() => {
        if (!activeRef.current) return;
        try {
          recognition.start();
          networkRetryCountRef.current = 0;
        } catch {
          /* ignore — onend may fire again */
        }
      }, RESTART_DELAY_MS);
    },
    [clearRestartTimer]
  );

  useEffect(() => {
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!activeRef.current) return;

      const { finals, interim } = sliceWebSpeechResults(event.results, event.resultIndex);
      for (const segment of finals) {
        onFinalRef.current(segment);
      }
      onInterimRef.current(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;
      if (event.error === "no-speech" && activeRef.current) return;

      if (event.error === "network" && activeRef.current) {
        if (networkRetryCountRef.current < MAX_NETWORK_RETRIES) {
          networkRetryCountRef.current += 1;
          scheduleRestart(recognition);
          return;
        }
      }

      const message =
        event.error === "not-allowed"
          ? "Microphone permission denied."
          : event.error === "network"
            ? WEB_SPEECH_NETWORK_ERROR
            : `Speech recognition error: ${event.error}`;

      activeRef.current = false;
      setActive(false);
      clearRestartTimer();
      setError(message);
      onErrorRef.current?.(message);
    };

    recognition.onstart = () => {
      if (activeRef.current) {
        onInterimRef.current("");
      }
    };

    recognition.onend = () => {
      if (activeRef.current) {
        scheduleRestart(recognition);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearRestartTimer();
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [SpeechRecognitionCtor, lang, clearRestartTimer, scheduleRestart]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    activeRef.current = true;
    setActive(true);
    setError(null);
    networkRetryCountRef.current = 0;
    clearRestartTimer();
    try {
      recognitionRef.current.start();
    } catch {
      recognitionRef.current.stop();
      setTimeout(() => recognitionRef.current?.start(), 100);
    }
  }, [clearRestartTimer]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    clearRestartTimer();
    recognitionRef.current?.abort();
    onInterimRef.current("");
  }, [clearRestartTimer]);

  return { isSupported, active, error, start, stop };
}
