var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { validateTelegramChatId } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';
/**
 * POST /api/notify/telegram/validate
 *
 * 텔레그램 채팅 ID의 유효성을 검증하는 API 엔드포인트
 *
 * @param {Object} request - 요청 객체
 * @param {string} request.token - 텔레그램 봇 토큰
 * @param {string} request.chat_id - 검증할 텔레그램 채팅 ID
 *
 * @returns {Object} 유효성 검증 결과
 * @throws {Error} 필수 매개변수 누락 시 오류 발생
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, chat_id, validationResult, error_1, status_1, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), token = _a.token, chat_id = _a.chat_id;
                    // 필수 매개변수 검증
                    if (!token) {
                        throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
                    }
                    if (!chat_id) {
                        throw new ApiError(400, '유효성을 검사할 텔레그램 채팅 ID가 필요합니다.');
                    }
                    return [4 /*yield*/, validateTelegramChatId(token, chat_id)];
                case 2:
                    validationResult = _b.sent();
                    return [2 /*return*/, NextResponse.json(__assign({ success: true }, validationResult))];
                case 3:
                    error_1 = _b.sent();
                    console.error('텔레그램 채팅 ID 유효성 검사 중 오류 발생:', error_1);
                    status_1 = 500;
                    errorMessage = '텔레그램 채팅 ID 유효성 검사 중 오류가 발생했습니다.';
                    if (error_1 instanceof ApiError) {
                        status_1 = error_1.status;
                        errorMessage = error_1.message;
                    }
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            message: errorMessage
                        }, { status: status_1 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
