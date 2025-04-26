/**
 * API 에러 클래스
 * API 엔드포인트에서 발생하는 오류를 표준화하기 위한 클래스입니다.
 */
export class ApiError extends Error {
  statusCode: number;
  
  /**
   * API 에러 생성자
   * 
   * @param statusCode HTTP 상태 코드
   * @param message 에러 메시지
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    
    // Error 객체 프로토타입 체인 설정 (TypeScript에서 instanceof를 올바르게 작동시키기 위함)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  /**
   * API 에러 응답 객체를 생성합니다.
   * 
   * @returns 에러 응답 객체
   */
  toResponse() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}

/**
 * 인증 에러 클래스
 * 인증 문제로 인한 오류를 처리하기 위한 클래스입니다.
 */
export class AuthError extends ApiError {
  constructor(message: string = '인증이 필요합니다') {
    super(401, message);
    this.name = 'AuthError';
    
    // Error 객체 프로토타입 체인 설정
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * 권한 에러 클래스
 * 권한 부족으로 인한 오류를 처리하기 위한 클래스입니다.
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = '이 작업을 수행할 권한이 없습니다') {
    super(403, message);
    this.name = 'ForbiddenError';
    
    // Error 객체 프로토타입 체인 설정
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 엔티티 찾을 수 없음 에러 클래스
 * 요청한 리소스를 찾을 수 없는 오류를 처리하기 위한 클래스입니다.
 */
export class NotFoundError extends ApiError {
  constructor(entity: string = '리소스') {
    super(404, `요청한 ${entity}를 찾을 수 없습니다`);
    this.name = 'NotFoundError';
    
    // Error 객체 프로토타입 체인 설정
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 유효성 검사 에러 클래스
 * 입력 데이터의 유효성 검사 실패를 처리하기 위한 클래스입니다.
 */
export class ValidationError extends ApiError {
  errors?: Record<string, string[]>;
  
  /**
   * 유효성 검사 에러 생성자
   * 
   * @param message 에러 메시지
   * @param errors 필드별 에러 메시지
   */
  constructor(message: string = '유효하지 않은 입력 데이터', errors?: Record<string, string[]>) {
    super(400, message);
    this.name = 'ValidationError';
    this.errors = errors;
    
    // Error 객체 프로토타입 체인 설정
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  
  /**
   * API 에러 응답 객체를 생성합니다.
   * 
   * @returns 에러 응답 객체
   */
  override toResponse() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors
    };
  }
} 