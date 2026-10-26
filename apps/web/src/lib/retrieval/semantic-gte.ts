import type { SupabaseClient } from "@supabase/supabase-js";
import { boostSimilarity, type RetrievalMatch } from "@interview-copilot/shared";

export type SemanticSearchStatus = "ready" | "unavailable" | "error";

type MatchRow = {
  preparedQaId: string;
  similarity: number;
  questionVariant: string;
  variantType: string;
};

/**
 * Semantic search via Supabase Edge Function (gte-small) + pgvector RPC.
 * Uses the authenticated user's session — no service role on this path.
 */
export async function semanticSearchGte(
  supabase: SupabaseClient,
  question: string,
  profileId: string | null
): Promise<{ matches: RetrievalMatch[]; status: SemanticSearchStatus }> {
  const { data, error } = await supabase.functions.invoke("match-prepared-qa", {
    body: { question, profileId, matchCount: 10 },
  });

  if (error) {
    const msg = error.message ?? String(error);
    if (/not found|404|Function/i.test(msg)) {
      return { matches: [], status: "unavailable" };
    }
    console.warn("semanticSearchGte", msg);
    return { matches: [], status: "error" };
  }

  const payload = data as { matches?: MatchRow[]; error?: string } | null;
  if (payload?.error) {
    console.warn("match-prepared-qa", payload.error);
    return { matches: [], status: "error" };
  }

  const rows = payload?.matches ?? [];
  if (rows.length === 0) {
    return { matches: [], status: "unavailable" };
  }

  const ids = [...new Set(rows.map((r) => r.preparedQaId))];
  const { data: qaRows } = await supabase
    .from("prepared_qa")
    .select("id, question, answer, is_preferred, profile_id")
    .in("id", ids);

  const qaById = new Map((qaRows ?? []).map((r) => [r.id, r]));

  const matches: RetrievalMatch[] = [];
  for (const row of rows) {
    const qa = qaById.get(row.preparedQaId);
    if (!qa) continue;
    matches.push({
      id: row.preparedQaId,
      contentType: "prepared_qa",
      sourceId: row.preparedQaId,
      title: qa.question,
      content: `${qa.question}\n\n${qa.answer}`,
      similarity: boostSimilarity(row.similarity, {
        preferred: Boolean(qa.is_preferred),
        sameProfile: profileId != null && qa.profile_id === profileId,
      }),
      metadata: {
        variantType: row.variantType,
        matchedVariant: row.questionVariant,
      },
    });
  }

  matches.sort((a, b) => b.similarity - a.similarity);
  return { matches, status: "ready" };
}
