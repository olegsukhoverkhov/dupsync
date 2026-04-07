-- Track fal.ai async lip sync jobs so the webhook handler can correlate
-- the incoming callback to the right dub and know which model was used
-- (to decide whether to retry the fallback model on failure).

alter table dubs
  add column if not exists fal_request_id text,
  add column if not exists fal_model text,
  add column if not exists fal_attempt smallint not null default 0;

-- Index for fast webhook lookup
create index if not exists dubs_fal_request_id_idx on dubs (fal_request_id);
