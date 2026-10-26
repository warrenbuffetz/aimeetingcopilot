import type { SupabaseClient } from "@supabase/supabase-js";
import type { RetrievalMatch } from "@interview-copilot/shared";
import { getSemanticProvider, isSemanticSearchEnabled } from "@/lib/env";
import { semanticSearch as semanticSearchOpenAI } from "@/lib/retrieval/analyze";
import { semanticSearchGte, type SemanticSearchStatus } from "@/lib/retrieval/semantic-gte";

export type { SemanticSearchStatus };

export async function semanticSearchPrepared(
  supabase: SupabaseClient,
  question: string,
  profileId: string | null
): Promise<{ matches: RetrievalMatch[]; status: SemanticSearchStatus | "lexical_only" }> {
  if (!isSemanticSearchEnabled()) {
    return { matches: [], status: "lexical_only" };
  }

  const provider = getSemanticProvider();
  if (provider === "openai_legacy") {
    try {
      const matches = await semanticSearchOpenAI(supabase, question, profileId);
      return { matches, status: matches.length > 0 ? "ready" : "unavailable" };
    } catch {
      return { matches: [], status: "error" };
    }
  }

  return semanticSearchGte(supabase, question, profileId);
}
