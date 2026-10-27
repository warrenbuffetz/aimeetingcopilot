import type { SupabaseClient } from "@supabase/supabase-js";
import {
  enrichLibrary,
  isRetrievalExcluded,
  lexicalRowsFromEnriched,
  type EnrichedQaRow,
  type LexicalQaRow,
  type PersistedNavigatorMeta,
  type PreparedFollowUp,
} from "@interview-copilot/shared";

const LIBRARY_CACHE_TTL_MS = 60_000;

type CachedPreparedLibrary = {
  at: number;
  enriched: EnrichedQaRow[];
  library: LexicalQaRow[];
  dbFollowUpsById: Map<string, PreparedFollowUp[]>;
};

const libraryByProfileKey = new Map<string, CachedPreparedLibrary>();

function cacheKey(profileId: string | null): string {
  return profileId ?? "__all__";
}

function parseFollowUps(raw: unknown): PreparedFollowUp[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x === "object")
    .map((x) => {
      const o = x as { question?: string; answer?: string };
      return {
        question: String(o.question ?? "").trim(),
        answer: String(o.answer ?? "").trim(),
      };
    })
    .filter((x) => x.question.length >= 3 && x.answer.length >= 1);
}

async function fetchPreparedRows(
  supabase: SupabaseClient,
  profileId: string | null
): Promise<
  Array<{
    id: string;
    question: string;
    answer: string;
    is_preferred: boolean | null;
    category: string | null;
    follow_ups: unknown;
    navigator_meta: unknown;
  }>
> {
  const baseCols = "id, question, answer, is_preferred, category";
  const colsWithMeta = `${baseCols}, follow_ups, navigator_meta`;

  let query = supabase.from("prepared_qa").select(colsWithMeta);
  if (profileId) {
    query = query.eq("profile_id", profileId);
  }
  let { data: rows, error } = await query;

  if (error && /follow_ups|navigator_meta/i.test(error.message)) {
    let fallback = supabase.from("prepared_qa").select(baseCols);
    if (profileId) {
      fallback = fallback.eq("profile_id", profileId);
    }
    const res = await fallback;
    rows =
      res.data?.map((r) => ({ ...r, follow_ups: [], navigator_meta: {} })) ?? null;
    error = res.error;
  }

  if (error) throw error;
  return (rows ?? []) as Array<{
    id: string;
    question: string;
    answer: string;
    is_preferred: boolean | null;
    category: string | null;
    follow_ups: unknown;
    navigator_meta: unknown;
  }>;
}

function buildLibraryFromRows(
  allRows: Awaited<ReturnType<typeof fetchPreparedRows>>
): CachedPreparedLibrary {
  const activeRows = allRows.filter((r) => {
    const meta = (r.navigator_meta ?? {}) as PersistedNavigatorMeta;
    const enriched = enrichLibrary([
      {
        id: r.id,
        question: r.question,
        answer: r.answer,
        navigatorMeta: meta,
      },
    ])[0];
    return !isRetrievalExcluded(enriched.navigator);
  });

  const enriched = enrichLibrary(
    activeRows.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      isPreferred: r.is_preferred ?? undefined,
      followUps: parseFollowUps(r.follow_ups),
      category: r.category,
      navigatorMeta: (r.navigator_meta ?? {}) as PersistedNavigatorMeta,
    }))
  );

  const dbFollowUpsById = new Map(
    activeRows.map((r) => [r.id, parseFollowUps(r.follow_ups)])
  );
  const library: LexicalQaRow[] = lexicalRowsFromEnriched(enriched, dbFollowUpsById);

  return {
    at: Date.now(),
    enriched,
    library,
    dbFollowUpsById,
  };
}

/** In-process cache of enriched library per profile (short TTL). */
export async function getPreparedLibraryForAnalyze(
  supabase: SupabaseClient,
  profileId: string | null,
  opts?: { forceRefresh?: boolean }
): Promise<CachedPreparedLibrary> {
  const key = cacheKey(profileId);
  const hit = libraryByProfileKey.get(key);
  if (!opts?.forceRefresh && hit && Date.now() - hit.at < LIBRARY_CACHE_TTL_MS) {
    return hit;
  }

  const rows = await fetchPreparedRows(supabase, profileId);
  const built = buildLibraryFromRows(rows);
  libraryByProfileKey.set(key, built);
  return built;
}

export function invalidatePreparedLibraryCache(profileId?: string | null): void {
  if (profileId === undefined) {
    libraryByProfileKey.clear();
    return;
  }
  libraryByProfileKey.delete(cacheKey(profileId));
}
