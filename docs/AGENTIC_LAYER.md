# Garbtopia — Agentic Layer

## Draftable Actions (Low Risk — Auto)
- Auto-log touchpoints on user interactions (no approval needed)
- Auto-compute popularity scores from touchpoint aggregates
- Auto-tag costume category from metadata fields

## Executable After Approval (Medium Risk)
- Generate costume overlay from AI segmentation (future — needs user confirmation before saving result)
- Auto-generate share link for a saved changed photo

## Human-Only Actions (Critical Risk)
- Delete a changed photo (user-initiated only, never automated)
- Delete a costume from catalog (admin only)
- Delete a user account and all associated data

## Named Tools
| Tool | Risk | v1? |
|------|------|-----|
| log_touchpoint | low | yes |
| compute_popularity | low | yes |
| generate_overlay | low (static) | yes |
| generate_share_link | medium | later |
| ai_segmentation | medium | later |
| delete_changed_photo | critical | yes (user-triggered only) |

## Audit Log Fields
Every agentic or automated action writes to touchpoints or a dedicated audit trail:
- action_name, actor (user_id or "system"), entity_type, entity_id, before_state, after_state, timestamp

## v1 vs Later
- **v1:** log_touchpoint, compute_popularity, generate_overlay (static), delete_changed_photo (user-triggered)
- **Later:** AI segmentation, share link generation, recommendation agent, costume contributor approval workflow