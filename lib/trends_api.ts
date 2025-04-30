/**
 * 트렌드 API 모듈
 * 키워드 트렌드, 관련 키워드, 인기 키워드 조회 기능을 제공합니다.
 */

import logger from './logger';

// 트렌드 카테고리 타입
export type TrendCategory = 'all' | 'business' | 'technology' | 'entertainment' | 'health';

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

/**
 * 특정 키워드와 관련된 키워드 목록을 가져옵니다.
 * @param keyword 검색할 키워드
 * @param count 가져올 관련 키워드 수
 * @param geo 지역 코드
 * @returns 관련 키워드 배열
 */
export async function getRelatedKeywords(
  keyword: string,
  count: number = 10,
  geo: string = 'KR'
): Promise<RelatedKeyword[]> {
  try {
    // 실제 API 호출 대신 더미 데이터 생성
    logger.log({
      message: '관련 키워드 검색',
      context: { keyword, count, geo }
    });
    
    // 더미 데이터 생성
    const dummyKeywords: RelatedKeyword[] = [];
    const baseKeywords = [
      '마케팅', '전략', '분석', '트렌드', '콘텐츠',
      '소셜미디어', 'SEO', '브랜딩', '광고', '성과'
    ];
    
    for (let i = 0; i < Math.min(count, baseKeywords.length); i++) {
      dummyKeywords.push({
        keyword: `${keyword} ${baseKeywords[i]}`,
        score: 100 - i * 10,
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    return dummyKeywords;
  } catch (error) {
    logger.error({
      message: '관련 키워드 검색 실패',
      error: error as Error,
      context: { keyword, count, geo }
    });
    
    return [];
  }
}

/**
 * 특정 키워드의 시간에 따른 검색 트렌드 데이터를 가져옵니다.
 * @param keyword 검색할 키워드
 * @param timeRange 시간 범위
 * @param geo 지역 코드
 * @returns 트렌드 데이터 배열
 */
export async function getKeywordTrend(
  keyword: string,
  timeRange: TrendTimeRange = 'month',
  geo: string = 'KR'
): Promise<TrendPoint[]> {
  try {
    // 실제 API 호출 대신 더미 데이터 생성
    logger.log({
      message: '키워드 트렌드 검색',
      context: { keyword, timeRange, geo }
    });
    
    // 기간에 따른 데이터 포인트 수 결정
    let dataPoints = 0;
    switch (timeRange) {
      case 'day':
        dataPoints = 24;
        break;
      case 'week':
        dataPoints = 7;
        break;
      case 'month':
        dataPoints = 30;
        break;
      case 'year':
        dataPoints = 12;
        break;
    }
    
    // 더미 데이터 생성
    const trendData: TrendPoint[] = [];
    const now = new Date();
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(now);
      
      // 기간에 따라 날짜 조정
      if (timeRange === 'day') {
        date.setHours(now.getHours() - i);
      } else if (timeRange === 'week') {
        date.setDate(now.getDate() - i);
      } else if (timeRange === 'month') {
        date.setDate(now.getDate() - i);
      } else if (timeRange === 'year') {
        date.setMonth(now.getMonth() - i);
      }
      
      // 약간의 변동성을 가진 랜덤 값 생성 (50-100 사이)
      const baseValue = 75;
      const variance = 25;
      const value = Math.floor(baseValue + (Math.random() * variance * 2 - variance));
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        value
      });
    }
    
    return trendData.reverse();
  } catch (error) {
    logger.error({
      message: '키워드 트렌드 검색 실패',
      error: error as Error,
      context: { keyword, timeRange, geo }
    });
    
    return [];
  }
}

/**
 * 현재 인기 있는 트렌딩 키워드 목록을 가져옵니다.
 * @param category 키워드 카테고리
 * @param count 가져올 키워드 수
 * @param geo 지역 코드
 * @returns 인기 키워드 배열
 */
export async function getTrendingKeywords(
  category: TrendCategory = 'all',
  count: number = 10,
  geo: string = 'KR'
): Promise<string[]> {
  try {
    // 실제 API 호출 대신 더미 데이터 생성
    logger.log({
      message: '트렌딩 키워드 검색',
      context: { category, count, geo }
    });
    
    // 카테고리별 더미 데이터
    const trendingKeywords: Record<TrendCategory, string[]> = {
      all: ['인공지능', '디지털 전환', '블록체인', '메타버스', '클라우드 컴퓨팅',
            '사이버 보안', '온라인 쇼핑', '재택근무', '전기차', '친환경'],
      business: ['스타트업', '투자', '디지털 마케팅', '비즈니스 모델', '원격 근무',
                'ESG 경영', '디지털 전환', '코로나 이후 경제', '글로벌 공급망', '인재 채용'],
      technology: ['인공지능', '머신러닝', '블록체인', '클라우드 컴퓨팅', '5G',
                  '사물인터넷', '가상현실', '증강현실', '양자 컴퓨팅', '엣지 컴퓨팅'],
      entertainment: ['넷플릭스', '유튜브', '틱톡', '메타버스', '게임 스트리밍',
                     'NFT', '디지털 콘텐츠', 'OTT 서비스', '온라인 콘서트', '소셜 미디어'],
      health: ['디지털 헬스케어', '원격 진료', '웨어러블 기기', '건강 앱', '멘탈 헬스',
              '면역력 강화', '홈 트레이닝', '건강식품', '수면 케어', '스트레스 관리']
    };
    
    // 해당 카테고리의 키워드 반환 (요청한 수만큼)
    return trendingKeywords[category].slice(0, count);
  } catch (error) {
    logger.error({
      message: '트렌딩 키워드 검색 실패',
      error: error as Error,
      context: { category, count, geo }
    });
    
    return [];
  }
} 