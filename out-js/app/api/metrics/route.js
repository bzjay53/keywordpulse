/**
 * 웹 바이탈 메트릭 수집 API 엔드포인트
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
// Edge 런타임 설정 (정적 내보내기 호환)
export var runtime = 'edge';
/**
 * 웹 바이탈 메트릭 처리 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var metric, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    metric = _a.sent();
                    // 기본 검증
                    if (!metric || !metric.name) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid metric data' }, { status: 400 })];
                    }
                    // 로깅
                    logger.log({
                        message: '웹 바이탈 메트릭 수신',
                        context: {
                            metric: {
                                name: metric.name,
                                value: metric.value,
                                page: metric.page,
                                timestamp: metric.timestamp || Date.now()
                            }
                        },
                        level: 'info',
                        tags: { module: 'metrics', action: 'collect', source: 'web-vitals' }
                    });
                    // 메트릭 기록 (Sentry 성능 모니터링, 데이터베이스 또는 분석 서비스 등으로 전송 가능)
                    // 이 예제에서는 로깅만 수행
                    // 필요한 경우 알림 트리거 (예: 임계값 초과 시)
                    if (metric.name === 'LCP' && metric.value > 2500) {
                        logger.warn({
                            message: 'LCP 성능 저하 감지',
                            context: {
                                value: metric.value,
                                page: metric.page,
                                threshold: 2500
                            },
                            tags: { module: 'metrics', action: 'alert', metric: 'LCP' }
                        });
                        // 여기서 알림 서비스 호출 가능
                    }
                    // 성공 응답
                    return [2 /*return*/, NextResponse.json({ success: true }, { status: 202 } // Accepted
                        )];
                case 2:
                    error_1 = _a.sent();
                    // 오류 로깅
                    logger.error({
                        message: '메트릭 처리 중 오류 발생',
                        error: error_1,
                        tags: { module: 'metrics', action: 'error' }
                    });
                    // 오류 응답
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
