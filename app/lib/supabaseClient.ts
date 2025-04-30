import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// 환경 변수 또는 기본값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';

/**
 * Supabase 인증 정보가 유효한지 확인하는 함수
 */
function hasValidSupabaseCredentials(): boolean {
  // 서버 사이드 정적 빌드를 위해 항상 true 반환
  if (typeof window === 'undefined') {
    return true;
  }
  
  // 클라이언트 사이드에서는 유효한 환경 변수 확인
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://example.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'example-anon-key'
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// 클라이언트 사이드에서 실행될 때만 경고 표시
if (typeof window !== 'undefined' && !hasValidSupabaseCredentials()) {
  console.warn('Supabase 환경 변수가 설정되지 않았습니다. 인증 및 데이터 기능이 작동하지 않을 수 있습니다.');
  
  // 개발 모드일 때만 추가 경고 표시
  if (process.env.NODE_ENV === 'development') {
    console.warn('개발 환경에서는 .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.');
  }
}

// 로그인 메소드 추가
export const loginWithEmail = async (email: string, password: string) => {
  // 유효한 자격 증명이 없으면 오류 반환
  if (!hasValidSupabaseCredentials()) {
    return {
      error: {
        message: 'Supabase 환경 변수가 설정되지 않았습니다.'
      },
      data: null
    };
  }
  
  return await supabase.auth.signInWithPassword({ email, password });
};

export default supabase;

// SignUp 함수의 반환 타입 정의
export type SignUpResponse = {
  data: { 
    user: any; // User 타입 호환성을 위해 any로 변경
    session: any; // Session 타입 호환성을 위해 any로 변경
  } | null;
  error: { 
    message: string 
  } | null;
  message?: string;
}

// 개발 환경 여부 확인
export const isDevelopment = 
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

// 환경 변수 미설정 시 개발 모드에서 사용할 기본 어드민 계정
export const DEV_ADMIN_EMAIL = 'admin@example.com';
export const DEV_ADMIN_PASSWORD = 'admin123';

// 개발 모드를 위한 사용자 타입 정의
interface DevUser {
  email: string;
  password: string;
  id: string;
  role: string;
  created_at: string;
}

// 개발 모드를 위한 사용자 DB - 클라이언트에서만 사용
const DEV_USERS = typeof window !== 'undefined' ? 
  JSON.parse(localStorage.getItem('kp_dev_users') || '[]') as DevUser[] : 
  [] as DevUser[];

// 개발 모드용 사용자 저장
const saveDevUsers = (users: DevUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kp_dev_users', JSON.stringify(users));
  }
};

// 방문자 세션 추적을 위한 로컬 스토리지 키
export const LOCAL_STORAGE_KEYS = {
  SEARCH_COUNT: 'kp_search_count',
  USER_ID: 'kp_user_id',
  LAST_SEARCH_TIME: 'kp_last_search_time',
  HAS_WATCHED_AD: 'kp_has_watched_ad',
  CURRENT_USER: 'kp_current_user'
};

// 마지막 요청 시간을 추적하기 위한 변수
let lastAuthRequestTime = 0;

// 요청 사이의 최소 지연 시간 (밀리초)
const MIN_AUTH_REQUEST_DELAY = 3000; // 3초

/**
 * 인증 요청 간의 최소 지연 시간을 확인하는 함수
 * @returns 요청을 보낼 수 있으면 true, 아직 기다려야 하면 false
 */
function canMakeAuthRequest(): { canProceed: boolean; remainingTime: number } {
  const now = Date.now();
  const timeSinceLastRequest = now - lastAuthRequestTime;
  const remainingTime = Math.max(0, MIN_AUTH_REQUEST_DELAY - timeSinceLastRequest);
  
  return {
    canProceed: timeSinceLastRequest >= MIN_AUTH_REQUEST_DELAY,
    remainingTime
  };
}

/**
 * 인증 요청 시간을 업데이트하는 함수
 */
function updateAuthRequestTime() {
  lastAuthRequestTime = Date.now();
}

