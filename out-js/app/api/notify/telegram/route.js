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
import { sendTelegramMessage, formatKeywordAnalysisMessage } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';
/**
 * 키워드 분석 결과를 텔레그램으로 전송하는 API 엔드포인트
 * POST: 단일 또는 다수의 키워드 분석 결과를 텔레그램으로 전송
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, chat_id, keyword_data, _b, template_type, keywordDataArray, results, _i, keywordDataArray_1, data, message, result, error_1, status_1, errorMessage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    _a = _c.sent(), token = _a.token, chat_id = _a.chat_id, keyword_data = _a.keyword_data, _b = _a.template_type, template_type = _b === void 0 ? 'full' : _b;
                    // 필수 파라미터 확인
                    if (!token) {
                        throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
                    }
                    if (!chat_id) {
                        throw new ApiError(400, '텔레그램 채팅 ID가 필요합니다.');
                    }
                    if (!keyword_data) {
                        throw new ApiError(400, '키워드 분석 데이터가 필요합니다.');
                    }
                    keywordDataArray = Array.isArray(keyword_data) ? keyword_data : [keyword_data];
                    results = [];
                    _i = 0, keywordDataArray_1 = keywordDataArray;
                    _c.label = 2;
                case 2:
                    if (!(_i < keywordDataArray_1.length)) return [3 /*break*/, 5];
                    data = keywordDataArray_1[_i];
                    // 키워드, 점수, 트렌드 정보가 있는지 확인
                    if (!data.keyword || data.score === undefined || !data.trend) {
                        console.warn('키워드, 점수 또는 트렌드 정보가 누락된 데이터를 건너뜁니다:', data);
                        return [3 /*break*/, 4];
                    }
                    message = formatKeywordAnalysisMessage({
                        keyword: data.keyword,
                        score: data.score,
                        trend: data.trend,
                        customMessage: data.customMessage
                    });
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chat_id,
                            text: message,
                            parse_mode: 'HTML'
                        })];
                case 3:
                    result = _c.sent();
                    results.push({
                        keyword: data.keyword,
                        result: result
                    });
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // 성공 응답
                return [2 /*return*/, NextResponse.json({
                        success: true,
                        message: "".concat(results.length, "\uAC1C\uC758 \uD0A4\uC6CC\uB4DC \uBD84\uC11D \uACB0\uACFC\uAC00 \uC131\uACF5\uC801\uC73C\uB85C \uC804\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4."),
                        results: results
                    })];
                case 6:
                    error_1 = _c.sent();
                    console.error('키워드 분석 결과 전송 중 오류 발생:', error_1);
                    status_1 = 500;
                    errorMessage = '분석 결과 전송 중 오류가 발생했습니다.';
                    if (error_1 instanceof ApiError) {
                        status_1 = error_1.status;
                        errorMessage = error_1.message;
                    }
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            message: errorMessage
                        }, { status: status_1 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
