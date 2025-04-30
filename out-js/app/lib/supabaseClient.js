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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { createClient } from '@supabase/supabase-js';
// 환경 변수 또는 기본값 사용
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
/**
 * Supabase 인증 정보가 유효한지 확인하는 함수
 */
function hasValidSupabaseCredentials() {
    // 서버 사이드 정적 빌드를 위해 항상 true 반환
    if (typeof window === 'undefined') {
        return true;
    }
    // 클라이언트 사이드에서는 유효한 환경 변수 확인
    return (process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://example.supabase.co' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'example-anon-key');
}
// Supabase 클라이언트 생성
export var supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
// 클라이언트 사이드에서 실행될 때만 경고 표시
if (typeof window !== 'undefined' && !hasValidSupabaseCredentials()) {
    console.warn('Supabase 환경 변수가 설정되지 않았습니다. 인증 및 데이터 기능이 작동하지 않을 수 있습니다.');
    // 개발 모드일 때만 추가 경고 표시
    if (process.env.NODE_ENV === 'development') {
        console.warn('개발 환경에서는 .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.');
    }
}
// 로그인 메소드 추가
export var loginWithEmail = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 유효한 자격 증명이 없으면 오류 반환
                if (!hasValidSupabaseCredentials()) {
                    return [2 /*return*/, {
                            error: {
                                message: 'Supabase 환경 변수가 설정되지 않았습니다.'
                            },
                            data: null
                        }];
                }
                return [4 /*yield*/, supabase.auth.signInWithPassword({ email: email, password: password })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export default supabase;
// 개발 환경 여부 확인
export var isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
// 환경 변수 미설정 시 개발 모드에서 사용할 기본 어드민 계정
export var DEV_ADMIN_EMAIL = 'admin@example.com';
export var DEV_ADMIN_PASSWORD = 'admin123';
// 개발 모드를 위한 사용자 DB - 클라이언트에서만 사용
var DEV_USERS = typeof window !== 'undefined' ?
    JSON.parse(localStorage.getItem('kp_dev_users') || '[]') :
    [];
// 개발 모드용 사용자 저장
var saveDevUsers = function (users) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('kp_dev_users', JSON.stringify(users));
    }
};
// 방문자 세션 추적을 위한 로컬 스토리지 키
export var LOCAL_STORAGE_KEYS = {
    SEARCH_COUNT: 'kp_search_count',
    USER_ID: 'kp_user_id',
    LAST_SEARCH_TIME: 'kp_last_search_time',
    HAS_WATCHED_AD: 'kp_has_watched_ad',
    CURRENT_USER: 'kp_current_user'
};
// 마지막 요청 시간을 추적하기 위한 변수
var lastAuthRequestTime = 0;
// 요청 사이의 최소 지연 시간 (밀리초)
var MIN_AUTH_REQUEST_DELAY = 3000; // 3초
/**
 * 인증 요청 간의 최소 지연 시간을 확인하는 함수
 * @returns 요청을 보낼 수 있으면 true, 아직 기다려야 하면 false
 */
function canMakeAuthRequest() {
    var now = Date.now();
    var timeSinceLastRequest = now - lastAuthRequestTime;
    var remainingTime = Math.max(0, MIN_AUTH_REQUEST_DELAY - timeSinceLastRequest);
    return {
        canProceed: timeSinceLastRequest >= MIN_AUTH_REQUEST_DELAY,
        remainingTime: remainingTime
    };
}
/**
 * 인증 요청 시간을 업데이트하는 함수
 */
