/**
 * 트렌드 API 모듈
 * 키워드 트렌드, 관련 키워드, 인기 키워드 조회 기능을 제공합니다.
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
import logger from './logger';
/**
 * 특정 키워드와 관련된 키워드 목록을 가져옵니다.
 * @param keyword 검색할 키워드
 * @param count 가져올 관련 키워드 수
 * @param geo 지역 코드
 * @returns 관련 키워드 배열
 */
export function getRelatedKeywords(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, count, geo) {
        var dummyKeywords, baseKeywords, i;
        if (count === void 0) { count = 10; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_a) {
            try {
                // 실제 API 호출 대신 더미 데이터 생성
                logger.log({
                    message: '관련 키워드 검색',
                    context: { keyword: keyword, count: count, geo: geo }
                });
                dummyKeywords = [];
                baseKeywords = [
                    '마케팅', '전략', '분석', '트렌드', '콘텐츠',
                    '소셜미디어', 'SEO', '브랜딩', '광고', '성과'
                ];
                for (i = 0; i < Math.min(count, baseKeywords.length); i++) {
                    dummyKeywords.push({
                        keyword: "".concat(keyword, " ").concat(baseKeywords[i]),
                        score: 100 - i * 10,
                        volume: Math.floor(Math.random() * 1000) + 100
                    });
                }
                return [2 /*return*/, dummyKeywords];
            }
            catch (error) {
                logger.error({
                    message: '관련 키워드 검색 실패',
                    error: error,
                    context: { keyword: keyword, count: count, geo: geo }
                });
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 특정 키워드의 시간에 따른 검색 트렌드 데이터를 가져옵니다.
 * @param keyword 검색할 키워드
 * @param timeRange 시간 범위
 * @param geo 지역 코드
 * @returns 트렌드 데이터 배열
 */
export function getKeywordTrend(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, timeRange, geo) {
        var dataPoints, trendData, now, i, date, baseValue, variance, value;
        if (timeRange === void 0) { timeRange = 'month'; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_a) {
            try {
                // 실제 API 호출 대신 더미 데이터 생성
                logger.log({
                    message: '키워드 트렌드 검색',
                    context: { keyword: keyword, timeRange: timeRange, geo: geo }
                });
                dataPoints = 0;
                switch (timeRange) {
                    case 'day':
                        dataPoints = 24;
                        break;
                    case 'week':
                        dataPoints = 7;
                        break;
                    case 'month':
                        dataPoints = 30;
                        break;
                    case 'year':
                        dataPoints = 12;
                        break;
                }
                trendData = [];
                now = new Date();
                for (i = 0; i < dataPoints; i++) {
                    date = new Date(now);
                    // 기간에 따라 날짜 조정
                    if (timeRange === 'day') {
                        date.setHours(now.getHours() - i);
                    }
                    else if (timeRange === 'week') {
                        date.setDate(now.getDate() - i);
                    }
                    else if (timeRange === 'month') {
                        date.setDate(now.getDate() - i);
                    }
                    else if (timeRange === 'year') {
                        date.setMonth(now.getMonth() - i);
                    }
                    baseValue = 75;
                    variance = 25;
                    value = Math.floor(baseValue + (Math.random() * variance * 2 - variance));
                    trendData.push({
                        date: date.toISOString().split('T')[0],
                        value: value
                    });
                }
                return [2 /*return*/, trendData.reverse()];
            }
            catch (error) {
                logger.error({
                    message: '키워드 트렌드 검색 실패',
                    error: error,
                    context: { keyword: keyword, timeRange: timeRange, geo: geo }
                });
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 현재 인기 있는 트렌딩 키워드 목록을 가져옵니다.
 * @param category 키워드 카테고리
 * @param count 가져올 키워드 수
 * @param geo 지역 코드
 * @returns 인기 키워드 배열
 */
export function getTrendingKeywords() {
    return __awaiter(this, arguments, void 0, function (category, count, geo) {
        var trendingKeywords;
        if (category === void 0) { category = 'all'; }
        if (count === void 0) { count = 10; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_a) {
            try {
                // 실제 API 호출 대신 더미 데이터 생성
                logger.log({
                    message: '트렌딩 키워드 검색',
                    context: { category: category, count: count, geo: geo }
                });
                trendingKeywords = {
                    all: ['인공지능', '디지털 전환', '블록체인', '메타버스', '클라우드 컴퓨팅',
                        '사이버 보안', '온라인 쇼핑', '재택근무', '전기차', '친환경'],
                    business: ['스타트업', '투자', '디지털 마케팅', '비즈니스 모델', '원격 근무',
                        'ESG 경영', '디지털 전환', '코로나 이후 경제', '글로벌 공급망', '인재 채용'],
                    technology: ['인공지능', '머신러닝', '블록체인', '클라우드 컴퓨팅', '5G',
                        '사물인터넷', '가상현실', '증강현실', '양자 컴퓨팅', '엣지 컴퓨팅'],
                    entertainment: ['넷플릭스', '유튜브', '틱톡', '메타버스', '게임 스트리밍',
                        'NFT', '디지털 콘텐츠', 'OTT 서비스', '온라인 콘서트', '소셜 미디어'],
                    health: ['디지털 헬스케어', '원격 진료', '웨어러블 기기', '건강 앱', '멘탈 헬스',
                        '면역력 강화', '홈 트레이닝', '건강식품', '수면 케어', '스트레스 관리']
                };
                // 해당 카테고리의 키워드 반환 (요청한 수만큼)
                return [2 /*return*/, trendingKeywords[category].slice(0, count)];
            }
            catch (error) {
                logger.error({
                    message: '트렌딩 키워드 검색 실패',
                    error: error,
                    context: { category: category, count: count, geo: geo }
                });
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
