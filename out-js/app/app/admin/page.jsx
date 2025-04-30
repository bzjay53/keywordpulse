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
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
export default function AdminPage() {
    var _this = this;
    var _a = useAuth(), user = _a.user, loading = _a.loading;
    var router = useRouter();
    var _b = useState(false), isAdmin = _b[0], setIsAdmin = _b[1];
    var _c = useState({
        analyticsEnabled: true,
        maxKeywordsPerSearch: 20,
        telegramNotificationsEnabled: false,
        defaultSearchProvider: 'naver'
    }), settings = _c[0], setSettings = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(null), message = _e[0], setMessage = _e[1];
    // 관리자 권한 확인
    useEffect(function () {
        if (!loading) {
            if (!user) {
                // 로그인하지 않은 경우 로그인 페이지로 이동
                router.push('/login');
            }
            else {
                // 로그인한 사용자의 관리자 권한 확인
                checkAdminStatus(user.id);
            }
        }
    }, [user, loading, router]);
    // 관리자 권한 확인 함수 (실제로는 Supabase에서 확인)
    var checkAdminStatus = function (userId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // 실제 코드에서는 Supabase 쿼리로 관리자 권한 확인
                // 지금은 임시로 사용자 이메일이 'admin@example.com'인 경우에만 관리자로 설정
                if ((user === null || user === void 0 ? void 0 : user.email) === 'admin@example.com') {
                    setIsAdmin(true);
                }
                else {
                    router.push('/'); // 관리자가 아닌 경우 홈으로 리다이렉트
                }
            }
            catch (error) {
                console.error('관리자 권한 확인 중 오류:', error);
                router.push('/');
            }
            return [2 /*return*/];
        });
    }); };
    // 설정 저장
    var saveSettings = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setMessage(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // 실제 코드에서는 API 호출로 설정 저장
                    // 임시 구현: 짧은 시간 후 성공 메시지 표시
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 2:
                    // 실제 코드에서는 API 호출로 설정 저장
                    // 임시 구현: 짧은 시간 후 성공 메시지 표시
                    _a.sent();
                    setMessage({
                        text: '설정이 성공적으로 저장되었습니다.',
                        type: 'success'
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setMessage({
                        text: '설정 저장 중 오류가 발생했습니다.',
                        type: 'error'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // 로딩 중이거나 관리자가 아닌 경우
    if (loading || !isAdmin) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">접근 권한을 확인하는 중입니다...</p>
        </div>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">관리자 설정</h1>
      
      {message && (<div className={"p-4 mb-6 rounded ".concat(message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {message.text}
        </div>)}
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">애플리케이션 설정</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">데이터 분석 활성화</label>
              <p className="text-sm text-gray-500">사용자 검색 데이터 수집 및 분석</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.analyticsEnabled} onChange={function (e) { return setSettings(__assign(__assign({}, settings), { analyticsEnabled: e.target.checked })); }} className="sr-only peer"/>
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="font-medium">검색당 최대 키워드 수</label>
            <p className="text-sm text-gray-500 mb-2">키워드 검색 결과 제한</p>
            <input type="number" min="5" max="50" value={settings.maxKeywordsPerSearch} onChange={function (e) { return setSettings(__assign(__assign({}, settings), { maxKeywordsPerSearch: parseInt(e.target.value) || 10 })); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">텔레그램 알림</label>
              <p className="text-sm text-gray-500">새 검색 결과에 대한 알림 전송</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.telegramNotificationsEnabled} onChange={function (e) { return setSettings(__assign(__assign({}, settings), { telegramNotificationsEnabled: e.target.checked })); }} className="sr-only peer"/>
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label className="font-medium">기본 검색 제공자</label>
            <p className="text-sm text-gray-500 mb-2">키워드 검색에 사용할 기본 플랫폼</p>
            <select value={settings.defaultSearchProvider} onChange={function (e) { return setSettings(__assign(__assign({}, settings), { defaultSearchProvider: e.target.value })); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="naver">네이버</option>
              <option value="google">구글</option>
              <option value="daum">다음</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">관리자 전용 기능</h2>
        
        <div className="space-y-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500" onClick={function () { return confirm('정말로 모든 캐시를 지우시겠습니까?'); }}>
            검색 캐시 비우기
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4" onClick={function () { return confirm('정말로 사용 통계를 초기화하시겠습니까?'); }}>
            사용 통계 초기화
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4" onClick={function () { return router.push('/'); }}>
          취소
        </button>
        
        <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={saveSettings} disabled={isLoading}>
          {isLoading ? (<span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              저장 중...
            </span>) : '설정 저장'}
        </button>
      </div>
    </div>);
}
