# Garbtopia

Browse traditional cultural costumes, overlay them on a photo, and save the result — no
photo-editing skills required.

## How it works

1. Browse the catalog (filter by category, ranked by trending try-count)
2. Pick a demo photo or upload your own frontal photo
3. Try a costume — server-side compositing (Sharp) overlays it on the photo
4. Save the result — it shows up in your gallery
5. Delete anything you no longer want

No login required for any of this (v1 is demo-first — see `docs/PRD.md`).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript strict |
| Styles | Tailwind CSS v4 (CSS-first, no config file) |
| Auth + DB | Supabase (`@supabase/ssr`) |
| Image compositing | Sharp (server-side static overlay) |
| Deploy | Vercel |

## Project docs

The full plan — data model, architecture, sprints, test plan — lives in `/docs`. Read
`docs/PRD.md` and `docs/TASKS.md` first.

## Local dev

```bash
npm install
vercel env pull .env.local   # pulls NEXT_PUBLIC_SUPABASE_URL / ANON_KEY from Vercel
npm run dev
```

Open http://localhost:3000.

## Database

Schema + migrations live in `supabase/migrations/`, applied in order:

- `0001_init.sql` — core tables (costumes, categories, photos, changed_photos, touchpoints) + seed data
- `0002_seed_assets.sql` — points seed rows at the real static art in `/public` and tunes overlay placement
- `0003_storage_and_saved.sql` — `saved` flag + Storage buckets for uploads/results
- `0004_popularity.sql` — `costume_popularity` view for trending ranking

To change the schema, add a new numbered migration — never edit an already-applied one.
