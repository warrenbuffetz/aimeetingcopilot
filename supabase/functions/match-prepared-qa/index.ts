import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "../_shared/cors.ts";
import { embedTextsGte, GTE_MODEL } from "../_shared/gte-embed.ts";

type Body = {
  question?: string;
  profileId?: string | null;
  matchCount?: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabase = createClient(url, anon, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const question = (body.question ?? "").trim();
  if (question.length < 3 || question.length > 2000) {
    return new Response(JSON.stringify({ error: "question must be 3–2000 characters" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const profileId = body.profileId ?? null;
  if (profileId) {
    const { data: profile, error: profileError } = await supabase
      .from("interview_profiles")
      .select("id")
      .eq("id", profileId)
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found or forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const matchCount = Math.min(25, Math.max(1, body.matchCount ?? 10));

  try {
    const [queryEmbedding] = await embedTextsGte([question]);
    const { data, error } = await supabase.rpc("match_prepared_qa_embeddings", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      filter_profile_id: profileId,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = (data ?? []) as {
      prepared_qa_id: string;
      question_variant: string;
      variant_type: string;
      similarity: number;
    }[];

    const byQa = new Map<
      string,
      { preparedQaId: string; similarity: number; questionVariant: string; variantType: string }
    >();
    for (const row of rows) {
      const prev = byQa.get(row.prepared_qa_id);
      if (!prev || row.similarity > prev.similarity) {
        byQa.set(row.prepared_qa_id, {
          preparedQaId: row.prepared_qa_id,
          similarity: row.similarity,
          questionVariant: row.question_variant,
          variantType: row.variant_type,
        });
      }
    }

    const matches = [...byQa.values()].sort((a, b) => b.similarity - a.similarity).slice(0, matchCount);

    return new Response(
      JSON.stringify({
        model: GTE_MODEL,
        matches,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Match failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
