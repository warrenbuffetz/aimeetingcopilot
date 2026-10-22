-- Optional follow-up Q&A per prepared script (no API needed to match)
alter table public.prepared_qa
  add column if not exists follow_ups jsonb not null default '[]'::jsonb;

comment on column public.prepared_qa.follow_ups is
  'Array of { "question": string, "answer": string } for likely follow-ups to the parent question.';
