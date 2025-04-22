'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }

      if (mode === 'login') {
        // Supabase 로그인 실행
        const { data, error: signInError } = await signIn(email, password);
        
        if (signInError) {
          throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
        
        console.log('로그인 성공:', data);
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
        setMode('login');
        setError('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          {mode === 'login' ? '로그인' : '회원가입'}
        </h1>
        <p className="text-gray-600">
          KeywordPulse에 {mode === 'login' ? '로그인하여 더 많은 기능을 이용하세요.' : '가입하고 키워드 분석을 시작하세요.'}
        </p>
      </div>

      <div className="card">
        {error && (
          <div className={`p-3 mb-4 rounded-md ${error.includes('완료') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="example@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="********"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
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
                onClick={() => setMode('signup')}
                className="text-primary-600 hover:underline"
              >
                회원가입
              </button>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-primary-600 hover:underline"
              >
                로그인
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-gray-500 hover:text-primary-600 text-sm">
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 