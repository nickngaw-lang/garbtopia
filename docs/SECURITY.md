# Garbtopia — Security

## Secret Handling
- Supabase keys: service role key server-side only (never exposed to client)
- Anon key in client env (safe for public read/write under v1 permissive RLS)
- No secrets in frontend code or client bundles
- Image upload via Supabase Storage signed URLs (server-minted, short-lived)

## Permission Model (v1 → Lock-down)
- **v1 (demo-first):** All tables permissive read/write via RLS — anonymous users can browse, try costumes, upload photos, and save results. No login required.
- **Lock-down sprint:** 
  - costumes, costume_categories: read public, write owner-only
  - photos: read owner-only, write owner-only
  - changed_photos: read owner-only (or public flag), write owner-only
  - touchpoints: write anyone (anon allowed), read owner-only
  - `auth.uid() = user_id` enforced on all owner-scoped tables

## Approved-Tools Rule
- Agents and server logic use named functions only (log_touchpoint, compute_popularity, generate_overlay)
- Never expose raw SQL execution or generic "run_any" to the client
- All mutations go through lib/data/ layer functions

## Audit Principle
- Every meaningful action (save, delete, costume try) logged to touchpoints with actor, entity, timestamp
- Deletions log before_state for recovery
- Agent actions inherit the calling user's permissions — never elevated to service-role unless explicitly approved server-side