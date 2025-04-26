import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

// 환경 변수 또는 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

// 개발 모드를 위한 사용자 DB
const DEV_USERS = typeof window !== 'undefined' ? 
  JSON.parse(localStorage.getItem('kp_dev_users') || '[]') as DevUser[] : 
  [] as DevUser[];

// 개발 모드용 사용자 저장
const saveDevUsers = (users: DevUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kp_dev_users', JSON.stringify(users));
  }
};

// 실제 환경 변수가 없는 경우 경고 로그 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 개발 모드로 인증 기능이 동작합니다.');
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
  HAS_WATCHED_AD: 'kp_has_watched_ad',
  CURRENT_USER: 'kp_current_user'
};

export async function signUp(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
    
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
    
    return { 
      data: { user: { email, id: newUser.id, role: 'user' } }, 
      error: null 
    };
  }
  
  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
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
      }
    }
    
    return result;
  } catch (error: any) {
    console.error('회원가입 중 오류 발생:', error);
    return {
      data: null,
      error: { message: '회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
    };
  }
}

export async function signIn(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
    
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
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // 이메일 미확인 오류 처리
    if (result.error) {
      if (result.error.message === 'Email not confirmed') {
        return {
          data: null,
          error: { message: '이메일 인증이 완료되지 않았습니다. 이메일을 확인하여 인증을 완료해주세요.' }
        };
      } else if (result.error.message.includes('Invalid login credentials')) {
        // admin API를 사용하지 않고 더 명확한 오류 메시지 제공
        return {
          data: null,
          error: { message: '로그인 정보가 올바르지 않습니다. 이메일과 비밀번호를 확인해주세요.' }
        };
      }
    }
  
    return result;
  } catch (error: any) {
    console.error('로그인 중 오류 발생:', error);
    return {
      data: null,
      error: { message: '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
    };
  }
}

export async function signOut() {
  if (!supabaseUrl || !supabaseAnonKey) {
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
  if (!supabaseUrl || !supabaseAnonKey) {
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
  if (!supabaseUrl || !supabaseAnonKey) {
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