function updateAuthRequestTime() {
    lastAuthRequestTime = Date.now();
}
export function signUp(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, canProceed, remainingTime, existingUser, newUser, updatedUsers, baseUrl, result, error_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = canMakeAuthRequest(), canProceed = _a.canProceed, remainingTime = _a.remainingTime;
                    if (!canProceed) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "\uB108\uBB34 \uBE60\uB978 \uC694\uCCAD\uC785\uB2C8\uB2E4. ".concat(Math.ceil(remainingTime / 1000), "\uCD08 \uD6C4\uC5D0 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.")
                                }
                            }];
                    }
                    if (!hasValidSupabaseCredentials()) {
                        console.warn('[개발 모드] Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
                        existingUser = DEV_USERS.find(function (user) { return user.email === email; });
                        if (existingUser || email === DEV_ADMIN_EMAIL) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.' }
                                }];
                        }
                        // 비밀번호 유효성 검사 추가
                        if (password.length < 6) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
                                }];
                        }
                        newUser = {
                            email: email,
                            password: password, // 실제 환경에서는 저장하지 않음, 개발용!
                            id: "dev-user-".concat(Date.now()),
                            role: 'user',
                            created_at: new Date().toISOString()
                        };
                        updatedUsers = __spreadArray(__spreadArray([], DEV_USERS, true), [newUser], false);
                        saveDevUsers(updatedUsers);
                        // 개발 모드에서는 즉시 로그인 상태로 설정
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
                            localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
                                email: email,
                                id: newUser.id,
                                role: 'user',
                                created_at: newUser.created_at
                            }));
                            // 검색 제한 초기화
                            resetSearchLimit();
                        }
                        // 인증 요청 시간 업데이트
                        updateAuthRequestTime();
                        return [2 /*return*/, {
                                data: {
                                    user: {
                                        email: email,
                                        id: newUser.id,
                                        role: 'user'
                                    },
                                    session: {
                                        access_token: 'mock-token',
                                        expires_at: Date.now() + 24 * 60 * 60 * 1000
                                    }
                                },
                                error: null
                            }];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    console.log('[회원가입 시도]', { email: email });
                    // 인증 요청 시간 업데이트
                    updateAuthRequestTime();
                    baseUrl = typeof window !== 'undefined'
                        ? window.location.origin
                        : process.env.NEXT_PUBLIC_BASE_URL || 'https://keywordpulse.vercel.app';
                    console.log('[회원가입] 리디렉션 URL:', "".concat(baseUrl, "/auth/callback"));
                    return [4 /*yield*/, supabase.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                emailRedirectTo: "".concat(baseUrl, "/auth/callback"),
                                data: {
                                    role: 'user'
                                }
                            }
                        })];
                case 2:
                    result = _e.sent();
                    console.log('[회원가입 결과]', {
                        success: !result.error,
                        errorMessage: (_b = result.error) === null || _b === void 0 ? void 0 : _b.message,
                        user: ((_c = result.data) === null || _c === void 0 ? void 0 : _c.user) ? 'exists' : 'none'
                    });
                    if (result.error) {
                        // 오류 메시지 개선
                        if (result.error.message.includes('already')) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '이미 가입된 이메일입니다. 로그인을 시도해주세요.' }
                                }];
                        }
                        else if (result.error.message.includes('password')) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
                                }];
                        }
                        else if (result.error.message.includes('security purposes') || result.error.message.includes('rate limit')) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
                                }];
                        }
                        // 기타 오류 메시지 처리
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "\uD68C\uC6D0\uAC00\uC785 \uC624\uB958: ".concat(result.error.message) }
                            }];
                    }
                    else if ((_d = result.data) === null || _d === void 0 ? void 0 : _d.user) {
                        // 회원가입 성공
                        if (result.data.session) {
                            // 세션이 있으면 로그인 상태 → 개발 모드 또는 이메일 확인 없이 자동 로그인되는 설정
                            resetSearchLimit();
                            return [2 /*return*/, {
                                    data: result.data,
                                    error: null
                                }];
                        }
                        else {
                            // 세션이 없으면 이메일 확인 필요
                            return [2 /*return*/, {
                                    data: result.data,
                                    error: null,
                                    message: '회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.'
                                }];
                        }
                    }
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _e.sent();
                    console.error('[회원가입 오류]', error_1);
                    return [2 /*return*/, {
                            data: null,
                            error: { message: '회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
export function signIn(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, canProceed, remainingTime, adminUser, user, emailExists, result, resendError, error_2;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = canMakeAuthRequest(), canProceed = _a.canProceed, remainingTime = _a.remainingTime;
                    if (!canProceed) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "\uB108\uBB34 \uBE60\uB978 \uC694\uCCAD\uC785\uB2C8\uB2E4. ".concat(Math.ceil(remainingTime / 1000), "\uCD08 \uD6C4\uC5D0 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.")
                                }
                            }];
                    }
                    if (!hasValidSupabaseCredentials()) {
                        console.warn('[개발 모드] Supabase 환경 변수가 없어 개발 모드로 동작합니다.');
                        // 개발 모드에서 관리자 계정으로 로그인 허용
                        if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
                            // 로컬 스토리지에 사용자 정보 저장
                            if (typeof window !== 'undefined') {
                                adminUser = {
                                    email: email,
                                    id: 'dev-admin-id',
                                    role: 'admin',
                                    created_at: new Date().toISOString()
                                };
                                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
                                localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
                            }
                            // 검색 제한 초기화
                            resetSearchLimit();
                            // 인증 요청 시간 업데이트
                            updateAuthRequestTime();
                            return [2 /*return*/, {
                                    data: {
                                        user: { email: email, id: 'dev-admin-id', role: 'admin' },
                                        session: { access_token: 'mock-token', expires_at: Date.now() + 24 * 60 * 60 * 1000 }
                                    },
                                    error: null
                                }];
                        }
                        user = DEV_USERS.find(function (user) { return user.email === email && user.password === password; });
                        if (user) {
                            // 로컬 스토리지에 사용자 정보 저장
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, email);
                                localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify({
                                    email: email,
                                    id: user.id,
                                    role: 'user',
                                    created_at: user.created_at
                                }));
                            }
                            // 검색 제한 초기화
                            resetSearchLimit();
                            // 인증 요청 시간 업데이트
                            updateAuthRequestTime();
                            return [2 /*return*/, {
                                    data: {
                                        user: { email: email, id: user.id, role: 'user' },
                                        session: { access_token: 'mock-token', expires_at: Date.now() + 24 * 60 * 60 * 1000 }
                                    },
                                    error: null
                                }];
                        }
                        emailExists = DEV_USERS.some(function (user) { return user.email === email; });
                        if (emailExists) {
                            return [2 /*return*/, {
                                    data: null,
                                    error: { message: '비밀번호가 일치하지 않습니다. 다시 확인해주세요.' }
                                }];
                        }
                        return [2 /*return*/, {
                                data: null,
                                error: { message: '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.' }
                            }];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 8, , 9]);
                    console.log('[로그인 시도]', { email: email });
                    // 인증 요청 시간 업데이트
                    updateAuthRequestTime();
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                case 2:
                    result = _e.sent();
                    console.log('[로그인 결과]', {
                        success: !result.error,
                        errorMessage: (_b = result.error) === null || _b === void 0 ? void 0 : _b.message,
                        session: ((_c = result.data) === null || _c === void 0 ? void 0 : _c.session) ? 'exists' : 'none'
                    });
                    if (!result.error) return [3 /*break*/, 6];
                    if (!(result.error.message === 'Email not confirmed')) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase.auth.resend({
                            type: 'signup',
                            email: email,
                            options: {
                                emailRedirectTo: "".concat(window.location.origin, "/auth/callback")
                            }
                        })];
                case 3:
                    resendError = (_e.sent()).error;
                    if (resendError) {
                        console.error('[이메일 재전송 오류]', resendError);
                    }
                    else {
                        console.log('[이메일 재전송 성공]', { email: email });
                    }
                    return [2 /*return*/, {
                            data: null,
                            error: { message: '이메일 인증이 완료되지 않았습니다. 인증 이메일을 재전송했으니 확인해주세요.' }
                        }];
                case 4:
                    if (result.error.message.includes('Invalid login credentials')) {
                        // 로그인 정보 오류
                        return [2 /*return*/, {
                                data: null,
                                error: { message: '로그인 정보가 올바르지 않습니다. 이메일과 비밀번호를 확인해주세요.' }
                            }];
                    }
                    else if (result.error.message.includes('security purposes') || result.error.message.includes('rate limit')) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
                            }];
                    }
                    else {
                        // 기타 오류
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "\uB85C\uADF8\uC778 \uC624\uB958: ".concat(result.error.message) }
                            }];
                    }
                    _e.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    if ((_d = result.data) === null || _d === void 0 ? void 0 : _d.session) {
                        // 로그인 성공 시 검색 제한 초기화
                        resetSearchLimit();
                        return [2 /*return*/, result];
                    }
                    else {
                        // 세션이 없는 경우 (비정상적인 상황)
                        return [2 /*return*/, {
                                data: null,
                                error: { message: '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.' }
                            }];
                    }
                    _e.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _e.sent();
                    console.error('[로그인 오류]', error_2);
                    return [2 /*return*/, {
                            data: null,
                            error: { message: '로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.' }
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
export function signOut() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                // 로컬 스토리지에서 사용자 정보 제거
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID);
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
                }
                return [2 /*return*/, { error: null }];
            }
            return [2 /*return*/, supabase.auth.signOut()];
        });
    });
}
export function getSession() {
    return __awaiter(this, void 0, void 0, function () {
        var userJson, user, isAdmin;
        return __generator(this, function (_a) {
            if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                userJson = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER) : null;
                if (userJson) {
                    try {
                        user = JSON.parse(userJson);
                        isAdmin = user.email === DEV_ADMIN_EMAIL;
                        return [2 /*return*/, {
                                data: {
                                    session: {
                                        user: {
                                            id: user.id,
                                            email: user.email,
                                            role: isAdmin ? 'admin' : 'user'
                                        }
                                    }
                                },
                                error: null
                            }];
                    }
                    catch (e) {
                        console.error('세션 파싱 오류:', e);
                    }
                }
                return [2 /*return*/, { data: { session: null }, error: null }];
            }
            return [2 /*return*/, supabase.auth.getSession()];
        });
    });
}
export function getUser() {
    return __awaiter(this, void 0, void 0, function () {
        var userJson, user_1, isAdmin, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                        userJson = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER) : null;
                        if (userJson) {
                            try {
                                user_1 = JSON.parse(userJson);
                                isAdmin = user_1.email === DEV_ADMIN_EMAIL;
                                // User 타입에 맞는 최소한의 필수 필드 포함
                                return [2 /*return*/, {
                                        id: user_1.id,
                                        email: user_1.email,
                                        role: isAdmin ? 'admin' : 'user',
                                        app_metadata: {},
                                        user_metadata: {},
                                        aud: 'authenticated',
                                        created_at: user_1.created_at || new Date().toISOString()
                                    }];
                            }
                            catch (e) {
                                console.error('사용자 파싱 오류:', e);
                            }
                        }
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 1:
                    user = (_a.sent()).data.user;
                    return [2 /*return*/, user];
            }
        });
    });
}
// 유저 역할 확인 함수 (관리자 페이지용)
export function isUserAdmin(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var storedUserId, user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY || !userId) {
                        storedUserId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID) : null;
                        return [2 /*return*/, storedUserId === DEV_ADMIN_EMAIL];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 2:
                    user = (_a.sent()).data.user;
                    return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.email) === 'admin@example.com'];
                case 3:
                    error_3 = _a.sent();
                    console.error('관리자 권한 확인 중 오류:', error_3);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 사용자 검색 제한 관리 함수
