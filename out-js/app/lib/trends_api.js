/**
 * Google Trends API와 유사한 기능을 제공하는 모듈
 * 트렌드 키워드, 관련 키워드 및 검색 트렌드 데이터를 제공합니다.
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
// 결과 캐싱을 위한 객체
var trendCache = {};
// 캐시 유효시간 (밀리초): 1시간
var CACHE_TTL = 60 * 60 * 1000;
// 트렌드 카테고리 데이터
var TREND_CATEGORIES = {
    all: [
        { keyword: 'AI 생성 모델', count: 342, change: 45 },
        { keyword: '디지털 마케팅', count: 298, change: 20 },
        { keyword: 'MCP 블렌더', count: 286, change: 72 },
        { keyword: '콘텐츠 전략', count: 267, change: 15 },
        { keyword: 'SEO 최적화', count: 254, change: 5 },
        { keyword: '소셜 미디어 트렌드', count: 243, change: 25 },
        { keyword: '앱 개발', count: 231, change: 10 },
        { keyword: '데이터 분석', count: 219, change: 30 },
        { keyword: '온라인 쇼핑몰', count: 205, change: -5 },
        { keyword: '유튜브 알고리즘', count: 198, change: 35 },
    ],
    business: [
        { keyword: '디지털 트랜스포메이션', count: 287, change: 30 },
        { keyword: '원격 근무 도구', count: 265, change: 15 },
        { keyword: '스타트업 펀딩', count: 251, change: 45 },
        { keyword: '고객 경험', count: 236, change: 20 },
        { keyword: '비즈니스 자동화', count: 224, change: 25 },
        { keyword: '기업 ESG', count: 212, change: 50 },
        { keyword: '직원 웰빙', count: 195, change: 35 },
        { keyword: '전자상거래 전략', count: 183, change: 10 },
        { keyword: '마케팅 ROI', count: 176, change: 5 },
        { keyword: '중소기업 디지털화', count: 168, change: 15 },
    ],
    technology: [
        { keyword: '인공지능 윤리', count: 298, change: 55 },
        { keyword: '블록체인 활용', count: 267, change: 35 },
        { keyword: '클라우드 네이티브', count: 245, change: 20 },
        { keyword: '프롬프트 엔지니어링', count: 232, change: 80 },
        { keyword: '엣지 컴퓨팅', count: 213, change: 15 },
        { keyword: '제로 트러스트 보안', count: 201, change: 40 },
        { keyword: 'Web3 개발', count: 189, change: 10 },
        { keyword: '양자 컴퓨팅', count: 178, change: 30 },
        { keyword: '사이버 보안 트렌드', count: 166, change: 5 },
        { keyword: '5G 활용 사례', count: 154, change: -10 },
    ],
    entertainment: [
        { keyword: '신규 넷플릭스 시리즈', count: 298, change: 40 },
        { keyword: '인기 웹툰', count: 267, change: 25 },
        { keyword: '디즈니플러스 영화', count: 245, change: 15 },
        { keyword: '인디 게임 추천', count: 231, change: 60 },
        { keyword: '연말 콘서트', count: 222, change: 85 },
        { keyword: '핫한 유튜버', count: 210, change: 30 },
        { keyword: '오디오북 추천', count: 195, change: 20 },
        { keyword: '전시회 일정', count: 183, change: 5 },
        { keyword: '새 앨범 발매', count: 176, change: 15 },
        { keyword: 'MBTI 테스트', count: 168, change: -10 },
    ],
    health: [
        { keyword: '겨울철 건강관리', count: 287, change: 45 },
        { keyword: '면역력 높이는 음식', count: 265, change: 30 },
        { keyword: '홈트레이닝 루틴', count: 246, change: 20 },
        { keyword: '건강한 수면습관', count: 232, change: 15 },
        { keyword: '비타민 추천', count: 218, change: 25 },
        { keyword: '근력운동 방법', count: 206, change: 10 },
        { keyword: '디지털 디톡스', count: 193, change: 60 },
        { keyword: '채식주의 식단', count: 187, change: 35 },
        { keyword: '목 스트레칭', count: 175, change: 5 },
        { keyword: '겨울 스포츠', count: 168, change: 40 },
    ],
};
// 관련 키워드 데이터
var RELATED_KEYWORDS_MAP = {
    'MCP 블렌더': [
        'MCP 블렌더 튜토리얼',
        'MCP 블렌더 다운로드',
        'Blender MCP 설치 방법',
        'MCP 블렌더 윈도우 11',
        'Claude AI 블렌더 연동',
        '블렌더 MCP 모델링',
        'MCP 3D 작품 갤러리',
        'MCP vs Midjourney',
        'AI 3D 모델링 도구',
        'MCP 블렌더 최적화'
    ],
    'AI 생성 모델': [
        'GPT-4 기능',
        'Stable Diffusion 최신 버전',
        'AI 이미지 생성',
        'DALL-E 3 특징',
        'Claude AI 사용법',
        'Midjourney 프롬프트',
        'AI 텍스트 생성',
        '오픈소스 AI 모델',
        'AI 음악 생성',
        'AI 동영상 생성'
    ],
    '디지털 마케팅': [
        'SEO 최적화 방법',
        '소셜 미디어 마케팅',
        '콘텐츠 마케팅 전략',
        '이메일 마케팅 툴',
        'PPC 광고 효과',
        'SNS 마케팅 트렌드',
        '인플루언서 마케팅 비용',
        '퍼포먼스 마케팅 성과',
        '디지털 마케팅 ROI',
        '마케팅 자동화 도구'
    ],
    '콘텐츠 전략': [
        '콘텐츠 전략 수립 방법',
        '콘텐츠 마케팅 전략',
        '콘텐츠 전략 사례',
        '콘텐츠 전략 프레임워크',
        '콘텐츠 유형별 전략',
        '콘텐츠 전략 KPI',
        '콘텐츠 캘린더 작성법',
        '타깃 고객 페르소나',
        '콘텐츠 전략 도구',
        '콘텐츠 SEO 최적화'
    ]
};
/**
 * 특정 카테고리의 인기 키워드를 가져옵니다.
 * @param category 키워드 카테고리
 * @param count 반환할 키워드 수
 * @param geo 지역 코드
 * @returns 트렌딩 키워드 배열
 */
