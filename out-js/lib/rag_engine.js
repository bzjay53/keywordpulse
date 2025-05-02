/**
 * RAG (Retrieval Augmented Generation) 엔진 모듈
 * 검색 기반 생성 기능을 제공합니다.
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import OpenAI from 'openai';
// OpenAI API 클라이언트 초기화
// 환경 변수가 설정되어 있지 않은 경우 개발 목적으로 기본값을 사용
var openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-xxxxxxxx', // 실제 배포 시 환경 변수 반드시 설정 필요
    dangerouslyAllowBrowser: true // 클라이언트 측 사용을 위한 설정 (개발 환경에서만 사용)
});
/**
 * 텍스트 임베딩을 생성합니다
 * @param text 임베딩할 텍스트
 * @param model 사용할 임베딩 모델
 * @returns 벡터 임베딩 배열
 */
export function createEmbedding(text_1) {
    return __awaiter(this, arguments, void 0, function (text, model) {
        var response, error_1;
        if (model === void 0) { model = 'text-embedding-3-small'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    logger.log({
                        message: "\uD14D\uC2A4\uD2B8 \uC784\uBCA0\uB529 \uC0DD\uC131 \uC2DC\uC791",
                        level: 'info',
                        context: { textLength: text.length, model: model }
                    });
                    return [4 /*yield*/, openai.embeddings.create({
                            model: model,
                            input: text,
                            encoding_format: 'float'
                        })];
                case 1:
                    response = _a.sent();
                    logger.log({
                        message: "\uD14D\uC2A4\uD2B8 \uC784\uBCA0\uB529 \uC0DD\uC131 \uC644\uB8CC",
                        level: 'info'
                    });
                    return [2 /*return*/, response.data[0].embedding];
                case 2:
                    error_1 = _a.sent();
                    logger.error({
                        message: "\uD14D\uC2A4\uD2B8 \uC784\uBCA0\uB529 \uC0DD\uC131 \uC2E4\uD328: ".concat(error_1.message),
                        error: error_1,
                        context: { textLength: text.length, model: model }
                    });
                    throw new Error("\uC784\uBCA0\uB529 \uC0DD\uC131 \uC2E4\uD328: ".concat(error_1.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 두 벡터 간의 코사인 유사도를 계산합니다
 * @param vec1 첫 번째 벡터
 * @param vec2 두 번째 벡터
 * @returns 코사인 유사도 (0~1)
 */
export function calculateCosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
        throw new Error('벡터 차원이 일치하지 않습니다');
    }
    var dotProduct = 0;
    var magnitude1 = 0;
    var magnitude2 = 0;
    for (var i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        magnitude1 += vec1[i] * vec1[i];
        magnitude2 += vec2[i] * vec2[i];
    }
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0;
    }
    return dotProduct / (magnitude1 * magnitude2);
}
/**
 * RAG 검색을 실행합니다
 * @param query 검색 쿼리
 * @param options 검색 옵션
 * @returns 검색 결과
 */
export function ragSearch(query_1) {
    return __awaiter(this, arguments, void 0, function (query, options) {
        var startTime, _a, maxResults, _b, threshold, _c, includeMetadata, _d, searchProvider, _e, embeddingModel, queryEmbedding_1, demoDocuments, _f, scoredResults, filteredResults, cleanResults, executionTime, error_2;
        var _g, _h, _j;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    startTime = Date.now();
                    _a = options.maxResults, maxResults = _a === void 0 ? 5 : _a, _b = options.threshold, threshold = _b === void 0 ? 0.7 : _b, _c = options.includeMetadata, includeMetadata = _c === void 0 ? true : _c, _d = options.searchProvider, searchProvider = _d === void 0 ? 'supabase' : _d, _e = options.embeddingModel, embeddingModel = _e === void 0 ? 'text-embedding-3-small' : _e;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 6, , 7]);
                    logger.log({
                        message: "RAG \uAC80\uC0C9 \uC2DC\uC791: \"".concat(query, "\""),
                        level: 'info',
                        context: { maxResults: maxResults, threshold: threshold, searchProvider: searchProvider, embeddingModel: embeddingModel }
                    });
                    return [4 /*yield*/, createEmbedding(query, embeddingModel)];
                case 2:
                    queryEmbedding_1 = _k.sent();
                    _g = {
                        id: '1',
                        content: '인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.',
                        metadata: includeMetadata ? { source: 'AI 문서', date: '2023-01-01' } : undefined
                    };
                    return [4 /*yield*/, createEmbedding('인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.', embeddingModel)];
                case 3:
                    _f = [
                        (_g.embedding = _k.sent(),
                            _g)
                    ];
                    _h = {
                        id: '2',
                        content: '기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.',
                        metadata: includeMetadata ? { source: 'ML 문서', date: '2023-02-15' } : undefined
                    };
                    return [4 /*yield*/, createEmbedding('기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.', embeddingModel)];
                case 4:
                    _f = _f.concat([
                        (_h.embedding = _k.sent(),
                            _h)
                    ]);
                    _j = {
                        id: '3',
                        content: '자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.',
                        metadata: includeMetadata ? { source: 'NLP 문서', date: '2023-03-20' } : undefined
                    };
                    return [4 /*yield*/, createEmbedding('자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.', embeddingModel)];
                case 5:
                    demoDocuments = _f.concat([
                        (_j.embedding = _k.sent(),
                            _j)
                    ]);
                    scoredResults = demoDocuments.map(function (doc) {
                        var similarity = calculateCosineSimilarity(queryEmbedding_1, doc.embedding);
                        return __assign(__assign({}, doc), { score: similarity });
                    });
                    filteredResults = scoredResults
                        .filter(function (doc) { return doc.score >= threshold; })
                        .sort(function (a, b) { return b.score - a.score; })
                        .slice(0, maxResults);
                    cleanResults = filteredResults.map(function (_a) {
                        var embedding = _a.embedding, rest = __rest(_a, ["embedding"]);
                        return rest;
                    });
                    executionTime = Date.now() - startTime;
                    logger.log({
                        message: "RAG \uAC80\uC0C9 \uC644\uB8CC: ".concat(cleanResults.length, " \uACB0\uACFC \uCC3E\uC74C"),
                        level: 'info',
                        context: { executionTime: executionTime }
                    });
                    return [2 /*return*/, {
                            query: query,
                            results: cleanResults,
                            totalCount: cleanResults.length,
                            executionTime: executionTime
                        }];
                case 6:
                    error_2 = _k.sent();
                    logger.error({
                        message: "RAG \uAC80\uC0C9 \uC2E4\uD328: ".concat(error_2.message),
                        error: error_2,
                        context: { query: query, options: options }
                    });
                    throw new Error("RAG \uAC80\uC0C9 \uC2E4\uD328: ".concat(error_2.message));
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * 검색 결과를 기반으로 콘텐츠를 생성합니다
 * @param query 사용자 쿼리
 * @param searchResults 검색 결과
 * @returns 생성된 콘텐츠와 인용 정보
 */
export function generateFromResults(query, searchResults) {
    return __awaiter(this, void 0, void 0, function () {
        var context, response, generatedContent, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    logger.log({
                        message: "RAG \uCF58\uD150\uCE20 \uC0DD\uC131 \uC2DC\uC791: \"".concat(query, "\""),
                        level: 'info',
                        context: { resultCount: searchResults.results.length }
                    });
                    // 검색 결과가 없으면 기본 응답
                    if (!searchResults.results || searchResults.results.length === 0) {
                        return [2 /*return*/, {
                                sourceQuery: query,
                                generatedContent: '관련 정보를 찾을 수 없습니다.',
                                citations: [],
                                confidence: 0
                            }];
                    }
                    context = searchResults.results.map(function (doc) { return doc.content; }).join('\n\n');
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: 'gpt-3.5-turbo',
                            messages: [
                                {
                                    role: 'system',
                                    content: '당신은 유용한 정보를 제공하는 도우미입니다. 제공된 정보를 기반으로 사용자 질문에 명확하고 정확하게 답변하세요.'
                                },
                                {
                                    role: 'user',
                                    content: "\uB2E4\uC74C \uC815\uBCF4\uB97C \uAE30\uBC18\uC73C\uB85C \"".concat(query, "\"\uC5D0 \uB300\uD55C \uB2F5\uBCC0\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694:\n\n").concat(context)
                                }
                            ],
                            temperature: 0.7,
                            max_tokens: 500
                        })];
                case 1:
                    response = _a.sent();
                    generatedContent = response.choices[0].message.content;
                    return [2 /*return*/, {
                            sourceQuery: query,
                            generatedContent: generatedContent.trim(),
                            citations: searchResults.results,
                            confidence: 0.85 // 실제로는 모델의 확신도 또는 다른 메트릭을 사용할 수 있습니다
                        }];
                case 2:
                    error_3 = _a.sent();
                    logger.error({
                        message: "RAG \uCF58\uD150\uCE20 \uC0DD\uC131 \uC2E4\uD328: ".concat(error_3.message),
                        error: error_3,
                        context: { query: query, resultCount: searchResults.results.length }
                    });
                    throw new Error("RAG \uCF58\uD150\uCE20 \uC0DD\uC131 \uC2E4\uD328: ".concat(error_3.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 키워드를 해당 카테고리로 분류합니다.
 * @param keyword 분류할 키워드
 * @returns 키워드 카테고리
 */
export function categorizeKeyword(keyword) {
    if (!keyword)
        return '일반';
    var normalizedKeyword = keyword.toLowerCase().trim();
    // 카테고리별 키워드 목록과 일치하는지 확인
    var categoryKeywords = {
        'AI 기술': ['AI', 'GPT', '인공지능', '머신러닝', '딥러닝', 'Claude', 'LLM', '생성형 AI'],
        '디지털 마케팅': ['마케팅', 'SEO', '디지털 마케팅', '소셜미디어', '광고', '콘텐츠 마케팅'],
        '앱 개발': ['앱 개발', '웹 개발', '프로그래밍', '모바일 앱', '웹사이트', '프론트엔드', '백엔드'],
        '교육/학습': ['교육', '학습', '강의', '온라인 강의', 'e러닝', '학교', '대학'],
        '건강/의료': ['건강', '의료', '병원', '운동', '다이어트', '건강관리', '헬스케어'],
        '금융/투자': ['금융', '투자', '주식', '경제', '재테크', '자산관리', '암호화폐'],
        '3D 모델링/AI': ['3D', '모델링', '렌더링', 'CAD', 'Blender', 'Unity', 'Unreal'],
        '일반': []
    };
    // 각 카테고리의 키워드 목록과 일치하는지 확인
    for (var _i = 0, _a = Object.entries(categoryKeywords); _i < _a.length; _i++) {
        var _b = _a[_i], category = _b[0], keywords = _b[1];
        if (keywords.some(function (kw) { return normalizedKeyword.includes(kw.toLowerCase()); })) {
            return category;
        }
    }
    // 일치하는 카테고리가 없으면 '일반' 반환
    return '일반';
}
/**
 * 키워드 배열로부터 마크다운 형식의 분석 결과를 생성합니다.
 * @param keywords 분석할 키워드 배열
 * @param preferences 사용자 설정
 * @returns 마크다운 형식의 분석 결과
 */
export function generateKeywordAnalysis(keywords, preferences) {
    if (preferences === void 0) { preferences = {}; }
    try {
        // 빈 배열 체크
        if (!keywords || keywords.length === 0) {
            // 언어 설정에 따른 메시지 반환
            return preferences.language === 'en' ? 'No keywords to analyze.' : '분석할 키워드가 없습니다.';
        }
        // 기본 설정
        var language = preferences.language || 'ko';
        var insightCount = preferences.insightCount || 3;
        var strategyCount = preferences.strategyCount || 3;
        // 키워드 중 첫 번째 것을 대표 키워드로 사용
        var mainKeyword = keywords[0];
        // 키워드 카테고리 결정
        var category = categorizeKeyword(mainKeyword);
        // 산업 분야가 지정된 경우 카테고리 오버라이드
        if (preferences.industry) {
            var industry = preferences.industry.toLowerCase();
            if (industry.includes('market') || industry.includes('마케팅')) {
                category = '디지털 마케팅';
            }
            else if (industry.includes('dev') || industry.includes('개발')) {
                category = '앱 개발';
            }
            else if (industry.includes('ai') || industry.includes('인공지능')) {
                category = 'AI 기술';
            }
            else if (industry.includes('edu') || industry.includes('교육')) {
                category = '교육/학습';
            }
            else if (industry.includes('health') || industry.includes('건강') || industry.includes('의료')) {
                category = '건강/의료';
            }
            else if (industry.includes('finance') || industry.includes('금융') || industry.includes('투자')) {
                category = '금융/투자';
            }
        }
        // 언어별 제목과 섹션 이름
        var title = language === 'en' ? "## ".concat(mainKeyword, " Keyword Analysis") : "## ".concat(mainKeyword, " \uD0A4\uC6CC\uB4DC \uBD84\uC11D");
        var insightTitle = language === 'en' ? '### Key Insights' : '### 주요 인사이트';
        var strategyTitle = language === 'en' ? '### Content Strategy' : '### 콘텐츠 제작 전략';
        // 인사이트 생성
        var insights = [];
        var insightsByCategory = {
            'AI 기술': [
                language === 'en'
                    ? 'AI technology continues to evolve rapidly, with increasing adoption across industries'
                    : 'AI 기술은 계속 빠르게 발전하고 있으며, 다양한 산업에서 도입이 증가하고 있습니다',
                language === 'en'
                    ? 'Large language models are becoming more accessible to businesses of all sizes'
                    : '대규모 언어 모델은 모든 규모의 기업에서 더 쉽게 접근할 수 있게 되었습니다',
                language === 'en'
                    ? 'Users are increasingly concerned about ethical AI and data privacy issues'
                    : '사용자들은 윤리적 AI와 데이터 프라이버시 문제에 대해 더 관심을 가지고 있습니다'
            ],
            '디지털 마케팅': [
                language === 'en'
                    ? 'Content marketing delivers 3x more leads than traditional marketing for 62% less cost'
                    : '콘텐츠 마케팅은 기존 마케팅보다 62% 적은 비용으로 3배 더 많은 리드를 창출합니다',
                language === 'en'
                    ? 'Video content generates 66% more qualified leads per year'
                    : '비디오 콘텐츠는 연간 66% 더 많은 유자격 리드를 생성합니다',
                language === 'en'
                    ? 'Mobile-first strategies are essential as mobile traffic exceeds 55% of total web traffic'
                    : '모바일 트래픽이 전체 웹 트래픽의 55%를 초과하므로 모바일 우선 전략이 필수적입니다'
            ],
            '일반': [
                language === 'en'
                    ? 'Content that answers specific questions performs 70% better in search rankings'
                    : '특정 질문에 답하는 콘텐츠는 검색 랭킹에서 70% 더 좋은 성과를 보입니다',
                language === 'en'
                    ? 'Visual content is processed 60,000x faster than text by the human brain'
                    : '시각적 콘텐츠는 인간의 뇌에서 텍스트보다 60,000배 더 빠르게 처리됩니다',
                language === 'en'
                    ? 'Consistent publishing schedules increase audience retention by 25-30%'
                    : '일관된 출판 일정은 잠재 고객 유지율을 25-30% 증가시킵니다'
            ]
        };
        // 해당 카테고리의 인사이트가 있으면 사용, 없으면 일반 카테고리 사용
        var categoryInsights = insightsByCategory[category] || insightsByCategory['일반'];
        for (var i = 0; i < Math.min(insightCount, categoryInsights.length); i++) {
            insights.push("- ".concat(categoryInsights[i]));
        }
        // 전략 생성
        var strategies = [];
        var strategiesByCategory = {
            'AI 기술': [
                language === 'en'
                    ? 'Create educational content that demystifies complex AI concepts for your audience'
                    : '청중을 위해 복잡한 AI 개념을 이해하기 쉽게 설명하는 교육 콘텐츠를 만드세요',
                language === 'en'
                    ? 'Develop case studies showcasing practical AI applications in relevant industries'
                    : '관련 산업에서 실용적인 AI 응용 사례를 보여주는 사례 연구를 개발하세요',
                language === 'en'
                    ? 'Create comparison content between different AI tools and technologies'
                    : '다양한 AI 도구와 기술 간의 비교 콘텐츠를 제작하세요'
            ],
            '디지털 마케팅': [
                language === 'en'
                    ? 'Develop a comprehensive content calendar targeting high-value keywords in your niche'
                    : '틈새 시장의 고가치 키워드를 타겟팅하는 포괄적인 콘텐츠 캘린더를 개발하세요',
                language === 'en'
                    ? 'Create video tutorials demonstrating practical marketing techniques with measurable results'
                    : '측정 가능한 결과로 실용적인 마케팅 기법을 보여주는 비디오 튜토리얼을 제작하세요',
                language === 'en'
                    ? 'Publish data-driven case studies highlighting ROI of digital marketing strategies'
                    : '디지털 마케팅 전략의 ROI를 강조하는 데이터 기반 사례 연구를 발행하세요'
            ],
            '일반': [
                language === 'en'
                    ? 'Create comprehensive guides addressing common questions in your topic area'
                    : '주제 영역의 일반적인 질문을 다루는 포괄적인 가이드를 만드세요',
                language === 'en'
                    ? 'Develop visual content like infographics to simplify complex information'
                    : '복잡한 정보를 단순화하는 인포그래픽과 같은 시각적 콘텐츠를 개발하세요',
                language === 'en'
                    ? 'Establish a consistent publishing schedule to build audience expectations'
                    : '잠재 고객 기대를 구축하기 위한 일관된 출판 일정을 수립하세요'
            ]
        };
        // 해당 카테고리의 전략이 있으면 사용, 없으면 일반 카테고리 사용
        var categoryStrategies = strategiesByCategory[category] || strategiesByCategory['일반'];
        for (var i = 0; i < Math.min(strategyCount, categoryStrategies.length); i++) {
            strategies.push("".concat(i + 1, ". ").concat(categoryStrategies[i]));
        }
        // 최종 마크다운 조합
        var analysisText = __spreadArray(__spreadArray(__spreadArray([
            title,
            '',
            insightTitle
        ], insights, true), [
            '',
            strategyTitle
        ], false), strategies, true).join('\n');
        return analysisText;
    }
    catch (error) {
        logger.error({
            message: '키워드 분석 중 오류 발생',
            error: error,
            context: { keywords: keywords }
        });
        // 오류 메시지 (언어에 맞게)
        return preferences.language === 'en'
            ? 'An error occurred during keyword analysis. Please try again.'
            : '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
}
// 인라인 RAG 유틸리티 기본 내보내기
export default {
    search: ragSearch,
    generate: generateFromResults,
    generateKeywordAnalysis: generateKeywordAnalysis,
    categorizeKeyword: categorizeKeyword,
    createEmbedding: createEmbedding,
    calculateCosineSimilarity: calculateCosineSimilarity
};
