import { NextRequest, NextResponse } from 'next/server';
import { getKeywordTrend } from '@/lib/trends_api';
import logger from '@/lib/logger';

// 동적 렌더링 설정 추가
export const dynamic = 'force-dynamic';

/**
 * 키워드 트렌드 API 엔드포인트
 * GET: 특정 키워드의 시간에 따른 검색 트렌드 데이터를 가져옵니다.
 * 
 * 쿼리 파라미터:
 * - keyword: 검색할 키워드 (필수)
 * - timeRange: 시간 범위 (day, week, month, year) (기본값: month)
 * - geo: 지역 코드 (기본값: KR)
 */
export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터 파싱
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const timeRange = searchParams.get('timeRange') || 'month';
    const geo = searchParams.get('geo') || 'KR';

    // 필수 파라미터 검증
    if (!keyword) {
      return NextResponse.json({ 
        error: '키워드 파라미터가 필요합니다.' 
      }, { status: 400 });
    }

    // 유효성 검사
    const validTimeRanges = ['day', 'week', 'month', 'year'];
    if (!validTimeRanges.includes(timeRange as string)) {
      return NextResponse.json({ 
        error: '유효하지 않은 시간 범위입니다.',
        validTimeRanges 
      }, { status: 400 });
    }

    // 로깅: API 요청
    logger.log({
      message: '키워드 트렌드 요청',
      context: {
        keyword,
        timeRange,
        geo
      },
      tags: { endpoint: '/api/trend', method: 'GET' }
    });

    // 키워드 트렌드 조회
    const trendData = await getKeywordTrend(
      keyword, 
      timeRange as 'day' | 'week' | 'month' | 'year', 
      geo
    );

    // 로깅: API 응답
    logger.log({
      message: '키워드 트렌드 응답',
      context: {
        keyword,
        dataPointsCount: trendData.length
      },
      tags: { endpoint: '/api/trend', method: 'GET' }
    });

    // 응답 반환
    return NextResponse.json({
      keyword,
      trendData,
      metadata: {
        timeRange,
        dataPointsCount: trendData.length,
        geo,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '키워드 트렌드 요청 실패',
      error: error as Error,
      tags: { endpoint: '/api/trend', method: 'GET' }
    });

    // 오류 응답
    return NextResponse.json({ 
      error: '키워드 트렌드 조회 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 