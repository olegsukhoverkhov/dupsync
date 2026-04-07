-- Fix credits_remaining defaults and reset existing test users.
--
-- BEFORE: column default was 1500 (legacy), so every new signup got 1500
-- credits regardless of plan. Existing users had 192 (Starter), 1500 (Free)
-- which made the dashboard, credits page, and settings display nonsense.
--
-- AFTER: default is 1 (matches Free plan, which gets 1 free credit).
-- New paid signups have credits set explicitly by the Stripe webhook.

-- 1. Change column default
alter table profiles
  alter column credits_remaining set default 1;

-- 2. Reset existing users to their plan's max credits.
-- This is acceptable because we're still in test mode — no real users
-- have meaningful usage history we'd lose.
update profiles set credits_remaining = 1   where plan = 'free';
update profiles set credits_remaining = 20  where plan = 'starter';
update profiles set credits_remaining = 50  where plan = 'pro';
update profiles set credits_remaining = 150 where plan = 'enterprise';

-- 3. Update the new-user trigger so future signups get the Free plan's
-- 1 credit explicitly (not relying on the column default).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, plan, credits_remaining)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email', ''),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'free',
    1
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
