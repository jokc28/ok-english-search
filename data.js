const REELS_DATA = [
  {
    id: 258,
    situation_kr: "[새 릴스 — 캡션 입력 필요]",
    expression_en: "",
    description_kr: "",
    tags: ["미분류"],
    reel_url: "https://www.instagram.com/reel/DTLHo-ggUAG/",
    date: ""
  },
  {
    id: 259,
    situation_kr: "[새 릴스 — 캡션 입력 필요]",
    expression_en: "",
    description_kr: "",
    tags: ["미분류"],
    reel_url: "https://www.instagram.com/reel/DJ6OlDHRGV8/",
    date: ""
  },
  {
    id: 260,
    situation_kr: "[새 릴스 — 캡션 입력 필요]",
    expression_en: "",
    description_kr: "",
    tags: ["미분류"],
    reel_url: "https://www.instagram.com/reel/C_j9QG9NYbd/",
    date: ""
  },
  {
    id: 261,
    situation_kr: "[새 릴스 — 캡션 입력 필요]",
    expression_en: "",
    description_kr: "",
    tags: ["미분류"],
    reel_url: "https://www.instagram.com/reel/DUNvNuvAcC9/",
    date: ""
  },
  {
    id: 1,
    situation_kr: "원어민은 노잼을 뭐라고 할까?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DV3lCaIAczg/",
    date: "2026-03-14"
  },
  {
    id: 2,
    situation_kr: "하기로 했다가 슬쩍 발 빼다",
    expression_en: "Back out",
    description_kr: "cancel = 공식 일정 취소",
    tags: ["사과", "표현"],
    reel_url: "https://www.instagram.com/reel/DVs9lqpkZ_8/",
    date: "2026-03-10"
  },
  {
    id: 3,
    situation_kr: "서울대생 90%가 모르는 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DVlTTslEYuF/",
    date: "2026-03-07"
  },
  {
    id: 4,
    situation_kr: "기회를 헛되이 쓰지 마",
    expression_en: "Make it count",
    description_kr: "마지막 기회야, 제대로 해 → .",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DVZyglfkkCS/",
    date: "2026-03-03"
  },
  {
    id: 5,
    situation_kr: "당신의 리즈시절은? 영어로 뭐라할까?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DVTHKXVAe5x/",
    date: "2026-02-28"
  },
  {
    id: 6,
    situation_kr: "게임이 안 돼",
    expression_en: "It's not even close",
    description_kr: "By five years,  Big difference=설명톤,  Not even close=압살 뉘앙스",
    tags: ["뉘앙스", "문화"],
    reel_url: "https://www.instagram.com/reel/DVIGGUFgSyz/",
    date: "2026-02-24"
  },
  {
    id: 7,
    situation_kr: "체중 무거움",
    expression_en: "I feel sluggish",
    description_kr: "몸, 뇌 다 느려졌어,  after lunch Heavy=,  My condition is bad=콩글리시",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DU_IMBLAXDZ/",
    date: "2026-02-20"
  },
  {
    id: 8,
    situation_kr: "아직도 I’m okay만 쓰는 사람들 보세요!",
    expression_en: "m okay",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DU2xgB3gTg4/",
    date: "2026-02-17"
  },
  {
    id: 9,
    situation_kr: "곤란한 질문 쓰~윽 회피하는 꿀팁!!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DUuAAK3krCd/",
    date: "2026-02-14"
  },
  {
    id: 10,
    situation_kr: "영어로 피부 트러블을 뭐라고 할까? Skin trouble? No",
    expression_en: "영어로 피부 트러블을 뭐라고 할까? Skin trouble? No",
    description_kr: "",
    tags: ["거절", "건강"],
    reel_url: "https://www.instagram.com/reel/DUnUUP0ARj2/",
    date: "2026-02-11"
  },
  {
    id: 11,
    situation_kr: "집콕하다",
    expression_en: "Stay in",
    description_kr: "나가지 않고 집에 있기",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DUZuu37geB7/",
    date: "2026-02-06"
  },
  {
    id: 12,
    situation_kr: "파이팅!!! 영어로 아는사람?",
    expression_en: "",
    description_kr: "영어 자료 및 고급 소식을 가장 먼저 알고싶다면?댓글로 DM달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DUTMSdUAebr/",
    date: "2026-02-03"
  },
  {
    id: 13,
    situation_kr: "원래 이런거야! 영어로 뭘까?",
    expression_en: "",
    description_kr: "영어를 꾸준하게 할 수 있는 커뮤니티에 참가하고 싶다면? DM이라고 댓글 달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DUC_byGkZsI/",
    date: "2026-01-28"
  },
  {
    id: 14,
    situation_kr: "입소문 타다",
    expression_en: "go viral",
    description_kr: "SNS에서 폭발적으로 퍼지다",
    tags: ["SNS", "표현"],
    reel_url: "https://www.instagram.com/reel/DT42m-CERKA/",
    date: "2026-01-24"
  },
  {
    id: 15,
    situation_kr: "속보이는 친구에게 필요한 영어 표현",
    expression_en: "",
    description_kr: "너진짜 속보인다 =공유",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DTvGrbwgU7j/",
    date: "2026-01-20"
  },
  {
    id: 16,
    situation_kr: "돌려 말하는 부정",
    expression_en: "🎯 Not the most + 형용사 → 돌려 말하는 부정",
    description_kr: "Not the most + 형용사 →  bad/boring 대신, It’s not the most exciting movie.",
    tags: ["완곡표현", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DTmdBprEUgT/",
    date: "2026-01-17"
  },
  {
    id: 17,
    situation_kr: "Fly에 한 마디만 추가하면 있어보임",
    expression_en: "Fly",
    description_kr: "영어 퀴즈를 받고 싶으신 분들은 DM이라고 댓글 달아주세요",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DTeIFTDEil8/",
    date: "2026-01-14"
  },
  {
    id: 18,
    situation_kr: "임신 소식",
    expression_en: "Expecting a baby",
    description_kr: "가장 교양 있는 표현 We are making a baby(\udd1e),  I’m pregnant(의학적) →  We’re",
    tags: ["정중한표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DTVc2rsgfNl/",
    date: "2026-01-10"
  },
  {
    id: 19,
    situation_kr: "미국식으로 돌려말하기!",
    expression_en: "",
    description_kr: "고급 영어 퀴즈를 풀고 싶다면? 댓글에 퀴즈 적어주세요",
    tags: ["완곡표현"],
    reel_url: "https://www.instagram.com/reel/UNKNOWN_18127358071525591/",
    date: "2026-01-06"
  },
  {
    id: 20,
    situation_kr: "신년맞이 옥쌤의 꿀팁은??",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DTFRXKFkUYz/",
    date: "2026-01-04"
  },
  {
    id: 21,
    situation_kr: "너 인정할게를 영어로 하면?",
    expression_en: "",
    description_kr: "추가 고급 영어퀴즈를 풀고싶다면? 댓글에 DM달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DS48TacgXjY/",
    date: "2025-12-30"
  },
  {
    id: 22,
    situation_kr: "무관심",
    expression_en: "indifference",
    description_kr: "오늘의 표현:  → , 감정적으로도 신경 쓰지 않는 상태 예: His  hurt her more than anger",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DSzcl7RgWBg/",
    date: "2025-12-28"
  },
  {
    id: 23,
    situation_kr: "저축하다를 고급지게 표현하는 방법?",
    expression_en: "",
    description_kr: "",
    tags: ["돈"],
    reel_url: "https://www.instagram.com/reel/DSru6xXAd0V/",
    date: "2025-12-25"
  },
  {
    id: 24,
    situation_kr: "사진발 잘 받는",
    expression_en: "photogenic",
    description_kr: "오늘의 표현:  → , 사진이 유독 잘 나오는 예: You look so  in that picture / This café is so",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DSm-pnJAZvc/",
    date: "2025-12-23"
  },
  {
    id: 25,
    situation_kr: "이 표현 쓰면 영어 고수 느낌남",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DSfH9oaAY9Z/",
    date: "2025-12-20"
  },
  {
    id: 26,
    situation_kr: "이번 영상에서는 옥쌤이 직접 사용해보고 추천하는 영어 단어 어플을 소개해드리려고 합니다! ",
    expression_en: "istoriaapp",
    description_kr: "이번 영상에서는 옥쌤이 직접 사용해보고 추천하는 영어 단어 어플을 소개해드리려고 합니다! @ 레벨 1~8까지, 영어 수준에 맞게 스토리나 책을 골라 읽기, 듣기, 단어, 퀴즈를 한 번에 진행할 수",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DScHyq4kRi2/",
    date: "2025-12-19"
  },
  {
    id: 27,
    situation_kr: "미국 인싸들만 하는 술게임",
    expression_en: "",
    description_kr: "",
    tags: ["슬랭", "문화"],
    reel_url: "https://www.instagram.com/reel/DSU15toAX4t/",
    date: "2025-12-16"
  },
  {
    id: 28,
    situation_kr: "실패할래야 실패할 수 없는",
    expression_en: "foolproof",
    description_kr: "오늘의 표현:  → , 완전 확실한 예: This is a  solution — anyone can follow it / The setup is foolpro",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DSNbawrgX75/",
    date: "2025-12-13"
  },
  {
    id: 29,
    situation_kr: "금사빠 친구에게 노빠꾸 영어하기",
    expression_en: "",
    description_kr: "고급 영어 표현을 받고싶으면 댓글 달아주세요!",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DSHoE97AV7R/",
    date: "2025-12-11"
  },
  {
    id: 30,
    situation_kr: "안타깝다 / 마음이 쓰인다",
    expression_en: "sorry to hear that",
    description_kr: "오늘의 표현:  →  사과가 아니라 상대 소식에 ‘공감·위로’를 전하는 표현이에요.",
    tags: ["사과", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DSCNZNrgXQg/",
    date: "2025-12-09"
  },
  {
    id: 31,
    situation_kr: "2025년은 여러분에게 어떤 해인가요?",
    expression_en: "",
    description_kr: "고급 영어 자료를 받고 싶다면 댓글 달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DR7K2tWAaqg/",
    date: "2025-12-06"
  },
  {
    id: 32,
    situation_kr: "필요한 조건을 전부 충족하다",
    expression_en: "check all the boxes",
    description_kr: "오늘의 표현:  →  예: This version finally checks all the boxes / She checks all the boxes fo",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DRzMEbOAahI/",
    date: "2025-12-03"
  },
  {
    id: 33,
    situation_kr: "Notice 하나만 잘써도 영어를 잘해보입니다",
    expression_en: "Notice",
    description_kr: "고급영어자료를 받고 싶은 분들은 DM보내주세요!",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DRyXrP6AZIj/",
    date: "2025-12-03"
  },
  {
    id: 34,
    situation_kr: "감을 잡다 / 해결하다 / 파악하다",
    expression_en: "figure out",
    description_kr: "오늘의 표현:  →  문제 해결, 이해, 결정, 감정 파악까지 전부 연결되는 만능 표현!",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DRnwOfmgSgD/",
    date: "2025-11-29"
  },
  {
    id: 35,
    situation_kr: "징크스라고 하면 한국인임",
    expression_en: "",
    description_kr: "고급 영어 자료를 받고싶은 분은 댓글에 퀴즈라고 달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DRkDuEeAezU/",
    date: "2025-11-27"
  },
  {
    id: 36,
    situation_kr: "단순히 “내려놔”가 아니라",
    expression_en: "put it down",
    description_kr: "오늘의 표현:  → , 이미지 하나로 여러 의미로 확장돼요. 예: Put the bag down / Don’t put yourself down / I had to put",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DRbnEIIEX20/",
    date: "2025-11-24"
  },
  {
    id: 37,
    situation_kr: "아직도 chill guy만 쓰는 사람?",
    expression_en: "아직도 chill guy만 쓰는 사람?",
    description_kr: "고급 영어 퀴즈를 받고 싶은 분은 댓글로 퀴즈를 달아주세요",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DRXDXmUgcfq/",
    date: "2025-11-22"
  },
  {
    id: 38,
    situation_kr: "속상하다 / 뒤흔들다 / 이변",
    expression_en: "upset",
    description_kr: "오늘의 표현:  →  감정, 상황, 경기 등 다양한 맥락에서 쓰여요.",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DRPiX18j5fC/",
    date: "2025-11-19"
  },
  {
    id: 39,
    situation_kr: "감정기복 심한 사람 영어로 이거야",
    expression_en: "",
    description_kr: "고급 영어 퀴즈를 받고 싶으면 댓글로 퀴즈달아주세요",
    tags: ["감정"],
    reel_url: "https://www.instagram.com/reel/DRMshUpgYf1/",
    date: "2025-11-18"
  },
  {
    id: 40,
    situation_kr: "네 맘대로 해 / 좋을 대로 해",
    expression_en: "suit yourself",
    description_kr: "오늘의 표현:  →  상대의 선택에 동의하지 않거나 포기하는 뉘앙스가 있어요.",
    tags: ["동의", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DRE6KIKgZPF/",
    date: "2025-11-15"
  },
  {
    id: 41,
    situation_kr: "개꿀잼을 영어로?",
    expression_en: "",
    description_kr: "고급 영어 퀴즈를 받고 싶다면 댓글에 Dm보내주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DQ_o4aegfnm/",
    date: "2025-11-13"
  },
  {
    id: 42,
    situation_kr: "귀에서 떠나질 않는 중독성 있는 노래",
    expression_en: "earworm",
    description_kr: "오늘의 표현:  →  예: That song’s an  — I can’t stop humming it / Repeat the hook to make a r",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DQ6wTiJgb9W/",
    date: "2025-11-11"
  },
  {
    id: 43,
    situation_kr: "잠수타다 영어로? 아는 사람",
    expression_en: "",
    description_kr: "고급영어퀴즈를 받고 싶으면 댓글로 퀴즈 달아주세요",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DQ0YnLjgSan/",
    date: "2025-11-09"
  },
  {
    id: 44,
    situation_kr: "요점은 이거야 / 상황이 이래",
    expression_en: "s the deal",
    description_kr: "오늘의 표현: Here’ →  직설적이지만 공격적이지 않고, 현실적인 핵심을 말할 때 써요.",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DQuRxy6gSDY/",
    date: "2025-11-06"
  },
  {
    id: 45,
    situation_kr: "Focus만 알고있는 사람 주목!",
    expression_en: "Focus",
    description_kr: "댓글로 퀴즈를 달아주시면 DM보내드립니다",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DQotbAcgeFI/",
    date: "2025-11-04"
  },
  {
    id: 46,
    situation_kr: "가장 좋은 / 최악의 경우",
    expression_en: "best case scenario",
    description_kr: "오늘의 표현:  / worst case scenario →  한국 학습자들이 자주 쓰는 번역투 대신, 가정된 ‘시나리오’ 느낌으로 써야 자연스러워요.",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DQgyGjTAZSA/",
    date: "2025-11-01"
  },
  {
    id: 47,
    situation_kr: "Throw on",
    expression_en: "Throw on",
    description_kr: "TV나 음악을 “툭” 틀 때 쓰는 말. 가볍고 즉흥적인 느낌!",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DQb48mVgdyg/",
    date: "2025-10-30"
  },
  {
    id: 48,
    situation_kr: "계속 말하려고 생각했어",
    expression_en: "ve been meaning to tell you",
    description_kr: "오늘의 표현: I’ →  단순한 “I want to tell you”보다 더 진심 있고 따뜻한 말투예요.",
    tags: ["감사", "표현"],
    reel_url: "https://www.instagram.com/reel/DQX59h-EmFv/",
    date: "2025-10-29"
  },
  {
    id: 49,
    situation_kr: "Let loose",
    expression_en: "Let loose",
    description_kr: "긴장 풀고 마음껏 즐길 때 쓰는 말. 파티, 여행, 쉬는 날에 딱!",
    tags: ["여행", "표현"],
    reel_url: "https://www.instagram.com/reel/DQOiZwcAajT/",
    date: "2025-10-25"
  },
  {
    id: 50,
    situation_kr: "내가 아는 한 그런 일은 없어",
    expression_en: "Not to my knowledge",
    description_kr: "오늘의 표현:  →  단순한 “I don’t know”보다 정중하고 객관적인 표현이에요.",
    tags: ["정중한표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DQIu0icAbB9/",
    date: "2025-10-23"
  },
  {
    id: 51,
    situation_kr: "힐링할 때도, 피곤할 때도 써요.",
    expression_en: "Zone out",
    description_kr: "멍 때리거나 잠깐 정신 나간 상태.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DQEmkUBAbTl/",
    date: "2025-10-21"
  },
  {
    id: 52,
    situation_kr: "상태 / 조건",
    expression_en: "condition",
    description_kr: "오늘의 표현:  →  의학·기계·공식적인 맥락에서 주로 사용돼요.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DP9Qfz7AbBt/",
    date: "2025-10-18"
  },
  {
    id: 53,
    situation_kr: "고급 영어 정보를 더 받고 싶으신 분들은 ‘퀴즈‘라고 댓글 달아주세요!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DP3tpIEARCY/",
    date: "2025-10-16"
  },
  {
    id: 54,
    situation_kr: "by the way (그런데",
    expression_en: "btw",
    description_kr: "오늘의 표현:  → , 말 나온 김에) 대화 전환이나 가벼운 덧붙임에 자주 쓰여요.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPyGWbwEWv3/",
    date: "2025-10-14"
  },
  {
    id: 55,
    situation_kr: "“맹세해",
    expression_en: "I swear",
    description_kr: "“” = , 진짜야” 내 말이 사실임을 강하게 강조할 때 사용.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPqwuNyAYHo/",
    date: "2025-10-11"
  },
  {
    id: 56,
    situation_kr: "잘못되다",
    expression_en: "go awry",
    description_kr: "오늘의 표현:  → , 어긋나다, 계획대로 되지 않다 예: Our dinner plans went awry when it started raining / The project went awry d",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPlsuC7AdRl/",
    date: "2025-10-09"
  },
  {
    id: 57,
    situation_kr: "고급 영어 퀴즈를 받아보고 싶으시면 댓글로 ‘퀴즈’라고 남겨주세요",
    expression_en: "Right off the bat, I knew he was lying.",
    description_kr: "“” (처음부터 바로 그가 거짓말하는 걸 알았어) - 처음부터, 시작부터라는 의미",
    tags: ["전화", "표현"],
    reel_url: "https://www.instagram.com/reel/DPgOwXagZYP/",
    date: "2025-10-07"
  },
  {
    id: 58,
    situation_kr: "누군가를 미치게 하다",
    expression_en: "drive someone crazy",
    description_kr: "오늘의 표현:  → , 짜증나게 하다 예: That noise drives me crazy / His constant complaining drives every",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPbTrA2AM7z/",
    date: "2025-10-05"
  },
  {
    id: 59,
    situation_kr: "고급 영어 퀴즈를 받아보고 싶으면 댓글로 ‘퀴즈’ 적어주세요",
    expression_en: "Come in",
    description_kr: "맥락: 집/공간으로 따뜻하게 초대할 때. 비슷·헷갈림: (중립), Step inside(조금 격식/안내 톤).",
    tags: ["정중한표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DPTCOqGgfNC/",
    date: "2025-10-02"
  },
  {
    id: 60,
    situation_kr: "두 가지 역할을 동시에 하다",
    expression_en: "wear two hats",
    description_kr: "오늘의 표현:  →  예: I : teacher and coach / She wears many hats in this small compan",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPOI9s6kcsp/",
    date: "2025-09-30"
  },
  {
    id: 61,
    situation_kr: "“마음이 불편하다",
    expression_en: "I feel bad",
    description_kr: "고급 영어 퀴즈를 받고 싶은 사람은 ‘퀴즈‘라고 적어주세요  = , 미안하다, 안타깝다, 속상하다”",
    tags: ["사과", "감정"],
    reel_url: "https://www.instagram.com/reel/DPJCp4NgT6A/",
    date: "2025-09-28"
  },
  {
    id: 62,
    situation_kr: "아쉬움 속 긍정 포인트",
    expression_en: "but at least",
    description_kr: "even though → ~임에도 불구하고, 대조만 강조",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DPBXvDMAUO2/",
    date: "2025-09-25"
  },
  {
    id: 63,
    situation_kr: "규칙이나 가치",
    expression_en: "The public turned against the politician.",
    description_kr: "1. go against → , 기대에 어긋나다, 충돌하다 - I didn’t take the job because it goes against my values. → 그 일은 내 가치관에 어긋나서 하지",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DO-2XCwgQYX/",
    date: "2025-09-24"
  },
  {
    id: 64,
    situation_kr: "이번 영상에서는 옥쌤이 직접 사용해보고 추천하는 단어 어플을 소개해드리려고 합니다! @istoriaapp",
    expression_en: "istoriaapp",
    description_kr: "지금까지 여러 협업 제안이 들어왔지만, 진짜 괜찮은 영어 학습 어플이 아니면 따로 진행을 하지 않았는데요. 레벨 1~8까지, 영어 수준에 맞게 스토리나 책을 골라 읽기, 듣기, 단어, 퀴즈를 한 번에 진행할 수 있는",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DO6i370DWEV/",
    date: "2025-09-22"
  },
  {
    id: 65,
    situation_kr: "댓글에 ‘퀴즈’만 남기시면 DM으로 무료 퀴즈/고급 영어 자료 링크가 제공됩니다!",
    expression_en: "obsessive compulsive disorder",
    description_kr: "",
    tags: ["주문", "표현"],
    reel_url: "https://www.instagram.com/reel/DO1S5z8AXne/",
    date: "2025-09-20"
  },
  {
    id: 66,
    situation_kr: "영어 공부 꾸준히 하고싶다면? ‘퀴즈’라고 남기면 DM 드립니다.",
    expression_en: "",
    description_kr: "언제, 어떤 상황에서 쓰는 말일까? ✔ 상대가 이미 알아차려야 할 감정이나 사실을 못 보고 있을 때,",
    tags: ["감정", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DOuPCTzEqQ2/",
    date: "2025-09-17"
  },
  {
    id: 67,
    situation_kr: "목표에 몰입",
    expression_en: "Focus",
    description_kr: "Attention → 순간에 주의",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DOsysYEgQSK/",
    date: "2025-09-17"
  },
  {
    id: 68,
    situation_kr: "지금 방해하려는 순간",
    expression_en: "Sorry to bother you",
    description_kr: "영어가 정말 어려운 이유  →",
    tags: ["회의", "사과", "인사"],
    reel_url: "https://www.instagram.com/reel/DOlDUEPDh3C/",
    date: "2025-09-14"
  },
  {
    id: 69,
    situation_kr: "비례·강조",
    expression_en: "The more you practice, the better you get.",
    description_kr: "The more ~, the more ~ → , 리듬감 있음, 구조: The more + S + V → the more + S + V 예: The more you practice, the better you",
    tags: ["문화", "표현"],
    reel_url: "https://www.instagram.com/reel/DOfxKsRQpeO/",
    date: "2025-09-12"
  },
  {
    id: 70,
    situation_kr: "With all due respect 👉 격식 있는 자리에서 “실례지만”이라는 뜻으로, ",
    expression_en: "With all due respect",
    description_kr: "격식 있는 자리에서 “실례지만”이라는 뜻으로, 존중하면서도 반대 의견을 말할 때 사용. 예: , I think your conclusion",
    tags: ["거절", "감정", "반대", "정중한표현"],
    reel_url: "https://www.instagram.com/reel/DOas79KAbKV/",
    date: "2025-09-10"
  },
  {
    id: 71,
    situation_kr: "양측 균형 비교",
    expression_en: "But",
    description_kr: "On (the) one hand / On the other hand → , 객관적 톤, 두 측면 나란히  → 단순 반전, 직설, 앞내용 뒤집기",
    tags: ["정중한표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DOS5LZHwpVX/",
    date: "2025-09-07"
  },
  {
    id: 72,
    situation_kr: "중요한 건 꺾이지 않는 마음, 영어 버전이 있을까?",
    expression_en: "for good or for worse",
    description_kr: "영어 표현 for good or for worse 는 상황이 좋든 나쁘든, 어떤 결과가 오더라도 끝까지 함께하겠다는 의미를 담고 있어요. 단순히 긍정적인 순간만이 아니라 힘든 순간까지도 끌어안겠다는 다짐이죠. 그래서",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DONzwotjNjA/",
    date: "2025-09-05"
  },
  {
    id: 73,
    situation_kr: "내 취향이 아니거나 별로일 때. 부드럽게 거절하는 회화 표현",
    expression_en: "🔹 It’s not my thing",
    description_kr: "예문: Camping’s not really my thing. →",
    tags: ["감사", "거절", "완곡표현", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DOIl_R-QjfR/",
    date: "2025-09-03"
  },
  {
    id: 74,
    situation_kr: "결승에서 전승했다",
    expression_en: "clean sweep",
    description_kr: "한화 연승 영어로는? 표현:",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DOA3tGWxa42/",
    date: "2025-08-31"
  },
  {
    id: 75,
    situation_kr: "네 말대로",
    expression_en: "🔹 as you just said",
    description_kr: "예문: As you just said, this process takes time. → 방금 네가 말한 내용을 받아서 이어가거나 강조할 때. 회의·발표 등 포멀한 자리에서도 사용 가능",
    tags: ["회의", "완곡표현"],
    reel_url: "https://www.instagram.com/reel/DN7uBHmQqkY/",
    date: "2025-08-29"
  },
  {
    id: 76,
    situation_kr: "단계별로",
    expression_en: "step by step",
    description_kr: "차근차근 영어로 모르시죠? 표현: as you go",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DN2kfFtxiIg/",
    date: "2025-08-27"
  },
  {
    id: 77,
    situation_kr: "요청이나 질문을 꺼내기 전에 예의 있게 말할 때",
    expression_en: "🔹 Sorry to bother you",
    description_kr: "예문: Sorry to bother you, but I wanted to ask something. →",
    tags: ["사과", "정중한표현", "비즈니스"],
    reel_url: "https://www.instagram.com/reel/DNu2En9QmNj/",
    date: "2025-08-24"
  },
  {
    id: 78,
    situation_kr: "자신을 다치게 한 사람을 용서하려면 그릇이 큰 사람이어야 한다.",
    expression_en: "big man",
    description_kr: "테토남을 영어로? 표현:",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DNpserixSRH/",
    date: "2025-08-22"
  },
  {
    id: 79,
    situation_kr: "볼의 뼈",
    expression_en: "🟩 1. cheekbones",
    description_kr: "의미: 눈 아래 양쪽 볼에 위치한 뼈로 얼굴의 윤곽을 형성하는 데 중요한 역할 \udde0 기억 팁: ”cheek“ + ”bone“ =",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DNki4S5TZlT/",
    date: "2025-08-20"
  },
  {
    id: 80,
    situation_kr: "댓글에 ‘퀴즈’만 남기시면 DM으로 무료 퀴즈를 풀 수 있는 오픈카톡방 링크가 전송됩니다!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DNfJ7PvRrlw/",
    date: "2025-08-18"
  },
  {
    id: 81,
    situation_kr: "지금은 일단",
    expression_en: "For now",
    description_kr: "원어민이 말하는 진짜 지금 지금은 그렇지만 나중엔 아닐 수도 있다는 뉘앙스",
    tags: ["사과", "정중한표현", "뉘앙스", "연애"],
    reel_url: "https://www.instagram.com/reel/DNc0iqQR6iy/",
    date: "2025-08-17"
  },
  {
    id: 82,
    situation_kr: "I’ve had a rough day. I need to [표현] and relax",
    expression_en: "🎯 I’ve had a rough day. I need to [표현] and relax",
    description_kr: "(오늘 하루 너무 힘들었어. [표현]하면서 좀 쉬어야겠어)",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DNXq7TYzkLt/",
    date: "2025-08-15"
  },
  {
    id: 83,
    situation_kr: "\"A가 B에게 영향을 주고",
    expression_en: "Vice versa",
    description_kr: "영어 간단하게 말하는 꿀팁 \"\"는 라틴어에서 유래된 표현으로, \"그 반대로도\", \"역으로도\" 라는 뜻입니다.",
    tags: ["반대", "문화"],
    reel_url: "https://www.instagram.com/reel/DNS4zh4MUym/",
    date: "2025-08-13"
  },
  {
    id: 84,
    situation_kr: "잘난 척, 아는 척, 자랑질… 상황마다 딱 맞는 단어가 있어요.",
    expression_en: "He kept correcting everyone in the meetin",
    description_kr: "\udccc 듣는 사람이 짜증날 정도로 잘난 척할 때",
    tags: ["회의", "표현"],
    reel_url: "https://www.instagram.com/reel/DNKy7qTzkaQ/",
    date: "2025-08-10"
  },
  {
    id: 85,
    situation_kr: "설명이 명확하고 헷갈리지 않아.",
    expression_en: "1️⃣ Very simple → straightforward",
    description_kr: "어렵지만 도전 의식 느껴져.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DNFyTUHxIn7/",
    date: "2025-08-08"
  },
  {
    id: 86,
    situation_kr: "“그 영상 너무 웃겨서 나 진짜…”",
    expression_en: "That video was so funny, I laughed.",
    description_kr: "이럴 땐 영어로 이렇게 말해요. 웃음의 강도와 순간에 따라 표현이 달라져요.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DNAfugWTd4M/",
    date: "2025-08-06"
  },
  {
    id: 87,
    situation_kr: "I can’t help it.",
    expression_en: "I can’t help it.",
    description_kr: "습관처럼 나와서 스스로 못 막는다는 뜻 강한 감정에 휩싸여 통제가 안 된다는 뜻",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DM40RbTsWaI/",
    date: "2025-08-03"
  },
  {
    id: 88,
    situation_kr: "Water가 들어가는 표현 3가지 정리!!",
    expression_en: "test the waters",
    description_kr: "본격적으로 시작하기 전에 반응이나 가능성을 살펴보는 표현 주장이나 논리가 논리적으로 타당할 때 쓰는 표현",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DMzoPdhxlg_/",
    date: "2025-08-01"
  },
  {
    id: 89,
    situation_kr: "그녀는 예술",
    expression_en: "Whatnot? 뭐라고 한 거야…? 😮",
    description_kr: "Whatnot? 뭐라고 한 거야…? \ude2e 일상 대화에서 원어민들이 자주 쓰는 표현, “whatnot”! 이 표현 하나로 영어 실력 업그레이드할 수 있어요.",
    tags: ["뉘앙스", "문화"],
    reel_url: "https://www.instagram.com/reel/DMuf511xAAD/",
    date: "2025-07-30"
  },
  {
    id: 90,
    situation_kr: "더위 식히는 표현 정리!",
    expression_en: "cool off",
    description_kr: "더위를 식히거나 몸의 열을 내리는 표현으로, 무더위에 잠시 시원함을 찾을 때 사용 수영장, 해변, 워터파크 등에서 잠깐 물에 들어가 몸을 식힐 때 쓰는 표현",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DMmv2U5xY0s/",
    date: "2025-07-27"
  },
  {
    id: 91,
    situation_kr: "둘 사이에 낀 사람. 민망하지만 유머로 표현 가능.",
    expression_en: "Third wheel",
    description_kr: "무리에서 소외된 느낌. 감정이 상했을 때 사용. 눈치 보며 따라간 상황. 겸손하게 말할 때 씀.",
    tags: ["감정", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DMhmaRUxaLV/",
    date: "2025-07-25"
  },
  {
    id: 92,
    situation_kr: "“요즘 탈모가 시작된 것 같아. 신경이 쓰이기 시작했어.”",
    expression_en: "Lately, I",
    description_kr: "영어로는 이렇게 말해요. 탈모의 유형이나 진행 정도에 따라 표현이 조금씩 달라져요. 내 상황에 맞게 골라 써보세요.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DMcg2Tuxtvp/",
    date: "2025-07-23"
  },
  {
    id: 93,
    situation_kr: "영어로 말도 안돼! 뭐라고할까?",
    expression_en: "Get out of here",
    description_kr: "같은 표현이라도 상황에 따라 전혀 다른 의미로 쓰입니다. 놀람이나 믿기지 않을 때",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DMUu49TxqM9/",
    date: "2025-07-20"
  },
  {
    id: 94,
    situation_kr: "\"우리끼리 잠깐 얘기할 수 있을까?\"",
    expression_en: "We just need a second.",
    description_kr: "영어로는 이렇게 말해요. 상황에 따라 조금씩 다른 말투, 그 뉘앙스를 익혀보세요.",
    tags: ["감정", "정중한표현", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DMPkqirTDXo/",
    date: "2025-07-18"
  },
  {
    id: 95,
    situation_kr: "감정·통증 털어내는 영어 표현 4가지",
    expression_en: "walk it off",
    description_kr: "\"걸으면서 털어내\"",
    tags: ["감정", "동의"],
    reel_url: "https://www.instagram.com/reel/DMKpyIYOjfq/",
    date: "2025-07-16"
  },
  {
    id: 96,
    situation_kr: "시간 면에서는",
    expression_en: "wise, we",
    description_kr: "“~면에서는” 영어로 어떻게 말할까? 일상회화에 찰떡같이 붙는 **-wise 표현들**, 요렇게 써요\udc47",
    tags: ["돈", "표현"],
    reel_url: "https://www.instagram.com/reel/DMCvUDFx3bK/",
    date: "2025-07-13"
  },
  {
    id: 97,
    situation_kr: "미국식 정신차려",
    expression_en: "Get it together",
    description_kr: "”정신 차려“ 영어에선 상황에 따라 다르게 표현합니다.",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DL9jJnIzS3W/",
    date: "2025-07-11"
  },
  {
    id: 98,
    situation_kr: "“우선순위는 낮아”",
    expression_en: "Less necessary",
    description_kr: "회의 중, 아이디어 평가할 때 쓸 수 있는 표현들! 비판은 조심스럽게, 하지만 분명하게 \udc47",
    tags: ["회의", "거절", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DL4Zw-SRp6R/",
    date: "2025-07-09"
  },
  {
    id: 99,
    situation_kr: "“이제야 전화했네?” (기다렸어!)",
    expression_en: "It’s about time",
    description_kr: "드디어 그럴 때가 됐다는 뜻. 기다림 끝에 말하는 “이제야!”의 뉘앙스.",
    tags: ["전화", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DLwrFe6xTkO/",
    date: "2025-07-06"
  },
  {
    id: 100,
    situation_kr: "캐주얼하게 “완전 콜”",
    expression_en: "Sounds good to me",
    description_kr: "“좋은 생각이야!” 영어로 꼭 *That’s a good idea!*만 쓰라는 법은 없죠. 상황 따라 더 자연스럽게 말해보세요 \udc47",
    tags: ["동의", "반대"],
    reel_url: "https://www.instagram.com/reel/DLrhfeCz8sA/",
    date: "2025-07-04"
  },
  {
    id: 101,
    situation_kr: "나 그럴 사람이지.",
    expression_en: "m good for it.",
    description_kr: "“그 돈 진짜 갚을 거야?” “이번엔 믿어도 돼?”",
    tags: ["뉘앙스", "돈"],
    reel_url: "https://www.instagram.com/reel/DLmYiqdxqkB/",
    date: "2025-07-02"
  },
  {
    id: 102,
    situation_kr: "(90년대 스타일) 말하지 마",
    expression_en: "talk to the hand",
    description_kr: "말 섞기 싫을 때 쓰는 영어 표현 3가지 ✋ → , 얼굴은 안 듣거든?",
    tags: ["거절", "감정", "뉘앙스", "돈"],
    reel_url: "https://www.instagram.com/reel/DLephNzR1Z-/",
    date: "2025-06-29"
  },
  {
    id: 103,
    situation_kr: "이유 없이 잠수",
    expression_en: "stop texting",
    description_kr: "연락 끊는 사람, 영어로? 단순히 “” 말고, 요즘은 이렇게 표현합니다:",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DLZgBD2RcYK/",
    date: "2025-06-27"
  },
  {
    id: 104,
    situation_kr: "공감과 피로 표현할 때 좋은 표현!",
    expression_en: "🔥 Tell me about it.",
    description_kr: "나도 똑같았어 / 완전 지긋지긋해",
    tags: ["회의", "표현"],
    reel_url: "https://www.instagram.com/reel/DLUWcWrzzTP/",
    date: "2025-06-25"
  },
  {
    id: 105,
    situation_kr: "말끔하고 멋지게 차려입은 (보통 남성에게)",
    expression_en: "You look good",
    description_kr: "“옷 멋지게 입었네!” 단순히 “” 말고,",
    tags: ["칭찬", "비즈니스", "문화", "돈"],
    reel_url: "https://www.instagram.com/reel/DLMoB0SRF-P/",
    date: "2025-06-22"
  },
  {
    id: 106,
    situation_kr: "따지는 느낌",
    expression_en: "s on your face?",
    description_kr: "같은 말도 표현 하나로 느낌이 달라진다! \udc40 얼굴에 뭐 묻었을 때",
    tags: ["감정", "완곡표현"],
    reel_url: "https://www.instagram.com/reel/DLHeY-vzKy-/",
    date: "2025-06-20"
  },
  {
    id: 107,
    situation_kr: "차근차근",
    expression_en: "Let me walk you through the steps.",
    description_kr: "\uddfa “explain”만 알고 있으면 영어가 건조해 보여요. 더 세련된 표현, 바로 이렇게 써보세요!",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DLCUyJQxs8y/",
    date: "2025-06-18"
  },
  {
    id: 108,
    situation_kr: "“Yeah, right.” – 안 믿겨! 비꼬는 영어 표현",
    expression_en: "🎯 “Yeah, right.” – 안 믿겨! 비꼬는 영어 표현",
    description_kr: "상황: 누군가 한 말을 믿기 힘들 때",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DK6md0iTG_d/",
    date: "2025-06-15"
  },
  {
    id: 109,
    situation_kr: "마신 뒤부터 점차 정신이 든다.",
    expression_en: "Once I drink coffee",
    description_kr: "변화의 흐름에 초점.",
    tags: ["카페", "뉘앙스", "문화"],
    reel_url: "https://www.instagram.com/reel/DK1c5aRRRoQ/",
    date: "2025-06-13"
  },
  {
    id: 110,
    situation_kr: "**“He didn’t make it.” 단순 ‘안 왔어’가 아니에요!**",
    expression_en: "He didn",
    description_kr: "**“’t make it.” 단순 ‘안 왔어’가 아니에요!** 약속이나 목표에 못 도달했을 때, 원어민은 이렇게 말해요.",
    tags: ["회의", "정중한표현"],
    reel_url: "https://www.instagram.com/reel/DKwTT-hTw8p/",
    date: "2025-06-11"
  },
  {
    id: 111,
    situation_kr: "want 대신에 crave, desire, yearn 같은 표현을 써보세요.",
    expression_en: "want 대신에 crave, desire, yearn 같은 표현을 써보세요.",
    description_kr: "crave: 강렬한 갈망이나 식욕, 욕망을 표현할 때 desire: 격식 있고 진지한 욕구나 바람을 표현할 때",
    tags: ["정중한표현", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DKol3eoNgj7/",
    date: "2025-06-08"
  },
  {
    id: 112,
    situation_kr: "🤲 너무 직접적이면 “I could use some company” 같이 따뜻한 표현도 좋아요.",
    expression_en: "🔹 “I’m lonely” vs “I feel lonely”",
    description_kr: "“I’m lonely”는 깊은 외로움, “I feel lonely”는 순간 감정! 대화에선 “I feel lonely”가 더 자연스럽고 부드러워요.",
    tags: ["감정", "완곡표현", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DKjbpLOxO2W/",
    date: "2025-06-06"
  },
  {
    id: 113,
    situation_kr: "표 없어요… I’m afraid so. (안타까움 포함)",
    expression_en: "I’m afraid so / I think so / I guess so",
    description_kr: "비슷해 보여도 뉘앙스는 다 달라요. •\tI’m afraid so: 유감이지만 그렇다는 뜻.",
    tags: ["감정", "동의", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DKeS1Yntrz4/",
    date: "2025-06-04"
  },
  {
    id: 114,
    situation_kr: "“보여주기용 자랑”",
    expression_en: "Showboat",
    description_kr: "말보다 행동으로 과하게 튀는 사람",
    tags: ["거절", "표현"],
    reel_url: "https://www.instagram.com/reel/DKMQHyKz-Vm/",
    date: "2025-06-01"
  },
  {
    id: 115,
    situation_kr: "‘쓰는 행위’에 초점",
    expression_en: "“single-use”랑 “disposable”,",
    description_kr: "둘 다 일회용인데 뭐가 다른 걸까?",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DKRdMVLRk2f/",
    date: "2025-05-30"
  },
  {
    id: 116,
    situation_kr: "우승을 못한 팀을 말할 때 trophyless나 trophy drought 같은 표현을 많이 들어보셨죠?",
    expression_en: "우승을 못한 팀을 말할 때 trophyless나 trophy drought 같은 표현을 많이 들어보셨죠?",
    description_kr: "trophyless는 말 그대로 “트로피가 없는”, trophy drought는 “우승 가뭄”이라는 뜻이에요. 그런데 실제 원어민들은 이렇게 단순히 상태만 말하지 않고,",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DKMQGECzZJM/",
    date: "2025-05-28"
  },
  {
    id: 117,
    situation_kr: "미국에서는 MBTI 대신 ‘Zodiac Sign(별자리)’로 성격을 보는 경우가 많다는 거",
    expression_en: "Zodiac Sign",
    description_kr: "미국에서는 MBTI 대신 ‘(별자리)’로 성격을 보는 경우가 많다는 거, 알고 있었나요? 은 태어난 생일에 따라 정해지는 12개의 별자리예요.",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DKEimw5O_hK/",
    date: "2025-05-25"
  },
  {
    id: 118,
    situation_kr: "소개팅 or 썸처럼 막 시작된 관계",
    expression_en: "I have a boyfriend",
    description_kr: "여러분 혹시 \"\"만 쓰고 있진 않나요? 사귄다고 다 같은 게 아니에요.",
    tags: ["뉘앙스", "연애"],
    reel_url: "https://www.instagram.com/reel/DJ_YJ0yzZbT/",
    date: "2025-05-23"
  },
  {
    id: 119,
    situation_kr: "괜히 말싸움을 걸었어.",
    expression_en: "just for the sake of it 이라는 표현, 들어본 적 있나요?",
    description_kr: "이 말은 어떤 행동을 특별한 이유 없이, 그냥 그 자체로 하는 걸 말해요. 왜 했냐고 물어보면, 그냥 했다고 말할 때 쓰는 표현이에요.",
    tags: ["거절", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DJyhAEcx3WA/",
    date: "2025-05-21"
  },
  {
    id: 120,
    situation_kr: "감정 자체 (명사)",
    expression_en: "She showed no emotion.",
    description_kr: "매일 영어 퀴즈 & 옥쌤 고퀄 무료 자료를 받을 수 있어요. 하루 1문제로 영어 루틴, 지금 시작해요.",
    tags: ["거절", "감정", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DJtWki9zBDr/",
    date: "2025-05-18"
  },
  {
    id: 121,
    situation_kr: "영어 잘하고 싶으신 분들은 저장해두고 기억하세요!",
    expression_en: "",
    description_kr: "댓글에 퀴즈만 남기시면 DM으로 곧 옥쌤 영어 공부방에서 무료 퀴즈  고급 영어 자료등이 제공됩니다!",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DJoNDpdxlCV/",
    date: "2025-05-16"
  },
  {
    id: 122,
    situation_kr: "바로 circle back!",
    expression_en: "circle back!",
    description_kr: "회의 중에 ‘이건 나중에 다시 얘기하자’ 영어로 뭐라고 할까요? -> 바로",
    tags: ["회의", "이메일", "비즈니스"],
    reel_url: "https://www.instagram.com/reel/DJgelUaRpLe/",
    date: "2025-05-14"
  },
  {
    id: 123,
    situation_kr: "회의나 공식적인 자리에서 쓰기 좋아요.",
    expression_en: "As far as I",
    description_kr: "“I think”만 쓰기엔… 뭔가 심심하죠? 영어로 생각을 말할 땐, 상황에 따라 더 어울리는 표현이 있어요.",
    tags: ["회의", "표현"],
    reel_url: "https://www.instagram.com/reel/DJbVCeDz9Jy/",
    date: "2025-05-11"
  },
  {
    id: 124,
    situation_kr: "‘I’m lonely’만 쓰지 말자. 더 자연스럽게 말하는 법!",
    expression_en: "m lonely",
    description_kr: "외롭다고 꼭 “I’”라고 해야 할까? 조금 더 부드럽고, 진짜처럼 들리는 표현을 소개할게요:",
    tags: ["감정", "완곡표현"],
    reel_url: "https://www.instagram.com/reel/DJWLbuEx_3X/",
    date: "2025-05-09"
  },
  {
    id: 125,
    situation_kr: "영어 잘하는 사람처럼 말하고 싶다면,",
    expression_en: "I mean",
    description_kr: "문장 사이사이에 자연스럽게 들어가는 이 표현들부터 써보세요! •\t: 말하면서 정정하거나, 강조할 때",
    tags: ["완곡표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DJOdF2RzrEV/",
    date: "2025-05-07"
  },
  {
    id: 126,
    situation_kr: "바깥쪽 근육!",
    expression_en: "Add to body",
    description_kr: "BD는 엉덩이처럼 생겼다 →  AD는 Add! → 안쪽으로 끌어당기는 근육!",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DJJTclGzqhs/",
    date: "2025-05-04"
  },
  {
    id: 127,
    situation_kr: "“Goodbye”만 계속 쓰는 것 같다면,",
    expression_en: "See you later",
    description_kr: "이제는 좀 더 자연스럽고 원어민처럼 인사해보세요! 오늘 소개하는 표현은 총 4가지입니다:",
    tags: ["인사", "표현"],
    reel_url: "https://www.instagram.com/reel/DJBlG_0xG6O/",
    date: "2025-05-02"
  },
  {
    id: 128,
    situation_kr: "무엇보다도 가장 먼저 강조하고 싶을 때",
    expression_en: "first and foremost",
    description_kr: "오늘은 말할 때 순서를 강조하는 두 표현! →",
    tags: ["회의", "감사"],
    reel_url: "https://www.instagram.com/reel/DI8z3oCzMz-/",
    date: "2025-04-29"
  },
  {
    id: 129,
    situation_kr: "나이가 들면서 자연스럽게 ~를 안 하게 되다",
    expression_en: "grow out of it",
    description_kr: "예: He was shy, but he grew out of it.",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DI3R4zixqNQ/",
    date: "2025-04-27"
  },
  {
    id: 130,
    situation_kr: "말 그대로 따지면 / 엄밀히 말하면",
    expression_en: "technically",
    description_kr: "오늘은 원어민이 말할 때 자주 쓰는 부드러운 시작 표현 2가지! →",
    tags: ["전화", "문화"],
    reel_url: "https://www.instagram.com/reel/DIyIWb9TElc/",
    date: "2025-04-25"
  },
  {
    id: 131,
    situation_kr: "피곤함이 없는 = 지치지 않는",
    expression_en: "tireless",
    description_kr: "\udccc 영어 단어 끝에 -less가 붙으면 무슨 뜻일까요? 쉽게 말하면",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DIs-wCQzCAq/",
    date: "2025-04-23"
  },
  {
    id: 132,
    situation_kr: "- Friend",
    expression_en: "Friend",
    description_kr: "의미: 남사친(남자 사람 친구)과 여사친(여자 사람 친구)을 모두 포함하는 통칭입니다. 서로 편하게 대화하고, 함께 시간을 보내지만 연애 감정 없이 지내는 관계를 말합니다.",
    tags: ["감정", "연애"],
    reel_url: "https://www.instagram.com/reel/DIoQDBBN345/",
    date: "2025-04-21"
  },
  {
    id: 133,
    situation_kr: "make memories: 추억을 만들다. 특별한 순간을 기억에 남기도록 의미 있게 보내는 것",
    expression_en: "make memories",
    description_kr: "영원히 기억될 순간을 만드는 중 물건보다 추억을 모으는 중",
    tags: ["연애", "표현"],
    reel_url: "https://www.instagram.com/reel/DIirg-WTQue/",
    date: "2025-04-19"
  },
  {
    id: 134,
    situation_kr: "비즈니스 영어 – 화상회의 중 연결 끊겼을 때!",
    expression_en: "I think we lost him",
    description_kr: "걔 연결이 끊긴 것 같아요 / (화면에서) 사라졌어요 예) . Can someone check?",
    tags: ["회의", "비즈니스"],
    reel_url: "https://www.instagram.com/reel/DId54cEgDxG/",
    date: "2025-04-17"
  },
  {
    id: 135,
    situation_kr: "“soy milk = 두유”",
    expression_en: "soy milk",
    description_kr: "영어 단어, 뜻 하나만 있는 줄 알았죠? 근데 일상 단어 중에 뜻이 두 개 이상인 경우, 정말 많습니다!",
    tags: ["동의", "표현"],
    reel_url: "https://www.instagram.com/reel/DIYYUxVTnTW/",
    date: "2025-04-15"
  },
  {
    id: 136,
    situation_kr: "비즈니스 영어 – 회의 끝낼 때 이렇게 말해요!",
    expression_en: "s it for today",
    description_kr: "오늘은 여기까지입니다 / 오늘 회의는 이걸로 마칩니다. 예) Alright, that’. Thanks, everyone!",
    tags: ["회의", "감사", "비즈니스"],
    reel_url: "https://www.instagram.com/reel/DITaUF-tmZ_/",
    date: "2025-04-13"
  },
  {
    id: 137,
    situation_kr: "화상회의할 때, 이런 영어 표현 써보셨나요?",
    expression_en: "Can you hear me?",
    description_kr: "소리가 잘 안 들릴 때, 아직도 이렇게 말하고 있진 않으신가요? 이 표현들, 문법은 맞지만 조금 어색하거나 너무 직설적으로 들릴 수 있어요.",
    tags: ["회의", "사과", "인사", "정중한표현"],
    reel_url: "https://www.instagram.com/reel/DIOFLOWzlH_/",
    date: "2025-04-11"
  },
  {
    id: 138,
    situation_kr: "Turn up vs. Turn down 쉽게 비교!",
    expression_en: "Turn up vs. Turn down 쉽게 비교!",
    description_kr: "Turn up(볼륨·온도 등을) 올리다 / (사람이) 나타나다 예) Can you turn up the volume?",
    tags: ["거절", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DII_Kwfs4GC/",
    date: "2025-04-09"
  },
  {
    id: 139,
    situation_kr: "당연하게 여기다 / 고마움을 느끼지 않다",
    expression_en: "Take something for granted – 헷갈리지 마세요!",
    description_kr: "",
    tags: ["감사", "표현"],
    reel_url: "https://www.instagram.com/reel/DIDx9E-z8Lm/",
    date: "2025-04-07"
  },
  {
    id: 140,
    situation_kr: "(그러니까) 괜찮아",
    expression_en: "Could be worse",
    description_kr: "“괜찮아”라고 말할 때 쓰는 영어 표현 2가지! 더 나쁠 수도 있었어 →",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DH-oYfbzhmD/",
    date: "2025-04-05"
  },
  {
    id: 141,
    situation_kr: "긍정적 의미",
    expression_en: "Hustler vs. Sandbagger – 의미가 완전 달라요!",
    description_kr: "Hustler열심히 사는 사람 →",
    tags: ["뉘앙스", "문화", "돈"],
    reel_url: "https://www.instagram.com/reel/DH5e2nMRh73/",
    date: "2025-04-03"
  },
  {
    id: 142,
    situation_kr: "Give in vs. Give up 차이점!",
    expression_en: "Give in vs. Give up 차이점!",
    description_kr: "포기하다. 더 이상 노력하지 않을 때 씁니다. 예) I gave up studying. (공부하는 걸 포기했어.)",
    tags: ["거절", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DH0VN2szqSn/",
    date: "2025-04-01"
  },
  {
    id: 143,
    situation_kr: "“응”이라고 대답하죠.",
    expression_en: "t you like it?",
    description_kr: "Yes / No 대답, 한국식으로 하면 안 돼요! 한국어로는 “안 좋아해?” →",
    tags: ["카페", "거절"],
    reel_url: "https://www.instagram.com/reel/DHvLsFyzOy3/",
    date: "2025-03-30"
  },
  {
    id: 144,
    situation_kr: "\"I'm not kidding\" – 진심으로 끝내줄 때",
    expression_en: "I'm not kidding",
    description_kr: "“”은 장난이 아니라는 의미지만, 기가 막힐 정도로 좋거나 멋질 때도 쓸 수 있어요. “This pizza is amazing, I’m not kidding!” (이 피자 진짜 끝내줘, 장",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DHqCENSTEBI/",
    date: "2025-03-28"
  },
  {
    id: 145,
    situation_kr: "솔직히 말하면",
    expression_en: "Honestly",
    description_kr: "“literally”, “”… 그냥 단어 아니에요. 원어민들은 이 표현들을 한국어의 ‘진짜로’, ‘솔직히’, ‘와 진심’처럼",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DHk4d-1TXqQ/",
    date: "2025-03-26"
  },
  {
    id: 146,
    situation_kr: "영어로 '억울하다'는 어떻게 말할까?",
    expression_en: "This is so unfair.",
    description_kr: "영어에는 “억울하다”에 딱 맞는 단어가 없어요. 대신 상황에 따라 이렇게 표현할 수 있어요. “” (이거 정말 불공평해.)",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DHfu32RTbWF/",
    date: "2025-03-24"
  },
  {
    id: 147,
    situation_kr: "Fine의 뜻 2가지",
    expression_en: "Fine의 뜻 2가지",
    description_kr: "괜찮아요 / 좋아요 예: I’m fine, thank you!",
    tags: ["감사", "감정", "돈"],
    reel_url: "https://www.instagram.com/reel/DHalR-Bz1Ci/",
    date: "2025-03-22"
  },
  {
    id: 148,
    situation_kr: "\"Pretty\"가 가진 3가지 의미",
    expression_en: "Pretty",
    description_kr: "\"\"는 하나의 단어에 여러 의미가 있어요. 예쁘다 (형용사): “She looks  in that dress.”",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DHVcPxzzbLJ/",
    date: "2025-03-20"
  },
  {
    id: 149,
    situation_kr: "Badass의 가장 일반적인 의미는?",
    expression_en: "Badass",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DHQSJrGznIl/",
    date: "2025-03-18"
  },
  {
    id: 150,
    situation_kr: "\"닥쳐\" (가볍거나 장난스럽게)",
    expression_en: "Zip it",
    description_kr: "\"\" & \"Keep it down\" – 더 자연스럽게 조용히 하라고 말하는 법 \"Shut up\"만 쓰면 무례하게 들릴 수 있다. 상황에 따라 더 적절한 표현을 사용하자.",
    tags: ["회의", "정중한표현"],
    reel_url: "https://www.instagram.com/reel/DHLIhoHx4S5/",
    date: "2025-03-16"
  },
  {
    id: 151,
    situation_kr: "“배 터질 것 같아!”",
    expression_en: "“I’m stuffed” – 원어민이 진짜 쓰는 배부름 표현",
    description_kr: "“I’m full”만 쓰면 초보 티 난다?!",
    tags: ["감사", "표현"],
    reel_url: "https://www.instagram.com/reel/DHF-6BJTCD1/",
    date: "2025-03-14"
  },
  {
    id: 152,
    situation_kr: "성숙도⬇ (부정적)",
    expression_en: "immature",
    description_kr: "뜻: 미성숙한, 유치한 성격이나 행동이 어른스럽지 못한 경우",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DHA1UCpzE2T/",
    date: "2025-03-12"
  },
  {
    id: 153,
    situation_kr: "지금도 좋지만",
    expression_en: "Even better",
    description_kr: "미국식 럭키비키(근데 대부분 모름)  = , 더 좋아질 수 있을 때",
    tags: ["주문", "여행"],
    reel_url: "https://www.instagram.com/reel/DG7vI58xCMN/",
    date: "2025-03-10"
  },
  {
    id: 154,
    situation_kr: "불을 켜다 (불이 추가됨)",
    expression_en: "Turn on the light.",
    description_kr: "”on“의 기본 의미 → 위에, 붙다, 추가되다 ✔ ”“ →",
    tags: ["비즈니스", "표현"],
    reel_url: "https://www.instagram.com/reel/DG2iJEhT-Iz/",
    date: "2025-03-08"
  },
  {
    id: 155,
    situation_kr: "일반적인 스트레스 상황",
    expression_en: "I have a lot of stress",
    description_kr: "한국인이 자주 쓰는 스트레스 관련 영어 표현 \udccc ”스트레스 받았어“ 영어로?",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DGxb9FYR_gu/",
    date: "2025-03-06"
  },
  {
    id: 156,
    situation_kr: "내가 지루한 상태!",
    expression_en: "Bored",
    description_kr: "\udd0d ” vs. Boring“ 차이 한눈에 정리! \udd0d ”“ (감정) →",
    tags: ["감정", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DGsO_c0TuR9/",
    date: "2025-03-04"
  },
  {
    id: 157,
    situation_kr: "”That tracks.“ ( 의미가 이상함)",
    expression_en: "That tracks",
    description_kr: "Pov 일단 몰라도 맞장구 칠 때 유용한 표현 \udccc ”“ 뜻:",
    tags: ["동의", "표현"],
    reel_url: "https://www.instagram.com/reel/DGnI3V1x01e/",
    date: "2025-03-02"
  },
  {
    id: 158,
    situation_kr: "영향을 주다",
    expression_en: "Affect",
    description_kr: "”“ (동사) →  ✔ ”Stress s my health.“ → 스트레스는 내 건강에 영향을 준다.",
    tags: ["동의", "건강"],
    reel_url: "https://www.instagram.com/reel/DGh708wTvyc/",
    date: "2025-02-28"
  },
  {
    id: 159,
    situation_kr: "완전 멘붕일 때 영어 표현 알아보기",
    expression_en: "Freak out",
    description_kr: "✈ ”“ 영어 표현 정리 ✈ 매우 당황하다, 놀라다, 충격받다",
    tags: ["감정", "표현"],
    reel_url: "https://www.instagram.com/reel/DGc1rl6RW2e/",
    date: "2025-02-26"
  },
  {
    id: 160,
    situation_kr: "(X) ”나 너무 섹시해“ 로 들릴 수 있음! \ude33",
    expression_en: "❌ ”I’m so hot.“ → (X) ”나 너무 섹시해“ 로 들릴 수 있음! 😳",
    description_kr: "”I’m so hot.“ →  ”It‘s so hot in here.“ → (O) ”여기 너무 덥다“ (자연스러운 표현)",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DGXsUC_Ma6g/",
    date: "2025-02-24"
  },
  {
    id: 161,
    situation_kr: "✨ 미드 속 슬랭 필수 3종 세트 ✨",
    expression_en: "m gonna study.",
    description_kr: "미래에 할 일 예: I’ (공부할 거야)",
    tags: ["슬랭", "표현"],
    reel_url: "https://www.instagram.com/reel/DGSmzzbTeIH/",
    date: "2025-02-22"
  },
  {
    id: 162,
    situation_kr: "”나 어때?“ (외모",
    expression_en: "✔ how + look",
    description_kr: "• 전체적인 상태나 인상을 묻는 표현 • ”How do I look?“ → , 옷차림 등)",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DGNVejbxoJ4/",
    date: "2025-02-20"
  },
  {
    id: 163,
    situation_kr: "“그냥 같이 놀자!”",
    expression_en: "Hang Out",
    description_kr: "“? Grab a coffee? 뭐가 다를까?” ✔  =",
    tags: ["카페", "문화"],
    reel_url: "https://www.instagram.com/reel/DGIPVBwxlSf/",
    date: "2025-02-18"
  },
  {
    id: 164,
    situation_kr: "물리적인 거리 (실제로 더 멀리 있는 경우)",
    expression_en: "Farther",
    description_kr: "\udccc  →  \udccc Further → 비유적인 거리, 추가적인 발전 (거리뿐만 아니라 논의, 연구, 발전에도 사용)",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DGDIidjshBi/",
    date: "2025-02-16"
  },
  {
    id: 165,
    situation_kr: "특별한 일 없이 어슬렁거리고 있었어.",
    expression_en: "I was just hanging around",
    description_kr: "영어로 할 말 없을 때 미친 꿀팁! ✔  →",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DF98DygzhGa/",
    date: "2025-02-14"
  },
  {
    id: 166,
    situation_kr: "“내가 틀렸다면 정정해 줘”",
    expression_en: "Correct me if I",
    description_kr: "’m wrong =  ✔ 확신이 없을 때 조심스럽게 의견을 말할 때 사용",
    tags: ["완곡표현", "표현"],
    reel_url: "https://www.instagram.com/reel/DF4wy6lAoyd/",
    date: "2025-02-12"
  },
  {
    id: 167,
    situation_kr: "더 강한 어조. 짜증이 난 상태에서 상대방의 행동을 멈추게 하고 싶을 때 사용.예문:",
    expression_en: "Cut it out",
    description_kr: "”과 “Knock it off”는 둘 다 상대방에게 어떤 행동을 그만두라고 할 때 쓰는 표현이에요. ✔  → 좀 더 가벼운 느낌. 친구들끼리 장난을 너무 심하게 칠 때 “그만해!“",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DFzo8TVpyy8/",
    date: "2025-02-10"
  },
  {
    id: 168,
    situation_kr: "언젠가 (특정하지 않은 미래나 과거의 시간)",
    expression_en: "Sometimes",
    description_kr: "\udccc ** → 가끔, 때때로 (규칙적이지 않은 반복적인 일) \udccc *Sometime* →",
    tags: ["카페", "문화"],
    reel_url: "https://www.instagram.com/reel/DFxEIpSzoLf/",
    date: "2025-02-08"
  },
  {
    id: 169,
    situation_kr: "Chill하게 살자구요",
    expression_en: "Chill",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DFub8KNT4NR/",
    date: "2025-02-07"
  },
  {
    id: 170,
    situation_kr: "마지막",
    expression_en: "Last",
    description_kr: "\udccc  → , 가장 최근의 (다음이 있을 수도 있음) \udccc Final → 진짜 끝, 최종적인 것 (더 이상 없음)",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DFpVwVQTOpH/",
    date: "2025-02-06"
  },
  {
    id: 171,
    situation_kr: "상대방의 말을 정확히 이해했는지 확인할 때 사용하는 표현",
    expression_en: "Let me get this straight. You",
    description_kr: "\udccc 의미 →  \udccc 상황 → 혼동되거나 중요한 내용을 다시 정리할 때",
    tags: ["회의", "뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DFkJ2olgUsk/",
    date: "2025-02-04"
  },
  {
    id: 172,
    situation_kr: "\"이건 나한테 정말 큰 의미가 있어.\"",
    expression_en: "Your support means a lot to me.",
    description_kr: "\udccc \"It means a lot to me\" →  (감사, 감동, 고마움을 표현할 때 많이 사용)",
    tags: ["감사", "감정"],
    reel_url: "https://www.instagram.com/reel/DFfCgl5z3wA/",
    date: "2025-02-02"
  },
  {
    id: 173,
    situation_kr: "나중에 (시간)",
    expression_en: "Later",
    description_kr: "\udccc  →  \udccc Latter → 둘 중에서 후자 (두 개 중에서 뒤에 오는 것)",
    tags: ["카페", "전화", "발음"],
    reel_url: "https://www.instagram.com/reel/DFZ1k8PTre7/",
    date: "2025-01-31"
  },
  {
    id: 174,
    situation_kr: "한국인들이 늘 틀리는 영어 발음 3가지",
    expression_en: "",
    description_kr: "",
    tags: ["발음"],
    reel_url: "https://www.instagram.com/reel/DFUvYtKTTZD/",
    date: "2025-01-29"
  },
  {
    id: 175,
    situation_kr: "미묘한 영어표현 차이",
    expression_en: "",
    description_kr: "",
    tags: ["뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DFPtkklxho6/",
    date: "2025-01-27"
  },
  {
    id: 176,
    situation_kr: "옥쌤과 함께 블랙핑크 제니 영어실력 따라잡기!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DFKcMccJP3e/",
    date: "2025-01-25"
  },
  {
    id: 177,
    situation_kr: "남들은 잘 모르는 영어 디테일 차이!",
    expression_en: "",
    description_kr: "",
    tags: ["뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DFFQ63jT7m1/",
    date: "2025-01-23"
  },
  {
    id: 178,
    situation_kr: "In vs at 정확한 차이 아는 사람?",
    expression_en: "In vs at 정확한 차이 아는 사람?",
    description_kr: "옥쌤과 함께하는 영어 표현 공부",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DFAYcPcT16K/",
    date: "2025-01-21"
  },
  {
    id: 179,
    situation_kr: "여유있게 영어하는법!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DE69v8HTslJ/",
    date: "2025-01-19"
  },
  {
    id: 180,
    situation_kr: "블랙핑크 제니 영어도 잘합니다! 옥쌤과 함께 익히는 영어표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DE2XY-xxDqx/",
    date: "2025-01-17"
  },
  {
    id: 181,
    situation_kr: "회사를 가기 싫을 때 영어로 어떻게 표현하면 될까요?",
    expression_en: "",
    description_kr: "",
    tags: ["거절", "비즈니스"],
    reel_url: "https://www.instagram.com/reel/DEwsTEFz8lL/",
    date: "2025-01-15"
  },
  {
    id: 182,
    situation_kr: "팀플 혼자 강제 하드 캐리하고 나서 영어로 뭐라고 하지?",
    expression_en: "",
    description_kr: "옥쌤과 함께 알아봅시다 By 표현의 중요성",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DErisGDTj95/",
    date: "2025-01-13"
  },
  {
    id: 183,
    situation_kr: "일론머스크의 사고방식 두번째!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DEmXVDmTQBt/",
    date: "2025-01-11"
  },
  {
    id: 184,
    situation_kr: "일상 속에서 무조건 오해하는 영어표현 3가지, 꼭 기억해두세요!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DEhq-ByNd56/",
    date: "2025-01-09"
  },
  {
    id: 185,
    situation_kr: "일론 머스크의 긍정적인 사고방식을 알 수 있는 영상, 옥쌤과 함께 공부해봅시다!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DEcR9t-txdn/",
    date: "2025-01-07"
  },
  {
    id: 186,
    situation_kr: "썬크림은 영어로 썬크림일까?",
    expression_en: "",
    description_kr: "한국 사람들이 자주 틀리는 영어 표현, 옥쌤과 함께 알아봐요!",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DEW_xovzjSJ/",
    date: "2025-01-05"
  },
  {
    id: 187,
    situation_kr: "트럼프 손녀 브이로그",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DERxDI_z295/",
    date: "2025-01-03"
  },
  {
    id: 188,
    situation_kr: "병원가다 = go to hospital??",
    expression_en: "병원가다 = go to hospital??",
    description_kr: "친구에게 병원가라고 할 때 한국인들이 가장 자주 틀리는 표현, 옥쌤과 함께 알아보시죠! 일상, 비즈니스 영어는 옥쌤과 함께!",
    tags: ["비즈니스", "표현"],
    reel_url: "https://www.instagram.com/reel/DEMpLFNzNzd/",
    date: "2025-01-01"
  },
  {
    id: 189,
    situation_kr: "친구를 마주쳤을때 영어에서 실례인 표현!  옥쌤과 함께 알아보아요",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DEHlpQlMfbR/",
    date: "2024-12-30"
  },
  {
    id: 190,
    situation_kr: "오징어 게임2 이정재 인터뷰로",
    expression_en: "",
    description_kr: "틈.새.영어 공략하기 여러분도 이정재 인터뷰, 영어로 생각해보세요!",
    tags: ["면접", "문화"],
    reel_url: "https://www.instagram.com/reel/DEChlgMsED8/",
    date: "2024-12-28"
  },
  {
    id: 191,
    situation_kr: "일론머스크가 생각하는 도지코인 인터뷰의 일부분입니다! 옥쌤과 함께 영어표현 알아보아요",
    expression_en: "",
    description_kr: "",
    tags: ["면접"],
    reel_url: "https://www.instagram.com/reel/DD88lfwz_yj/",
    date: "2024-12-26"
  },
  {
    id: 192,
    situation_kr: "오겜2 이정재, 인터뷰에서 스포?",
    expression_en: "",
    description_kr: "영어 인터뷰로 공부하기 with 옥쌤",
    tags: ["면접"],
    reel_url: "https://www.instagram.com/reel/DD4BCNmxgYe/",
    date: "2024-12-24"
  },
  {
    id: 193,
    situation_kr: "FAKER팬 필수 영어!",
    expression_en: "FAKER팬 필수 영어!",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DDzBzBrM_-r/",
    date: "2024-12-22"
  },
  {
    id: 194,
    situation_kr: "warm up vs heat up",
    expression_en: "warm up vs heat up",
    description_kr: "겨울에 알아두면 좋은 꿀팁영어! with 옥썜",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DDt-JliAt1P/",
    date: "2024-12-20"
  },
  {
    id: 195,
    situation_kr: "찐따남과 연애하려면 알아야 하는 필.수 영어",
    expression_en: "",
    description_kr: "",
    tags: ["연애"],
    reel_url: "https://www.instagram.com/reel/DDo5J8EzIK1/",
    date: "2024-12-18"
  },
  {
    id: 196,
    situation_kr: "사회초년생 꿀팁 표현!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DDjeQ4Ds8OZ/",
    date: "2024-12-16"
  },
  {
    id: 197,
    situation_kr: "�curveball은 일상에서 어떤 영어 표현으로 쓰일까?",
    expression_en: "curveball",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DDefSBGAs2U/",
    date: "2024-12-14"
  },
  {
    id: 198,
    situation_kr: "한국 마니또 vs 미국 마니또",
    expression_en: "",
    description_kr: "어떤 차이가 있을까요?",
    tags: ["뉘앙스"],
    reel_url: "https://www.instagram.com/reel/DDMRR-pzPiT/",
    date: "2024-12-12"
  },
  {
    id: 199,
    situation_kr: "코인하는 친구들에게 공유하기!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DDHXOUcuaSS/",
    date: "2024-12-05"
  },
  {
    id: 200,
    situation_kr: "이 표현만 들려도 상위 10%입니다",
    expression_en: "",
    description_kr: "들어보시죠~",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCy6cXOgx6A/",
    date: "2024-12-03"
  },
  {
    id: 201,
    situation_kr: "지각할 때 당당한 사람 특)",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCeVUobOZPx/",
    date: "2024-11-25"
  },
  {
    id: 202,
    situation_kr: "한국인의 최애 영어표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCYrTXgM1_c/",
    date: "2024-11-17"
  },
  {
    id: 203,
    situation_kr: "썸은 영어로 \"Some\"일까??",
    expression_en: "Some",
    description_kr: "",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DCTnwkZTYIs/",
    date: "2024-11-15"
  },
  {
    id: 204,
    situation_kr: "내 집 마련 필수 영어!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCOaNvGuHAY/",
    date: "2024-11-13"
  },
  {
    id: 205,
    situation_kr: "결정 장애 친구에게 공유할 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCJUj2lzuRT/",
    date: "2024-11-11"
  },
  {
    id: 206,
    situation_kr: "스킨십은 영어로 뭘까?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DCEKguCswXc/",
    date: "2024-11-09"
  },
  {
    id: 207,
    situation_kr: "영어로 인싸되는 비법 공유",
    expression_en: "",
    description_kr: "",
    tags: ["슬랭"],
    reel_url: "https://www.instagram.com/reel/DB_E3LdzWVn/",
    date: "2024-11-07"
  },
  {
    id: 208,
    situation_kr: "대부분 모르는 콩글리시 표현 두가지!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DB6QHtfJIja/",
    date: "2024-11-05"
  },
  {
    id: 209,
    situation_kr: "필수 비즈니스 영어표현 3가지",
    expression_en: "",
    description_kr: "",
    tags: ["비즈니스"],
    reel_url: "https://www.instagram.com/reel/DB0q123zfEe/",
    date: "2024-11-03"
  },
  {
    id: 210,
    situation_kr: "야식 중독인 친구들에게 공유",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBvklquTNHs/",
    date: "2024-11-01"
  },
  {
    id: 211,
    situation_kr: "뻘쭘할 때 영어로 스몰토크 하는법",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBqeb1pTdJo/",
    date: "2024-10-30"
  },
  {
    id: 212,
    situation_kr: "할로윈 코스프레  !!",
    expression_en: "",
    description_kr: "옥쌤과 함께 알아보세요~",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBlOAVOz3ii/",
    date: "2024-10-28"
  },
  {
    id: 213,
    situation_kr: "이븐하게 익은 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBgEcBeT3Lk/",
    date: "2024-10-26"
  },
  {
    id: 214,
    situation_kr: "한국시리즈 영어 필수 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBa60AizH5I/",
    date: "2024-10-24"
  },
  {
    id: 215,
    situation_kr: "남들 앞에서 영어 잘해보이는 꿀팁",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBV42nVu9Vo/",
    date: "2024-10-22"
  },
  {
    id: 216,
    situation_kr: "약속 많은 친구들에게 태그!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBQ2wygN3Cr/",
    date: "2024-10-20"
  },
  {
    id: 217,
    situation_kr: "노벨 문학상을 영어로 유식하게 말하는 법",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBLeEe6zgG8/",
    date: "2024-10-18"
  },
  {
    id: 218,
    situation_kr: "흑백요리사 “킥”의 여러가지 뜻, 알고 계셨나요?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBGaza0M7DZ/",
    date: "2024-10-16"
  },
  {
    id: 219,
    situation_kr: "T발놈들이 꼭 알아야할 영어 표현",
    expression_en: "",
    description_kr: "주위에 T발놈 친구가 있으면 공유해주세요!!",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DBCQCSxshXs/",
    date: "2024-10-14"
  },
  {
    id: 220,
    situation_kr: "조만간 밥 먹을 친구에게 공유하세요!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DA8DPrNuB6Z/",
    date: "2024-10-12"
  },
  {
    id: 221,
    situation_kr: "잘못 쓰면 싸움날 수 있는 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DA2u-OBO8y_/",
    date: "2024-10-10"
  },
  {
    id: 222,
    situation_kr: "대학원 졸업이 어려운 이유!",
    expression_en: "",
    description_kr: "즐겁게 영어하자, 영어는 옥쌤!",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DAx78b1OJlE/",
    date: "2024-10-08"
  },
  {
    id: 223,
    situation_kr: "한턱 쏠 친구에게 보낼 영어 표현!!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DAs2XLdNPSR/",
    date: "2024-10-06"
  },
  {
    id: 224,
    situation_kr: "옥쌤이 알려주는 헷갈리기 쉬운 고백 표현!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DAncBXtgXPb/",
    date: "2024-10-04"
  },
  {
    id: 225,
    situation_kr: "100% 통하는 부탁 영어 표현",
    expression_en: "help me",
    description_kr: "이제  대신 could you do me a favor? 써보세요!",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DAiRZsFT80U/",
    date: "2024-10-02"
  },
  {
    id: 226,
    situation_kr: "카페 갈 때 본인의 주문 방법은?",
    expression_en: "",
    description_kr: "",
    tags: ["카페", "주문"],
    reel_url: "https://www.instagram.com/reel/DAdfvCMNyiX/",
    date: "2024-09-30"
  },
  {
    id: 227,
    situation_kr: "ENFP 금사빠 필수 영어 표현 공유",
    expression_en: "ENFP",
    description_kr: "전국의 민지들에게 미리 죄송합니다..",
    tags: ["일상", "표현"],
    reel_url: "https://www.instagram.com/reel/DAX9nRxMVR4/",
    date: "2024-09-28"
  },
  {
    id: 228,
    situation_kr: "연인한테만 쓸 수 있는 영어표현이 있다?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DAS18AeN8th/",
    date: "2024-09-26"
  },
  {
    id: 229,
    situation_kr: "대부분 헷갈리는 Come vs Go",
    expression_en: "대부분 헷갈리는 Come vs Go",
    description_kr: "come here와 go away로 구별하면 쉽습니다!",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/DANq86fTX_9/",
    date: "2024-09-24"
  },
  {
    id: 230,
    situation_kr: "대2병을 영어로 하면?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DAIklO1NWvS/",
    date: "2024-09-22"
  },
  {
    id: 231,
    situation_kr: "대문자 I 내향인 맞춤 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/DADXyTDTtRg/",
    date: "2024-09-20"
  },
  {
    id: 232,
    situation_kr: "품격있게 영어하는 법",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_-Q9QKOqwk/",
    date: "2024-09-18"
  },
  {
    id: 233,
    situation_kr: "미국에도 추석이 있을까?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_5EoXeTJfq/",
    date: "2024-09-16"
  },
  {
    id: 234,
    situation_kr: "호텔에서 유용한 필수 영어!",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_z_u4aN5PG/",
    date: "2024-09-14"
  },
  {
    id: 235,
    situation_kr: "한국을 좋아하는 서울대 유학생",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_uw2LbNw3b/",
    date: "2024-09-12"
  },
  {
    id: 236,
    situation_kr: "스벅 주문 미친 꿀팁!",
    expression_en: "",
    description_kr: "얼음 조절이 필요할 때~ 옥쌤!",
    tags: ["주문"],
    reel_url: "https://www.instagram.com/reel/C_p5dcbRgq2/",
    date: "2024-09-10"
  },
  {
    id: 237,
    situation_kr: "Q) 소개팅에서 가장 중요한 것은?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_e1IOxt1yR/",
    date: "2024-09-08"
  },
  {
    id: 238,
    situation_kr: "영어 잘해보이는 미친 꿀팁",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_aiUfOu-SN/",
    date: "2024-09-06"
  },
  {
    id: 239,
    situation_kr: "외국에서 인싸되는 필!수!영어",
    expression_en: "",
    description_kr: "",
    tags: ["슬랭"],
    reel_url: "https://www.instagram.com/reel/C_Vkp5iNrVB/",
    date: "2024-09-04"
  },
  {
    id: 240,
    situation_kr: "나는 부산여행을 가본적 있다?",
    expression_en: "",
    description_kr: "",
    tags: ["여행"],
    reel_url: "https://www.instagram.com/reel/C_QRlotMlvd/",
    date: "2024-09-02"
  },
  {
    id: 241,
    situation_kr: "관광 명소 필수 영어\ude0d",
    expression_en: "",
    description_kr: "",
    tags: ["여행"],
    reel_url: "https://www.instagram.com/reel/C_LQauPMNwS/",
    date: "2024-08-31"
  },
  {
    id: 242,
    situation_kr: "여행 필수 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["여행"],
    reel_url: "https://www.instagram.com/reel/C_FXeiIxljy/",
    date: "2024-08-29"
  },
  {
    id: 243,
    situation_kr: "입국심사 필수 영어 표현",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C_BKzp8syeI/",
    date: "2024-08-27"
  },
  {
    id: 244,
    situation_kr: "롤 필수 영어 표현 (T1 vs KT)",
    expression_en: "vs KT",
    description_kr: "롤 필수 영어 표현 (T1 )",
    tags: ["뉘앙스", "표현"],
    reel_url: "https://www.instagram.com/reel/C-3_aBSscGZ/",
    date: "2024-08-25"
  },
  {
    id: 245,
    situation_kr: "외국인에게 한국남자 이미지를 물어보면?☺",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C-1yna3xSoP/",
    date: "2024-08-23"
  },
  {
    id: 246,
    situation_kr: "[투표] 꼭 하나만을 선택한다면",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C-x1R7UNu-n/",
    date: "2024-08-20"
  },
  {
    id: 247,
    situation_kr: "밸런스게임 필수 영어표현(모르면 손해)",
    expression_en: "",
    description_kr: "",
    tags: ["문화"],
    reel_url: "https://www.instagram.com/reel/C-rzwzeRjul/",
    date: "2024-08-19"
  },
  {
    id: 248,
    situation_kr: "(투표) 만약 연애한다면 누구와??",
    expression_en: "",
    description_kr: "",
    tags: ["연애"],
    reel_url: "https://www.instagram.com/reel/C-mkcAmRMIz/",
    date: "2024-08-17"
  },
  {
    id: 249,
    situation_kr: "더 선호하는 몸부위는?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C-hjbXROOuZ/",
    date: "2024-08-15"
  },
  {
    id: 250,
    situation_kr: "둘 중 하나를 꼭 선택한다면???",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C9eEU3suzzl/",
    date: "2024-08-13"
  },
  {
    id: 251,
    situation_kr: "한국 양궁 영어로 숭배하기",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/C9KjGGhuDPg/",
    date: "2024-08-11"
  },
  {
    id: 252,
    situation_kr: "영어강사가 인터뷰하다 감동한 이유는 무엇일까요?",
    expression_en: "english",
    description_kr: "",
    tags: ["면접", "표현"],
    reel_url: "https://www.instagram.com/reel/C8_qm4XOW-M/",
    date: "2024-07-16"
  },
  {
    id: 253,
    situation_kr: "홍대에서 만난 영어 교사 인터뷰입니다!",
    expression_en: "english",
    description_kr: "",
    tags: ["면접", "표현"],
    reel_url: "https://www.instagram.com/reel/C81O1paOpM2/",
    date: "2024-07-08"
  },
  {
    id: 254,
    situation_kr: "외국인 교사가 말하는 장기연애 잘하는 사람 특징!",
    expression_en: "",
    description_kr: "",
    tags: ["연애"],
    reel_url: "https://www.instagram.com/reel/C70TnK7tqBW/",
    date: "2024-07-04"
  },
  {
    id: 255,
    situation_kr: "한강에서 진행한 밸런스게임 영상!",
    expression_en: "",
    description_kr: "",
    tags: ["문화"],
    reel_url: "https://www.instagram.com/reel/C7xx9fbML6x/",
    date: "2024-06-30"
  },
  {
    id: 256,
    situation_kr: "네덜란드 사람은 영어를 잘한다?",
    expression_en: "",
    description_kr: "",
    tags: ["일상"],
    reel_url: "https://www.instagram.com/reel/UNKNOWN_17970432875726610/",
    date: "2024-06-05"
  },
  {
    id: 257,
    situation_kr: "리투아니아 모델과의 영어 인터뷰",
    expression_en: "",
    description_kr: "",
    tags: ["면접"],
    reel_url: "https://www.instagram.com/reel/UNKNOWN_18033590833839555/",
    date: "2024-06-04"
  }
];
