# Guided Mission MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing lookup-first English hub into a testable product experience by adding one complete free mission that makes the learner attempt, diagnose, construct, speak, transfer, and save the obstacle stage.

**Architecture:** Keep the existing static/Vercel architecture. Add a small UMD core for testable grading and progress rules, one structured mission catalog file, and one browser controller that renders the mission inside a new first hub tab. Keep root and `public/` assets byte-identical so local, GitHub-style, and Vercel paths teach the same lesson.

**Tech Stack:** Static HTML/CSS/JavaScript, browser `SpeechRecognition` when available, `localStorage`, Node.js built-in test runner, Vercel static deployment.

## Global Constraints

- Start from the learner's desired result, not the target expression.
- Require a first attempt before revealing the target.
- Diagnose the missing intent instead of marking the learner simply wrong.
- Explain the expression through verified word roles, structure, contrast, or conventional use; do not invent etymology.
- Require spoken output, with a typed/manual fallback when browser speech recognition is unavailable.
- Finish with an unseen transfer and save the failed stage in a retry queue.
- Do not claim authentication, billing, pronunciation scoring, durable voice storage, or a live subscription.
- The first mission teaches `Are you taking walk-ins right now?` and transfers the core pattern to `Do you take walk-ins on Saturdays?`.

---

### Task 1: Lock the mission contract and pure behavior

**Files:**
- Create: `tests/guided-mission.test.mjs`
- Create: `public/guided-mission-core.js`
- Create: `guided-mission-core.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: raw learner strings and mission stage identifiers.
- Produces: `normalizeAttempt(value)`, `gradeSpokenAttempt(value, expectedVariant)`, `createInitialProgress(missionId)`, and `recordObstacle(progress, stage)`.

- [x] **Step 1: Write failing Node tests**

Assert that normalization handles punctuation and hyphens, direct speech requires `take/taking + walk-ins + current time`, transfer speech requires `take + walk-ins + Saturdays/weekends`, and repeated obstacle writes remain unique while preserving the latest retry stage.

- [x] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: failure because `guided-mission-core.js` and the `test` script do not exist.

- [x] **Step 3: Implement the smallest pure core and sync copies**

Use a UMD export so Node can `require()` the functions and the browser can access `window.GuidedMissionCore`. Do not access DOM or storage from this file.

- [x] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all core tests pass.

### Task 2: Add the structured mission and product-first hub

**Files:**
- Create: `public/guided-missions.js`
- Create: `guided-missions.js`
- Modify: `public/index.html`
- Modify: `index.html`
- Modify: `tests/guided-mission.test.mjs`

**Interfaces:**
- Consumes: the approved mission content fields from the shared filming/product spec.
- Produces: `window.GUIDED_MISSIONS`, a `mission` hub tab, `#guidedMissionHub`, and `#guidedMissionApp`.

- [x] **Step 1: Add failing structure tests**

Assert that the catalog contains every required content-object key, the root/public copies match, the first active tab is `훈련 미션`, the daily lesson sits inside the dictionary hub, and unsupported paid-capability claims are absent.

- [x] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: catalog and mission DOM assertions fail.

- [x] **Step 3: Add the mission object and HTML/CSS shell**

Store the desired result, scene, plausible first attempt, three intent choices, three meaning-bridge questions, assembly choices, direct spoken prompt, transfer scenario, usage boundary, retry stages, and dictionary source. Add a compact fourth tab and make the mission the first screen.

- [x] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: structure and synchronization tests pass.

### Task 3: Implement the complete guided interaction

**Files:**
- Create: `public/guided-mission.js`
- Create: `guided-mission.js`
- Modify: `public/index.html`
- Modify: `index.html`
- Modify: `tests/guided-mission.test.mjs`

**Interfaces:**
- Consumes: `GUIDED_MISSIONS[0]`, `GuidedMissionCore`, `#guidedMissionApp`, browser speech recognition, and `localStorage`.
- Produces: a resumable six-stage flow and the storage keys `ok_guided_mission_progress_v1` and `ok_guided_retry_queue_v1`.

- [x] **Step 1: Add failing interaction-contract tests**

Assert the controller contains render paths for first attempt, intent, meaning bridge, assembly, spoken output, transfer, and completion; speech recognition has an explicit fallback; and wrong stages call the obstacle recorder.

- [x] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: controller contract assertions fail.

- [x] **Step 3: Build the browser controller**

Render one stage at a time, disable forward progress until the learner acts, explain each choice after submission, grade speech conservatively, allow typed or manual-spoken fallback, save progress after every stage, and show the saved obstacle on completion. Add restart and dictionary-navigation commands.

- [x] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: every test passes.

### Task 4: Verify the real mobile path and deploy

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the completed static product and the existing Vercel project connection.
- Produces: tested local screenshots, a pushed `main`, and a live production URL serving the mission.

- [x] **Step 1: Document the mission and honest boundary**

Describe the free mission loop, local storage behavior, browser speech fallback, local command, and the fact that account/payment/voice-history features are not yet live.

- [x] **Step 2: Run automated verification**

Run: `npm test`

Run: `npm audit --audit-level=high`

Run: `cmp index.html public/index.html && cmp guided-mission.js public/guided-mission.js && cmp guided-mission-core.js public/guided-mission-core.js && cmp guided-missions.js public/guided-missions.js`

Expected: all commands exit 0.

- [x] **Step 3: Exercise the complete mission in a real browser**

Serve `public/`, use a mobile viewport, complete every stage including a wrong intent choice and speech fallback, reload to confirm progress persistence, restart, and capture desktop/mobile screenshots. Check that no controls overlap or shift.

- [x] **Step 4: Commit, push, and verify production**

Commit only the mission files and documentation, push `main`, poll the Vercel production URL until `훈련 미션` and `예약 없이 지금 가능한지 묻기` are live, then repeat the mobile path against production.
