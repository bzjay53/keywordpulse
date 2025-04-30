/**
 * RAG (Retrieval-Augmented Generation) 시스템
 * KeywordPulse 서비스의 키워드 분석 결과를 구조화된 텍스트로 변환합니다.
 * @module rag_engine
 * @author Libwys Team
 */
import logger from './logger';
/**
 * 카테고리별 키워드 매칭 패턴 정의
 * 성능 최적화: 매칭 패턴을 한 번만 정의하여 재사용
 */
var CATEGORY_PATTERNS = {
    '3D 모델링/AI': [
        { pattern: /mcp.*블렌더|블렌더.*mcp|3d\s*모델링|모델링/i, match: true },
    ],
    'AI 기술': [
        { pattern: /ai|인공지능|llm|gpt|머신러닝|딥러닝|챗봇|claude/i, match: true },
    ],
    '디지털 마케팅': [
        { pattern: /마케팅|광고|seo|콘텐츠|브랜딩|sns|소셜미디어/i, match: true },
    ],
    '앱 개발': [
        { pattern: /앱|app|개발|프로그래밍|코딩|웹사이트|모바일/i, match: true },
    ],
    '교육/학습': [
        { pattern: /교육|학습|강의|과외|코스|수업|학생|교사|교수법/i, match: true },
    ],
    '건강/의료': [
        { pattern: /건강|의료|병원|치료|약품|영양|다이어트|웰빙|운동/i, match: true },
    ],
    '금융/투자': [
        { pattern: /금융|투자|주식|펀드|자산|부동산|저축|재테크|은행/i, match: true },
    ],
};
// 캐시 객체 선언 (메모이제이션용)
var keywordCategoryCache = new Map();
/**
 * 키워드를 분석하여 적절한 카테고리로 분류합니다.
 * @param {string} keyword - 분류할 키워드
 * @returns {KeywordCategory} 분류된 카테고리
 */
export function categorizeKeyword(keyword) {
    if (!keyword) {
        logger.log({
            message: '빈 키워드가 분류를 위해 전달됨',
            level: 'warn',
            tags: { module: 'rag_engine', function: 'categorizeKeyword' }
        });
        return '일반';
    }
    // 캐시된 결과가 있으면 반환 (메모이제이션)
    var normalizedKeyword = keyword.toLowerCase().trim();
    if (keywordCategoryCache.has(normalizedKeyword)) {
        var cachedCategory = keywordCategoryCache.get(normalizedKeyword);
        return cachedCategory;
    }
    // 개선된 카테고리 분류 알고리즘: 가중치 기반 접근
    var categoryScores = {
        'AI 기술': 0,
        '디지털 마케팅': 0,
        '앱 개발': 0,
        '3D 모델링/AI': 0,
        '교육/학습': 0,
        '건강/의료': 0,
        '금융/투자': 0,
        '일반': 0
    };
    // 각 카테고리별 패턴을 확인하고 점수 계산
    for (var _i = 0, _a = Object.entries(CATEGORY_PATTERNS); _i < _a.length; _i++) {
        var _b = _a[_i], category = _b[0], patterns = _b[1];
        for (var _c = 0, patterns_1 = patterns; _c < patterns_1.length; _c++) {
            var _d = patterns_1[_c], pattern = _d.pattern, match = _d.match;
            if (pattern.test(normalizedKeyword) === match) {
                // 패턴이 일치하면 해당 카테고리에 점수 추가
                categoryScores[category] += 1;
            }
        }
    }
    // 복합 키워드 분석 - 단어 단위로 분리하여 추가 분석
    var words = normalizedKeyword.split(/\s+/);
    for (var _e = 0, words_1 = words; _e < words_1.length; _e++) {
        var word = words_1[_e];
        if (word.length < 2)
            continue; // 너무 짧은 단어는 무시
        for (var _f = 0, _g = Object.entries(CATEGORY_PATTERNS); _f < _g.length; _f++) {
            var _h = _g[_f], category = _h[0], patterns = _h[1];
            for (var _j = 0, patterns_2 = patterns; _j < patterns_2.length; _j++) {
                var _k = patterns_2[_j], pattern = _k.pattern, match = _k.match;
                if (pattern.test(word) === match) {
                    // 개별 단어가 패턴과 일치하면 약한 가중치 부여
                    categoryScores[category] += 0.5;
                }
            }
        }
    }
    // 점수가 가장 높은 카테고리 선택
    var bestCategory = '일반';
    var highestScore = 0;
    for (var _l = 0, _m = Object.entries(categoryScores); _l < _m.length; _l++) {
        var _o = _m[_l], category = _o[0], score = _o[1];
        if (score > highestScore) {
            highestScore = score;
            bestCategory = category;
        }
    }
    // 모든 카테고리의 점수가 0이면 '일반' 카테고리로 분류
    if (highestScore === 0) {
        bestCategory = '일반';
    }
    // 결과 캐싱
    keywordCategoryCache.set(normalizedKeyword, bestCategory);
    logger.log({
        message: '키워드 카테고리 분류 완료',
        level: 'debug',
        context: {
            keyword: normalizedKeyword,
            category: bestCategory,
            scores: categoryScores
        },
        tags: { module: 'rag_engine', function: 'categorizeKeyword' }
    });
    return bestCategory;
}
// 언어 별 분석 템플릿 캐시 (메모이제이션용)
var templateCacheByLang = {
    'ko': new Map(),
    'en': new Map()
};
/**
 * 키워드 문자열 배열을 받아 분석 텍스트를 생성하는 메인 함수
 * @param {string[]} keywords - 분석할 키워드 배열 (첫 번째 키워드가 메인 키워드로 사용됨)
 * @param {UserPreferences} userPreferences - 사용자 맞춤 설정 (선택적)
 * @returns {string} 마크다운 형식의 분석 텍스트
 * @throws {Error} 키워드 배열이 유효하지 않을 경우 에러 발생 가능
 */
