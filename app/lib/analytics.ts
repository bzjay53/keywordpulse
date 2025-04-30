/**
 * 웹 성능 및 사용자 분석 모듈
 * 웹 바이탈 및 사용자 행동을 측정하고 분석 서비스에 전송하는 유틸리티 함수들 제공
 */

import { onCLS, onFID, onLCP, onTTFB, onFCP, Metric } from 'web-vitals';
import logger from './logger';

// 성능 메트릭 타입
export type PerformanceMetric = {
  name: string;
  value: number;
  id: string;
  delta: number;
  page: string;
  timestamp: number;
};

/**
 * 웹 바이탈 측정 및 보고 함수
 * Next.js의 reportWebVitals과 함께 사용가능
 */
export function reportWebVitals(): void {
  try {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onFCP(sendToAnalytics);
  } catch (error) {
    logger.error({
      message: '웹 바이탈 설정 오류',
      error: error as Error,
      tags: { module: 'analytics' }
    });
  }
}

/**
 * 측정된 성능 데이터를 분석 서비스에 전송
 * @param metric 웹 바이탈 측정 데이터
 */
function sendToAnalytics(metric: Metric): void {
  // 개발 환경에서는 콘솔에 출력 (선택적)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name} = ${metric.value}`);
  }

  try {
    const body: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    // 메트릭 데이터를 서버로 전송
    // 에지 함수 사용으로 대기하지 않음 (fire and forget)
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      // 중요: 에러가 발생해도 사용자 경험에 영향을 주지 않도록 처리
      keepalive: true,
      mode: 'no-cors'
    }).catch((error) => {
      // 네트워크 오류는 조용히 처리 (UX에 영향 주지 않음)
      console.error('Failed to send metrics:', error);
    });

    // Vercel Analytics가 설정된 경우 해당 서비스로도 전송
    if (typeof (window as any).va === 'function') {
      (window as any).va('event', {
        name: `web-vital-${metric.name.toLowerCase()}`,
        value: Math.round(metric.value),
        page: window.location.pathname
      });
    }
  } catch (error) {
    logger.error({
      message: '성능 메트릭 전송 오류',
      error: error as Error,
      tags: { module: 'analytics', action: 'sendToAnalytics' }
    });
  }
}

/**
 * 사용자 이벤트 추적 타입
 */
export enum EventType {
  PAGE_VIEW = 'page_view',
  SEARCH = 'search',
  ANALYZE = 'analyze',
  AUTH = 'auth',
  CONTENT = 'content',
  CONVERSION = 'conversion'
}

/**
 * 사용자 이벤트 추적 함수
 * @param type 이벤트 유형
 * @param action 이벤트 액션
 * @param properties 추가 속성
 */
export function trackEvent(
  type: EventType,
  action: string,
  properties: Record<string, any> = {}
): void {
  try {
    // Google Analytics 전송 (설정된 경우)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: type,
        ...properties
      });
    }

    // Vercel Analytics 전송 (설정된 경우)
    if (typeof (window as any).va === 'function') {
      (window as any).va('event', {
        name: action,
        category: type,
        ...properties
      });
    }

    // 자체 분석 서버로 전송
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        action,
        properties,
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      }),
      keepalive: true
    }).catch((err) => {
      console.error('Event tracking failed:', err);
    });
  } catch (error) {
    logger.error({
      message: '이벤트 추적 오류',
      error: error as Error,
      context: { type, action, properties },
      tags: { module: 'analytics', action: 'trackEvent' }
    });
  }
}

/**
 * 페이지 조회 이벤트 추적 함수
 * @param path 페이지 경로
 * @param title 페이지 제목
 */
export function trackPageView(path: string = '', title: string = ''): void {
  try {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');

    trackEvent(EventType.PAGE_VIEW, 'page_view', {
      path: currentPath,
      title: pageTitle,
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    });
  } catch (error) {
    logger.error({
      message: '페이지 뷰 추적 오류',
      error: error as Error,
      context: { path, title },
      tags: { module: 'analytics', action: 'trackPageView' }
    });
  }
}

export default {
  reportWebVitals,
  trackEvent,
  trackPageView,
  EventType
}; 