"use client";

import { useCallback, useRef, useState } from "react";
import { encodePcmBase64 } from "@/lib/audio/pcm";

type Status = "idle" | "connecting" | "live" | "reconnecting" | "error";

export function useRealtimeTranscription(opts: {
  onPartial: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (message: string) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const partialRef = useRef("");
  const commitTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seqRef = useRef(0);
  const stoppedRef = useRef(false);

  const cleanupAudio = useCallback(() => {
    if (commitTimerRef.current) clearInterval(commitTimerRef.current);
    commitTimerRef.current = null;
    processorRef.current?.disconnect();
    processorRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
  }, []);

  const closeSocket = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    cleanupAudio();
    closeSocket();
    setStatus("idle");
    partialRef.current = "";
  }, [cleanupAudio, closeSocket]);

  const connect = useCallback(async (): Promise<WebSocket> => {
    const res = await fetch("/api/transcription/realtime/session", { method: "POST" });
    const body = (await res.json()) as { clientSecret?: string; error?: string };
    if (!res.ok || !body.clientSecret) {
      throw new Error(body.error ?? "Could not start realtime transcription session");
    }

    const url = "wss://api.openai.com/v1/realtime?intent=transcription";
    const ws = new WebSocket(url, [
      "realtime",
      `openai-insecure-api-key.${body.clientSecret}`,
    ]);

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("WebSocket connection timeout")), 15000);
      ws.onopen = () => {
        clearTimeout(t);
        resolve();
      };
      ws.onerror = () => {
        clearTimeout(t);
        reject(new Error("WebSocket connection failed"));
      };
    });

    ws.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "transcription",
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              transcription: { model: "gpt-4o-mini-transcribe" },
              turn_detection: null,
            },
          },
        },
      })
    );

    return ws;
  }, []);

  const attachHandlers = useCallback(
    (ws: WebSocket) => {
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as {
            type?: string;
            delta?: string;
            transcript?: string;
          };
          if (msg.type === "conversation.item.input_audio_transcription.delta" && msg.delta) {
            partialRef.current += msg.delta;
            opts.onPartial(partialRef.current);
          }
          if (msg.type === "conversation.item.input_audio_transcription.completed") {
            const text = (msg.transcript ?? partialRef.current).trim();
            partialRef.current = "";
            if (text) {
              seqRef.current += 1;
              opts.onFinal(text);
            }
          }
          if (msg.type === "error") {
            opts.onError?.("Realtime transcription error");
          }
        } catch {
          /* ignore non-json */
        }
      };

      ws.onclose = () => {
        if (stoppedRef.current) return;
        setStatus("reconnecting");
        void (async () => {
          try {
            const next = await connect();
            wsRef.current = next;
            attachHandlers(next);
            setStatus("live");
          } catch (e) {
            setStatus("error");
            opts.onError?.(e instanceof Error ? e.message : "Reconnect failed");
          }
        })();
      };
    },
    [connect, opts]
  );

  const start = useCallback(
    async (stream: MediaStream) => {
      stoppedRef.current = false;
      setStatus("connecting");
      streamRef.current = stream;

      try {
        const ws = await connect();
        wsRef.current = ws;
        attachHandlers(ws);

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          const input = e.inputBuffer.getChannelData(0);
          const b64 = encodePcmBase64(input, ctx.sampleRate);
          wsRef.current.send(JSON.stringify({ type: "input_audio_buffer.append", audio: b64 }));
        };

        source.connect(processor);
        processor.connect(ctx.destination);

        commitTimerRef.current = setInterval(() => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          wsRef.current.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
          wsRef.current.send(JSON.stringify({ type: "input_audio_buffer.clear" }));
        }, 2500);

        setStatus("live");
      } catch (e) {
        setStatus("error");
        cleanupAudio();
        opts.onError?.(e instanceof Error ? e.message : "Failed to start realtime transcription");
      }
    },
    [attachHandlers, cleanupAudio, connect, opts]
  );

  return { status, start, stop };
}
