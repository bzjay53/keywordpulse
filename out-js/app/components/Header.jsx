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
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabaseClient';
export default function Header() {
    var _this = this;
    var _a;
    var _b = useAuth(), user = _b.user, isLoading = _b.loading, logout = _b.signOut;
    var _c = useState(false), isMenuOpen = _c[0], setIsMenuOpen = _c[1];
    var isDevelopment = process.env.NODE_ENV === 'development';
    // 로그인 상태 디버깅
    useEffect(function () {
        if (isDevelopment) {
            console.log('[Header] 인증 상태 변경:', {
                isAuthenticated: !!user,
                isLoading: isLoading,
                hasCredentials: !!supabase
            });
        }
    }, [user, isLoading]);
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    // 메뉴 닫기
                    setIsMenuOpen(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('로그아웃 중 오류 발생:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary-600 font-bold text-xl">KeywordPulse</Link>
            </div>
          </div>
          
          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 text-gray-600 hover:text-primary-600">홈</Link>
            {/* 임시로 숨김 - 아직 페이지가 준비되지 않음 */}
            {/* <Link href="/pricing" className="px-3 py-2 text-gray-600 hover:text-primary-600">가격</Link> */}
            {/* <Link href="/docs" className="px-3 py-2 text-gray-600 hover:text-primary-600">문서</Link> */}
            
            {isLoading ? (<div className="w-24 h-9 bg-gray-200 animate-pulse rounded-md"></div>) : user ? (<div className="relative ml-3">
                <div>
                  <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none">
                    <span className="mr-2">{(_a = user.email) === null || _a === void 0 ? void 0 : _a.split('@')[0]}</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
                
                {isMenuOpen && (<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={function () { return setIsMenuOpen(false); }}>
                        프로필
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        로그아웃
                      </button>
                    </div>
                  </div>)}
              </div>) : (<Link href="/login" className="px-4 py-2 font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                로그인
              </Link>)}
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center md:hidden">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>)}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      {isMenuOpen && (<div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" onClick={function () { return setIsMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              홈
            </Link>
            {/* 임시로 숨김 - 아직 페이지가 준비되지 않음 */}
            {/* <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              가격
            </Link>
            <Link href="/docs" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
              문서
            </Link> */}
            
            {!isLoading && (<>
                {user ? (<>
                    <Link href="/profile" onClick={function () { return setIsMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
                      프로필
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
                      로그아웃
                    </button>
                  </>) : (<Link href="/login" onClick={function () { return setIsMenuOpen(false); }} className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50">
                    로그인
                  </Link>)}
              </>)}
          </div>
        </div>)}
    </header>);
}
