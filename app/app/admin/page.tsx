'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

// 설정 인터페이스
interface AppSettings {
  analyticsEnabled: boolean;
  maxKeywordsPerSearch: number;
  telegramNotificationsEnabled: boolean;
  defaultSearchProvider: string;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    analyticsEnabled: true,
    maxKeywordsPerSearch: 20,
    telegramNotificationsEnabled: false,
    defaultSearchProvider: 'naver'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // 관리자 권한 확인
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        router.push('/login');
      } else {
        // 로그인한 사용자의 관리자 권한 확인
        checkAdminStatus(user.id);
      }
    }
  }, [user, isLoading, router]);

  // 관리자 권한 확인 함수 (실제로는 Supabase에서 확인)
  const checkAdminStatus = async (userId: string) => {
    try {
      // 실제 코드에서는 Supabase 쿼리로 관리자 권한 확인
      // 지금은 임시로 사용자 이메일이 'admin@example.com'인 경우에만 관리자로 설정
      if (user?.email === 'admin@example.com') {
        setIsAdmin(true);
      } else {
        router.push('/'); // 관리자가 아닌 경우 홈으로 리다이렉트
      }
    } catch (error) {
      console.error('관리자 권한 확인 중 오류:', error);
      router.push('/');
    }
  };

  // 설정 저장
  const saveSettings = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // 실제 코드에서는 API 호출로 설정 저장
      // 임시 구현: 짧은 시간 후 성공 메시지 표시
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({
        text: '설정이 성공적으로 저장되었습니다.',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: '설정 저장 중 오류가 발생했습니다.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 관리자가 아닌 경우
  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">접근 권한을 확인하는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">관리자 설정</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">애플리케이션 설정</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">데이터 분석 활성화</label>
              <p className="text-sm text-gray-500">사용자 검색 데이터 수집 및 분석</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.analyticsEnabled}
                onChange={e => setSettings({...settings, analyticsEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="font-medium">검색당 최대 키워드 수</label>
            <p className="text-sm text-gray-500 mb-2">키워드 검색 결과 제한</p>
            <input 
              type="number" 
              min="5" 
              max="50"
              value={settings.maxKeywordsPerSearch}
              onChange={e => setSettings({...settings, maxKeywordsPerSearch: parseInt(e.target.value) || 10})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">텔레그램 알림</label>
              <p className="text-sm text-gray-500">새 검색 결과에 대한 알림 전송</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.telegramNotificationsEnabled}
                onChange={e => setSettings({...settings, telegramNotificationsEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="font-medium">기본 검색 제공자</label>
            <p className="text-sm text-gray-500 mb-2">키워드 검색에 사용할 기본 플랫폼</p>
            <select 
              value={settings.defaultSearchProvider}
              onChange={e => setSettings({...settings, defaultSearchProvider: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="naver">네이버</option>
              <option value="google">구글</option>
              <option value="daum">다음</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">관리자 전용 기능</h2>
        
        <div className="space-y-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => confirm('정말로 모든 캐시를 지우시겠습니까?')}
          >
            검색 캐시 비우기
          </button>
          
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
            onClick={() => confirm('정말로 사용 통계를 초기화하시겠습니까?')}
          >
            사용 통계 초기화
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4"
          onClick={() => router.push('/')}
        >
          취소
        </button>
        
        <button
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              저장 중...
            </span>
          ) : '설정 저장'}
        </button>
      </div>
    </div>
  );
} 