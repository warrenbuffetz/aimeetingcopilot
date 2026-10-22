-- Table privileges for Supabase API roles (RLS alone is not enough)
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

grant execute on function public.match_search_embeddings(extensions.vector, int, uuid) to authenticated;
