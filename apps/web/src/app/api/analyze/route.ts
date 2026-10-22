import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { analyzeQuestionLocal } from "@/lib/retrieval/analyze-local";
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

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  try {
    const result = await analyzeQuestionLocal(supabase, {
      question: parsed.data.question,
      profileId: parsed.data.profileId ?? null,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    const hint = /follow_ups|column/i.test(message)
      ? " Run supabase/migrations/20251022190000_prepared_qa_follow_ups.sql in Supabase."
      : "";
    return NextResponse.json({ error: message + hint }, { status: 500 });
  }
}