export function trackSearchUsage() {
    if (typeof window === 'undefined')
        return false;
    var searchCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0', 10);
    var userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
    var lastSearchTime = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME);
    var hasWatchedAd = localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD) === 'true';
    // 로그인 사용자인 경우 추가 검색 가능
    if (userId) {
        // 로그인 사용자는 기본 1회 + 추가 1회 = 2회 검색 가능
        return searchCount < 2;
    }
    // 비로그인 사용자는 1회만 검색 가능
    return searchCount < 1;
}
// 사용자 검색 횟수 증가
export function incrementSearchCount() {
    if (typeof window === 'undefined')
        return;
    var currentCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT) || '0', 10);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, (currentCount + 1).toString());
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SEARCH_TIME, new Date().toISOString());
}
// 검색 제한 초기화 (로그인 시 사용)
export function resetSearchLimit() {
    if (typeof window === 'undefined')
        return;
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_COUNT, '0');
        localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
        console.log('[검색 제한 초기화 완료]');
    }
    catch (error) {
        console.error('[검색 제한 초기화 오류]', error);
    }
}
// 광고 시청 후 검색 가능 상태로 변경
export function setAdWatched() {
    if (typeof window === 'undefined')
        return;
    localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD, 'true');
}
// 광고 시청 여부 확인
export function hasWatchedAd() {
    if (typeof window === 'undefined')
        return false;
    return localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_WATCHED_AD) === 'true';
}
// API 호출을 위한 재사용 가능한 객체 내보내기
export var supabaseAPI = {
    auth: {
        // 인증 관련 메서드
        signIn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!hasValidSupabaseCredentials()) {
                    console.warn('Supabase 환경 변수가 설정되지 않아 로그인을 수행할 수 없습니다.');
                    return [2 /*return*/, { error: new Error('Supabase 환경 변수가 설정되지 않았습니다.') }];
                }
                // 실제 인증 코드
                return [2 /*return*/, supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: "".concat(window.location.origin, "/auth/callback"),
                        },
                    })];
            });
        }); },
        // 기타 인증 메서드...
    },
    data: {
    // 데이터 관련 메서드들...
    }
};
