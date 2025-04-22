import { createClient } from '@supabase/supabase-js';

// 환경 변수 또는 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 실제 환경 변수가 없는 경우 경고 로그 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 인증 기능이 동작하지 않을 수 있습니다.');
  console.warn('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 환경 변수가 없는 경우 모의 응답을 반환하는 함수들
export async function signUp(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { 
      data: null, 
      error: { message: '개발 환경: Supabase 설정이 필요합니다. 환경 변수를 확인해주세요.' } 
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
    return { 
      data: null, 
      error: { message: '개발 환경: Supabase 설정이 필요합니다. 환경 변수를 확인해주세요.' } 
    };
  }
  
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { error: null };
  }
  
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { data: { session: null }, error: null };
  }
  
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 유저 역할 확인 함수 추가 (관리자 페이지용)
export async function isUserAdmin(userId: string) {
  if (!supabaseUrl || !supabaseAnonKey || !userId) {
    return false;
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