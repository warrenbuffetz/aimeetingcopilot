-- gte-small (384-dim) embeddings for prepared Q&A semantic search.
-- Keeps legacy search_embeddings (1536 / OpenAI) intact for backwards compatibility.

create table if not exists public.prepared_qa_embeddings (
  id uuid primary key default gen_random_uuid(),
  prepared_qa_id uuid not null references public.prepared_qa (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  question_variant text not null,
  variant_type text not null check (
    variant_type in ('canonical', 'alt_phrasing', 'short_descriptor', 'follow_up')
  ),
  embedding extensions.vector(384) not null,
  embedding_model text not null default 'gte-small',
  embedding_version text not null default '1',
  source_text_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (prepared_qa_id, question_variant, embedding_model, embedding_version)
);

create index if not exists prepared_qa_embeddings_qa_idx
  on public.prepared_qa_embeddings (prepared_qa_id);

create index if not exists prepared_qa_embeddings_profile_idx
  on public.prepared_qa_embeddings (profile_id);

-- Exact search is sufficient at library scale (~few hundred rows per user).
-- No HNSW index unless corpus grows materially.

alter table public.prepared_qa_embeddings enable row level security;

create policy "prepared_qa_embeddings_own"
  on public.prepared_qa_embeddings
  for all
  using (
    exists (
      select 1
      from public.prepared_qa pq
      where pq.id = prepared_qa_id
        and pq.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.prepared_qa pq
      where pq.id = prepared_qa_id
        and pq.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on table public.prepared_qa_embeddings to authenticated;
grant all on table public.prepared_qa_embeddings to service_role;

create or replace function public.match_prepared_qa_embeddings(
  query_embedding extensions.vector(384),
  match_count int default 10,
  filter_profile_id uuid default null
)
returns table (
  prepared_qa_id uuid,
  question_variant text,
  variant_type text,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    e.prepared_qa_id,
    e.question_variant,
    e.variant_type,
    (1 - (e.embedding <=> query_embedding))::float as similarity
  from public.prepared_qa_embeddings e
  inner join public.prepared_qa pq on pq.id = e.prepared_qa_id
  where pq.user_id = auth.uid()
    and (
      filter_profile_id is null
      or pq.profile_id = filter_profile_id
      or pq.profile_id is null
    )
  order by e.embedding <=> query_embedding
  limit greatest(1, least(match_count, 25));
$$;

grant execute on function public.match_prepared_qa_embeddings(extensions.vector, int, uuid) to authenticated;

comment on table public.prepared_qa_embeddings is
  '384-dim gte-small vectors for prepared Q&A retrieval; variants dedupe to canonical prepared_qa_id.';
