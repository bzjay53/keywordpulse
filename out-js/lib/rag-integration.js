/**
 * RAG 통합 모듈
 * RAG 엔진을 텔레그램 및 기타 시스템과 통합하기 위한 모듈입니다.
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
import ragEngine from './rag_engine';
import { sendTelegramMessage } from './telegram';
// 캐시 스토리지 객체
var resultCache = {};
// 캐시 유효 기간(밀리초) - 기본 30분
var CACHE_TTL = 30 * 60 * 1000;
/**
 * 캐시키 생성 함수
 */
function generateCacheKey(query, options) {
    var maxResults = options.maxResults, threshold = options.threshold, outputType = options.outputType, language = options.language;
    return "".concat(query, "_").concat(maxResults, "_").concat(threshold, "_").concat(outputType, "_").concat(language);
}
/**
 * RAG 쿼리를 처리하고 응답을 반환합니다.
 * @param query 사용자 쿼리
 * @param options 통합 옵션
 * @returns RAG 통합 응답
 */
export function processRagQuery(query_1) {
    return __awaiter(this, arguments, void 0, function (query, options) {
        var startTime, _a, maxResults, _b, threshold, _c, formatOutput, _d, includeCitations, _e, outputType, _f, language, _g, cacheResults, _h, timeout, cacheKey, cachedResult, queryPromise, timeoutPromise, result, executionTime, response, cacheKey, cacheKeys, oldestKey, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    startTime = Date.now();
                    _a = options.maxResults, maxResults = _a === void 0 ? 5 : _a, _b = options.threshold, threshold = _b === void 0 ? 0.7 : _b, _c = options.formatOutput, formatOutput = _c === void 0 ? true : _c, _d = options.includeCitations, includeCitations = _d === void 0 ? true : _d, _e = options.outputType, outputType = _e === void 0 ? 'text' : _e, _f = options.language, language = _f === void 0 ? 'ko' : _f, _g = options.cacheResults, cacheResults = _g === void 0 ? true : _g, _h = options.timeout, timeout = _h === void 0 ? 30000 // 기본 타임아웃 30초
                     : _h;
                    // 캐시 결과 확인
                    if (cacheResults) {
                        cacheKey = generateCacheKey(query, options);
                        cachedResult = resultCache[cacheKey];
                        if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
                            logger.log({
                                message: "RAG \uCFFC\uB9AC \uCE90\uC2DC \uACB0\uACFC \uC0AC\uC6A9: \"".concat(query, "\""),
                                level: 'info',
                                context: { cached: true, cacheAge: Date.now() - cachedResult.timestamp }
                            });
                            return [2 /*return*/, __assign(__assign({}, cachedResult.response), { cached: true })];
                        }
                    }
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 3, , 4]);
                    queryPromise = executeRagQuery(query, maxResults, threshold, formatOutput, includeCitations, outputType, language);
                    timeoutPromise = new Promise(function (_, reject) {
                        setTimeout(function () { return reject(new Error('쿼리 처리 시간 초과')); }, timeout);
                    });
                    return [4 /*yield*/, Promise.race([queryPromise, timeoutPromise])];
                case 2:
                    result = _j.sent();
                    executionTime = Date.now() - startTime;
                    response = __assign(__assign({}, result), { executionTime: executionTime, language: language });
                    // 결과 캐싱
                    if (cacheResults) {
                        cacheKey = generateCacheKey(query, options);
                        resultCache[cacheKey] = {
                            response: response,
                            timestamp: Date.now()
                        };
                        cacheKeys = Object.keys(resultCache);
                        if (cacheKeys.length > 100) {
                            oldestKey = cacheKeys.reduce(function (oldest, key) {
                                return resultCache[key].timestamp < resultCache[oldest].timestamp ? key : oldest;
                            }, cacheKeys[0]);
                            delete resultCache[oldestKey];
                        }
                    }
                    return [2 /*return*/, response];
                case 3:
                    error_1 = _j.sent();
                    logger.error({
                        message: "RAG \uCFFC\uB9AC \uCC98\uB9AC \uC2E4\uD328: ".concat(error_1.message),
                        error: error_1,
                        context: { query: query, options: options, executionTime: Date.now() - startTime }
                    });
                    return [2 /*return*/, {
                            originalQuery: query,
                            answer: getErrorMessage(error_1.message, language),
                            sources: [],
                            success: false,
                            error: error_1.message,
                            language: language,
                            executionTime: Date.now() - startTime
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 언어에 따른 오류 메시지 반환
 */
function getErrorMessage(errorMsg, language) {
    if (language === 'en') {
        return "An error occurred during processing: ".concat(errorMsg);
    }
    return "\uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4: ".concat(errorMsg);
}
/**
 * RAG 쿼리 실행 함수
 */
function executeRagQuery(query, maxResults, threshold, formatOutput, includeCitations, outputType, language) {
    return __awaiter(this, void 0, void 0, function () {
        var searchResults, noResultsMessage, generationResult, formattedAnswer, sources;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.log({
                        message: "RAG \uCFFC\uB9AC \uCC98\uB9AC \uC2DC\uC791: \"".concat(query, "\""),
                        level: 'info',
                        context: { maxResults: maxResults, threshold: threshold, outputType: outputType, language: language }
                    });
                    return [4 /*yield*/, ragEngine.search(query, { maxResults: maxResults, threshold: threshold })];
                case 1:
                    searchResults = _a.sent();
                    // 2. 검색 결과가 없으면 빈 응답 반환
                    if (!searchResults.results || searchResults.results.length === 0) {
                        noResultsMessage = language === 'en'
                            ? 'Sorry, I could not find relevant information.'
                            : '죄송합니다. 적절한 정보를 찾을 수 없습니다.';
                        return [2 /*return*/, {
                                originalQuery: query,
                                answer: noResultsMessage,
                                sources: [],
                                success: true
                            }];
                    }
                    return [4 /*yield*/, ragEngine.generate(query, searchResults)];
                case 2:
                    generationResult = _a.sent();
                    formattedAnswer = generationResult.generatedContent;
                    sources = generationResult.citations || [];
                    if (formatOutput) {
                        formattedAnswer = formatRagOutput(formattedAnswer, sources, includeCitations, outputType, language);
                    }
                    return [2 /*return*/, {
                            originalQuery: query,
                            answer: formattedAnswer,
                            sources: sources,
                            success: true
                        }];
            }
        });
    });
}
/**
 * RAG 결과를 텔레그램 메시지로 전송합니다.
 * @param query 사용자 쿼리
 * @param chatId 텔레그램 채팅 ID
 * @param botToken 텔레그램 봇 토큰
 * @param options 통합 옵션
 * @returns 전송 성공 여부
 */
