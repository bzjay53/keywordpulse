/**
 * API 성능 모니터링 유틸리티
 * API 요청의 성능을 측정하고 기록하는 함수들을 제공
 */

import logger from './logger';

// 메트릭 저장소 타입 정의
type MetricEntry = {
  name: string;
  duration: number;
  timestamp: number;
  success: boolean;
  metadata?: Record<string, any>;
};

// 메트릭 저장소 (메모리 캐시)
const metricsStore: MetricEntry[] = [];
const MAX_CACHE_SIZE = 100; // 최대 캐시 크기
let flushTimeout: NodeJS.Timeout | null = null;

/**
 * 성능 메트릭을 측정하며 함수를 실행하는 고차 함수
 * @param name 메트릭 이름
 * @param fn 실행할 함수
 * @param metadata 추가 메타데이터
 * @returns 함수 실행 결과
 */
export async function withMetrics<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    // 함수 실행
    const result = await fn();
    
    // 성공 메트릭 기록
    const duration = Date.now() - startTime;
    logMetric(name, duration, true, metadata);
    
    return result;
  } catch (error) {
    // 실패 메트릭 기록
    const duration = Date.now() - startTime;
    logMetric(`${name}_error`, duration, false, {
      ...metadata,
      errorMessage: (error as Error).message
    });
    
    // 오류는 상위로 전파
    throw error;
  }
}

/**
 * 메트릭 로깅 함수
 * @param name 메트릭 이름
 * @param duration 지속 시간 (ms)
 * @param success 성공 여부
 * @param metadata 추가 메타데이터
 */
export function logMetric(
  name: string,
  duration: number,
  success: boolean = true,
  metadata?: Record<string, any>
): void {
  try {
    // 메트릭 엔트리 생성 및 저장
    const entry: MetricEntry = {
      name,
      duration,
      timestamp: Date.now(),
      success,
      metadata
    };
    
    metricsStore.push(entry);
    
    // 개발 환경에서 로깅 (디버그용)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Metric] ${name}: ${duration}ms (${success ? 'success' : 'failed'})`);
    }
    
    // 로깅 (높은 값만 상세 로깅)
    if (duration > 1000) { // 1초 이상 걸린 요청만 warning 로그
      logger.warn({
        message: '느린 API 요청',
        context: {
          name,
          duration,
          success,
          metadata
        },
        tags: { module: 'apiMetrics', action: 'slowRequest' }
      });
    }
    
    // 메트릭 캐시가 임계값에 도달하면 비동기로 플러시
    if (metricsStore.length >= MAX_CACHE_SIZE) {
      flushMetricsAsync();
    } else if (!flushTimeout) {
      // 주기적 플러시 스케줄링 (30초마다)
      flushTimeout = setTimeout(() => {
        flushMetricsAsync();
        flushTimeout = null;
      }, 30000);
    }
  } catch (error) {
    logger.error({
      message: '메트릭 로깅 오류',
      error: error as Error,
      context: { name, duration },
      tags: { module: 'apiMetrics', action: 'logMetric' }
    });
  }
}

/**
 * 메트릭을 서버로 전송하는 함수
 */
async function flushMetricsAsync(): Promise<void> {
  if (metricsStore.length === 0) return;
  
  try {
    // 저장된 메트릭 복사 후 초기화
    const metricsToSend = [...metricsStore];
    metricsStore.length = 0;
    
    // 서버리스 환경을 고려하여 비동기로 전송
    fetch('/api/metrics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics: metricsToSend,
        source: 'api',
        timestamp: Date.now()
      }),
      keepalive: true
    }).catch((error) => {
      logger.error({
        message: '메트릭 전송 오류',
        error,
        context: { batchSize: metricsToSend.length },
        tags: { module: 'apiMetrics', action: 'flushMetrics' }
      });
      
      // 전송 실패 시 중요 메트릭만 다시 저장 (낮은 우선순위 메트릭은 버림)
      const importantMetrics = metricsToSend.filter(
        m => !m.success || m.duration > 1000 || m.name.includes('critical')
      );
      
      if (importantMetrics.length > 0) {
        metricsStore.push(...importantMetrics);
      }
    });
  } catch (error) {
    logger.error({
      message: '메트릭 플러시 오류',
      error: error as Error,
      context: { storageSize: metricsStore.length },
      tags: { module: 'apiMetrics', action: 'flushMetricsAsync' }
    });
  }
}

/**
 * 즉시 모든 메트릭을 서버로 전송
 * (페이지 언로드 전 등에 사용)
 */
export function flushMetricsNow(): void {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  
  flushMetricsAsync();
}

/**
 * 페이지 언로드 이벤트 리스너 등록 (클라이언트 전용)
 */
export function setupBeforeUnloadFlush(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      flushMetricsNow();
    });
  }
}

export default {
  withMetrics,
  logMetric,
  flushMetricsNow,
  setupBeforeUnloadFlush
}; 