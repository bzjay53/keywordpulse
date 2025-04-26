'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const topics = [
    { id: 'getting-started', title: '시작하기' },
    { id: 'search', title: '키워드 검색' },
    { id: 'trends', title: '트렌드 분석' },
    { id: 'related', title: '관련 키워드' },
    { id: 'telegram', title: '텔레그램 알림' },
    { id: 'faq', title: '자주 묻는 질문' },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 사이드바 */}
          <div className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-6">
              <div className="space-y-1">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveSection(topic.id)}
                    className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
                      activeSection === topic.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* 모바일 탭 */}
          <div className="lg:hidden mb-8">
            <div className="flex overflow-x-auto pb-2 space-x-3">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveSection(topic.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
                    activeSection === topic.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-9">
            {activeSection === 'getting-started' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">시작하기</h1>
                <p className="text-lg text-gray-700 mb-6">
                  KeywordPulse에 오신 것을 환영합니다! 이 가이드를 통해 서비스를 시작하는 방법을 알아보세요.
                </p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">계정 만들기</h2>
                  <p className="text-gray-700 mb-4">
                    KeywordPulse를 사용하려면 먼저 계정을 만들어야 합니다. 다음 단계를 따르세요:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>홈페이지 상단의 <b>"로그인"</b> 버튼을 클릭합니다.</li>
                    <li><b>"회원가입"</b> 탭을 선택합니다.</li>
                    <li>이메일 주소와 비밀번호를 입력하여 계정을 생성합니다.</li>
                    <li>이메일 주소 확인을 위해 받은편지함을 확인하고 인증 링크를 클릭합니다.</li>
                    <li>인증 완료 후 로그인하여 서비스를 이용할 수 있습니다.</li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">첫 번째 키워드 검색</h2>
                  <p className="text-gray-700 mb-4">
                    가입 후 바로 키워드 검색을 시작할 수 있습니다:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>홈페이지의 검색창에 분석하고 싶은 키워드를 입력합니다.</li>
                    <li><b>"검색"</b> 버튼을 클릭하여 분석을 시작합니다.</li>
                    <li>키워드에 대한 트렌드 및 관련 키워드 정보가 표시됩니다.</li>
                    <li>결과를 확인하고 인사이트를 얻으세요!</li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">무료 계정 제한사항</h2>
                  <p className="text-gray-700 mb-4">
                    무료 계정은 다음과 같은 제한사항이 있습니다:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>하루 3회 키워드 검색 제한</li>
                    <li>기본 데이터만 제공</li>
                    <li>키워드 세트 저장 불가</li>
                    <li>자동 알림 기능 미제공</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    더 많은 기능을 사용하려면 프로 또는 비즈니스 플랜으로 업그레이드하세요.{' '}
                    <Link href="/pricing" className="text-primary-600 hover:underline">
                      가격 정책 확인하기
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'search' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">키워드 검색</h1>
                <p className="text-lg text-gray-700 mb-6">
                  KeywordPulse를 사용하여 키워드를 검색하고 분석하는 방법을 알아보세요.
                </p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">효과적인 키워드 검색 방법</h2>
                  <p className="text-gray-700 mb-4">
                    효과적인 키워드 검색을 위한 팁:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>명확하고 구체적인 키워드를 입력하세요.</li>
                    <li>단일 단어보다는 구문을 사용하는 것이 더 정확한 결과를 얻을 수 있습니다.</li>
                    <li>관련 키워드를 활용하여 검색 범위를 넓히세요.</li>
                    <li>여러 키워드를 비교하여 최적의 키워드를 찾으세요.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">검색 결과 해석하기</h2>
                  <p className="text-gray-700 mb-4">
                    검색 결과는 다음과 같은 정보를 제공합니다:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><b>검색 볼륨</b>: 키워드가 얼마나 자주 검색되는지 보여줍니다.</li>
                    <li><b>트렌드</b>: 시간에 따른 키워드 인기도의 변화를 보여줍니다.</li>
                    <li><b>관련 키워드</b>: 검색한 키워드와 관련된 다른 키워드를 제안합니다.</li>
                    <li><b>경쟁 수준</b>: 키워드의 경쟁 정도를 표시합니다.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">검색 기록 확인</h2>
                  <p className="text-gray-700 mb-4">
                    이전에 검색한 키워드 기록을 확인하는 방법:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>프로필 페이지로 이동합니다.</li>
                    <li>"검색 기록" 탭을 선택합니다.</li>
                    <li>이전에 검색한 키워드 목록을 확인합니다.</li>
                    <li>키워드를 클릭하여 이전 분석 결과를 다시 볼 수 있습니다.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'trends' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">트렌드 분석</h1>
                <p className="text-lg text-gray-700 mb-6">
                  시간에 따른의 키워드 트렌드를 분석하여 인사이트를 얻는 방법을 알아보세요.
                </p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">트렌드 차트 이해하기</h2>
                  <p className="text-gray-700 mb-4">
                    트렌드 차트는 시간에 따른 키워드의 인기도 변화를 보여줍니다:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><b>상승 트렌드</b>: 키워드의 인기가 증가하고 있음을 나타냅니다.</li>
                    <li><b>하락 트렌드</b>: 키워드의 인기가 감소하고 있음을 나타냅니다.</li>
                    <li><b>계절적 트렌드</b>: 특정 시기에 반복적으로 인기가 있는 키워드입니다.</li>
                    <li><b>안정적 트렌드</b>: 시간에 따라 일정한 인기를 유지하는 키워드입니다.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">트렌드 분석 활용 방법</h2>
                  <p className="text-gray-700 mb-4">
                    트렌드 분석을 활용하는 방법:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>상승 추세의 키워드를 찾아 신규 콘텐츠 주제로 활용하세요.</li>
                    <li>계절적 트렌드를 파악하여 시기별 마케팅 전략을 수립하세요.</li>
                    <li>키워드의 과거 트렌드를 분석하여 미래 트렌드를 예측하세요.</li>
                    <li>경쟁사 키워드의 트렌드를 모니터링하여 경쟁 전략을 수립하세요.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">카테고리별 트렌드</h2>
                  <p className="text-gray-700 mb-4">
                    다양한 카테고리의 트렌드를 분석할 수 있습니다:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><b>비즈니스</b>: 비즈니스 관련 키워드의 트렌드를 확인합니다.</li>
                    <li><b>기술</b>: 최신 기술 트렌드를 파악합니다.</li>
                    <li><b>엔터테인먼트</b>: 대중 문화와 엔터테인먼트 트렌드를 분석합니다.</li>
                    <li><b>건강</b>: 건강 관련 주제의 트렌드를 확인합니다.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'related' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">관련 키워드</h1>
                <p className="text-lg text-gray-700 mb-6">
                  주요 키워드와 관련된 키워드를 분석하여 콘텐츠 전략을 수립하는 방법을 알아보세요.
                </p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">관련 키워드의 중요성</h2>
                  <p className="text-gray-700 mb-4">
                    관련 키워드를 활용해야 하는 이유:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>검색 엔진 최적화(SEO)에 도움이 됩니다.</li>
                    <li>콘텐츠의 주제를 확장할 수 있습니다.</li>
                    <li>타겟 오디언스의 관심사를 더 잘 이해할 수 있습니다.</li>
                    <li>더 많은 검색 트래픽을 유도할 수 있습니다.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">관련 키워드 활용 방법</h2>
                  <p className="text-gray-700 mb-4">
                    관련 키워드를 효과적으로 활용하는 방법:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>콘텐츠에 자연스럽게 관련 키워드를 포함시키세요.</li>
                    <li>관련 키워드를 기반으로 새로운 콘텐츠 주제를 발굴하세요.</li>
                    <li>소셜 미디어 캠페인의 해시태그로 활용하세요.</li>
                    <li>광고 키워드 그룹을 확장하는 데 활용하세요.</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">관련 키워드 분석</h2>
                  <p className="text-gray-700 mb-4">
                    KeywordPulse에서 관련 키워드를 분석하는 방법:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>주요 키워드를 검색합니다.</li>
                    <li>"관련 키워드" 섹션을 확인합니다.</li>
                    <li>각 관련 키워드의 검색 볼륨과 경쟁 수준을 분석합니다.</li>
                    <li>원하는 관련 키워드를 선택하여 더 자세한 분석을 진행할 수 있습니다.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'telegram' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">텔레그램 알림</h1>
                <p className="text-lg text-gray-700 mb-6">
                  텔레그램으로 키워드 분석 결과 알림을 받는 방법을 알아보세요.
                </p>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">텔레그램 봇 토큰 획득하기</h2>
                  <p className="text-gray-700 mb-4">
                    텔레그램 봇을 만들고 토큰을 획득하는 방법:
                  </p>
                  <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                    <li>텔레그램 앱에서 <b>@BotFather</b>를 검색하고 채팅을 시작합니다.</li>
                    <li><b>/newbot</b> 명령어를 입력하여 새 봇 생성을 시작합니다.</li>
                    <li>봇의 이름을 입력합니다 (예: "KeywordPulse Notification Bot").</li>
                    <li>봇의 사용자 이름을 입력합니다. 이름은 반드시 'bot'으로 끝나야 합니다 (예: "keywordpulse_bot").</li>
                    <li>생성이 완료되면 BotFather가 봇 토큰을 제공합니다. 이 토큰은 "123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" 형식입니다.</li>
                    <li>이 토큰을 안전하게 보관하고 KeywordPulse 프로필 페이지에 입력합니다.</li>
                  </ol>
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-bold">중요:</span> 봇 토큰은 개인 인증 정보와 같으므로 공개적으로 공유하지 마세요.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">텔레그램 채팅 ID 획득하기</h2>
                  <p className="text-gray-700 mb-4">
                    텔레그램 채팅 ID를 획득하는 방법에는 두 가지가 있습니다:
                  </p>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">방법 1: userinfobot 사용</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    <li>텔레그램에서 <b>@userinfobot</b>을 검색하고 채팅을 시작합니다.</li>
                    <li>아무 메시지나 보내면 봇이 사용자 정보와 함께 채팅 ID를 알려줍니다.</li>
                  </ol>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">방법 2: Telegram API 사용</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>웹 브라우저에서 다음 URL을 방문합니다: <code className="px-2 py-1 bg-gray-100 rounded">https://api.telegram.org/bot[봇Token값]/getUpdates</code></li>
                    <li>URL에서 <code className="px-2 py-1 bg-gray-100 rounded">[봇Token값]</code> 부분을 앞서 획득한 봇 토큰으로 바꿉니다.</li>
                    <li>텔레그램 앱에서 자신이 만든 봇을 찾아 채팅을 시작하고 <b>/start</b> 명령어를 입력합니다.</li>
                    <li>웹 브라우저에서 방문한 URL 페이지를 새로고침합니다.</li>
                    <li>JSON 형식의 응답에서 <code className="px-2 py-1 bg-gray-100 rounded">"chat":{"id":여기에숫자}</code> 부분을 찾습니다. 이 숫자가 바로 채팅 ID입니다.</li>
                  </ol>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-bold">팁:</span> 그룹 채팅에 봇을 추가하는 경우, 그룹 채팅 ID는 대개 음수 값을 갖습니다. 이 경우 마이너스 기호를 포함한 전체 값을 사용해야 합니다.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">KeywordPulse에 텔레그램 설정</h2>
                  <p className="text-gray-700 mb-4">
                    획득한 봇 토큰과 채팅 ID를 KeywordPulse에 설정하는 방법:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>KeywordPulse 웹사이트에 로그인합니다.</li>
                    <li>우측 상단의 프로필 아이콘을 클릭하고 "프로필" 메뉴로 이동합니다.</li>
                    <li>"텔레그램 알림 설정" 섹션으로 스크롤합니다.</li>
                    <li>텔레그램 봇 토큰과 채팅 ID를 각각의 입력 필드에 붙여넣습니다.</li>
                    <li>"설정 저장" 버튼을 클릭합니다.</li>
                    <li>"테스트 메시지 보내기" 버튼을 클릭하여 설정이 올바른지 확인합니다.</li>
                    <li>텔레그램 앱에서 테스트 메시지를 수신했는지 확인합니다.</li>
                  </ol>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">알림 유형</h2>
                  <p className="text-gray-700 mb-4">
                    텔레그램으로 받을 수 있는 알림 유형:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><b>키워드 분석 결과</b>: 키워드 검색 후 분석 결과를 텔레그램으로 받습니다.</li>
                    <li><b>트렌드 알림</b>: 모니터링 중인 키워드의 트렌드 변화를 알려줍니다.</li>
                    <li><b>주간 리포트</b>: 주요 키워드의 주간 성과 리포트를 받습니다.</li>
                    <li><b>맞춤 알림</b>: 특정 조건에 맞는 키워드 알림을 설정할 수 있습니다.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">봇의 개인정보 설정</h3>
                  <p className="text-gray-700 mb-2">
                    보안 강화를 위해 봇의 개인정보 설정을 확인해보세요:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>BotFather에게 <code className="px-2 py-1 bg-gray-100 rounded">/mybots</code> 명령어를 보냅니다.</li>
                    <li>설정하려는 봇을 선택합니다.</li>
                    <li>"Bot Settings" → "Privacy" 메뉴로 이동합니다.</li>
                    <li>"Enable" 옵션을 선택하여 그룹 채팅에서 봇이 모든 메시지를 읽지 못하도록 설정할 수 있습니다.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">자주 묻는 질문</h1>
                <p className="text-lg text-gray-700 mb-6">
                  KeywordPulse 사용 중 자주 묻는 질문과 답변을 확인하세요.
                </p>

                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">KeywordPulse는 어떤 데이터 소스를 사용하나요?</h2>
                    <p className="text-gray-700">
                      KeywordPulse는 다양한 검색 엔진과 소셜 미디어 플랫폼의 데이터를 종합적으로 분석합니다. 검색 엔진 API, 웹 크롤링, 소셜 미디어 API 등 다양한 소스에서 데이터를 수집하여 정확한 키워드 트렌드와 분석 정보를 제공합니다.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">무료 계정으로 얼마나 많은 키워드를 분석할 수 있나요?</h2>
                    <p className="text-gray-700">
                      무료 계정은 하루 3회의 키워드 검색이 가능합니다. 각 검색마다 관련 키워드와 트렌드 정보를 확인할 수 있습니다. 더 많은 검색이 필요하신 경우 프로 또는 비즈니스 플랜으로 업그레이드하세요.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터는 얼마나 자주 업데이트되나요?</h2>
                    <p className="text-gray-700">
                      기본적으로 데이터는 매일 업데이트됩니다. 프로 및 비즈니스 플랜에서는 더 빈번한 업데이트가 제공되며, 특정 키워드에 대해 실시간 모니터링을 설정할 수도 있습니다.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">결제는 어떻게 하나요?</h2>
                    <p className="text-gray-700">
                      결제는 신용카드, 체크카드, 계좌이체 등 다양한 방법으로 할 수 있습니다. 구독은 월간 또는 연간 단위로 결제할 수 있으며, 연간 결제 시 할인 혜택이 제공됩니다. 자세한 내용은 가격 정책 페이지를 참조하세요.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">언제든지 구독을 취소할 수 있나요?</h2>
                    <p className="text-gray-700">
                      네, 언제든지 구독을 취소할 수 있습니다. 취소 후에는 다음 결제일까지 서비스를 계속 이용할 수 있으며, 자동으로 갱신되지 않습니다. 구독 취소는 프로필 설정에서 가능합니다.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">기술적인 도움이 필요하면 어떻게 해야 하나요?</h2>
                    <p className="text-gray-700">
                      기술적인 지원이 필요하시면 support@keywordpulse.example.com으로 이메일을 보내거나, 웹사이트 하단의 '문의하기' 링크를 통해 문의하세요. 프로 및 비즈니스 플랜 사용자는 우선적인 지원을 받을 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 