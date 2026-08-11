# Reel-Linked Free Pack MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six-stage unrelated walk-in mission with a two-scene, Reel-linked ordering experience that opens directly from the Instagram profile link and validates a visible-price `9,900 KRW/month` launch signup.

**Architecture:** Keep the existing static GitHub Pages deployment and root/`public/` synchronization contract. Replace the mission catalog and controller with a focused active-pack model, keep grading and waitlist transport in small UMD modules that Node tests can exercise, and move the legacy dictionary/practice/quiz hubs behind secondary navigation and existing deep links. Submit waitlist data to a user-owned Formspree form so the public static site never stores credentials.

**Tech Stack:** Static HTML/CSS/JavaScript, Web Speech API with manual spoken fallback, Formspree, `localStorage`, Node.js built-in test runner, Playwright 1.62.1, GitHub Pages.

## Global Constraints

- The root URL must open the free pack, not the four-tab hub.
- The active pack must anchor to `https://www.instagram.com/reel/Da7hx5AxWQW/`.
- Core Reel expressions must remain exactly `Everything except onions.`, `Everything except pickles.`, and `Go easy on the sauce.`.
- `Everything except onions` and `Everything except pickles` are substitutions of one pattern, not two inflated concepts.
- The learner-facing promise is ordering what they want, not learning an expression count or grammar list.
- The first experience has two scenes: coached ordering and unaided transfer ordering.
- Speech recognition cannot be required; manual spoken confirmation must complete the flow without text entry.
- Do not claim pronunciation scoring, audio storage, authentication, billing, or a live subscription.
- Show `월 9,900원 예정` and `결제되지 않습니다` together before signup.
- Only a confirmed Formspree success response may show signup completion.
- Root and `public/` copies of every deployable asset must remain byte-identical.
- Existing `q`, `cat`, and `id` dictionary deep links and the saved-expression button must still reveal the legacy tools.

---

## File Map

- `guided-missions.js` and `public/guided-missions.js`: one manually reviewed active Reel pack and its two scenes.
- `guided-mission-core.js` and `public/guided-mission-core.js`: normalization, line grading, transfer grading, and two-scene progress rules.
- `guided-mission.js` and `public/guided-mission.js`: free-pack rendering, speech/manual interaction, transfer, result, and legacy-tool navigation.
- `waitlist-core.js` and `public/waitlist-core.js`: Formspree request validation and transport with injectable `fetch`.
- `waitlist.js` and `public/waitlist.js`: signup form DOM behavior and success/error rendering.
- `waitlist.config.js` and `public/waitlist.config.js`: public Formspree form ID only.
- `scripts/configure-waitlist.js`: validate and synchronize a real Formspree form ID.
- `index.html` and `public/index.html`: result-first landing shell, two-scene styles, secondary tool access, and waitlist markup.
- `tests/guided-mission.test.mjs`: content, grading, synchronization, waitlist, and honest-copy contracts.
- `tests/guided-mission.browser.mjs`: complete mobile path plus legacy regressions and Formspree success/failure interception.
- `README.md`: public URL, free-pack behavior, Formspree setup, metrics boundary, and deployment procedure.

### Task 1: Replace the mission contract and grading core

**Files:**
- Modify: `tests/guided-mission.test.mjs`
- Modify: `guided-missions.js`
- Modify: `public/guided-missions.js`
- Modify: `guided-mission-core.js`
- Modify: `public/guided-mission-core.js`

**Interfaces:**
- Consumes: raw learner speech strings and the active pack ID `subway-custom-order-01`.
- Produces: `normalizeAttempt(value)`, `gradePackLine(value, lineId)`, `gradeTransferOrder(value)`, `createPackProgress(packId)`, and `advancePack(progress, nextScene)`.

- [ ] **Step 1: Replace old walk-in tests with failing pack-contract tests**

