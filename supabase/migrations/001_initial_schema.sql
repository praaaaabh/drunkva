-- Drunkva Phase 2 MVP schema
-- Run this in the Supabase SQL editor or with `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  username text not null unique,
  city text,
  default_currency text not null default 'USD',
  default_privacy text not null default 'private' check (default_privacy in ('private', 'friends', 'public')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  city text,
  neighborhood text,
  address text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  title text not null,
  activity_date date not null default current_date,
  privacy text not null default 'private' check (privacy in ('private', 'friends', 'public')),
  total_spend numeric(10, 2),
  currency text not null default 'USD',
  notes text,
  hangover_rating int check (hangover_rating between 0 and 10),
  mood_rating int check (mood_rating between 0 and 10),
  sleep_hours numeric(4, 2) check (sleep_hours >= 0 and sleep_hours <= 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_drinks (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  drink_name text not null,
  category text,
  quantity int not null default 1 check (quantity > 0),
  estimated_cost numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_no_self check (requester_id <> addressee_id),
  constraint friendships_unique_pair unique (requester_id, addressee_id)
);

create table if not exists public.activity_friends (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint activity_friends_unique unique (activity_id, friend_id)
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null check (reaction in ('cheers', 'nice', 'hydrate', 'safe_home')),
  created_at timestamptz not null default now(),
  constraint reactions_unique unique (activity_id, user_id, reaction)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null default 'wellness',
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  constraint user_badges_unique unique (user_id, badge_id)
);

create table if not exists public.safety_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid references public.activities(id) on delete set null,
  event_type text not null check (event_type in ('hydration_reminder', 'budget_check', 'ride_home', 'next_day_checkin', 'wellness_note')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists set_venues_updated_at on public.venues;
create trigger set_venues_updated_at before update on public.venues for each row execute function public.set_updated_at();

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at before update on public.activities for each row execute function public.set_updated_at();

drop trigger if exists set_activity_drinks_updated_at on public.activity_drinks;
create trigger set_activity_drinks_updated_at before update on public.activity_drinks for each row execute function public.set_updated_at();

drop trigger if exists set_friendships_updated_at on public.friendships;
create trigger set_friendships_updated_at before update on public.friendships for each row execute function public.set_updated_at();

drop trigger if exists set_safety_events_updated_at on public.safety_events;
create trigger set_safety_events_updated_at before update on public.safety_events for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    username,
    city,
    default_currency,
    default_privacy
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'New Drunkva User'),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || replace(new.id::text, '-', '')),
    new.raw_user_meta_data->>'city',
    coalesce(new.raw_user_meta_data->>'default_currency', 'USD'),
    coalesce(new.raw_user_meta_data->>'default_privacy', 'private')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    username = excluded.username,
    city = excluded.city,
    default_currency = excluded.default_currency,
    default_privacy = excluded.default_privacy,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.activities enable row level security;
alter table public.activity_drinks enable row level security;
alter table public.friendships enable row level security;
alter table public.activity_friends enable row level security;
alter table public.reactions enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.safety_events enable row level security;

create policy "Profiles are visible to their owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles are created by their owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles are updated by their owner" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Venues are visible to their owner" on public.venues for select using (auth.uid() = owner_id);
create policy "Venues are managed by their owner" on public.venues for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Activities are visible to their owner" on public.activities for select using (auth.uid() = owner_id);
create policy "Activities are managed by their owner" on public.activities for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Activity drinks are visible to their owner" on public.activity_drinks for select using (auth.uid() = owner_id);
create policy "Activity drinks are managed by their owner" on public.activity_drinks for all using (
  auth.uid() = owner_id
  and exists (select 1 from public.activities where activities.id = activity_drinks.activity_id and activities.owner_id = auth.uid())
) with check (
  auth.uid() = owner_id
  and exists (select 1 from public.activities where activities.id = activity_drinks.activity_id and activities.owner_id = auth.uid())
);

create policy "Friendships are visible to participants" on public.friendships for select using (auth.uid() in (requester_id, addressee_id));
create policy "Users can request friendships" on public.friendships for insert with check (auth.uid() = requester_id);
create policy "Friendship participants can update status" on public.friendships for update using (auth.uid() in (requester_id, addressee_id)) with check (auth.uid() in (requester_id, addressee_id));
create policy "Friendship participants can delete" on public.friendships for delete using (auth.uid() in (requester_id, addressee_id));

create policy "Activity friends are visible to activity owner or tagged friend" on public.activity_friends for select using (
  auth.uid() = friend_id
  or exists (select 1 from public.activities where activities.id = activity_friends.activity_id and activities.owner_id = auth.uid())
);
create policy "Activity friends are managed by activity owner" on public.activity_friends for all using (
  exists (select 1 from public.activities where activities.id = activity_friends.activity_id and activities.owner_id = auth.uid())
) with check (
  exists (select 1 from public.activities where activities.id = activity_friends.activity_id and activities.owner_id = auth.uid())
);

create policy "Reactions are visible to activity owner and reactor" on public.reactions for select using (
  auth.uid() = user_id
  or exists (select 1 from public.activities where activities.id = reactions.activity_id and activities.owner_id = auth.uid())
);
create policy "Users manage their own reactions" on public.reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Badges are visible to authenticated users" on public.badges for select using (auth.role() = 'authenticated');
create policy "User badges are visible to their owner" on public.user_badges for select using (auth.uid() = user_id);
create policy "User badges are managed by their owner" on public.user_badges for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Safety events are visible to their owner" on public.safety_events for select using (auth.uid() = user_id);
create policy "Safety events are managed by their owner" on public.safety_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.badges (slug, name, description, category)
values
  ('hydration-helper', 'Hydration Helper', 'Logged hydration or wellness reminders for a night out.', 'wellness'),
  ('budget-aware', 'Budget Aware', 'Tracked spend to better understand personal patterns.', 'spend'),
  ('safe-ride', 'Safe Ride', 'Recorded a ride-home or safety plan.', 'safety')
on conflict (slug) do nothing;
