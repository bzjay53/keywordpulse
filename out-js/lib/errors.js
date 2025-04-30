/**
 * 애플리케이션에서 사용하는 사용자 정의 오류 클래스 및 유틸리티
 */
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
 * API 요청 중 발생한 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(message, status) {
        if (status === void 0) { status = 500; }
        var _this = _super.call(this, message) || this;
        _this.name = 'APIError';
        _this.status = status;
        return _this;
    }
    return APIError;
}(Error));
export { APIError };
/**
 * 인증과 관련된 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
var AuthError = /** @class */ (function (_super) {
    __extends(AuthError, _super);
    function AuthError(message, status) {
        if (message === void 0) { message = '인증 오류가 발생했습니다'; }
        if (status === void 0) { status = 401; }
        var _this = _super.call(this, message) || this;
        _this.name = 'AuthError';
        _this.status = status;
        return _this;
    }
    return AuthError;
}(Error));
export { AuthError };
/**
 * 유효성 검사 오류를 표현하는 사용자 정의 오류 클래스입니다.
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, validationErrors) {
        if (message === void 0) { message = '유효성 검사 오류가 발생했습니다'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'ValidationError';
        _this.status = 400;
        _this.validationErrors = validationErrors;
        return _this;
    }
    return ValidationError;
}(Error));
export { ValidationError };
/**
 * 오류 객체를 일관된 형식의 응답 객체로 변환합니다.
 * @param error 오류 객체
 * @returns 응답 객체
 */
export function formatErrorResponse(error) {
    if (error instanceof APIError) {
        return {
            error: error.message,
            status: error.status
        };
    }
    else if (error instanceof AuthError) {
        return {
            error: error.message,
            status: error.status
        };
    }
    else if (error instanceof ValidationError) {
        return {
            error: error.message,
            status: error.status,
            validationErrors: error.validationErrors
        };
    }
    else if (error instanceof Error) {
        return {
            error: error.message,
            status: 500
        };
    }
    else {
        return {
            error: '알 수 없는 오류가 발생했습니다',
            status: 500
        };
    }
}
