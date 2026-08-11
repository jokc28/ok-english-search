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
    localStorage.removeItem('ok_guided_mission_progress_v1');
    localStorage.removeItem('ok_guided_retry_queue_v1');
    location.reload();
  });
  await page.waitForLoadState('domcontentloaded');

  assert.equal(await page.locator('.hub-tab.active').textContent(), '훈련 미션');
  await page.locator('#missionFirstAttempt').fill('Can I enter?');
  await page.locator('#missionFirstNext').click();
  await page.locator('[data-intent="entry-permission"]').click();
  await page.locator('#missionIntentNext').click();
  await page.locator('[data-meaning="walk-inside"]').click();
  await page.locator('#missionMeaningNext').click();
  await page.locator('[data-meaning="unbooked-customer"]').click();
  await page.locator('#missionMeaningNext').click();
  await page.locator('[data-meaning="accept-serve"]').click();
  await page.locator('#missionMeaningNext').click();
  await page.locator('#missionSlot0').selectOption('Are you taking');
  await page.locator('#missionSlot1').selectOption('walk-ins');
  await page.locator('#missionSlot2').selectOption('right now?');
  await page.locator('#missionAssemblyCheck').click();
  await page.locator('#missionAssemblyCheck').click();

  assert.equal(await page.locator('#missionSpokenAttempt').getAttribute('readonly'), '');
  assert.equal(await page.locator('#missionSpokenCheck').isDisabled(), true);
  await page.locator('#missionSpokenManual').click();
  assert.equal(await page.locator('#missionSpokenAttempt').getAttribute('readonly'), null);
  await page.locator('#missionSpokenAttempt').fill('Are you taking walk-ins right now?');
  await page.locator('#missionSpokenCheck').click();
  await page.locator('#missionSpokenCheck').click();

  assert.equal(await page.locator('#missionTransferAttempt').getAttribute('readonly'), '');
  await page.locator('#missionTransferManual').click();
  await page.locator('#missionTransferAttempt').fill('Do you take walk-ins on Saturdays?');
  await page.locator('#missionTransferCheck').click();
  await page.locator('#missionTransferCheck').click();
  await page.getByText('같은 의미를 두 장면에서 직접 꺼냈습니다').waitFor();

  const saved = await page.evaluate(() => ({
    progress: JSON.parse(localStorage.getItem('ok_guided_mission_progress_v1')),
    retry: JSON.parse(localStorage.getItem('ok_guided_retry_queue_v1'))
  }));
  assert.equal(saved.progress.completed, true);
  assert.deepEqual(saved.progress.obstacles, ['intent', 'meaning']);
  assert.equal(saved.retry[0].retryStage, 'meaning');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('같은 의미를 두 장면에서 직접 꺼냈습니다').waitFor();
  await page.locator('#missionRetry').click();
  await page.getByText('`walk in`이 이 장면에서 보여주는 움직임은?').waitFor();

  const exactPage = await context.newPage();
  await exactPage.goto(`${baseUrl}?exact=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await exactPage.evaluate(() => localStorage.removeItem('ok_guided_mission_progress_v1'));
  await exactPage.reload({ waitUntil: 'domcontentloaded' });
  await exactPage.locator('#missionFirstAttempt').fill('Are you taking walk-ins right now?');
  await exactPage.locator('#missionFirstNext').click();
  await exactPage.locator('[data-intent="current-capacity"]').click();
  await exactPage.getByText('첫 시도에 핵심 의미가 모두 들어 있습니다').waitFor();

  const deepLinkPage = await context.newPage();
  await deepLinkPage.goto(`${baseUrl}?q=hello`, { waitUntil: 'domcontentloaded' });
  assert.equal(await deepLinkPage.locator('#dictionaryHub').isVisible(), true);
  assert.equal(await deepLinkPage.locator('.hub-tab.active').textContent(), '표현 사전');

  const linkTargets = await deepLinkPage.evaluate(() => {
    const entry = REELS_DATA.find(item => (
      item.source_type === 'instagram_reel' &&
      item.target_confidence === 'verified' &&
      /^https:\/\/www\.instagram\.com\/reel\//.test(item.reel_url || '')
    ));
    return { category: entry.category, id: entry.id };
  });

  const categoryPage = await context.newPage();
  await categoryPage.goto(`${baseUrl}?cat=${encodeURIComponent(linkTargets.category)}`, { waitUntil: 'domcontentloaded' });
  assert.equal(await categoryPage.locator('#dictionaryHub').isVisible(), true);
  assert.equal(await categoryPage.locator(`.tag-pill[data-category="${linkTargets.category}"]`).getAttribute('class'), 'tag-pill active');

  const idPage = await context.newPage();
  await idPage.goto(`${baseUrl}?id=${linkTargets.id}`, { waitUntil: 'domcontentloaded' });
  assert.equal(await idPage.locator('#dictionaryHub').isVisible(), true);
  await idPage.locator(`#card-${linkTargets.id}`).waitFor();

  const bookmarkPage = await context.newPage();
  await bookmarkPage.goto(`${baseUrl}?bookmark=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await bookmarkPage.locator('#headerBookmarkBtn').click();
  assert.equal(await bookmarkPage.locator('#dictionaryHub').isVisible(), true);

  const ctaPage = await context.newPage();
  await ctaPage.goto(`${baseUrl}?cta=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await ctaPage.locator('.hub-tab[data-hub="dictionary"]').click();
  await ctaPage.waitForTimeout(3200);
  assert.equal(await ctaPage.locator('#bottomBar').getAttribute('class'), 'bottom-bar visible');
  await ctaPage.locator('.hub-tab[data-hub="mission"]').click();
  assert.equal(await ctaPage.locator('#bottomBar').getAttribute('class'), 'bottom-bar');

  await context.addInitScript(() => {
    class FakeSpeechRecognition {
      start() {
        setTimeout(() => {
          if (window.__speechMode === 'error') {
            this.onerror?.({ error: 'no-speech' });
            return;
          }
          this.onresult?.({ results: [[{ transcript: window.__speechTranscript }]] });
        }, 0);
      }
    }
    window.SpeechRecognition = FakeSpeechRecognition;
    window.webkitSpeechRecognition = FakeSpeechRecognition;
  });

  const recognitionPage = await context.newPage();
  await recognitionPage.goto(`${baseUrl}?recognition=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await recognitionPage.evaluate(() => {
    localStorage.setItem('ok_guided_mission_progress_v1', JSON.stringify({
      missionId: 'walk-ins-01',
      stage: 'spoken',
      completed: false,
      attempts: {},
      obstacles: [],
      retryStage: null
    }));
  });
  await recognitionPage.reload({ waitUntil: 'domcontentloaded' });
  await recognitionPage.evaluate(() => {
    window.__speechMode = 'success';
    window.__speechTranscript = 'Are you taking walk-ins right now?';
  });
  await recognitionPage.locator('#missionSpokenButton').click();
  await recognitionPage.waitForFunction(() => document.getElementById('missionSpokenAttempt').value.includes('right now'));
  assert.equal(await recognitionPage.locator('#missionSpokenAttempt').getAttribute('readonly'), null);
  assert.equal(await recognitionPage.evaluate(() => JSON.parse(localStorage.getItem('ok_guided_mission_progress_v1')).attempts.spokenMethod), 'recognition');
  await recognitionPage.locator('#missionSpokenCheck').click();
  await recognitionPage.locator('#missionSpokenCheck').click();

  await recognitionPage.evaluate(() => {
    window.__speechMode = 'error';
    window.__speechTranscript = '';
  });
  await recognitionPage.locator('#missionTransferButton').click();
  await recognitionPage.getByText('음성을 확인하지 못했습니다').waitFor();
  assert.equal(await recognitionPage.locator('#missionTransferAttempt').getAttribute('readonly'), '');
  assert.equal(await recognitionPage.locator('#missionTransferCheck').isDisabled(), true);

  await recognitionPage.evaluate(() => {
    window.__speechMode = 'success';
    window.__speechTranscript = 'Do you take walk-ins on Saturdays?';
  });
  await recognitionPage.locator('#missionTransferButton').click();
  await recognitionPage.waitForFunction(() => document.getElementById('missionTransferAttempt').value.includes('Saturdays'));
  assert.equal(await recognitionPage.evaluate(() => JSON.parse(localStorage.getItem('ok_guided_mission_progress_v1')).attempts.transferMethod), 'recognition');

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.deepEqual(pageErrors, []);
  console.log('Guided mission browser flow passed');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
