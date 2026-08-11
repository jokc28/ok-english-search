import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const corePath = resolve('public/guided-mission-core.js');
const core = existsSync(corePath) ? require(corePath) : null;
const missionPath = resolve('public/guided-missions.js');
const missions = existsSync(missionPath) ? require(missionPath) : null;

function read(path) {
  return readFileSync(resolve(path), 'utf8');
}

test('guided mission core exists as a browser and Node module', () => {
  assert.ok(core, 'public/guided-mission-core.js must exist');
});

test('normalizes punctuation, apostrophes, and walk-in hyphens', () => {
  assert.equal(
    core.normalizeAttempt("  Are you TAKING walk-ins, right now? "),
    'are you taking walk ins right now'
  );
});

test('grades the direct spoken target by its three meaning-bearing parts', () => {
  assert.equal(core.gradeSpokenAttempt('Are you taking walk-ins right now?', 'direct').correct, true);
  assert.equal(core.gradeSpokenAttempt('Are you currently taking walk-ins?', 'direct').correct, true);
  assert.equal(core.gradeSpokenAttempt('Can I come in right now?', 'direct').correct, false);
  assert.equal(core.gradeSpokenAttempt('Do you take walk-ins?', 'direct').correct, false);
  assert.equal(core.gradeSpokenAttempt("We don't take walk-ins right now.", 'direct').correct, false);
  assert.equal(core.gradeSpokenAttempt('I take walk-ins right now.', 'direct').correct, false);
  assert.equal(core.gradeSpokenAttempt('Are you taking walk-ins, but not right now?', 'direct').correct, false);
  assert.equal(core.gradeSpokenAttempt('I asked, are you taking walk-ins right now?', 'direct').correct, false);
});

test('grades transfer only when policy and the new Saturday condition are both present', () => {
  assert.equal(core.gradeSpokenAttempt('Do you take walk-ins on Saturdays?', 'transfer').correct, true);
  assert.equal(core.gradeSpokenAttempt('Do you take walk-ins on weekends?', 'transfer').correct, true);
  assert.equal(core.gradeSpokenAttempt('Are you taking walk-ins right now?', 'transfer').correct, false);
  assert.equal(core.gradeSpokenAttempt('Are you taking walk-ins on Saturdays?', 'transfer').correct, false);
  assert.equal(core.gradeSpokenAttempt("We don't take walk-ins on Saturdays.", 'transfer').correct, false);
  assert.equal(core.gradeSpokenAttempt('I take walk-ins on Saturdays.', 'transfer').correct, false);
  assert.equal(core.gradeSpokenAttempt('Do you take walk-ins, but not on Saturdays?', 'transfer').correct, false);
  assert.equal(core.gradeSpokenAttempt('I asked if do you take walk-ins on Saturdays.', 'transfer').correct, false);
});

test('records unique obstacles and keeps the latest retry stage', () => {
  const initial = core.createInitialProgress('walk-ins-01');
  const afterIntent = core.recordObstacle(initial, 'intent');
  const repeatedIntent = core.recordObstacle(afterIntent, 'intent');
  const afterTransfer = core.recordObstacle(repeatedIntent, 'transfer');

  assert.deepEqual(afterTransfer.obstacles, ['intent', 'transfer']);
  assert.equal(afterTransfer.retryStage, 'transfer');
  assert.equal(initial.obstacles.length, 0, 'progress updates must not mutate earlier state');
});

test('mission catalog carries the complete shared learning contract', () => {
  assert.ok(Array.isArray(missions), 'public/guided-missions.js must export an array');
  assert.equal(missions.length, 1);

  const requiredKeys = [
    'id',
    'title',
    'desired_result',
    'scene',
    'first_attempt_prompt',
    'intent_distinction',
    'common_attempt',
    'obstacle',
    'meaning_bridge_steps',
    'target_expression',
    'assembly_slots',
    'spoken_prompt',
    'transfer_scenarios',
    'usage_boundary',
    'retry_stage',
    'sources'
  ];

  requiredKeys.forEach(key => assert.ok(missions[0][key], `mission is missing ${key}`));
  assert.equal(missions[0].meaning_bridge_steps.length, 3);
  assert.ok(missions[0].intent_distinction.options.some(option => option.correct));
  assert.equal(missions[0].transfer_scenarios[0].expected, 'Do you take walk-ins on Saturdays?');
});

test('root and public mission assets remain byte-identical', () => {
  assert.equal(read('guided-mission-core.js'), read('public/guided-mission-core.js'));
  assert.equal(read('guided-missions.js'), read('public/guided-missions.js'));
  assert.equal(read('index.html'), read('public/index.html'));
});

