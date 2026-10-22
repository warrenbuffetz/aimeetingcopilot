import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { deleteEmbedding, upsertPreparedQaEmbedding } from "@/lib/embeddings";
import { isOpenAIConfigured } from "@/lib/env";
import { sanitizeUserContent } from "@/lib/sanitize";

const patchSchema = z.object({
  profileId: z.string().uuid().nullable().optional(),
  question: z.string().min(3).max(2000).optional(),
  answer: z.string().min(1).max(20000).optional(),
  category: z.string().max(100).nullable().optional(),
  isPreferred: z.boolean().optional(),
  isAuthoritative: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.profileId !== undefined) updates.profile_id = parsed.data.profileId;
  if (parsed.data.question) updates.question = sanitizeUserContent(parsed.data.question, 2000);
  if (parsed.data.answer) updates.answer = sanitizeUserContent(parsed.data.answer, 20000);
  if (parsed.data.category !== undefined) updates.category = parsed.data.category;
  if (parsed.data.isPreferred !== undefined) updates.is_preferred = parsed.data.isPreferred;
  if (parsed.data.isAuthoritative !== undefined) updates.is_authoritative = parsed.data.isAuthoritative;

  const supabase = await createClient();
  const { data, error } = await supabase.from("prepared_qa").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (isOpenAIConfigured()) {
    try {
      await upsertPreparedQaEmbedding(supabase, data);
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("prepared_qa").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await deleteEmbedding(supabase, "prepared_qa", id);
  return NextResponse.json({ ok: true });
}
