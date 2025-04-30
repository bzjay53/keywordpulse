'use client';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * API 에러 클래스
 * API 엔드포인트에서 발생하는 오류를 표준화하기 위한 클래스입니다.
 */
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    /**
     * API 에러 생성자
     *
     * @param statusCode HTTP 상태 코드
     * @param message 에러 메시지
     */
    function ApiError(statusCode, message) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.name = 'ApiError';
        // Error 객체 프로토타입 체인 설정 (TypeScript에서 instanceof를 올바르게 작동시키기 위함)
        Object.setPrototypeOf(_this, ApiError.prototype);
        return _this;
    }
    /**
     * API 에러 응답 객체를 생성합니다.
     *
     * @returns 에러 응답 객체
     */
    ApiError.prototype.toResponse = function () {
        return {
            success: false,
            message: this.message,
            statusCode: this.statusCode
        };
    };
    return ApiError;
}(Error));
export { ApiError };
/**
 * 인증 에러 클래스
 * 인증 문제로 인한 오류를 처리하기 위한 클래스입니다.
 */
var AuthError = /** @class */ (function (_super) {
    __extends(AuthError, _super);
    function AuthError(message) {
        if (message === void 0) { message = '인증이 필요합니다'; }
        var _this = _super.call(this, 401, message) || this;
        _this.name = 'AuthError';
        // Error 객체 프로토타입 체인 설정
        Object.setPrototypeOf(_this, AuthError.prototype);
        return _this;
    }
    return AuthError;
}(ApiError));
export { AuthError };
/**
 * 권한 에러 클래스
 * 권한 부족으로 인한 오류를 처리하기 위한 클래스입니다.
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        if (message === void 0) { message = '이 작업을 수행할 권한이 없습니다'; }
        var _this = _super.call(this, 403, message) || this;
        _this.name = 'ForbiddenError';
        // Error 객체 프로토타입 체인 설정
        Object.setPrototypeOf(_this, ForbiddenError.prototype);
        return _this;
    }
    return ForbiddenError;
}(ApiError));
export { ForbiddenError };
/**
 * 엔티티 찾을 수 없음 에러 클래스
 * 요청한 리소스를 찾을 수 없는 오류를 처리하기 위한 클래스입니다.
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(entity) {
        if (entity === void 0) { entity = '리소스'; }
        var _this = _super.call(this, 404, "\uC694\uCCAD\uD55C ".concat(entity, "\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4")) || this;
        _this.name = 'NotFoundError';
        // Error 객체 프로토타입 체인 설정
        Object.setPrototypeOf(_this, NotFoundError.prototype);
        return _this;
    }
    return NotFoundError;
}(ApiError));
export { NotFoundError };
/**
 * 유효성 검사 에러 클래스
 * 입력 데이터의 유효성 검사 실패를 처리하기 위한 클래스입니다.
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    /**
     * 유효성 검사 에러 생성자
     *
     * @param message 에러 메시지
     * @param errors 필드별 에러 메시지
     */
    function ValidationError(message, errors) {
        if (message === void 0) { message = '유효하지 않은 입력 데이터'; }
        var _this = _super.call(this, 400, message) || this;
        _this.name = 'ValidationError';
        _this.errors = errors;
        // Error 객체 프로토타입 체인 설정
        Object.setPrototypeOf(_this, ValidationError.prototype);
        return _this;
    }
    /**
     * API 에러 응답 객체를 생성합니다.
     *
     * @returns 에러 응답 객체
     */
    ValidationError.prototype.toResponse = function () {
        return {
            success: false,
            message: this.message,
            statusCode: this.statusCode,
            errors: this.errors
        };
    };
    return ValidationError;
}(ApiError));
export { ValidationError };
