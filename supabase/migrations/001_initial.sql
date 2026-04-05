-- DupSync Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Plans enum
create type plan_type as enum ('free', 'starter', 'pro', 'enterprise');

-- Project status enum
create type project_status as enum (
  'uploading', 'transcribing', 'ready', 'dubbing', 'done', 'error'
);

-- Dub status enum
create type dub_status as enum (
  'pending', 'translating', 'generating_voice', 'lip_syncing', 'merging', 'done', 'error'
);

-- Transaction type enum
create type transaction_type as enum ('subscription', 'addon', 'usage');

-- Profiles table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan plan_type not null default 'free',
  credits_remaining integer not null default 5, -- minutes
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  status project_status not null default 'uploading',
  original_video_url text,
  original_language text default 'auto',
  transcript jsonb, -- [{start, end, text}]
  duration_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Dubs table
create table dubs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  target_language text not null,
  status dub_status not null default 'pending',
  translated_transcript jsonb,
  dubbed_video_url text,
  progress integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Transactions table
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type transaction_type not null,
  amount integer not null default 0, -- cents
  credits integer not null default 0, -- minutes
  description text,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_projects_user_id on projects(user_id);
create index idx_projects_status on projects(status);
create index idx_dubs_project_id on dubs(project_id);
create index idx_dubs_status on dubs(status);
create index idx_transactions_user_id on transactions(user_id);

-- RLS Policies
alter table profiles enable row level security;
alter table projects enable row level security;
alter table dubs enable row level security;
alter table transactions enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Projects: users can CRUD their own projects
create policy "Users can view own projects"
  on projects for select using (auth.uid() = user_id);

create policy "Users can create projects"
  on projects for insert with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete using (auth.uid() = user_id);

-- Dubs: users can view/create dubs for their projects
create policy "Users can view dubs for own projects"
  on dubs for select using (
    exists (select 1 from projects where projects.id = dubs.project_id and projects.user_id = auth.uid())
  );

create policy "Users can create dubs for own projects"
  on dubs for insert with check (
    exists (select 1 from projects where projects.id = dubs.project_id and projects.user_id = auth.uid())
  );

-- Transactions: users can view their own transactions
create policy "Users can view own transactions"
  on transactions for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

create trigger dubs_updated_at before update on dubs
  for each row execute function update_updated_at();

-- Storage bucket for videos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', false);

-- Storage policies
create policy "Users can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own videos"
  on storage.objects for select
  using (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own videos"
  on storage.objects for delete
  using (bucket_id = 'videos' and auth.uid()::text = (storage.foldername(name))[1]);
