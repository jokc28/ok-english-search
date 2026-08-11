(function () {
  'use strict';

  const app = document.getElementById('guidedMissionApp');
  const mission = window.GUIDED_MISSIONS && window.GUIDED_MISSIONS[0];
  const core = window.GuidedMissionCore;
  if (!app || !mission || !core) return;

  const PROGRESS_KEY = 'ok_guided_mission_progress_v1';
  const RETRY_KEY = 'ok_guided_retry_queue_v1';
  const STAGES = ['first-attempt', 'intent', 'meaning', 'assembly', 'spoken', 'transfer'];
  let progress = loadProgress();

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
      if (saved?.missionId === mission.id && (STAGES.includes(saved.stage) || saved.stage === 'complete')) {
        return {
          ...core.createInitialProgress(mission.id),
          ...saved,
          attempts: saved.attempts || {},
          obstacles: Array.isArray(saved.obstacles) ? saved.obstacles : []
        };
      }
    } catch {}
    return core.createInitialProgress(mission.id);
  }

  function saveProgress() {
    progress.updatedAt = new Date().toISOString();
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    syncRetryQueue();
  }

  function syncRetryQueue() {
    let queue = [];
    try {
      queue = JSON.parse(localStorage.getItem(RETRY_KEY) || '[]');
      if (!Array.isArray(queue)) queue = [];
    } catch {
      queue = [];
    }

    const existing = queue.find(item => item.missionId === mission.id);
    queue = queue.filter(item => item.missionId !== mission.id);
    if (progress.retryStage) {
      queue.push({
        missionId: mission.id,
        title: mission.title,
        retryStage: progress.retryStage,
        obstacles: [...progress.obstacles],
        updatedAt: progress.updatedAt,
        nextReviewAt: existing?.nextReviewAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }
    localStorage.setItem(RETRY_KEY, JSON.stringify(queue));
  }

  function setStage(stage, attempts = {}) {
    progress = {
      ...progress,
      stage,
      completed: stage === 'complete',
      attempts: { ...progress.attempts, ...attempts }
    };
    saveProgress();
    render();
    document.getElementById('guidedMissionHub')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function progressBars() {
    const current = progress.stage === 'complete' ? STAGES.length : Math.max(0, STAGES.indexOf(progress.stage));
    return `
      <div class="mission-progress" aria-label="미션 진행 ${Math.min(current + 1, STAGES.length)}단계 / ${STAGES.length}단계">
        ${STAGES.map((_, index) => `<span class="${index < current ? 'done' : index === current ? 'active' : ''}"></span>`).join('')}
      </div>`;
  }

  function stageFrame(step, title, body) {
    return `
      <div class="mission-stage">
        ${progressBars()}
        <div class="mission-step-label">${escapeHtml(step)}</div>
        <h3>${escapeHtml(title)}</h3>
        ${body}
      </div>`;
  }

  function startRecognition(targetId, onResult) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const target = document.getElementById(targetId);
    const status = document.getElementById(`${targetId}Status`);

    if (!SpeechRecognition) {
      if (status) status.textContent = '이 브라우저가 음성 인식을 지원하지 않으면, 소리 내어 말한 뒤 직접 입력해 확인하세요.';
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    if (status) status.textContent = '듣고 있습니다. 문장을 한 번 말해 주세요.';

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript.trim();
      if (target) target.value = transcript;
      if (status) status.textContent = `인식된 문장: ${transcript}`;
      onResult(transcript);
    };
    recognition.onerror = () => {
      if (status) status.textContent = '음성을 확인하지 못했습니다. 소리 내어 말한 뒤 직접 입력해도 됩니다.';
      target?.focus();
    };
    recognition.start();
    return true;
  }

  function renderFirstAttempt() {
    const savedAttempt = progress.attempts.firstAttempt || '';
    app.innerHTML = stageFrame(
      '1 / 6 · 먼저 말하기',
      '지금 직원에게 뭐라고 물어볼까요?',
      `
        <p class="mission-copy">${escapeHtml(mission.first_attempt_prompt)}</p>
        <div class="mission-scene"><strong>장면</strong><br>${escapeHtml(mission.scene)}</div>
        <textarea class="mission-textarea" id="missionFirstAttempt" placeholder="아는 영어로 먼저 적거나 말해 보세요.">${escapeHtml(savedAttempt)}</textarea>
        <div class="mission-speech-row">
          <button class="mission-speech-button" id="missionFirstSpeak" type="button">음성으로 먼저 말하기</button>
          <div class="mission-copy" id="missionFirstAttemptStatus">정답을 보기 전에 내 문장을 남겨야 다음으로 갈 수 있습니다.</div>
        </div>
        <div class="mission-actions single">
          <button class="mission-primary" id="missionFirstNext" type="button" ${savedAttempt.trim() ? '' : 'disabled'}>다음: 필요한 의미 찾기</button>
        </div>`
    );

    const input = document.getElementById('missionFirstAttempt');
    const next = document.getElementById('missionFirstNext');
    input.addEventListener('input', () => { next.disabled = !input.value.trim(); });
    document.getElementById('missionFirstSpeak').addEventListener('click', () => {
      startRecognition('missionFirstAttempt', transcript => { next.disabled = !transcript; });
    });
    next.addEventListener('click', () => {
      const value = input.value.trim();
      if (!value) return;
      setStage('intent', { firstAttempt: value });
    });
  }

  function describeFirstAttempt(value) {
    const result = core.gradeSpokenAttempt(value, 'direct');
    if (result.correct) return '첫 시도에 핵심 의미가 모두 들어 있습니다. 이제 각 단어가 그 의미를 만드는 방식을 확인합니다.';

    const labels = {
      'question-form': '직원에게 현재 가능 여부를 묻는 질문 형태',
      accept: '`take`로 손님을 받는 의미',
      customer: '`walk-ins`라는 예약 없는 손님 유형',
      'current-time': '`right now`라는 현재 조건'
    };
    const missing = result.missing.map(key => labels[key]).filter(Boolean);
    return `목표 표현을 기준으로 보면 ${missing.join(', ')}이 아직 명확히 드러나지 않습니다.`;
  }

  function renderIntent() {
    const selectedId = progress.attempts.intentChoice;
    const selected = mission.intent_distinction.options.find(option => option.id === selectedId);
    const options = mission.intent_distinction.options.map(option => {
      const stateClass = selectedId
        ? option.correct ? 'correct' : option.id === selectedId ? 'wrong' : ''
        : '';
      return `<button class="mission-option ${stateClass}" data-intent="${option.id}" type="button" ${selectedId ? 'disabled' : ''}>${escapeHtml(option.label)}</button>`;
    }).join('');

    app.innerHTML = stageFrame(
      '2 / 6 · 걸림돌 찾기',
      mission.intent_distinction.question,
      `
        <p class="mission-copy">내 첫 문장: <strong>${escapeHtml(progress.attempts.firstAttempt)}</strong></p>
        <div class="mission-options">${options}</div>
        ${selected ? `
          <div class="mission-feedback ${selected.correct ? 'correct' : 'wrong'}">${escapeHtml(selected.feedback)}</div>
          <div class="mission-meaning-box"><strong>내 첫 시도 점검</strong><br>${escapeHtml(describeFirstAttempt(progress.attempts.firstAttempt))}</div>
          <div class="mission-meaning-box"><strong>비교 문장: ${escapeHtml(mission.common_attempt)}</strong><br>${escapeHtml(mission.obstacle)}</div>
          <div class="mission-actions single"><button class="mission-primary" id="missionIntentNext" type="button">다음: 표현의 뜻 만들기</button></div>` : ''}`
    );

    app.querySelectorAll('[data-intent]').forEach(button => {
      button.addEventListener('click', () => {
        const choice = mission.intent_distinction.options.find(option => option.id === button.dataset.intent);
        if (!choice.correct) progress = core.recordObstacle(progress, 'intent');
        progress.attempts.intentChoice = choice.id;
        saveProgress();
        renderIntent();
      });
    });
    document.getElementById('missionIntentNext')?.addEventListener('click', () => {
      setStage('meaning', { meaningIndex: 0, meaningAnswers: progress.attempts.meaningAnswers || {} });
    });
  }

  function renderMeaning() {
    const index = Number(progress.attempts.meaningIndex || 0);
    const step = mission.meaning_bridge_steps[index];
    const answers = progress.attempts.meaningAnswers || {};
    const selectedId = answers[step.id];
    const selected = step.options.find(option => option.id === selectedId);
    const options = step.options.map(option => {
      const stateClass = selectedId
        ? option.correct ? 'correct' : option.id === selectedId ? 'wrong' : ''
        : '';
      return `<button class="mission-option ${stateClass}" data-meaning="${option.id}" type="button" ${selectedId ? 'disabled' : ''}>${escapeHtml(option.label)}</button>`;
    }).join('');

    app.innerHTML = stageFrame(
      `3 / 6 · 뜻 만들기 ${index + 1} / ${mission.meaning_bridge_steps.length}`,
      step.prompt,
      `
        <div class="mission-options">${options}</div>
        ${selected ? `
          <div class="mission-feedback ${selected.correct ? 'correct' : 'wrong'}">${escapeHtml(step.explanation)}</div>
          <div class="mission-actions single"><button class="mission-primary" id="missionMeaningNext" type="button">${index + 1 === mission.meaning_bridge_steps.length ? '다음: 문장 조립하기' : '다음 의미 연결하기'}</button></div>` : ''}`
    );

    app.querySelectorAll('[data-meaning]').forEach(button => {
      button.addEventListener('click', () => {
        const choice = step.options.find(option => option.id === button.dataset.meaning);
        if (!choice.correct) progress = core.recordObstacle(progress, 'meaning');
        progress.attempts.meaningAnswers = { ...answers, [step.id]: choice.id };
        saveProgress();
        renderMeaning();
      });
    });
    document.getElementById('missionMeaningNext')?.addEventListener('click', () => {
      if (index + 1 < mission.meaning_bridge_steps.length) {
        progress.attempts.meaningIndex = index + 1;
        saveProgress();
        renderMeaning();
      } else {
        setStage('assembly', { assemblyValues: progress.attempts.assemblyValues || [] });
      }
    });
  }

  function renderAssembly() {
    const values = progress.attempts.assemblyValues || [];
    const checked = progress.attempts.assemblyChecked;
    const correct = mission.assembly_slots.every((slot, index) => values[index] === slot.correct);
    const selects = mission.assembly_slots.map((slot, index) => `
      <div class="mission-slot">
        <label for="missionSlot${index}">${escapeHtml(slot.label)}</label>
        <select class="mission-select" id="missionSlot${index}" data-slot="${index}">
          <option value="">고르기</option>
          ${slot.options.map(option => `<option value="${escapeHtml(option)}" ${values[index] === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}
        </select>
      </div>`).join('');

    app.innerHTML = stageFrame(
      '4 / 6 · 문장 조립',
      '세 의미 단위를 순서대로 연결하세요',
      `
        <p class="mission-copy">받을 수 있는지 + 예약 없는 손님 + 현재 시점을 한 문장으로 만듭니다.</p>
        <div class="mission-assembly">${selects}</div>
        <div class="mission-expression">${escapeHtml(values.filter(Boolean).join(' ') || '선택한 말이 여기에 이어집니다.')}</div>
        ${checked ? `<div class="mission-feedback ${correct ? 'correct' : 'wrong'}">${correct ? '세 의미가 모두 연결됐습니다.' : '아직 뜻이 맞지 않는 칸이 있습니다. 각 칸의 한국어 역할과 다시 맞춰 보세요.'}</div>` : ''}
        <div class="mission-actions single">
          <button class="mission-primary" id="missionAssemblyCheck" type="button">${correct && checked ? '다음: 소리 내어 말하기' : '조립한 문장 확인'}</button>
        </div>`
    );

    app.querySelectorAll('[data-slot]').forEach(select => {
      select.addEventListener('change', () => {
        const nextValues = [...values];
        nextValues[Number(select.dataset.slot)] = select.value;
        progress.attempts.assemblyValues = nextValues;
        progress.attempts.assemblyChecked = false;
        saveProgress();
        renderAssembly();
      });
    });
    document.getElementById('missionAssemblyCheck').addEventListener('click', () => {
      if (checked && correct) {
        setStage('spoken', {
          spokenAttempt: progress.attempts.spokenAttempt || '',
          spokenMethod: progress.attempts.spokenMethod || ''
        });
        return;
      }
      if (!correct) progress = core.recordObstacle(progress, 'assembly');
      progress.attempts.assemblyChecked = true;
      saveProgress();
      renderAssembly();
    });
  }

  function missingMessage(result, variant) {
    const labels = {
      'question-form': variant === 'transfer' ? '`Do you take ...?`라는 운영 방침 질문 형태' : '`Are you taking ...?`이라는 현재 가능 여부 질문 형태',
      accept: '`take`로 손님을 받는 의미',
      customer: '`walk-ins`라는 손님 유형',
      'current-time': '`right now`라는 현재 조건',
      'new-condition': '토요일 또는 주말이라는 새 조건'
    };
    const missing = result.missing.map(key => labels[key]).join(', ');
    return variant === 'transfer'
      ? `아직 ${missing}이 빠졌습니다. 첫 문장을 그대로 복사하지 말고 시간 조건을 바꿔 보세요.`
      : `아직 ${missing}이 빠졌습니다. 조립한 세 의미를 모두 넣어 다시 말해 보세요.`;
  }

  function renderSpoken() {
    const value = progress.attempts.spokenAttempt || '';
    const method = progress.attempts.spokenMethod || '';
    const checked = progress.attempts.spokenChecked;
    const result = core.gradeSpokenAttempt(value, 'direct');
    app.innerHTML = stageFrame(
      '5 / 6 · 내 입으로 꺼내기',
      mission.spoken_prompt,
      `
        <div class="mission-expression">${escapeHtml(mission.target_expression)}</div>
        <textarea class="mission-textarea" id="missionSpokenAttempt" placeholder="먼저 문장을 소리 내어 말해 주세요." ${method ? '' : 'readonly'}>${escapeHtml(value)}</textarea>
        <div class="mission-speech-row">
          <button class="mission-speech-button" id="missionSpokenButton" type="button">영어 문장 말하기</button>
          <button class="mission-secondary" id="missionSpokenManual" type="button">소리 내어 말했어요</button>
          <div class="mission-copy" id="missionSpokenAttemptStatus">${method ? '말한 문장이 맞게 적혔는지 확인하세요.' : '음성 인식을 지원하지 않으면 소리 내어 말한 뒤 직접 입력해 확인할 수 있습니다.'}</div>
        </div>
        ${checked ? `<div class="mission-feedback ${result.correct ? 'correct' : 'wrong'}">${result.correct ? '예약 없는 손님, 받아 주는지, 지금이라는 의미가 모두 들렸습니다.' : escapeHtml(missingMessage(result, 'direct'))}</div>` : ''}
        <div class="mission-actions single">
          <button class="mission-primary" id="missionSpokenCheck" type="button" ${value.trim() && method ? '' : 'disabled'}>${checked && result.correct ? '다음: 다른 상황에 적용' : '내 문장 확인'}</button>
        </div>`
    );

    const input = document.getElementById('missionSpokenAttempt');
    const check = document.getElementById('missionSpokenCheck');
    input.addEventListener('input', () => { check.disabled = !input.value.trim(); });
    document.getElementById('missionSpokenButton').addEventListener('click', () => {
      startRecognition('missionSpokenAttempt', transcript => {
        progress.attempts.spokenAttempt = transcript;
        progress.attempts.spokenMethod = 'recognition';
        progress.attempts.spokenChecked = false;
        saveProgress();
        renderSpoken();
      });
    });
    document.getElementById('missionSpokenManual').addEventListener('click', () => {
      progress.attempts.spokenMethod = 'manual';
      progress.attempts.spokenChecked = false;
      saveProgress();
      renderSpoken();
      document.getElementById('missionSpokenAttempt')?.focus();
    });
    check.addEventListener('click', () => {
      if (checked && result.correct) {
        setStage('transfer', {
          transferAttempt: progress.attempts.transferAttempt || '',
          transferMethod: progress.attempts.transferMethod || ''
        });
        return;
      }
      if (!method) return;
      const nextValue = input.value.trim();
      const nextResult = core.gradeSpokenAttempt(nextValue, 'direct');
      if (!nextResult.correct) progress = core.recordObstacle(progress, 'spoken');
      progress.attempts.spokenAttempt = nextValue;
      progress.attempts.spokenChecked = true;
      saveProgress();
      renderSpoken();
    });
  }

  function renderTransfer() {
    const transfer = mission.transfer_scenarios[0];
    const value = progress.attempts.transferAttempt || '';
    const method = progress.attempts.transferMethod || '';
    const checked = progress.attempts.transferChecked;
    const result = core.gradeSpokenAttempt(value, 'transfer');
    app.innerHTML = stageFrame(
      '6 / 6 · 상황 바꿔 말하기',
      '장소와 시간 조건이 바뀌었습니다',
      `
        <div class="mission-scene"><strong>새 장면</strong><br>${escapeHtml(transfer.scene)}</div>
        <p class="mission-copy" style="margin-top: 12px;">${escapeHtml(transfer.prompt)}</p>
        <textarea class="mission-textarea" id="missionTransferAttempt" placeholder="새 조건에 맞춰 먼저 소리 내어 말해 보세요." ${method ? '' : 'readonly'}>${escapeHtml(value)}</textarea>
        <div class="mission-speech-row">
          <button class="mission-speech-button" id="missionTransferButton" type="button">바꾼 문장 말하기</button>
          <button class="mission-secondary" id="missionTransferManual" type="button">소리 내어 말했어요</button>
          <div class="mission-copy" id="missionTransferAttemptStatus">${method ? '방금 말한 문장을 입력해 확인하세요.' : '첫 문장의 핵심은 유지하고, 현재 조건을 토요일 운영 방침으로 바꾸세요.'}</div>
        </div>
        ${checked ? `<div class="mission-feedback ${result.correct ? 'correct' : 'wrong'}">${result.correct ? '같은 `take walk-ins`를 새 시간 조건에 맞게 바꿔 썼습니다.' : escapeHtml(missingMessage(result, 'transfer'))}</div>` : ''}
        <div class="mission-actions single">
          <button class="mission-primary" id="missionTransferCheck" type="button" ${value.trim() && method ? '' : 'disabled'}>${checked && result.correct ? '미션 결과 보기' : '바꾼 문장 확인'}</button>
        </div>`
    );

    const input = document.getElementById('missionTransferAttempt');
    const check = document.getElementById('missionTransferCheck');
    input.addEventListener('input', () => { check.disabled = !input.value.trim(); });
    document.getElementById('missionTransferButton').addEventListener('click', () => {
      startRecognition('missionTransferAttempt', transcript => {
        progress.attempts.transferAttempt = transcript;
        progress.attempts.transferMethod = 'recognition';
        progress.attempts.transferChecked = false;
        saveProgress();
        renderTransfer();
      });
    });
    document.getElementById('missionTransferManual').addEventListener('click', () => {
      progress.attempts.transferMethod = 'manual';
      progress.attempts.transferChecked = false;
      saveProgress();
      renderTransfer();
      document.getElementById('missionTransferAttempt')?.focus();
    });
    check.addEventListener('click', () => {
      if (checked && result.correct) {
        setStage('complete');
        return;
      }
      if (!method) return;
      const nextValue = input.value.trim();
      const nextResult = core.gradeSpokenAttempt(nextValue, 'transfer');
      if (!nextResult.correct) progress = core.recordObstacle(progress, 'transfer');
      progress.attempts.transferAttempt = nextValue;
      progress.attempts.transferChecked = true;
      saveProgress();
      renderTransfer();
    });
  }

  function retryFromObstacle() {
    const stage = progress.retryStage || 'first-attempt';
    const resetByStage = {
      intent: { intentChoice: null },
      meaning: { meaningIndex: 0, meaningAnswers: {} },
      assembly: { assemblyValues: [], assemblyChecked: false },
      spoken: { spokenAttempt: '', spokenMethod: '', spokenChecked: false },
      transfer: { transferAttempt: '', transferMethod: '', transferChecked: false }
    };
    progress = { ...progress, stage, completed: false, attempts: { ...progress.attempts, ...(resetByStage[stage] || {}) } };
    saveProgress();
    render();
  }

  function restartMission() {
    progress = core.createInitialProgress(mission.id);
    saveProgress();
    render();
  }

  function renderComplete() {
    const obstacleLabels = progress.obstacles.map(stage => mission.retry_stage[stage]).filter(Boolean);
    const source = mission.sources[0];
    app.innerHTML = stageFrame(
      '미션 완료',
      '같은 의미를 두 장면에서 직접 꺼냈습니다',
      `
        <div class="mission-result-box">
          <strong>미용실에서 지금 가능한지</strong><br>${escapeHtml(progress.attempts.spokenAttempt || mission.target_expression)}<br><br>
          <strong>의원에서 토요일 방침 묻기</strong><br>${escapeHtml(progress.attempts.transferAttempt || mission.transfer_scenarios[0].expected)}
        </div>
        <div class="mission-meaning-box"><strong>쓰임 경계</strong><br>${escapeHtml(mission.usage_boundary)}</div>
        <div class="mission-meaning-box"><strong>${obstacleLabels.length ? '다음 복습이 시작될 지점' : '이번 수행'}</strong><br>${obstacleLabels.length ? escapeHtml(obstacleLabels[obstacleLabels.length - 1]) : '막힘 없이 두 상황을 완료했습니다.'}</div>
        <div class="mission-actions">
          ${progress.retryStage ? '<button class="mission-primary" id="missionRetry" type="button">막힌 단계 다시 연습</button>' : ''}
          <button class="mission-secondary" id="missionRestart" type="button">처음부터 다시</button>
          <button class="mission-secondary" id="missionDictionary" type="button">다른 표현 찾기</button>
        </div>
        <div class="mission-source">표현 근거: <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a></div>`
    );

    document.getElementById('missionRetry')?.addEventListener('click', retryFromObstacle);
    document.getElementById('missionRestart').addEventListener('click', restartMission);
    document.getElementById('missionDictionary').addEventListener('click', () => {
      document.querySelector('.hub-tab[data-hub="dictionary"]')?.click();
    });
  }

  function render() {
    switch (progress.stage) {
      case 'intent': renderIntent(); break;
      case 'meaning': renderMeaning(); break;
      case 'assembly': renderAssembly(); break;
      case 'spoken': renderSpoken(); break;
      case 'transfer': renderTransfer(); break;
      case 'complete': renderComplete(); break;
      default: renderFirstAttempt();
    }
  }

  saveProgress();
  render();
})();
