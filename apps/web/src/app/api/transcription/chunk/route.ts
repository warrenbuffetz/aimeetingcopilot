import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getOpenAI } from "@/lib/openai";
import { isOpenAIConfigured } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOpenAIConfigured()) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
  }

  const form = await req.formData();
  const file = form.get("audio");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "audio blob required" }, { status: 400 });
  }

  const openai = getOpenAI();
  const transcription = await openai.audio.transcriptions.create({
    file: new File([file], "chunk.webm", { type: file.type || "audio/webm" }),
    model: "gpt-4o-mini-transcribe",
    response_format: "json",
  });

  return NextResponse.json({
    text: transcription.text,
    isFinal: true,
  });
}
