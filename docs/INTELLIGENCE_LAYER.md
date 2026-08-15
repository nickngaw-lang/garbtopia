# Garbtopia — Intelligence Layer

## Messy Inputs (v1)
- User uploads arbitrary frontal photo (any aspect ratio, lighting)
- v1 handles via fixed overlay_config per costume — no AI needed

## Auto-Structure Schema (touchpoint event)
```json
{
  "event_type": "costume_try",
  "entity_type": "costume",
  "entity_id": "uuid",
  "metadata": {
    "category": "Asian",
    "source_page": "/costumes",
    "session_id": "anon-xyz"
  },
  "user_id": null,
  "created_at": "2025-01-15T10:00:00Z"
}
```

## Events to Track
| Event | Trigger | Entity |
|-------|---------|--------|
| page_view | Any route visit | — |
| costume_view | Costume detail/card click | costume |
| costume_try | Overlay applied to photo | costume |
| save | ChangedPhoto created | changed_photo |
| share | Share link generated (later) | changed_photo |

## Scoring Rules (v1 — rule-based)
- **Costume popularity** = count of costume_try events in last 7 days
- **Category heat** = sum of costume_try per category / total tries
- **Save rate** = save events / costume_try events per costume
- Scores computed via SQL views / scheduled queries (no ML in v1)

## What Gets Ranked
- Costume catalog sorted by popularity score (descending) on home page
- "Trending in your category” section (category_heat)

## v1 vs Later
- **v1:** Rule-based scoring via SQL, touchpoint logging, basic sort by popularity
- **Later:** AI segmentation for fit, recommendation model from touchpoint patterns, auto-tagging of uploaded costumes