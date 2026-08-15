# Garbtopia — Test Plan

## v1 Success Scenario (Manual)
1. Open home page → verify costume catalog loads with seeded costumes (at least 6 across 3 categories)
2. Click "Asian" category filter → verify only Asian costumes show
3. Click "Kimono" costume card → verify demo photo selector appears with 3 demo photos
4. Select demo photo #1 → click "Try This Costume" → verify loading state, then result image appears with kimono overlay
5. Click "Save" → verify success message, changed photo appears in gallery
6. Navigate to Gallery → verify saved result is visible in grid
7. Upload a custom frontal photo → apply a different costume → save → verify it appears in gallery
8. Delete one saved photo from gallery → confirm dialog → verify it disappears

## Empty States
- **No costumes in category:** Show "No costumes in this category yet" with link to browse all
- **Gallery empty:** Show "No saved costumes yet. Try a costume to get started!" with CTA button to catalog
- **No search results:** Show "No costumes match your search" with clear button

## Error States
- **Photo upload fails (wrong type):** Show "Please upload a JPG or PNG image"
- **Overlay compositing fails:** Show "Couldn't apply that costume. Try another photo." with retry button
- **Network error on save:** Show "Save failed. Check your connection and try again." with retry
- **DB unreachable:** Show full-page error with reload button

## Loading States
- Costume catalog: skeleton grid placeholders while fetching
- Overlay compositing: spinner with "Applying costume..." text
- Gallery: skeleton cards while loading

## Permission Tests (Post Lock-down)
- Anonymous user can browse catalog and try costumes
- Logged-in user saves photo → logs out → cannot see it on fresh session
- User A cannot see User B's saved photos in gallery
- Touchpoints still log for anonymous users (user_id = null)