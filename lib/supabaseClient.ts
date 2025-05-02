import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey);

// createClient 함수 export
export function createClient() {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey);
}

// 로그인 함수
export async function signIn(email: string, password: string) {
  const response = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return response;
}

// 회원가입 함수
export async function signUp(email: string, password: string) {
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
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

// 사용자 정보 가져오기
export async function getUserProfile(userId: string) {
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
  const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
  
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
  const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
  
  // 카운트 증가 및 저장
  localStorage.setItem(storageKey, (currentCount + 1).toString());
}

// 검색 제한 초기화
export function resetSearchLimit() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `search_count_${today}`;
  
  // 카운트 초기화
  localStorage.setItem(storageKey, '0');
}

// 광고 시청 여부 확인
export function hasWatchedAd() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `ad_watched_${today}`;
  
  return localStorage.getItem(storageKey) === 'true';
}

// 광고 시청 완료 표시
export function setAdWatched() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `ad_watched_${today}`;
  
  localStorage.setItem(storageKey, 'true');
} 