(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuidedMissionCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
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

  return {
    normalizeAttempt,
    gradeSpokenAttempt,
    createInitialProgress,
    recordObstacle
  };
});
