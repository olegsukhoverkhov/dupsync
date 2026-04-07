-- Marker so the Vercel Cron retry job doesn't re-attempt the same dub
-- forever. Once the cron tries to retry a failed lip sync, this column
-- gets stamped so future cron runs skip it.

alter table dubs
  add column if not exists cron_retried_at timestamptz;

-- Partial index for the cron query: status='done' + has lip sync error
-- + cron hasn't retried yet. Keeps the cron query fast even as the
-- dubs table grows.
create index if not exists dubs_cron_retry_idx
  on dubs (updated_at)
  where status = 'done' and cron_retried_at is null;
