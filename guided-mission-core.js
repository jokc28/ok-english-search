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
    createBuilderState,
    selectRemove,
    selectReduce,
    buildOrder,
    completeOrder,
    resetOrder
  };
});