test('the product opens on a dedicated guided mission hub', () => {
  const html = read('public/index.html');
  assert.match(html, /class="hub-tab active" data-hub="mission"[^>]*>훈련 미션<\/button>/);
  assert.match(html, /<section class="hub-panel" id="guidedMissionHub">/);
  assert.match(html, /id="guidedMissionApp"/);
  assert.equal((html.match(/<button class="hub-tab/g) || []).length, 4);
});

test('the daily lookup lesson no longer appears before the product mission', () => {
  const html = read('public/index.html');
  const missionHub = html.indexOf('id="guidedMissionHub"');
  const dictionaryHub = html.indexOf('id="dictionaryHub"');
  const dailyCard = html.indexOf('id="dailyCard"');

  assert.ok(missionHub > -1 && dictionaryHub > missionHub);
  assert.ok(dailyCard > dictionaryHub, 'daily lesson must live inside the dictionary hub');
});

test('the MVP does not advertise capabilities that are not implemented', () => {
  const combined = `${read('public/index.html')}\n${read('public/guided-missions.js')}`;
  ['발음 점수', '음성 파일 저장', '기기 간 동기화', '구독 중'].forEach(claim => {
    assert.doesNotMatch(combined, new RegExp(claim));
  });
});

test('browser controller implements every stage of the guided loop', () => {
  const controllerPath = resolve('public/guided-mission.js');
  assert.ok(existsSync(controllerPath), 'public/guided-mission.js must exist');
  const controller = read('public/guided-mission.js');

  [
    'renderFirstAttempt',
    'renderIntent',
    'renderMeaning',
    'renderAssembly',
    'renderSpoken',
    'renderTransfer',
    'renderComplete'
  ].forEach(renderer => assert.match(controller, new RegExp(`function ${renderer}\\(`)));
});

test('controller persists progress and obstacle-aware retry data', () => {
  const controller = read('public/guided-mission.js');
  assert.match(controller, /ok_guided_mission_progress_v1/);
  assert.match(controller, /ok_guided_retry_queue_v1/);
  ['intent', 'meaning', 'assembly', 'spoken', 'transfer'].forEach(stage => {
    assert.match(controller, new RegExp(`recordObstacle\\(progress, '${stage}'\\)`));
  });
});

test('speech practice has recognition plus an explicit manual fallback', () => {
  const controller = read('public/guided-mission.js');
  assert.match(controller, /SpeechRecognition \|\| window\.webkitSpeechRecognition/);
  assert.match(controller, /음성 인식을 지원하지 않으면/);
  assert.match(controller, /소리 내어 말한 뒤 직접 입력/);
  assert.match(controller, /gradeSpokenAttempt/);
  assert.match(controller, /id="missionSpokenManual"/);
  assert.match(controller, /id="missionTransferManual"/);
  assert.match(controller, /spokenMethod/);
  assert.match(controller, /transferMethod/);
});

test('controller assets are synchronized and loaded after mission data', () => {
  assert.equal(read('guided-mission.js'), read('public/guided-mission.js'));
  const html = read('public/index.html');
  assert.match(html, /<script src="guided-mission-core\.js"><\/script>[\s\S]*<script src="guided-missions\.js"><\/script>[\s\S]*<script src="guided-mission\.js"><\/script>/);
});

test('the first mission is not covered by competing support or follow calls to action', () => {
  const html = read('public/index.html');
  const header = html.slice(html.indexOf('<header class="header">'), html.indexOf('</header>'));
  assert.doesNotMatch(header, /id="headerSponsorLink"/);
  assert.match(html, /if \(activeHub === 'mission'\) return;/);
  assert.match(html, /if \(hub === 'mission'\)[\s\S]*bottomBar\.classList\.remove\('visible'\)/);
});

test('dictionary deep links and the saved-expression button reveal their results', () => {
  const html = read('public/index.html');
  assert.match(html, /headerBookmarkBtn\.addEventListener\('click',[\s\S]*switchHub\('dictionary'\)/);
  assert.match(html, /const opensDictionary = params\.get\('q'\) \|\| params\.get\('cat'\) \|\| params\.get\('id'\);/);
  assert.match(html, /if \(opensDictionary\) switchHub\('dictionary'\);/);
});

test('intent feedback analyzes the submitted attempt instead of relabeling the fixed example', () => {
  const controller = read('public/guided-mission.js');
  assert.match(controller, /function describeFirstAttempt\(/);
  assert.match(controller, /첫 시도에 핵심 의미가 모두 들어 있습니다/);
  assert.doesNotMatch(controller, /<strong>첫 시도의 걸림돌<\/strong>/);
});
