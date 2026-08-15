# Garbtopia — Product Requirements

## Problem
People aged 18–35 want to try on traditional tribal and cultural costumes without learning photo-editing software. Today they Photoshop overlays manually — slow, skill-gated, and discourages exploration.

## Target User
18–35-year-olds curious about global cultural dress. Casual users, not designers. Mobile-first browsing.

## Core Objects
- **Costume** — a cultural/traditional outfit (name, culture, region, image URL, tags)
- **CostumeCategory** — grouping (e.g. African, Asian, Indigenous Americas, European Folk)
- **Photo** — a user-uploaded frontal photo of a person
- **ChangedPhoto** — result of applying a costume to a photo (stores both image refs + metadata)
- **Touchpoint** — a logged user interaction (page view, costume try, share, save)

## MVP (v1) Checklist
- [ ] Browse costume catalog by category (frontal costume images only — no model mock-ups)
- [ ] Upload a frontal photo (or pick a demo photo)
- [ ] Click a costume → see it composited onto the photo (frontal overlay)
- [ ] Save the changed photo (generates a viewable result)
- [ ] Browse gallery of saved changed photos
- [ ] Touchpoint logging on every key interaction
- [ ] Anonymous-friendly (no login wall for browsing/trying)
- [ ] Simple email registration to save/share (success metric)

## Non-Goals (v1)
- No fashion model mock-up or 3D body fitting
- No side/back views — frontal only
- No AI auto-segmentation or pose detection (v1 = static overlay)
- No social feed or comments
- No payment or premium tiers

## Success Criteria
A visitor arrives, picks a demo photo, browses the Asian category, clicks "Kimono", sees the costume overlaid on the photo, saves the result, and it appears in the gallery — all without an account. They then register with email and their saved changed photos persist under their profile.