```js
test('active pack is anchored to the published Subway Reel', () => {
  assert.equal(missions.length, 1);
  const pack = missions[0];
  assert.equal(pack.id, 'subway-custom-order-01');
  assert.equal(pack.status, 'active');
  assert.equal(pack.reel_url, 'https://www.instagram.com/reel/Da7hx5AxWQW/');
  assert.equal(pack.headline, '해외 식당에서 원하는 대로 주문하기');
  assert.deepEqual(
    pack.source_expressions.map(item => item.model),
    ['Everything except onions.', 'Go easy on the sauce.']
  );
  assert.ok(pack.source_expressions.every(item => item.exact_from_reel));
  assert.deepEqual(pack.transfer_scene.expected, [
    'Everything except pickles.',
    'Go easy on the mayo.'
  ]);
});

test('grades the two desired ordering results without accepting the wrong result', () => {
  assert.equal(core.gradePackLine('Everything except onions.', 'exclude-onions').correct, true);
  assert.equal(core.gradePackLine('Go easy on the sauce.', 'reduce-sauce').correct, true);
  assert.equal(core.gradePackLine('No sauce.', 'reduce-sauce').correct, false);
  assert.equal(core.gradePackLine('A little onion.', 'exclude-onions').correct, false);
});

test('grades the transfer only when both changed ingredients are present', () => {
  assert.equal(
    core.gradeTransferOrder('Everything except pickles. Go easy on the mayo.').correct,
    true
  );
  assert.deepEqual(
    core.gradeTransferOrder('Everything except pickles.').missing,
    ['reduce-mayo']
  );
});
```

Delete assertions for `walk-ins-01`, six old stages, `meaning_bridge_steps`, `assembly_slots`, and `ok_guided_retry_queue_v1`.

- [ ] **Step 2: Run the focused test to verify RED**

Run: `node --test --test-name-pattern='active pack|desired ordering|transfer only' tests/guided-mission.test.mjs`

Expected: FAIL because the catalog still contains `walk-ins-01` and the new grading functions do not exist.

- [ ] **Step 3: Replace the catalog with the active Reel pack**

Use this object in both catalog copies:

```js
{
  id: 'subway-custom-order-01',
  status: 'active',
  reel_url: 'https://www.instagram.com/reel/Da7hx5AxWQW/',
  reel_title: '써브웨이에서 원하는 대로 주문하기',
  headline: '해외 식당에서 원하는 대로 주문하기',
  desired_result: '싫은 재료는 완전히 빼고, 소스 양은 줄여서 내 취향대로 주문한다.',
  source_expressions: [
    {
      id: 'exclude-onions',
      model: 'Everything except onions.',
      exact_from_reel: true,
      result_label: '양파 완전히 제외',
      prompt: '양파를 아예 빼려면 뭐라고 말할까요?',
      explanation: 'except 뒤에는 빼고 싶은 재료가 옵니다.',
      substitutions: ['onions', 'pickles', 'jalapenos']
    },
    {
      id: 'reduce-sauce',
      model: 'Go easy on the sauce.',
      exact_from_reel: true,
      result_label: '소스 양 줄이기',
      prompt: '소스를 빼는 게 아니라 조금만 넣어달라고 해보세요.',
      explanation: 'go easy on은 없애는 것이 아니라 양이나 강도를 줄여달라는 말입니다.',
      substitutions: ['sauce', 'mayo', 'dressing']
    }
  ],
  meaning_contrasts: [
    { id: 'exclude', label: '완전히 빼기', outcome: 'No onions' },
    { id: 'reduce', label: '양만 줄이기', outcome: 'Light sauce' }
  ],
  coach_scene: {
    order: ['양파 제외', '소스 적게']
  },
  transfer_scene: {
    order: ['피클 제외', '마요 적게'],
    expected: ['Everything except pickles.', 'Go easy on the mayo.'],
    result_ticket: ['No pickles', 'Light mayo']
  },
  offer: {
    title: '여행과 일상에서 영어 때문에 원하는 것을 포기하지 않는 상황 훈련',
    price: '월 9,900원 예정',
    cta: '이 가격으로 출시 알림 받기'
  },
  sources: [
    'https://www.instagram.com/reel/Da7hx5AxWQW/',
    'https://dictionary.cambridge.org/us/dictionary/english/go-easy-on'
  ]
}
```

- [ ] **Step 4: Implement minimal pure grading and progress functions**

