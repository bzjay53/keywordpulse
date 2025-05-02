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
import { sendMessageToMultipleChats, formatErrorMessage } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';
/**
 * 여러 채팅 ID로 텔레그램 메시지를 보내는 API 엔드포인트
 *
 * 요청 형식:
 * {
 *   "token": "텔레그램 봇 토큰",
 *   "chat_ids": ["채팅ID1", "채팅ID2", ...],
 *   "message": "전송할 메시지"
 * }
 *
 * 응답 형식:
 * {
 *   "success": true/false,
 *   "data": {
 *     "results": { "채팅ID1": {...}, "채팅ID2": {...} },
 *     "errors": { "채팅ID3": "오류 메시지" },
 *     "summary": { "total": 3, "success": 2, "failed": 1 }
 *   }
 * }
 */
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var body, token, chat_ids, message, messageText, result, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    body = _a.sent();
                    token = body.token, chat_ids = body.chat_ids, message = body.message;
                    // 필수 파라미터 검증
                    if (!token) {
                        throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
                    }
                    if (!chat_ids || !Array.isArray(chat_ids) || chat_ids.length === 0) {
                        throw new ApiError(400, '최소 하나 이상의 유효한 채팅 ID가 필요합니다.');
                    }
                    messageText = message || '이것은 KeywordPulse에서 보낸 테스트 메시지입니다.';
                    return [4 /*yield*/, sendMessageToMultipleChats(token, chat_ids, messageText, {
                            parse_mode: 'HTML',
                            disable_notification: false,
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            data: result
                        })];
                case 3:
                    error_1 = _a.sent();
                    console.error('텔레그램 다중 메시지 전송 오류:', error_1);
                    // 텔레그램 API 오류 처리
                    if (error_1 instanceof ApiError) {
                        return [2 /*return*/, NextResponse.json({ success: false, error: error_1.message }, { status: error_1.statusCode })];
                    }
                    errorMessage = error_1 instanceof Error
                        ? formatErrorMessage(error_1.message)
                        : '알 수 없는 오류가 발생했습니다.';
                    return [2 /*return*/, NextResponse.json({ success: false, error: errorMessage }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
