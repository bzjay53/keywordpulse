/**
 * API 메트릭 일괄 처리 엔드포인트
 * apiMetrics에서 전송된 성능 데이터를 처리합니다.
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
import logger from '@/lib/logger';
// Edge 런타임 설정
export var runtime = 'edge';
/**
 * API 메트릭 일괄 처리 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var batch, criticalMetrics, endpointStats, _i, _a, metric, endpoint, stats, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    batch = _b.sent();
                    // 기본 검증
                    if (!batch || !Array.isArray(batch.metrics) || batch.metrics.length === 0) {
                        return [2 /*return*/, NextResponse.json({ error: 'Invalid metrics batch data' }, { status: 400 })];
                    }
                    // 메트릭 수 로깅
                    logger.info({
                        message: 'API 메트릭 배치 수신',
                        context: {
                            count: batch.metrics.length,
                            source: batch.source,
                            timestamp: batch.timestamp
                        },
                        tags: { module: 'metrics', action: 'batchCollect', source: batch.source }
                    });
                    criticalMetrics = batch.metrics.filter(function (metric) { return !metric.success || metric.duration > 1000; });
                    // 중요 메트릭이 있으면 별도 로깅
                    if (criticalMetrics.length > 0) {
                        logger.warn({
                            message: '중요 API 메트릭 감지',
                            context: {
                                criticalCount: criticalMetrics.length,
                                metrics: criticalMetrics.map(function (m) { return ({
                                    name: m.name,
                                    duration: m.duration,
                                    success: m.success
                                }); })
                            },
                            tags: { module: 'metrics', action: 'criticalMetrics', source: batch.source }
                        });
                        // 여기서 특정 임계값 기반으로 알림 로직 추가 가능
                    }
                    endpointStats = {};
                    for (_i = 0, _a = batch.metrics; _i < _a.length; _i++) {
                        metric = _a[_i];
                        endpoint = metric.name.replace('api_', '').replace(/_/g, '/');
                        if (!endpointStats[endpoint]) {
                            endpointStats[endpoint] = {
                                count: 0,
                                totalDuration: 0,
                                errorCount: 0,
                                maxDuration: 0
                            };
                        }
                        stats = endpointStats[endpoint];
                        stats.count++;
                        stats.totalDuration += metric.duration;
                        if (!metric.success)
                            stats.errorCount++;
                        stats.maxDuration = Math.max(stats.maxDuration, metric.duration);
                    }
                    // 집계된 통계 로깅
                    logger.info({
                        message: 'API 성능 통계',
                        context: {
                            stats: Object.entries(endpointStats).map(function (_a) {
                                var endpoint = _a[0], stats = _a[1];
                                return ({
                                    endpoint: endpoint,
                                    avgDuration: Math.round(stats.totalDuration / stats.count),
                                    errorRate: stats.count > 0 ? (stats.errorCount / stats.count) : 0,
                                    requestCount: stats.count,
                                    maxDuration: stats.maxDuration
                                });
                            })
                        },
                        tags: { module: 'metrics', action: 'apiStats' }
                    });
                    // 여기서 메트릭을 데이터베이스, 시계열 DB 또는 모니터링 서비스로 전송 가능
                    // (구현은 생략)
                    // 성공 응답
                    return [2 /*return*/, NextResponse.json({
                            success: true,
                            processed: batch.metrics.length
                        }, { status: 202 } // Accepted
                        )];
                case 2:
                    error_1 = _b.sent();
                    // 오류 로깅
                    logger.error({
                        message: '메트릭 배치 처리 중 오류 발생',
                        error: error_1,
                        tags: { module: 'metrics', action: 'batchError' }
                    });
                    // 오류 응답
                    return [2 /*return*/, NextResponse.json({ error: 'Internal server error' }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