export function getTrendingKeywords() {
    return __awaiter(this, arguments, void 0, function (category, count, geo) {
        var cacheKey, result;
        if (category === void 0) { category = 'all'; }
        if (count === void 0) { count = 10; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_a) {
            console.log("[trends_api] \uC778\uAE30 \uD0A4\uC6CC\uB4DC \uC694\uCCAD: \uCE74\uD14C\uACE0\uB9AC=".concat(category, ", \uAD6D\uAC00=").concat(geo, ", \uAC1C\uC218=").concat(count));
            cacheKey = "trending_".concat(category, "_").concat(geo, "_").concat(count);
            // 캐시에서 확인
            if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
                console.log("[trends_api] \uCE90\uC2DC\uB41C \uACB0\uACFC \uC0AC\uC6A9: ".concat(cacheKey));
                return [2 /*return*/, trendCache[cacheKey].data];
            }
            result = TREND_CATEGORIES[category].slice(0, count);
            // 결과 캐싱
            trendCache[cacheKey] = {
                data: result,
                timestamp: Date.now(),
                expiry: Date.now() + CACHE_TTL
            };
            return [2 /*return*/, result];
        });
    });
}
/**
 * 특정 키워드의 관련 검색어를 가져옵니다.
 * @param keyword 검색 키워드
 * @param count 반환할 관련 검색어 수
 * @param geo 지역 코드
 * @returns 관련 검색어 배열
 */
export function getRelatedKeywords(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, count, geo) {
        var cacheKey, normalizedKeyword, result, _i, _a, _b, key, values;
        if (count === void 0) { count = 10; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_c) {
            console.log("[trends_api] \uAD00\uB828 \uAC80\uC0C9\uC5B4 \uC694\uCCAD: \uD0A4\uC6CC\uB4DC=".concat(keyword, ", \uAD6D\uAC00=").concat(geo, ", \uAC1C\uC218=").concat(count));
            cacheKey = "related_".concat(keyword.toLowerCase(), "_").concat(geo, "_").concat(count);
            // 캐시에서 확인
            if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
                console.log("[trends_api] \uCE90\uC2DC\uB41C \uACB0\uACFC \uC0AC\uC6A9: ".concat(cacheKey));
                return [2 /*return*/, trendCache[cacheKey].data];
            }
            normalizedKeyword = keyword.toLowerCase();
            result = [];
            // 관련 검색어 찾기
            for (_i = 0, _a = Object.entries(RELATED_KEYWORDS_MAP); _i < _a.length; _i++) {
                _b = _a[_i], key = _b[0], values = _b[1];
                if (normalizedKeyword.includes(key.toLowerCase())) {
                    result = values.slice(0, count);
                    break;
                }
            }
            // 관련 검색어가 없는 경우, 입력 키워드를 기반으로 관련 검색어 생성
            if (result.length === 0) {
                result = [
                    "".concat(keyword, " \uC0AC\uC6A9\uBC95"),
                    "".concat(keyword, " \uB9AC\uBDF0"),
                    "".concat(keyword, " \uBE44\uAD50"),
                    "".concat(keyword, " \uAC00\uACA9"),
                    "".concat(keyword, " \uC7A5\uB2E8\uC810"),
                    "".concat(keyword, " \uCD94\uCC9C"),
                    "".concat(keyword, " \uCD08\uBCF4\uC790"),
                    "".concat(keyword, " \uCD5C\uC2E0"),
                    "".concat(keyword, " \uB300\uC548"),
                    "".concat(keyword, " \uD2B8\uB80C\uB4DC")
                ].slice(0, count);
            }
            // 결과 캐싱
            trendCache[cacheKey] = {
                data: result,
                timestamp: Date.now(),
                expiry: Date.now() + CACHE_TTL
            };
            return [2 /*return*/, result];
        });
    });
}
/**
 * 키워드의 시간에 따른 검색 트렌드를 가져옵니다.
 * @param keyword 검색 키워드
 * @param timeRange 시간 범위 (일/주/월/년)
 * @param geo 지역 코드
 * @returns 날짜별 트렌드 값 객체 배열
 */
