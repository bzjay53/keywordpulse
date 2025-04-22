'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 로딩 중 또는 미인증 상태일 때 표시할 내용
  if (isLoading || !user) {
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">내 프로필</h1>
        <p className="text-gray-600">사용자 정보 및 설정을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
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

        <div className="card">
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

        <div className="card md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">계정 설정</h2>
          
          <div className="space-y-4">
            <button className="btn btn-secondary">
              비밀번호 변경
            </button>
            
            <button className="btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 