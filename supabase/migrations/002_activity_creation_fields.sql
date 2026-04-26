-- Drunkva Phase 3 activity creation fields.

alter table public.activities
add column if not exists total_drinks int not null default 0 check (total_drinks >= 0),
add column if not exists mood_before int check (mood_before between 0 and 10),
add column if not exists mood_after int check (mood_after between 0 and 10);

alter table public.activity_drinks
add column if not exists drink_type text,
add column if not exists unit_price numeric(10, 2),
add column if not exists total_price numeric(10, 2),
add column if not exists is_alcoholic boolean not null default true;
