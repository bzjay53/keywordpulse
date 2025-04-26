'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function TelegramTestPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('안녕하세요! 이것은 KeywordPulse에서 보낸 테스트 메시지입니다.');

  const handleTest = async () => {
    if (!token || !chatId) {
      toast({
        title: '오류',
        description: '봇 토큰과 채팅 ID를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/notify/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          chat_id: chatId,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '성공',
          description: '텔레그램 메시지가 성공적으로 전송되었습니다. 텔레그램 앱을 확인해보세요.',
          variant: 'default',
        });
      } else {
        toast({
          title: '오류',
          description: data.error || '메시지 전송 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast({
        title: '오류',
        description: '서버 연결 중 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/help/telegram/setup" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          텔레그램 설정 가이드로 돌아가기
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">텔레그램 알림 테스트</h1>
      <p className="text-lg text-gray-600 mb-8">
        텔레그램 봇 설정이 올바르게 되었는지 확인하기 위해 테스트 메시지를 보내보세요.
        아래 양식에 봇 토큰과 채팅 ID를 입력하고 테스트 메시지를 전송할 수 있습니다.
      </p>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">테스트 메시지 보내기</h2>
        
        <div className="border-l-4 border-primary-500 pl-4 mb-6">
          <p className="text-gray-700">
            이 테스트는 텔레그램 봇 설정이 올바르게 되었는지 확인하는 데 도움이 됩니다.
            성공적으로 메시지가 전송되면, 텔레그램 앱에서 해당 봇으로부터 메시지를 받게 됩니다.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              봇 토큰
            </label>
            <Input
              id="token"
              type="text"
              placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              BotFather에서 받은 봇 토큰을 입력하세요.
            </p>
          </div>

          <div>
            <label htmlFor="chatId" className="block text-sm font-medium text-gray-700 mb-1">
              채팅 ID
            </label>
            <Input
              id="chatId"
              type="text"
              placeholder="123456789"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              @userinfobot 또는 @myidbot에서 받은 채팅 ID를 입력하세요.
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              테스트 메시지
            </label>
            <Textarea
              id="message"
              placeholder="테스트 메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500">
              보내고 싶은 메시지를 입력하세요. 기본 메시지를 사용해도 됩니다.
            </p>
          </div>

          <Button 
            onClick={handleTest}
            disabled={loading}
            className="w-full"
          >
            {loading ? '전송 중...' : '테스트 메시지 보내기'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">메시지 전송 결과 해석하기</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-green-700 mb-2">성공적인 전송</h3>
            <p className="text-gray-700">
              테스트 메시지가 성공적으로 전송되면 다음과 같은 일이 발생합니다:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
              <li>페이지 상단에 성공 메시지가 표시됩니다.</li>
              <li>텔레그램 앱에서 봇으로부터 보낸 메시지를 받게 됩니다.</li>
              <li>이로써 텔레그램 알림 설정이 올바르게 되었음을 확인할 수 있습니다.</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-red-700 mb-2">오류 발생</h3>
            <p className="text-gray-700">
              오류가 발생하면 다음 사항을 확인해 보세요:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
              <li>봇 토큰이 정확하게 입력되었는지 확인하세요.</li>
              <li>채팅 ID가 정확하게 입력되었는지 확인하세요.</li>
              <li>봇을 생성한 후 봇과 대화를 시작했는지 확인하세요. 텔레그램에서 봇을 찾아 '/start' 명령어를 보내보세요.</li>
              <li>인터넷 연결이 안정적인지 확인하세요.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">봇 토큰과 채팅 ID는 어디서 찾나요?</h2>
        <p className="text-blue-800 mb-4">
          봇 토큰과 채팅 ID를 얻는 방법을 잊으셨나요? 아래 링크를 통해 자세한 안내를 확인하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-2">봇 토큰 찾기</h3>
            <p className="text-gray-600 text-sm mb-3">
              텔레그램의 BotFather에서 봇을 생성한 후 받은 토큰을 사용하세요.
            </p>
            <Link href="/help/telegram/setup#1단계-텔레그램-봇-생성하기" className="text-primary-600 hover:underline text-sm">
              봇 생성 가이드 보기
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-2">채팅 ID 찾기</h3>
            <p className="text-gray-600 text-sm mb-3">
              @userinfobot 또는 @myidbot을 통해 채팅 ID를 확인할 수 있습니다.
            </p>
            <Link href="/help/telegram/setup#2단계-채팅-id-찾기" className="text-primary-600 hover:underline text-sm">
              채팅 ID 찾기 가이드 보기
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">다음 단계</h2>
        
        <p className="text-gray-700 mb-4">
          테스트가 성공적으로 완료되면, KeywordPulse 프로필 설정에서 봇 토큰과 채팅 ID를 저장하여 알림 설정을 완료할 수 있습니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/profile">
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-200 hover:border-primary-400 transition-colors">
              <h3 className="font-semibold text-primary-700 mb-2">프로필 설정으로 이동</h3>
              <p className="text-gray-600 text-sm">
                프로필 페이지에서 텔레그램 알림 설정을 완료하세요.
              </p>
            </div>
          </Link>
          <Link href="/help/keywords">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-400 transition-colors">
              <h3 className="font-semibold text-gray-700 mb-2">키워드 설정 가이드</h3>
              <p className="text-gray-600 text-sm">
                키워드 모니터링 설정 방법을 알아보세요.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/help/telegram/setup" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          텔레그램 설정 가이드로 돌아가기
        </Link>
        <Link href="/help" className="text-primary-600 hover:text-primary-800 flex items-center">
          도움말 센터로 이동
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
} 