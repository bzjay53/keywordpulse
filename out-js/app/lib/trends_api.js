/**
 * 트렌드 API 모듈
 * 키워드 트렌드, 관련 키워드, 인기 키워드 조회 기능을 제공합니다.
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
import logger from './logger';
/**
 * 트렌드 타임프레임 옵션을 가져옵니다
 * @returns 사용 가능한 타임프레임 목록
 */
export function getTimeframeOptions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // 실제 구현에서는 데이터베이스에서 가져오거나 API에서 가져옵니다
                return [2 /*return*/, [
                        { id: 'day', name: '일간', days: 1 },
                        { id: 'week', name: '주간', days: 7 },
                        { id: 'month', name: '월간', days: 30 },
                        { id: 'quarter', name: '분기', days: 90 },
                        { id: 'year', name: '연간', days: 365 },
                    ]];
            }
            catch (error) {
                logger.error({
                    message: '타임프레임 옵션을 가져오는 중 오류 발생',
                    error: error
                });
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 트렌드 카테고리 옵션을 가져옵니다
 * @returns 사용 가능한 카테고리 목록
 */
export function getCategoryOptions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // 실제 구현에서는 데이터베이스에서 가져오거나 API에서 가져옵니다
                return [2 /*return*/, [
                        'all',
                        'tech',
                        'business',
                        'health',
                        'entertainment',
                        'finance',
                        'education',
                    ]];
            }
            catch (error) {
                logger.error({
                    message: '카테고리 옵션을 가져오는 중 오류 발생',
                    error: error
                });
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 인기 트렌드 키워드를 가져옵니다
 * @param options 트렌드 검색 옵션
 * @returns 트렌드 키워드 목록과 메타데이터
 */
export function getTrendingKeywords() {
    return __awaiter(this, arguments, void 0, function (options) {
        var _a, limit, _b, offset, _c, category, _d, timeframe, _e, source, _f, includeHistory, keywords;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_g) {
            _a = options.limit, limit = _a === void 0 ? 10 : _a, _b = options.offset, offset = _b === void 0 ? 0 : _b, _c = options.category, category = _c === void 0 ? 'all' : _c, _d = options.timeframe, timeframe = _d === void 0 ? 'week' : _d, _e = options.source, source = _e === void 0 ? 'all' : _e, _f = options.includeHistory, includeHistory = _f === void 0 ? false : _f;
            try {
                logger.log({
                    message: '인기 트렌드 키워드 조회',
                    level: 'info',
                    context: { limit: limit, offset: offset, category: category, timeframe: timeframe, source: source }
                });
                keywords = [
                    { keyword: '인공지능', count: 1200, change: 15, rank: 1, category: 'tech' },
                    { keyword: '블록체인', count: 980, change: -5, rank: 2, category: 'tech' },
                    { keyword: '메타버스', count: 850, change: 30, rank: 3, category: 'tech' },
                    { keyword: '디지털 트랜스포메이션', count: 720, change: 12, rank: 4, category: 'business' },
                    { keyword: '사이버 보안', count: 650, change: 8, rank: 5, category: 'tech' },
                    { keyword: '원격 근무', count: 580, change: -2, rank: 6, category: 'business' },
                    { keyword: '빅데이터', count: 520, change: 5, rank: 7, category: 'tech' },
                    { keyword: '클라우드 컴퓨팅', count: 490, change: 10, rank: 8, category: 'tech' },
                    { keyword: '디지털 마케팅', count: 460, change: 7, rank: 9, category: 'business' },
                    { keyword: '사물인터넷', count: 430, change: -8, rank: 10, category: 'tech' },
                ];
                // 카테고리 필터링
                if (category !== 'all') {
                    keywords = keywords.filter(function (kw) { return kw.category === category; });
                }
                // 이력 데이터 추가 (요청된 경우)
                if (includeHistory) {
                    keywords = keywords.map(function (kw) { return (__assign(__assign({}, kw), { history: generateDummyHistory(timeframe) })); });
                }
                return [2 /*return*/, {
                        keywords: keywords.slice(offset, offset + limit),
                        total: keywords.length,
                        timeframe: timeframe,
                        category: category !== 'all' ? category : undefined,
                        updated: new Date().toISOString()
                    }];
            }
            catch (error) {
                logger.error({
                    message: '트렌드 키워드를 가져오는 중 오류 발생',
                    error: error,
                    context: { options: options }
                });
                throw new Error("\uD2B8\uB80C\uB4DC \uD0A4\uC6CC\uB4DC \uC870\uD68C \uC2E4\uD328: ".concat(error.message));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 특정 키워드의 트렌드 상세 정보를 가져옵니다
 * @param keyword 조회할 키워드
 * @param timeframe 시간 범위
 * @returns 키워드 트렌드 상세 정보
 */
export function getKeywordTrend(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, timeframe) {
        var dummyTrends;
        if (timeframe === void 0) { timeframe = 'week'; }
        return __generator(this, function (_a) {
            try {
                logger.log({
                    message: "\uD0A4\uC6CC\uB4DC \uD2B8\uB80C\uB4DC \uC0C1\uC138 \uC870\uD68C: ".concat(keyword),
                    level: 'info',
                    context: { keyword: keyword, timeframe: timeframe }
                });
                dummyTrends = {
                    '인공지능': {
                        keyword: '인공지능',
                        count: 1200,
                        change: 15,
                        rank: 1,
                        category: 'tech',
                        history: generateDummyHistory(timeframe)
                    },
                    '블록체인': {
                        keyword: '블록체인',
                        count: 980,
                        change: -5,
                        rank: 2,
                        category: 'tech',
                        history: generateDummyHistory(timeframe)
                    },
                };
                // 키워드가 있으면 반환, 없으면 null 반환
                return [2 /*return*/, dummyTrends[keyword] || null];
            }
            catch (error) {
                logger.error({
                    message: "\uD0A4\uC6CC\uB4DC \uD2B8\uB80C\uB4DC \uC0C1\uC138 \uC870\uD68C \uC911 \uC624\uB958: ".concat(keyword),
                    error: error,
                    context: { keyword: keyword, timeframe: timeframe }
                });
                throw new Error("\uD0A4\uC6CC\uB4DC \uD2B8\uB80C\uB4DC \uC0C1\uC138 \uC870\uD68C \uC2E4\uD328: ".concat(error.message));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 관련 키워드를 검색합니다
 * @param keyword 검색 키워드
 * @param limit 결과 제한 수
 * @returns 관련 키워드 목록
 */
export function getRelatedKeywords(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, limit) {
        var relatedKeywords;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            try {
                logger.log({
                    message: "\uAD00\uB828 \uD0A4\uC6CC\uB4DC \uAC80\uC0C9: ".concat(keyword),
                    level: 'info',
                    context: { keyword: keyword, limit: limit }
                });
                relatedKeywords = [
                    { keyword: "".concat(keyword, " \uCD94\uCC9C"), count: 580, change: 12 },
                    { keyword: "".concat(keyword, " \uC0AC\uC6A9\uBC95"), count: 450, change: 8 },
                    { keyword: "".concat(keyword, " \uD504\uB85C\uADF8\uB7A8"), count: 370, change: -3 },
                    { keyword: "".concat(keyword, " \uBB34\uB8CC"), count: 320, change: 5 },
                    { keyword: "".concat(keyword, " \uCD5C\uC2E0"), count: 290, change: 15 },
                    { keyword: "".concat(keyword, " \uAC00\uACA9"), count: 250, change: 7 },
                    { keyword: "".concat(keyword, " \uC124\uCE58"), count: 230, change: -2 },
                    { keyword: "".concat(keyword, " \uBE44\uAD50"), count: 210, change: 4 },
                    { keyword: "".concat(keyword, " \uD6C4\uAE30"), count: 190, change: 10 },
                    { keyword: "".concat(keyword, " \uB300\uC548"), count: 170, change: 6 },
                ];
                return [2 /*return*/, relatedKeywords.slice(0, limit)];
            }
            catch (error) {
                logger.error({
                    message: "\uAD00\uB828 \uD0A4\uC6CC\uB4DC \uAC80\uC0C9 \uC911 \uC624\uB958: ".concat(keyword),
                    error: error,
                    context: { keyword: keyword, limit: limit }
                });
                throw new Error("\uAD00\uB828 \uD0A4\uC6CC\uB4DC \uAC80\uC0C9 \uC2E4\uD328: ".concat(error.message));
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 특정 시간 범위에 대한 더미 이력 데이터를 생성합니다
 * @param timeframe 시간 범위
 * @returns 이력 데이터 포인트 배열
 */
function generateDummyHistory(timeframe) {
    var days = 7; // 기본값은 주간
    // 시간 범위에 따라 일수 결정
    switch (timeframe) {
        case 'day':
            days = 1;
            break;
        case 'week':
            days = 7;
            break;
        case 'month':
            days = 30;
            break;
        case 'quarter':
            days = 90;
            break;
        case 'year':
            days = 365;
            break;
    }
    // 더미 이력 데이터 생성
    var history = [];
    var today = new Date();
    for (var i = days - 1; i >= 0; i--) {
        var date = new Date(today);
        date.setDate(today.getDate() - i);
        history.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
            value: Math.floor(Math.random() * 1000) + 100 // 100~1100 사이의 랜덤값
        });
    }
    return history;
}
export default {
    getTrendingKeywords: getTrendingKeywords,
    getKeywordTrend: getKeywordTrend,
    getRelatedKeywords: getRelatedKeywords,
    getTimeframeOptions: getTimeframeOptions,
    getCategoryOptions: getCategoryOptions
};
