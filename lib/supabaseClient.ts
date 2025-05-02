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

/**
 * 벡터 데이터베이스 관련 함수들
 */

// 벡터 검색을 위한 인터페이스
export interface VectorSearchOptions {
  // 검색 쿼리 벡터
  queryVector: number[];
  // 결과 수 제한
  limit?: number;
  // 유사도 임계값 (0-1)
  threshold?: number;
  // 메타데이터 필터
  filter?: Record<string, any>;
  // 정렬 (기본: 유사도 순)
  sort?: 'similarity' | 'created_at' | 'id';
  // 정렬 방향
  sortDirection?: 'asc' | 'desc';
}

// 벡터 데이터 인터페이스
export interface VectorData {
  id?: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
  created_at?: string;
}

/**
 * 벡터 데이터를 Supabase에 저장합니다
 * @param data 저장할 벡터 데이터 (content, embedding, metadata)
 * @returns 저장 결과
 */
export async function storeVectorData(data: VectorData) {
  const { id, content, embedding, metadata } = data;

  try {
    // 벡터 데이터 저장
    const { data: insertedData, error } = await supabase
      .from('keyword_embeddings')
      .insert([
        {
          id: id || crypto.randomUUID(),
          content,
          embedding,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) throw error;

    return { 
      success: true, 
      id: insertedData?.id,
      error: null 
    };
  } catch (error) {
    console.error('벡터 데이터 저장 실패:', error);
    return { 
      success: false, 
      id: null,
      error: error.message 
    };
  }
}

/**
 * 벡터 유사도 검색을 수행합니다
 * @param options 검색 옵션
 * @returns 검색 결과
 */
export async function performVectorSearch({ 
  queryVector, 
  limit = 5, 
  threshold = 0.7,
  filter = {},
  sort = 'similarity',
  sortDirection = 'desc'
}: VectorSearchOptions) {
  try {
    // pgvector 확장의 <=> 연산자를 사용한 벡터 유사도 검색
    let query = supabase
      .from('keyword_embeddings')
      .select(`
        id,
        content,
        metadata,
        created_at,
        embedding,
        (embedding <=> '${JSON.stringify(queryVector)}') as similarity
      `)
      .gte('similarity', threshold)
      .limit(limit);

    // 필터 적용
    Object.entries(filter).forEach(([key, value]) => {
      if (key.startsWith('metadata.')) {
        // 메타데이터 내부 필드 필터링
        const metaField = key.replace('metadata.', '');
        query = query.filter('metadata->>'+metaField, 'eq', value);
      } else {
        // 일반 필드 필터링
        query = query.eq(key, value);
      }
    });

    // 정렬 적용
    if (sort === 'similarity') {
      query = query.order('similarity', { ascending: sortDirection === 'asc' });
    } else {
      query = query.order(sort, { ascending: sortDirection === 'asc' });
    }

    const { data, error } = await query;

    if (error) throw error;

    return { 
      success: true, 
      results: data.map(item => ({
        ...item,
        score: 1 - item.similarity // similarity는 거리이므로 1에서 빼서 유사도 점수로 변환
      })),
      error: null 
    };
  } catch (error) {
    console.error('벡터 검색 실패:', error);
    return { 
      success: false, 
      results: [],
      error: error.message 
    };
  }
}

/**
 * 단일 벡터 데이터를 조회합니다
 * @param id 벡터 데이터 ID
 * @returns 벡터 데이터
 */
export async function getVectorDataById(id: string) {
  try {
    const { data, error } = await supabase
      .from('keyword_embeddings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { 
      success: true, 
      data,
      error: null 
    };
  } catch (error) {
    console.error('벡터 데이터 조회 실패:', error);
    return { 
      success: false, 
      data: null,
      error: error.message 
    };
  }
}

/**
 * 벡터 데이터를 업데이트합니다
 * @param id 업데이트할 벡터 데이터 ID
 * @param data 업데이트할 데이터
 * @returns 업데이트 결과
 */
export async function updateVectorData(id: string, data: Partial<VectorData>) {
  try {
    const { error } = await supabase
      .from('keyword_embeddings')
      .update({
        content: data.content,
        embedding: data.embedding,
        metadata: data.metadata
      })
      .eq('id', id);

    if (error) throw error;

    return { 
      success: true,
      error: null 
    };
  } catch (error) {
    console.error('벡터 데이터 업데이트 실패:', error);
    return { 
      success: false,
      error: error.message 
    };
  }
}

/**
 * 벡터 데이터를 삭제합니다
 * @param id 삭제할 벡터 데이터 ID
 * @returns 삭제 결과
 */
export async function deleteVectorData(id: string) {
  try {
    const { error } = await supabase
      .from('keyword_embeddings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { 
      success: true,
      error: null 
    };
  } catch (error) {
    console.error('벡터 데이터 삭제 실패:', error);
    return { 
      success: false,
      error: error.message 
    };
  }
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