/**
 * 사용자 행동 이벤트 추적 API 엔드포인트
 * analytics.ts의 trackEvent 함수에서 전송된 이벤트를 처리합니다.
 */
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
import logger from '../../lib/logger';
import { EventType } from '../../lib/analytics';
// Edge 런타임 설정
export var runtime = 'edge';
/**
 * 이벤트 추적 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var event_1, userAgent, referer, ip, anonymizedIp, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    event_1 = _b.sent();
                    // 기본 검증
                    if (!event_1 || !event_1.type || !event_1.action) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid event data' }, { status: 400 })];
                    }
                    userAgent = req.headers.get('user-agent') || '';
                    referer = req.headers.get('referer') || '';
                    ip = req.headers.get('x-forwarded-for') ||
                        req.headers.get('x-real-ip') ||
                        '0.0.0.0';
                    anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0';
                    // 이벤트 로깅
                    logger.info({
                        message: '사용자 이벤트 추적',
                        context: {
                            eventType: event_1.type,
                            action: event_1.action,
                            path: event_1.path,
                            timestamp: event_1.timestamp,
                            properties: event_1.properties,
                            // 기본 메타데이터
                            userAgent: userAgent,
                            referer: referer,
                            anonymizedIp: anonymizedIp
                        },
                        tags: {
                            module: 'analytics',
                            action: 'trackEvent',
                            eventType: event_1.type
                        }
                    });
                    // 특정 이벤트 유형에 따른 추가 처리
                    switch (event_1.type) {
                        case EventType.CONVERSION:
                            // 전환 이벤트는 중요하므로 별도 처리
                            logger.info({
                                message: '전환 이벤트 발생',
                                context: {
                                    action: event_1.action,
                                    properties: event_1.properties
                                },
                                tags: { module: 'analytics', action: 'conversion' }
                            });
                            // 여기서 데이터베이스에 전환 이벤트 저장 또는 기타 서비스에 알림 가능
                            break;
                        case EventType.SEARCH:
                            // 검색 이벤트 분석
                            if ((_a = event_1.properties) === null || _a === void 0 ? void 0 : _a.query) {
                                // 검색어 로깅 (개인정보 보호를 위해 필요시 익명화)
                                logger.info({
                                    message: '검색 이벤트',
                                    context: {
                                        query: event_1.properties.query,
                                        resultCount: event_1.properties.resultCount
                                    },
                                    tags: { module: 'analytics', action: 'search' }
                                });
                            }
                            break;
                    }
                    // 여기서 이벤트를 데이터베이스나 분석 서비스로 전송 가능
                    // (구현은 생략)
                    // 성공 응답
                    return [2 /*return*/, NextResponse.json({ success: true }, { status: 202 } // Accepted
                        )];
                case 2:
                    error_1 = _b.sent();
                    // 오류 로깅
                    logger.error({
                        message: '이벤트 추적 처리 중 오류 발생',
                        error: error_1,
                        tags: { module: 'analytics', action: 'trackError' }
                    });
                    // 오류 응답
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
