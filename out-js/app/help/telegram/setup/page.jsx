'use client';
import React from 'react';
import Link from 'next/link';
export default function TelegramSetupPage() {
    return (<div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/help" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          도움말 센터로 돌아가기
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">텔레그램 봇 설정 방법</h1>
      <p className="text-lg text-gray-600 mb-8">
        KeywordPulse는 텔레그램을 통해 키워드 분석 결과와 알림을 받을 수 있습니다. 
        이 가이드에서는 텔레그램 봇을 생성하고 KeywordPulse에 연결하는 방법을 단계별로 안내합니다.
      </p>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">텔레그램 봇이란?</h2>
        <p className="text-gray-700 mb-4">
          텔레그램 봇은 텔레그램 메신저 내에서 특정 기능을 수행하는 자동화된 계정입니다. 
          KeywordPulse는 사용자가 설정한 봇을 통해 키워드 분석 결과, 알림 및 기타 중요한 정보를 전송합니다.
        </p>
        <div className="flex items-center bg-blue-50 p-4 rounded-md">
          <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-blue-700">
            봇을 설정하려면 텔레그램 계정이 필요합니다. 텔레그램을 아직 사용하지 않으신다면, 
            <a href="https://telegram.org/" className="underline font-medium" target="_blank" rel="noopener noreferrer"> 텔레그램 웹사이트</a>에서 
            다운로드하실 수 있습니다.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1단계: 텔레그램 봇 생성하기</h2>
        
        <div className="border-l-4 border-primary-500 pl-4 mb-6">
          <p className="text-gray-700">
            텔레그램 봇은 <strong>BotFather</strong>라는 공식 텔레그램 봇을 통해 생성할 수 있습니다. 
            BotFather는 봇 생성 및 관리를 위한 인터페이스를 제공합니다.
          </p>
        </div>

        <ol className="space-y-6">
          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">1. BotFather 시작하기</h3>
            <p className="text-gray-700 mb-3">
              텔레그램 앱에서 <a href="https://t.me/BotFather" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">@BotFather</a>를 
              검색하거나 링크를 클릭하여 BotFather와 채팅을 시작하세요.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500 italic">
                BotFather에게 <code className="bg-gray-100 px-2 py-1 rounded">/start</code> 명령어를 보내면 
                사용 가능한 명령어 목록을 확인할 수 있습니다.
              </p>
            </div>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">2. 새 봇 생성하기</h3>
            <p className="text-gray-700 mb-3">
              BotFather에게 <code className="bg-gray-100 px-2 py-1 rounded">/newbot</code> 명령어를 보내세요.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                봇 생성 과정이 시작되면 BotFather가 봇의 이름과 사용자 이름을 요청할 것입니다.
              </p>
            </div>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">3. 봇 이름 설정하기</h3>
            <p className="text-gray-700 mb-3">
              BotFather가 봇의 이름을 입력하라고 요청할 것입니다. 이 이름은 텔레그램 대화 목록과 봇과의 채팅에서 표시됩니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                예: <code className="bg-gray-100 px-2 py-1 rounded">KeywordPulse 알림 봇</code>
              </p>
            </div>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">4. 봇 사용자 이름 설정하기</h3>
            <p className="text-gray-700 mb-3">
              다음으로, BotFather가 봇의 사용자 이름을 입력하라고 요청할 것입니다. 
              이 사용자 이름은 고유해야 하며 반드시 <code className="bg-gray-100 px-2 py-1 rounded">_bot</code>으로 끝나야 합니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                예: <code className="bg-gray-100 px-2 py-1 rounded">mykeywordpulse_bot</code> 또는 
                <code className="bg-gray-100 px-2 py-1 rounded">your_name_keyword_bot</code>
              </p>
            </div>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">5. 봇 토큰 받기</h3>
            <p className="text-gray-700 mb-3">
              봇 생성이 완료되면 BotFather가 봇 토큰을 제공할 것입니다. 
              이 토큰은 KeywordPulse에서 텔레그램 봇과 통신하는 데 필요합니다.
            </p>
            <div className="bg-gray-100 p-3 rounded-md border border-yellow-300">
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p className="text-yellow-800 font-medium">
                  중요: 봇 토큰은 비밀번호와 같습니다. 절대 공유하지 마세요!
                </p>
              </div>
              <p className="text-sm text-gray-700">
                봇 토큰은 다음과 같은 형식으로 제공됩니다:
                <code className="bg-white px-2 py-1 rounded block mt-2 overflow-x-auto">
                  123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ
                </code>
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2단계: 채팅 ID 찾기</h2>
        
        <div className="border-l-4 border-primary-500 pl-4 mb-6">
          <p className="text-gray-700">
            채팅 ID는 텔레그램에서 메시지를 보낼 대상을 식별하는 고유 번호입니다. 
            KeywordPulse가 알림을 보낼 수 있도록 사용자의 채팅 ID를 찾아야 합니다.
          </p>
        </div>

        <ol className="space-y-6">
          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">1. @userinfobot 시작하기</h3>
            <p className="text-gray-700 mb-3">
              텔레그램 앱에서 <a href="https://t.me/userinfobot" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">@userinfobot</a>을 
              검색하거나 링크를 클릭하여 채팅을 시작하세요.
            </p>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">2. 채팅 ID 받기</h3>
            <p className="text-gray-700 mb-3">
              봇에게 아무 메시지나 보내면 봇이 사용자 정보와 함께 ID를 알려줍니다.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                메시지는 다음과 같은 형식으로 받게 됩니다:
                <code className="bg-gray-100 px-2 py-1 rounded block mt-2">
                  Id: 123456789<br />
                  First: 홍<br />
                  Last: 길동<br />
                  Username: @hong_gildong
                </code>
                여기서 'Id:' 뒤에 오는 숫자가 채팅 ID입니다.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">대안: IDBot 사용하기</h3>
          <p className="text-gray-700 mb-3">
            userinfobot이 작동하지 않는 경우, <a href="https://t.me/myidbot" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">@myidbot</a>을 사용할 수도 있습니다.
          </p>
          <ol className="list-decimal pl-5 text-gray-700 space-y-1">
            <li>@myidbot과 채팅을 시작하세요.</li>
            <li><code className="bg-gray-200 px-2 py-0.5 rounded">/getid</code> 명령어를 보내세요.</li>
            <li>봇이 사용자의 ID를 응답할 것입니다.</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3단계: KeywordPulse에 설정하기</h2>
        
        <div className="border-l-4 border-primary-500 pl-4 mb-6">
          <p className="text-gray-700">
            이제 봇 토큰과 채팅 ID를 확보했으니, KeywordPulse에 이 정보를 등록하여 텔레그램 알림을 활성화할 수 있습니다.
          </p>
        </div>

        <ol className="space-y-6">
          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">1. 프로필 페이지로 이동</h3>
            <p className="text-gray-700 mb-3">
              KeywordPulse에 로그인한 후, <Link href="/profile" className="text-primary-600 hover:underline">프로필 페이지</Link>로 이동하세요.
            </p>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">2. 텔레그램 알림 설정 섹션 찾기</h3>
            <p className="text-gray-700 mb-3">
              프로필 페이지에서 "텔레그램 알림 설정" 섹션을 찾으세요. 이 섹션에는 봇 토큰과 채팅 ID를 입력할 수 있는 필드가 있습니다.
            </p>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">3. 정보 입력 및 저장</h3>
            <p className="text-gray-700 mb-3">
              봇 토큰과 채팅 ID를 해당 필드에 입력한 후 "설정 저장" 버튼을 클릭하세요.
            </p>
            <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
              <div className="flex items-start mb-2">
                <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-gray-700">
                  입력한 정보는 안전하게 저장되며, KeywordPulse에서만 사용됩니다.
                </p>
              </div>
            </div>
          </li>

          <li className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">4. 테스트 메시지 보내기</h3>
            <p className="text-gray-700 mb-3">
              설정이 완료되면 "테스트 메시지 보내기" 버튼을 클릭하여 설정이 제대로 작동하는지 확인하세요.
            </p>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-500">
                테스트 메시지가 성공적으로 전송되면, 텔레그램에서 봇으로부터 확인 메시지를 받게 됩니다.
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">문제 해결</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">테스트 메시지가 전송되지 않습니다.</h3>
            <p className="text-gray-700">
              다음 사항을 확인해 보세요:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
              <li>봇 토큰이 정확하게 입력되었는지 확인하세요.</li>
              <li>채팅 ID가 정확하게 입력되었는지 확인하세요.</li>
              <li>봇을 생성한 후 봇과 대화를 시작했는지 확인하세요. 텔레그램에서 봇을 찾아 '/start' 명령어를 보내보세요.</li>
              <li>인터넷 연결이 안정적인지 확인하세요.</li>
            </ul>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">봇 생성 시 오류가 발생합니다.</h3>
            <p className="text-gray-700">
              다음 사항을 확인해 보세요:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
              <li>봇 사용자 이름이 '_bot'으로 끝나는지 확인하세요.</li>
              <li>입력한 사용자 이름이 이미 사용 중인지 확인하세요. 다른 사용자 이름을 시도해 보세요.</li>
              <li>텔레그램 앱이 최신 버전인지 확인하세요.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">채팅 ID를 찾을 수 없습니다.</h3>
            <p className="text-gray-700">
              다른 방법을 시도해 보세요:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
              <li>@userinfobot 대신 @myidbot을 사용해 보세요.</li>
              <li>텔레그램 웹 버전(web.telegram.org)으로 로그인한 후, 프로필을 확인해 보세요.</li>
              <li>텔레그램 앱을 재설치한 후 다시 시도해 보세요.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">추가 도움말</h2>
        <p className="text-blue-800 mb-4">
          이 가이드를 따라 해도 문제가 해결되지 않는다면, 다음 리소스를 확인해 보세요:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/help/telegram/troubleshooting">
            <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors">
              <h3 className="font-semibold text-blue-700 mb-2">문제 해결 가이드</h3>
              <p className="text-gray-600 text-sm">
                텔레그램 설정 관련 일반적인 문제 해결 방법을 알아보세요.
              </p>
            </div>
          </Link>
          <Link href="/contact">
            <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-colors">
              <h3 className="font-semibold text-blue-700 mb-2">고객 지원 문의</h3>
              <p className="text-gray-600 text-sm">
                전문가의 도움이 필요하시면 고객 지원팀에 문의하세요.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/help" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          도움말 센터로 돌아가기
        </Link>
        <Link href="/help/telegram/test" className="text-primary-600 hover:text-primary-800 flex items-center">
          알림 테스트하기
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </div>);
}
