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
import logger from './logger';
import { createClient } from './supabaseClient';
// 사용자 행동 이벤트 유형
export var EventType;
(function (EventType) {
    EventType["PAGE_VIEW"] = "page_view";
    EventType["FEATURE_USAGE"] = "feature_usage";
    EventType["BUTTON_CLICK"] = "button_click";
    EventType["FORM_SUBMIT"] = "form_submit";
    EventType["SEARCH"] = "search";
    EventType["ERROR"] = "error";
    EventType["TIMING"] = "timing";
    EventType["FEEDBACK"] = "feedback";
})(EventType || (EventType = {}));
// 세션 식별자 생성
var generateSessionId = function () {
    var timestamp = new Date().getTime().toString(36);
    var randomStr = Math.random().toString(36).substring(2, 10);
    return "".concat(timestamp, "-").concat(randomStr);
};
// 현재 세션 ID 관리
var currentSessionId = '';
// 세션 ID 획득
var getSessionId = function () {
    if (!currentSessionId) {
        // 브라우저 환경에서는 sessionStorage에서 ID 가져오기 시도
        if (typeof window !== 'undefined' && window.sessionStorage) {
            currentSessionId = window.sessionStorage.getItem('kp_session_id') || '';
            if (!currentSessionId) {
                currentSessionId = generateSessionId();
                window.sessionStorage.setItem('kp_session_id', currentSessionId);
            }
        }
        else {
            // 브라우저 환경이 아닌 경우 새 세션 ID 생성
            currentSessionId = generateSessionId();
        }
    }
    return currentSessionId;
};
// 이벤트 로깅
export function logEvent(data) {
    return __awaiter(this, void 0, void 0, function () {
        var enrichedData, supabase, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    enrichedData = __assign(__assign({}, data), { sessionId: data.sessionId || getSessionId(), timestamp: data.timestamp || new Date().toISOString(), path: data.path || (typeof window !== 'undefined' ? window.location.pathname : undefined), referrer: data.referrer || (typeof window !== 'undefined' ? document.referrer : undefined) });
                    // 로그 출력 (개발 환경에서만)
                    if (process.env.NODE_ENV === 'development') {
                        logger.debug('사용자 행동 이벤트', enrichedData);
                    }
                    supabase = createClient();
                    return [4 /*yield*/, supabase
                            .from('user_events')
                            .insert([enrichedData])];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        logger.warn('이벤트 저장 중 오류 발생', { error: error, data: enrichedData });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger.error('이벤트 로깅 중 오류 발생', { error: error_1, data: data });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 편의 함수: 페이지 조회 이벤트
export function logPageView(path, referrer, metadata) {
    logEvent({
        eventType: EventType.PAGE_VIEW,
        path: path,
        referrer: referrer,
        metadata: metadata
    });
}
// 편의 함수: 버튼 클릭 이벤트
export function logButtonClick(buttonId, category, metadata) {
    logEvent({
        eventType: EventType.BUTTON_CLICK,
        action: buttonId,
        category: category,
        metadata: metadata
    });
}
// 편의 함수: 기능 사용 이벤트
export function logFeatureUsage(featureName, action, metadata) {
    logEvent({
        eventType: EventType.FEATURE_USAGE,
        category: featureName,
        action: action,
        metadata: metadata
    });
}
// 편의 함수: 검색 이벤트
export function logSearch(searchTerm, resultCount, metadata) {
    logEvent({
        eventType: EventType.SEARCH,
        action: 'search',
        label: searchTerm,
        value: resultCount,
        metadata: metadata
    });
}
// 편의 함수: 에러 이벤트
export function logError(errorMessage, errorCode, metadata) {
    logEvent({
        eventType: EventType.ERROR,
        action: errorCode || 'error',
        label: errorMessage,
        metadata: metadata
    });
}
// 편의 함수: 타이밍 이벤트
export function logTiming(category, variable, duration, metadata) {
    logEvent({
        eventType: EventType.TIMING,
        category: category,
        action: variable,
        duration: duration,
        metadata: metadata
    });
}
// 타이밍 측정 도우미
export function measureTiming(category, variable, callback, metadata) {
    var startTime = performance.now();
    return callback().finally(function () {
        var duration = performance.now() - startTime;
        logTiming(category, variable, duration, metadata);
    });
}
// 전체 화면 머무른 시간 측정 (비동기)
export function trackTimeOnPage() {
    var startTime = performance.now();
    var intervalId = null;
    var isTracking = true;
    // 주기적으로 체류 시간 기록 (5분 간격)
    intervalId = setInterval(function () {
        if (isTracking) {
            var currentDuration = (performance.now() - startTime) / 1000; // 초 단위
            logTiming('page', 'time_on_page', currentDuration, {
                path: window.location.pathname
            });
        }
    }, 5 * 60 * 1000); // 5분
    // 페이지 언로드 시 최종 시간 기록
    var recordFinalTime = function () {
        if (isTracking) {
            isTracking = false;
            if (intervalId)
                clearInterval(intervalId);
            var totalDuration = (performance.now() - startTime) / 1000; // 초 단위
            logTiming('page', 'total_time_on_page', totalDuration, {
                path: window.location.pathname
            });
        }
    };
    // 브라우저 환경인 경우 이벤트 리스너 등록
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', recordFinalTime);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                recordFinalTime();
            }
        });
    }
    // 정리 함수 반환
    return function () {
        isTracking = false;
        if (intervalId)
            clearInterval(intervalId);
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', recordFinalTime);
        }
    };
}
// 기본 내보내기
export default {
    logEvent: logEvent,
    logPageView: logPageView,
    logButtonClick: logButtonClick,
    logFeatureUsage: logFeatureUsage,
    logSearch: logSearch,
    logError: logError,
    logTiming: logTiming,
    measureTiming: measureTiming,
    trackTimeOnPage: trackTimeOnPage,
    EventType: EventType
};
