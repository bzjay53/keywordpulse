'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // 텔레그램 설정을 위한 상태 추가
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // 사용자의 텔레그램 설정 불러오기
      loadTelegramSettings();
    }
  }, [user, loading, router]);

  // 텔레그램 설정 불러오기
  const loadTelegramSettings = async () => {
    try {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('telegram_token, telegram_chat_id')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('설정 로드 오류:', error);
        return;
      }
      
      if (data) {
        setTelegramToken(data.telegram_token || '');
        setTelegramChatId(data.telegram_chat_id || '');
      }
    } catch (error) {
      console.error('텔레그램 설정 로드 오류:', error);
    }
  };

  // 텔레그램 설정 저장
  const saveTelegramSettings = async () => {
    try {
      if (!user?.id) return;
      
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          telegram_token: telegramToken,
          telegram_chat_id: telegramChatId,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('설정 저장 오류:', error);
        setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.' });
        return;
      }
      
      setMessage({ type: 'success', text: '텔레그램 설정이 성공적으로 저장되었습니다.' });
      
      // 3초 후 메시지 삭제
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('텔레그램 설정 저장 오류:', error);
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  // 테스트 메시지 전송
  const sendTestMessage = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const response = await fetch('/api/notify/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: telegramToken,
          chat_id: telegramChatId,
          message: '테스트 메시지: KeywordPulse에서 보낸 메시지입니다.'
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setMessage({ type: 'error', text: `테스트 메시지 전송 실패: ${result.error || '알 수 없는 오류'}` });
        return;
      }
      
      setMessage({ type: 'success', text: '테스트 메시지가 성공적으로 전송되었습니다!' });
    } catch (error) {
      console.error('테스트 메시지 전송 오류:', error);
      setMessage({ type: 'error', text: '테스트 메시지 전송 중 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  // 로딩 중 또는 미인증 상태일 때 표시할 내용
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">내 프로필</h1>
        <p className="text-gray-600">사용자 정보 및 설정을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">마지막 로그인</p>
              <p className="font-medium">
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleString('ko-KR')
                  : '정보 없음'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">내 활동</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">키워드 검색 횟수</p>
              <p className="font-medium">12회</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">저장된 키워드 세트</p>
              <p className="font-medium">3개</p>
            </div>
          </div>
        </div>

        {/* 텔레그램 알림 설정 섹션 추가 */}
        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">텔레그램 알림 설정</h2>
          <p className="text-gray-600 mb-4">키워드 분석 결과를 텔레그램으로 받아보세요.</p>
          
          {message.text && (
            <div className={`p-3 rounded-md mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="telegram-token" className="block text-sm text-gray-500 mb-1">
                텔레그램 봇 토큰
              </label>
              <input
                id="telegram-token"
                type="text"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href="https://core.telegram.org/bots#botfather" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  @BotFather
                </a>에서 봇을 만들고 토큰을 받으세요
              </p>
            </div>
            
            <div>
              <label htmlFor="telegram-chat-id" className="block text-sm text-gray-500 mb-1">
                텔레그램 채팅 ID
              </label>
              <input
                id="telegram-chat-id"
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                텔레그램에서 
                <a 
                  href="https://t.me/userinfobot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline mx-1"
                >
                  @userinfobot
                </a>
                에게 메시지를 보내면 ID를 알려드립니다
              </p>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={saveTelegramSettings}
                disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '설정 저장'}
              </button>
              
              <button
                onClick={sendTestMessage}
                disabled={saving || !telegramToken || !telegramChatId}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                테스트 메시지 보내기
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">계정 설정</h2>
          
          <div className="space-y-4">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              비밀번호 변경
            </button>
            
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 