import * as Sentry from '@sentry/nextjs';

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
    
    // Sentry로 이벤트 전송 (info 레벨 이상)
    if (level !== 'debug') {
      const sentryLevel = level === 'warn' ? 'warning' : level;
      
      Sentry.withScope((scope) => {
        if (context) scope.setExtras(context);
        if (user) scope.setUser(user);
        if (tags) Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));
        
        Sentry.captureMessage(message, sentryLevel as Sentry.SeverityLevel);
      });
    }
  },
  
  /**
   * 에러 로깅
   */
  error({ message, error, context, user, tags }: LogParams): void {
    // 콘솔 에러 로깅
    console.error(message, error, context);
    
    // Sentry로 예외 전송
    Sentry.withScope((scope) => {
      if (context) scope.setExtras(context);
      if (user) scope.setUser(user);
      if (tags) Object.entries(tags).forEach(([key, value]) => scope.setTag(key, value));
      
      if (error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(message, 'error');
      }
    });
  },
  
  /**
   * 성능 모니터링 트랜잭션 시작
   */
  startTransaction(name: string, op: string): Sentry.Transaction | undefined {
    return Sentry.startTransaction({
      name,
      op,
    });
  },
  
  /**
   * 사용자 정보 설정
   */
  setUser(user: { id?: string; email?: string; }): void {
    Sentry.setUser(user);
  }
};

export default logger; 