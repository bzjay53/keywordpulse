/**
 * 로깅 시스템
 * 
 * 정적 빌드와 호환되는 간단한 로깅 유틸리티
 * 환경에 따라 콘솔 또는 Sentry로 로그를 전송합니다.
 */

// 환경에 따라 Sentry를 조건부로 가져오기
let Sentry: any = null;
if (typeof window !== 'undefined') {
  try {
    // 클라이언트 사이드에서만 Sentry 로드 시도
    Sentry = require('@sentry/nextjs');
  } catch (e) {
    console.warn('Sentry 로드 실패:', e);
  }
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogParams {
  message: string;
  level?: LogLevel;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  error?: Error;
}

/**
 * 애플리케이션 로깅 유틸리티
 * Sentry 및 콘솔 로깅을 처리합니다.
 */
export const logger = {
  /**
   * 일반 정보 로깅
   */
  log({ message, level = 'info', context, user, tags }: LogParams): void {
    // 콘솔 로깅
    console[level](message, context);
    
    // Sentry로 이벤트 전송 (info 레벨 이상, Sentry가 로드된 경우에만)
    if (level !== 'debug' && Sentry) {
      const sentryLevel = level === 'warn' ? 'warning' : level;
      
      try {
        Sentry.withScope((scope: any) => {
          if (context) scope.setExtras(context);
          if (user) scope.setUser(user);
          if (tags) Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));
          
          Sentry.captureMessage(message, sentryLevel);
        });
      } catch (e) {
        console.error('Sentry 이벤트 캡처 실패:', e);
      }
    }
  },
  
  /**
   * 에러 로깅
   */
  error({ message, error, context, user, tags }: LogParams): void {
    // 콘솔 에러 로깅
    console.error(message, error, context);
    
    // Sentry로 예외 전송 (Sentry가 로드된 경우에만)
    if (Sentry) {
      try {
        Sentry.withScope((scope: any) => {
          if (context) scope.setExtras(context);
          if (user) scope.setUser(user);
          if (tags) Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));
          
          if (error) {
            Sentry.captureException(error);
          } else {
            Sentry.captureMessage(message, 'error');
          }
        });
      } catch (e) {
        console.error('Sentry 에러 캡처 실패:', e);
      }
    }
  },
  
  /**
   * 성능 모니터링 트랜잭션 시작
   */
  startTransaction(name: string, op: string): any | undefined {
    if (Sentry) {
      try {
        return Sentry.startTransaction({
          name,
          op,
        });
      } catch (e) {
        console.error('Sentry 트랜잭션 시작 실패:', e);
      }
    }
    return undefined;
  },
  
  /**
   * 사용자 정보 설정
   */
  setUser(user: { id?: string; email?: string; }): void {
    if (Sentry) {
      try {
        Sentry.setUser(user);
      } catch (e) {
        console.error('Sentry 사용자 설정 실패:', e);
      }
    }
  }
};

export default logger; 