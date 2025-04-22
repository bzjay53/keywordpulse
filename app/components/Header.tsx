'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { isUserAdmin } from '@/lib/supabaseClient';

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // 간단한 예시에서는 이메일로 관리자 확인
        if (user.email === 'admin@example.com') {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    // 로그아웃 후 홈으로 리다이렉트는 자동으로 처리됨
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            KeywordPulse
          </Link>
        </div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary-600">
                홈
              </Link>
            </li>
            
            {isLoading ? (
              // 로딩 중일 때 표시
              <li className="text-gray-400">
                <span className="inline-flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </li>
            ) : user ? (
              // 로그인 상태일 때 표시
              <>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className="text-gray-600 hover:text-primary-600">
                      관리자
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/profile" className="text-gray-600 hover:text-primary-600">
                    내 프로필
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              // 로그아웃 상태일 때 표시
              <li>
                <Link href="/login" className="text-gray-600 hover:text-primary-600">
                  로그인
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 