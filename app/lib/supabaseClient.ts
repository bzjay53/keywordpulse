import { createClient } from '@supabase/supabase-js';

// 환경 변수 또는 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';

// 실제 환경 변수가 없는 경우 경고 로그 출력
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 인증 기능이 동작하지 않을 수 있습니다.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 환경 변수가 없는 경우 모의 응답을 반환하는 함수들
export async function signUp(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { data: null, error: { message: '개발 환경: Supabase 설정이 필요합니다.' } };
  }
  
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { data: null, error: { message: '개발 환경: Supabase 설정이 필요합니다.' } };
  }
  
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { error: null };
  }
  
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return { data: { session: null }, error: null };
  }
  
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase 환경 변수가 없어 모의 응답을 반환합니다.');
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
} 