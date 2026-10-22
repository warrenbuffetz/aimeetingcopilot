"use client";

import { useCallback, useRef, useState } from "react";

const DEFAULT_WS = process.env.NEXT_PUBLIC_DESKTOP_AUDIO_WS_URL ?? "ws://127.0.0.1:39200";

export function useDesktopAudioRelay(onChunk: (blob: Blob) => void) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  }, []);

  const connect = useCallback(() => {
    disconnect();
    setError(null);
    try {
      const ws = new WebSocket(DEFAULT_WS);
      ws.binaryType = "arraybuffer";
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
      };
      ws.onerror = () => {
        setError("Desktop audio relay not running. Start the Windows Electron companion.");
      };
      ws.onmessage = (ev) => {
        if (ev.data instanceof ArrayBuffer) {
          onChunk(new Blob([ev.data], { type: "audio/webm;codecs=opus" }));
        } else if (ev.data instanceof Blob) {
          onChunk(ev.data);
        }
      };
      wsRef.current = ws;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect to desktop relay");
    }
  }, [disconnect, onChunk]);

  return { connected, error, connect, disconnect };
}
