-- Interview Copilot initial schema
create extension if not exists vector with schema extensions;

-- Interview profiles (employer / role contexts)
create table public.interview_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  employer text,
  role_title text,
  job_description text,
  resume_text text,
  default_answer_format text not null default 'thirty_second'
    check (default_answer_format in ('full', 'thirty_second', 'bullets')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prepared_qa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  question text not null,
  answer text not null,
  category text,
  is_preferred boolean not null default false,
  is_authoritative boolean not null default true,
  follow_ups jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  title text not null,
  situation text,
  task text,
  action text,
  result text,
  metrics text,
  tags text[] default '{}',
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  filename text not null,
  mime_type text not null,
  doc_type text not null check (doc_type in ('prep', 'resume', 'job_description', 'other')),
  extracted_text text,
  storage_path text,
  created_at timestamptz not null default now()
);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.search_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  content_type text not null check (content_type in ('prepared_qa', 'experience_story', 'document_chunk')),
  source_id uuid not null,
  title text not null,
  content text not null,
  embedding extensions.vector(1536) not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, source_id)
);

create index search_embeddings_user_idx on public.search_embeddings (user_id);
create index search_embeddings_embedding_idx
  on public.search_embeddings
  using hnsw (embedding extensions.vector_cosine_ops);

create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.interview_profiles (id) on delete set null,
  title text,
  persist_transcripts boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  sequence_id bigint not null,
  text text not null,
  is_final boolean not null default true,
  is_question boolean not null default false,
  created_at timestamptz not null default now()
);

create index transcript_segments_session_seq on public.transcript_segments (session_id, sequence_id);

-- RLS
alter table public.interview_profiles enable row level security;
alter table public.prepared_qa enable row level security;
alter table public.experience_stories enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.search_embeddings enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.transcript_segments enable row level security;

create policy "profiles_own" on public.interview_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "qa_own" on public.prepared_qa for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "stories_own" on public.experience_stories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "docs_own" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "chunks_own" on public.document_chunks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "embeddings_own" on public.search_embeddings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_own" on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "segments_own" on public.transcript_segments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Semantic search RPC
create or replace function public.match_search_embeddings(
  query_embedding extensions.vector(1536),
  match_count int default 8,
  filter_profile_id uuid default null
)
returns table (
  id uuid,
  content_type text,
  source_id uuid,
  profile_id uuid,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    se.id,
    se.content_type,
    se.source_id,
    se.profile_id,
    se.title,
    se.content,
    se.metadata,
    1 - (se.embedding <=> query_embedding) as similarity
  from public.search_embeddings se
  where se.user_id = auth.uid()
    and (filter_profile_id is null or se.profile_id = filter_profile_id or se.profile_id is null)
  order by se.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_search_embeddings to authenticated;

-- Privileges for logged-in clients (RLS still enforces row ownership)
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on table public.interview_profiles to authenticated;
grant select, insert, update, delete on table public.prepared_qa to authenticated;
grant select, insert, update, delete on table public.experience_stories to authenticated;
grant select, insert, update, delete on table public.documents to authenticated;
grant select, insert, update, delete on table public.document_chunks to authenticated;
grant select, insert, update, delete on table public.search_embeddings to authenticated;
grant select, insert, update, delete on table public.interview_sessions to authenticated;
grant select, insert, update, delete on table public.transcript_segments to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
