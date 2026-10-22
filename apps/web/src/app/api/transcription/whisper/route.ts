import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getLocalWhisperBaseUrl } from "@/lib/local-whisper";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("audio");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "audio blob required" }, { status: 400 });
  }

  const base = getLocalWhisperBaseUrl();
  const outbound = new FormData();
  outbound.append("audio", file, "chunk.webm");

  try {
    const res = await fetch(`${base}/transcribe`, {
      method: "POST",
      body: outbound,
      signal: AbortSignal.timeout(120_000),
    });
    const body = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            body.error ??
            `Local Whisper unavailable at ${base}. Start it with: npm run whisper:server`,
        },
        { status: res.status === 404 ? 503 : res.status }
      );
    }
    return NextResponse.json({
      text: body.text ?? "",
      isFinal: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Local Whisper request failed";
    return NextResponse.json(
      {
        error: `${message}. Is the server running? npm run whisper:server`,
      },
      { status: 503 }
    );
  }
}
