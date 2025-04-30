'use client';
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
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp, resetSearchLimit } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/AuthContext';
export default function LoginPage() {
    var _this = this;
    var _a = useState(''), email = _a[0], setEmail = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(null), success = _e[0], setSuccess = _e[1];
    var _f = useState('login'), mode = _f[0], setMode = _f[1];
    var _g = useState(false), envWarning = _g[0], setEnvWarning = _g[1];
    var _h = useState({}), validationErrors = _h[0], setValidationErrors = _h[1];
    var _j = useState(false), showDelay = _j[0], setShowDelay = _j[1];
    var _k = useState(0), delaySeconds = _k[0], setDelaySeconds = _k[1];
    var router = useRouter();
    var _l = useAuth(), user = _l.user, refreshSession = _l.refreshSession;
    // URL 파라미터 처리
    useEffect(function () {
        // URL 파라미터 확인
        var params = new URLSearchParams(window.location.search);
        var errorParam = params.get('error');
        var modeParam = params.get('mode');
        if (errorParam === 'auth_callback_error') {
            setError('인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
        }
        else if (errorParam === 'auth_session_error') {
            setError('인증 세션 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
        else if (errorParam === 'auth_code_missing') {
            setError('인증 코드가 없습니다. 다시 시도해주세요.');
        }
        // mode 파라미터가 있으면 해당 모드로 설정 (signup 또는 login)
        if (modeParam === 'signup') {
            setMode('signup');
        }
        else if (modeParam === 'login') {
            setMode('login');
        }
        // 이미 로그인된 경우 홈으로 리다이렉트
        if (user) {
            router.push('/');
        }
        // 환경 변수 체크
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            setEnvWarning(true);
        }
    }, [user, router]);
    // 모드 변경 시 에러 초기화
    useEffect(function () {
        setError(null);
        setSuccess(null);
        setValidationErrors({});
    }, [mode]);
    // 카운트다운 효과 (요청 제한 시)
    useEffect(function () {
        var timer;
        if (showDelay && delaySeconds > 0) {
            timer = setInterval(function () {
                setDelaySeconds(function (prev) {
                    var newValue = prev - 1;
                    if (newValue <= 0) {
                        setShowDelay(false);
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
        }
        return function () {
            if (timer)
                clearInterval(timer);
        };
    }, [showDelay, delaySeconds]);
    // 입력값 유효성 검사
    var validateInputs = function () {
        var errors = {};
        // 이메일 형식 검사
        if (!email.trim()) {
            errors.email = '이메일을 입력해주세요.';
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = '유효한 이메일 형식이 아닙니다.';
        }
        // 비밀번호 검사
        if (!password.trim()) {
            errors.password = '비밀번호를 입력해주세요.';
        }
        else if (mode === 'signup' && password.length < 6) {
            errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, signInError, match, seconds, _b, data, signUpError, message, match, seconds, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    setSuccess(null);
                    // 입력값 유효성 검사
                    if (!validateInputs()) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, 10, 11]);
                    if (!(mode === 'login')) return [3 /*break*/, 4];
                    return [4 /*yield*/, signIn(email, password)];
                case 2:
                    _a = _c.sent(), data = _a.data, signInError = _a.error;
                    if (signInError) {
                        // 요청 제한 오류 처리
                        if (signInError.message.includes('너무 빠른 요청') || signInError.message.includes('너무 많은 요청')) {
                            match = signInError.message.match(/(\d+)초/);
                            if (match && match[1]) {
                                seconds = parseInt(match[1], 10);
                                setDelaySeconds(seconds);
                                setShowDelay(true);
                            }
                        }
                        throw new Error(signInError.message);
                    }
                    console.log('로그인 성공:', data);
                    // 로그인 성공 시 검색 제한 초기화
                    resetSearchLimit();
                    // 세션 갱신
                    return [4 /*yield*/, refreshSession()];
                case 3:
                    // 세션 갱신
                    _c.sent();
                    // 홈으로 리다이렉트
                    router.push('/');
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, signUp(email, password)];
                case 5:
                    _b = _c.sent(), data = _b.data, signUpError = _b.error, message = _b.message;
                    if (signUpError) {
                        // 요청 제한 오류 처리
                        if (signUpError.message.includes('너무 빠른 요청') || signUpError.message.includes('너무 많은 요청')) {
                            match = signUpError.message.match(/(\d+)초/);
                            if (match && match[1]) {
                                seconds = parseInt(match[1], 10);
                                setDelaySeconds(seconds);
                                setShowDelay(true);
                            }
                        }
                        throw new Error(signUpError.message);
                    }
                    console.log('회원가입 성공:', data, message);
                    if (!(data === null || data === void 0 ? void 0 : data.session)) return [3 /*break*/, 7];
                    // 개발 모드에서는 즉시 로그인 상태가 됨
                    setSuccess('회원가입이 완료되었습니다! 홈 페이지로 이동합니다.');
                    // 세션 갱신
                    return [4 /*yield*/, refreshSession()];
                case 6:
                    // 세션 갱신
                    _c.sent();
                    // 잠시 후 홈으로 리다이렉트
                    setTimeout(function () {
                        router.push('/');
                    }, 2000);
                    return [3 /*break*/, 8];
                case 7:
                    // 실제 환경에서는 이메일 확인 필요
                    setSuccess(message || '회원가입이 완료되었습니다! 이메일을 확인하여 계정을 활성화한 후 로그인해주세요.');
                    setMode('login');
                    _c.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    err_1 = _c.sent();
                    console.error('인증 오류:', err_1);
                    setError(err_1.message);
                    return [3 /*break*/, 11];
                case 10:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    // URL 파라미터에 모드 정보 추가하는 함수
    var updateURLWithMode = function (newMode) {
        var url = new URL(window.location.href);
        url.searchParams.set('mode', newMode);
        window.history.pushState({}, '', url.toString());
        setMode(newMode);
    };
    return (<div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? '로그인' : '회원가입'}
      </h1>
      
      {/* 모드 전환 탭 */}
      <div className="flex mb-6 border-b">
        <button onClick={function () { return updateURLWithMode('login'); }} className={"flex-1 py-2 ".concat(mode === 'login' ? 'text-primary-600 border-b-2 border-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700')}>
          로그인
        </button>
        <button onClick={function () { return updateURLWithMode('signup'); }} className={"flex-1 py-2 ".concat(mode === 'signup' ? 'text-primary-600 border-b-2 border-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700')}>
          회원가입
        </button>
      </div>
      
      {envWarning && (<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">환경 변수 설정 필요</p>
          <p>Supabase 환경 변수가 설정되지 않았습니다. 로그인 기능이 동작하지 않을 수 있습니다.</p>
          <p className="mt-1 text-sm">
            <strong>개발 모드:</strong> admin@example.com / admin123으로 로그인할 수 있습니다.
          </p>
        </div>)}
      
      {error && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">오류 발생</p>
          <p>{error}</p>
        </div>)}
      
      {success && (<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">성공</p>
          <p>{success}</p>
        </div>)}
      
      {showDelay && delaySeconds > 0 && (<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold">잠시 기다려주세요</p>
          <p>{delaySeconds}초 후에 다시 시도할 수 있습니다.</p>
          <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: "".concat((delaySeconds / 3) * 100, "%") }}></div>
          </div>
        </div>)}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">이메일</label>
          <input id="email" type="email" value={email} onChange={function (e) {
            setEmail(e.target.value);
            setValidationErrors(__assign(__assign({}, validationErrors), { email: undefined }));
        }} className={"w-full px-3 py-2 border ".concat(validationErrors.email ? 'border-red-500' : 'border-gray-300', " rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500")} placeholder="your@email.com" disabled={isLoading || showDelay}/>
          {validationErrors.email && (<p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>)}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">비밀번호</label>
          <input id="password" type="password" value={password} onChange={function (e) {
            setPassword(e.target.value);
            setValidationErrors(__assign(__assign({}, validationErrors), { password: undefined }));
        }} className={"w-full px-3 py-2 border ".concat(validationErrors.password ? 'border-red-500' : 'border-gray-300', " rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500")} placeholder="********" disabled={isLoading || showDelay}/>
          {validationErrors.password && (<p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>)}
          {mode === 'signup' && (<p className="mt-1 text-xs text-gray-500">비밀번호는 최소 6자 이상이어야 합니다.</p>)}
        </div>
        
        <button type="submit" className={"w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ".concat(isLoading || showDelay
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700')} disabled={isLoading || showDelay}>
          {isLoading ? (<span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              처리 중...
            </span>) : mode === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          {mode === 'login' ? '로그인' : '회원가입'}하시면 <Link href="/terms" className="text-primary-600 hover:text-primary-700">이용약관</Link>과{' '}
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">개인정보처리방침</Link>에 동의하게 됩니다.
        </p>
      </div>
    </div>);
}