```js
function gradePackLine(value, lineId) {
  const normalized = normalizeAttempt(value);
  const rules = {
    'exclude-onions': [/everything/, /\bexcept\b/, /\bonions?\b/],
    'reduce-sauce': [/\bgo easy on\b/, /\bthe sauce\b/]
  };
  const missing = (rules[lineId] || [])
    .map((rule, index) => ({ rule, index }))
    .filter(item => !item.rule.test(normalized))
    .map(item => `${lineId}-${item.index}`);
  return { correct: missing.length === 0, missing, normalized };
}

function gradeTransferOrder(value) {
  const normalized = normalizeAttempt(value);
  const checks = [
    { key: 'exclude-pickles', matched: /\beverything except pickles?\b/.test(normalized) },
    { key: 'reduce-mayo', matched: /\bgo easy on (?:the )?mayo\b/.test(normalized) }
  ];
  const missing = checks.filter(check => !check.matched).map(check => check.key);
  return { correct: missing.length === 0, missing, normalized };
}

function createPackProgress(packId) {
  return { packId, scene: 'intro', coachIndex: 0, completed: false, attempts: {} };
}

function advancePack(progress, nextScene) {
  return { ...progress, scene: nextScene, completed: nextScene === 'complete' };
}
```

Keep `normalizeAttempt` punctuation-tolerant and export only the five new public functions.

- [ ] **Step 5: Synchronize root/public files and run tests**

Run: `cp guided-missions.js public/guided-missions.js`

Run: `cp guided-mission-core.js public/guided-mission-core.js`

Run: `npm test`

Expected: new catalog/core tests PASS; controller/HTML tests may still fail until Task 2 only if they were deliberately changed in Step 1.

- [ ] **Step 6: Commit the independent content/core change**

```bash
git add guided-missions.js public/guided-missions.js guided-mission-core.js public/guided-mission-core.js tests/guided-mission.test.mjs
git commit -m "feat: anchor free pack to Subway Reel"
```

### Task 2: Build the result-first two-scene experience

**Files:**
- Modify: `tests/guided-mission.test.mjs`
- Modify: `guided-mission.js`
- Modify: `public/guided-mission.js`
- Modify: `index.html`
- Modify: `public/index.html`

**Interfaces:**
- Consumes: `GUIDED_MISSIONS[0]`, the five `GuidedMissionCore` functions, `SpeechRecognition`, and `localStorage` key `ok_reel_pack_progress_v1`.
- Produces: `renderIntro()`, `renderCoach()`, `renderTransfer()`, `renderComplete()`, `showLegacyHub(hub)`, and the DOM hooks `#guidedMissionApp`, `#legacyToolNav`, and `#freePackShell`.

- [ ] **Step 1: Add failing HTML/controller contract tests**

