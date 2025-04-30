/**
 * 애플리케이션 로깅 시스템
 */

export interface LogParams {
  message: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  context?: Record<string, any>;
  user?: { id?: string; email?: string };
  tags?: Record<string, string>;
}

let isSentryInitialized = false;

// 프로덕션 환경에서 Sentry 초기화
function initSentry() {
  // Sentry 통합 여부 확인 (환경 변수 또는 전역 변수로 제어 가능)
  const enableSentry = typeof window !== 'undefined' && 
                      (window as any)?.__ENABLE_SENTRY__ || 
                      process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true';
  
  if (enableSentry && !isSentryInitialized) {
    try {
      // Note: 여기서는 실제 Sentry 초기화를 하지 않습니다.
      // 실제 구현에서는 Sentry를 초기화하는 코드가 들어갑니다.
      isSentryInitialized = true;
    } catch (error) {
      console.error('Sentry 초기화 실패:', error);
    }
  }
}

/**
 * 로그 메시지를 기록합니다.
 * @param params 로그 매개변수
 */
function log(params: LogParams): void {
  const { message, level = 'info', context, user, tags } = params;
  
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     level === 'debug' ? console.debug : 
                     console.log;
    
    logMethod(`[${level.toUpperCase()}] ${message}`, {
      context,
      user,
      tags,
      timestamp: new Date().toISOString()
    });
  }
  
  // 프로덕션 환경에서는 Sentry 또는 다른 로깅 서비스로 전송 가능
  if (process.env.NODE_ENV === 'production') {
    // Sentry 초기화
    initSentry();
    
    // 여기에 프로덕션 로깅 로직을 구현
    // 예: Sentry 이벤트 전송, 서버 로그 API 호출 등
  }
}

/**
 * 오류를 기록합니다.
 * @param params 오류 로그 매개변수
 */
function error(params: LogParams & { error?: Error }): void {
  const { message, error: err, context, user, tags } = params;
  
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, {
      error: err,
      stack: err?.stack,
      context,
      user,
      tags,
      timestamp: new Date().toISOString()
    });
  }
  
  // 프로덕션 환경에서는 Sentry로 전송
  if (process.env.NODE_ENV === 'production') {
    // Sentry 초기화
    initSentry();
    
    // 여기에 프로덕션 오류 로깅 로직을 구현
    // 예: Sentry captureException 호출
  }
}

/**
 * 성능 측정을 위한 트랜잭션을 시작합니다.
 * @param name 트랜잭션 이름
 * @param op 작업 타입
 * @returns 트랜잭션 객체
 */
function startTransaction(name: string, op: string): any {
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TRANSACTION] 시작: ${name} (${op})`);
    
    // 간단한 트랜잭션 객체 반환
    return {
      finish: () => {
        console.log(`[TRANSACTION] 종료: ${name} (${op})`);
      },
      setTag: (key: string, value: string) => {
        console.log(`[TRANSACTION] 태그 설정: ${key}=${value}`);
      }
    };
  }
  
  // 프로덕션 환경에서는 Sentry 트랜잭션 반환
  if (process.env.NODE_ENV === 'production') {
    // Sentry 초기화
    initSentry();
    
    // 간단한 더미 객체 반환 (실제 구현에서는 Sentry 트랜잭션 반환)
    return {
      finish: () => {},
      setTag: (key: string, value: string) => {}
    };
  }
  
  // 기본 더미 객체 반환
  return {
    finish: () => {},
    setTag: (key: string, value: string) => {}
  };
}

/**
 * 사용자 정보를 설정합니다.
 * @param user 사용자 정보
 */
function setUser(user: { id?: string; email?: string }): void {
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`[USER] 사용자 설정:`, user);
  }
  
  // 프로덕션 환경에서는 Sentry 사용자 설정
  if (process.env.NODE_ENV === 'production') {
    // Sentry 초기화
    initSentry();
    
    // 여기에 프로덕션 사용자 설정 로직을 구현
    // 예: Sentry setUser 호출
  }
}

// 로거 객체 내보내기
const logger = {
  log,
  error,
  startTransaction,
  setUser
};

export default logger; 