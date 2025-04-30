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
import { getTrendingKeywords } from '@/lib/trends_api';
import logger from '@/lib/logger';
// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';
// 엣지 런타임 사용 설정 추가
export var runtime = "edge";
/**
 * 트렌딩 키워드 API 엔드포인트
 * GET: 인기 트렌딩 키워드를 가져옵니다.
 *
 * 쿼리 파라미터:
 * - category: 키워드 카테고리 (all, business, technology, entertainment, health)
 * - count: 반환할 키워드 수
 * - geo: 지역 코드 (KR, US 등)
 */
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, category, count, geo, validCategories, keywords, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    searchParams = request.nextUrl.searchParams;
                    category = searchParams.get('category') || 'all';
                    count = parseInt(searchParams.get('count') || '10', 10);
                    geo = searchParams.get('geo') || 'KR';
                    validCategories = ['all', 'business', 'technology', 'entertainment', 'health'];
                    if (!validCategories.includes(category)) {
                        return [2 /*return*/, NextResponse.json({
                                error: '유효하지 않은 카테고리입니다.',
                                validCategories: validCategories
                            }, { status: 400 })];
                    }
                    if (isNaN(count) || count < 1 || count > 50) {
                        return [2 /*return*/, NextResponse.json({
                                error: '키워드 수는 1-50 사이의 정수여야 합니다.'
                            }, { status: 400 })];
                    }
                    // 로깅: API 요청
                    logger.log({
                        message: '트렌딩 키워드 요청',
                        context: {
                            category: category,
                            count: count,
                            geo: geo
                        },
                        tags: { endpoint: '/api/trending', method: 'GET' }
                    });
                    return [4 /*yield*/, getTrendingKeywords(category, count, geo)];
                case 1:
                    keywords = _a.sent();
                    // 로깅: API 응답
                    logger.log({
                        message: '트렌딩 키워드 응답',
                        context: {
                            keywordsCount: keywords.length,
                            category: category
                        },
                        tags: { endpoint: '/api/trending', method: 'GET' }
                    });
                    // 응답 반환
                    return [2 /*return*/, NextResponse.json({
                            keywords: keywords,
                            metadata: {
                                category: category,
                                count: keywords.length,
                                geo: geo,
                                timestamp: new Date().toISOString()
                            }
                        })];
                case 2:
                    error_1 = _a.sent();
                    // 오류 로깅
                    logger.error({
                        message: '트렌딩 키워드 요청 실패',
                        error: error_1,
                        tags: { endpoint: '/api/trending', method: 'GET' }
                    });
                    // 오류 응답
                    return [2 /*return*/, NextResponse.json({
                            error: '트렌딩 키워드 조회 중 오류가 발생했습니다.'
                        }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
