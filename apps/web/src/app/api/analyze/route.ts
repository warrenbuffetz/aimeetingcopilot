import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { analyzeQuestion } from "@/lib/retrieval/analyze";
import { isOpenAIConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth";

const bodySchema = z.object({
  question: z.string().min(3).max(2000),
  profileId: z.string().uuid().nullable().optional(),
  answerFormat: z.enum(["full", "thirty_second", "bullets"]).optional(),
});

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOpenAIConfigured()) {
    return NextResponse.json({ error: "OpenAI is not configured" }, { status: 503 });
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  try {
    const result = await analyzeQuestion(supabase, {
      question: parsed.data.question,
      profileId: parsed.data.profileId ?? null,
      answerFormat: parsed.data.answerFormat,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
