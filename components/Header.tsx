import React from 'react';
import Link from 'next/link';
import { useAuth } from '../app/lib/AuthContext';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const { user, loading } = useAuth();

  return (
    <header className={`w-full py-4 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            KeywordPulse
          </Link>
          <nav className="ml-8 hidden md:flex space-x-6">
            <Link href="/trends" className="text-gray-600 hover:text-blue-600">
              트렌드
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-blue-600">
              문서
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
              가격
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              문의
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                프로필
              </Link>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                로그아웃
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 