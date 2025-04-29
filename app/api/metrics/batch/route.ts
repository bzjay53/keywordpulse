/**
 * API 메트릭 일괄 처리 엔드포인트
 * apiMetrics에서 전송된 성능 데이터를 처리합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../lib/logger';

// Edge 런타임 설정
export const runtime = 'edge';

// 배치 메트릭 타입 정의
type MetricBatch = {
  metrics: Array<{
    name: string;
    duration: number;
    timestamp: number;
    success: boolean;
    metadata?: Record<string, any>;
  }>;
  source: string;
  timestamp: number;
};

/**
 * API 메트릭 일괄 처리 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 요청 본문 파싱
    const batch = await req.json() as MetricBatch;
    
    // 기본 검증
    if (!batch || !Array.isArray(batch.metrics) || batch.metrics.length === 0) {
      return NextResponse.json(
        { error: 'Invalid metrics batch data' },
        { status: 400 }
      );
    }

    // 메트릭 수 로깅
    logger.info({
      message: 'API 메트릭 배치 수신',
      context: {
        count: batch.metrics.length,
        source: batch.source,
        timestamp: batch.timestamp
      },
      tags: { module: 'metrics', action: 'batchCollect', source: batch.source }
    });

    // 중요 메트릭 찾기 (성능 문제 또는 오류)
    const criticalMetrics = batch.metrics.filter(
      metric => !metric.success || metric.duration > 1000
    );

    // 중요 메트릭이 있으면 별도 로깅
    if (criticalMetrics.length > 0) {
      logger.warn({
        message: '중요 API 메트릭 감지',
        context: {
          criticalCount: criticalMetrics.length,
          metrics: criticalMetrics.map(m => ({
            name: m.name,
            duration: m.duration,
            success: m.success
          }))
        },
        tags: { module: 'metrics', action: 'criticalMetrics', source: batch.source }
      });
      
      // 여기서 특정 임계값 기반으로 알림 로직 추가 가능
    }

    // API 엔드포인트별 성능 집계 (평균 응답 시간, 오류율 등)
    const endpointStats: Record<string, { 
      count: number; 
      totalDuration: number; 
      errorCount: number;
      maxDuration: number;
    }> = {};
    
    for (const metric of batch.metrics) {
      // 엔드포인트 이름 추출 (일반적으로 메트릭 이름에 경로 포함)
      // 예: 'api_keywords_search' -> 'keywords/search'
      const endpoint = metric.name.replace('api_', '').replace(/_/g, '/');
      
      if (!endpointStats[endpoint]) {
        endpointStats[endpoint] = {
          count: 0,
          totalDuration: 0,
          errorCount: 0,
          maxDuration: 0
        };
      }
      
      const stats = endpointStats[endpoint];
      stats.count++;
      stats.totalDuration += metric.duration;
      if (!metric.success) stats.errorCount++;
      stats.maxDuration = Math.max(stats.maxDuration, metric.duration);
    }
    
    // 집계된 통계 로깅
    logger.info({
      message: 'API 성능 통계',
      context: {
        stats: Object.entries(endpointStats).map(([endpoint, stats]) => ({
          endpoint,
          avgDuration: Math.round(stats.totalDuration / stats.count),
          errorRate: stats.count > 0 ? (stats.errorCount / stats.count) : 0,
          requestCount: stats.count,
          maxDuration: stats.maxDuration
        }))
      },
      tags: { module: 'metrics', action: 'apiStats' }
    });
    
    // 여기서 메트릭을 데이터베이스, 시계열 DB 또는 모니터링 서비스로 전송 가능
    // (구현은 생략)
    
    // 성공 응답
    return NextResponse.json(
      { 
        success: true,
        processed: batch.metrics.length 
      },
      { status: 202 } // Accepted
    );
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '메트릭 배치 처리 중 오류 발생',
      error: error as Error,
      tags: { module: 'metrics', action: 'batchError' }
    });
    
    // 오류 응답
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 