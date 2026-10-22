"use client";

import { AUDIO_CHUNK_MS } from "@interview-copilot/shared";
import { useCallback, useEffect, useRef, useState } from "react";

export type CaptureSource = "none" | "display" | "microphone" | "both";

export interface CaptureHealth {
  hasAudioTrack: boolean;
  receivingSamples: boolean;
  level: number;
  voiceLevel: number;
  voiceActive: boolean;
  error: string | null;
}

export function useBrowserAudioCapture() {
  const [active, setActive] = useState(false);
  const [source, setSource] = useState<CaptureSource>("none");
  const [health, setHealth] = useState<CaptureHealth>({
    hasAudioTrack: false,
    receivingSamples: false,
    level: 0,
    voiceLevel: 0,
    voiceActive: false,
    error: null,
  });

  const voiceActiveRef = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const onChunkRef = useRef<((blob: Blob) => void) | null>(null);
  const transcribeFlushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);

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
    void ctx.resume();
    const sourceNode = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    sourceNode.connect(analyser);
    analyserRef.current = analyser;
    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      let sumSq = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = (timeData[i] - 128) / 128;
        sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / timeData.length);

      const binHz = ctx.sampleRate / analyser.fftSize;
      const lowBin = Math.max(1, Math.floor(280 / binHz));
      const highBin = Math.min(Math.ceil(3500 / binHz), freqData.length - 1);
      let speechSum = 0;
      let speechBins = 0;
      for (let i = lowBin; i <= highBin; i++) {
        speechSum += freqData[i];
        speechBins += 1;
      }
      const speechBand = speechBins ? speechSum / speechBins / 255 : 0;

      const fullAvg = freqData.reduce((a, b) => a + b, 0) / freqData.length / 255;
      const speechRatio = fullAvg > 0.001 ? speechBand / fullAvg : 0;

      const voiceScore = speechBand * 0.65 + rms * 0.35;
      const looksLikeSpeech =
        rms >= 0.028 && speechBand >= 0.1 && speechRatio >= 0.55 && voiceScore >= 0.07;

      if (looksLikeSpeech) voiceActiveRef.current = true;
      else if (voiceScore < 0.045) voiceActiveRef.current = false;

      setHealth((h) => ({
        ...h,
        level: fullAvg,
        voiceLevel: Math.min(1, voiceScore * 1.35),
        voiceActive: voiceActiveRef.current,
        receivingSamples: rms > 0.008,
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const flushRecorderToWhisper = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return;
    try {
      recorder.requestData();
    } catch {
      /* ignore */
    }
  }, []);

  const stopContinuousTranscription = useCallback(() => {
    if (transcribeFlushTimerRef.current) {
      clearInterval(transcribeFlushTimerRef.current);
      transcribeFlushTimerRef.current = null;
    }

    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (!recorder || recorder.state === "inactive") {
      onChunkRef.current = null;
      return;
    }

    recorder.onstop = () => {
      onChunkRef.current = null;
    };

    try {
      if (recorder.state === "recording") recorder.requestData();
      recorder.stop();
    } catch {
      onChunkRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopMeter();
    stopContinuousTranscription();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setActive(false);
    setSource("none");
    voiceActiveRef.current = false;
    setHealth({
      hasAudioTrack: false,
      receivingSamples: false,
      level: 0,
      voiceLevel: 0,
      voiceActive: false,
      error: null,
    });
  }, [stopContinuousTranscription, stopMeter]);

  useEffect(() => () => stop(), [stop]);

  const refreshAudioInputs = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioInputDevices(devices.filter((d) => d.kind === "audioinput"));
  }, []);

  useEffect(() => {
    void refreshAudioInputs();
    navigator.mediaDevices?.addEventListener("devicechange", refreshAudioInputs);
    return () => navigator.mediaDevices?.removeEventListener("devicechange", refreshAudioInputs);
  }, [refreshAudioInputs]);

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
          error: "No system audio track. Pick a browser tab that is playing meeting audio.",
        }));
      }
    } catch (e) {
      setHealth((h) => ({
        ...h,
        error: e instanceof Error ? e.message : "Display capture denied",
      }));
    }
  }, [startMeter, stop]);

  const startMicrophone = useCallback(
    async (deviceId?: string) => {
      stop();
      try {
        const audio: boolean | MediaTrackConstraints = deviceId
          ? { deviceId: { exact: deviceId } }
          : true;
        const mic = await navigator.mediaDevices.getUserMedia({ audio: audio });
        streamRef.current = mic;
        setSource("microphone");
        setActive(true);
        startMeter(mic);
        await refreshAudioInputs();
      } catch (e) {
        setHealth((h) => ({
          ...h,
          error: e instanceof Error ? e.message : "Microphone denied",
        }));
      }
    },
    [refreshAudioInputs, startMeter, stop]
  );

  /** One open MediaRecorder; periodic requestData() sends audio to Whisper (no stop/start slices). */
  const startContinuousTranscription = useCallback(
    (onAudio: (blob: Blob) => void, flushIntervalMs = AUDIO_CHUNK_MS) => {
      stopContinuousTranscription();
      onChunkRef.current = onAudio;
      const stream = streamRef.current;
      if (!stream) return;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0 && onChunkRef.current) onChunkRef.current(ev.data);
      };
      recorder.start();

      transcribeFlushTimerRef.current = setInterval(() => {
        flushRecorderToWhisper();
      }, flushIntervalMs);

      flushRecorderToWhisper();
    },
    [flushRecorderToWhisper, stopContinuousTranscription]
  );

  const getStream = useCallback(() => streamRef.current, []);

  return {
    active,
    source,
    health,
    audioInputDevices,
    refreshAudioInputs,
    startDisplay,
    startMicrophone,
    stop,
    stopContinuousTranscription,
    startContinuousTranscription,
    /** @deprecated use startContinuousTranscription */
    startChunkedTranscription: startContinuousTranscription,
    stopChunkedTranscription: stopContinuousTranscription,
    getStream,
  };
};
