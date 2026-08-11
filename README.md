# 옥쌤 영어 허브

[Instagram @ok.english.kr](https://www.instagram.com/ok.english.kr/)의 검토된 Reel 표현을 상황별로 찾고, 짧게 복습하는 정적 웹앱입니다.

## 현재 학습 흐름

첫 화면은 Reel 연결 주문 만들기입니다. 사용자는 써브웨이 주문에서 완전히 뺄 재료와 양을 줄일 항목을 고른 뒤, 다음 두 문장을 바로 받습니다.

- `Everything except ...`
- `Go easy on the ...`

완성 화면에서 기존 퀴즈 허브와 표현 사전으로 이동할 수 있습니다. 상황 연습, 상황/표현 검색, 카테고리, `q`/`cat`/`id` 링크, 저장한 표현 기능도 그대로 유지됩니다.

## 개인정보와 저장 범위

이 앱은 계정이나 서버 동기화를 제공하지 않습니다. 최근 주문 선택과 완료 횟수는 현재 브라우저의 `localStorage` 키 `ok_reel_builder_v1`에만 저장됩니다. 저장한 표현과 퀴즈 오답도 같은 브라우저 저장소에만 남습니다.

기기 또는 브라우저 데이터를 지우면 이 상태도 사라집니다. 결제, 구독, 발음 채점, 음성 녹음 또는 음성 이력 저장 기능은 제공하지 않습니다.

## Reel 데이터 갱신

`data.js`와 `public/data.js`는 같은 데이터여야 합니다. 최신 공개 Reel을 반영할 때는 다음 명령을 실행한 뒤 변경 내용을 검토합니다.

```bash
python3 update_public_instagram.py
npm run audit:targets
cmp data.js public/data.js
```

전체 archive 재생성은 공개 피드에 없는 과거 Reel을 복구해야 할 때만 사용합니다. `parse-instagram.js`, 전사, 보강, `generate_data.py` 순서는 각 스크립트의 입력 파일과 검토 보고서를 확인한 뒤 실행합니다.

## 배포

운영 사이트는 GitHub Pages에서 제공합니다.

https://jokc28.github.io/ok-english-search/

배포는 `main`의 정적 파일을 기준으로 수행합니다. 배포 전에는 아래 검증과 root/public 동기화를 모두 통과시킵니다.

## 검증

```bash
npm test
npm run test:browser
npm audit --audit-level=high
cmp data.js public/data.js
cmp guided-mission-core.js public/guided-mission-core.js
cmp guided-mission.js public/guided-mission.js
cmp guided-missions.js public/guided-missions.js
cmp index.html public/index.html
git diff --check
```

브라우저 검증은 Chrome을 사용하며 기본 경로는 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`입니다. 다른 위치에서는 `CHROME_PATH`를 설정합니다. 실행 시 모바일 첫 화면, 선택, 완료, 기존 도구 이동 화면의 스크린샷을 `.superpowers/sdd/2026-08-11-reel-situation-builder/artifacts/task-3-browser/`에 남깁니다.
