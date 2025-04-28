'use client';

import { createClient } from '@supabase/supabase-js';

// 클라이언트 사이드 환경인지 확인
const isBrowser = typeof window !== 'undefined';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 개발 모드 확인
const isDevelopment = process.env.NODE_ENV === 'development';

// 환경 변수가 없는 경우 경고 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 개발 모드로 인증 기능이 동작합니다.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.');
  console.warn('개발 모드에서는 admin@example.com / admin123 계정으로 로그인할 수 있습니다.');
}

// 개발 환경에서 환경 변수가 없는 경우 임시값 사용
const finalSupabaseUrl = supabaseUrl || 'https://example.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey);

// 로컬 스토리지에서 값 가져오기 (브라우저 환경 체크 포함)
function getLocalStorageItem(key: string, defaultValue: string): string {
  if (!isBrowser) return defaultValue;
  return localStorage.getItem(key) || defaultValue;
}

// 로컬 스토리지에 값 저장 (브라우저 환경 체크 포함)
function setLocalStorageItem(key: string, value: string): void {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
}

// 로그인 함수
export async function signIn(email: string, password: string) {
  // 개발 모드에서 더미 계정으로 로그인 처리
  if (isDevelopment && email === 'admin@example.com' && password === 'admin123') {
    return {
      data: {
        session: {
          access_token: 'dummy_token',
          expires_at: new Date().getTime() + 3600 * 1000,
          refresh_token: 'dummy_refresh_token',
          user: {
            id: 'dummy_user_id',
            email: 'admin@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        },
        user: {
          id: 'dummy_user_id',
          email: 'admin@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        }
      },
      error: null
    };
  }
  
  const response = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return response;
}

// 회원가입 함수
export async function signUp(email: string, password: string) {
  // 개발 모드에서 더미 계정으로 회원가입 처리
  if (isDevelopment && email === 'admin@example.com') {
    return {
      data: {
        user: {
          id: 'dummy_user_id',
          email: 'admin@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        },
        session: null
      },
      error: null,
      message: '회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.'
    };
  }
  
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  return {
    data: response.data,
    error: response.error,
    message: '회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.'
  };
}

// 로그아웃 함수
export async function signOut() {
  return await supabase.auth.signOut();
}

// 현재 세션 정보 가져오기
export async function getSession() {
  // 개발 모드에서 더미 세션 반환
  if (isDevelopment && getLocalStorageItem('dev_auth', 'false') === 'true') {
    return {
      data: {
        session: {
          access_token: 'dummy_token',
          expires_at: new Date().getTime() + 3600 * 1000,
          refresh_token: 'dummy_refresh_token',
          user: {
            id: 'dummy_user_id',
            email: 'admin@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        }
      },
      error: null
    };
  }
  
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

// 사용자 정보 가져오기
export async function getUserProfile(userId: string) {
  // 개발 모드에서 더미 프로필 반환
  if (isDevelopment && userId === 'dummy_user_id') {
    return {
      data: {
        id: 'dummy_user_id',
        email: 'admin@example.com',
        name: '관리자',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null
    };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
}

// 검색 사용량 추적 (비로그인 사용자용)
export function trackSearchUsage() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `search_count_${today}`;
  
  // 로컬 스토리지에서 오늘의 검색 카운트 가져오기
  const currentCount = parseInt(getLocalStorageItem(storageKey, '0'), 10);
  
  // 무료 검색 한도 (5회)
  const FREE_SEARCH_LIMIT = 5;
  
  // 검색 가능 여부 반환
  return currentCount < FREE_SEARCH_LIMIT;
}

// 검색 카운트 증가
export function incrementSearchCount() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `search_count_${today}`;
  
  // 로컬 스토리지에서 오늘의 검색 카운트 가져오기
  const currentCount = parseInt(getLocalStorageItem(storageKey, '0'), 10);
  
  // 카운트 증가 및 저장
  setLocalStorageItem(storageKey, (currentCount + 1).toString());
}

// 검색 제한 초기화
export function resetSearchLimit() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `search_count_${today}`;
  
  // 카운트 초기화
  setLocalStorageItem(storageKey, '0');
}

// 광고 시청 여부 확인
export function hasWatchedAd() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `ad_watched_${today}`;
  
  return getLocalStorageItem(storageKey, 'false') === 'true';
}

// 광고 시청 완료 표시
export function setAdWatched() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `ad_watched_${today}`;
  
  setLocalStorageItem(storageKey, 'true');
} 