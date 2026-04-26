# Drunkva

Initial MVP for Drunkva, a playful but responsible social night-out tracker.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres

## Run locally

```bash
npm install
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in these values from Supabase Project Settings > API:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the schema in `supabase/migrations/001_initial_schema.sql`.

You can paste the SQL into the Supabase SQL editor, or use the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

The schema creates `profiles` instead of `users` because Supabase Auth already owns `auth.users`. A database trigger creates the matching `profiles` row during signup from the metadata submitted by the signup form.

## Auth behavior

- `/login` signs in with Supabase Auth.
- `/signup` creates a Supabase Auth user and sends profile metadata for `full_name`, `username`, `city`, `default_currency`, and `default_privacy`.
- `/feed`, `/create`, `/stats`, `/profile`, and `/settings` are protected.
- Logout is available in the app navbar.
- Activity creation remains mock-only until Phase 3.

## Build

```bash
npm run build
```
