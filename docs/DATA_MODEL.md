# Garbtopia — Data Model

## costumes
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| name | text | e.g. "Kimono" |
| culture | text | e.g. "Japanese" |
| region | text | e.g. "East Asia" |
| category_id | uuid FK → costume_categories | |
| image_url | text | frontal costume PNG (transparent bg) |
| overlay_config | jsonb | x/y/scale/rotation for static placement |
| tags | text[] | e.g. ["ceremonial", "silk"] |
| user_id | uuid nullable | owner (future) |
| created_at | timestamptz | |

**RLS:** v1 permissive read/write (demo-first). Lock-down: owner-scoped writes.

## costume_categories
| Field | Type |
|-------|------|
| id | uuid PK |
| name | text | e.g. "Asian", "African" |
| display_order | int |
| user_id | uuid nullable |
| created_at | timestamptz |

## photos
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| image_url | text | uploaded frontal photo |
| is_demo | boolean | seeded demo photos |
| user_id | uuid nullable | |
| created_at | timestamptz | |

## changed_photos
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| photo_id | uuid FK → photos | |
| costume_id | uuid FK → costumes | |
| result_url | text | composited image in Supabase Storage |
| overlay_metadata | jsonb | applied config snapshot |
| user_id | uuid nullable | |
| created_at | timestamptz | |

## touchpoints
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| event_type | text | "page_view", "costume_try", "save", "share" |
| entity_type | text | "costume", "changed_photo" |
| entity_id | uuid | |
| metadata | jsonb | extra context (category, source page) |
| user_id | uuid nullable | anonymous = null |
| created_at | timestamptz | |

**RLS:** v1 permissive. Lock-down: user can read own touchpoints; anon writes allowed.

## AI Fields (future — segmentation)
If AI segmentation added later, changed_photos will gain: `segmentation_result` (value), `segmentation_source` (text), `segmentation_confidence` (numeric), `review_status` (text default 'unreviewed'). Not in v1.

## Relationships
``ncostume_categories 1—* costumes
photos 1—* changed_photos
costumes 1—* changed_photos
touchpoints *—1 (polymorphic entity)```