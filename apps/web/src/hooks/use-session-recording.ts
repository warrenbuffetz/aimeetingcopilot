"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CaptureSource } from "@/hooks/use-browser-audio-capture";
import { assembleRecordingBlob, formatBytes, formatDuration } from "@/lib/session-recording/blob";
import { clearRecordingSession, persistRecordingChunk } from "@/lib/session-recording/chunk-store";
import { formatRecordingFilename } from "@/lib/session-recording/filename";
import { pickSessionRecorderMimeType } from "@/lib/session-recording/mime";
import { acquireRecordingStream } from "@/lib/session-recording/mix-audio";
import {
  RECORDING_REFRESH_WARNING,
  SESSION_RECORDING_BITRATE,
  SESSION_RECORDING_TIMESLICE_MS,
  type ActiveCaptureSources,
  type SessionRecordingPhase,
  type SessionRecordingSourceMode,
} from "@/lib/session-recording/types";

export type SessionRecordingView = {
  phase: SessionRecordingPhase;
  elapsedMs: number;
  elapsedLabel: string;
  mimeType: string;
  sourcesActive: ActiveCaptureSources;
  sourceMode: SessionRecordingSourceMode | null;
  warning: string | null;
  error: string | null;
  completedOk: boolean;
  blob: Blob | null;
  durationMs: number | null;
  durationLabel: string | null;
  fileSize: number | null;
  fileSizeLabel: string | null;
  filename: string | null;
  persistWarning: string | null;
  isRecordingActive: boolean;
};

const IDLE_VIEW: SessionRecordingView = {
  phase: "idle",
  elapsedMs: 0,
  elapsedLabel: "0:00",
  mimeType: "",
  sourcesActive: { microphone: false, meeting: false },
  sourceMode: null,
  warning: null,
  error: null,
  completedOk: false,
  blob: null,
  durationMs: null,
  durationLabel: null,
  fileSize: null,
  fileSizeLabel: null,
  filename: null,
  persistWarning: null,
  isRecordingActive: false,
};

function mapSttSource(source: CaptureSource): "none" | "display" | "microphone" | "both" {
  if (source === "display") return "display";
  if (source === "microphone") return "microphone";
  if (source === "both") return "both";
  return "none";
}

