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
import { sendTelegramMessage, formatRagResultForTelegram } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';
// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';
/**
 * RAG 기반 키워드 분석 결과를 텔레그램으로 전송하는 API
 * POST: 키워드 데이터와 사용자의 텔레그램 설정을 사용하여 상세 분석 결과를 전송합니다.
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, chat_id, keywords, _b, templateType, _c, maxKeywords, _d, scoreThreshold, validKeywords, ragMessage, result, error_1, status_1, errorMessage;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    _a = _e.sent(), token = _a.token, chat_id = _a.chat_id, keywords = _a.keywords, _b = _a.templateType, templateType = _b === void 0 ? 'detailed' : _b, _c = _a.maxKeywords, maxKeywords = _c === void 0 ? 5 : _c, _d = _a.scoreThreshold, scoreThreshold = _d === void 0 ? 60 : _d;
                    // 필수 파라미터 확인
                    if (!token) {
                        throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
                    }
                    if (!chat_id) {
                        throw new ApiError(400, '텔레그램 채팅 ID가 필요합니다.');
                    }
                    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
                        throw new ApiError(400, '분석할 키워드 데이터가 없습니다.');
                    }
                    validKeywords = keywords
                        .filter(function (k) {
                        return typeof k === 'object' &&
                            k !== null &&
                            typeof k.keyword === 'string' &&
                            typeof k.score === 'number';
                    })
                        .map(function (k) { return ({
                        keyword: k.keyword,
                        monthlySearches: k.monthlySearches || 0,
                        competitionRate: k.competitionRate || 0,
                        score: k.score
                    }); });
                    if (validKeywords.length === 0) {
                        throw new ApiError(400, '유효한 키워드 데이터가 없습니다.');
                    }
                    return [4 /*yield*/, formatRagResultForTelegram(validKeywords, {
                            templateType: templateType,
                            maxKeywords: maxKeywords,
                            scoreThreshold: scoreThreshold,
                            includeStats: true
                        })];
                case 2:
                    ragMessage = _e.sent();
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chat_id,
                            text: ragMessage,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true
                        })];
                case 3:
                    result = _e.sent();
                    // 성공 응답
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            message: 'RAG 분석 결과가 성공적으로 전송되었습니다.',
                            keywordCount: validKeywords.length,
                            templateType: templateType,
                            data: result
                        })];
                case 4:
                    error_1 = _e.sent();
                    console.error('RAG 분석 결과 전송 중 오류 발생:', error_1);
                    status_1 = 500;
                    errorMessage = '분석 결과 전송 중 오류가 발생했습니다.';
                    if (error_1 instanceof ApiError) {
                        status_1 = error_1.statusCode;
                        errorMessage = error_1.message;
                    }
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            message: errorMessage
                        }, { status: status_1 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
