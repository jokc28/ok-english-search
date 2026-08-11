# Reel Situation Builder Implementation Plan

**Goal:** Turn the existing `english_link` first view into a silent, 15-20 second Reel-linked sentence builder while preserving its expression library, 10-second quiz, seven-question quiz, deep links, bookmarks, and missed-answer queue.

**Architecture:** Reuse the existing static `ok-english-search` deployment and the current guided-mission asset hooks, but replace the guided speech mission with one active Subway order builder. The root/profile-link entry opens the builder directly. Existing dictionary and quiz surfaces remain secondary destinations reached after completion or through existing deep links.

## Global Constraints

- This is an entry mode of the existing `english_link` repository, not a separate product or site.
- The root URL opens the active Reel builder without a menu, landing page, login, microphone permission, typing, email form, waitlist, or price prompt.
- The active Reel remains `https://www.instagram.com/reel/Da7hx5AxWQW/`.
- Users choose one ingredient to remove completely and one item whose amount should be reduced.
- The generated patterns remain exactly `Everything except {ingredient}.` and `Go easy on the {item}.`.
- The experience explains the outcome distinction: `except` removes completely; `go easy on` reduces amount or intensity.
- The first completed example must support `pickles` and `mayo`; users can reset and build another combination.
- Completion links to the existing 10-second/seven-question quiz and expression dictionary instead of duplicating those products.
- Existing `q`, `cat`, and `id` dictionary deep links and the saved-expression button must still work.
- Root and `public/` deployable copies remain byte-identical.
- Do not claim live analytics while the measurement ID remains `G-XXXXXXXXXX`.

## Task 1: Replace the speech mission contract with a pure sentence builder

**Files:**
- Modify `tests/guided-mission.test.mjs`
- Modify `guided-missions.js` and `public/guided-missions.js`
- Modify `guided-mission-core.js` and `public/guided-mission-core.js`

**Required data:**

- Pack ID: `subway-order-builder-01`
- Headline: `써브웨이에서 내 취향대로 주문 만들기`
- Remove options: `onions / 양파`, `pickles / 피클`, `jalapenos / 할라피뇨`
- Reduce options: `sauce / 소스`, `mayo / 마요`, `dressing / 드레싱`

**Required core API:**

- `createBuilderState(packId)`
- `selectRemove(state, ingredient)`
- `selectReduce(state, item)`
- `buildOrder(state)`
- `completeOrder(state)`
- `resetOrder(state)`

`buildOrder` returns no completed lines until both choices are valid, then returns the two exact English sentences and Korean result labels.

Use TDD, synchronize root/public copies, run `npm test`, and commit.

## Task 2: Build the direct profile-link sentence maker

**Files:**
- Modify `tests/guided-mission.test.mjs`
- Modify `guided-mission.js` and `public/guided-mission.js`
- Modify `index.html` and `public/index.html`

**First-view flow:**

1. Show the concrete desired result and the two choice groups.
2. Tapping chips selects the remove and reduce values.
3. Enable one primary button, `영어 주문 만들기`, only after both choices exist.
4. Completion shows the two generated lines, outcome labels, and the usage distinction.
5. `다른 조합 만들기` resets the builder.
6. `10초 퀴즈 더 풀기` opens the existing quiz hub.
7. `표현 사전에서 더 찾기` opens the existing dictionary.

**Removal contract:**

- No `SpeechRecognition`, microphone button, spoken confirmation, textarea, waitlist, Formspree, price, or email input in the builder.
- No four-way top hub tablist on the root first view.
- Legacy tools remain available only as secondary navigation and deep-link destinations.

Persist only the last builder choices and completion count in `localStorage` key `ok_reel_builder_v1`.

Use TDD, preserve deep links/bookmarks, synchronize copies, run unit and browser tests, and commit.

## Task 3: Verify, document, integrate, and deploy

**Files:**
- Modify `tests/guided-mission.browser.mjs`
- Modify `README.md`

**Browser contract:**

- At 360x800, 390x844, and 1440x1000, verify direct root entry, pickles/mayo completion, reset to onions/sauce, quiz handoff, dictionary handoff, return to builder, `q/cat/id` deep links, bookmarks, refresh persistence, zero page errors, and zero horizontal overflow.
- Confirm the first view has one primary action, no nested cards, no layout shift, and no speech/form controls.
- Capture mobile intro, selected, completed, and legacy-handoff screenshots.

Run:

- `npm test`
- `npm run test:browser`
- `npm audit --audit-level=high`
- all root/public `cmp` checks
- `git diff --check`

After independent review, fast-forward `main`, rerun the full suite in the normal checkout, push `main`, poll `https://jokc28.github.io/ok-english-search/` for fresh builder markers, and repeat the 390x844 completion path in production.
