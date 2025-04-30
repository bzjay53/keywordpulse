import React from 'react';
import Link from 'next/link';
// 프리미엄 플랜 정보
var premiumPlans = [
    {
        name: '기본',
        price: '무료',
        features: [
            '1일 1회 키워드 검색',
            '기본 분석 보고서',
            '광고 시청 시 추가 검색 1회',
        ],
        limitations: [
            '텔레그램/시트 저장 불가',
            '광고 표시됨',
        ],
        cta: '시작하기',
        href: '/login',
        highlight: false
    },
    {
        name: '프로',
        price: '월 9,900원',
        features: [
            '1일 10회 키워드 검색',
            '심층 분석 보고서',
            '텔레그램 알림 기능',
            '구글 시트 저장 기능',
            '광고 없음',
            '우선 지원',
        ],
        limitations: [],
        cta: '시작하기',
        href: '/login?plan=pro',
        highlight: true
    },
    {
        name: '비즈니스',
        price: '월 29,900원',
        features: [
            '무제한 키워드 검색',
            'AI 고급 분석 보고서',
            '트렌드 예측 보고서',
            '팀 멤버 추가 (5명)',
            '전용 API 액세스',
            '최우선 지원',
        ],
        limitations: [],
        cta: '문의하기',
        href: '/contact',
        highlight: false
    }
];
// 프리미엄 기능 컴포넌트
var PremiumFeatures = function () {
    return (<section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">프리미엄 기능 이용하기</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          KeywordPulse 프리미엄 요금제로 업그레이드하고 더 강력한 키워드 분석 도구를 활용하세요.
          광고 없이 더 많은 키워드를 검색하고, 전문적인 분석 보고서를 받아보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {premiumPlans.map(function (plan) { return (<div key={plan.name} className={"border rounded-lg overflow-hidden ".concat(plan.highlight
                ? 'border-primary-500 shadow-lg shadow-primary-100'
                : 'border-gray-200')}>
            <div className={"p-6 ".concat(plan.highlight ? 'bg-primary-50' : 'bg-white')}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              
              <div className="space-y-3 mb-6">
                {plan.features.map(function (feature) { return (<div key={feature} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </div>); })}
                
                {plan.limitations.map(function (limitation) { return (<div key={limitation} className="flex items-start text-gray-500">
                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>{limitation}</span>
                  </div>); })}
              </div>
              
              <Link href={plan.href} className={"block text-center py-2 px-4 rounded-md w-full ".concat(plan.highlight
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}>
                {plan.cta}
              </Link>
            </div>
          </div>); })}
      </div>
    </section>);
};
export default PremiumFeatures;