export function getKeywordTrend(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, timeRange, geo) {
        var cacheKey, generateDates, dates, now_1, normalizedKeyword, values, result;
        if (timeRange === void 0) { timeRange = 'month'; }
        if (geo === void 0) { geo = 'KR'; }
        return __generator(this, function (_a) {
            console.log("[trends_api] \uD0A4\uC6CC\uB4DC \uD2B8\uB80C\uB4DC \uC694\uCCAD: \uD0A4\uC6CC\uB4DC=".concat(keyword, ", \uAE30\uAC04=").concat(timeRange, ", \uAD6D\uAC00=").concat(geo));
            cacheKey = "trend_".concat(keyword.toLowerCase(), "_").concat(timeRange, "_").concat(geo);
            // 캐시에서 확인
            if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
                console.log("[trends_api] \uCE90\uC2DC\uB41C \uACB0\uACFC \uC0AC\uC6A9: ".concat(cacheKey));
                return [2 /*return*/, trendCache[cacheKey].data];
            }
            generateDates = function (days) {
                var dates = [];
                var now = new Date();
                for (var i = days; i >= 0; i--) {
                    var date = new Date();
                    date.setDate(now.getDate() - i);
                    dates.push(date.toISOString().split('T')[0]);
                }
                return dates;
            };
            dates = [];
            switch (timeRange) {
                case 'day':
                    dates = generateDates(1).map(function (date) { return date + ' ' + new Date().getHours() + ':00'; });
                    break;
                case 'week':
                    dates = generateDates(7);
                    break;
                case 'month':
                    dates = generateDates(30);
                    break;
                case 'year':
                    now_1 = new Date();
                    dates = Array.from({ length: 12 }, function (_, i) {
                        var month = new Date();
                        month.setMonth(now_1.getMonth() - i);
                        return month.toISOString().split('T')[0].substring(0, 7); // YYYY-MM 형식
                    }).reverse();
                    break;
            }
            normalizedKeyword = keyword.toLowerCase();
            values = [];
            // MCP 블렌더 키워드는 최근에 급증하는 트렌드 패턴
            if (normalizedKeyword.includes('mcp') && normalizedKeyword.includes('블렌더')) {
                values = dates.map(function (_, index) {
                    var baseline = 30;
                    var growth = index / dates.length * 70; // 시간이 지날수록 증가
                    return Math.round(baseline + growth + (Math.random() * 10 - 5));
                });
            }
            // AI 관련 키워드는 전반적으로 높은 관심도 패턴
            else if (normalizedKeyword.includes('ai') || normalizedKeyword.includes('인공지능')) {
                values = dates.map(function (_, index) {
                    var baseline = 50;
                    var variation = Math.sin(index / 5) * 15; // 주기적 변동
                    return Math.round(baseline + variation + (Math.random() * 10 - 5));
                });
            }
            // 일반 키워드는 랜덤한 변동
            else {
                values = dates.map(function () { return Math.round(40 + Math.random() * 40); });
            }
            result = dates.map(function (date, index) { return ({
                date: date,
                value: values[index]
            }); });
            // 결과 캐싱
            trendCache[cacheKey] = {
                data: result,
                timestamp: Date.now(),
                expiry: Date.now() + CACHE_TTL
            };
            return [2 /*return*/, result];
        });
    });
}
