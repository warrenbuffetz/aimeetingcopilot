"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CaptureSource = "none" | "display" | "microphone" | "both";

export interface CaptureHealth {
  hasAudioTrack: boolean;
  receivingSamples: boolean;
  level: number;
  error: string | null;
}

export function useBrowserAudioCapture() {
  const [active, setActive] = useState(false);
  const [source, setSource] = useState<CaptureSource>("none");
  const [health, setHealth] = useState<CaptureHealth>({
    hasAudioTrack: false,
    receivingSamples: false,
    level: 0,
    error: null,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const onChunkRef = useRef<((blob: Blob) => void) | null>(null);

  const stopMeter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startMeter = useCallback((stream: MediaStream) => {
    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      setHealth((h) => ({ ...h, hasAudioTrack: false, receivingSamples: false }));
      return;
    }
    setHealth((h) => ({ ...h, hasAudioTrack: true, error: null }));
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const sourceNode = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    sourceNode.connect(analyser);
    analyserRef.current = analyser;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
      setHealth((h) => ({
        ...h,
        level: avg,
        receivingSamples: avg > 0.01,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stop = useCallback(() => {
    stopMeter();
    recorderRef.current?.stop();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setActive(false);
    setSource("none");
    setHealth({ hasAudioTrack: false, receivingSamples: false, level: 0, error: null });
  }, [stopMeter]);

  useEffect(() => () => stop(), [stop]);

  const startDisplay = useCallback(async () => {
    stop();
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false;
      }
      streamRef.current = displayStream;
      setSource("display");
      setActive(true);
      startMeter(displayStream);
      if (!displayStream.getAudioTracks().length) {
        setHealth((h) => ({
          ...h,
          error:
            "No system audio track. Pick a browser tab with audio, or use the Windows desktop companion.",
        }));
      }
    } catch (e) {
      setHealth((h) => ({
        ...h,
        error: e instanceof Error ? e.message : "Display capture denied",
      }));
    }
  }, [startMeter, stop]);

  const startMicrophone = useCallback(async () => {
    stop();
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mic;
      setSource("microphone");
      setActive(true);
      startMeter(mic);
    } catch (e) {
      setHealth((h) => ({
        ...h,
        error: e instanceof Error ? e.message : "Microphone denied",
      }));
    }
  }, [startMeter, stop]);

  const startChunkedTranscription = useCallback(
    (onChunk: (blob: Blob) => void, intervalMs = 4000) => {
      onChunkRef.current = onChunk;
      const stream = streamRef.current;
      if (!stream) return;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      recorderRef.current = recorder;
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0 && onChunkRef.current) onChunkRef.current(ev.data);
      };
      recorder.start(intervalMs);
    },
    []
  );

  const getStream = useCallback(() => streamRef.current, []);

  return {
    active,
    source,
    health,
    startDisplay,
    startMicrophone,
    stop,
    startChunkedTranscription,
    getStream,
  };
}
