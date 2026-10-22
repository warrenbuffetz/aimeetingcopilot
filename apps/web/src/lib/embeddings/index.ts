import type { SupabaseClient } from "@supabase/supabase-js";
import { embedText } from "@/lib/openai";
import { sanitizeUserContent } from "@/lib/sanitize";

export async function upsertPreparedQaEmbedding(
  supabase: SupabaseClient,
  row: {
    id: string;
    user_id: string;
    profile_id: string | null;
    question: string;
    answer: string;
    is_preferred: boolean;
    category: string | null;
  }
) {
  const content = sanitizeUserContent(`${row.question}\n\n${row.answer}`);
  const embedding = await embedText(content);
  const { error } = await supabase.from("search_embeddings").upsert(
    {
      user_id: row.user_id,
      profile_id: row.profile_id,
      content_type: "prepared_qa",
      source_id: row.id,
      title: row.question,
      content,
      embedding,
      metadata: {
        is_preferred: row.is_preferred,
        category: row.category,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,content_type,source_id" }
  );
  if (error) throw error;
}

export async function upsertStoryEmbedding(
  supabase: SupabaseClient,
  row: {
    id: string;
    user_id: string;
    profile_id: string | null;
    title: string;
    situation: string | null;
    task: string | null;
    action: string | null;
    result: string | null;
    metrics: string | null;
    company: string | null;
    tags: string[] | null;
  }
) {
  const parts = [row.title, row.situation, row.task, row.action, row.result, row.metrics, row.company]
    .filter(Boolean)
    .join("\n");
  const content = sanitizeUserContent(parts);
  const embedding = await embedText(content);
  const { error } = await supabase.from("search_embeddings").upsert(
    {
      user_id: row.user_id,
      profile_id: row.profile_id,
      content_type: "experience_story",
      source_id: row.id,
      title: row.title,
      content,
      embedding,
      metadata: { tags: row.tags, company: row.company },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,content_type,source_id" }
  );
  if (error) throw error;
}

export async function upsertChunkEmbedding(
  supabase: SupabaseClient,
  row: {
    id: string;
    user_id: string;
    document_id: string;
    profile_id: string | null;
    title: string;
    content: string;
  }
) {
  const content = sanitizeUserContent(row.content);
  const embedding = await embedText(content);
  const { error } = await supabase.from("search_embeddings").upsert(
    {
      user_id: row.user_id,
      profile_id: row.profile_id,
      content_type: "document_chunk",
      source_id: row.id,
      title: row.title,
      content,
      embedding,
      metadata: { document_id: row.document_id },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,content_type,source_id" }
  );
  if (error) throw error;
}

export async function deleteEmbedding(
  supabase: SupabaseClient,
  contentType: string,
  sourceId: string
) {
  await supabase
    .from("search_embeddings")
    .delete()
    .eq("content_type", contentType)
    .eq("source_id", sourceId);
}
