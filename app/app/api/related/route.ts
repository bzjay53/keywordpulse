import { NextRequest, NextResponse } from 'next/server';
import { getRelatedKeywords } from '../../../lib/trends_api';
import logger from '../../../lib/logger';

// 엣지 런타임 사용 설정 추가
export const runtime = "edge";

/**
 * 관련 키워드 API 엔드포인트
 * GET: 특정 키워드와 관련된 추천 키워드 목록을 가져옵니다.
 * 
 * 쿼리 파라미터:
 * - keyword: 검색할 키워드 (필수)
 * - count: 반환할 관련 키워드 수 (기본값: 10)
 * - geo: 지역 코드 (기본값: KR)
 */
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const count = parseInt(searchParams.get('count') || '10', 10);
    const geo = searchParams.get('geo') || 'KR';

    // 필수 파라미터 검증
    if (!keyword) {
      return NextResponse.json({ 
        error: '키워드가 제공되지 않았습니다.' 
      }, { status: 400 });
    }

    // 유효성 검사
    if (isNaN(count) || count < 1 || count > 50) {
      return NextResponse.json({ 
        error: '키워드 수는 1-50 사이의 정수여야 합니다.' 
      }, { status: 400 });
    }

    // 로깅: API 요청
    logger.log({
      message: '관련 키워드 요청',
      context: {
        keyword,
        count,
        geo
      },
      tags: { endpoint: '/api/related', method: 'GET' }
    });

    // 관련 키워드 조회
    const relatedKeywords = await getRelatedKeywords(keyword, count, geo);

    // 로깅: API 응답
    logger.log({
      message: '관련 키워드 응답',
      context: {
        keyword,
        relatedCount: relatedKeywords.length
      },
      tags: { endpoint: '/api/related', method: 'GET' }
    });

    // 응답 반환
    return NextResponse.json({
      keyword,
      relatedKeywords,
      metadata: {
        count: relatedKeywords.length,
        geo,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '관련 키워드 요청 실패',
      error: error as Error,
      tags: { endpoint: '/api/related', method: 'GET' }
    });

    // 오류 응답
    return NextResponse.json({ 
      error: '관련 키워드 조회 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 