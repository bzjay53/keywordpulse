/**
 * 트렌드 API 모듈
 * 키워드 트렌드, 관련 키워드, 인기 키워드 조회 기능을 제공합니다.
 */

import logger from './logger';
import { supabase } from './supabaseClient';

// 트렌드 카테고리 타입
export type TrendCategory = 'all' | 'business' | 'technology' | 'entertainment' | 'health' | 'tech' | 'finance' | 'education';

// 트렌드 데이터 타입
export interface TrendPoint {
  date: string;
  value: number;
}

// 관련 키워드 타입
export interface RelatedKeyword {
  keyword: string;
  score: number;
  volume?: number;
}

// 트렌드 기간 타입
export type TrendTimeRange = 'day' | 'week' | 'month' | 'year';

export interface TrendKeyword {
  keyword: string;
  count: number;
  change?: number;
  rank?: number;
  category?: string;
}

export interface TrendTimeframe {
  id: string;
  name: string;
  days: number;
}

export interface TrendOptions {
  limit?: number;
  offset?: number;
  category?: string;
  timeframe?: string;
  source?: string;
  includeHistory?: boolean;
}

export interface TrendHistoryPoint {
  date: string;
  value: number;
}

export interface TrendKeywordWithHistory extends TrendKeyword {
  history?: TrendHistoryPoint[];
}

export interface TrendResponse {
  keywords: TrendKeywordWithHistory[];
  total: number;
  timeframe: string;
  category?: string;
  updated: string;
}

/**
 * 트렌드 타임프레임 옵션을 가져옵니다
 * @returns 사용 가능한 타임프레임 목록
 */
export async function getTimeframeOptions(): Promise<TrendTimeframe[]> {
  try {
    // 실제 구현에서는 데이터베이스에서 가져오거나 API에서 가져옵니다
    return [
      { id: 'day', name: '일간', days: 1 },
      { id: 'week', name: '주간', days: 7 },
      { id: 'month', name: '월간', days: 30 },
      { id: 'quarter', name: '분기', days: 90 },
      { id: 'year', name: '연간', days: 365 },
    ];
  } catch (error) {
    logger.error({
      message: '타임프레임 옵션을 가져오는 중 오류 발생',
      error: error as Error
    });
    return [];
  }
}

/**
 * 트렌드 카테고리 옵션을 가져옵니다
 * @returns 사용 가능한 카테고리 목록
 */
export async function getCategoryOptions(): Promise<TrendCategory[]> {
  try {
    // 실제 구현에서는 데이터베이스에서 가져오거나 API에서 가져옵니다
    return [
      'all',
      'tech',
      'business',
      'health',
      'entertainment',
      'finance',
      'education',
    ];
  } catch (error) {
    logger.error({
      message: '카테고리 옵션을 가져오는 중 오류 발생',
      error: error as Error
    });
    return [];
  }
}

/**
 * 인기 트렌드 키워드를 가져옵니다
 * @param options 트렌드 검색 옵션
 * @returns 트렌드 키워드 목록과 메타데이터
 */
export async function getTrendingKeywords(options: TrendOptions = {}): Promise<TrendResponse> {
  const {
    limit = 10,
    offset = 0,
    category = 'all',
    timeframe = 'week',
    source = 'all',
    includeHistory = false
  } = options;

  try {
    logger.log({
      message: '인기 트렌드 키워드 조회',
      level: 'info',
      context: { limit, offset, category, timeframe, source }
    });

    // 실제 구현에서는 데이터베이스를 쿼리하거나 외부 API를 호출합니다
    // 여기서는 더미 데이터를 반환합니다
    let keywords: TrendKeywordWithHistory[] = [
      { keyword: '인공지능', count: 1200, change: 15, rank: 1, category: 'tech' },
      { keyword: '블록체인', count: 980, change: -5, rank: 2, category: 'tech' },
      { keyword: '메타버스', count: 850, change: 30, rank: 3, category: 'tech' },
      { keyword: '디지털 트랜스포메이션', count: 720, change: 12, rank: 4, category: 'business' },
      { keyword: '사이버 보안', count: 650, change: 8, rank: 5, category: 'tech' },
      { keyword: '원격 근무', count: 580, change: -2, rank: 6, category: 'business' },
      { keyword: '빅데이터', count: 520, change: 5, rank: 7, category: 'tech' },
      { keyword: '클라우드 컴퓨팅', count: 490, change: 10, rank: 8, category: 'tech' },
      { keyword: '디지털 마케팅', count: 460, change: 7, rank: 9, category: 'business' },
      { keyword: '사물인터넷', count: 430, change: -8, rank: 10, category: 'tech' },
    ];

    // 카테고리 필터링
    if (category !== 'all') {
      keywords = keywords.filter(kw => kw.category === category);
    }

    // 이력 데이터 추가 (요청된 경우)
    if (includeHistory) {
      keywords = keywords.map(kw => ({
        ...kw,
        history: generateDummyHistory(timeframe)
      }));
    }

    return {
      keywords: keywords.slice(offset, offset + limit),
      total: keywords.length,
      timeframe,
      category: category !== 'all' ? category : undefined,
      updated: new Date().toISOString()
    };
  } catch (error) {
    logger.error({
      message: '트렌드 키워드를 가져오는 중 오류 발생',
      error: error as Error,
      context: { options }
    });

    throw new Error(`트렌드 키워드 조회 실패: ${error.message}`);
  }
}

