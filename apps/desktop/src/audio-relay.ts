import { WebSocketServer, type WebSocket } from "ws";

const PORT = Number(process.env.COPILOT_AUDIO_RELAY_PORT ?? 39200);

let wss: WebSocketServer | null = null;

export function startAudioRelay(): void {
  if (wss) return;

  wss = new WebSocketServer({ host: "127.0.0.1", port: PORT });
  wss.on("connection", (socket) => {
    socket.on("message", (data, isBinary) => {
      if (!isBinary || !wss) return;
      for (const client of wss.clients) {
        if (client !== socket && client.readyState === client.OPEN) {
          client.send(data, { binary: true });
        }
      }
    });
  });

  console.log(`[Interview Copilot] Audio relay ws://127.0.0.1:${PORT}`);
}

export function broadcastAudioChunk(data: Buffer): void {
  if (!wss) return;
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(data, { binary: true });
    }
  }
}
