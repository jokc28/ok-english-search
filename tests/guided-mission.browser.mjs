import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const projectRoot = new URL('../', import.meta.url).pathname;
const publicRoot = new URL('../public/', import.meta.url).pathname;
const screenshotRoot = join(
  projectRoot,
  '.superpowers',
  'sdd',
  '2026-08-11-reel-situation-builder',
  'artifacts',
  'task-3-browser'
);
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
assert.ok(existsSync(chromePath), `Chrome not found: set CHROME_PATH (checked ${chromePath})`);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 1440, height: 1000 }
];

mkdirSync(screenshotRoot, { recursive: true });

const server = createServer((request, response) => {
  const requestPath = new URL(request.url, 'http://localhost').pathname;
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
  const filePath = normalize(join(publicRoot, relativePath));
  if (!filePath.startsWith(publicRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
  response.end(readFileSync(filePath));
});

function assertNoHorizontalOverflow(page, label) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    .then(noOverflow => assert.equal(noOverflow, true, `${label} must not overflow horizontally`));
}

async function capture(page, name, enabled) {
  if (!enabled) return;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(screenshotRoot, `mobile-${name}.png`) });
}

async function open(page, url, label) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, `${label} must load successfully`);
}

async function runViewportFlow(browser, baseUrl, viewport) {
  const context = await browser.newContext({ viewport });
  const pageErrors = [];
  const addPageErrorListener = page => page.on('pageerror', error => pageErrors.push(error.message));
  const page = await context.newPage();
  addPageErrorListener(page);
  const captureMobileEvidence = viewport.width === 390 && viewport.height === 844;

  try {
    await open(page, baseUrl, `${viewport.width}x${viewport.height} root entry`);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#builderComplete').waitFor();
    await page.evaluate(() => document.fonts?.ready);

    const introStage = page.locator('#guidedMissionApp > .mission-stage');
    const introBounds = await introStage.boundingBox();
    await page.waitForTimeout(150);
    assert.deepEqual(await introStage.boundingBox(), introBounds, 'the first builder view must not shift after loading');

    assert.equal(await page.locator('#guidedMissionHub').isVisible(), true);
    assert.equal(await page.locator('[role="tablist"]').count(), 0);
    assert.equal(await page.locator('#guidedMissionApp textarea').count(), 0);
    assert.equal(await page.locator('#guidedMissionApp [class*="speech"]').count(), 0);
    assert.equal(await page.locator('#guidedMissionApp form, #guidedMissionApp input, #guidedMissionApp select').count(), 0);
    assert.equal(await page.locator('#guidedMissionApp .mission-stage .mission-stage, #guidedMissionApp .mission-stage .card').count(), 0);
    assert.equal(await page.locator('#guidedMissionApp .mission-primary').count(), 1);
    assert.equal(await page.locator('#builderComplete').isDisabled(), true);
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} builder intro`);
    await capture(page, 'intro', captureMobileEvidence);

    await page.locator('[data-builder-remove="pickles"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.builderRemove), 'pickles');
    await page.locator('[data-builder-reduce="mayo"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.builderReduce), 'mayo');
    assert.equal(await page.locator('[data-builder-remove="pickles"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-builder-reduce="mayo"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#builderComplete').isDisabled(), false);
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} selected builder`);
    await capture(page, 'selected', captureMobileEvidence);

    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.builderReduce), 'dressing');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderComplete');
    await page.keyboard.press('Enter');
    await page.getByText('Everything except pickles.').waitFor();
    await page.getByText('Go easy on the mayo.').waitFor();
    await page.getByText('쓰임 구분').waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderCompleteHeading');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
      remove: 'pickles',
      reduce: 'mayo',
      completionCount: 1
    });
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} completed builder`);
    await capture(page, 'completed', captureMobileEvidence);

    await page.locator('#builderReset').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderHeading');
    assert.equal(await page.locator('#builderComplete').isDisabled(), true);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
      remove: null,
      reduce: null,
      completionCount: 1
    });

    await page.locator('[data-builder-remove="onions"]').click();
    await page.locator('[data-builder-reduce="sauce"]').click();
    await page.locator('#builderComplete').click();
    await page.locator('#builderDictionary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#dictionaryHub').isVisible(), true);
    assert.equal(await page.locator('#secondaryNav').isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'searchInput');
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} dictionary handoff`);
    await capture(page, 'legacy-handoff', captureMobileEvidence);

    const bookmarkButton = page.locator('.card-bookmark-btn').first();
    const bookmarkId = await bookmarkButton.getAttribute('data-id');
    await bookmarkButton.click();
    assert.equal(await page.evaluate(id => JSON.parse(localStorage.getItem('ok_english_bookmarks')).includes(Number(id)), bookmarkId), true);
    await page.locator('#headerBookmarkBtn').click();
    assert.equal(await page.locator('#dictionaryHub').isVisible(), true);
    assert.match(await page.locator('#resultCount').innerText(), /저장한 표현/);

    await page.locator('#builderHome').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#guidedMissionHub').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderCompleteHeading');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#builderComplete').waitFor();
    assert.equal(await page.locator('[data-builder-remove="onions"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-builder-reduce="sauce"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(id => JSON.parse(localStorage.getItem('ok_english_bookmarks')).includes(Number(id)), bookmarkId), true);
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} refreshed builder`);

    await page.locator('#builderComplete').click();
    await page.locator('#builderQuiz').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#quizHub').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'quizHubHeading');
    await assertNoHorizontalOverflow(page, `${viewport.width}x${viewport.height} quiz handoff`);
    await page.locator('#builderHome').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderCompleteHeading');
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('[data-builder-remove="onions"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-builder-reduce="sauce"]').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
      remove: 'onions',
      reduce: 'sauce',
      completionCount: 3
    });

    await page.locator('#secondaryNav [data-hub="situation"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'situationHubHeading');
    await page.locator('#builderHome').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'builderHeading');

    const deepLinkPage = await context.newPage();
    addPageErrorListener(deepLinkPage);
    await open(deepLinkPage, `${baseUrl}?q=hello`, `${viewport.width}x${viewport.height} q deep link`);
    assert.equal(await deepLinkPage.locator('#dictionaryHub').isVisible(), true);
    await assertNoHorizontalOverflow(deepLinkPage, `${viewport.width}x${viewport.height} q deep link`);

    const linkTargets = await deepLinkPage.evaluate(() => {
      const entry = REELS_DATA.find(item => (
        item.source_type === 'instagram_reel' &&
        item.target_confidence === 'verified' &&
        /^https:\/\/www\.instagram\.com\/reel\//.test(item.reel_url || '')
      ));
      return { category: entry.category, id: entry.id };
    });

    const categoryPage = await context.newPage();
    addPageErrorListener(categoryPage);
    await open(categoryPage, `${baseUrl}?cat=${encodeURIComponent(linkTargets.category)}`, `${viewport.width}x${viewport.height} category deep link`);
    assert.equal(await categoryPage.locator('#dictionaryHub').isVisible(), true);
    assert.equal(await categoryPage.locator(`.tag-pill[data-category="${linkTargets.category}"]`).getAttribute('class'), 'tag-pill active');
    await assertNoHorizontalOverflow(categoryPage, `${viewport.width}x${viewport.height} category deep link`);

    const idPage = await context.newPage();
    addPageErrorListener(idPage);
    await open(idPage, `${baseUrl}?id=${linkTargets.id}`, `${viewport.width}x${viewport.height} id deep link`);
    await idPage.locator(`#card-${linkTargets.id}`).waitFor();
    await assertNoHorizontalOverflow(idPage, `${viewport.width}x${viewport.height} id deep link`);

    assert.deepEqual(pageErrors, []);
  } finally {
    await context.close();
  }
}

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: chromePath });

try {
  for (const viewport of viewports) {
    await runViewportFlow(browser, baseUrl, viewport);
  }
  console.log('Reel situation builder browser flow passed at 360x800, 390x844, and 1440x1000');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
