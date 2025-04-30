import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import analytics, { EventType } from '@/lib/analytics';

/**
 * 페이지 및 구성요소에서 분석 이벤트를 캡처하기 위한 React 훅
 */
export function useAnalytics() {
  const router = useRouter();
  
  // 페이지 조회 이벤트 캡처
  useEffect(() => {
    // 페이지 로드 시 이벤트 기록
    const logInitialPageView = () => {
      analytics.logPageView();
    };
    
    // 라우트 변경 시 이벤트 기록
    const handleRouteChange = (url: string) => {
      analytics.logPageView(url);
    };
    
    // 페이지 체류 시간 추적 (컴포넌트가 언마운트될 때 정리됨)
    const stopTracking = analytics.trackTimeOnPage();
    
    // 초기 페이지 조회 기록
    logInitialPageView();
    
    // 라우트 변경 이벤트 구독
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // 정리 함수
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      stopTracking();
    };
  }, [router]);
  
  // 클릭 이벤트 캡처 함수
  const trackClick = useCallback((elementId: string, category?: string, metadata?: Record<string, any>) => {
    analytics.logButtonClick(elementId, category, metadata);
  }, []);
  
  // 기능 사용 이벤트 캡처 함수
  const trackFeature = useCallback((featureName: string, action?: string, metadata?: Record<string, any>) => {
    analytics.logFeatureUsage(featureName, action, metadata);
  }, []);
  
  // 검색 이벤트 캡처 함수
  const trackSearch = useCallback((searchTerm: string, resultCount?: number, metadata?: Record<string, any>) => {
    analytics.logSearch(searchTerm, resultCount, metadata);
  }, []);
  
  // 사용자 작업 시간 측정 함수
  const measureTask = useCallback(<T>(category: string, taskName: string, task: () => Promise<T>, metadata?: Record<string, any>): Promise<T> => {
    return analytics.measureTiming(category, taskName, task, metadata);
  }, []);
  
  // 에러 이벤트 캡처 함수
  const trackError = useCallback((errorMessage: string, errorCode?: string, metadata?: Record<string, any>) => {
    analytics.logError(errorMessage, errorCode, metadata);
  }, []);
  
  // 일반 이벤트 캡처 함수
  const trackEvent = useCallback((eventType: EventType, data: Record<string, any>) => {
    analytics.logEvent({
      eventType,
      ...data
    });
  }, []);
  
  // 피드백 이벤트 캡처 함수
  const trackFeedback = useCallback((rating: number, feedback: string, metadata?: Record<string, any>) => {
    analytics.logEvent({
      eventType: EventType.FEEDBACK,
      value: rating,
      label: feedback,
      metadata
    });
  }, []);
  
  return {
    trackClick,
    trackFeature,
    trackSearch,
    measureTask,
    trackError,
    trackEvent,
    trackFeedback
  };
} 