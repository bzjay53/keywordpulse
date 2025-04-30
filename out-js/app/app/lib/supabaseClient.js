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
// 브라우저 환경인지 확인하는 상수
var isBrowser = typeof window !== 'undefined';
// 환경 변수 또는 기본값 설정
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// 환경 변수 미설정 시 경고 출력
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase 환경변수가 설정되지 않았습니다. 개발 모드로 인증 기능이 동작합니다.');
}
// 개발 환경에서는 기본값 설정
var devUrl = 'https://example.supabase.co';
var devKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';
// Supabase 클라이언트 생성
export var supabase = createClient(supabaseUrl || devUrl, supabaseAnonKey || devKey);
// LocalStorage 안전하게 접근하는 함수
var getLocalStorageItem = function (key) {
    if (!isBrowser)
        return null;
    return localStorage.getItem(key);
};
// LocalStorage 안전하게 설정하는 함수
var setLocalStorageItem = function (key, value) {
    if (!isBrowser)
        return;
    localStorage.setItem(key, value);
};
// 로컬 스토리지 키 정의
export var LOCAL_STORAGE_KEYS = {
    SEARCH_COUNT: 'kp_search_count',
    USER_ID: 'kp_user_id',
    LAST_SEARCH_TIME: 'kp_last_search_time',
    HAS_WATCHED_AD: 'kp_has_watched_ad',
    CURRENT_USER: 'kp_current_user'
};
// 개발 환경 상수
export var isDevelopment = process.env.NODE_ENV === 'development';
export var DEV_ADMIN_EMAIL = 'admin@example.com';
export var DEV_ADMIN_PASSWORD = 'admin123';
// 회원가입 함수
export function signUp(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isDevelopment) {
                        console.log('[개발 모드] 회원가입:', email);
                        // 개발 모드에서 바로 로그인 상태로 설정
                        setLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
                            email: email,
                            id: "dev-user-".concat(Date.now()),
                            role: 'user',
                            created_at: new Date().toISOString()
                        }));
                        return [2 /*return*/, {
                                data: {
                                    user: { email: email, id: "dev-user-".concat(Date.now()), role: 'user' },
                                    session: { access_token: 'mock-token' }
                                },
                                error: null,
                                message: '회원가입이 완료되었습니다.'
                            }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    baseUrl = isBrowser
                        ? window.location.origin
                        : process.env.NEXT_PUBLIC_BASE_URL || 'https://keywordpulse.vercel.app';
                    return [4 /*yield*/, supabase.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                emailRedirectTo: "".concat(baseUrl, "/auth/callback")
                            }
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, {
                            data: data,
                            error: null,
                            message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.'
                        }];
                case 3:
                    error_1 = _b.sent();
                    console.error('[회원가입 에러]', error_1);
                    return [2 /*return*/, {
                            data: null,
                            error: { message: error_1.message || '회원가입 중 오류가 발생했습니다.' }
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 로그인 함수
export function signIn(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isDevelopment) {
                        console.log('[개발 모드] 로그인:', email);
                        // 개발 모드에서 바로 로그인 상태로 설정
                        if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
                            setLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
                                email: email,
                                id: 'admin-id',
                                role: 'admin',
                                created_at: new Date().toISOString()
                            }));
                            return [2 /*return*/, {
                                    data: {
                                        user: { email: email, id: 'admin-id', role: 'admin' },
                                        session: { access_token: 'mock-token-admin' }
                                    },
                                    error: null
                                }];
                        }
                        return [2 /*return*/, {
                                data: null,
                                error: { message: '잘못된 이메일 또는 비밀번호입니다.' }
                            }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, { data: data, error: null }];
                case 3:
                    error_2 = _b.sent();
                    console.error('[로그인 에러]', error_2);
                    return [2 /*return*/, {
                            data: null,
                            error: { message: error_2.message || '로그인 중 오류가 발생했습니다.' }
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 로그아웃 함수
export function signOut() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isDevelopment) {
                        if (isBrowser) {
                            localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
                        }
                        return [2 /*return*/, { error: null }];
                    }
                    return [4 /*yield*/, supabase.auth.signOut()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// 세션 가져오기
export function getSession() {
    return __awaiter(this, void 0, void 0, function () {
        var userJson, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isDevelopment) {
                        userJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
                        if (!userJson)
                            return [2 /*return*/, { data: { session: null }, error: null }];
                        try {
                            user = JSON.parse(userJson);
                            return [2 /*return*/, {
                                    data: {
                                        session: {
                                            user: user,
                                            access_token: 'mock-token'
                                        }
                                    },
                                    error: null
                                }];
                        }
                        catch (e) {
                            return [2 /*return*/, { data: { session: null }, error: null }];
                        }
                    }
                    return [4 /*yield*/, supabase.auth.getSession()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// 사용자 프로필 가져오기
export function getUserProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var userJson, user, sessionData, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isDevelopment) {
                        userJson = getLocalStorageItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
                        if (!userJson)
                            return [2 /*return*/, { data: null, error: null }];
                        try {
                            user = JSON.parse(userJson);
                            return [2 /*return*/, { data: user, error: null }];
                        }
                        catch (e) {
                            return [2 /*return*/, { data: null, error: null }];
                        }
                    }
                    return [4 /*yield*/, supabase.auth.getSession()];
                case 1:
                    sessionData = (_b.sent()).data;
                    if (!sessionData.session)
                        return [2 /*return*/, { data: null, error: null }];
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', sessionData.session.user.id)
                            .single()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    });
}
// 검색 사용량 추적
export function trackSearchUsage() {
    var now = new Date().getTime();
    setLocalStorageItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, now.toString());
}
// 검색 횟수 증가
export function incrementSearchCount() {
    if (!isBrowser)
        return;
    var countStr = getLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0';
    var count = parseInt(countStr, 10) + 1;
    setLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, count.toString());
}
// 검색 제한 초기화
export function resetSearchLimit() {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, '0');
    setLocalStorageItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, Date.now().toString());
}
// 광고 시청 여부
export function hasWatchedAd() {
    var watched = getLocalStorageItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD);
    return watched === 'true';
}
// 광고 시청 설정
export function setAdWatched() {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
}
