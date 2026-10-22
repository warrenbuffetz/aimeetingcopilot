import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { upsertPreparedQaEmbedding } from "@/lib/embeddings";
import { isOpenAIConfigured } from "@/lib/env";
import { sanitizeUserContent } from "@/lib/sanitize";

const createSchema = z.object({
  profileId: z.string().uuid().nullable().optional(),
  question: z.string().min(3).max(2000),
  answer: z.string().min(1).max(20000),
  category: z.string().max(100).optional(),
  isPreferred: z.boolean().optional(),
  isAuthoritative: z.boolean().optional(),
});

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prepared_qa")
    .insert({
      user_id: user.id,
      profile_id: parsed.data.profileId ?? null,
      question: sanitizeUserContent(parsed.data.question, 2000),
      answer: sanitizeUserContent(parsed.data.answer, 20000),
      category: parsed.data.category ?? null,
      is_preferred: parsed.data.isPreferred ?? false,
      is_authoritative: parsed.data.isAuthoritative ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (isOpenAIConfigured()) {
    try {
      await upsertPreparedQaEmbedding(supabase, data);
    } catch (e) {
      console.error("Embedding failed", e);
    }
  }

  return NextResponse.json(data);
}
