/**
 * 애플리케이션에서 사용하는 사용자 정의 오류 클래스 및 유틸리티
 */

/**
 * API 요청 중 발생한 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
export class APIError extends Error {
  status: number;
  
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

// 이전 코드와의 호환성을 위한 별칭
export { APIError as ApiError };

/**
 * 인증과 관련된 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
export class AuthError extends Error {
  status: number;
  
  constructor(message = '인증 오류가 발생했습니다', status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * 유효성 검사 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
export class ValidationError extends Error {
  status: number;
  validationErrors?: Record<string, string>;
  
  constructor(message = '유효성 검사 오류가 발생했습니다', validationErrors?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.validationErrors = validationErrors;
  }
}

/**
 * 오류 객체를 일관된 형식의 응답 객체로 변환합니다.
 * @param error 오류 객체
 * @returns 응답 객체
 */
export function formatErrorResponse(error: unknown): {
  error: string;
  status: number;
  validationErrors?: Record<string, string>;
} {
  if (error instanceof APIError) {
    return {
      error: error.message,
      status: error.status
    };
  } else if (error instanceof AuthError) {
    return {
      error: error.message,
      status: error.status
    };
  } else if (error instanceof ValidationError) {
    return {
      error: error.message,
      status: error.status,
      validationErrors: error.validationErrors
    };
  } else if (error instanceof Error) {
    return {
      error: error.message,
      status: 500
    };
  } else {
    return {
      error: '알 수 없는 오류가 발생했습니다',
      status: 500
    };
  }
} 