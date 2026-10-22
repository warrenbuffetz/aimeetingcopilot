import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { upsertStoryEmbedding } from "@/lib/embeddings";
import { isOpenAIConfigured } from "@/lib/env";
import { sanitizeUserContent } from "@/lib/sanitize";

const schema = z.object({
  profileId: z.string().uuid().nullable().optional(),
  title: z.string().min(2).max(200),
  situation: z.string().max(5000).optional(),
  task: z.string().max(5000).optional(),
  action: z.string().max(5000).optional(),
  result: z.string().max(5000).optional(),
  metrics: z.string().max(2000).optional(),
  company: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience_stories")
    .insert({
      user_id: user.id,
      profile_id: parsed.data.profileId ?? null,
      title: sanitizeUserContent(parsed.data.title, 200),
      situation: parsed.data.situation ? sanitizeUserContent(parsed.data.situation) : null,
      task: parsed.data.task ? sanitizeUserContent(parsed.data.task) : null,
      action: parsed.data.action ? sanitizeUserContent(parsed.data.action) : null,
      result: parsed.data.result ? sanitizeUserContent(parsed.data.result) : null,
      metrics: parsed.data.metrics ? sanitizeUserContent(parsed.data.metrics) : null,
      company: parsed.data.company ?? null,
      tags: parsed.data.tags ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (isOpenAIConfigured()) {
    try {
      await upsertStoryEmbedding(supabase, data);
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.json(data);
}
