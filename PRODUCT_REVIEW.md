# English Link Product Review

## Current Pipeline

The app is a static mobile web app deployed from `main` to GitHub Pages and Vercel. `data.js` and `public/data.js` contain the expression catalog. `public/index.html` renders the mobile UI, local browser search, bookmark storage, and the Vercel `/api/search` AI ranking endpoint.

Content ingestion currently has two paths:

- `update_public_instagram.py` checks the public Instagram feed, filters new public clips, and updates both data files.
- The older archive path uses Instagram export files, audio download, transcription, enrichment, and `generate_data.py`.

## UX Audit

The prior UI was already mobile-oriented, but the product was centered on lookup. That fits users who remember a situation and want a Reel quickly, but it is weaker for repeated learning. Instagram learners often need a lower-friction loop: discover, test memory, then return to the source video.

The `awesome-design-md` local references are mostly pointer README files, not full local design systems. The relevant pattern direction is still clear: compact mobile utility surfaces, strong task segmentation, dense scan-friendly cards, and fast command/search affordances.

## Implemented Pivot

The app now exposes two hubs:

- **Dictionary Hub:** keeps the existing situation-first search, AI search fallback, category filters, saved expressions, sharing, and Reel links.
- **Quiz Hub:** creates a 5-question mobile quiz from the same expression catalog. Users choose all expressions or a category, answer meaning-based questions, and can jump back to the source Reel after each answer.

This keeps the current content pipeline intact while converting the same Instagram archive into an active study product.

## Recommended Next Features

1. **Story Share Result Card:** Generate a quiz result image sized for Instagram Stories. This strengthens brand spread because learners can share scores back to Instagram.
2. **Daily Mission:** Store a local daily completion state and surface one dictionary save plus one quiz completion per day.
3. **Weak Expression Queue:** Track missed quiz IDs in localStorage and offer a "틀린 표현 다시 풀기" quiz.
4. **Creator CTA Context:** For expressions added from recent Reels, show a subtle "new this week" marker and prioritize them in daily cards.
5. **Content Ops Dashboard:** Add a small local/admin report showing new public Instagram clips, skipped clips, and entries requiring review before deployment.

## Architecture Notes

The current static architecture remains appropriate until user accounts or cross-device progress become necessary. If the quiz loop becomes central, the next backend step should be a small progress API or Supabase table for anonymous/session learning events, not a broad rewrite.
