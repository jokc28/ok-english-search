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
- **Quiz Hub:** creates a short mobile quiz from the same expression catalog. Users choose all expressions, a category, or their saved 오답 queue, then answer mixed meaning, situation, and typed-recall questions before jumping back to the source Reel.

This keeps the current content pipeline intact while converting the same Instagram archive into an active study product.

## Quiz Learning Strategy

The optimized quiz flow is based on three learning-science patterns:

1. **Retrieval practice:** the learner has to recall or choose an answer before seeing the explanation. Roediger and Karpicke found delayed retention was stronger after testing than after repeated study.
2. **Distributed review:** missed expressions are stored locally and can be replayed later through the 오답 mode instead of being forgotten after one session.
3. **Interleaving:** 혼합 mode rotates typed recall, meaning recognition, and situation recognition so users do not memorize one cue shape only.
4. **No answer leakage:** recognition questions now show only the English expression before answer selection. Meaning and situation details are revealed after the attempt, because showing "big man" with "용서할 때" turns the question into guessing from a giveaway cue.
5. **Plausible distractors:** multiple-choice options are pulled first from the same category and difficulty, then widened only when needed. This follows common MCQ design guidance: distractors should be plausible, homogeneous, and free of giveaway clues.
6. **Contrast lessons:** `affect vs effect`, `farther vs further`, and similar "vs / 차이 / 구분" Reels now generate contrast questions. The learner chooses the meaning or role of one side of the pair instead of being asked for a generic use situation.

Relevant sources:

- Roediger & Karpicke, 2006, "Test-enhanced learning: taking memory tests improves long-term retention" (`https://pubmed.ncbi.nlm.nih.gov/16507066/`)
- Dunlosky et al., 2013, "Improving Students' Learning With Effective Learning Techniques" (`https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html`)
- NC State DELTA, "Best Practices for Creating Multiple-Choice Questions" (`https://teaching-resources.delta.ncsu.edu/multiplechoice/`)

## Recommended Next Features

1. **Story Share Result Card:** Generate a quiz result image sized for Instagram Stories. This strengthens brand spread because learners can share scores back to Instagram.
2. **Daily Mission:** Store a local daily completion state and surface one dictionary save plus one quiz completion per day.
3. **Weak Expression Queue Sync:** The local 오답 queue now exists in-browser; the next step is optional account/device sync if learners expect continuity across phones.
4. **Creator CTA Context:** For expressions added from recent Reels, show a subtle "new this week" marker and prioritize them in daily cards.
5. **Content Ops Dashboard:** Add a small local/admin report showing new public Instagram clips, skipped clips, and entries requiring review before deployment.

## Architecture Notes

The current static architecture remains appropriate until user accounts or cross-device progress become necessary. If the quiz loop becomes central, the next backend step should be a small progress API or Supabase table for anonymous/session learning events, not a broad rewrite.
