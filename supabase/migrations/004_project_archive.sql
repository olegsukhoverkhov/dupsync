-- Soft-archive support for projects.
-- archived_at = NULL → active project (shown on dashboard)
-- archived_at = timestamp → archived project (shown on Archive tab)

alter table projects
  add column if not exists archived_at timestamptz;

-- Index makes filtering active/archived fast
create index if not exists projects_user_archived_idx
  on projects (user_id, archived_at);
