import { NextRequest, NextResponse } from 'next/server';
import { getTrendingKeywords, TrendCategory } from '@/lib/trends_api';
import logger from '@/lib/logger';

// 동적 렌더링 설정 추가
export const dynamic = 'force-dynamic';

/**
 * 트렌딩 키워드 API 엔드포인트
 * GET: 인기 트렌딩 키워드를 가져옵니다.
 * 
 * 쿼리 파라미터:
 * - category: 키워드 카테고리 (all, business, technology, entertainment, health)
 * - count: 반환할 키워드 수
 * - geo: 지역 코드 (KR, US 등)
 */
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as TrendCategory || 'all';
    const count = parseInt(searchParams.get('count') || '10', 10);
    const geo = searchParams.get('geo') || 'KR';

    // 유효성 검사
    const validCategories: TrendCategory[] = ['all', 'business', 'technology', 'entertainment', 'health'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ 
        error: '유효하지 않은 카테고리입니다.',
        validCategories 
      }, { status: 400 });
    }

    if (isNaN(count) || count < 1 || count > 50) {
      return NextResponse.json({ 
        error: '키워드 수는 1-50 사이의 정수여야 합니다.'
      }, { status: 400 });
    }

    // 로깅: API 요청
    logger.log({
      message: '트렌딩 키워드 요청',
      context: {
        category,
        count,
        geo
      },
      tags: { endpoint: '/api/trending', method: 'GET' }
    });

    // 트렌딩 키워드 조회
    const keywords = await getTrendingKeywords(category, count, geo);

    // 로깅: API 응답
    logger.log({
      message: '트렌딩 키워드 응답',
      context: {
        keywordsCount: keywords.length,
        category
      },
      tags: { endpoint: '/api/trending', method: 'GET' }
    });

    // 응답 반환
    return NextResponse.json({ 
      keywords,
      metadata: {
        category,
        count: keywords.length,
        geo,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '트렌딩 키워드 요청 실패',
      error: error as Error,
      tags: { endpoint: '/api/trending', method: 'GET' }
    });

    // 오류 응답
    return NextResponse.json({ 
      error: '트렌딩 키워드 조회 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
} 