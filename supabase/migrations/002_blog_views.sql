-- Blog article view counter (unique visitors only)
-- Each article has a single row with a count of unique visitors

create table if not exists blog_views (
  slug text primary key,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Allow public read access (anyone can see view counts)
alter table blog_views enable row level security;

create policy "Anyone can read blog views"
  on blog_views for select
  using (true);

-- Atomic increment function — only callable via service role
-- (called from API route which validates uniqueness via localStorage flag)
create or replace function increment_blog_view(article_slug text)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  insert into blog_views (slug, count)
  values (article_slug, 1)
  on conflict (slug) do update
    set count = blog_views.count + 1,
        updated_at = now()
  returning count into new_count;
  return new_count;
end;
$$;