/**
 * 특정 키워드의 트렌드 상세 정보를 가져옵니다
 * @param keyword 조회할 키워드
 * @param timeframe 시간 범위
 * @returns 키워드 트렌드 상세 정보
 */
export async function getKeywordTrend(
  keyword: string,
  timeframe: string = 'week'
): Promise<TrendKeywordWithHistory | null> {
  try {
    logger.log({
      message: `키워드 트렌드 상세 조회: ${keyword}`,
      level: 'info',
      context: { keyword, timeframe }
    });

    // 실제 구현에서는 데이터베이스를 쿼리하거나 외부 API를 호출합니다
    // 여기서는 더미 데이터를 반환합니다
    const dummyTrends: Record<string, TrendKeywordWithHistory> = {
      '인공지능': { 
        keyword: '인공지능', 
        count: 1200, 
        change: 15, 
        rank: 1, 
        category: 'tech',
        history: generateDummyHistory(timeframe)
      },
      '블록체인': { 
        keyword: '블록체인', 
        count: 980, 
        change: -5, 
        rank: 2, 
        category: 'tech',
        history: generateDummyHistory(timeframe)
      },
    };

    // 키워드가 있으면 반환, 없으면 null 반환
    return dummyTrends[keyword] || null;
  } catch (error) {
    logger.error({
      message: `키워드 트렌드 상세 조회 중 오류: ${keyword}`,
      error: error as Error,
      context: { keyword, timeframe }
    });

    throw new Error(`키워드 트렌드 상세 조회 실패: ${error.message}`);
  }
}

/**
 * 관련 키워드를 검색합니다
 * @param keyword 검색 키워드
 * @param limit 결과 제한 수
 * @returns 관련 키워드 목록
 */
export async function getRelatedKeywords(
  keyword: string,
  limit: number = 10
): Promise<TrendKeyword[]> {
  try {
    logger.log({
      message: `관련 키워드 검색: ${keyword}`,
      level: 'info',
      context: { keyword, limit }
    });

    // 여기서는 더미 데이터 반환
    // 실제 구현에서는 데이터베이스나 API에서 관련 키워드를 조회합니다
    const relatedKeywords: TrendKeyword[] = [
      { keyword: `${keyword} 추천`, count: 580, change: 12 },
      { keyword: `${keyword} 사용법`, count: 450, change: 8 },
      { keyword: `${keyword} 프로그램`, count: 370, change: -3 },
      { keyword: `${keyword} 무료`, count: 320, change: 5 },
      { keyword: `${keyword} 최신`, count: 290, change: 15 },
      { keyword: `${keyword} 가격`, count: 250, change: 7 },
      { keyword: `${keyword} 설치`, count: 230, change: -2 },
      { keyword: `${keyword} 비교`, count: 210, change: 4 },
      { keyword: `${keyword} 후기`, count: 190, change: 10 },
      { keyword: `${keyword} 대안`, count: 170, change: 6 },
    ];

    return relatedKeywords.slice(0, limit);
  } catch (error) {
    logger.error({
      message: `관련 키워드 검색 중 오류: ${keyword}`,
      error: error as Error,
      context: { keyword, limit }
    });

    throw new Error(`관련 키워드 검색 실패: ${error.message}`);
  }
}

/**
 * 특정 시간 범위에 대한 더미 이력 데이터를 생성합니다
 * @param timeframe 시간 범위
 * @returns 이력 데이터 포인트 배열
 */
function generateDummyHistory(timeframe: string): TrendHistoryPoint[] {
  let days = 7; // 기본값은 주간

  // 시간 범위에 따라 일수 결정
  switch (timeframe) {
    case 'day':
      days = 1;
      break;
    case 'week':
      days = 7;
      break;
    case 'month':
      days = 30;
      break;
    case 'quarter':
      days = 90;
      break;
    case 'year':
      days = 365;
      break;
  }

  // 더미 이력 데이터 생성
  const history: TrendHistoryPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    history.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
      value: Math.floor(Math.random() * 1000) + 100 // 100~1100 사이의 랜덤값
    });
  }

  return history;
}

export default {
  getTrendingKeywords,
  getKeywordTrend,
  getRelatedKeywords,
  getTimeframeOptions,
  getCategoryOptions
}; 