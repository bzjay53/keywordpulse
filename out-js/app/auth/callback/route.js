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
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';
// 엣지 런타임 사용 설정 추가
export var runtime = 'edge';
/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var requestUrl, code, supabaseUrl, supabaseKey, supabase, error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    requestUrl = new URL(request.url);
                    // 개발 모드에서는 코드 확인 생략 (선택 사항)
                    if (requestUrl.searchParams.get("dev") === "true") {
                        console.log("개발 모드로 인증 건너뛰기");
                        return [2 /*return*/, NextResponse.redirect(new URL('/dev-login', requestUrl.origin))];
                    }
                    code = requestUrl.searchParams.get("code");
                    if (!code) {
                        console.error("인증 코드가 없습니다.");
                        return [2 /*return*/, NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin))];
                    }
                    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
                    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
                    supabase = createClient(supabaseUrl, supabaseKey);
                    return [4 /*yield*/, supabase.auth.exchangeCodeForSession(code)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("인증 코드 교환 중 오류:", error.message);
                        return [2 /*return*/, NextResponse.redirect(new URL("/login?error=".concat(encodeURIComponent(error.message)), requestUrl.origin))];
                    }
                    // 성공 시 홈페이지로 리다이렉트
                    return [2 /*return*/, NextResponse.redirect(new URL('/', requestUrl.origin))];
                case 2:
                    error_1 = _a.sent();
                    console.error("인증 콜백 처리 중 오류 발생:", error_1);
                    return [2 /*return*/, NextResponse.redirect(new URL('/login?error=callback_error', request.url))];
                case 3: return [2 /*return*/];
            }
        });
    });
}
