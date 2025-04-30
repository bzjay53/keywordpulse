/**
 * API 성능 모니터링 유틸리티
 * API 요청의 성능을 측정하고 기록하는 함수들을 제공
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import logger from './logger';
// 메트릭 저장소 (메모리 캐시)
var metricsStore = [];
var MAX_CACHE_SIZE = 100; // 최대 캐시 크기
var flushTimeout = null;
/**
 * 성능 메트릭을 측정하며 함수를 실행하는 고차 함수
 * @param name 메트릭 이름
 * @param fn 실행할 함수
 * @param metadata 추가 메타데이터
 * @returns 함수 실행 결과
 */
export function withMetrics(name, fn, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, result, duration, error_1, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    result = _a.sent();
                    duration = Date.now() - startTime;
                    logMetric(name, duration, true, metadata);
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _a.sent();
                    duration = Date.now() - startTime;
                    logMetric("".concat(name, "_error"), duration, false, __assign(__assign({}, metadata), { errorMessage: error_1.message }));
                    // 오류는 상위로 전파
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 메트릭 로깅 함수
 * @param name 메트릭 이름
 * @param duration 지속 시간 (ms)
 * @param success 성공 여부
 * @param metadata 추가 메타데이터
 */
export function logMetric(name, duration, success, metadata) {
    if (success === void 0) { success = true; }
    try {
        // 메트릭 엔트리 생성 및 저장
        var entry = {
            name: name,
            duration: duration,
            timestamp: Date.now(),
            success: success,
            metadata: metadata
        };
        metricsStore.push(entry);
        // 개발 환경에서 로깅 (디버그용)
        if (process.env.NODE_ENV === 'development') {
            console.log("[Metric] ".concat(name, ": ").concat(duration, "ms (").concat(success ? 'success' : 'failed', ")"));
        }
        // 로깅 (높은 값만 상세 로깅)
        if (duration > 1000) { // 1초 이상 걸린 요청만 warning 로그
            logger.warn({
                message: '느린 API 요청',
                context: {
                    name: name,
                    duration: duration,
                    success: success,
                    metadata: metadata
                },
                tags: { module: 'apiMetrics', action: 'slowRequest' }
            });
        }
        // 메트릭 캐시가 임계값에 도달하면 비동기로 플러시
        if (metricsStore.length >= MAX_CACHE_SIZE) {
            flushMetricsAsync();
        }
        else if (!flushTimeout) {
            // 주기적 플러시 스케줄링 (30초마다)
            flushTimeout = setTimeout(function () {
                flushMetricsAsync();
                flushTimeout = null;
            }, 30000);
        }
    }
    catch (error) {
        logger.error({
            message: '메트릭 로깅 오류',
            error: error,
            context: { name: name, duration: duration },
            tags: { module: 'apiMetrics', action: 'logMetric' }
        });
    }
}
/**
 * 메트릭을 서버로 전송하는 함수
 */
function flushMetricsAsync() {
    return __awaiter(this, void 0, void 0, function () {
        var metricsToSend_1;
        return __generator(this, function (_a) {
            if (metricsStore.length === 0)
                return [2 /*return*/];
            try {
                metricsToSend_1 = __spreadArray([], metricsStore, true);
                metricsStore.length = 0;
                // 서버리스 환경을 고려하여 비동기로 전송
                fetch('/api/metrics/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        metrics: metricsToSend_1,
                        source: 'api',
                        timestamp: Date.now()
                    }),
                    keepalive: true
                }).catch(function (error) {
                    logger.error({
                        message: '메트릭 전송 오류',
                        error: error,
                        context: { batchSize: metricsToSend_1.length },
                        tags: { module: 'apiMetrics', action: 'flushMetrics' }
                    });
                    // 전송 실패 시 중요 메트릭만 다시 저장 (낮은 우선순위 메트릭은 버림)
                    var importantMetrics = metricsToSend_1.filter(function (m) { return !m.success || m.duration > 1000 || m.name.includes('critical'); });
                    if (importantMetrics.length > 0) {
                        metricsStore.push.apply(metricsStore, importantMetrics);
                    }
                });
            }
            catch (error) {
                logger.error({
                    message: '메트릭 플러시 오류',
                    error: error,
                    context: { storageSize: metricsStore.length },
                    tags: { module: 'apiMetrics', action: 'flushMetricsAsync' }
                });
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 즉시 모든 메트릭을 서버로 전송
 * (페이지 언로드 전 등에 사용)
 */
export function flushMetricsNow() {
    if (flushTimeout) {
        clearTimeout(flushTimeout);
        flushTimeout = null;
    }
    flushMetricsAsync();
}
/**
 * 페이지 언로드 이벤트 리스너 등록 (클라이언트 전용)
 */
export function setupBeforeUnloadFlush() {
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', function () {
            flushMetricsNow();
        });
    }
}
export default {
    withMetrics: withMetrics,
    logMetric: logMetric,
    flushMetricsNow: flushMetricsNow,
    setupBeforeUnloadFlush: setupBeforeUnloadFlush
};
