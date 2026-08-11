(function (root, factory) {
  const missions = factory();
  if (typeof module === 'object' && module.exports) module.exports = missions;
  if (root) root.GUIDED_MISSIONS = missions;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  return [
    {
      id: 'subway-order-builder-01',
      headline: '써브웨이에서 내 취향대로 주문 만들기',
      reel_url: 'https://www.instagram.com/reel/Da7hx5AxWQW/',
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
