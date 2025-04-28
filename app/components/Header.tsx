'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Header() {
  const { user, loading: isLoading, signOut: logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 로그인 상태 디버깅
  useEffect(() => {
    if (isDevelopment) {
      console.log('[Header] 인증 상태 변경:', { 
        isAuthenticated: !!user, 
        isLoading,
        hasCredentials: !!supabase
      });
    }
  }, [user, isLoading]);

  const handleLogout = async () => {
    try {
      await logout();
      // 메뉴 닫기
      setIsMenuOpen(false);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary-600 font-bold text-xl">KeywordPulse</Link>
            </div>
          </div>
          
          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 text-gray-600 hover:text-primary-600">홈</Link>
            {/* 임시로 숨김 - 아직 페이지가 준비되지 않음 */}
            {/* <Link href="/pricing" className="px-3 py-2 text-gray-600 hover:text-primary-600">가격</Link> */}
            {/* <Link href="/docs" className="px-3 py-2 text-gray-600 hover:text-primary-600">문서</Link> */}
            
            {isLoading ? (
              <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="relative ml-3">
                <div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
                  >
                    <span className="mr-2">{user.email?.split('@')[0]}</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                        프로필
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                로그인
              </Link>
            )}
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              홈
            </Link>
            {/* 임시로 숨김 - 아직 페이지가 준비되지 않음 */}
            {/* <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              가격
            </Link>
            <Link href="/docs" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              문서
            </Link> */}
            
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50">
                    로그인
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 