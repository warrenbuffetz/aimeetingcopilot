import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "../_shared/cors.ts";
import { embedTextsGte, GTE_DIMENSIONS, GTE_MODEL } from "../_shared/gte-embed.ts";

type Body = { texts?: string[] };

function isServiceRoleJwt(authHeader: string | null, serviceKey: string): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === serviceKey;
}

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

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization");
  const serviceCall = isServiceRoleJwt(authHeader, serviceKey);

  if (!serviceCall) {
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader ?? "" } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
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

  const texts = body.texts ?? [];
  if (!Array.isArray(texts) || texts.length === 0 || texts.length > 20) {
    return new Response(JSON.stringify({ error: "texts must be array of 1–20 strings" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const embeddings = await embedTextsGte(texts);
    return new Response(
      JSON.stringify({
        model: GTE_MODEL,
        dimensions: GTE_DIMENSIONS,
        embeddings,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Embedding failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