export async function signUp(email: string, password: string): Promise<SignUpResponse> {
  // 요청 제한 확인
  const { canProceed, remainingTime } = canMakeAuthRequest();
  if (!canProceed) {
    return {
      data: null,
      error: { 
        message: `너무 빠른 요청입니다. ${Math.ceil(remainingTime / 1000)}초 후에 다시 시도해주세요.` 
      }
    };
  }
  
  if (!hasValidSupabaseCredentials()) {
    console.warn('[개발 모드] Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
    
    // 개발 모드: 이미 가입된 이메일인지 확인
    const existingUser = DEV_USERS.find((user: DevUser) => user.email === email);
    
    if (existingUser || email === DEV_ADMIN_EMAIL) {
      return { 
        data: null, 
        error: { message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.' } 
      };
    }
    
    // 비밀번호 유효성 검사 추가
    if (password.length < 6) {
      return {
        data: null,
        error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
      };
    }
    
    // 새 사용자 생성 및 저장
    const newUser = { 
      email, 
      password, // 실제 환경에서는 저장하지 않음, 개발용!
      id: `dev-user-${Date.now()}`, 
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    const updatedUsers = [...DEV_USERS, newUser];
    saveDevUsers(updatedUsers);

    // 개발 모드에서는 즉시 로그인 상태로 설정
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        email,
        id: newUser.id,
        role: 'user',
        created_at: newUser.created_at
      }));
      
      // 검색 제한 초기화
      resetSearchLimit();
    }
    
    // 인증 요청 시간 업데이트
    updateAuthRequestTime();
    
    return { 
      data: { 
        user: { 
          email, 
          id: newUser.id, 
          role: 'user' 
        },
        session: { 
          access_token: 'mock-token', 
          expires_at: Date.now() + 24 * 60 * 60 * 1000 
        }
      }, 
      error: null 
    };
  }
  
  try {
    console.log('[회원가입 시도]', { email });
    
    // 인증 요청 시간 업데이트
    updateAuthRequestTime();
    
    // 현재 사이트 URL 가져오기 또는 배포 URL 사용
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://keywordpulse.vercel.app';
    
    console.log('[회원가입] 리디렉션 URL:', `${baseUrl}/auth/callback`);
    
    // 실제 환경에서 회원가입 호출
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
        data: {
          role: 'user'
        }
      }
    });
    
    console.log('[회원가입 결과]', {
      success: !result.error,
      errorMessage: result.error?.message,
      user: result.data?.user ? 'exists' : 'none'
    });
    
    if (result.error) {
      // 오류 메시지 개선
      if (result.error.message.includes('already')) {
        return {
          data: null,
          error: { message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.' }
        };
      } else if (result.error.message.includes('password')) {
        return {
          data: null,
          error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
        };
      } else if (result.error.message.includes('security purposes') || result.error.message.includes('rate limit')) {
        return {
          data: null,
          error: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
        };
      }
      
      // 기타 오류 메시지 처리
      return {
        data: null,
        error: { message: `회원가입 오류: ${result.error.message}` }
      };
    } else if (result.data?.user) {
      // 회원가입 성공
      if (result.data.session) {
        // 세션이 있으면 로그인 상태 → 개발 모드 또는 이메일 확인 없이 자동 로그인되는 설정
        resetSearchLimit();
        return {
          data: result.data,
          error: null
        } as SignUpResponse;
      } else {
        // 세션이 없으면 이메일 확인 필요
        return {
          data: result.data,
          error: null,
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.'
        } as SignUpResponse;
      }
    }
    
    return result as SignUpResponse;
  } catch (error: any) {
    console.error('[회원가입 오류]', error);
    return {
      data: null,
      error: { message: '회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
    };
  }
}

