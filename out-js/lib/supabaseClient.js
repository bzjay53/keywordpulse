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
import { createClient } from '@supabase/supabase-js';
// Supabase 클라이언트 초기화
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export var supabase = createClient(supabaseUrl, supabaseAnonKey);
// 로그인 함수
export function signIn(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
}
// 회원가입 함수
export function signUp(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            emailRedirectTo: "".concat(window.location.origin, "/auth/callback")
                        }
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, {
                            data: response.data,
                            error: response.error,
                            message: '회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.'
                        }];
            }
        });
    });
}
// 로그아웃 함수
export function signOut() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase.auth.signOut()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// 현재 세션 정보 가져오기
export function getSession() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase.auth.getSession()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// 사용자 정보 가져오기
export function getUserProfile(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// 검색 사용량 추적 (비로그인 사용자용)
export function trackSearchUsage() {
    var today = new Date().toISOString().split('T')[0];
    var storageKey = "search_count_".concat(today);
    // 로컬 스토리지에서 오늘의 검색 카운트 가져오기
    var currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
    // 무료 검색 한도 (5회)
    var FREE_SEARCH_LIMIT = 5;
    // 검색 가능 여부 반환
    return currentCount < FREE_SEARCH_LIMIT;
}
// 검색 카운트 증가
export function incrementSearchCount() {
    var today = new Date().toISOString().split('T')[0];
    var storageKey = "search_count_".concat(today);
    // 로컬 스토리지에서 오늘의 검색 카운트 가져오기
    var currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
    // 카운트 증가 및 저장
    localStorage.setItem(storageKey, (currentCount + 1).toString());
}
// 검색 제한 초기화
export function resetSearchLimit() {
    var today = new Date().toISOString().split('T')[0];
    var storageKey = "search_count_".concat(today);
    // 카운트 초기화
    localStorage.setItem(storageKey, '0');
}
// 광고 시청 여부 확인
export function hasWatchedAd() {
    var today = new Date().toISOString().split('T')[0];
    var storageKey = "ad_watched_".concat(today);
    return localStorage.getItem(storageKey) === 'true';
}
// 광고 시청 완료 표시
export function setAdWatched() {
    var today = new Date().toISOString().split('T')[0];
    var storageKey = "ad_watched_".concat(today);
    localStorage.setItem(storageKey, 'true');
}
