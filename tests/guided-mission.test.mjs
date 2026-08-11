import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const core = require(resolve('public/guided-mission-core.js'));
const packs = require(resolve('public/guided-missions.js'));

function read(path) {
  return readFileSync(resolve(path), 'utf8');
}

test('catalog exposes the active Subway builder choices in Korean', () => {
  assert.deepEqual(packs, [
    {
      id: 'subway-order-builder-01',
      headline: '써브웨이에서 내 취향대로 주문 만들기',
      remove_options: [
        { value: 'onions', label: '양파' },
        { value: 'pickles', label: '피클' },
        { value: 'jalapenos', label: '할라피뇨' }
      ],
      reduce_options: [
        { value: 'sauce', label: '소스' },
        { value: 'mayo', label: '마요' },
        { value: 'dressing', label: '드레싱' }
      ]
    }
  ]);
});

test('builder keeps order lines empty until it has two valid choices', () => {
  const initial = core.createBuilderState('subway-order-builder-01');
  const invalidRemove = core.selectRemove(initial, 'lettuce');
  const removeOnly = core.selectRemove(initial, 'onions');
  const invalidReduce = core.selectReduce(removeOnly, 'mustard');

  assert.deepEqual(core.buildOrder(initial), []);
  assert.deepEqual(core.buildOrder(invalidRemove), []);
  assert.deepEqual(core.buildOrder(removeOnly), []);
  assert.deepEqual(core.buildOrder(invalidReduce), []);
});

test('builder creates the selected removal and reduction sentences with Korean result labels', () => {
  const withRemove = core.selectRemove(
    core.createBuilderState('subway-order-builder-01'),
    'pickles'
  );
  const ready = core.selectReduce(withRemove, 'mayo');

  assert.deepEqual(core.buildOrder(ready), [
    { sentence: 'Everything except pickles.', resultLabel: '피클 완전히 제외' },
    { sentence: 'Go easy on the mayo.', resultLabel: '마요 양 줄이기' }
  ]);
  assert.equal(withRemove.reduce, null, 'selection must not mutate earlier state');
});

test('builder completion and reset preserve immutable completion history', () => {
  const ready = core.selectReduce(
    core.selectRemove(core.createBuilderState('subway-order-builder-01'), 'jalapenos'),
    'dressing'
  );
  const incomplete = core.completeOrder(core.createBuilderState('subway-order-builder-01'));
  const completed = core.completeOrder(ready);
  const reset = core.resetOrder(completed);

  assert.deepEqual(incomplete, {
    packId: 'subway-order-builder-01',
    remove: null,
    reduce: null,
    completed: false,
    completionCount: 0
  });
  assert.equal(completed.completed, true);
  assert.equal(completed.completionCount, 1);
  assert.deepEqual(core.buildOrder(completed), [
    { sentence: 'Everything except jalapenos.', resultLabel: '할라피뇨 완전히 제외' },
    { sentence: 'Go easy on the dressing.', resultLabel: '드레싱 양 줄이기' }
  ]);
  assert.deepEqual(reset, {
    packId: 'subway-order-builder-01',
    remove: null,
    reduce: null,
    completed: false,
    completionCount: 1
  });
  assert.equal(completed.completed, true, 'reset must not mutate completed state');
});

test('root and public builder assets remain byte-identical', () => {
  assert.equal(read('guided-mission-core.js'), read('public/guided-mission-core.js'));
  assert.equal(read('guided-missions.js'), read('public/guided-missions.js'));
});
