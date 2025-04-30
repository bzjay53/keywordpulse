'use client';
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, signOut } from './supabaseClient';
// 기본값 생성
var defaultAuthContext = {
    user: null,
    loading: true,
    error: null,
    refreshSession: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    logout: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
};
// AuthContext 생성
var AuthContext = createContext(defaultAuthContext);
// AuthProvider 컴포넌트
export function AuthProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = useState(null), user = _b[0], setUser = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    // 세션 새로고침 함수
    var refreshSession = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error_1, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, getSession()];
                case 1:
                    _a = _c.sent(), data = _a.data, error_1 = _a.error;
                    if (error_1) {
                        throw error_1;
                    }
                    setUser(((_b = data.session) === null || _b === void 0 ? void 0 : _b.user) || null);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _c.sent();
                    console.error('세션 새로고침 오류:', err_1.message);
                    setError(err_1.message);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // 로그아웃 함수
    var logout = function () { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, signOut()];
                case 1:
                    _a.sent();
                    setUser(null);
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    console.error('로그아웃 오류:', err_2.message);
                    setError(err_2.message);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // 초기 세션 로드
    useEffect(function () {
        var loadSession = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, refreshSession()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        loadSession();
    }, []);
    // 인증 상태 변경 시 이벤트 리스너 (실제 Supabase 환경에서 활용)
    useEffect(function () {
        // 서버 사이드 렌더링 시 실행하지 않음
        if (typeof window === 'undefined')
            return;
        var checkSession = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var data, currentUser;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getSession()];
                    case 1:
                        data = (_b.sent()).data;
                        currentUser = ((_a = data.session) === null || _a === void 0 ? void 0 : _a.user) || null;
                        // 사용자 상태가 변경된 경우에만 업데이트
                        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
                            setUser(currentUser);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 60000); // 1분마다 세션 확인
        return function () { return clearInterval(checkSession); };
    }, [user]);
    return (<AuthContext.Provider value={{
            user: user,
            loading: loading,
            error: error,
            refreshSession: refreshSession,
            logout: logout,
        }}>
      {children}
    </AuthContext.Provider>);
}
// useAuth 훅
export function useAuth() {
    return useContext(AuthContext);
}
