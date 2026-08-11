import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const publicRoot = new URL('../public/', import.meta.url).pathname;
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
assert.ok(existsSync(chromePath), `Chrome not found: set CHROME_PATH (checked ${chromePath})`);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
};

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

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: chromePath });

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.removeItem('ok_reel_builder_v1');
    localStorage.removeItem('ok_guided_mission_progress_v1');
    localStorage.removeItem('ok_guided_retry_queue_v1');
    location.reload();
  });
  await page.waitForLoadState('domcontentloaded');
  await page.locator('#builderComplete').waitFor();

  assert.equal(await page.locator('#guidedMissionHub').isVisible(), true);
  assert.equal(await page.locator('[role="tablist"]').count(), 0);
  assert.equal(await page.locator('#guidedMissionApp textarea').count(), 0);
  assert.equal(await page.locator('#guidedMissionApp [class*="speech"]').count(), 0);
  assert.equal(await page.locator('#guidedMissionApp .mission-primary').count(), 1);
  assert.equal(await page.locator('#builderComplete').isDisabled(), true);

  await page.locator('[data-builder-remove="pickles"]').click();
  await page.locator('[data-builder-reduce="mayo"]').click();
  assert.equal(await page.locator('[data-builder-remove="pickles"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-builder-reduce="mayo"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#builderComplete').isDisabled(), false);

  await page.locator('#builderComplete').click();
  await page.getByText('Everything except pickles.').waitFor();
  await page.getByText('Go easy on the mayo.').waitFor();
  await page.getByText('쓰임 구분').waitFor();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
    remove: 'pickles',
    reduce: 'mayo',
    completionCount: 1
  });

  await page.locator('#builderReset').click();
  assert.equal(await page.locator('#builderComplete').isDisabled(), true);
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
    remove: null,
    reduce: null,
    completionCount: 1
  });

  await page.locator('[data-builder-remove="onions"]').click();
  await page.locator('[data-builder-reduce="sauce"]').click();
  await page.locator('#builderComplete').click();
  await page.locator('#builderDictionary').click();
  assert.equal(await page.locator('#dictionaryHub').isVisible(), true);
  assert.equal(await page.locator('#secondaryNav').isVisible(), false);

  await page.locator('#builderHome').click();
  assert.equal(await page.locator('#guidedMissionHub').isVisible(), true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#builderComplete').waitFor();
  assert.equal(await page.locator('[data-builder-remove="onions"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-builder-reduce="sauce"]').getAttribute('aria-pressed'), 'true');

  await page.locator('#builderComplete').click();
  await page.locator('#builderQuiz').click();
  assert.equal(await page.locator('#quizHub').isVisible(), true);
  await page.locator('#builderHome').click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('[data-builder-remove="onions"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-builder-reduce="sauce"]').getAttribute('aria-pressed'), 'true');
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('ok_reel_builder_v1'))), {
    remove: 'onions',
    reduce: 'sauce',
    completionCount: 3
  });

  const deepLinkPage = await context.newPage();
  deepLinkPage.on('pageerror', error => pageErrors.push(error.message));
  await deepLinkPage.goto(`${baseUrl}?q=hello`, { waitUntil: 'domcontentloaded' });
  assert.equal(await deepLinkPage.locator('#dictionaryHub').isVisible(), true);

  const linkTargets = await deepLinkPage.evaluate(() => {
    const entry = REELS_DATA.find(item => (
      item.source_type === 'instagram_reel' &&
      item.target_confidence === 'verified' &&
      /^https:\/\/www\.instagram\.com\/reel\//.test(item.reel_url || '')
    ));
    return { category: entry.category, id: entry.id };
  });

  const categoryPage = await context.newPage();
  categoryPage.on('pageerror', error => pageErrors.push(error.message));
  await categoryPage.goto(`${baseUrl}?cat=${encodeURIComponent(linkTargets.category)}`, { waitUntil: 'domcontentloaded' });
  assert.equal(await categoryPage.locator('#dictionaryHub').isVisible(), true);
  assert.equal(await categoryPage.locator(`.tag-pill[data-category="${linkTargets.category}"]`).getAttribute('class'), 'tag-pill active');

  const idPage = await context.newPage();
  idPage.on('pageerror', error => pageErrors.push(error.message));
  await idPage.goto(`${baseUrl}?id=${linkTargets.id}`, { waitUntil: 'domcontentloaded' });
  await idPage.locator(`#card-${linkTargets.id}`).waitFor();

  const bookmarkPage = await context.newPage();
  bookmarkPage.on('pageerror', error => pageErrors.push(error.message));
  await bookmarkPage.goto(`${baseUrl}?bookmark=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await bookmarkPage.locator('#headerBookmarkBtn').click();
  assert.equal(await bookmarkPage.locator('#dictionaryHub').isVisible(), true);

  for (const viewport of [{ width: 360, height: 800 }, { width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const responsivePage = await context.newPage();
    responsivePage.on('pageerror', error => pageErrors.push(error.message));
    await responsivePage.setViewportSize(viewport);
    await responsivePage.goto(`${baseUrl}?viewport=${viewport.width}`, { waitUntil: 'domcontentloaded' });
    assert.equal(await responsivePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await responsivePage.close();
  }

  assert.deepEqual(pageErrors, []);
  console.log('Reel situation builder browser flow passed');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
