# Garbtopia — Tasks

## Sprint 1: Catalog + Compositing Engine (v1 core)
**Goal:** A visitor can browse costumes, pick a demo photo, apply a costume, and see the result — no login.
- [ ] Create DB schema + seed costumes/categories/demo photos
- [ ] Build `lib/data/` access layer for all tables
- [ ] Costume catalog page with category filter sidebar
- [ ] Demo photo picker (3 seeded frontal photos)
- [ ] Server-side overlay compositing (Sharp: place costume PNG on photo per overlay_config)
- [ ] Result view page showing composited image
- [ ] Touchpoint logging on costume_try
- **DoD:** Visitor clicks a costume → overlay appears on demo photo → result_url stored in changed_photos → visible on result page.

## Sprint 2: Save + Gallery + Upload (v1 complete)
**Goal:** Full save flow, user photo upload, gallery, touchpoints on all actions.
- [ ] Photo upload to Supabase Storage (frontal validation: aspect ratio check)
- [ ] Save changed photo → result_url persisted → appears in gallery
- [ ] Gallery page: grid of saved changed photos
- [ ] Touchpoint logging on save, page_view
- [ ] Delete changed photo (user-triggered, confirm dialog)
- [ ] Empty/loading/error states for all pages
- **DoD:** Upload a photo → apply costume → save → see in gallery → delete it. Full cycle works. ← **v1 FUNCTIONAL milestone**

## Sprint 3: Popularity Ranking + Polish
**Goal:** Catalog sorted by popularity, UI polish, touchpoint analytics basics.
- [ ] SQL view for costume popularity (count costume_try last 7 days)
- [ ] Home page sorted by popularity score
- [ ] "Trending" badge on top 3 costumes
- [ ] Loading skeletons, error boundaries, empty states refined
- [ ] Mobile responsive pass (hamburger nav)
- **DoD:** Home page shows costumes ranked by try-count; trending badges visible; mobile nav works.

## Sprint 4: Lock It Down (Auth + RLS)
**Goal:** Email registration, per-user data isolation, replace permissive RLS.
- [ ] Email signup/login (Supabase Auth)
- [ ] Set user_id on all writes
- [ ] Replace v1 permissive policies with owner-scoped RLS
- [ ] Anonymous users can still browse catalog (public read on costumes)
- [ ] Saved photos scoped to logged-in user
- **DoD:** New user registers → saves a changed photo → logs out → cannot see others' photos. Anon can still browse.

## Sprint 5: Share + Growth (later)
- [ ] Share link generation for saved changed photos
- [ ] Public gallery toggle per changed photo
- [ ] Touchpoint analytics dashboard (simple)
- [ ] Costume contribution pipeline (future)

---

## Gantt
```
Sprint 1: Catalog + Compositing      ████████
Sprint 2: Save + Gallery + Upload    ████████  ← v1 functional
Sprint 3: Popularity + Polish        ████████
Sprint 4: Lock It Down (Auth + RLS)  ████████
Sprint 5: Share + Growth (later)     ░░░░░░░░
```