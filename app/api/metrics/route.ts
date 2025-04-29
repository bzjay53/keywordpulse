/**
 * 웹 바이탈 메트릭 수집 API 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '../../lib/logger';
import type { PerformanceMetric } from '../../lib/analytics';

// Edge 런타임 설정 (정적 내보내기 호환)
export const runtime = 'edge';

/**
 * 웹 바이탈 메트릭 처리 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 요청 본문 파싱
    const metric = await req.json() as PerformanceMetric;
    
    // 기본 검증
    if (!metric || !metric.name) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // 로깅
    logger.log({
      message: '웹 바이탈 메트릭 수신',
      context: {
        metric: {
          name: metric.name,
          value: metric.value,
          page: metric.page,
          timestamp: metric.timestamp || Date.now()
        }
      },
      level: 'info',
      tags: { module: 'metrics', action: 'collect', source: 'web-vitals' }
    });

    // 메트릭 기록 (Sentry 성능 모니터링, 데이터베이스 또는 분석 서비스 등으로 전송 가능)
    // 이 예제에서는 로깅만 수행
    
    // 필요한 경우 알림 트리거 (예: 임계값 초과 시)
    if (metric.name === 'LCP' && metric.value > 2500) {
      logger.warn({
        message: 'LCP 성능 저하 감지',
        context: {
          value: metric.value,
          page: metric.page,
          threshold: 2500
        },
        tags: { module: 'metrics', action: 'alert', metric: 'LCP' }
      });
      
      // 여기서 알림 서비스 호출 가능
    }
    
    // 성공 응답
    return NextResponse.json(
      { success: true },
      { status: 202 } // Accepted
    );
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '메트릭 처리 중 오류 발생',
      error: error as Error,
      tags: { module: 'metrics', action: 'error' }
    });
    
    // 오류 응답
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 