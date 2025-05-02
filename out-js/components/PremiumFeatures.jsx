import React from 'react';
import Link from 'next/link';
/**
 * 프리미엄 기능을 표시하는 컴포넌트
 */
var PremiumFeatures = function (_a) {
    var _b = _a.title, title = _b === void 0 ? '프리미엄 기능 소개' : _b, _c = _a.description, description = _c === void 0 ? '더 강력한 분석과 인사이트를 제공하는 프리미엄 기능을 확인하세요.' : _c, _d = _a.features, features = _d === void 0 ? defaultFeatures : _d, _e = _a.ctaText, ctaText = _e === void 0 ? '프리미엄 시작하기' : _e, _f = _a.ctaLink, ctaLink = _f === void 0 ? '/pricing' : _f;
    return (<section className="my-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8 shadow-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-gray-600">{description}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(function (feature, idx) { return (<div key={idx} className="flex flex-col rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            {feature.icon && <div className="mb-4 text-blue-500">{feature.icon}</div>}
            <h3 className="mb-2 text-lg font-medium text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>); })}
      </div>

      <div className="mt-8 text-center">
        <Link href={ctaLink} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
          {ctaText}
        </Link>
      </div>
    </section>);
};
// 기본 프리미엄 기능 목록
var defaultFeatures = [
    {
        title: '무제한 키워드 분석',
        description: '모든 키워드에 대한 심층 분석과 인사이트를 이용할 수 있습니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>)
    },
    {
        title: '실시간 알림',
        description: '키워드 동향 변화 시 텔레그램으로 실시간 알림을 받아볼 수 있습니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>)
    },
    {
        title: '내보내기 옵션',
        description: '모든 분석 결과를 PDF, CSV, Excel 등 다양한 형식으로 내보낼 수 있습니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
      </svg>)
    },
    {
        title: '경쟁사 분석',
        description: '경쟁업체 키워드 전략을 분석하고 비교할 수 있습니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
      </svg>)
    },
    {
        title: '고급 RAG 분석',
        description: '인공지능 기반의 심층 키워드 분석 및 콘텐츠 제안을 제공합니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>)
    },
    {
        title: '우선 지원',
        description: '프리미엄 사용자를 위한 우선적인 고객 지원 서비스를 제공합니다.',
        icon: (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>)
    }
];
export default PremiumFeatures;
