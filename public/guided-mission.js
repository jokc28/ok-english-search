(function () {
  'use strict';

  const app = document.getElementById('guidedMissionApp');
  const pack = window.GUIDED_MISSIONS?.find(item => item.id === 'subway-order-builder-01');
  const core = window.GuidedMissionCore;
  const STORAGE_KEY = 'ok_reel_builder_v1';
  if (!app || !pack || !core) return;

  let state = loadState();

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadState() {
    const initial = core.createBuilderState(pack.id);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return initial;

      const withRemove = core.selectRemove(initial, saved.remove);
      const withChoices = core.selectReduce(withRemove, saved.reduce);
      return {
        ...withChoices,
        completionCount: Number.isSafeInteger(saved.completionCount) && saved.completionCount >= 0
          ? saved.completionCount
          : 0
      };
    } catch {
      return initial;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      remove: state.remove,
      reduce: state.reduce,
      completionCount: state.completionCount
    }));
  }

  function choiceGroup(title, field, options, selectedValue) {
    return `
      <section class="mission-choice-group" aria-labelledby="${field}Label">
        <div class="mission-choice-label" id="${field}Label">${escapeHtml(title)}</div>
        <div class="mission-options mission-chip-row">
          ${options.map(option => `
            <button class="mission-option mission-chip ${selectedValue === option.value ? 'selected' : ''}" data-builder-${field}="${escapeHtml(option.value)}" type="button" aria-pressed="${selectedValue === option.value}">${escapeHtml(option.label)}</button>
          `).join('')}
        </div>
      </section>`;
  }

  function renderBuilder() {
    const canBuild = core.buildOrder(state).length === 2;
    app.innerHTML = `
      <section class="mission-stage builder-stage">
        <div class="mission-kicker">REEL ORDER MAKER</div>
        <h2>${escapeHtml(pack.headline)}</h2>
        <p class="mission-copy">원하는 주문을 고르면, 직원에게 바로 말할 영어 두 문장이 완성됩니다.</p>
        <div class="mission-example"><strong>완성 예</strong><br><span>Everything except pickles.</span><br><span>Go easy on the mayo.</span></div>
        ${choiceGroup('완전히 빼기', 'remove', pack.remove_options, state.remove)}
        ${choiceGroup('양 줄이기', 'reduce', pack.reduce_options, state.reduce)}
        <div class="mission-actions single">
          <button class="mission-primary" id="builderComplete" type="button" ${canBuild ? '' : 'disabled'}>영어 주문 만들기</button>
        </div>
      </section>`;

    app.querySelectorAll('[data-builder-remove]').forEach(button => {
      button.addEventListener('click', () => {
        state = core.selectRemove(state, button.dataset.builderRemove);
        saveState();
        renderBuilder();
      });
    });
    app.querySelectorAll('[data-builder-reduce]').forEach(button => {
      button.addEventListener('click', () => {
        state = core.selectReduce(state, button.dataset.builderReduce);
        saveState();
        renderBuilder();
      });
    });
    document.getElementById('builderComplete').addEventListener('click', () => {
      state = core.completeOrder(state);
      saveState();
      renderComplete();
    });
  }

  function renderComplete() {
    const lines = core.buildOrder(state);
    app.innerHTML = `
      <section class="mission-stage builder-stage">
        <div class="mission-kicker">ORDER READY</div>
        <h2>영어 주문이 완성됐어요</h2>
        <div class="mission-result-box">
          ${lines.map(line => `<div class="mission-result-line"><strong>${escapeHtml(line.resultLabel)}</strong><span>${escapeHtml(line.sentence)}</span></div>`).join('')}
        </div>
        <div class="mission-meaning-box"><strong>쓰임 구분</strong><br><code>Everything except ...</code>는 재료를 완전히 빼고, <code>Go easy on ...</code>은 양이나 강도를 줄여 달라고 할 때 씁니다.</div>
        <div class="mission-actions builder-result-actions">
          <button class="mission-secondary" id="builderReset" type="button">다른 조합 만들기</button>
          <button class="mission-secondary" id="builderQuiz" type="button">10초 퀴즈 더 풀기</button>
          <button class="mission-secondary" id="builderDictionary" type="button">표현 사전에서 더 찾기</button>
        </div>
      </section>`;

    document.getElementById('builderReset').addEventListener('click', () => {
      state = core.resetOrder(state);
      saveState();
      renderBuilder();
    });
    document.getElementById('builderQuiz').addEventListener('click', () => window.okEnglishSwitchHub?.('quiz'));
    document.getElementById('builderDictionary').addEventListener('click', () => window.okEnglishSwitchHub?.('dictionary'));
  }

  renderBuilder();
})();
