/**
 * Telegram 메시지 전송 관련 유틸리티 함수
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
/**
 * Telegram API를 통해 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param options 메시지 옵션
 * @returns API 응답
 */
export function sendTelegramMessage(botToken, options) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://api.telegram.org/bot".concat(botToken, "/sendMessage");
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(options)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _a.sent();
                    console.error('Telegram 메시지 전송 실패:', error_1);
                    return [2 /*return*/, {
                            ok: false,
                            description: error_1 instanceof Error ? error_1.message : '알 수 없는 오류'
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 마크다운 형식의 텍스트를 Telegram에서 사용할 수 있는 HTML로 변환합니다.
 * @param markdownText 마크다운 텍스트
 * @returns HTML 형식의 텍스트
 */
export function formatMessageAsHTML(markdownText) {
    // 간단한 마크다운 -> HTML 변환
    return markdownText
        // 헤더 변환
        .replace(/^# (.+)$/gm, '<b>$1</b>')
        .replace(/^## (.+)$/gm, '<b>$1</b>')
        .replace(/^### (.+)$/gm, '<b>$1</b>')
        // 강조 변환
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.+?)\*/g, '<i>$1</i>')
        .replace(/_(.+?)_/g, '<i>$1</i>')
        // 리스트 변환
        .replace(/^- (.+)$/gm, '• $1')
        .replace(/^([0-9]+)\. (.+)$/gm, '$1. $2')
        // 링크 변환
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        // 줄바꿈 보존
        .replace(/\n/g, '\n');
}
/**
 * 여러 채팅방에 동일한 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param chatIds 채팅방 ID 배열
 * @param text 전송할 텍스트
 * @param options 추가 옵션
 * @returns 성공한 전송 수와 실패한 전송 수
 */
export function sendMultipleMessages(botToken_1, chatIds_1, text_1) {
    return __awaiter(this, arguments, void 0, function (botToken, chatIds, text, options) {
        var success, failed, sendPromises;
        var _this = this;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    success = 0;
                    failed = 0;
                    sendPromises = chatIds.map(function (chatId) { return __awaiter(_this, void 0, void 0, function () {
                        var result, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, sendTelegramMessage(botToken, __assign({ chat_id: chatId, text: text }, options))];
                                case 1:
                                    result = _b.sent();
                                    if (result.ok) {
                                        success++;
                                    }
                                    else {
                                        failed++;
                                    }
                                    return [2 /*return*/, result];
                                case 2:
                                    _a = _b.sent();
                                    failed++;
                                    return [2 /*return*/, { ok: false }];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(sendPromises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: success, failed: failed }];
            }
        });
    });
}
/**
 * 여러 채팅방에 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param chatIds 채팅방 ID 배열
 * @param message 전송할 메시지
 * @returns API 응답
 */
export function sendMessageToMultipleChats(botToken_1, chatIds_1, message_1) {
    return __awaiter(this, arguments, void 0, function (botToken, chatIds, message, parseMode) {
        var responses, success, failed, _i, chatIds_2, chatId, response, error_2;
        if (parseMode === void 0) { parseMode = 'HTML'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    responses = [];
                    success = 0;
                    failed = 0;
                    _i = 0, chatIds_2 = chatIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < chatIds_2.length)) return [3 /*break*/, 6];
                    chatId = chatIds_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, sendTelegramMessage(botToken, {
                            chat_id: chatId,
                            text: message,
                            parse_mode: parseMode,
                            disable_web_page_preview: true
                        })];
                case 3:
                    response = _a.sent();
                    responses.push(response);
                    if (response.ok) {
                        success++;
                    }
                    else {
                        failed++;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    failed++;
                    responses.push({
                        ok: false,
                        description: error_2 instanceof Error ? error_2.message : '알 수 없는 오류'
                    });
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, { success: success, failed: failed, responses: responses }];
            }
        });
    });
}
/**
 * Telegram API 에러 코드 처리
 * @param errorCode 에러 코드
 * @returns 처리 결과
 */
export function handleTelegramErrorCode(errorCode) {
    switch (errorCode) {
        case 400:
            return { retryable: false, message: '잘못된 요청 형식입니다. 요청 내용을 확인하세요.' };
        case 401:
            return { retryable: false, message: '인증 토큰이 유효하지 않습니다. 봇 토큰을 확인하세요.' };
        case 403:
            return { retryable: false, message: '봇이 차단되었거나 권한이 없습니다.' };
        case 404:
            return { retryable: false, message: '요청한 리소스를 찾을 수 없습니다. Chat ID를 확인하세요.' };
        case 409:
            return { retryable: true, message: '충돌이 발생했습니다. 잠시 후 다시 시도하세요.' };
        case 429:
            return { retryable: true, message: '요청 한도를 초과했습니다.', waitTime: 60 };
        case 500:
        case 502:
        case 503:
        case 504:
            return { retryable: true, message: 'Telegram 서버 오류입니다. 잠시 후 다시 시도하세요.' };
        default:
            return { retryable: true, message: "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. (\uCF54\uB4DC: ".concat(errorCode, ")") };
    }
}
/**
 * 에러 메시지 형식화
 * @param error 에러 객체
 * @returns 사용자 친화적인 에러 메시지
 */
