# 옥모닝 표현 사전

Instagram [@ok.english.kr](https://www.instagram.com/ok.english.kr/)의 영어 표현 튜토리얼 Reels를 상황별로 검색할 수 있는 모바일 웹앱입니다. Instagram 프로필 링크에 연결하여 팔로워들이 원하는 표현을 빠르게 찾고 바로 시청할 수 있습니다.

## How to Add a New Reel

현재 서비스 데이터는 `data.js`와 `public/data.js`가 같은 내용이어야 합니다. 수동으로 1개만 추가할 때는 두 파일 모두 같은 항목을 넣으세요.

```js
const REELS_DATA = [
  {
    "id": 1,
    "expression_en": "Could you take me to...?",
    "expression_meaning_kr": "데려다 주세요",
    "situation_kr": "택시에서 목적지 말할 때",
    "description_kr": "택시 기사에게 목적지를 알려줄 때 쓰는 자연스러운 표현.",
    "category": "여행·외출",
    "search_keywords_kr": ["택시", "목적지", "여행"],
    "search_keywords_en": ["taxi", "destination"],
    "difficulty": "beginner",
    "reel_url": "https://www.instagram.com/reel/XXXXX/",
    "date": "2026-04-01"
  },
  // ...
];
```

추가 후 커밋 & 푸시하면 Vercel에서 자동 배포됩니다:
```bash
git add data.js
git commit -m "Add reel: Could you take me to...?"
git push
```

## How to Refresh From Instagram

Instagram에 새 공개 Reels가 올라간 뒤 최신 공개 피드만 갱신하려면:

```bash
python3 update_public_instagram.py
```

이 스크립트는 Instagram 공개 웹 피드에서 새 Clips를 가져오고, 표현 학습용 Reel만 `data.js`와 `public/data.js`에 반영합니다. `.env`에 `OPENAI_API_KEY`가 있으면 낯선 새 캡션도 자동 분류하고, 명확한 홍보/앱추천/소개 영상은 제외합니다.

전체 과거 archive를 다시 만들거나 공개 피드에 나오지 않는 오래된 Reel까지 복구해야 할 때만 아래 절차를 사용하세요:

1. Instagram/Meta Accounts Center에서 `@ok.english.kr`의 최신 데이터 다운로드를 요청합니다.
2. 받은 export를 풀어서 `instagram_okenglish/` 폴더를 최신 내용으로 교체합니다.
3. `node parse-instagram.js`로 Instagram export에서 기본 Reel 목록을 다시 만듭니다.
4. `extracted-reel-urls.json` 또는 `url-matcher.html`로 실제 Reel URL을 맞춥니다. Instagram export에는 shortcode가 없어 `UNKNOWN_...` URL이 생길 수 있습니다.
5. `python3 download_reels.py`로 새 Reel 오디오를 받습니다. `yt-dlp`가 필요합니다.
6. `python3 transcribe_reels.py`로 새 오디오를 전사합니다. `.env`에 `OPENAI_API_KEY`가 필요합니다.
7. `python3 enrich_with_transcripts.py`로 표현/뜻/검색 키워드를 보강합니다.
8. `python3 generate_data.py`로 `data.js`와 `public/data.js`를 동시에 재생성합니다.
9. `npm run audit:targets`로 transcript 기반 target-expression/context 검증을 적용합니다. 이 단계에서 `X보다는 Y` 패턴처럼 영상의 실제 교육 포인트가 Y인 경우 X를 daily/quiz 후보에서 제외하고, 뜻은 맞지만 사용 상황이 transcript와 맞지 않는 항목도 daily/quiz 후보에서 제외합니다.
10. `python3 -m http.server 8001 -d public`로 로컬 확인 후 커밋/푸시합니다.

## How to Deploy

이 프로젝트는 Vercel 프로젝트 `ok-english-search`에 연결되어 있습니다. `main` 브랜치에 push하면 자동 배포됩니다.

로컬에서 UI만 확인:

```bash
python3 -m http.server 8001 -d public
```

확인 URL: `http://localhost:8001/`

AI 검색 API와 Daily Quiz 생성/검증 API까지 확인하려면 Vercel 환경변수 `OPENAI_API_KEY`가 설정된 상태에서 Vercel 배포본 또는 `vercel dev`를 사용하세요. GitHub Pages처럼 정적 호스팅만 있는 환경에서는 Daily Quiz가 로컬 fallback 로직으로 동작합니다.

## Sponsorship Setup

The web app includes alias-only sponsor links for creator support. The current production link uses Patreon Shop for one-time purchases under the public alias `옥쌤`.

Do not connect direct bank transfers, Toss links, or wire-transfer routing in this app. Those payment paths can expose the creator's legal name due to financial compliance requirements.

The setup is automated. The default config already points to the Patreon Shop for `okenglishkr`:

```bash
npm run configure:sponsor
```

The command reads `sponsor.config.json`, updates `public/index.html`, and syncs `index.html` automatically. No manual HTML editing is needed.

Current default config:

```json
{
  "alias": "옥쌤",
  "url": "https://www.patreon.com/okenglishkr/shop",
  "headerLabel": "옥쌤 1회 후원",
  "footerLabel": "옥쌤 1회 후원하기",
  "bannerTitle": "옥쌤 후원하기",
  "bannerBody": "이 표현 허브가 계속 운영될 수 있게 Patreon 1회 후원으로 응원할 수 있어요.",
  "bannerCta": "1회 후원하러 가기 →"
}
```

If you later prefer the official Buy Me a Coffee widget instead of Patreon, first confirm that payouts are supported for your country. Then place this before `</body>` and replace only the slug/id with the alias-based creator ID:

```html
<!-- Replace YOUR_BUYMEACOFFEE_ID with the creator platform ID created under the public alias. -->
<script
  data-name="BMC-Widget"
  data-cfasync="false"
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-id="YOUR_BUYMEACOFFEE_ID"
  data-description="Support 옥쌤"
  data-message="옥쌤 영어 허브를 응원해 주세요."
  data-color="#1F6F68"
  data-position="Right"
  data-x_margin="18"
  data-y_margin="18">
</script>
```

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
