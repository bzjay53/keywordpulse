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