export function useSessionRecording(options: {
  profileName: string | null;
  micDeviceId: string;
  getSttStream: () => MediaStream | null;
  sttCaptureSource: CaptureSource;
}) {
  const [view, setView] = useState<SessionRecordingView>(IDLE_VIEW);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkIndexRef = useRef(0);
  const sessionIdRef = useRef<string>("");
  const releaseCaptureRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const elapsedBaseRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackEndedHandlerRef = useRef<(() => void) | null>(null);
  const idbEnabledRef = useRef(true);

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      const start = startedAtRef.current;
      if (!start) return;
      const elapsed = Date.now() - start.getTime() + elapsedBaseRef.current;
      setView((v) => ({
        ...v,
        elapsedMs: elapsed,
        elapsedLabel: formatDuration(elapsed),
      }));
    }, 500);
  }, [stopTick]);

  const cleanupCapture = useCallback(() => {
    if (trackEndedHandlerRef.current) {
      trackEndedHandlerRef.current();
      trackEndedHandlerRef.current = null;
    }
    releaseCaptureRef.current?.();
    releaseCaptureRef.current = null;
  }, []);

  const failRecording = useCallback(
    (message: string) => {
      stopTick();
      try {
        const rec = recorderRef.current;
        if (rec && rec.state !== "inactive") rec.stop();
      } catch {
        /* ignore */
      }
      recorderRef.current = null;
      cleanupCapture();
      chunksRef.current = [];
      setView((v) => ({
        ...v,
        phase: "error",
        error: message,
        completedOk: false,
        isRecordingActive: false,
        blob: null,
      }));
    },
    [cleanupCapture, stopTick]
  );

  const attachTrackEndedGuards = useCallback(
    (streams: MediaStream[]) => {
      const handlers: (() => void)[] = [];
      for (const stream of streams) {
        for (const track of stream.getAudioTracks()) {
          const onEnded = () => {
            failRecording(
              "An audio track ended (microphone disconnected or tab sharing stopped). Recording was not completed."
            );
          };
          track.addEventListener("ended", onEnded);
          handlers.push(() => track.removeEventListener("ended", onEnded));
        }
      }
      trackEndedHandlerRef.current = () => handlers.forEach((h) => h());
    },
    [failRecording]
  );

  const start = useCallback(
    async (mode: SessionRecordingSourceMode) => {
      if (view.phase === "recording" || view.phase === "paused") return;

      const mimeType = pickSessionRecorderMimeType();
      if (!mimeType && typeof MediaRecorder === "undefined") {
        setView({ ...IDLE_VIEW, phase: "error", error: "MediaRecorder is not supported in this browser." });
        return;
      }

      sessionIdRef.current = crypto.randomUUID();
      chunksRef.current = [];
      chunkIndexRef.current = 0;
      elapsedBaseRef.current = 0;
      startedAtRef.current = new Date();
      idbEnabledRef.current = true;

      try {
        const micId = options.micDeviceId === "default" ? undefined : options.micDeviceId;
        const acquired = await acquireRecordingStream({
          mode,
          micDeviceId: micId,
          sttStream: options.getSttStream(),
          sttSource: mapSttSource(options.sttCaptureSource),
        });
        releaseCaptureRef.current = acquired.release;

        const watchStreams: MediaStream[] = [acquired.recordingStream];
        const stt = options.getSttStream();
        if (stt) watchStreams.push(stt);
        attachTrackEndedGuards(watchStreams);

        const recorderOptions: MediaRecorderOptions = {
          audioBitsPerSecond: SESSION_RECORDING_BITRATE,
        };
        if (mimeType) recorderOptions.mimeType = mimeType;

        const recorder = new MediaRecorder(acquired.recordingStream, recorderOptions);
        recorderRef.current = recorder;

        recorder.ondataavailable = (ev) => {
          if (!ev.data.size) return;
          chunksRef.current.push(ev.data);
          const idx = chunkIndexRef.current++;
          if (idbEnabledRef.current) {
            void persistRecordingChunk(sessionIdRef.current, idx, ev.data).catch(() => {
              idbEnabledRef.current = false;
              setView((v) => ({
                ...v,
                persistWarning:
                  "Could not persist chunks to IndexedDB — keep this tab open until you download.",
              }));
            });
          }
        };

        recorder.onerror = () => {
          failRecording("MediaRecorder encountered an error. The recording may be incomplete.");
        };

        recorder.start(SESSION_RECORDING_TIMESLICE_MS);
        startTick();

        const filename = formatRecordingFilename(
          options.profileName,
          startedAtRef.current,
          recorder.mimeType || mimeType
        );

        setView({
          phase: "recording",
          elapsedMs: 0,
          elapsedLabel: "0:00",
          mimeType: recorder.mimeType || mimeType,
          sourcesActive: acquired.sourcesActive,
          sourceMode: mode,
          warning: acquired.warning,
          error: null,
          completedOk: false,
          blob: null,
          durationMs: null,
          durationLabel: null,
          fileSize: null,
          fileSizeLabel: null,
          filename,
          persistWarning: null,
          isRecordingActive: true,
        });
      } catch (e) {
        cleanupCapture();
        const msg = e instanceof Error ? e.message : "Could not start recording.";
        setView({ ...IDLE_VIEW, phase: "error", error: msg });
      }
    },
    [
      attachTrackEndedGuards,
      cleanupCapture,
      failRecording,
      options.getSttStream,
      options.micDeviceId,
      options.profileName,
      options.sttCaptureSource,
      startTick,
      view.phase,
    ]
  );

  const pause = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== "recording") return;
    rec.pause();
    if (startedAtRef.current) {
      elapsedBaseRef.current += Date.now() - startedAtRef.current.getTime();
      startedAtRef.current = null;
    }
    stopTick();
    setView((v) => ({ ...v, phase: "paused", isRecordingActive: false }));
  }, [stopTick]);

  const resume = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state !== "paused") return;
    startedAtRef.current = new Date();
    rec.resume();
    startTick();
    setView((v) => ({ ...v, phase: "recording", isRecordingActive: true }));
  }, [startTick]);

  const stop = useCallback(async () => {
    const rec = recorderRef.current;
    if (!rec || (rec.state !== "recording" && rec.state !== "paused")) return;

    stopTick();
    if (startedAtRef.current) {
      elapsedBaseRef.current += Date.now() - startedAtRef.current.getTime();
      startedAtRef.current = null;
    }

    await new Promise<void>((resolve) => {
      const finalize = () => {
        recorderRef.current = null;
        resolve();
      };
      rec.onstop = finalize;
      try {
        if (rec.state === "recording") rec.requestData();
        rec.stop();
      } catch {
        finalize();
      }
    });

    cleanupCapture();

    const mime = rec.mimeType || view.mimeType || pickSessionRecorderMimeType();
    let chunks = chunksRef.current;
    if (chunks.length === 0 && sessionIdRef.current) {
      try {
        const { loadRecordingChunks } = await import("@/lib/session-recording/chunk-store");
        chunks = await loadRecordingChunks(sessionIdRef.current);
      } catch {
        /* memory-only */
      }
    }

    if (chunks.length === 0) {
      setView((v) => ({
        ...v,
        phase: "error",
        error: "No audio data was captured.",
        completedOk: false,
        isRecordingActive: false,
      }));
      return;
    }

    const blob = assembleRecordingBlob(chunks, mime);
    const durationMs = elapsedBaseRef.current;
    const filename =
      view.filename ??
      formatRecordingFilename(options.profileName, new Date(Date.now() - durationMs), mime);

    setView((v) => ({
      ...v,
      phase: "stopped",
      completedOk: true,
      blob,
      durationMs,
      durationLabel: formatDuration(durationMs),
      fileSize: blob.size,
      fileSizeLabel: formatBytes(blob.size),
      filename,
      isRecordingActive: false,
      elapsedMs: durationMs,
      elapsedLabel: formatDuration(durationMs),
    }));
  }, [cleanupCapture, options.profileName, stopTick, view.filename, view.mimeType]);

  const discard = useCallback(async () => {
    stopTick();
    try {
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") rec.stop();
    } catch {
      /* ignore */
    }
    recorderRef.current = null;
    cleanupCapture();
    chunksRef.current = [];
    if (sessionIdRef.current) {
      try {
        await clearRecordingSession(sessionIdRef.current);
      } catch {
        /* ignore */
      }
    }
    sessionIdRef.current = "";
    setView(IDLE_VIEW);
  }, [cleanupCapture, stopTick]);

  useEffect(() => {
    const active = view.phase === "recording";
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = RECORDING_REFRESH_WARNING;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [view.phase]);

  useEffect(() => () => {
    stopTick();
    cleanupCapture();
  }, [cleanupCapture, stopTick]);

  return {
    view,
    start,
    pause,
    resume,
    stop,
    discard,
  };
}