export async function signIn(email: string, password: string) {
  // 요청 제한 확인
  const { canProceed, remainingTime } = canMakeAuthRequest();
  if (!canProceed) {
    return {
      data: null,
      error: { 
        message: `너무 빠른 요청입니다. ${Math.ceil(remainingTime / 1000)}초 후에 다시 시도해주세요.` 
      }
    };
  }
  
  if (!hasValidSupabaseCredentials()) {
    console.warn('[개발 모드] Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
    
    // 개발 모드에서 관리자 계정으로 로그인 허용
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      // 로컬 스토리지에 사용자 정보 저장
      if (typeof window !== 'undefined') {
        const adminUser = {
          email,
          id: 'dev-admin-id',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
        localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
      }
      
      // 검색 제한 초기화
      resetSearchLimit();
      
      // 인증 요청 시간 업데이트
      updateAuthRequestTime();
      
      return { 
        data: { 
          user: { email, id: 'dev-admin-id', role: 'admin' },
          session: { access_token: 'mock-token', expires_at: Date.now() + 24 * 60 * 60 * 1000 }  
        }, 
        error: null 
      };
    }
    
    // 개발 모드: 등록된 사용자 확인
    const user = DEV_USERS.find((user: DevUser) => user.email === email && user.password === password);
    
    if (user) {
      // 로컬 스토리지에 사용자 정보 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
        localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
          email,
          id: user.id,
          role: 'user',
          created_at: user.created_at
        }));
      }
      
      // 검색 제한 초기화
      resetSearchLimit();
      
      // 인증 요청 시간 업데이트
      updateAuthRequestTime();
      
      return { 
        data: { 
          user: { email, id: user.id, role: 'user' },
          session: { access_token: 'mock-token', expires_at: Date.now() + 24 * 60 * 60 * 1000 }  
        }, 
        error: null 
      };
    }
    
    // 이메일 존재 여부 확인하여 다른 오류 메시지 제공
    const emailExists = DEV_USERS.some((user: DevUser) => user.email === email);
    
    if (emailExists) {
      return { 
        data: null, 
        error: { message: '비밀번호가 일치하지 않습니다. 다시 확인해주세요.' } 
      };
    }
    
    return { 
      data: null, 
      error: { message: '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.' } 
    };
  }
  
  try {
    console.log('[로그인 시도]', { email });
    
    // 인증 요청 시간 업데이트
    updateAuthRequestTime();
    
    // 실제 환경에서 로그인 호출
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('[로그인 결과]', {
      success: !result.error,
      errorMessage: result.error?.message,
      session: result.data?.session ? 'exists' : 'none'
    });
    
    // 이메일 미확인 오류 처리
    if (result.error) {
      if (result.error.message === 'Email not confirmed') {
        // 이메일 재전송 시도
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (resendError) {
          console.error('[이메일 재전송 오류]', resendError);
        } else {
          console.log('[이메일 재전송 성공]', { email });
        }
        
        return {
          data: null,
          error: { message: '이메일 인증이 완료되지 않았습니다. 인증 이메일을 재전송했으니 확인해주세요.' }
        };
      } else if (result.error.message.includes('Invalid login credentials')) {
        // 로그인 정보 오류
        return {
          data: null,
          error: { message: '로그인 정보가 올바르지 않습니다. 이메일과 비밀번호를 확인해주세요.' }
        };
      } else if (result.error.message.includes('security purposes') || result.error.message.includes('rate limit')) {
        return {
          data: null,
          error: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
        };
      } else {
        // 기타 오류
        return {
          data: null,
          error: { message: `로그인 오류: ${result.error.message}` }
        };
      }
    } else if (result.data?.session) {
      // 로그인 성공 시 검색 제한 초기화
      resetSearchLimit();
      return result;
    } else {
      // 세션이 없는 경우 (비정상적인 상황)
      return {
        data: null,
        error: { message: '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.' }
      };
    }
  } catch (error: any) {
    console.error('[로그인 오류]', error);
    return {
      data: null,
      error: { message: '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
    };
  }
}

export async function signOut() {
  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // 로컬 스토리지에서 사용자 정보 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    }
    return { error: null };
  }
  
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // 개발 모드에서 세션 모의
    const userJson = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER) : null;
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        const isAdmin = user.email === DEV_ADMIN_EMAIL;
        
        return { 
          data: { 
            session: {
              user: { 
                id: user.id,
                email: user.email,
                role: isAdmin ? 'admin' : 'user'
              }
            }
          }, 
          error: null 
        };
      } catch (e) {
        console.error('세션 파싱 오류:', e);
      }
    }
    
    return { data: { session: null }, error: null };
  }
  
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // 개발 모드에서 사용자 모의
    const userJson = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER) : null;
    
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        const isAdmin = user.email === DEV_ADMIN_EMAIL;
        
        // User 타입에 맞는 최소한의 필수 필드 포함
        return {
          id: user.id,
          email: user.email,
          role: isAdmin ? 'admin' : 'user',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: user.created_at || new Date().toISOString()
        } as User;
      } catch (e) {
        console.error('사용자 파싱 오류:', e);
      }
    }
    
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 유저 역할 확인 함수 (관리자 페이지용)
export async function isUserAdmin(userId: string) {
  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY || !userId) {
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

// 검색 제한 초기화 (로그인 시 사용)
export function resetSearchLimit() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, '0');
    localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
    console.log('[검색 제한 초기화 완료]');
  } catch (error) {
    console.error('[검색 제한 초기화 오류]', error);
  }
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

// API 호출을 위한 재사용 가능한 객체 내보내기
export const supabaseAPI = {
  auth: {
    // 인증 관련 메서드
    signIn: async () => {
      if (!hasValidSupabaseCredentials()) {
        console.warn('Supabase 환경 변수가 설정되지 않아 로그인을 수행할 수 없습니다.');
        return { error: new Error('Supabase 환경 변수가 설정되지 않았습니다.') };
      }
      // 실제 인증 코드
      return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    },
    // 기타 인증 메서드...
  },
  data: {
    // 데이터 관련 메서드들...
  }
}; 