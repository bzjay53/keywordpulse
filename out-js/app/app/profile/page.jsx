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
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabaseClient';
export default function ProfilePage() {
    var _this = this;
    var _a = useAuth(), user = _a.user, loading = _a.loading;
    var router = useRouter();
    // 텔레그램 설정을 위한 상태 추가
    var _b = useState(''), telegramToken = _b[0], setTelegramToken = _b[1];
    var _c = useState(''), telegramChatId = _c[0], setTelegramChatId = _c[1];
    var _d = useState(false), saving = _d[0], setSaving = _d[1];
    var _e = useState({ type: '', text: '' }), message = _e[0], setMessage = _e[1];
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    useEffect(function () {
        if (!loading && !user) {
            router.push('/login');
        }
        else if (user) {
            // 사용자의 텔레그램 설정 불러오기
            loadTelegramSettings();
        }
    }, [user, loading, router]);
    // 텔레그램 설정 불러오기
    var loadTelegramSettings = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!(user === null || user === void 0 ? void 0 : user.id))
                        return [2 /*return*/];
                    return [4 /*yield*/, supabase
                            .from('user_settings')
                            .select('telegram_token, telegram_chat_id')
                            .eq('user_id', user.id)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('설정 로드 오류:', error);
                        return [2 /*return*/];
                    }
                    if (data) {
                        setTelegramToken(data.telegram_token || '');
                        setTelegramChatId(data.telegram_chat_id || '');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('텔레그램 설정 로드 오류:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // 텔레그램 설정 저장
    var saveTelegramSettings = function () { return __awaiter(_this, void 0, void 0, function () {
        var error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    if (!(user === null || user === void 0 ? void 0 : user.id))
                        return [2 /*return*/];
                    setSaving(true);
                    setMessage({ type: '', text: '' });
                    return [4 /*yield*/, supabase
                            .from('user_settings')
                            .upsert({
                            user_id: user.id,
                            telegram_token: telegramToken,
                            telegram_chat_id: telegramChatId,
                            updated_at: new Date().toISOString()
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error('설정 저장 오류:', error);
                        setMessage({ type: 'error', text: '설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.' });
                        return [2 /*return*/];
                    }
                    setMessage({ type: 'success', text: '텔레그램 설정이 성공적으로 저장되었습니다.' });
                    // 3초 후 메시지 삭제
                    setTimeout(function () {
                        setMessage({ type: '', text: '' });
                    }, 3000);
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('텔레그램 설정 저장 오류:', error_2);
                    setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // 테스트 메시지 전송
    var sendTestMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setSaving(true);
                    setMessage({ type: '', text: '' });
                    return [4 /*yield*/, fetch('/api/notify/telegram/test', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                token: telegramToken,
                                chat_id: telegramChatId,
                                message: '테스트 메시지: KeywordPulse에서 보낸 메시지입니다.'
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (!response.ok) {
                        setMessage({ type: 'error', text: "\uD14C\uC2A4\uD2B8 \uBA54\uC2DC\uC9C0 \uC804\uC1A1 \uC2E4\uD328: ".concat(result.error || '알 수 없는 오류') });
                        return [2 /*return*/];
                    }
                    setMessage({ type: 'success', text: '테스트 메시지가 성공적으로 전송되었습니다!' });
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('테스트 메시지 전송 오류:', error_3);
                    setMessage({ type: 'error', text: '테스트 메시지 전송 중 오류가 발생했습니다.' });
                    return [3 /*break*/, 5];
                case 4:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // 로딩 중 또는 미인증 상태일 때 표시할 내용
    if (loading || !user) {
        return (<div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">내 프로필</h1>
        <p className="text-gray-600">사용자 정보 및 설정을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">마지막 로그인</p>
              <p className="font-medium">
                {user.last_sign_in_at
            ? new Date(user.last_sign_in_at).toLocaleString('ko-KR')
            : '정보 없음'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">내 활동</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">키워드 검색 횟수</p>
              <p className="font-medium">12회</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">저장된 키워드 세트</p>
              <p className="font-medium">3개</p>
            </div>
          </div>
        </div>

        {/* 텔레그램 알림 설정 섹션 추가 */}
        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">텔레그램 알림 설정</h2>
          <p className="text-gray-600 mb-4">키워드 분석 결과를 텔레그램으로 받아보세요.</p>
          
          {message.text && (<div className={"p-3 rounded-md mb-4 ".concat(message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
              {message.text}
            </div>)}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="telegram-token" className="block text-sm text-gray-500 mb-1">
                텔레그램 봇 토큰
              </label>
              <input id="telegram-token" type="text" value={telegramToken} onChange={function (e) { return setTelegramToken(e.target.value); }} placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              <p className="text-xs text-gray-500 mt-1">
                <a href="https://core.telegram.org/bots#botfather" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  @BotFather
                </a>에서 봇을 만들고 토큰을 받으세요
              </p>
            </div>
            
            <div>
              <label htmlFor="telegram-chat-id" className="block text-sm text-gray-500 mb-1">
                텔레그램 채팅 ID
              </label>
              <input id="telegram-chat-id" type="text" value={telegramChatId} onChange={function (e) { return setTelegramChatId(e.target.value); }} placeholder="12345678" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
              <p className="text-xs text-gray-500 mt-1">
                텔레그램에서 
                <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline mx-1">
                  @userinfobot
                </a>
                에게 메시지를 보내면 ID를 알려드립니다
              </p>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button onClick={saveTelegramSettings} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50">
                {saving ? '저장 중...' : '설정 저장'}
              </button>
              
              <button onClick={sendTestMessage} disabled={saving || !telegramToken || !telegramChatId} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50">
                테스트 메시지 보내기
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">계정 설정</h2>
          
          <div className="space-y-4">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              비밀번호 변경
            </button>
            
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>);
}
