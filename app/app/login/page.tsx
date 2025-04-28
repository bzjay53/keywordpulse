'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp, resetSearchLimit } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [envWarning, setEnvWarning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showDelay, setShowDelay] = useState<boolean>(false);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);
  const router = useRouter();
  const { user, refreshSession } = useAuth();

  // URL 파라미터 처리
  useEffect(() => {
    // URL 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const modeParam = params.get('mode');
    
    if (errorParam === 'auth_callback_error') {
      setError('인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
    } else if (errorParam === 'auth_session_error') {
      setError('인증 세션 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } else if (errorParam === 'auth_code_missing') {
      setError('인증 코드가 없습니다. 다시 시도해주세요.');
    }
    
    // mode 파라미터가 있으면 해당 모드로 설정 (signup 또는 login)
    if (modeParam === 'signup') {
      setMode('signup');
    } else if (modeParam === 'login') {
      setMode('login');
    }
    
    // 이미 로그인된 경우 홈으로 리다이렉트
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
    setValidationErrors({});
  }, [mode]);

  // 카운트다운 효과 (요청 제한 시)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showDelay && delaySeconds > 0) {
      timer = setInterval(() => {
        setDelaySeconds((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setShowDelay(false);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showDelay, delaySeconds]);

  // 입력값 유효성 검사
  const validateInputs = () => {
    const errors: {
      email?: string;
      password?: string;
    } = {};
    
    // 이메일 형식 검사
    if (!email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = '유효한 이메일 형식이 아닙니다.';
    }
    
    // 비밀번호 검사
    if (!password.trim()) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (mode === 'signup' && password.length < 6) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // 입력값 유효성 검사
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Supabase 로그인 실행
        const { data, error: signInError } = await signIn(email, password);
        
        if (signInError) {
          // 요청 제한 오류 처리
          if (signInError.message.includes('너무 빠른 요청') || signInError.message.includes('너무 많은 요청')) {
            const match = signInError.message.match(/(\d+)초/);
            if (match && match[1]) {
              const seconds = parseInt(match[1], 10);
              setDelaySeconds(seconds);
              setShowDelay(true);
            }
          }
          
          throw new Error(signInError.message);
        }
        
        console.log('로그인 성공:', data);
        
        // 로그인 성공 시 검색 제한 초기화
        resetSearchLimit();
        
        // 세션 갱신
        await refreshSession();
        
        // 홈으로 리다이렉트
        router.push('/');
      } else {
        // Supabase 회원가입 실행
        const { data, error: signUpError, message } = await signUp(email, password);
        
        if (signUpError) {
          // 요청 제한 오류 처리
          if (signUpError.message.includes('너무 빠른 요청') || signUpError.message.includes('너무 많은 요청')) {
            const match = signUpError.message.match(/(\d+)초/);
            if (match && match[1]) {
              const seconds = parseInt(match[1], 10);
              setDelaySeconds(seconds);
              setShowDelay(true);
            }
          }
          
          throw new Error(signUpError.message);
        }
        
        console.log('회원가입 성공:', data, message);
        
        // 이미 로그인 상태가 되었는지 확인
        if (data?.session) {
          // 개발 모드에서는 즉시 로그인 상태가 됨
          setSuccess('회원가입이 완료되었습니다! 홈 페이지로 이동합니다.');
          // 세션 갱신
          await refreshSession();
          // 잠시 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          // 실제 환경에서는 이메일 확인 필요
          setSuccess(message || '회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.');
          setMode('login');
        }
      }
    } catch (err: any) {
      console.error('인증 오류:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // URL 파라미터에 모드 정보 추가하는 함수
  const updateURLWithMode = (newMode: 'login' | 'signup') => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.pushState({}, '', url.toString());
    setMode(newMode);
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? '로그인' : '회원가입'}
      </h1>
      
      {/* 모드 전환 탭 */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => updateURLWithMode('login')}
          className={`flex-1 py-2 ${mode === 'login' ? 'text-primary-600 border-b-2 border-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          로그인
        </button>
        <button
          onClick={() => updateURLWithMode('signup')}
          className={`flex-1 py-2 ${mode === 'signup' ? 'text-primary-600 border-b-2 border-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          회원가입
        </button>
      </div>
      
      {envWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">환경 변수 설정 필요</p>
          <p>Supabase 환경 변수가 설정되지 않았습니다. 로그인 기능이 동작하지 않을 수 있습니다.</p>
          <p className="mt-1 text-sm">
            <strong>개발 모드:</strong> admin@example.com / admin123으로 로그인할 수 있습니다.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">오류 발생</p>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">성공</p>
          <p>{success}</p>
        </div>
      )}
      
      {showDelay && delaySeconds > 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold">잠시 기다려주세요</p>
          <p>{delaySeconds}초 후에 다시 시도할 수 있습니다.</p>
          <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${(delaySeconds / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors({...validationErrors, email: undefined});
            }}
            className={`w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="your@email.com"
            disabled={isLoading || showDelay}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors({...validationErrors, password: undefined});
            }}
            className={`w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="********"
            disabled={isLoading || showDelay}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
          {mode === 'signup' && (
            <p className="mt-1 text-xs text-gray-500">비밀번호는 최소 6자 이상이어야 합니다.</p>
          )}
        </div>
        
        <button
          type="submit"
          className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${
            isLoading || showDelay 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
          disabled={isLoading || showDelay}
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
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          {mode === 'login' ? '로그인' : '회원가입'}하시면 <Link href="/terms" className="text-primary-600 hover:text-primary-700">이용약관</Link>과{' '}
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">개인정보처리방침</Link>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
} 