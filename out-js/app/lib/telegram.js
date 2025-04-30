/**
 * KeywordPulse 텔레그램 API 유틸리티 라이브러리
 *
 * 텔레그램 메시지 전송, 형식화, 에러 처리 등을 위한 유틸리티 함수 모음
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
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateRagAnalysis } from './rag-integration';
// Telegram API URL 생성
export var getTelegramApiUrl = function (token, method) {
    return "https://api.telegram.org/bot".concat(token, "/").concat(method);
};
// 공통 스타일 유틸리티
export function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}
/**
 * 텔레그램 메시지 전송
 * @param token 텔레그램 봇 토큰
 * @param messageOptions 메시지 옵션 (채팅 ID, 텍스트, 파싱 모드 등)
 * @returns 텔레그램 API 응답
 */
export function sendTelegramMessage(token, messageOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultOptions, options, response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultOptions = {
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                        disable_notification: false,
                    };
                    options = __assign(__assign({}, defaultOptions), messageOptions);
                    // 메시지 길이 검사 (텔레그램 제한: 4096자)
                    if (options.text.length > 4096) {
                        console.warn('텔레그램 메시지가 4096자를 초과합니다. 메시지가 잘립니다.');
                        options.text = options.text.substring(0, 4090) + '...';
                    }
                    return [4 /*yield*/, fetch(getTelegramApiUrl(token, 'sendMessage'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                chat_id: options.chat_id,
                                text: options.text,
                                parse_mode: options.parse_mode,
                                disable_web_page_preview: options.disable_web_page_preview,
                                disable_notification: options.disable_notification,
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (!result.ok) {
                        throw new Error("\uD154\uB808\uADF8\uB7A8 API \uC624\uB958: ".concat(result.description, " (").concat(result.error_code, ")"));
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * 마크다운 텍스트를 HTML로 변환
 * 단순 마크다운 구문 변환 (완전한 파서는 아님)
 * @param markdown 마크다운 텍스트
 * @returns HTML 형식 텍스트
 */
export function markdownToHtml(markdown) {
    // 기본적인 마크다운 -> HTML 변환
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // 굵게
        .replace(/\*(.*?)\*/g, '<b>$1</b>') // 굵게 (단일 *)
        .replace(/_(.*?)_/g, '<i>$1</i>') // 기울임
        .replace(/`(.*?)`/g, '<code>$1</code>') // 코드
        .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>') // 코드 블록
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // 링크
}
/**
 * 키워드 분석 결과를 텔레그램 메시지로 형식화합니다.
 */
export function formatKeywordAnalysisMessage(_a) {
    var keyword = _a.keyword, score = _a.score, trend = _a.trend, customMessage = _a.customMessage;
    // 트렌드에 따른 이모지 설정
    var trendEmoji;
    switch (trend) {
        case 'up':
            trendEmoji = '🔼';
            break;
        case 'down':
            trendEmoji = '🔽';
            break;
        default:
            trendEmoji = '➡️';
    }
    // 점수에 따른 이모지 설정
    var scoreEmoji;
    if (score >= 80) {
        scoreEmoji = '🔥';
    }
    else if (score >= 60) {
        scoreEmoji = '⭐';
    }
    else if (score >= 40) {
        scoreEmoji = '✅';
    }
    else if (score >= 20) {
        scoreEmoji = '⚠️';
    }
    else {
        scoreEmoji = '❌';
    }
    // 메시지 형식화
    var message = "<b>".concat(scoreEmoji, " \uD0A4\uC6CC\uB4DC: ").concat(keyword, "</b>\n\n");
    message += "<b>\uC810\uC218:</b> ".concat(score, "/100 ").concat(trendEmoji, "\n");
    // 점수별 분석 내용
    var analysis = '';
    if (score >= 80) {
        analysis = '현재 이 키워드는 매우 높은 관심을 받고 있으며, 빠르게 조치를 취하는 것이 좋습니다.';
    }
    else if (score >= 60) {
        analysis = '이 키워드는 상당한 관심을 받고 있으며, 주의 깊게 모니터링해야 합니다.';
    }
    else if (score >= 40) {
        analysis = '이 키워드는 보통 수준의 관심을 받고 있으며, 정기적으로 확인하는 것이 좋습니다.';
    }
    else if (score >= 20) {
        analysis = '이 키워드는 낮은 관심을 받고 있으나, 상황이 변할 수 있으므로 주기적으로 확인하세요.';
    }
    else {
        analysis = '이 키워드는 현재 매우 낮은 관심을 받고 있습니다.';
    }
    message += "<b>\uBD84\uC11D:</b> ".concat(analysis, "\n");
    // 사용자 지정 메시지가 있는 경우 추가
    if (customMessage) {
        message += "\n<b>\uCD94\uAC00 \uC815\uBCF4:</b> ".concat(customMessage, "\n");
    }
    // 푸터 추가
    message += "\n<a href=\"https://keywordpulse.app/dashboard/".concat(encodeURIComponent(keyword), "\">\uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uC790\uC138\uD788 \uBCF4\uAE30</a>");
    return message;
}
/**
 * RAG 기반 분석 결과 메시지 형식화
 * @param data RAG 분석 데이터
 * @returns 형식화된 HTML 메시지
 */
export function formatRagAnalysisMessage(data) {
    var keyword = data.keyword, analysis = data.analysis, _a = data.templateType, templateType = _a === void 0 ? 'full' : _a;
    // 분석 결과가 너무 길지 않도록 제한
    var maxAnalysisLength = templateType === 'full' ? 3000 :
        templateType === 'summary' ? 1500 : 800;
    var analysisText = analysis.length > maxAnalysisLength
        ? analysis.substring(0, maxAnalysisLength - 3) + '...'
        : analysis;
    // 템플릿 유형에 따른 메시지 형식
    var message = '';
    switch (templateType) {
        case 'compact':
            message = "\n<b>\uD83D\uDCCA \uD0A4\uC6CC\uB4DC \uBD84\uC11D: ".concat(keyword, "</b>\n\n").concat(analysisText, "\n\n<a href=\"https://keywordpulse.app/analysis/").concat(encodeURIComponent(keyword), "\">\uC804\uCCB4 \uBD84\uC11D \uBCF4\uAE30</a>\n");
            break;
        case 'summary':
            message = "\n<b>\uD83D\uDCCA \uD0A4\uC6CC\uB4DC \uBD84\uC11D \uC694\uC57D</b>\n\n<b>\uD0A4\uC6CC\uB4DC:</b> <code>".concat(keyword, "</code>\n\n<b>\uBD84\uC11D \uC694\uC57D:</b>\n").concat(analysisText, "\n\n<a href=\"https://keywordpulse.app/analysis/").concat(encodeURIComponent(keyword), "\">\uC804\uCCB4 \uBD84\uC11D \uBCF4\uAE30</a>\n");
            break;
        case 'full':
        default:
            message = "\n<b>\uD83D\uDCCA \uD0A4\uC6CC\uB4DC \uC0C1\uC138 \uBD84\uC11D</b>\n\n<b>\uD0A4\uC6CC\uB4DC:</b> <code>".concat(keyword, "</code>\n\n<b>\uBD84\uC11D \uACB0\uACFC:</b>\n").concat(analysisText, "\n\n<a href=\"https://keywordpulse.app/analysis/").concat(encodeURIComponent(keyword), "\">\uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uBCF4\uAE30</a>\n");
            break;
    }
    return message;
}
/**
 * 에러 메시지 형식화
 * @param error 에러 객체 또는 메시지
 * @returns 형식화된 에러 메시지
 */
export function formatErrorMessage(error) {
    var errorMessage = typeof error === 'string' ? error : error.message;
    return "\n<b>\u274C \uC624\uB958 \uBC1C\uC0DD</b>\n\n".concat(errorMessage, "\n\n\uC624\uB958\uAC00 \uACC4\uC18D\uB418\uBA74 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD558\uC138\uC694.\n");
}
/**
 * 텔레그램 API 에러 코드 처리
 * @param errorCode 텔레그램 API 에러 코드
 * @returns 사용자 친화적인 에러 메시지
 */
export function handleTelegramErrorCode(errorCode) {
    switch (errorCode) {
        case 400:
            return '잘못된 요청입니다. 매개변수를 확인하세요.';
        case 401:
            return '인증에 실패했습니다. 올바른 봇 토큰을 사용하고 있는지 확인하세요.';
        case 403:
            return '권한이 없습니다. 봇이 해당 채팅방에 추가되었는지 확인하세요.';
        case 404:
            return '사용자 또는 채팅방을 찾을 수 없습니다. 채팅 ID를 확인하세요.';
        case 409:
            return '충돌이 발생했습니다. 나중에 다시 시도하세요.';
        case 429:
            return '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.';
        case 500:
        case 502:
        case 503:
        case 504:
            return '텔레그램 서버 오류가 발생했습니다. 나중에 다시 시도하세요.';
        default:
            return "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. (\uC624\uB958 \uCF54\uB4DC: ".concat(errorCode, ")");
    }
}
/**
 * 텔레그램 인라인 키보드 버튼으로 메시지 전송
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @param text 전송할 메시지
 * @param buttons 인라인 키보드 버튼 배열 (2차원 배열)
 * @param options 추가 메시지 옵션
 * @returns 텔레그램 API 응답
 */
export function sendMessageWithButtons(token_1, chatId_1, text_1, buttons_1) {
    return __awaiter(this, arguments, void 0, function (token, chatId, text, buttons, options) {
        var defaultOptions, messageOptions, response, result;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultOptions = {
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                        disable_notification: false,
                    };
                    messageOptions = __assign(__assign({}, defaultOptions), options);
                    return [4 /*yield*/, fetch(getTelegramApiUrl(token, 'sendMessage'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: text,
                                parse_mode: messageOptions.parse_mode,
                                disable_web_page_preview: messageOptions.disable_web_page_preview,
                                disable_notification: messageOptions.disable_notification,
                                reply_markup: {
                                    inline_keyboard: buttons,
                                },
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (!result.ok) {
                        throw new Error("\uD154\uB808\uADF8\uB7A8 API \uC624\uB958: ".concat(result.description, " (").concat(result.error_code, ")"));
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * 텔레그램 메시지를 여러 부분으로 나누어 전송
 * 메시지가 텔레그램 제한(4096자)을 초과할 경우 사용
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @param text 전송할 메시지
 * @param options 메시지 옵션
 * @returns 결과 배열
 */
export function sendLongMessage(token_1, chatId_1, text_1) {
    return __awaiter(this, arguments, void 0, function (token, chatId, text, options) {
        var maxLength, results, result, remainingText, partNumber, splitIndex, newlineIndex, periodIndex, spaceIndex, part, partText, result;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    maxLength = 4000;
                    results = [];
                    if (!(text.length <= maxLength)) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chatId,
                            text: text,
                            parse_mode: options.parse_mode,
                            disable_web_page_preview: options.disable_web_page_preview,
                            disable_notification: options.disable_notification,
                        })];
                case 1:
                    result = _a.sent();
                    results.push(result);
                    return [3 /*break*/, 7];
                case 2:
                    remainingText = text;
                    partNumber = 1;
                    _a.label = 3;
                case 3:
                    if (!(remainingText.length > 0)) return [3 /*break*/, 7];
                    splitIndex = maxLength;
                    if (remainingText.length > maxLength) {
                        newlineIndex = remainingText.lastIndexOf('\n', maxLength);
                        periodIndex = remainingText.lastIndexOf('. ', maxLength);
                        spaceIndex = remainingText.lastIndexOf(' ', maxLength);
                        if (newlineIndex > maxLength / 2) {
                            splitIndex = newlineIndex + 1; // \n 포함
                        }
                        else if (periodIndex > maxLength / 2) {
                            splitIndex = periodIndex + 2; // '. ' 포함
                        }
                        else if (spaceIndex > maxLength / 2) {
                            splitIndex = spaceIndex + 1; // 공백 포함
                        }
                    }
                    part = remainingText.substring(0, splitIndex);
                    remainingText = remainingText.substring(splitIndex);
                    partText = part;
                    if (text.length > maxLength) {
                        // 첫 부분이면 '계속...' 추가, 아니면 '...계속' 추가
                        if (partNumber === 1) {
                            partText += '\n\n(계속...)';
                        }
                        else {
                            partText = "(...\uACC4\uC18D)\n\n".concat(partText);
                        }
                    }
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chatId,
                            text: partText,
                            parse_mode: options.parse_mode,
                            disable_web_page_preview: options.disable_web_page_preview,
                            disable_notification: options.disable_notification,
                        })];
                case 4:
                    result = _a.sent();
                    results.push(result);
                    partNumber++;
                    if (!(remainingText.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 3];
                case 7: return [2 /*return*/, results];
            }
        });
    });
}
/**
 * 텔레그램 메시지 형식을 HTML로 변환
 * @param message 원본 메시지
 * @returns HTML 형식의 메시지
 */
export function formatMessageAsHTML(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **bold** -> <b>bold</b>
        .replace(/\*(.*?)\*/g, '<i>$1</i>') // *italic* -> <i>italic</i>
        .replace(/`(.*?)`/g, '<code>$1</code>'); // `code` -> <code>code</code>
}
/**
 * 텔레그램 설정 유효성 검사
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @returns 유효성 검사 결과
 */
export function validateTelegramConfig(token, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sendTelegramMessage(token, {
                            chat_id: chatId,
                            text: '텔레그램 설정 검증 메시지',
                            parse_mode: 'HTML',
                        })];
                case 1:
                    result = _a.sent();
                    if (result.ok) {
                        return [2 /*return*/, { valid: true, message: '텔레그램 설정이 유효합니다.' }];
                    }
                    else {
                        return [2 /*return*/, {
                                valid: false,
                                message: "\uD154\uB808\uADF8\uB7A8 \uC124\uC815\uC774 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4: ".concat(result.description || '알 수 없는 오류')
                            }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            valid: false,
                            message: "\uD154\uB808\uADF8\uB7A8 \uC124\uC815 \uAC80\uC99D \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(error_1 instanceof Error ? error_1.message : '알 수 없는 오류'),
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 분석 결과 알림 메시지 형식화
 * @param keyword 키워드
 * @param score 점수
 * @param trends 트렌드 정보
 * @returns 포맷된 메시지
 */
export function formatAnalysisNotification(keyword, score, trends) {
    var message = "<b>\uD0A4\uC6CC\uB4DC \uBD84\uC11D \uACB0\uACFC</b>\n\n";
    message += "<b>\uD0A4\uC6CC\uB4DC:</b> ".concat(keyword, "\n");
    message += "<b>\uC810\uC218:</b> ".concat(score, "\n\n");
    if (trends && trends.length > 0) {
        message += '<b>트렌드 변화:</b>\n';
        trends.forEach(function (trend) {
            var changeSymbol = trend.change > 0 ? '📈' : trend.change < 0 ? '📉' : '➡️';
            message += "".concat(trend.period, ": ").concat(changeSymbol, " ").concat(Math.abs(trend.change), "%\n");
        });
    }
    message += '\n<i>자세한 분석 결과는 KeywordPulse 웹사이트에서 확인하세요</i>';
    return message;
}
/**
 * RAG 기반 분석 결과를 텔레그램 메시지로 형식화
 * @param keywords 키워드 데이터 배열
 * @param options RAG 분석 옵션
 * @returns 텔레그램용 HTML 포맷 메시지
 */
export function formatRagResultForTelegram(keywords_1) {
    return __awaiter(this, arguments, void 0, function (keywords, options) {
        var ragAnalysisText, htmlMessage, error_2;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, generateRagAnalysis(keywords, options)];
                case 1:
                    ragAnalysisText = _a.sent();
                    htmlMessage = formatMessageAsHTML(ragAnalysisText);
                    // 텔레그램 메시지 헤더와 푸터 추가
                    return [2 /*return*/, "<b>\uD83D\uDD0D KeywordPulse \uBD84\uC11D \uACB0\uACFC</b>\n\n".concat(htmlMessage, "\n\n<i>KeywordPulse\uC5D0\uC11C \uB354 \uC790\uC138\uD55C \uBD84\uC11D\uC744 \uD655\uC778\uD558\uC138\uC694.</i>")];
                case 2:
                    error_2 = _a.sent();
                    console.error('RAG 분석 텍스트 생성 중 오류:', error_2);
                    return [2 /*return*/, '<b>⚠️ 분석 생성 중 오류가 발생했습니다.</b>\n\n자세한 내용은 KeywordPulse 웹사이트를 확인하세요.'];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * 여러 채팅 ID로 텔레그램 메시지 전송
 * @param token 텔레그램 봇 토큰
 * @param chatIds 텔레그램 채팅 ID 배열
 * @param text 전송할 메시지
 * @param options 메시지 옵션
 * @returns 각 채팅 ID별 결과 객체
 */
export function sendMessageToMultipleChats(token_1, chatIds_1, text_1) {
    return __awaiter(this, arguments, void 0, function (token, chatIds, text, options) {
        var defaultOptions, messageOptions, results, errors, sendPromises, sendResults;
        var _this = this;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
                        throw new Error('유효한 채팅 ID 배열이 필요합니다.');
                    }
                    defaultOptions = {
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                        disable_notification: false,
                    };
                    messageOptions = __assign(__assign({}, defaultOptions), options);
                    results = {};
                    errors = {};
                    sendPromises = chatIds.map(function (chatId) { return __awaiter(_this, void 0, void 0, function () {
                        var result, error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, sendTelegramMessage(token, {
                                            chat_id: chatId,
                                            text: text,
                                            parse_mode: messageOptions.parse_mode,
                                            disable_web_page_preview: messageOptions.disable_web_page_preview,
                                            disable_notification: messageOptions.disable_notification,
                                        })];
                                case 1:
                                    result = _a.sent();
                                    return [2 /*return*/, { chatId: chatId, result: result, success: true }];
                                case 2:
                                    error_3 = _a.sent();
                                    console.error("\uCC44\uD305 ID ".concat(chatId, "\uB85C \uBA54\uC2DC\uC9C0 \uC804\uC1A1 \uC2E4\uD328:"), error_3);
                                    return [2 /*return*/, {
                                            chatId: chatId,
                                            error: error_3 instanceof Error ? error_3.message : '알 수 없는 오류',
                                            success: false
                                        }];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(sendPromises)];
                case 1:
                    sendResults = _a.sent();
                    // 결과 정리
                    sendResults.forEach(function (_a) {
                        var chatId = _a.chatId, result = _a.result, error = _a.error, success = _a.success;
                        if (success) {
                            results[chatId] = result;
                        }
                        else {
                            errors[chatId] = error;
                        }
                    });
                    return [2 /*return*/, {
                            results: results,
                            errors: errors,
                            summary: {
                                total: chatIds.length,
                                success: Object.keys(results).length,
                                failed: Object.keys(errors).length
                            }
                        }];
            }
        });
    });
}
/**
 * 여러 채팅 ID로 긴 텔레그램 메시지 전송
 * 메시지가 텔레그램 제한(4096자)을 초과할 경우 사용
 * @param token 텔레그램 봇 토큰
 * @param chatIds 텔레그램 채팅 ID 배열
 * @param text 전송할 메시지
 * @param options 메시지 옵션
 * @returns 각 채팅 ID별 결과 객체
 */
export function sendLongMessageToMultipleChats(token_1, chatIds_1, text_1) {
    return __awaiter(this, arguments, void 0, function (token, chatIds, text, options) {
        var results, errors, _i, chatIds_2, chatId, result, error_4;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
                        throw new Error('유효한 채팅 ID 배열이 필요합니다.');
                    }
                    results = {};
                    errors = {};
                    _i = 0, chatIds_2 = chatIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < chatIds_2.length)) return [3 /*break*/, 8];
                    chatId = chatIds_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, sendLongMessage(token, chatId, text, options)];
                case 3:
                    result = _a.sent();
                    results[chatId] = result;
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("\uCC44\uD305 ID ".concat(chatId, "\uB85C \uAE34 \uBA54\uC2DC\uC9C0 \uC804\uC1A1 \uC2E4\uD328:"), error_4);
                    errors[chatId] = error_4 instanceof Error ? error_4.message : '알 수 없는 오류';
                    return [3 /*break*/, 5];
                case 5:
                    if (!(chatIds.indexOf(chatId) < chatIds.length - 1)) return [3 /*break*/, 7];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, {
                        results: results,
                        errors: errors,
                        summary: {
                            total: chatIds.length,
                            success: Object.keys(results).length,
                            failed: Object.keys(errors).length
                        }
                    }];
            }
        });
    });
}
/**
 * 텔레그램 채팅 ID 형식 유효성 검사
 * @param chatId 검사할 텔레그램 채팅 ID
 * @returns 유효성 검사 결과 (boolean)
 */