```js
test('root opens on one result-first free pack instead of four competing tabs', () => {
  const html = read('public/index.html');
  assert.match(html, /id="freePackShell"/);
  assert.match(html, /해외 식당에서 원하는 대로 주문하기/);
  assert.match(html, />내 주문 완성하기</);
  assert.doesNotMatch(html, /<div class="hub-tabs" role="tablist"/);
  assert.match(html, /id="legacyToolNav"/);
});

test('controller has only the two-scene render path and manual speech fallback', () => {
  const controller = read('public/guided-mission.js');
  ['renderIntro', 'renderCoach', 'renderTransfer', 'renderComplete', 'showLegacyHub']
    .forEach(name => assert.match(controller, new RegExp(`function ${name}\\(`)));
  ['renderIntent', 'renderMeaning', 'renderAssembly', 'renderSpoken']
    .forEach(name => assert.doesNotMatch(controller, new RegExp(`function ${name}\\(`)));
  assert.match(controller, /id="coachManualConfirm"/);
  assert.match(controller, /id="transferManualConfirm"/);
  assert.doesNotMatch(controller, /<textarea/);
});
```

- [ ] **Step 2: Run the focused tests to verify RED**

Run: `node --test --test-name-pattern='result-first|two-scene' tests/guided-mission.test.mjs`

Expected: FAIL because the four tabs and six-stage controller remain.

- [ ] **Step 3: Replace the mission shell and first-view CSS**

Replace the active mission tab/shell with:

```html
<main class="free-pack-shell" id="freePackShell">
  <header class="pack-header">
    <a class="brand-link" href="https://www.instagram.com/ok.english.kr/">@ok.english.kr</a>
    <button class="saved-link" id="headerBookmarkBtn" type="button">저장한 표현</button>
  </header>
  <section id="guidedMissionHub">
    <div id="guidedMissionApp" aria-live="polite"></div>
  </section>
  <nav class="legacy-tool-nav" id="legacyToolNav" aria-label="다른 영어 도구">
    <button data-legacy-hub="dictionary" type="button">표현 사전</button>
    <button data-legacy-hub="situation" type="button">상황 연습</button>
    <button data-legacy-hub="quiz" type="button">퀴즈</button>
  </nav>
</main>
```

Keep the existing three legacy sections below it with `hidden` by default. Use restrained neutral surfaces, 8px or smaller radii for repeated cards, fixed-height action buttons, and no marketing hero illustration.

- [ ] **Step 4: Rewrite the controller around progressive content in two scenes**

`renderIntro()` must show only the desired result, the two order-ticket outcomes, `내 주문 완성하기`, and `영상 다시 보기`.

`renderCoach()` must keep both coached requests on one page and reveal each model only after speech recognition returns or the learner taps `말하고 확인하기`. After reveal, require one `말했어요` confirmation but never a textarea.

`renderTransfer()` must show `피클 제외` and `마요 적게`, accept one combined transcript or manual confirmation, grade with `gradeTransferOrder`, and render at most one missing-result hint at a time.

`renderComplete()` must show this exact ticket and success copy before the offer mount point:

```html
<ul class="order-result-ticket">
  <li>No pickles</li>
  <li>Light mayo</li>
</ul>
<p>영상에서 본 표현으로 내 주문을 직접 완성했습니다.</p>
<div id="waitlistMount"></div>
```

- [ ] **Step 5: Preserve deep links and secondary tools**

On load, `q`, `cat`, or `id` must call `showLegacyHub('dictionary')`. The saved-expression button must also call it. `showLegacyHub()` hides `#guidedMissionHub`, reveals only the requested legacy section, and reveals a `무료팩으로 돌아가기` command without reintroducing four competing top tabs.

- [ ] **Step 6: Synchronize and run tests**

Run: `cp guided-mission.js public/guided-mission.js`

Run: `cp index.html public/index.html`

Run: `npm test`

Expected: all unit/structure tests PASS.

- [ ] **Step 7: Commit the two-scene interface**

```bash
git add guided-mission.js public/guided-mission.js index.html public/index.html tests/guided-mission.test.mjs
git commit -m "feat: simplify profile-link practice to two scenes"
```

### Task 3: Add real visible-price waitlist capture

**Files:**
- Create: `waitlist-core.js`
- Create: `public/waitlist-core.js`
- Create: `waitlist.config.js`
- Create: `public/waitlist.config.js`
- Create: `waitlist.js`
- Create: `public/waitlist.js`
- Create: `scripts/configure-waitlist.js`
- Modify: `tests/guided-mission.test.mjs`
- Modify: `index.html`
- Modify: `public/index.html`
- Modify: `package.json`

**Interfaces:**
- Consumes: `window.OK_WAITLIST_CONFIG.formId`, form fields `{ email, need, consent, packId }`, and injectable `fetchImpl`.
- Produces: `validateWaitlist(values)`, `submitWaitlist(values, options)`, `window.OkWaitlist`, and `npm run configure:waitlist -- --form-id "$FORM_ID"`.

- [ ] **Step 1: Create a user-owned Formspree form**

In the Formspree account that will own launch contacts, create a form named `ok.english.kr 출시 알림`, set its notification recipient, submit one test entry in the Formspree dashboard, and copy the returned form ID into a shell variable:

```bash
read -r FORM_ID
```

Paste only the Formspree ID and press Enter. Do not paste the recipient email into the repository.

- [ ] **Step 2: Add failing validation and transport tests**

Load the new UMD module at the top of the test file:

```js
const waitlistPath = resolve('public/waitlist-core.js');
const waitlist = existsSync(waitlistPath) ? require(waitlistPath) : null;
```

```js
test('waitlist validates email, need, and explicit consent', () => {
  assert.equal(waitlist.validateWaitlist({ email: 'bad', need: '', consent: false }).valid, false);
  assert.equal(waitlist.validateWaitlist({
    email: 'learner@example.com', need: '여행 식당', consent: true
  }).valid, true);
});

test('waitlist reports success only after Formspree confirms storage', async () => {
  const ok = await waitlist.submitWaitlist(
    { email: 'learner@example.com', need: '여행 식당', consent: true, packId: 'subway-custom-order-01' },
    { formId: 'xabcdefg', fetchImpl: async () => ({ ok: true, json: async () => ({ ok: true }) }) }
  );
  assert.equal(ok.ok, true);

  const failed = await waitlist.submitWaitlist(
    { email: 'learner@example.com', need: '여행 식당', consent: true, packId: 'subway-custom-order-01' },
    { formId: 'xabcdefg', fetchImpl: async () => ({ ok: false, status: 422 }) }
  );
  assert.equal(failed.ok, false);
});
```

- [ ] **Step 3: Run the focused tests to verify RED**

Run: `node --test --test-name-pattern='waitlist' tests/guided-mission.test.mjs`

Expected: FAIL because `waitlist-core.js` does not exist.

- [ ] **Step 4: Implement the waitlist core**

```js
function validateWaitlist(values) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email || '').trim())) {
    errors.email = '이메일 주소를 확인해 주세요.';
  }
  if (values.consent !== true) {
    errors.consent = '출시 알림을 받으려면 수집 동의가 필요합니다.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

async function submitWaitlist(values, { formId, fetchImpl = fetch } = {}) {
  const validation = validateWaitlist(values);
  if (!validation.valid) return { ok: false, type: 'validation', errors: validation.errors };
  if (!/^[a-z0-9]{8,}$/i.test(formId || '')) return { ok: false, type: 'configuration' };

  try {
    const response = await fetchImpl(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    return response.ok ? { ok: true } : { ok: false, type: 'remote', status: response.status };
  } catch (error) {
    return { ok: false, type: 'network', message: error.message };
  }
}
```

Validation must require a conventional email shape and `consent === true`; `need` remains optional in the product UI even though the test provides one.

- [ ] **Step 5: Implement deterministic configuration**

`scripts/configure-waitlist.js` must parse `--form-id`, reject IDs outside `/^[a-z0-9]{8,}$/i`, and write byte-identical UMD config files:

```js
const content = `(function (root) {
  root.OK_WAITLIST_CONFIG = Object.freeze({ formId: ${JSON.stringify(formId)} });
})(typeof globalThis !== 'undefined' ? globalThis : this);\n`;

await writeFile('waitlist.config.js', content);
await writeFile('public/waitlist.config.js', content);
```

Add this package script:

```json
"configure:waitlist": "node scripts/configure-waitlist.js"
```

Run: `npm run configure:waitlist -- --form-id "$FORM_ID"`

- [ ] **Step 6: Add the honest offer and form DOM**

Render below the completion ticket:

```html
<section class="waitlist-offer" aria-labelledby="waitlistTitle">
  <h3 id="waitlistTitle">여행과 일상에서 영어 때문에 원하는 것을 포기하지 않는 상황 훈련</h3>
  <p class="waitlist-price">월 9,900원 예정</p>
  <p>지금은 출시 알림 신청이며 결제되지 않습니다.</p>
  <form id="waitlistForm" novalidate>
    <label>이메일<input id="waitlistEmail" name="email" type="email" autocomplete="email" required></label>
    <label>가장 필요한 상황<select id="waitlistNeed" name="need">
      <option value="">선택하지 않음</option>
      <option value="여행 식당">여행 식당</option>
      <option value="카페 주문">카페 주문</option>
      <option value="호텔">호텔</option>
      <option value="쇼핑">쇼핑</option>
      <option value="교통">교통</option>
    </select></label>
    <label><input id="waitlistConsent" name="consent" type="checkbox" required>출시 알림과 인터뷰 연락을 위한 이메일 수집에 동의합니다.</label>
    <p class="waitlist-privacy">이메일은 출시 알림과 인터뷰 연락에만 사용합니다. 삭제 요청은 @ok.english.kr 인스타그램 DM으로 받습니다.</p>
    <button type="submit">이 가격으로 출시 알림 받기</button>
    <p id="waitlistStatus" role="status"></p>
  </form>
</section>
```

- [ ] **Step 7: Implement form behavior and script ordering**

Load scripts in this order: `waitlist.config.js`, `waitlist-core.js`, `waitlist.js`. Disable the submit button while pending. Preserve email and selections on any failure. Clear the form and show `출시 알림 신청이 완료됐습니다.` only when `result.ok === true`.

- [ ] **Step 8: Run unit tests and make a live Formspree test submission**

Run: `npm test`

Create a unique test address, complete the pack, and submit that exact value:

```bash
TEST_EMAIL="okenglish-mvp-test+$(date +%s)@example.com"
printf '%s\n' "$TEST_EMAIL"
```

Then confirm the exact `packId`, `need`, and printed email appear in the Formspree submissions dashboard. Delete the test submission afterward.

Expected: tests PASS and Formspree stores exactly one test row.

- [ ] **Step 9: Commit the waitlist slice**

```bash
git add waitlist-core.js waitlist.config.js waitlist.js public/waitlist-core.js public/waitlist.config.js public/waitlist.js scripts/configure-waitlist.js index.html public/index.html package.json tests/guided-mission.test.mjs
git commit -m "feat: validate visible-price launch interest"
```

### Task 4: Rebuild browser coverage, document, and deploy

**Files:**
- Modify: `tests/guided-mission.browser.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: complete static app, configured Formspree ID, GitHub Pages public URL.
- Produces: mobile end-to-end evidence, preserved legacy regressions, and activated public deployment.

- [ ] **Step 1: Rewrite the browser test for the real two-scene path**

Intercept `https://formspree.io/f/**` so automated tests never create real contacts. Cover:

```js
await page.getByRole('button', { name: '내 주문 완성하기' }).click();
await page.getByRole('button', { name: '말하고 확인하기' }).click();
await page.getByText('Everything except onions.').waitFor();
await page.getByRole('button', { name: '말했어요' }).click();
await page.getByRole('button', { name: '말하고 확인하기' }).click();
await page.getByText('Go easy on the sauce.').waitFor();
await page.getByRole('button', { name: '말했어요' }).click();
await page.getByRole('button', { name: '혼자 주문하기' }).click();
await page.getByRole('button', { name: '두 문장 말했어요' }).click();
await page.getByText('No pickles').waitFor();
await page.getByText('월 9,900원 예정').waitFor();
```

Also cover recognition success, recognition error, Formspree 200, Formspree 422 with preserved input, reload persistence, `?q=hello`, `?cat=...`, `?id=...`, bookmarks, and no horizontal overflow at 390x844 and 360x800.

- [ ] **Step 2: Run all automated verification**

Run: `npm test`

Run: `npm run test:browser`

Run: `npm audit --audit-level=high`

Run: `cmp index.html public/index.html`

Run: `cmp guided-mission.js public/guided-mission.js`

Run: `cmp guided-mission-core.js public/guided-mission-core.js`

Run: `cmp guided-missions.js public/guided-missions.js`

Run: `cmp waitlist-core.js public/waitlist-core.js`

Run: `cmp waitlist.config.js public/waitlist.config.js`

Run: `cmp waitlist.js public/waitlist.js`

Expected: every command exits 0.

- [ ] **Step 3: Update README with the customer path and operating boundary**

Document:

- Public URL `https://jokc28.github.io/ok-english-search/`
- Exact active Reel and two core patterns
- Two-scene flow and manual speech fallback
- `npm run configure:waitlist -- --form-id "$FORM_ID"`
- Formspree ownership, test-submission deletion, and contact export/deletion
- Instagram Insights profile-link taps as the initial visit denominator
- No live subscription, account, pronunciation score, or payment
- Legacy deep-link behavior

- [ ] **Step 4: Perform local visual verification**

Serve: `python3 -m http.server 8001 -d public`

Use Playwright at 390x844, 360x800, and 1440x1000. Capture intro, coached reveal, transfer result, waitlist error, and waitlist success screenshots. Verify no nested cards, text clipping, layout shifts, or competing first-view controls.

- [ ] **Step 5: Commit, push, and verify GitHub Pages activation**

```bash
git add tests/guided-mission.browser.mjs README.md
git commit -m "test: verify Reel-linked free pack journey"
git push origin main
```

Poll `https://jokc28.github.io/ok-english-search/` until fresh HTML contains all three markers:

- `해외 식당에서 원하는 대로 주문하기`
- `월 9,900원 예정`
- `waitlist.config.js`

Then repeat the mobile manual-fallback path on production, submit one real tagged test contact, confirm it in Formspree, delete it, and verify direct load plus refresh return HTTP 200 instead of 404.

- [ ] **Step 6: Record the production evidence**

Add the activation timestamp, deployed commit, production URL, test commands, and Formspree verification result to the implementation close-out. Do not claim funnel analytics until a real measurement ID or event path replaces `G-XXXXXXXXXX`.
