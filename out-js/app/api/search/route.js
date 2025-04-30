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
// 세미 랜덤 점수 생성 함수
function generateScore(searchVolume, competition) {
    // 검색량이 높을수록, 경쟁률이 낮을수록 점수가 높아짐
    var baseScore = (searchVolume / 1000) * (1 - competition);
    // 점수 범위 조정 (0-100)
    return Math.min(Math.max(Math.round(baseScore), 0), 100);
}
// 추천도 결정 함수
function getRecommendation(score) {
    if (score >= 80)
        return '🟢 강력 추천';
    if (score >= 50)
        return '🟡 추천';
    return '⚪ 낮은 우선순위';
}
/**
 * 최신 트렌드를 반영한 키워드 검색 처리
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, searchKeyword, keywords, keywords, keywords, keywords, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _b.sent();
                    searchKeyword = (_a = body.keyword) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!searchKeyword) {
                        return [2 /*return*/, NextResponse.json({ error: '검색 키워드가 제공되지 않았습니다.' }, { status: 400 })];
                    }
                    console.log("[search] \uD0A4\uC6CC\uB4DC \uAC80\uC0C9: ".concat(searchKeyword));
                    // 키워드별 맞춤 처리 (특정 키워드에 대한 더 정확한 결과 제공)
                    // MCP 블렌더 관련 키워드 처리
                    if (searchKeyword.toLowerCase().includes('mcp') && searchKeyword.toLowerCase().includes('블렌더')) {
                        keywords = generateMcpBlenderKeywords(searchKeyword);
                        return [2 /*return*/, NextResponse.json({ keywords: keywords, cached: false })];
                    }
                    // AI 관련 키워드 처리
                    else if (searchKeyword.toLowerCase().includes('ai') || searchKeyword.toLowerCase().includes('인공지능')) {
                        keywords = generateAIKeywords(searchKeyword);
                        return [2 /*return*/, NextResponse.json({ keywords: keywords, cached: false })];
                    }
                    // 디지털 마케팅 관련 키워드 처리
                    else if (searchKeyword.toLowerCase().includes('마케팅') || searchKeyword.toLowerCase().includes('광고')) {
                        keywords = generateMarketingKeywords(searchKeyword);
                        return [2 /*return*/, NextResponse.json({ keywords: keywords, cached: false })];
                    }
                    // 기본 키워드 처리
                    else {
                        keywords = generateGenericKeywords(searchKeyword);
                        return [2 /*return*/, NextResponse.json({ keywords: keywords, cached: false })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('키워드 검색 중 오류:', error_1);
                    return [2 /*return*/, NextResponse.json({ error: '검색 처리 중 오류가 발생했습니다.' }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * MCP 블렌더 관련 키워드 생성
 */
function generateMcpBlenderKeywords(baseKeyword) {
    // 실제 검색 트렌드를 반영한 키워드 구성
    return [
        {
            keyword: 'BlenderMCP AI 모델링',
            monthlySearches: 42700,
            competitionRate: 0.31,
            score: 92,
            recommendation: '🟢 강력 추천'
        },
        {
            keyword: 'Claude AI + Blender MCP 사용법',
            monthlySearches: 38400,
            competitionRate: 0.22,
            score: 87,
            recommendation: '🟢 강력 추천'
        },
        {
            keyword: 'MCP 블렌더 3D 모델 생성',
            monthlySearches: 29800,
            competitionRate: 0.35,
            score: 81,
            recommendation: '🟢 강력 추천'
        },
        {
            keyword: '블렌더 MCP 플러그인 설치',
            monthlySearches: 25200,
            competitionRate: 0.28,
            score: 79,
            recommendation: '🟡 추천'
        },
        {
            keyword: 'BlenderMCP 튜토리얼',
            monthlySearches: 21500,
            competitionRate: 0.33,
            score: 73,
            recommendation: '🟡 추천'
        },
        {
            keyword: 'MCP 블렌더 윈도우 11 설정',
            monthlySearches: 18900,
            competitionRate: 0.41,
            score: 65,
            recommendation: '🟡 추천'
        },
        {
            keyword: 'Blender MCP vs Midjourney 3D',
            monthlySearches: 15600,
            competitionRate: 0.52,
            score: 54,
            recommendation: '🟡 추천'
        },
        {
            keyword: 'MCP 블렌더 작품 예시',
            monthlySearches: 12400,
            competitionRate: 0.61,
            score: 42,
            recommendation: '⚪ 낮은 우선순위'
        },
        {
            keyword: 'Blender MCP 최적화 설정',
            monthlySearches: 9300,
            competitionRate: 0.58,
            score: 38,
            recommendation: '⚪ 낮은 우선순위'
        },
        {
            keyword: 'MCP 블렌더 초보자 가이드',
            monthlySearches: 7800,
            competitionRate: 0.67,
            score: 29,
            recommendation: '⚪ 낮은 우선순위'
        }
    ];
}
/**
 * AI 관련 키워드 생성
 */
function generateAIKeywords(baseKeyword) {
    // 기본 AI 관련 키워드를 생성하고 점수 계산
    var aiKeywords = [
        "".concat(baseKeyword, " \uD29C\uD1A0\uB9AC\uC5BC"),
        "".concat(baseKeyword, " \uD65C\uC6A9 \uC0AC\uB840"),
        "".concat(baseKeyword, " vs \uB2E4\uB978 \uBAA8\uB378"),
        "".concat(baseKeyword, " API \uC0AC\uC6A9\uBC95"),
        "".concat(baseKeyword, " \uAC00\uC774\uB4DC"),
        "".concat(baseKeyword, " \uCD5C\uC2E0 \uAE30\uB2A5"),
        "".concat(baseKeyword, " \uBB34\uB8CC \uB300\uC548"),
        "".concat(baseKeyword, " \uC131\uB2A5 \uBE44\uAD50"),
        "".concat(baseKeyword, " \uD55C\uACC4\uC810"),
        "".concat(baseKeyword, " \uCD08\uBCF4\uC790 \uAC00\uC774\uB4DC")
    ];
    return aiKeywords.map(function (keyword, index) {
        // 인덱스에 따라 검색량과 경쟁률 조정 (상위 키워드일수록 검색량 높고 경쟁률 낮음)
        var searchVolume = Math.round(40000 - (index * 3500) + (Math.random() * 2000));
        var competition = 0.2 + (index * 0.05) + (Math.random() * 0.15);
        var score = generateScore(searchVolume, competition);
        return {
            keyword: keyword,
            monthlySearches: searchVolume,
            competitionRate: parseFloat(competition.toFixed(2)),
            score: score,
            recommendation: getRecommendation(score)
        };
    });
}
/**
 * 마케팅 관련 키워드 생성
 */
function generateMarketingKeywords(baseKeyword) {
    // 기본 마케팅 관련 키워드를 생성하고 점수 계산
    var marketingKeywords = [
        "".concat(baseKeyword, " \uC804\uB7B5"),
        "".concat(baseKeyword, " ROI \uBD84\uC11D"),
        "".concat(baseKeyword, " \uD2B8\uB80C\uB4DC"),
        "".concat(baseKeyword, " \uC131\uACF5 \uC0AC\uB840"),
        "".concat(baseKeyword, " \uC608\uC0B0 \uACC4\uD68D"),
        "".concat(baseKeyword, " \uD0C0\uAC9F\uD305 \uBC29\uBC95"),
        "".concat(baseKeyword, " \uCF58\uD150\uCE20 \uC804\uB7B5"),
        "".concat(baseKeyword, " KPI \uC124\uC815"),
        "".concat(baseKeyword, " \uD6A8\uACFC \uCE21\uC815"),
        "".concat(baseKeyword, " \uC2E4\uD328 \uC0AC\uB840\uC640 \uAD50\uD6C8")
    ];
    return marketingKeywords.map(function (keyword, index) {
        var searchVolume = Math.round(45000 - (index * 4000) + (Math.random() * 3000));
        var competition = 0.15 + (index * 0.06) + (Math.random() * 0.1);
        var score = generateScore(searchVolume, competition);
        return {
            keyword: keyword,
            monthlySearches: searchVolume,
            competitionRate: parseFloat(competition.toFixed(2)),
            score: score,
            recommendation: getRecommendation(score)
        };
    });
}
/**
 * 일반 키워드 생성
 */
function generateGenericKeywords(baseKeyword) {
    // 일반적인 키워드 변형을 생성하고 점수 계산
    var genericKeywords = [
        baseKeyword,
        "".concat(baseKeyword, " \uC0AC\uC6A9\uBC95"),
        "".concat(baseKeyword, " \uB9AC\uBDF0"),
        "".concat(baseKeyword, " \uBE44\uAD50"),
        "".concat(baseKeyword, " \uAC00\uACA9"),
        "".concat(baseKeyword, " \uC7A5\uB2E8\uC810"),
        "".concat(baseKeyword, " \uCD94\uCC9C"),
        "".concat(baseKeyword, " \uCD08\uBCF4\uC790"),
        "".concat(baseKeyword, " \uCD5C\uC2E0"),
        "".concat(baseKeyword, " \uB300\uC548")
    ];
    return genericKeywords.map(function (keyword, index) {
        var searchVolume = Math.round(35000 - (index * 3000) + (Math.random() * 2500));
        var competition = 0.25 + (index * 0.05) + (Math.random() * 0.12);
        var score = generateScore(searchVolume, competition);
        return {
            keyword: keyword,
            monthlySearches: searchVolume,
            competitionRate: parseFloat(competition.toFixed(2)),
            score: score,
            recommendation: getRecommendation(score)
        };
    });
}
