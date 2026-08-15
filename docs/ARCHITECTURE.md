# Garbtopia — Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) + TailwindCSS
- **Database/Storage:** Supabase (Postgres + Storage for images)
- **Hosting:** Vercel
- **Image processing:** Server-side overlay compositing (Sharp for v1 static overlay)

## Build Sequencing
- **Now (v1):** Catalog browse → photo upload → costume overlay → save → gallery. Static frontal overlay only.
- **Next:** AI-assisted segmentation for better fit, user accounts with saved galleries, touchpoint analytics dashboard.
- **Later:** Social sharing, costume contributor uploads, recommendation engine based on touchpoints.

## Key User Action Flow
1. User opens home → sees costume catalog grid (seeded demo data)
2. User picks a demo photo or uploads one
3. User clicks a costume card → overlay composited server-side → result image shown
4. User saves → ChangedPhoto row created, Touchpoint logged
5. Saved result appears in gallery, viewable by anyone

## Responsive Nav Shell
Left sidebar on desktop (Costumes, My Gallery, About); collapses to hamburger on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** (`lib/data/`) — all Supabase queries and mutations; single source of truth for CRUD.
2. **App logic** (`lib/costume/`, `lib/photo/`) — overlay compositing, category filtering, touchpoint logging.
3. **Smart features** (`lib/ai/`) — later: segmentation, auto-tagging, recommendations. Core works without this.

## Why Core Runs Without AI
v1 overlay is a static image composite — costume PNG positioned over photo. No model inference needed. AI added later for better fit and recommendations.

## Repo Structure
```
features/
  costumes/        (catalog UI + data)
  photo/           (upload + compositing)
  gallery/         (saved results)
  touchpoints/     (logging service)
  auth/            (registration/login — later sprint)
lib/
  data/            (all DB access)
  costume/         (overlay logic)
  ai/              (future: segmentation, tagging)
  utils/
__tests__/         (beside features)
```

## Module Map
| Module | Responsibility | Data Owned | Build Order |
|--------|---------------|------------|-------------|
| costumes | Catalog browse, filter by category | costumes, costume_categories | 1st |
| photo | Upload, compositing, save result | photos, changed_photos | 2nd |
| gallery | Display saved changed photos | changed_photos | 3rd |
| touchpoints | Log every interaction | touchpoints | 4th |
| auth | Email registration/login, owner scoping | users | 5th (lock-down sprint) |
