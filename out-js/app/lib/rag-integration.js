/**
 * RAG 시스템과 로깅 시스템 통합 유틸리티
 * KeywordPulse 프로젝트의 RAG 기반 텍스트 생성과 로깅 인프라를 연결합니다.
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
 * 키워드 데이터로부터 RAG 분석 텍스트를 생성하고 로깅합니다.
 */
export function generateRagAnalysis(keywords_1) {
    return __awaiter(this, arguments, void 0, function (keywords, options) {
        var startTime, _a, templateType, _b, maxKeywords, _c, scoreThreshold_1, _d, includeStats, filteredKeywords, analysisText, endTime, generationTime;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_e) {
            startTime = Date.now();
            try {
                _a = options.templateType, templateType = _a === void 0 ? 'basic' : _a, _b = options.maxKeywords, maxKeywords = _b === void 0 ? 5 : _b, _c = options.scoreThreshold, scoreThreshold_1 = _c === void 0 ? 60 : _c, _d = options.includeStats, includeStats = _d === void 0 ? true : _d;
                // 로깅: 분석 시작
                logger.log({
                    message: 'RAG 분석 시작',
                    context: {
                        keywordCount: keywords.length,
                        options: options
                    },
                    tags: { module: 'rag_engine', action: 'start' }
                });
                filteredKeywords = keywords
                    .filter(function (kw) { return kw.score >= scoreThreshold_1; })
                    .sort(function (a, b) { return b.score - a.score; })
                    .slice(0, maxKeywords);
                // 결과가 없는 경우 처리
                if (filteredKeywords.length === 0) {
                    logger.log({
                        message: 'RAG 분석: 필터링 후 키워드 없음',
                        level: 'warn',
                        context: { scoreThreshold: scoreThreshold_1 },
                        tags: { module: 'rag_engine' }
                    });
                    return [2 /*return*/, '분석할 키워드가 충분하지 않습니다. 점수 기준을 낮추거나 더 많은 키워드를 추가해 주세요.'];
                }
                analysisText = '';
                switch (templateType) {
                    case 'detailed':
                        analysisText = generateDetailedTemplate(filteredKeywords, includeStats);
                        break;
                    case 'marketing':
                        analysisText = generateMarketingTemplate(filteredKeywords, includeStats);
                        break;
                    case 'basic':
                    default:
                        analysisText = generateBasicTemplate(filteredKeywords, includeStats);
                        break;
                }
                endTime = Date.now();
                generationTime = endTime - startTime;
                // 로깅: 분석 완료
                logger.log({
                    message: 'RAG 분석 완료',
                    context: {
                        templateType: templateType,
                        filteredKeywordCount: filteredKeywords.length,
                        originalKeywordCount: keywords.length,
                        outputLength: analysisText.length,
                        generationTimeMs: generationTime
                    },
                    tags: { module: 'rag_engine', action: 'complete' }
                });
                return [2 /*return*/, analysisText];
            }
            catch (error) {
                // 로깅: 분석 중 오류
                logger.error({
                    message: 'RAG 분석 오류',
                    error: error,
                    context: {
                        keywordCount: keywords.length,
                        options: options
                    },
                    tags: { module: 'rag_engine', action: 'error' }
                });
                // 에러 발생 시 기본 메시지 반환
                return [2 /*return*/, '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.'];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * 기본 분석 템플릿 생성
 */
function generateBasicTemplate(keywords, includeStats) {
    var topKeyword = keywords[0];
    var summary = "## \uD0A4\uC6CC\uB4DC \uBD84\uC11D \uACB0\uACFC\n\n";
    summary += "\uC774\uBC88 \uBD84\uC11D\uB41C \uD0A4\uC6CC\uB4DC \uC911 **'".concat(topKeyword.keyword, "'**\uAC00 \uAC00\uC7A5 \uB192\uC740 \uCD94\uCC9C \uC810\uC218\uC778 ").concat(topKeyword.score, "\uC810\uC744 \uAE30\uB85D\uD588\uC2B5\uB2C8\uB2E4.\n\n");
    summary += "### \uCD94\uCC9C \uD0A4\uC6CC\uB4DC \uBAA9\uB85D\n\n";
    for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
        var kw = keywords_1[_i];
        summary += "- **".concat(kw.keyword, "**").concat(includeStats ? ": \uAC80\uC0C9\uB7C9 ".concat(kw.monthlySearches.toLocaleString(), "\uD68C, \uC810\uC218 ").concat(kw.score, "\uC810") : '', "\n");
    }
    summary += "\n80\uC810 \uC774\uC0C1 \uD0A4\uC6CC\uB4DC\uB294 \uCF58\uD150\uCE20 \uC81C\uC791 \uC6B0\uC120\uC21C\uC704\uB85C \uACE0\uB824\uD558\uC138\uC694.";
    return summary;
}
/**
 * 상세 분석 템플릿 생성
 */
function generateDetailedTemplate(keywords, includeStats) {
    var topKeyword = keywords[0];
    var summary = "## \uC0C1\uC138 \uD0A4\uC6CC\uB4DC \uBD84\uC11D \uBCF4\uACE0\uC11C\n\n";
    summary += "\uCD1D ".concat(keywords.length, "\uAC1C \uD0A4\uC6CC\uB4DC\uB97C \uBD84\uC11D\uD55C \uACB0\uACFC, **'").concat(topKeyword.keyword, "'**\uAC00 ").concat(topKeyword.score, "\uC810\uC73C\uB85C \uCD5C\uACE0 \uC810\uC218\uB97C \uAE30\uB85D\uD588\uC2B5\uB2C8\uB2E4.\n\n");
    if (includeStats) {
        summary += "### \uBD84\uC11D \uC9C0\uD45C \uC124\uBA85\n\n";
        summary += "- **\uAC80\uC0C9\uB7C9**: \uC6D4\uAC04 \uAC80\uC0C9 \uD69F\uC218\n";
        summary += "- **\uACBD\uC7C1\uB960**: 0~1 \uC0AC\uC774 \uAC12 (\uB192\uC744\uC218\uB85D \uACBD\uC7C1 \uCE58\uC5F4)\n";
        summary += "- **\uC810\uC218**: \uAC80\uC0C9\uB7C9\uACFC \uACBD\uC7C1\uB960\uC744 \uACE0\uB824\uD55C \uC885\uD569 \uC810\uC218 (100\uC810 \uB9CC\uC810)\n\n";
    }
    summary += "### \uC8FC\uC694 \uCD94\uCC9C \uD0A4\uC6CC\uB4DC\n\n";
    summary += "| \uD0A4\uC6CC\uB4DC | \uAC80\uC0C9\uB7C9 | \uACBD\uC7C1\uB960 | \uC885\uD569 \uC810\uC218 |\n";
    summary += "|--------|---------|---------|----------|\n";
    for (var _i = 0, keywords_2 = keywords; _i < keywords_2.length; _i++) {
        var kw = keywords_2[_i];
        summary += "| ".concat(kw.keyword, " | ").concat(kw.monthlySearches.toLocaleString(), " | ").concat(kw.competitionRate.toFixed(2), " | ").concat(kw.score, " |\n");
    }
    summary += "\n### \uD65C\uC6A9 \uC804\uB7B5\n\n";
    summary += "- 80\uC810 \uC774\uC0C1: \uD575\uC2EC \uCF58\uD150\uCE20\uB85C \uAC1C\uBC1C\n";
    summary += "- 70-79\uC810: \uBCF4\uC870 \uCF58\uD150\uCE20\uB85C \uD65C\uC6A9\n";
    summary += "- 60-69\uC810: \uC7A5\uAE30\uC801 \uCF58\uD150\uCE20 \uACC4\uD68D\uC5D0 \uD3EC\uD568\n";
    return summary;
}
/**
 * 마케팅 분석 템플릿 생성
 */
function generateMarketingTemplate(keywords, includeStats) {
    var highScoreKeywords = keywords.filter(function (kw) { return kw.score >= 80; });
    var midScoreKeywords = keywords.filter(function (kw) { return kw.score >= 70 && kw.score < 80; });
    var summary = "## \uB9C8\uCF00\uD305 \uD0A4\uC6CC\uB4DC \uC778\uC0AC\uC774\uD2B8\n\n";
    if (highScoreKeywords.length > 0) {
        summary += "### \uD83D\uDD25 \uC6B0\uC120\uC21C\uC704 \uD0A4\uC6CC\uB4DC\n\n";
        for (var _i = 0, highScoreKeywords_1 = highScoreKeywords; _i < highScoreKeywords_1.length; _i++) {
            var kw = highScoreKeywords_1[_i];
            summary += "- **".concat(kw.keyword, "**").concat(includeStats ? " (\uC810\uC218: ".concat(kw.score, ", \uAC80\uC0C9\uB7C9: ").concat(kw.monthlySearches.toLocaleString(), ")") : '', "\n");
        }
        summary += "\n";
    }
    if (midScoreKeywords.length > 0) {
        summary += "### \u2B50 \uC7A0\uC7AC\uB825 \uD0A4\uC6CC\uB4DC\n\n";
        for (var _a = 0, midScoreKeywords_1 = midScoreKeywords; _a < midScoreKeywords_1.length; _a++) {
            var kw = midScoreKeywords_1[_a];
            summary += "- **".concat(kw.keyword, "**").concat(includeStats ? " (\uC810\uC218: ".concat(kw.score, ", \uAC80\uC0C9\uB7C9: ").concat(kw.monthlySearches.toLocaleString(), ")") : '', "\n");
        }
        summary += "\n";
    }
    summary += "### \uB9C8\uCF00\uD305 \uC804\uB7B5 \uC81C\uC548\n\n";
    if (highScoreKeywords.length > 0) {
        summary += "- **".concat(highScoreKeywords[0].keyword, "**").concat(highScoreKeywords.length > 1 ? "\uC640(\uACFC) **".concat(highScoreKeywords[1].keyword, "**") : '', "\uB97C \uC911\uC2EC\uC73C\uB85C \uD575\uC2EC \uCF58\uD150\uCE20 \uAC1C\uBC1C\n");
    }
    summary += "- \uAC80\uC0C9 \uAD11\uACE0, SEO, \uC18C\uC15C \uBBF8\uB514\uC5B4\uC5D0 \uC774 \uD0A4\uC6CC\uB4DC\uB4E4 \uC911\uC810\uC801\uC73C\uB85C \uD65C\uC6A9\n";
    summary += "- \uB2E8\uAE30 \uD2B8\uB798\uD53D \uC99D\uAC00\uB294 \uC6B0\uC120\uC21C\uC704 \uD0A4\uC6CC\uB4DC, \uC7A5\uAE30\uC801 \uC131\uC7A5\uC740 \uC7A0\uC7AC\uB825 \uD0A4\uC6CC\uB4DC\uC5D0 \uC9D1\uC911\n";
    return summary;
}
export default {
    generateRagAnalysis: generateRagAnalysis
};