export function formatErrorMessage(error) {
    if (error instanceof Error) {
        return "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4: ".concat(error.message);
    }
    return '알 수 없는 오류가 발생했습니다.';
}
/**
 * Telegram 설정 유효성 검사
 * @param token 봇 토큰
 * @param chatId 채팅 ID
 * @returns 검증 결과
 */
export function validateTelegramConfig(token, chatId) {
    if (!token) {
        return { valid: false, message: 'Telegram 봇 토큰이 설정되지 않았습니다.' };
    }
    if (!token.match(/^\d+:[A-Za-z0-9_-]{35}$/)) {
        return { valid: false, message: 'Telegram 봇 토큰 형식이 유효하지 않습니다.' };
    }
    if (!chatId) {
        return { valid: false, message: 'Telegram 채팅 ID가 설정되지 않았습니다.' };
    }
    return { valid: true, message: 'Telegram 설정이 유효합니다.' };
}
/**
 * Telegram 채팅 ID 유효성 검사
 * @param chatId 채팅 ID
 * @returns 검증 결과
 */
export function validateTelegramChatId(chatId) {
    if (!chatId) {
        return { valid: false, message: '채팅 ID가 제공되지 않았습니다.' };
    }
    if (!chatId.match(/^-?\d+$/)) {
        return { valid: false, message: '채팅 ID는 숫자여야 합니다.' };
    }
    return { valid: true, message: '채팅 ID가 유효합니다.' };
}
/**
 * 키워드 분석 결과를 Telegram 메시지로 포맷팅
 * @param data 키워드 분석 데이터
 * @returns 포맷팅된 HTML 메시지
 */
export function formatKeywordAnalysisMessage(data) {
    if (!data || !data.keyword) {
        return '<b>⚠️ 잘못된 분석 데이터</b>';
    }
    var keyword = data.keyword;
    var volume = data.volume || '정보 없음';
    var trend = data.trend || '정보 없음';
    var sentiment = data.sentiment || { positive: 0, neutral: 0, negative: 0 };
    // 감성 분석 그래프 생성
    var positiveBar = '🟢'.repeat(Math.round(sentiment.positive * 10)) || '▫️';
    var neutralBar = '🟡'.repeat(Math.round(sentiment.neutral * 10)) || '▫️';
    var negativeBar = '🔴'.repeat(Math.round(sentiment.negative * 10)) || '▫️';
    // 관련 키워드 처리
    var relatedKeywords = data.related && data.related.length > 0
        ? data.related.slice(0, 5).map(function (k) { return "\u2022 ".concat(k); }).join('\n')
        : '관련 키워드 정보 없음';
    return "\n<b>\uD83D\uDCCA \uD0A4\uC6CC\uB4DC \uBD84\uC11D \uACB0\uACFC</b>\n\n<b>\uD0A4\uC6CC\uB4DC:</b> ".concat(keyword, "\n<b>\uAC80\uC0C9\uB7C9:</b> ").concat(volume, "\n<b>\uCD94\uC138:</b> ").concat(trend, "\n\n<b>\uAC10\uC131 \uBD84\uC11D:</b>\n\uAE0D\uC815\uC801 (").concat(Math.round(sentiment.positive * 100), "%): ").concat(positiveBar, "\n\uC911\uB9BD\uC801 (").concat(Math.round(sentiment.neutral * 100), "%): ").concat(neutralBar, "\n\uBD80\uC815\uC801 (").concat(Math.round(sentiment.negative * 100), "%): ").concat(negativeBar, "\n\n<b>\uAD00\uB828 \uD0A4\uC6CC\uB4DC:</b>\n").concat(relatedKeywords, "\n\n<i>\uBD84\uC11D \uC2DC\uAC04: ").concat(new Date().toLocaleString('ko-KR'), "</i>\n");
}
/**
 * RAG 결과를 Telegram 메시지로 포맷팅
 * @param data RAG 검색 결과 데이터
 * @returns 포맷팅된 HTML 메시지
 */
export function formatRagResultForTelegram(data) {
    if (!data || !data.query || !data.results) {
        return '<b>⚠️ 잘못된 검색 결과 데이터</b>';
    }
    var query = data.query;
    var results = data.results.slice(0, 3); // 상위 3개만 표시
    // 검색 결과 포맷팅
    var formattedResults = results.map(function (result, index) {
        var _a;
        return "\n<b>".concat(index + 1, ". ").concat(result.title || '제목 없음', "</b>\n").concat(result.snippet || ((_a = result.content) === null || _a === void 0 ? void 0 : _a.substring(0, 150)) + '...' || '내용 없음', "\n").concat(result.url ? "<a href=\"".concat(result.url, "\">\uC790\uC138\uD788 \uBCF4\uAE30</a>") : '', "\n");
    }).join('\n');
    return "\n<b>\uD83D\uDD0D \uC9C0\uC2DD \uAC80\uC0C9 \uACB0\uACFC</b>\n\n<b>\uAC80\uC0C9\uC5B4:</b> ".concat(query, "\n\n<b>\uAC80\uC0C9 \uACB0\uACFC:</b>\n").concat(formattedResults || '검색 결과가 없습니다.', "\n\n<i>\uAC80\uC0C9 \uC2DC\uAC04: ").concat(new Date().toLocaleString('ko-KR'), "</i>\n");
}
