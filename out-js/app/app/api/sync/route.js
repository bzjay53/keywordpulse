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
/**
 * 키워드 분석 결과를 Google Sheets에 저장하는 API 엔드포인트
 */
export function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var body, serviceAccount, spreadsheetUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    body = _a.sent();
                    if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
                        return [2 /*return*/, NextResponse.json({ error: '저장할 키워드 데이터가 제공되지 않았습니다.' }, { status: 400 })];
                    }
                    serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;
                    if (!serviceAccount) {
                        console.error('Google 서비스 계정 환경 변수가 설정되지 않았습니다.');
                        return [2 /*return*/, NextResponse.json({
                                success: false,
                                error: 'GOOGLE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.'
                            }, { status: 500 })];
                    }
                    // 이 예제에서는 실제 Google Sheets API 연동 대신 모의 응답을 반환합니다
                    // 실제 프로덕션 환경에서는 Google API를 호출해야 합니다
                    console.log("".concat(body.keywords.length, "\uAC1C \uD0A4\uC6CC\uB4DC\uB97C \uC2DC\uD2B8\uC5D0 \uC800\uC7A5\uD558\uB824\uACE0 \uC2DC\uB3C4\uD569\uB2C8\uB2E4..."));
                    try {
                        spreadsheetUrl = "https://docs.google.com/spreadsheets/d/example-sheet-id/edit";
                        return [2 /*return*/, NextResponse.json({
                                success: true,
                                spreadsheetUrl: spreadsheetUrl
                            })];
                    }
                    catch (error) {
                        throw new Error("Google Sheets API \uC624\uB958: ".concat(error.message));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('시트 저장 중 오류 발생:', error_1);
                    return [2 /*return*/, NextResponse.json({
                            success: false,
                            error: error_1.message || '알 수 없는 오류가 발생했습니다.'
                        }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
