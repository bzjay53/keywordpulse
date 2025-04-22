'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [envWarning, setEnvWarning] = useState<boolean>(false);
  const router = useRouter();
  const { user, refreshSession } = useAuth();

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      router.push('/');
    }
    
    // 환경 변수 체크
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setEnvWarning(true);
    }
  }, [user, router]);
  
  // 모드 변경 시 에러 초기화
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }

      if (mode === 'login') {
        // Supabase 로그인 실행
        const { data, error: signInError } = await signIn(email, password);
        
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
          }
          throw new Error(`로그인 오류: ${signInError.message}`);
        }
        
        console.log('로그인 성공:', data);
        
        // 세션 갱신
        await refreshSession();
        
        // 홈으로 리다이렉트
        router.push('/');
      } else {
        // Supabase 회원가입 실행
        const { data, error: signUpError } = await signUp(email, password);
        
        if (signUpError) {
          if (signUpError.message.includes('already')) {
            throw new Error('이미 가입된 이메일입니다. 로그인을 시도해주세요.');
          }
          throw new Error('회원가입에 실패했습니다: ' + signUpError.message);
        }
        
        console.log('회원가입 성공:', data);
        setSuccess('회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.');
        setMode('login');
      }
    } catch (err: any) {
      console.error('인증 오류:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? '로그인' : '회원가입'}
      </h1>
      
      {envWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">환경 변수 설정 필요</p>
          <p>Supabase 환경 변수가 설정되지 않았습니다. 로그인 기능이 동작하지 않을 수 있습니다.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="********"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              처리 중...
            </span>
          ) : mode === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <p>
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-primary-600 hover:text-primary-700"
            >
              회원가입
            </button>
          </p>
        ) : (
          <p>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-primary-600 hover:text-primary-700"
            >
              로그인
            </button>
          </p>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          로그인하시면 <Link href="/terms" className="text-primary-600 hover:text-primary-700">이용약관</Link>과{' '}
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">개인정보처리방침</Link>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
} 