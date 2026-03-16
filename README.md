# 옥모닝 표현 사전

Instagram [@ok.english.kr](https://www.instagram.com/ok.english.kr/)의 영어 표현 튜토리얼 Reels를 상황별로 검색할 수 있는 모바일 웹앱입니다. Instagram 프로필 링크에 연결하여 팔로워들이 원하는 표현을 빠르게 찾고 바로 시청할 수 있습니다.

## How to Add a New Reel

`data.js` 파일을 열고 배열 **맨 위**에 새 항목을 추가하세요 (최신순 정렬 유지):

```js
const REELS_DATA = [
  {
    id: 258,                                        // 기존 최대 id + 1
    situation_kr: "택시에서 목적지 말할 때",            // 상황 설명 (한국어)
    expression_en: "Could you take me to...?",       // 영어 표현
    description_kr: "택시 기사에게 목적지를 알려줄 때 쓰는 자연스러운 표현.", // 짧은 설명
    tags: ["여행", "일상"],                            // 태그 (기존 태그 활용 권장)
    reel_url: "https://www.instagram.com/reel/XXXXX/", // 릴스 URL
    date: "2026-04-01"                               // 업로드 날짜 (YYYY-MM-DD)
  },
  // ... 기존 항목들
];
```

추가 후 커밋 & 푸시하면 ~1분 내 자동 배포됩니다:
```bash
git add data.js
git commit -m "Add reel: Could you take me to...?"
git push
```

## How to Deploy

1. GitHub에 `ok-english-search` 리포지토리를 생성합니다.
2. `index.html`, `data.js`, `README.md`를 push합니다.
3. Settings → Pages → Source를 **main** 브랜치, **/ (root)** 로 설정합니다.
4. 몇 분 후 `https://<username>.github.io/ok-english-search/` 에서 확인할 수 있습니다.

## Tag Convention

| 태그 | 용도 |
|------|------|
| `일상` | 일상생활에서 자주 쓰는 표현 (기본 태그) |
| `표현` | 영어 표현 학습 전반 |
| `뉘앙스` | 비슷한 표현의 뉘앙스 차이 |
| `감정` | 감정 표현 관련 |
| `비즈니스` | 업무/직장 관련 표현 |
| `회의` | 회의/미팅 상황 |
| `면접` | 면접/인터뷰 상황 |
| `이메일` | 이메일 작성 관련 |
| `전화` | 전화 통화 상황 |
| `카페` | 카페 주문 관련 |
| `주문` | 음식/음료 주문 상황 |
| `여행` | 여행 중 필요한 표현 |
| `사과` | 사과/실수 인정 |
| `감사` | 감사 표현 |
| `거절` | 거절/거부 표현 |
| `동의` | 동의/찬성 표현 |
| `반대` | 반대/반박 표현 |
| `인사` | 인사/첫 만남 |
| `칭찬` | 칭찬 표현 |
| `정중한표현` | 격식/정중한 표현 |
| `완곡표현` | 돌려 말하기/완곡 표현 |
| `슬랭` | 비격식 슬랭 표현 |
| `발음` | 발음 관련 |
| `문화` | 미국 문화/생활 |
| `연애` | 연애/관계 표현 |
| `돈` | 돈/결제 관련 |
| `건강` | 건강/신체 관련 |
| `SNS` | SNS/온라인 표현 |
