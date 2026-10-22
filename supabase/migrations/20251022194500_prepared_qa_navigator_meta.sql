-- Optional structured navigator fields (inference still works when empty).
alter table public.prepared_qa
  add column if not exists navigator_meta jsonb not null default '{}'::jsonb;

comment on column public.prepared_qa.navigator_meta is
  'Experience module, intent, evidence, seedKey, part — populated by seed or import scripts.';
