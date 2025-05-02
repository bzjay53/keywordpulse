/**
 * Telegram 기능 관련 예외 및 오류 처리 모듈
 */

/**
 * Telegram 관련 작업 중 발생하는 기본 예외 클래스
 */
export class TelegramException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelegramException';
  }
}

/**
 * Telegram 인증 토큰 관련 예외
 */
export class TelegramTokenException extends TelegramException {
  constructor(message = 'Telegram 봇 토큰이 유효하지 않거나 제공되지 않았습니다') {
    super(message);
    this.name = 'TelegramTokenException';
  }
}

/**
 * Telegram 메시지 전송 실패 예외
 */
export class TelegramSendException extends TelegramException {
  response?: any;
  
  constructor(message: string, response?: any) {
    super(message);
    this.name = 'TelegramSendException';
    this.response = response;
  }
}

/**
 * Telegram API 요청 제한 초과 예외
 */
export class TelegramRateLimitException extends TelegramException {
  retryAfter?: number;
  
  constructor(message = 'Telegram API 요청 한도를 초과했습니다', retryAfter?: number) {
    super(message);
    this.name = 'TelegramRateLimitException';
    this.retryAfter = retryAfter;
  }
}

/**
 * Telegram 채팅 ID 관련 예외
 */
export class TelegramChatIdException extends TelegramException {
  constructor(message = '유효하지 않은 Telegram 채팅 ID입니다') {
    super(message);
    this.name = 'TelegramChatIdException';
  }
}

/**
 * API 요청 중 발생한 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * 예외를 사용자 친화적인 메시지로 변환합니다.
 * @param exception 예외 객체
 * @returns 사용자 친화적인 오류 메시지
 */
export function formatTelegramError(exception: unknown): string {
  if (exception instanceof TelegramTokenException) {
    return '텔레그램 봇 설정 오류가 발생했습니다. 관리자에게 문의하세요.';
  } else if (exception instanceof TelegramSendException) {
    return '메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } else if (exception instanceof TelegramRateLimitException) {
    const waitTime = exception.retryAfter ? `${exception.retryAfter}초 후` : '잠시 후';
    return `너무 많은 요청이 있었습니다. ${waitTime} 다시 시도해 주세요.`;
  } else if (exception instanceof TelegramChatIdException) {
    return '알림을 받을 대상이 올바르게 설정되지 않았습니다. 관리자에게 문의하세요.';
  } else if (exception instanceof TelegramException) {
    return '텔레그램 알림 서비스에 오류가 발생했습니다.';
  } else if (exception instanceof ApiError) {
    return `API 오류가 발생했습니다: ${exception.message}`;
  } else if (exception instanceof Error) {
    return `오류가 발생했습니다: ${exception.message}`;
  } else {
    return '알 수 없는 오류가 발생했습니다.';
  }
} 