export function isValidTelegramChatId(chatId) {
    // 채팅 ID는 숫자여야 함 (개인 채팅은 양수, 그룹 채팅은 음수)
    if (!chatId || chatId.trim() === '') {
        return false;
    }
    // @username 형식 (채널/그룹 사용자 이름)도 유효함
    if (chatId.startsWith('@')) {
        // @으로 시작하고 최소 5자 이상 (@+최소 4자 이상의 사용자명)
        return chatId.length >= 5 && /^@[a-zA-Z0-9_]{4,}$/.test(chatId);
    }
    // 숫자 형식 검사 (-100으로 시작하는 채널 ID 포함)
    return /^-?[0-9]+$/.test(chatId);
}
/**
 * 텔레그램 채팅 ID의 유효성을 API 호출을 통해 실제로 검증
 * @param token 텔레그램 봇 토큰
 * @param chatId 검사할 텔레그램 채팅 ID
 * @returns 검증 결과 객체 (유효 여부 및 메시지)
 */
export function validateTelegramChatId(token, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, chatType, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 기본 형식 검사
                    if (!isValidTelegramChatId(chatId)) {
                        return [2 /*return*/, {
                                valid: false,
                                message: '유효하지 않은 채팅 ID 형식입니다. 숫자 또는 @username 형식이어야 합니다.'
                            }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(getTelegramApiUrl(token, 'getChat'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                chat_id: chatId
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (result.ok) {
                        chatType = result.result.type;
                        return [2 /*return*/, {
                                valid: true,
                                message: "\uC720\uD6A8\uD55C \uCC44\uD305 ID\uC785\uB2C8\uB2E4. \uCC44\uD305 \uC720\uD615: ".concat(chatType === 'private' ? '개인' :
                                    chatType === 'group' ? '그룹' :
                                        chatType === 'supergroup' ? '슈퍼그룹' :
                                            chatType === 'channel' ? '채널' : chatType)
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                valid: false,
                                message: "\uCC44\uD305 ID \uAC80\uC99D \uC2E4\uD328: ".concat(result.description || '알 수 없는 오류')
                            }];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    return [2 /*return*/, {
                            valid: false,
                            message: "\uCC44\uD305 ID \uAC80\uC99D \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(error_5 instanceof Error ? error_5.message : '알 수 없는 오류')
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