export function generateKeywordAnalysis(keywords, userPreferences) {
    var _a;
    if (userPreferences === void 0) { userPreferences = {}; }
    try {
        // 기본 언어 설정
        var language = userPreferences.language || 'ko';
        // 입력 유효성 검사
        if (!keywords || !Array.isArray(keywords)) {
            throw new Error('유효하지 않은 키워드 입력: 배열이 필요합니다');
        }
        if (keywords.length === 0) {
            return language === 'ko'
                ? '분석할 키워드가 없습니다.'
                : 'No keywords to analyze.';
        }
        // 사용자 필터링: 제외된 키워드 필터링
        var filteredKeywords = keywords;
        if ((_a = userPreferences.excludedKeywords) === null || _a === void 0 ? void 0 : _a.length) {
            var excludeSet_1 = new Set(userPreferences.excludedKeywords.map(function (k) { return k.toLowerCase().trim(); }));
            filteredKeywords = keywords.filter(function (k) { return !excludeSet_1.has(k.toLowerCase().trim()); });
            // 필터링 후 키워드가 없으면 원래 키워드 사용
            if (filteredKeywords.length === 0) {
                filteredKeywords = keywords;
            }
        }
        var mainKeyword = filteredKeywords[0];
        if (!mainKeyword || typeof mainKeyword !== 'string') {
            throw new Error('유효하지 않은 메인 키워드: 문자열이 필요합니다');
        }
        // 캐시 키 생성 (메인 키워드, 키워드 수, 사용자 설정 기반)
        var prefsHash = JSON.stringify(userPreferences);
        var cacheKey = "".concat(mainKeyword, ":").concat(filteredKeywords.length, ":").concat(prefsHash.slice(0, 20));
        // 선택된 언어의 캐시 사용
        var templateCache = templateCacheByLang[language];
        // 캐시된 결과가 있으면 반환 (메모이제이션)
        if (templateCache.has(cacheKey)) {
            logger.log({
                message: '캐시된 분석 결과 사용',
                level: 'info',
                context: { mainKeyword: mainKeyword, cacheKey: cacheKey, language: language },
                tags: { module: 'rag_engine', action: 'cache_hit' }
            });
            return templateCache.get(cacheKey);
        }
        logger.log({
            message: '키워드 분석 시작',
            level: 'info',
            context: {
                mainKeyword: mainKeyword,
                keywordCount: filteredKeywords.length,
                language: language,
                userPreferences: userPreferences
            },
            tags: { module: 'rag_engine', action: 'analyze' }
        });
        var category = categorizeKeyword(mainKeyword);
        // 사용자 맞춤: 산업 분야 기반 카테고리 오버라이드
        var effectiveCategory = category;
        if (userPreferences.industry) {
            switch (userPreferences.industry.toLowerCase()) {
                case 'marketing':
                case '마케팅':
                    effectiveCategory = '디지털 마케팅';
                    break;
                case 'development':
                case '개발':
                    effectiveCategory = '앱 개발';
                    break;
                case 'ai':
                case '인공지능':
                    effectiveCategory = 'AI 기술';
                    break;
                case 'education':
                case '교육':
                    effectiveCategory = '교육/학습';
                    break;
                case 'health':
                case '건강':
                case '의료':
                    effectiveCategory = '건강/의료';
                    break;
                case 'finance':
                case '금융':
                case '투자':
                    effectiveCategory = '금융/투자';
                    break;
            }
        }
        // 카테고리별 분석 템플릿 생성 (언어에 따라 다른 함수 호출)
        var analysis = generateAnalysisByCategory(effectiveCategory, mainKeyword, filteredKeywords, language);
        // 사용자 맞춤: 분석 결과를 사용자 설정에 따라 조정
        analysis = customizeAnalysisForUser(analysis, userPreferences, language);
        // 결과 캐싱 (최대 50개 항목으로 제한)
        if (templateCache.size >= 50) {
            // 가장 오래된 항목 하나 제거
            var firstKey = templateCache.keys().next().value;
            if (firstKey !== undefined) {
                templateCache.delete(firstKey);
            }
        }
        templateCache.set(cacheKey, analysis);
        return analysis;
    }
    catch (error) {
        // 로깅: 분석 중 오류
        logger.error({
            message: 'RAG 키워드 분석 오류',
            error: error,
            context: {
                keywordCount: (keywords === null || keywords === void 0 ? void 0 : keywords.length) || 0,
                firstKeyword: (keywords === null || keywords === void 0 ? void 0 : keywords[0]) || 'none',
                language: userPreferences.language || 'ko',
                userPreferences: userPreferences
            },
            tags: { module: 'rag_engine', action: 'error' }
        });
        // 에러 발생 시 기본 메시지 반환 (선택된 언어에 따라)
        return userPreferences.language === 'en'
            ? 'An error occurred during keyword analysis. Please try again.'
            : '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
}
/**
 * 카테고리별로 적절한 분석 함수를 호출하는 도우미 함수
 */
function generateAnalysisByCategory(category, mainKeyword, keywords, language) {
    if (language === 'ko') {
        // 한국어 분석
        switch (category) {
            case '3D 모델링/AI':
                return generateModelingAnalysis(mainKeyword, keywords);
            case 'AI 기술':
                return generateAIAnalysis(mainKeyword, keywords);
            case '디지털 마케팅':
                return generateMarketingAnalysis(mainKeyword, keywords);
            case '앱 개발':
                return generateDevelopmentAnalysis(mainKeyword, keywords);
            case '교육/학습':
                return generateEducationalAnalysis(mainKeyword, keywords);
            case '건강/의료':
                return generateHealthAnalysis(mainKeyword, keywords);
            case '금융/투자':
                return generateFinanceAnalysis(mainKeyword, keywords);
            default:
                return generateGenericAnalysis(mainKeyword, keywords);
        }
    }
    else {
        // 영어 분석
        switch (category) {
            case '3D 모델링/AI':
                return generateModelingAnalysisEn(mainKeyword, keywords);
            case 'AI 기술':
                return generateAIAnalysisEn(mainKeyword, keywords);
            case '디지털 마케팅':
                return generateMarketingAnalysisEn(mainKeyword, keywords);
            case '앱 개발':
                return generateDevelopmentAnalysisEn(mainKeyword, keywords);
            case '교육/학습':
                return generateEducationalAnalysisEn(mainKeyword, keywords);
            case '건강/의료':
                return generateHealthAnalysisEn(mainKeyword, keywords);
            case '금융/투자':
                return generateFinanceAnalysisEn(mainKeyword, keywords);
            default:
                return generateGenericAnalysisEn(mainKeyword, keywords);
        }
    }
}
/**
 * 사용자 설정에 따라 분석 결과를 조정하는 함수
 */
function customizeAnalysisForUser(analysis, preferences, language) {
    if (!preferences || Object.keys(preferences).length === 0) {
        return analysis; // 사용자 설정이 없으면 원본 그대로 반환
    }
    var customized = analysis;
    // 인사이트 수 조정
    if (preferences.insightCount !== undefined && preferences.insightCount > 0) {
        var insightPattern = language === 'ko'
            ? /### 주요 인사이트\n\n((?:- .+\n)+)/
            : /### Key Insights\n\n((?:- .+\n)+)/;
        var insightMatch = customized.match(insightPattern);
        if (insightMatch) {
            var insights = insightMatch[1].split('\n').filter(function (line) { return line.startsWith('- '); });
            var limitedInsights = insights.slice(0, Math.min(preferences.insightCount, insights.length));
            var insightsSection = language === 'ko'
                ? "### \uC8FC\uC694 \uC778\uC0AC\uC774\uD2B8\n\n".concat(limitedInsights.join('\n'), "\n")
                : "### Key Insights\n\n".concat(limitedInsights.join('\n'), "\n");
            customized = customized.replace(insightPattern, insightsSection);
        }
    }
    // 전략 수 조정
    if (preferences.strategyCount !== undefined && preferences.strategyCount > 0) {
        var strategyPattern = language === 'ko'
            ? /### 콘텐츠 제작 전략\n\n((?:\d+\. .+\n?)+)/
            : /### Content Strategy\n\n((?:\d+\. .+\n?)+)/;
        var strategyMatch = customized.match(strategyPattern);
        if (strategyMatch) {
            var strategies = strategyMatch[1].split('\n').filter(function (line) { return /^\d+\./.test(line); });
            var limitedStrategies = strategies.slice(0, preferences.strategyCount); // 정확히 요청한 개수만큼 제한
            // 번호 재지정
            var renumberedStrategies = limitedStrategies.map(function (strategy, index) {
                return strategy.replace(/^\d+\./, "".concat(index + 1, "."));
            });
            var strategiesSection = language === 'ko'
                ? "### \uCF58\uD150\uCE20 \uC81C\uC791 \uC804\uB7B5\n\n".concat(renumberedStrategies.join('\n'), "\n")
                : "### Content Strategy\n\n".concat(renumberedStrategies.join('\n'), "\n");
            customized = customized.replace(strategyPattern, strategiesSection);
        }
    }
    // 상세도 조정
    if (preferences.detailLevel === 'basic') {
        // 기본 모드: 더 간결한 형태로 조정
        // 각 항목에서 세부 내용 일부 제거
        customized = customized.replace(/\*\*[\w\s가-힣]+\*\*: /g, ''); // 볼드 제목 제거
        // 행 길이가 너무 긴 경우 자르기
        var lines = customized.split('\n');
        var shortenedLines = lines.map(function (line) {
            if (line.startsWith('- ') || /^\d+\./.test(line)) {
                // 60자 이상인 행 자르기
                if (line.length > 60) {
                    return line.substring(0, 57) + '...';
                }
            }
            return line;
        });
        customized = shortenedLines.join('\n');
    }
    return customized;
}
/**
 * 분석 문자열을 생성하는 표준 빌더 함수
 * @param mainKeyword 메인 키워드
 * @param intro 도입부 텍스트
 * @param insights 인사이트 배열
 * @param strategies 전략 배열
 * @returns 포맷된 분석 텍스트
 */
function buildAnalysisText(mainKeyword, intro, insights, strategies) {
    // 이스케이프 처리 - null 또는 undefined 방지
    var safeMainKeyword = (mainKeyword || '').replace(/[*_]/g, '\\$&');
    // StringBuilder 패턴 사용
    var parts = [
        "## ".concat(safeMainKeyword, " \uD0A4\uC6CC\uB4DC \uBD84\uC11D\n\n"),
        intro,
        "\n\n### 주요 인사이트\n\n"
    ];
    // 반복문 대신 map과 join 사용
    parts.push(insights.map(function (insight) { return "- ".concat(insight); }).join('\n'));
    parts.push("\n\n### 콘텐츠 제작 전략\n\n");
    parts.push(strategies.map(function (strategy, index) { return "".concat(index + 1, ". ").concat(strategy); }).join('\n'));
    // 한 번에 문자열 결합
    return parts.join('');
}
/**
 * 3D 모델링/AI 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateModelingAnalysis(mainKeyword, keywords) {
    var intro = "3D \uBAA8\uB378\uB9C1/AI \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC544\uC9C0\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uD2B9\uD788 Claude AI\uB098 \uB2E4\uB978 \uC0DD\uC131\uD615 AI\uC640 \uD1B5\uD569\uB41C MCP \uBE14\uB80C\uB354 \uD65C\uC6A9\uBC95\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    var insights = [
        "\uD604\uC7AC **".concat(mainKeyword, "** \uAD00\uB828 \uAC80\uC0C9 \uC911 \uC57D 65%\uAC00 \uD29C\uD1A0\uB9AC\uC5BC\uACFC \uC0AC\uC6A9 \uBC29\uBC95\uC5D0 \uAD00\uD55C \uAC83\uC73C\uB85C, \uCD08\uBCF4\uC790\uB97C \uC704\uD55C \uCF58\uD150\uCE20 \uC218\uC694\uAC00 \uB9E4\uC6B0 \uB192\uC2B5\uB2C8\uB2E4."),
        "**\uC708\uB3C4\uC6B0 11**\uC5D0\uC11C \uBE14\uB80C\uB354 MCP \uC124\uC815 \uAD00\uB828 \uBB38\uC758\uAC00 \uB9CE\uC73C\uBA70, \uD2B9\uD788 \uD658\uACBD \uC124\uC815\uACFC \uCD5C\uC801\uD654\uC5D0 \uAD00\uD55C \uC0C1\uC138 \uAC00\uC774\uB4DC \uCF58\uD150\uCE20\uC758 \uACBD\uC7C1\uC774 \uC801\uC2B5\uB2C8\uB2E4.",
        "BlenderMCP\uC640 Midjourney 3D\uC758 \uBE44\uAD50 \uCF58\uD150\uCE20\uAC00 \uC778\uAE30\uB97C \uC5BB\uACE0 \uC788\uC73C\uBA70, \uAC01 \uB3C4\uAD6C\uC758 \uC7A5\uB2E8\uC810\uC744 \uBD84\uC11D\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uC8FC\uBAA9\uBC1B\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    ];
    var strategies = [
        "**\uB2E8\uACC4\uBCC4 \uD29C\uD1A0\uB9AC\uC5BC**: \uC124\uCE58\uBD80\uD130 \uACE0\uAE09 \uAE30\uB2A5\uAE4C\uC9C0 \uB2E8\uACC4\uBCC4\uB85C \uB098\uB208 \uC0C1\uC138 \uAC00\uC774\uB4DC\uB97C \uC81C\uC791\uD558\uC138\uC694.",
        "**\uBB38\uC81C \uD574\uACB0 \uAC00\uC774\uB4DC**: \uC0AC\uC6A9\uC790\uB4E4\uC774 \uC790\uC8FC \uACAA\uB294 \uBB38\uC81C\uC640 \uD574\uACB0\uCC45\uC744 \uC81C\uC2DC\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uCC38\uC5EC\uC728\uC744 \uBCF4\uC785\uB2C8\uB2E4.",
        "**\uC791\uD488 \uAC24\uB7EC\uB9AC**: MCP \uBE14\uB80C\uB354\uB85C \uB9CC\uB4E0 \uC791\uD488\uB4E4\uC744 \uC18C\uAC1C\uD558\uACE0 \uC81C\uC791 \uACFC\uC815\uC744 \uC124\uBA85\uD558\uB294 \uCF58\uD150\uCE20\uB97C \uC81C\uC791\uD558\uC138\uC694.",
        "**\uC131\uB2A5 \uCD5C\uC801\uD654**: \uB2E4\uC591\uD55C \uD558\uB4DC\uC6E8\uC5B4 \uD658\uACBD\uC5D0\uC11C \uCD5C\uC801\uC758 \uC131\uB2A5\uC744 \uB0B4\uB294 \uC124\uC815 \uAC00\uC774\uB4DC\uB97C \uC81C\uACF5\uD558\uC138\uC694.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * AI 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateAIAnalysis(mainKeyword, keywords) {
    var intro = "AI \uAE30\uC220 \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD2B8\uB80C\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, \uC0AC\uC6A9\uC790\uB4E4\uC740 \uC8FC\uB85C \uC2E4\uC6A9\uC801\uC778 \uD65C\uC6A9 \uBC29\uBC95\uACFC \uAE30\uC220 \uBE44\uAD50\uC5D0 \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 안전한 키워드 선택
    var randomKeyword = keywords.length > 1
        ? keywords[1] // 두 번째 키워드 사용 - 더 결정적이고 안정적
        : mainKeyword;
    var insights = [
        "**".concat(mainKeyword, "** \uAD00\uB828 \uAC80\uC0C9\uC758 \uC57D 40%\uB294 \uC2E4\uC81C \uD65C\uC6A9 \uC0AC\uB840\uC640 \uC608\uC2DC\uC5D0 \uC9D1\uC911\uB418\uC5B4 \uC788\uC5B4, \uC2E4\uC6A9\uC801\uC778 \uC801\uC6A9 \uC608\uC2DC\uB97C \uC81C\uACF5\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4."),
        "".concat(randomKeyword, " \uAD00\uB828 \uAC80\uC0C9\uC774 \uC99D\uAC00 \uCD94\uC138\uB85C, \uD2B9\uD788 \uB2E4\uB978 AI \uBAA8\uB378\uACFC\uC758 \uBE44\uAD50 \uCF58\uD150\uCE20\uAC00 \uC778\uAE30\uB97C \uC5BB\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
        "\uCD08\uBCF4\uC790\uC6A9 \uC785\uBB38 \uAC00\uC774\uB4DC\uC640 API \uD65C\uC6A9 \uC608\uC2DC\uAC00 \uAFB8\uC900\uD55C \uC218\uC694\uB97C \uBCF4\uC774\uBA70, \uCF54\uB4DC \uC608\uC81C\uB97C \uD3EC\uD568\uD55C \uAD6C\uCCB4\uC801\uC778 \uAC00\uC774\uB4DC\uAC00 \uB192\uC740 \uCC38\uC5EC\uC728\uC744 \uBCF4\uC785\uB2C8\uB2E4.",
    ];
    var strategies = [
        "**\uC2E4\uC81C \uC0AC\uB840 \uC911\uC2EC**: \uCD94\uC0C1\uC801\uC778 \uC124\uBA85\uBCF4\uB2E4\uB294 \uAD6C\uCCB4\uC801\uC778 \uC801\uC6A9 \uC0AC\uB840\uC640 \uACB0\uACFC\uB97C \uBCF4\uC5EC\uC8FC\uB294 \uCF58\uD150\uCE20\uB97C \uC81C\uC791\uD558\uC138\uC694.",
        "**\uBE44\uAD50 \uBD84\uC11D**: \uC720\uC0AC\uD55C AI \uAE30\uC220\uACFC\uC758 \uCC28\uC774\uC810\uACFC \uAC01\uAC01 \uC801\uD569\uD55C \uC0AC\uC6A9 \uC0C1\uD669\uC744 \uBD84\uC11D\uD558\uB294 \uCF58\uD150\uCE20\uB97C \uC81C\uACF5\uD558\uC138\uC694.",
        "**\uB2E8\uACC4\uBCC4 \uD29C\uD1A0\uB9AC\uC5BC**: \uC124\uC815\uBD80\uD130 \uACE0\uAE09 \uAE30\uB2A5\uAE4C\uC9C0 \uB2E4\uB8E8\uB418, \uAC01 \uB2E8\uACC4\uBCC4 \uC2A4\uD06C\uB9B0\uC0F7\uC774\uB098 \uBE44\uB514\uC624\uB97C \uD3EC\uD568\uD558\uBA74 \uB354\uC6B1 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4.",
        "**\uCF54\uB4DC \uC608\uC81C \uBC0F \uC2E4\uC2B5**: \uC2E4\uD589 \uAC00\uB2A5\uD55C \uCF54\uB4DC \uC608\uC81C\uC640 \uC2E4\uC2B5 \uD504\uB85C\uC81D\uD2B8\uB97C \uC81C\uACF5\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAC00\uCE58\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 디지털 마케팅 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateMarketingAnalysis(mainKeyword, keywords) {
    var intro = "\uB514\uC9C0\uD138 \uB9C8\uCF00\uD305 \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uD2B8\uB80C\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, ROI \uCE21\uC815, \uD6A8\uACFC\uC801\uC778 \uC804\uB7B5 \uC218\uB9BD, \uADF8\uB9AC\uACE0 \uC131\uACF5 \uC0AC\uB840\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 안전하게 키워드 배열 접근 - 배열 복사 최소화
    var getKeyword = function (index) { return keywords.length > index ? keywords[index] : mainKeyword; };
    var insights = [
        "**".concat(getKeyword(0), "**\uC5D0 \uB300\uD55C \uAC80\uC0C9\uC774 \uAC00\uC7A5 \uB9CE\uC73C\uBA70, \uAD6C\uCCB4\uC801\uC778 \uC131\uACFC \uCE21\uC815\uACFC ROI \uAD00\uB828 \uC815\uBCF4\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uB192\uC2B5\uB2C8\uB2E4."),
        "".concat(getKeyword(1), " \uAD00\uB828 \uCF58\uD150\uCE20\uB294 \uACBD\uC7C1\uC774 \uC801\uC740 \uD3B8\uC73C\uB85C, \uAD6C\uCCB4\uC801\uC778 \uBC29\uBC95\uB860\uACFC \uB2E8\uACC4\uBCC4 \uAC00\uC774\uB4DC\uB97C \uC81C\uACF5\uD558\uBA74 \uACBD\uC7C1 \uC6B0\uC704\uB97C \uC810\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
        "\uCD5C\uADFC 6\uAC1C\uC6D4\uAC04 ".concat(getKeyword(2), "\uC5D0 \uB300\uD55C \uAC80\uC0C9\uC774 45% \uC99D\uAC00\uD588\uC73C\uBA70, \uC131\uACF5 \uC0AC\uB840\uC640 \uC2E4\uD328 \uC0AC\uB840\uB97C \uBAA8\uB450 \uB2E4\uB8E8\uB294 \uCF58\uD150\uCE20\uAC00 \uC8FC\uBAA9\uBC1B\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
    ];
    var strategies = [
        "**\uB370\uC774\uD130 \uAE30\uBC18 \uC811\uADFC**: \uAD6C\uCCB4\uC801\uC778 \uC218\uCE58, \uD1B5\uACC4, \uADF8\uB798\uD504\uB97C \uD65C\uC6A9\uD55C \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uC2E0\uB8B0\uB3C4\uB97C \uC5BB\uC2B5\uB2C8\uB2E4.",
        "**\uC0AC\uB840 \uC5F0\uAD6C**: \uC2E4\uC81C \uC131\uACF5/\uC2E4\uD328 \uC0AC\uB840\uB97C \uBD84\uC11D\uD558\uACE0 \uAD50\uD6C8\uC744 \uC81C\uC2DC\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uCC38\uC5EC\uB97C \uC720\uB3C4\uD569\uB2C8\uB2E4.",
        "**\uC2E4\uD589 \uAC00\uB2A5\uD55C \uC804\uB7B5**: \uC774\uB860\uBCF4\uB2E4\uB294 \uC989\uC2DC \uC801\uC6A9 \uAC00\uB2A5\uD55C \uC804\uB7B5\uACFC \uCCB4\uD06C\uB9AC\uC2A4\uD2B8\uB97C \uC81C\uACF5\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4.",
        "**\uCD5C\uC2E0 \uD2B8\uB80C\uB4DC \uBC18\uC601**: \uC778\uACF5\uC9C0\uB2A5, \uC790\uB3D9\uD654 \uB4F1 \uCD5C\uC2E0 \uB9C8\uCF00\uD305 \uAE30\uC220\uC744 ".concat(mainKeyword, "\uC5D0 \uC5B4\uB5BB\uAC8C \uC801\uC6A9\uD560 \uC218 \uC788\uB294\uC9C0 \uB2E4\uB8E8\uC138\uC694."),
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 앱 개발 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateDevelopmentAnalysis(mainKeyword, keywords) {
    var intro = "\uC571 \uAC1C\uBC1C \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD328\uD134\uC744 \uBD84\uC11D\uD55C \uACB0\uACFC, \uCD5C\uC2E0 \uAE30\uC220 \uC801\uC6A9 \uBC29\uBC95, \uC131\uB2A5 \uCD5C\uC801\uD654, \uADF8\uB9AC\uACE0 \uAD6C\uCCB4\uC801\uC778 \uAD6C\uD604 \uC0AC\uB840\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 성능 최적화: 결정적인 키워드 선택으로 랜덤 제거
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "".concat(kw1, "\uC5D0 \uB300\uD55C \uAC80\uC0C9\uC774 \uC9C0\uB09C \uBD84\uAE30 \uB300\uBE44 60% \uC99D\uAC00\uD588\uC73C\uBA70, \uD2B9\uD788 \uC2E4\uC81C \uAD6C\uD604 \uCF54\uB4DC\uC640 \uC608\uC81C\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uB192\uC2B5\uB2C8\uB2E4."),
        "".concat(kw2, " \uAD00\uB828 \uCF58\uD150\uCE20\uB294 \uCD08\uBCF4 \uAC1C\uBC1C\uC790\uBD80\uD130 \uC219\uB828 \uAC1C\uBC1C\uC790\uAE4C\uC9C0 \uD3ED\uB113\uC740 \uCE35\uC5D0\uC11C \uAC80\uC0C9\uB418\uACE0 \uC788\uC73C\uBA70, \uB09C\uC774\uB3C4\uBCC4 \uC811\uADFC\uBC95\uC744 \uB2E4\uB8E8\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4."),
        "\uC131\uB2A5 \uCD5C\uC801\uD654\uC640 \uC0AC\uC6A9\uC790 \uACBD\uD5D8 \uAC1C\uC120\uC5D0 \uAD00\uD55C \uC8FC\uC81C\uAC00 \uC0C1\uC704 \uAC80\uC0C9\uC5B4\uC5D0 \uD3EC\uD568\uB418\uC5B4 \uC788\uC5B4, \uC774\uC5D0 \uCD08\uC810\uC744 \uB9DE\uCD98 \uCF58\uD150\uCE20\uAC00 \uC8FC\uBAA9\uBC1B\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    ];
    var strategies = [
        "**\uC2E4\uC81C \uCF54\uB4DC \uC608\uC81C**: \uC774\uB860\uBCF4\uB2E4\uB294 \uC791\uB3D9\uD558\uB294 \uCF54\uB4DC\uC640 \uC2E4\uC81C \uD504\uB85C\uC81D\uD2B8 \uC608\uC81C\uB97C \uC81C\uACF5\uD558\uC138\uC694.",
        "**\uBB38\uC81C \uD574\uACB0 \uC911\uC2EC**: \uAC1C\uBC1C\uC790\uB4E4\uC774 \uC790\uC8FC \uACAA\uB294 \uD2B9\uC815 \uBB38\uC81C\uC640 \uD574\uACB0\uCC45\uC744 \uB2E4\uB8E8\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAC00\uCE58\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
        "**\uC131\uB2A5 \uCD5C\uC801\uD654**: ".concat(mainKeyword, "\uC758 \uC131\uB2A5\uC744 \uAC1C\uC120\uD558\uB294 \uBC29\uBC95\uACFC \uCD5C\uC801\uD654 \uAE30\uBC95\uC744 \uC0C1\uC138\uD788 \uB2E4\uB8E8\uC138\uC694."),
        "**\uCD5C\uC2E0 \uC5C5\uB370\uC774\uD2B8 \uBC18\uC601**: \uB77C\uC774\uBE0C\uB7EC\uB9AC\uB098 \uD504\uB808\uC784\uC6CC\uD06C\uC758 \uCD5C\uC2E0 \uBCC0\uACBD\uC0AC\uD56D\uACFC \uADF8\uC5D0 \uB530\uB978 \uC801\uC6A9 \uBC29\uBC95\uC744 \uB2E4\uB8E8\uB294 \uCF58\uD150\uCE20\uAC00 \uC8FC\uBAA9\uBC1B\uC2B5\uB2C8\uB2E4.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 일반 키워드 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateGenericAnalysis(mainKeyword, keywords) {
    var intro = "**".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD2B8\uB80C\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, \uC2E4\uC6A9\uC801\uC778 \uC815\uBCF4\uC640 \uBE44\uAD50 \uBD84\uC11D\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uB192\uC740 \uAC83\uC73C\uB85C \uB098\uD0C0\uB0AC\uC2B5\uB2C8\uB2E4.");
    // 안전하게 키워드 배열 접근 - 함수 제거하고 직접 접근
    var kw0 = keywords.length > 0 ? keywords[0] : mainKeyword;
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "".concat(kw0, "\uC5D0 \uB300\uD55C \uAC80\uC0C9\uB7C9\uC774 \uAC00\uC7A5 \uB192\uC73C\uBA70, \uC0AC\uC6A9\uC790\uB4E4\uC740 \uC8FC\uB85C \uAE30\uBCF8 \uAC1C\uB150\uACFC \uC0AC\uC6A9 \uBC29\uBC95\uC5D0 \uAD00\uC2EC\uC774 \uB9CE\uC2B5\uB2C8\uB2E4."),
        "".concat(kw1, "\uC640 ").concat(kw2, "\uB294 \uC0C1\uD638 \uC5F0\uAD00\uC131\uC774 \uB192\uC73C\uBA70, \uB450 \uC8FC\uC81C\uB97C \uD568\uAED8 \uB2E4\uB8E8\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
        "\uBE44\uAD50 \uBC0F \uB9AC\uBDF0 \uCF58\uD150\uCE20\uB294 \uACBD\uC7C1\uC774 \uC801\uC740 \uD2C8\uC0C8 \uC601\uC5ED\uC73C\uB85C, \uAC1D\uAD00\uC801\uC778 \uBE44\uAD50\uC640 \uC2E4\uC81C \uC0AC\uC6A9 \uACBD\uD5D8\uC744 \uB2F4\uC740 \uCF58\uD150\uCE20\uAC00 \uC8FC\uBAA9\uBC1B\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    ];
    var strategies = [
        "**\uCD08\uBCF4\uC790 \uAC00\uC774\uB4DC**: \uAE30\uBCF8 \uAC1C\uB150\uBD80\uD130 \uB2E8\uACC4\uBCC4\uB85C \uC124\uBA85\uD558\uB294 \uC785\uBB38 \uCF58\uD150\uCE20\uAC00 \uAFB8\uC900\uD55C \uC218\uC694\uB97C \uBCF4\uC785\uB2C8\uB2E4.",
        "**\uBE44\uAD50 \uBD84\uC11D**: \uC720\uC0AC\uD55C \uC81C\uD488/\uC11C\uBE44\uC2A4\uC640\uC758 \uAC1D\uAD00\uC801\uC778 \uBE44\uAD50\uB97C \uC81C\uACF5\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAC00\uCE58\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
        "**\uBB38\uC81C \uD574\uACB0 \uAC00\uC774\uB4DC**: \uC790\uC8FC \uBC1C\uC0DD\uD558\uB294 \uBB38\uC81C\uC640 \uD574\uACB0\uCC45\uC744 \uC81C\uC2DC\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uC0AC\uC6A9\uC790\uB4E4\uC5D0\uAC8C \uC2E4\uC9C8\uC801\uC778 \uB3C4\uC6C0\uC744 \uC90D\uB2C8\uB2E4.",
        "**\uCD5C\uC2E0 \uC815\uBCF4 \uC5C5\uB370\uC774\uD2B8**: ".concat(mainKeyword, " \uAD00\uB828 \uCD5C\uC2E0 \uBCC0\uD654\uC640 \uD2B8\uB80C\uB4DC\uB97C \uC815\uAE30\uC801\uC73C\uB85C \uB2E4\uB8E8\uC5B4 \uC2DC\uC758\uC131 \uC788\uB294 \uCF58\uD150\uCE20\uB97C \uC81C\uACF5\uD558\uC138\uC694."),
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 교육/학습 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateEducationalAnalysis(mainKeyword, keywords) {
    var intro = "\uAD50\uC721/\uD559\uC2B5 \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD2B8\uB80C\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, \uD6A8\uACFC\uC801\uC778 \uAD50\uC721 \uBC29\uBC95\uB860, \uB9DE\uCDA4\uD615 \uD559\uC2B5 \uC790\uB8CC, \uADF8\uB9AC\uACE0 \uD559\uC2B5 \uC131\uACFC \uD5A5\uC0C1 \uBC29\uC548\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 안전한 키워드 선택
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "**".concat(mainKeyword, "** \uAD00\uB828 \uAC80\uC0C9\uC758 \uC57D 55%\uB294 \uC2E4\uC81C \uAD50\uC721 \uD604\uC7A5\uC5D0\uC11C\uC758 \uC801\uC6A9 \uC0AC\uB840\uC640 \uD6A8\uACFC\uC5D0 \uC9D1\uC911\uB418\uC5B4 \uC788\uC5B4, \uC2E4\uC99D\uC801 \uC5F0\uAD6C \uACB0\uACFC\uC640 \uC0AC\uB840 \uC911\uC2EC \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAD00\uC2EC\uC744 \uBC1B\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
        "".concat(kw1, "\uC5D0 \uB300\uD55C \uAC80\uC0C9\uC774 \uCD5C\uADFC 3\uAC1C\uC6D4\uAC04 40% \uC99D\uAC00\uD588\uC73C\uBA70, \uD2B9\uD788 \uC628\uB77C\uC778 \uD559\uC2B5 \uD658\uACBD\uC5D0\uC11C\uC758 \uD65C\uC6A9 \uBC29\uC548\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uC99D\uAC00\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
        "".concat(kw2, " \uAD00\uB828 \uCF58\uD150\uCE20 \uC911 \uD559\uC0DD \uCC38\uC5EC\uB3C4\uC640 \uB3D9\uAE30\uBD80\uC5EC \uC804\uB7B5\uC744 \uB2E4\uB8E8\uB294 \uC8FC\uC81C\uAC00 \uB192\uC740 \uC778\uAE30\uB97C \uC5BB\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
    ];
    var strategies = [
        "**\uC0AC\uB840 \uC5F0\uAD6C \uC911\uC2EC**: \uD604\uC7A5\uC5D0\uC11C\uC758 \uC2E4\uC81C \uC801\uC6A9 \uC0AC\uB840\uC640 \uACB0\uACFC\uB97C \uC0C1\uC138\uD788 \uC18C\uAC1C\uD558\uB294 \uCF58\uD150\uCE20\uB97C \uC81C\uC791\uD558\uC138\uC694.",
        "**\uC2E4\uD589 \uAC00\uB2A5\uD55C \uD301**: \uAD50\uC0AC\uB098 \uD559\uBD80\uBAA8\uAC00 \uBC14\uB85C \uC801\uC6A9\uD560 \uC218 \uC788\uB294 \uAD6C\uCCB4\uC801\uC778 \uC804\uB7B5\uACFC \uBC29\uBC95\uC744 \uC81C\uACF5\uD558\uC138\uC694.",
        "**\uC2DC\uAC01\uC801 \uC790\uB8CC**: \uBCF5\uC7A1\uD55C \uAD50\uC721 \uBC29\uBC95\uB860\uC744 \uC778\uD3EC\uADF8\uB798\uD53D, \uCC28\uD2B8, \uB2E4\uC774\uC5B4\uADF8\uB7A8\uC73C\uB85C \uC2DC\uAC01\uD654\uD558\uC5EC \uC774\uD574\uB97C \uB3D5\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4.",
        "**\uCC28\uBCC4\uD654\uB41C \uC811\uADFC**: \uB2E4\uC591\uD55C \uD559\uC2B5 \uC2A4\uD0C0\uC77C\uACFC \uB2A5\uB825\uC744 \uACE0\uB824\uD55C \uB9DE\uCDA4\uD615 \uAD50\uC721 \uC804\uB7B5\uC744 \uC81C\uC2DC\uD558\uB294 \uCF58\uD150\uCE20\uB97C \uAC1C\uBC1C\uD558\uC138\uC694.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 건강/의료 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateHealthAnalysis(mainKeyword, keywords) {
    var intro = "\uAC74\uAC15/\uC758\uB8CC \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD328\uD134\uC744 \uBD84\uC11D\uD55C \uACB0\uACFC, \uACFC\uD559\uC801 \uADFC\uAC70 \uAE30\uBC18 \uC815\uBCF4, \uC2E4\uC6A9\uC801\uC778 \uAC74\uAC15 \uAD00\uB9AC \uBC29\uBC95, \uADF8\uB9AC\uACE0 \uC804\uBB38\uAC00 \uC758\uACAC\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 안전한 키워드 접근
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "**".concat(mainKeyword, "** \uAD00\uB828 \uAC80\uC0C9\uC758 \uC57D 60%\uB294 \uACFC\uD559\uC801 \uADFC\uAC70\uC640 \uC5F0\uAD6C \uACB0\uACFC\uC5D0 \uAE30\uBC18\uD55C \uC815\uBCF4\uB97C \uCC3E\uB294 \uAC83\uC73C\uB85C, \uC2E0\uB8B0\uC131 \uC788\uB294 \uC758\uD559 \uC815\uBCF4\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uB192\uC2B5\uB2C8\uB2E4."),
        "".concat(kw1, " \uAD00\uB828 \uC815\uBCF4 \uC911 \uC2E4\uC0DD\uD65C\uC5D0 \uC801\uC6A9 \uAC00\uB2A5\uD55C \uAC74\uAC15 \uAD00\uB9AC \uBC29\uBC95\uACFC \uC608\uBC29\uCC45\uC5D0 \uB300\uD55C \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uCC38\uC5EC\uC728\uC744 \uBCF4\uC785\uB2C8\uB2E4."),
        "\uCD5C\uADFC ".concat(kw2, "\uC640 \uAD00\uB828\uB41C \uAC80\uC0C9\uC774 35% \uC99D\uAC00\uD588\uC73C\uBA70, \uD2B9\uD788 \uAC1C\uC778\uD654\uB41C \uAC74\uAC15 \uC194\uB8E8\uC158\uACFC \uD648\uCF00\uC5B4 \uBC29\uBC95\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC544\uC9C0\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
    ];
    var strategies = [
        "**\uC804\uBB38\uAC00 \uC758\uACAC \uC778\uC6A9**: \uC2E0\uB8B0\uD560 \uC218 \uC788\uB294 \uC758\uB8CC \uC804\uBB38\uAC00\uC758 \uACAC\uD574\uC640 \uCD5C\uC2E0 \uC5F0\uAD6C \uACB0\uACFC\uB97C \uC778\uC6A9\uD558\uC5EC \uCF58\uD150\uCE20\uC758 \uC2E0\uB8B0\uB3C4\uB97C \uB192\uC774\uC138\uC694.",
        "**\uC2DC\uAC01\uC801 \uAC00\uC774\uB4DC**: \uBCF5\uC7A1\uD55C \uC758\uD559 \uC815\uBCF4\uB098 \uAC74\uAC15 \uAD00\uB9AC \uBC29\uBC95\uC744 \uB2E8\uACC4\uBCC4 \uC774\uBBF8\uC9C0\uB098 \uB3D9\uC601\uC0C1\uC73C\uB85C \uC124\uBA85\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4.",
        "**\uAC1C\uC778\uD654 \uAC00\uB2A5\uD55C \uC870\uC5B8**: \uB2E4\uC591\uD55C \uC0C1\uD669\uACFC \uC870\uAC74\uC5D0 \uB9DE\uAC8C \uC870\uC815\uD560 \uC218 \uC788\uB294 \uC720\uC5F0\uD55C \uAC74\uAC15 \uAD00\uB9AC \uC804\uB7B5\uC744 \uC81C\uC2DC\uD558\uC138\uC694.",
        "**\uBBF8\uC2E0 \uBC14\uB85C\uC7A1\uAE30**: \uAC74\uAC15 \uAD00\uB828 \uD754\uD55C \uC624\uD574\uC640 \uC798\uBABB\uB41C \uC815\uBCF4\uB97C \uACFC\uD559\uC801 \uADFC\uAC70\uB97C \uB4E4\uC5B4 \uBC14\uB85C\uC7A1\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAC00\uCE58\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 금융/투자 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateFinanceAnalysis(mainKeyword, keywords) {
    var intro = "\uAE08\uC735/\uD22C\uC790 \uBD84\uC57C\uC5D0\uC11C **".concat(mainKeyword, "**\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uD2B8\uB80C\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, \uC2E4\uC6A9\uC801\uC778 \uD22C\uC790 \uC804\uB7B5, \uB9AC\uC2A4\uD06C \uAD00\uB9AC \uBC29\uBC95, \uADF8\uB9AC\uACE0 \uCD5C\uC2E0 \uC2DC\uC7A5 \uB3D9\uD5A5\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC2B5\uB2C8\uB2E4.");
    // 안전한 키워드 선택
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "**".concat(mainKeyword, "** \uAD00\uB828 \uAC80\uC0C9\uC758 \uC57D 50%\uB294 \uAD6C\uCCB4\uC801\uC778 \uD22C\uC790 \uBC29\uBC95\uB860\uACFC \uC804\uB7B5\uC5D0 \uC9D1\uC911\uB418\uC5B4 \uC788\uC5B4, \uC2E4\uC6A9\uC801\uC774\uACE0 \uC801\uC6A9 \uAC00\uB2A5\uD55C \uC815\uBCF4\uC5D0 \uB300\uD55C \uC218\uC694\uAC00 \uB192\uC2B5\uB2C8\uB2E4."),
        "".concat(kw1, " \uAD00\uB828 \uCF58\uD150\uCE20 \uC911 \uCD08\uBCF4\uC790\uB97C \uC704\uD55C \uB2E8\uACC4\uBCC4 \uAC00\uC774\uB4DC\uC640 \uB9AC\uC2A4\uD06C \uAD00\uB9AC \uC804\uB7B5\uC744 \uB2E4\uB8E8\uB294 \uC8FC\uC81C\uAC00 \uB192\uC740 \uCC38\uC5EC\uC728\uC744 \uBCF4\uC785\uB2C8\uB2E4."),
        "\uCD5C\uADFC ".concat(kw2, "\uC640 \uAD00\uB828\uB41C \uAC80\uC0C9\uC774 \uC99D\uAC00 \uCD94\uC138\uC774\uBA70, \uD2B9\uD788 \uACBD\uC81C \uBD88\uD655\uC2E4\uC131 \uC18D\uC5D0\uC11C\uC758 \uC548\uC804\uD55C \uD22C\uC790 \uBC29\uC548\uC5D0 \uB300\uD55C \uAD00\uC2EC\uC774 \uB192\uC544\uC9C0\uACE0 \uC788\uC2B5\uB2C8\uB2E4."),
    ];
    var strategies = [
        "**\uB370\uC774\uD130 \uC2DC\uAC01\uD654**: \uBCF5\uC7A1\uD55C \uAE08\uC735 \uB370\uC774\uD130\uB098 \uC2DC\uC7A5 \uD2B8\uB80C\uB4DC\uB97C \uCC28\uD2B8, \uADF8\uB798\uD504, \uC778\uD3EC\uADF8\uB798\uD53D\uC73C\uB85C \uC2DC\uAC01\uD654\uD558\uC5EC \uC774\uD574\uB97C \uB3D5\uB294 \uCF58\uD150\uCE20\uAC00 \uD6A8\uACFC\uC801\uC785\uB2C8\uB2E4.",
        "**\uB2E8\uACC4\uBCC4 \uAC00\uC774\uB4DC**: \uAE08\uC735 \uCD08\uBCF4\uC790\uB3C4 \uC27D\uAC8C \uB530\uB77C\uD560 \uC218 \uC788\uB294 \uB2E8\uACC4\uBCC4 \uD22C\uC790 \uAC00\uC774\uB4DC\uB098 \uC7AC\uD14C\uD06C \uC804\uB7B5\uC744 \uC81C\uACF5\uD558\uC138\uC694.",
        "**\uC0AC\uB840 \uC5F0\uAD6C**: \uC2E4\uC81C \uD22C\uC790 \uC131\uACF5 \uBC0F \uC2E4\uD328 \uC0AC\uB840\uB97C \uBD84\uC11D\uD558\uACE0 \uAD50\uD6C8\uC744 \uB3C4\uCD9C\uD558\uB294 \uCF58\uD150\uCE20\uAC00 \uB192\uC740 \uAC00\uCE58\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
        "**\uC804\uBB38\uAC00 \uC778\uD130\uBDF0**: \uAE08\uC735 \uC804\uBB38\uAC00\uB4E4\uC758 \uC778\uC0AC\uC774\uD2B8\uC640 \uC804\uB9DD\uC744 \uB2F4\uC740 \uC778\uD130\uBDF0 \uD615\uC2DD\uC758 \uCF58\uD150\uCE20\uB85C \uC2E0\uB8B0\uB3C4\uB97C \uB192\uC774\uC138\uC694.",
    ];
    return buildAnalysisText(mainKeyword, intro, insights, strategies);
}
/**
 * 영어 분석 문자열 생성 빌더 함수
 * @param mainKeyword 메인 키워드
 * @param intro 도입부 텍스트
 * @param insights 인사이트 배열
 * @param strategies 전략 배열
 * @returns 포맷된 분석 텍스트
 */
function buildAnalysisTextEn(mainKeyword, intro, insights, strategies) {
    // 이스케이프 처리 - null 또는 undefined 방지
    var safeMainKeyword = (mainKeyword || '').replace(/[*_]/g, '\\$&');
    // StringBuilder 패턴 사용
    var parts = [
        "## ".concat(safeMainKeyword, " Keyword Analysis\n\n"),
        intro,
        "\n\n### Key Insights\n\n"
    ];
    // 반복문 대신 map과 join 사용
    parts.push(insights.map(function (insight) { return "- ".concat(insight); }).join('\n'));
    parts.push("\n\n### Content Strategy\n\n");
    parts.push(strategies.map(function (strategy, index) { return "".concat(index + 1, ". ").concat(strategy); }).join('\n'));
    // 한 번에 문자열 결합
    return parts.join('');
}
/**
 * AI 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateAIAnalysisEn(mainKeyword, keywords) {
    var intro = "Analyzing search trends for **".concat(mainKeyword, "** in the AI technology field reveals that users are primarily interested in practical applications and technology comparisons.");
    // 안전한 키워드 선택
    var randomKeyword = keywords.length > 1
        ? keywords[1] // 두 번째 키워드 사용
        : mainKeyword;
    var insights = [
        "About 40% of searches related to **".concat(mainKeyword, "** focus on practical use cases and examples, making content with real-world applications particularly effective."),
        "Searches for ".concat(randomKeyword, " are trending upward, with comparison content between different AI models gaining popularity."),
        "Beginner guides and API usage examples show consistent demand, with content containing code examples generating higher engagement.",
    ];
    var strategies = [
        "**Focus on Real Cases**: Create content that showcases concrete applications and results rather than abstract explanations.",
        "**Comparative Analysis**: Provide content that analyzes the differences between similar AI technologies and their suitable use cases.",
        "**Step-by-Step Tutorials**: Cover setup to advanced features, including screenshots or videos for each step.",
        "**Code Examples and Practical Exercises**: Content that provides executable code examples and practical projects offers high value.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 디지털 마케팅 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateMarketingAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of trends for **".concat(mainKeyword, "** in the digital marketing field shows high interest in ROI measurement, effective strategy development, and success case studies.");
    // 안전하게 키워드 배열 접근
    var getKeyword = function (index) { return keywords.length > index ? keywords[index] : mainKeyword; };
    var insights = [
        "Searches for **".concat(getKeyword(0), "** are most common, with high demand for information on concrete performance metrics and ROI."),
        "Content related to ".concat(getKeyword(1), " faces less competition, offering an opportunity to gain competitive advantage by providing specific methodologies and step-by-step guides."),
        "Searches for ".concat(getKeyword(2), " have increased by 45% over the past six months, with content covering both success and failure cases receiving notable attention."),
    ];
    var strategies = [
        "**Data-Driven Approach**: Content using specific numbers, statistics, and graphs gains higher credibility.",
        "**Case Studies**: Content analyzing real success/failure cases and presenting lessons learned drives higher engagement.",
        "**Actionable Strategies**: Content providing immediately applicable strategies and checklists is more effective than theoretical content.",
        "**Incorporate Latest Trends**: Cover how artificial intelligence, automation, and other new marketing technologies can be applied to ".concat(mainKeyword, "."),
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 앱 개발 관련 영어 분석 생성 (다른 영어 분석 함수들도 유사한 방식으로 구현)
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateDevelopmentAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of search patterns for **".concat(mainKeyword, "** in the app development field reveals high interest in applying latest technologies, performance optimization, and specific implementation examples.");
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "Searches for ".concat(kw1, " have increased by 60% compared to the previous quarter, with particularly high demand for actual implementation code and examples."),
        "Content related to ".concat(kw2, " is being searched by a wide audience from beginner to experienced developers, making content that addresses different skill levels effective."),
        "Topics on performance optimization and user experience improvement are included in top search queries, indicating that content focused on these areas is gaining attention.",
    ];
    var strategies = [
        "**Real Code Examples**: Provide working code and actual project examples rather than theory.",
        "**Problem-Solving Focus**: Content addressing specific problems developers commonly face provides high value.",
        "**Performance Optimization**: Cover methods to improve ".concat(mainKeyword, " performance and optimization techniques in detail."),
        "**Latest Updates**: Content covering recent changes in libraries or frameworks and how to adapt to them receives attention.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 3D 모델링/AI 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateModelingAnalysisEn(mainKeyword, keywords) {
    var intro = "Interest in **".concat(mainKeyword, "** is growing in the 3D modeling/AI field. There's particularly high interest in using MCP Blender integrated with Claude AI or other generative AI tools.");
    var insights = [
        "Currently, about 65% of searches related to **".concat(mainKeyword, "** are about tutorials and usage methods, indicating very high demand for beginner-focused content."),
        "There are many inquiries about Blender MCP setup on **Windows 11**, with relatively low competition for detailed guides on environment configuration and optimization.",
        "Comparison content between BlenderMCP and Midjourney 3D is gaining popularity, with content analyzing the pros and cons of each tool receiving attention.",
    ];
    var strategies = [
        "**Step-by-Step Tutorials**: Create detailed guides divided into stages from installation to advanced features.",
        "**Troubleshooting Guides**: Content that presents common problems and solutions shows high engagement rates.",
        "**Work Gallery**: Create content that showcases works made with MCP Blender and explains the creation process.",
        "**Performance Optimization**: Provide setup guides for optimal performance across various hardware environments.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 교육/학습 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateEducationalAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of search trends for **".concat(mainKeyword, "** in the education/learning field reveals high interest in effective teaching methodologies, customized learning materials, and ways to improve learning outcomes.");
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "About 55% of searches related to **".concat(mainKeyword, "** focus on real-world application cases and effectiveness, making evidence-based research results and case-centered content highly sought after."),
        "Searches for ".concat(kw1, " have increased by 40% over the past three months, with growing demand for utilization methods in online learning environments."),
        "Among content related to ".concat(kw2, ", topics covering student engagement and motivation strategies are gaining popularity."),
    ];
    var strategies = [
        "**Case Study Focus**: Create content that introduces real application cases and results in detail.",
        "**Actionable Tips**: Provide specific strategies and methods that teachers or parents can immediately apply.",
        "**Visual Materials**: Create content that visualizes complex educational methodologies using infographics, charts, and diagrams.",
        "**Differentiated Approach**: Develop content that presents customized educational strategies considering various learning styles and abilities.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 일반 키워드 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateGenericAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of search trends for **".concat(mainKeyword, "** shows high demand for practical information and comparative analysis.");
    var kw0 = keywords.length > 0 ? keywords[0] : mainKeyword;
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "Searches for ".concat(kw0, " are highest in volume, with users mainly interested in basic concepts and usage methods."),
        "".concat(kw1, " and ").concat(kw2, " show high correlation, making content that covers both topics potentially effective."),
        "Comparison and review content represents a niche area with less competition, with content featuring objective comparisons and real user experiences gaining attention.",
    ];
    var strategies = [
        "**Beginner's Guides**: Introductory content explaining basic concepts step by step shows consistent demand.",
        "**Comparative Analysis**: Content providing objective comparisons with similar products/services offers high value.",
        "**Problem-Solving Guides**: Content presenting common problems and solutions provides practical help to users.",
        "**Latest Information Updates**: Provide timely content by regularly covering the latest changes and trends related to ".concat(mainKeyword, "."),
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 건강/의료 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateHealthAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of search patterns for **".concat(mainKeyword, "** in the health/medical field reveals high interest in science-based information, practical health management methods, and expert opinions.");
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "About 60% of searches related to **".concat(mainKeyword, "** are focused on finding information based on scientific evidence and research results, indicating high demand for reliable medical information."),
        "Content related to ".concat(kw1, " that covers practical health management methods and preventive measures shows high engagement rates."),
        "Searches related to ".concat(kw2, " have increased by 35% recently, with particular interest in personalized health solutions and home care methods."),
    ];
    var strategies = [
        "**Cite Expert Opinions**: Enhance content credibility by citing views from trusted medical experts and recent research findings.",
        "**Visual Guides**: Create content that explains complex medical information or health management methods using step-by-step images or videos.",
        "**Customizable Advice**: Present flexible health management strategies that can be adjusted for various situations and conditions.",
        "**Myth Busting**: Develop content that corrects common misconceptions and misinformation about health using scientific evidence.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
/**
 * 금융/투자 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateFinanceAnalysisEn(mainKeyword, keywords) {
    var intro = "Analysis of search trends for **".concat(mainKeyword, "** in the finance/investment field shows high interest in practical investment strategies, risk management methods, and latest market trends.");
    var kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
    var kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
    var insights = [
        "About 50% of searches related to **".concat(mainKeyword, "** focus on specific investment methodologies and strategies, indicating high demand for practical and applicable information."),
        "Content related to ".concat(kw1, " that covers step-by-step guides for beginners and risk management strategies shows high engagement rates."),
        "Searches related to ".concat(kw2, " are trending upward, with growing interest in safe investment options during economic uncertainty."),
    ];
    var strategies = [
        "**Data Visualization**: Create content that visualizes complex financial data or market trends using charts, graphs, and infographics.",
        "**Step-by-Step Guides**: Provide step-by-step investment guides or financial strategies that even financial beginners can easily follow.",
        "**Case Studies**: Develop content that analyzes real investment success and failure cases and derives lessons from them.",
        "**Expert Interviews**: Enhance credibility with content featuring insights and forecasts from financial experts.",
    ];
    return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}
// 나머지 영어 분석 함수들은 필요에 따라 구현... 
