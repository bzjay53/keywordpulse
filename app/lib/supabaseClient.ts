import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// 환경 변수 또는 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경 변수 미설정 시 개발 모드에서 사용할 기본 어드민 계정
export const DEV_ADMIN_EMAIL = 'admin@example.com';
export const DEV_ADMIN_PASSWORD = 'admin123';

// 실제 환경 변수가 없는 경우 경고 로그 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 인증 기능이 동작하지 않을 수 있습니다.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.');
  console.warn(`개발 모드에서는 ${DEV_ADMIN_EMAIL} / ${DEV_ADMIN_PASSWORD} 계정으로 로그인할 수 있습니다.`);
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 방문자 세션 추적을 위한 로컬 스토리지 키
export const LOCAL_STORAGE_KEYS = {
  SEARCH_COUNT: 'kp_search_count',
  USER_ID: 'kp_user_id',
  LAST_SEARCH_TIME: 'kp_last_search_time',
  HAS_WATCHED_AD: 'kp_has_watched_ad'
};

export async function signUp(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    
    if (email === DEV_ADMIN_EMAIL) {
      return { 
        data: null, 
        error: { message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.' } 
      };
    }
    
    // 로컬 스토리지에 사용자 정보 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
    }
    
    return { 
      data: { user: { email, id: 'dev-user-id', role: 'user' } }, 
      error: null 
    };
  }
  
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    
    // 개발 모드에서 관리자 계정으로 로그인 허용
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      // 로컬 스토리지에 사용자 정보 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
      }
      
      return { 
        data: { 
          user: { email, id: 'dev-admin-id', role: 'admin' },
          session: { access_token: 'mock-token', expires_at: Date.now() + 24 * 60 * 60 * 1000 }  
        }, 
        error: null 
      };
    }
    
    return { 
      data: null, 
      error: { message: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' } 
    };
  }
  
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // 로컬 스토리지에서 사용자 정보 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID);
    }
    return { error: null };
  }
  
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // 개발 모드에서 세션 모의
    const userId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) : null;
    
    if (userId) {
      const isAdmin = userId === DEV_ADMIN_EMAIL;
      
      return { 
        data: { 
          session: {
            user: { 
              id: isAdmin ? 'dev-admin-id' : 'dev-user-id',
              email: userId,
              role: isAdmin ? 'admin' : 'user'
            }
          }
        }, 
        error: null 
      };
    }
    
    return { data: { session: null }, error: null };
  }
  
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // 개발 모드에서 사용자 모의
    const userId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) : null;
    
    if (userId) {
      const isAdmin = userId === DEV_ADMIN_EMAIL;
      // User 타입에 맞는 최소한의 필수 필드 포함
      return {
        id: isAdmin ? 'dev-admin-id' : 'dev-user-id',
        email: userId,
        role: isAdmin ? 'admin' : 'user',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;
    }
    
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 유저 역할 확인 함수 (관리자 페이지용)
export async function isUserAdmin(userId: string) {
  if (!supabaseUrl || !supabaseAnonKey || !userId) {
    // 개발 모드에서 관리자 여부 확인
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) : null;
    return storedUserId === DEV_ADMIN_EMAIL;
  }
  
  try {
    // 이 부분은 실제 Supabase DB에 user_roles 테이블이 있다고 가정
    // 데모에서는 admin@example.com을 관리자로 설정
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === 'admin@example.com';
  } catch (error) {
    console.error('관리자 권한 확인 중 오류:', error);
    return false;
  }
}

// 사용자 검색 제한 관리 함수
export function trackSearchUsage() {
  if (typeof window === 'undefined') return false;
  
  const searchCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0', 10);
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
  const lastSearchTime = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME);
  const hasWatchedAd = localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD) === 'true';
  
  // 로그인 사용자인 경우 추가 검색 가능
  if (userId) {
    // 로그인 사용자는 기본 1회 + 추가 1회 = 2회 검색 가능
    return searchCount < 2;
  }
  
  // 비로그인 사용자는 1회만 검색 가능
  return searchCount < 1;
}

// 사용자 검색 횟수 증가
export function incrementSearchCount() {
  if (typeof window === 'undefined') return;
  
  const currentCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0', 10);
  localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, (currentCount + 1).toString());
  localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, new Date().toISOString());
}

// 광고 시청 후 검색 가능 상태로 변경
export function setAdWatched() {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
}

// 광고 시청 여부 확인
export function hasWatchedAd() {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD) === 'true';
} 