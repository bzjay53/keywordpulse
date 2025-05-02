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
import { createClient } from '@/lib/supabaseClient';
import logger from '@/lib/logger';
import { sendTelegramMessage } from '@/lib/telegram';
/**
 * 피드백 데이터를 받아 Supabase에 저장하고 필요시 알림을 보내는 API
 * @route POST /api/feedback
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, feedbackData, supabase, _a, data, error, botToken, chatId, telegramMessage, telegramError_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _b.sent();
                    // 필수 필드 검증
                    if (!body.text) {
                        return [2 /*return*/, NextResponse.json({ error: '피드백 내용을 입력해주세요.' }, { status: 400 })];
                    }
                    feedbackData = {
                        text: body.text,
                        email: body.email || null,
                        name: body.name || null,
                        rating: body.rating || null,
                        category: body.category || '일반',
                        page: body.page || null,
                        ip: request.headers.get('x-forwarded-for') || request.ip || null,
                        user_agent: request.headers.get('user-agent') || null,
                        created_at: new Date().toISOString()
                    };
                    supabase = createClient();
                    return [4 /*yield*/, supabase
                            .from('feedback')
                            .insert([feedbackData])
                            .select()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        logger.error('피드백 저장 중 오류 발생:', error);
                        throw error;
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 6, , 7]);
                    botToken = process.env.TELEGRAM_BOT_TOKEN;
                    chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
                    if (!(botToken && chatId)) return [3 /*break*/, 5];
                    telegramMessage = "\n\uD83D\uDCDD <b>\uC0C8 \uD53C\uB4DC\uBC31 \uC811\uC218</b>\n\n<b>\uB0B4\uC6A9:</b> ".concat(feedbackData.text, "\n").concat(feedbackData.name ? "<b>\uC774\uB984:</b> ".concat(feedbackData.name) : '', "\n").concat(feedbackData.email ? "<b>\uC774\uBA54\uC77C:</b> ".concat(feedbackData.email) : '', "\n").concat(feedbackData.rating ? "<b>\uD3C9\uC810:</b> ".concat(feedbackData.rating, "/5") : '', "\n<b>\uCE74\uD14C\uACE0\uB9AC:</b> ").concat(feedbackData.category, "\n").concat(feedbackData.page ? "<b>\uD398\uC774\uC9C0:</b> ".concat(feedbackData.page) : '', "\n<b>\uC2DC\uAC04:</b> ").concat(new Date().toLocaleString('ko-KR'), "\n        ");
                    return [4 /*yield*/, sendTelegramMessage(botToken, {
                            chat_id: chatId,
                            text: telegramMessage,
                            parse_mode: 'HTML'
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    telegramError_1 = _b.sent();
                    // 텔레그램 오류는 전체 피드백 처리에 영향을 주지 않도록 함
                    logger.warn('텔레그램 알림 전송 중 오류:', telegramError_1);
                    return [3 /*break*/, 7];
                case 7: 
                // 성공 응답
                return [2 /*return*/, NextResponse.json({
                        success: true,
                        message: '피드백이 성공적으로 제출되었습니다.',
                        data: data ? data[0] : null
                    })];
                case 8:
                    error_1 = _b.sent();
                    logger.error('피드백 처리 중 오류 발생:', error_1);
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            error: error_1.message || '피드백 처리 중 오류가 발생했습니다.'
                        }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * 피드백 데이터를 텔레그램 메시지로 포맷팅
 */
function formatFeedbackMessage(data) {
    var _a;
    var rating = '⭐'.repeat(data.rating);
    var path = ((_a = data.context) === null || _a === void 0 ? void 0 : _a.path) || '알 수 없음';
    var browser = data.browser ? JSON.parse(data.browser) : { userAgent: '알 수 없음' };
    return "\n<b>\u26A0\uFE0F \uC911\uC694 \uD53C\uB4DC\uBC31 \uC811\uC218</b>\n\n<b>\uD3C9\uC810:</b> ".concat(rating, " (").concat(data.rating, "/5)\n<b>\uD398\uC774\uC9C0:</b> ").concat(path, "\n<b>\uC2DC\uAC04:</b> ").concat(new Date(data.timestamp).toLocaleString('ko-KR'), "\n\n<b>\uB0B4\uC6A9:</b>\n").concat(data.feedback, "\n\n<b>\uD658\uACBD:</b>\n- \uD50C\uB7AB\uD3FC: ").concat(data.platform || '알 수 없음', "\n- \uBE0C\uB77C\uC6B0\uC800: ").concat(browser.userAgent, "\n");
}
