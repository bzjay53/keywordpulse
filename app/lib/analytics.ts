import logger from './logger';
import { createClient } from './supabaseClient';

// 사용자 행동 이벤트 유형
export enum EventType {
  PAGE_VIEW = 'page_view',
  FEATURE_USAGE = 'feature_usage',
  BUTTON_CLICK = 'button_click',
  FORM_SUBMIT = 'form_submit',
  SEARCH = 'search',
  ERROR = 'error',
  TIMING = 'timing',
  FEEDBACK = 'feedback'
}

// 이벤트 세부 정보 인터페이스
export interface EventData {
  eventType: EventType;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  path?: string;
  referrer?: string;
  duration?: number;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
}

// 세션 식별자 생성
const generateSessionId = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

// 현재 세션 ID 관리
let currentSessionId = '';

// 세션 ID 획득
const getSessionId = (): string => {
  if (!currentSessionId) {
    // 브라우저 환경에서는 sessionStorage에서 ID 가져오기 시도
    if (typeof window !== 'undefined' && window.sessionStorage) {
      currentSessionId = window.sessionStorage.getItem('kp_session_id') || '';
      
      if (!currentSessionId) {
        currentSessionId = generateSessionId();
        window.sessionStorage.setItem('kp_session_id', currentSessionId);
      }
    } else {
      // 브라우저 환경이 아닌 경우 새 세션 ID 생성
      currentSessionId = generateSessionId();
    }
  }
  
  return currentSessionId;
};

// 이벤트 로깅
export async function logEvent(data: EventData): Promise<void> {
  try {
    // 세션 ID 및 타임스탬프 추가
    const enrichedData = {
      ...data,
      sessionId: data.sessionId || getSessionId(),
      timestamp: data.timestamp || new Date().toISOString(),
      path: data.path || (typeof window !== 'undefined' ? window.location.pathname : undefined),
      referrer: data.referrer || (typeof window !== 'undefined' ? document.referrer : undefined)
    };
    
    // 로그 출력 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      logger.debug('사용자 행동 이벤트', enrichedData);
    }
    
    // Supabase에 이벤트 저장
    const supabase = createClient();
    const { error } = await supabase
      .from('user_events')
      .insert([enrichedData]);
    
    if (error) {
      logger.warn('이벤트 저장 중 오류 발생', { error, data: enrichedData });
    }
  } catch (error) {
    logger.error('이벤트 로깅 중 오류 발생', { error, data });
  }
}

// 편의 함수: 페이지 조회 이벤트
export function logPageView(path?: string, referrer?: string, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.PAGE_VIEW,
    path,
    referrer,
    metadata
  });
}

// 편의 함수: 버튼 클릭 이벤트
export function logButtonClick(buttonId: string, category?: string, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.BUTTON_CLICK,
    action: buttonId,
    category,
    metadata
  });
}

// 편의 함수: 기능 사용 이벤트
export function logFeatureUsage(featureName: string, action?: string, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.FEATURE_USAGE,
    category: featureName,
    action,
    metadata
  });
}

// 편의 함수: 검색 이벤트
export function logSearch(searchTerm: string, resultCount?: number, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.SEARCH,
    action: 'search',
    label: searchTerm,
    value: resultCount,
    metadata
  });
}

// 편의 함수: 에러 이벤트
export function logError(errorMessage: string, errorCode?: string, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.ERROR,
    action: errorCode || 'error',
    label: errorMessage,
    metadata
  });
}

// 편의 함수: 타이밍 이벤트
export function logTiming(category: string, variable: string, duration: number, metadata?: Record<string, any>): void {
  logEvent({
    eventType: EventType.TIMING,
    category,
    action: variable,
    duration,
    metadata
  });
}

// 타이밍 측정 도우미
export function measureTiming(category: string, variable: string, callback: () => Promise<any>, metadata?: Record<string, any>): Promise<any> {
  const startTime = performance.now();
  
  return callback().finally(() => {
    const duration = performance.now() - startTime;
    logTiming(category, variable, duration, metadata);
  });
}

// 전체 화면 머무른 시간 측정 (비동기)
export function trackTimeOnPage(): () => void {
  const startTime = performance.now();
  let intervalId: NodeJS.Timeout | null = null;
  let isTracking = true;
  
  // 주기적으로 체류 시간 기록 (5분 간격)
  intervalId = setInterval(() => {
    if (isTracking) {
      const currentDuration = (performance.now() - startTime) / 1000; // 초 단위
      logTiming('page', 'time_on_page', currentDuration, {
        path: window.location.pathname
      });
    }
  }, 5 * 60 * 1000); // 5분
  
  // 페이지 언로드 시 최종 시간 기록
  const recordFinalTime = () => {
    if (isTracking) {
      isTracking = false;
      if (intervalId) clearInterval(intervalId);
      
      const totalDuration = (performance.now() - startTime) / 1000; // 초 단위
      logTiming('page', 'total_time_on_page', totalDuration, {
        path: window.location.pathname
      });
    }
  };
  
  // 브라우저 환경인 경우 이벤트 리스너 등록
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', recordFinalTime);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        recordFinalTime();
      }
    });
  }
  
  // 정리 함수 반환
  return () => {
    isTracking = false;
    if (intervalId) clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', recordFinalTime);
    }
  };
}

// 기본 내보내기
export default {
  logEvent,
  logPageView,
  logButtonClick,
  logFeatureUsage,
  logSearch,
  logError,
  logTiming,
  measureTiming,
  trackTimeOnPage,
  EventType
}; 