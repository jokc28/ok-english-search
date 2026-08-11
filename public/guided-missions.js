(function (root, factory) {
  const missions = factory();
  if (typeof module === 'object' && module.exports) module.exports = missions;
  if (root) root.GUIDED_MISSIONS = missions;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  return [
    {
      id: 'walk-ins-01',
      title: '예약 없이 지금 가능한지 묻기',
      desired_result: '예약하지 않고 온 가게에서, 지금 바로 서비스를 받을 수 있는지 정확하게 묻는다.',
      scene: '처음 가는 미용실 앞입니다. 예약은 없지만 빈자리가 있으면 지금 커트를 받고 싶습니다.',
      first_attempt_prompt: '직원이 나왔습니다. 우선 아는 영어로 한 문장을 만들어 보세요.',
      intent_distinction: {
        question: '이 장면에서 꼭 확인해야 하는 것은 무엇인가요?',
        options: [
          {
            id: 'entry-permission',
            label: '가게 안에 들어가도 되는지',
            correct: false,
            feedback: '입장 허가만 묻으면 예약 여부와 지금 받을 수 있는지는 남습니다.'
          },
          {
            id: 'current-capacity',
            label: '예약 없는 손님을 지금 받을 수 있는지',
            correct: true,
            feedback: '맞습니다. 손님 유형과 현재 수용 가능 여부를 함께 물어야 합니다.'
          },
          {
            id: 'opening-hours',
            label: '오늘 몇 시까지 영업하는지',
            correct: false,
            feedback: '영업 중이어도 예약 없는 손님을 지금 받지 않을 수 있습니다.'
          }
        ]
      },
      common_attempt: 'Can I enter?',
      obstacle: '`Can I enter?`는 들어가도 되는지만 묻습니다. 필요한 정보인 예약 없는 손님 유형과 지금의 빈자리가 빠집니다.',
      meaning_bridge_steps: [
        {
          id: 'walk-in-action',
          prompt: '`walk in`이 이 장면에서 보여주는 움직임은?',
          options: [
            { id: 'arrive-without', label: '미리 정하지 않고 바로 찾아옴', correct: true },
            { id: 'walk-inside', label: '건물 안을 걸어 다님', correct: false },
            { id: 'leave-quickly', label: '볼일만 보고 바로 나감', correct: false }
          ],
          explanation: '`walk in`은 이 서비스 맥락에서 사전 예약 없이 찾아오는 모습을 나타냅니다.'
        },
        {
          id: 'walk-in-category',
          prompt: '사람을 뜻하는 `a walk-in`은 누구인가요?',
          options: [
            { id: 'unbooked-customer', label: '예약 없이 온 손님', correct: true },
            { id: 'employee', label: '걸어서 출근한 직원', correct: false },
            { id: 'regular', label: '늘 오는 단골손님', correct: false }
          ],
          explanation: '행동을 나타내던 말이 명사로 쓰이면, 예약 없이 온 손님이라는 고객 유형을 가리킵니다.'
        },
        {
          id: 'take-capacity',
          prompt: '가게가 손님을 `take`한다는 것은?',
          options: [
            { id: 'accept-serve', label: '그 손님을 받아 서비스를 제공함', correct: true },
            { id: 'escort', label: '손님을 다른 곳으로 데려감', correct: false },
            { id: 'photograph', label: '손님의 사진을 찍음', correct: false }
          ],
          explanation: '서비스 가게의 `take + 고객 유형`은 그 유형의 손님을 받아 응대한다는 관용적인 결합입니다.'
        }
      ],
      target_expression: 'Are you taking walk-ins right now?',
      assembly_slots: [
        {
          label: '현재 받을 수 있나요?',
          options: ['Are you taking', 'Can I enter', 'Are you opening'],
          correct: 'Are you taking'
        },
        {
          label: '예약 없는 손님을',
          options: ['reservations', 'walk-ins', 'new people'],
          correct: 'walk-ins'
        },
        {
          label: '바로 지금',
          options: ['every day?', 'right now?', 'last week?'],
          correct: 'right now?'
        }
      ],
      spoken_prompt: '직원을 보고 묻는다고 생각하고 완성한 문장을 소리 내어 말해 보세요.',
      transfer_scenarios: [
        {
          scene: '이번에는 토요일에 동네 의원을 예약 없이 방문할 수 있는지 전화로 묻습니다.',
          prompt: '`지금 받고 있나요?`가 아니라 `토요일마다 받나요?`라는 운영 방침을 물어보세요.',
          expected: 'Do you take walk-ins on Saturdays?'
        }
      ],
      usage_boundary: '`Are you taking walk-ins right now?`는 현재 수용 가능 여부를 묻고, `Do you take walk-ins?`는 평소 운영 방침을 묻습니다.',
      retry_stage: {
        intent: '무엇을 확인해야 하는지 구분하기',
        meaning: 'walk-in과 take의 역할 연결하기',
        assembly: '의미 단위를 올바른 순서로 조립하기',
        spoken: '완성 문장을 소리 내어 꺼내기',
        transfer: '시간 조건이 바뀐 상황에 다시 적용하기'
      },
      sources: [
        {
          label: 'Cambridge Dictionary: walk-in',
          url: 'https://dictionary.cambridge.org/us/dictionary/english/walk-in'
        }
      ]
    },
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
  ];
});
