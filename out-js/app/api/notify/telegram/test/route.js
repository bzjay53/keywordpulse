var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { NextResponse } from 'next/server';
import { sendTelegramMessage, formatErrorMessage, handleTelegramErrorCode, validateTelegramConfig } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';
// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';
/**
 * 텔레그램 설정 테스트 API 엔드포인트
 * POST 요청으로 토큰, 채팅 ID를 받아 테스트 메시지를 전송합니다.
 * 선택적으로 커스텀 테스트 메시지를 받아 전송할 수 있습니다.
 *
 * @param request - 요청 객체
 * @returns NextResponse 객체
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, token, chat_id, message, testMessage, configValidation, result, error_1, status_1, errorMessage, errorCodeMatch, errorCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _a.sent();
                    token = body.token, chat_id = body.chat_id, message = body.message;
                    // 필수 매개변수 검증
                    if (!token) {
                        throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
                    }
                    if (!chat_id) {
                        throw new ApiError(400, '텔레그램 채팅 ID가 필요합니다.');
                    }
                    testMessage = message || "KeywordPulse에서 보낸 테스트 메시지입니다. 설정이 올바르게 작동합니다!";
                    return [4 /*yield*/, validateTelegramConfig(token, chat_id)];
                case 2:
                    configValidation = _a.sent();
                    if (!configValidation.valid) {
                        throw new ApiError(400, configValidation.message);
                    }
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chat_id,
                            text: testMessage,
                            parse_mode: 'HTML',
                            disable_web_page_preview: false
                        })];
                case 3:
                    result = _a.sent();
                    console.log('텔레그램 테스트 메시지 전송 성공:', result);
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            message: '텔레그램 테스트 메시지가 성공적으로 전송되었습니다.',
                            data: result
                        })];
                case 4:
                    error_1 = _a.sent();
                    console.error('텔레그램 테스트 메시지 전송 중 오류:', error_1);
                    status_1 = 500;
                    errorMessage = '텔레그램 테스트 메시지 전송 중 오류가 발생했습니다.';
                    // API 에러인 경우
                    if (error_1 instanceof ApiError) {
                        status_1 = error_1.statusCode;
                        errorMessage = error_1.message;
                    }
                    // 텔레그램 API 에러인 경우
                    else if (error_1.message && error_1.message.includes('텔레그램 API 오류')) {
                        status_1 = 400;
                        errorCodeMatch = error_1.message.match(/\((\d+)\)$/);
                        if (errorCodeMatch && errorCodeMatch[1]) {
                            errorCode = parseInt(errorCodeMatch[1]);
                            errorMessage = handleTelegramErrorCode(errorCode);
                        }
                        else {
                            errorMessage = formatErrorMessage(error_1);
                        }
                    }
                    else {
                        errorMessage = formatErrorMessage(error_1);
                    }
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            message: errorMessage,
                            error: process.env.NODE_ENV === 'development' ? error_1.toString() : undefined
                        }, { status: status_1 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
