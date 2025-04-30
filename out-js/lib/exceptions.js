/**
 * Telegram 기능 관련 예외 및 오류 처리 모듈
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
 * Telegram 관련 작업 중 발생하는 기본 예외 클래스
 */
var TelegramException = /** @class */ (function (_super) {
    __extends(TelegramException, _super);
    function TelegramException(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'TelegramException';
        return _this;
    }
    return TelegramException;
}(Error));
export { TelegramException };
/**
 * Telegram 인증 토큰 관련 예외
 */
var TelegramTokenException = /** @class */ (function (_super) {
    __extends(TelegramTokenException, _super);
    function TelegramTokenException(message) {
        if (message === void 0) { message = 'Telegram 봇 토큰이 유효하지 않거나 제공되지 않았습니다'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'TelegramTokenException';
        return _this;
    }
    return TelegramTokenException;
}(TelegramException));
export { TelegramTokenException };
/**
 * Telegram 메시지 전송 실패 예외
 */
var TelegramSendException = /** @class */ (function (_super) {
    __extends(TelegramSendException, _super);
    function TelegramSendException(message, response) {
        var _this = _super.call(this, message) || this;
        _this.name = 'TelegramSendException';
        _this.response = response;
        return _this;
    }
    return TelegramSendException;
}(TelegramException));
export { TelegramSendException };
/**
 * Telegram API 요청 제한 초과 예외
 */
var TelegramRateLimitException = /** @class */ (function (_super) {
    __extends(TelegramRateLimitException, _super);
    function TelegramRateLimitException(message, retryAfter) {
        if (message === void 0) { message = 'Telegram API 요청 한도를 초과했습니다'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'TelegramRateLimitException';
        _this.retryAfter = retryAfter;
        return _this;
    }
    return TelegramRateLimitException;
}(TelegramException));
export { TelegramRateLimitException };
/**
 * Telegram 채팅 ID 관련 예외
 */
var TelegramChatIdException = /** @class */ (function (_super) {
    __extends(TelegramChatIdException, _super);
    function TelegramChatIdException(message) {
        if (message === void 0) { message = '유효하지 않은 Telegram 채팅 ID입니다'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'TelegramChatIdException';
        return _this;
    }
    return TelegramChatIdException;
}(TelegramException));
export { TelegramChatIdException };
/**
 * 예외를 사용자 친화적인 메시지로 변환합니다.
 * @param exception 예외 객체
 * @returns 사용자 친화적인 오류 메시지
 */
export function formatTelegramError(exception) {
    if (exception instanceof TelegramTokenException) {
        return '텔레그램 봇 설정 오류가 발생했습니다. 관리자에게 문의하세요.';
    }
    else if (exception instanceof TelegramSendException) {
        return '메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    else if (exception instanceof TelegramRateLimitException) {
        var waitTime = exception.retryAfter ? "".concat(exception.retryAfter, "\uCD08 \uD6C4") : '잠시 후';
        return "\uB108\uBB34 \uB9CE\uC740 \uC694\uCCAD\uC774 \uC788\uC5C8\uC2B5\uB2C8\uB2E4. ".concat(waitTime, " \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");
    }
    else if (exception instanceof TelegramChatIdException) {
        return '알림을 받을 대상이 올바르게 설정되지 않았습니다. 관리자에게 문의하세요.';
    }
    else if (exception instanceof TelegramException) {
        return '텔레그램 알림 서비스에 오류가 발생했습니다.';
    }
    else if (exception instanceof Error) {
        return "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4: ".concat(exception.message);
    }
    else {
        return '알 수 없는 오류가 발생했습니다.';
    }
}
