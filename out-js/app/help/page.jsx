'use client';
import React, { useState } from 'react';
import Link from 'next/link';
export default function HelpPage() {
    var _a, _b;
    var _c = useState('getting-started'), activeCategory = _c[0], setActiveCategory = _c[1];
    var categories = [
        { id: 'getting-started', name: '시작하기' },
        { id: 'account', name: '계정 관리' },
        { id: 'telegram', name: '텔레그램 설정' },
        { id: 'keywords', name: '키워드 분석' },
        { id: 'faq', name: '자주 묻는 질문' },
    ];
    var articles = {
        'getting-started': [
            { id: 'welcome', title: 'KeywordPulse 시작하기', path: '/help/getting-started/welcome' },
            { id: 'dashboard', title: '대시보드 사용법', path: '/help/getting-started/dashboard' },
            { id: 'setup', title: '초기 설정 가이드', path: '/help/getting-started/setup' },
        ],
        'account': [
            { id: 'create-account', title: '계정 생성', path: '/help/account/create-account' },
            { id: 'profile', title: '프로필 관리', path: '/help/account/profile' },
            { id: 'subscription', title: '구독 관리', path: '/help/account/subscription' },
        ],
        'telegram': [
            { id: 'setup', title: '텔레그램 봇 설정 방법', path: '/help/telegram/setup' },
            { id: 'test', title: '알림 테스트 하기', path: '/help/telegram/test' },
            { id: 'troubleshooting', title: '문제 해결 가이드', path: '/help/telegram/troubleshooting' },
        ],
        'keywords': [
            { id: 'search', title: '키워드 검색하기', path: '/help/keywords/search' },
            { id: 'analyze', title: '분석 결과 이해하기', path: '/help/keywords/analyze' },
            { id: 'save', title: '키워드 세트 저장하기', path: '/help/keywords/save' },
        ],
        'faq': [
            { id: 'billing', title: '결제 관련 FAQ', path: '/help/faq/billing' },
            { id: 'technical', title: '기술 지원 FAQ', path: '/help/faq/technical' },
            { id: 'features', title: '기능 관련 FAQ', path: '/help/faq/features' },
        ],
    };
    // 텔레그램 설정 카드 컨텐츠 미리 정의
    var telegramSetupContent = (<div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-8">
      <h3 className="text-xl font-bold text-blue-800 mb-3">텔레그램 설정 가이드</h3>
      <p className="text-blue-700 mb-4">
        KeywordPulse는 텔레그램을 통해 키워드 분석 결과와 알림을 받을 수 있습니다. 아래 단계를 따라 설정해보세요.
      </p>
      
      <div className="bg-white rounded-md p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">1단계: 텔레그램 봇 생성하기</h4>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>텔레그램에서 <a href="https://t.me/BotFather" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">@BotFather</a>를 검색하고 채팅을 시작하세요.</li>
          <li><code className="bg-gray-100 px-2 py-1 rounded">/newbot</code> 명령어를 입력하세요.</li>
          <li>봇 이름(예: MyKeywordBot)을 입력하세요.</li>
          <li>봇 사용자 이름(예: my_keyword_bot)을 입력하세요. 이름은 반드시 '_bot'으로 끝나야 합니다.</li>
          <li>봇 생성이 완료되면 봇 토큰을 받게 됩니다. 이 토큰을 안전하게 보관하세요.</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-md p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">2단계: 채팅 ID 확인하기</h4>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>텔레그램에서 <a href="https://t.me/userinfobot" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">@userinfobot</a>를 검색하고 채팅을 시작하세요.</li>
          <li>아무 메시지나 보내면 봇이 사용자 정보와 함께 ID를 알려줍니다.</li>
          <li>이 ID를 기록해두세요.</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-md p-4">
        <h4 className="font-semibold text-gray-800 mb-2">3단계: KeywordPulse에 설정하기</h4>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li><Link href="/profile" className="text-primary-600 hover:underline">프로필 페이지</Link>로 이동하세요.</li>
          <li>"텔레그램 알림 설정" 섹션을 찾으세요.</li>
          <li>봇 토큰과 채팅 ID를 입력하세요.</li>
          <li>"설정 저장" 버튼을 클릭하세요.</li>
          <li>"테스트 메시지 보내기" 버튼을 클릭하여 설정이 제대로 되었는지 확인하세요.</li>
        </ol>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/help/telegram/setup" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          상세 설정 가이드 보기
        </Link>
      </div>
    </div>);
    return (<div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">도움말 센터</h1>
      <p className="text-lg text-gray-600 mb-8">
        KeywordPulse 사용 중 궁금한 점이 있으신가요? 원하는 주제를 선택하여 도움말을 확인하세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 사이드바 (카테고리) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">카테고리</h2>
            <nav>
              <ul className="space-y-1">
                {categories.map(function (category) { return (<li key={category.id}>
                    <button onClick={function () { return setActiveCategory(category.id); }} className={"w-full text-left px-3 py-2 rounded-md transition-colors ".concat(activeCategory === category.id
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50')}>
                      {category.name}
                    </button>
                  </li>); })}
              </ul>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">추가 지원</h2>
            <div className="space-y-3">
              <Link href="/contact" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                문의하기
              </Link>
              <Link href="/docs" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                문서 센터
              </Link>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {(_a = categories.find(function (c) { return c.id === activeCategory; })) === null || _a === void 0 ? void 0 : _a.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(_b = articles[activeCategory]) === null || _b === void 0 ? void 0 : _b.map(function (article) { return (<Link key={article.id} href={article.path}>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                    <h3 className="font-medium text-primary-700 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600">자세히 알아보기</p>
                  </div>
                </Link>); })}
            </div>

            {/* 텔레그램 설정일 경우 상세 가이드 표시 */}
            {activeCategory === 'telegram' && telegramSetupContent}
          </div>
        </div>
      </div>
    </div>);
}
