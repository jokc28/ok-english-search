(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuidedMissionCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const PACK_ID = 'subway-order-builder-01';
  const removeLabels = {
    onions: '양파',
    pickles: '피클',
    jalapenos: '할라피뇨'
  };
  const reduceLabels = {
    sauce: '소스',
    mayo: '마요',
    dressing: '드레싱'
  };

  function isKnownOption(options, value) {
    return Object.prototype.hasOwnProperty.call(options, value);
  }

  function normalizeAttempt(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[-–—]/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function gradeSpokenAttempt(value, expectedVariant) {
    const normalized = normalizeAttempt(value);
    const directQuestion = /^(?:are you currently taking walk ins?|are you taking walk ins? (?:right now|at the moment|currently))$/.test(normalized);
    const transferQuestion = /^do you take walk ins? (?:on )?(?:saturdays?|weekends?)$/.test(normalized);
    const checks = expectedVariant === 'transfer'
      ? [
          { key: 'question-form', matched: transferQuestion },
          { key: 'accept', matched: /\b(?:take|taking)\b/.test(normalized) },
          { key: 'customer', matched: /\bwalk ins?\b/.test(normalized) },
          { key: 'new-condition', matched: /\b(?:saturdays?|weekends?)\b/.test(normalized) }
        ]
      : [
          { key: 'question-form', matched: directQuestion },
          { key: 'accept', matched: /\b(?:take|taking)\b/.test(normalized) },
          { key: 'customer', matched: /\bwalk ins?\b/.test(normalized) },
          { key: 'current-time', matched: /\b(?:right now|at the moment|currently)\b/.test(normalized) }
        ];

    const missing = checks.filter(check => !check.matched).map(check => check.key);
    return { correct: missing.length === 0, missing, normalized };
  }

  function createInitialProgress(missionId) {
    return {
      missionId,
      stage: 'first-attempt',
      completed: false,
      attempts: {},
      obstacles: [],
      retryStage: null,
      updatedAt: new Date().toISOString()
    };
  }

  function recordObstacle(progress, stage) {
    const obstacles = progress.obstacles.includes(stage)
      ? [...progress.obstacles]
      : [...progress.obstacles, stage];

    return {
      ...progress,
      obstacles,
      retryStage: stage,
      updatedAt: new Date().toISOString()
    };
  }

  function createBuilderState(packId) {
    return {
      packId,
      remove: null,
      reduce: null,
      completed: false,
      completionCount: 0
    };
  }

  function selectRemove(state, ingredient) {
    return {
      ...state,
      remove: isKnownOption(removeLabels, ingredient) ? ingredient : null,
      completed: false
    };
  }

  function selectReduce(state, item) {
    return {
      ...state,
      reduce: isKnownOption(reduceLabels, item) ? item : null,
      completed: false
    };
  }

  function buildOrder(state) {
    if (
      state.packId !== PACK_ID ||
      !isKnownOption(removeLabels, state.remove) ||
      !isKnownOption(reduceLabels, state.reduce)
    ) {
      return [];
    }

    return [
      {
        sentence: `Everything except ${state.remove}.`,
        resultLabel: `${removeLabels[state.remove]} 완전히 제외`
      },
      {
        sentence: `Go easy on the ${state.reduce}.`,
        resultLabel: `${reduceLabels[state.reduce]} 양 줄이기`
      }
    ];
  }

  function completeOrder(state) {
    if (buildOrder(state).length === 0 || state.completed) return { ...state };

    return {
      ...state,
      completed: true,
      completionCount: state.completionCount + 1
    };
  }

  function resetOrder(state) {
    return {
      ...state,
      remove: null,
      reduce: null,
      completed: false
    };
  }

  return {
    normalizeAttempt,
    gradeSpokenAttempt,
    createInitialProgress,
    recordObstacle,
    createBuilderState,
    selectRemove,
    selectReduce,
    buildOrder,
    completeOrder,
    resetOrder
  };
});
