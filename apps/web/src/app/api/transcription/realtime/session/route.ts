import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { isOpenAIConfigured } from "@/lib/env";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";

const TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";

export async function POST() {
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOpenAIConfigured()) {
    return NextResponse.json({ error: "OpenAI is not configured" }, { status: 503 });
  }

  const openai = getOpenAI();
  try {
    const secret = await openai.realtime.clientSecrets.create({
      expires_after: { anchor: "created_at", seconds: 600 },
      session: {
        type: "transcription",
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            transcription: { model: TRANSCRIPTION_MODEL },
            turn_detection: null,
          },
        },
      },
    });

    return NextResponse.json({
      clientSecret: secret.value,
      model: TRANSCRIPTION_MODEL,
      expiresAt: secret.expires_at ?? null,
    });
  } catch (err) {
    console.error("realtime session", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create realtime session" },
      { status: 500 }
    );
  }
}
