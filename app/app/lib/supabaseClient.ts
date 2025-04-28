import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// 브라우저 환경인지 확인하는 상수
const isBrowser = typeof window !== 'undefined';

// 환경 변수 또는 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경 변수 미설정 시 경고 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 개발 모드로 인증 기능이 동작합니다.');
}

// 개발 환경에서는 기본값 설정
const devUrl = 'https://example.supabase.co';
const devKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || devUrl, 
  supabaseAnonKey || devKey
);

// LocalStorage 안전하게 접근하는 함수
const getLocalStorageItem = (key: string) => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

// LocalStorage 안전하게 설정하는 함수
const setLocalStorageItem = (key: string, value: string) => {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
};

// 로컬 스토리지 키 정의
export const LOCAL_STORAGE_KEYS = {
  SEARCH_COUNT: 'kp_search_count',
  USER_ID: 'kp_user_id',
  LAST_SEARCH_TIME: 'kp_last_search_time',
  HAS_WATCHED_AD: 'kp_has_watched_ad',
  CURRENT_USER: 'kp_current_user'
};

// 개발 환경 상수
export const isDevelopment = process.env.NODE_ENV === 'development';
export const DEV_ADMIN_EMAIL = 'admin@example.com';
export const DEV_ADMIN_PASSWORD = 'admin123';

// SignUp 응답 타입 정의
export type SignUpResponse = {
  data: { 
    user: any;
    session: any;
  } | null;
  error: { 
    message: string 
  } | null;
  message?: string;
}

// 회원가입 함수
export async function signUp(email: string, password: string): Promise<SignUpResponse> {
  if (isDevelopment) {
    console.log('[개발 모드] 회원가입:', email);
    
    // 개발 모드에서 바로 로그인 상태로 설정
    setLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
      email,
      id: `dev-user-${Date.now()}`,
      role: 'user',
      created_at: new Date().toISOString()
    }));
    
    return { 
      data: { 
        user: { email, id: `dev-user-${Date.now()}`, role: 'user' },
        session: { access_token: 'mock-token' }
      }, 
      error: null,
      message: '회원가입이 완료되었습니다.'
    };
  }
  
  try {
    const baseUrl = isBrowser 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://keywordpulse.vercel.app';
    
    // 실제 환경에서 회원가입 호출
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`
      }
    });
    
    if (error) throw error;
    
    return { 
      data, 
      error: null,
      message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.'
    };
  } catch (error: any) {
    console.error('[회원가입 에러]', error);
    return {
      data: null,
      error: { message: error.message || '회원가입 중 오류가 발생했습니다.' }
    };
  }
}

// 로그인 함수
export async function signIn(email: string, password: string) {
  if (isDevelopment) {
    console.log('[개발 모드] 로그인:', email);
    
    // 개발 모드에서 바로 로그인 상태로 설정
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      setLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        email,
        id: 'admin-id',
        role: 'admin',
        created_at: new Date().toISOString()
      }));
      
      return { 
        data: { 
          user: { email, id: 'admin-id', role: 'admin' },
          session: { access_token: 'mock-token-admin' }
        }, 
        error: null
      };
    }
    
    return { 
      data: null, 
      error: { message: '잘못된 이메일 또는 비밀번호입니다.' }
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('[로그인 에러]', error);
    return {
      data: null,
      error: { message: error.message || '로그인 중 오류가 발생했습니다.' }
    };
  }
}

// 로그아웃 함수
export async function signOut() {
  if (isDevelopment) {
    if (isBrowser) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    }
    return { error: null };
  }
  
  return await supabase.auth.signOut();
}

// 세션 가져오기
export async function getSession() {
  if (isDevelopment) {
    const userJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userJson) return { data: { session: null }, error: null };
    
    try {
      const user = JSON.parse(userJson);
      return {
        data: {
          session: {
            user,
            access_token: 'mock-token'
          }
        },
        error: null
      };
    } catch (e) {
      return { data: { session: null }, error: null };
    }
  }
  
  return await supabase.auth.getSession();
}

// 사용자 프로필 가져오기
export async function getUserProfile() {
  if (isDevelopment) {
    const userJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    if (!userJson) return { data: null, error: null };
    
    try {
      const user = JSON.parse(userJson);
      return { data: user, error: null };
    } catch (e) {
      return { data: null, error: null };
    }
  }
  
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return { data: null, error: null };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single();
  
  return { data, error };
}

// 검색 사용량 추적
export function trackSearchUsage() {
  const now = new Date().getTime();
  setLocalStorageItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, now.toString());
}

// 검색 횟수 증가
export function incrementSearchCount() {
  if (!isBrowser) return;
  
  const countStr = getLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0';
  const count = parseInt(countStr, 10) + 1;
  setLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, count.toString());
}

// 검색 제한 초기화
export function resetSearchLimit() {
  setLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, '0');
  setLocalStorageItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, Date.now().toString());
}

// 광고 시청 여부
export function hasWatchedAd() {
  const watched = getLocalStorageItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD);
  return watched === 'true';
}

// 광고 시청 설정
export function setAdWatched() {
  setLocalStorageItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
} 