export function sendRagResponseToTelegram(query_1, chatId_1, botToken_1) {
    return __awaiter(this, arguments, void 0, function (query, chatId, botToken, options) {
        var telegramOptions, ragResponse, error_2, errorMessage, sendError_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 8]);
                    telegramOptions = __assign(__assign({}, options), { formatOutput: true, outputType: 'html', includeCitations: true });
                    return [4 /*yield*/, processRagQuery(query, telegramOptions)];
                case 1:
                    ragResponse = _a.sent();
                    // 텔레그램 메시지 전송
                    return [4 /*yield*/, sendTelegramMessage(botToken, {
                            chat_id: chatId,
                            text: ragResponse.answer,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true
                        })];
                case 2:
                    // 텔레그램 메시지 전송
                    _a.sent();
                    logger.log({
                        message: "RAG \uC751\uB2F5\uC744 \uD154\uB808\uADF8\uB7A8\uC73C\uB85C \uC804\uC1A1 \uC644\uB8CC: chatId=".concat(chatId),
                        level: 'info',
                        context: {
                            query: query,
                            success: ragResponse.success,
                            executionTime: ragResponse.executionTime,
                            cached: ragResponse.cached
                        }
                    });
                    return [2 /*return*/, true];
                case 3:
                    error_2 = _a.sent();
                    logger.error({
                        message: "RAG \uC751\uB2F5 \uD154\uB808\uADF8\uB7A8 \uC804\uC1A1 \uC2E4\uD328: ".concat(error_2.message),
                        error: error_2,
                        context: { query: query, chatId: chatId }
                    });
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    errorMessage = options.language === 'en'
                        ? "Error processing query: ".concat(error_2.message)
                        : "\uCFFC\uB9AC \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4: ".concat(error_2.message);
                    return [4 /*yield*/, sendTelegramMessage(botToken, {
                            chat_id: chatId,
                            text: errorMessage,
                            parse_mode: 'HTML'
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    sendError_1 = _a.sent();
                    logger.error({
                        message: "\uC624\uB958 \uBA54\uC2DC\uC9C0 \uD154\uB808\uADF8\uB7A8 \uC804\uC1A1 \uC2E4\uD328: ".concat(sendError_1.message),
                        error: sendError_1
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * RAG 출력을 지정된 형식으로 포맷팅합니다.
 * @param content 생성된 콘텐츠
 * @param sources 인용 소스
 * @param includeCitations 인용 포함 여부
 * @param outputType 출력 형식
 * @param language 출력 언어
 * @returns 포맷팅된 출력
 */
function formatRagOutput(content, sources, includeCitations, outputType, language) {
    if (language === void 0) { language = 'ko'; }
    // 기본 콘텐츠 반환
    if (!includeCitations || !sources || sources.length === 0) {
        return content;
    }
    // 인용 정보 추가
    var formattedOutput = content;
    var citationsSection = '';
    // 언어별 출처 텍스트
    var sourcesTitle = language === 'en' ? 'Sources:' : '출처:';
    // 출력 유형에 따라 포맷팅
    if (outputType === 'html') {
        // HTML 포맷
        citationsSection = "\n\n<b>".concat(sourcesTitle, "</b>\n<ul>");
        sources.forEach(function (source, index) {
            var _a;
            var sourceInfo = ((_a = source.metadata) === null || _a === void 0 ? void 0 : _a.source) || (language === 'en' ? "Source ".concat(index + 1) : "\uCD9C\uCC98 ".concat(index + 1));
            citationsSection += "<li>".concat(sourceInfo, "</li>");
        });
        citationsSection += '</ul>';
        formattedOutput = "".concat(content).concat(citationsSection);
    }
    else if (outputType === 'markdown') {
        // 마크다운 포맷
        citationsSection = "\n\n**".concat(sourcesTitle, "**\n");
        sources.forEach(function (source, index) {
            var _a;
            var sourceInfo = ((_a = source.metadata) === null || _a === void 0 ? void 0 : _a.source) || (language === 'en' ? "Source ".concat(index + 1) : "\uCD9C\uCC98 ".concat(index + 1));
            citationsSection += "- ".concat(sourceInfo, "\n");
        });
        formattedOutput = "".concat(content).concat(citationsSection);
    }
    else {
        // 일반 텍스트 포맷
        citationsSection = "\n\n".concat(sourcesTitle, "\n");
        sources.forEach(function (source, index) {
            var _a;
            var sourceInfo = ((_a = source.metadata) === null || _a === void 0 ? void 0 : _a.source) || (language === 'en' ? "Source ".concat(index + 1) : "\uCD9C\uCC98 ".concat(index + 1));
            citationsSection += "- ".concat(sourceInfo, "\n");
        });
        formattedOutput = "".concat(content).concat(citationsSection);
    }
    return formattedOutput;
}
/**
 * 캐시를 수동으로 정리합니다.
 */
export function clearCache() {
    var cacheSize = Object.keys(resultCache).length;
    Object.keys(resultCache).forEach(function (key) { return delete resultCache[key]; });
    logger.log({
        message: "RAG \uCE90\uC2DC \uC9C0\uC6C0 \uC644\uB8CC: ".concat(cacheSize, "\uAC1C \uD56D\uBAA9"),
        level: 'info'
    });
}
export default {
    processRagQuery: processRagQuery,
    sendRagResponseToTelegram: sendRagResponseToTelegram,
    clearCache: clearCache
};
