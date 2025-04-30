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
var ActionButtons = function (_a) {
    var keywords = _a.keywords, analysisText = _a.analysisText, timestamp = _a.timestamp;
    var _b = useState(false), isSending = _b[0], setIsSending = _b[1];
    var _c = useState('none'), sendStatus = _c[0], setSendStatus = _c[1];
    // 컴포넌트 마운트 시 자동으로 데이터 저장 및 전송
    useEffect(function () {
        if (analysisText && keywords.length > 0) {
            // 구글 시트에 자동 저장 (백그라운드)
            saveToSheetsBackground();
            // 텔레그램으로 자동 전송
            handleSendToTelegram();
        }
    }, [analysisText, keywords]); // 분석 텍스트나 키워드가 변경될 때만 실행
    // 백그라운드에서 구글 시트에 저장
    var saveToSheetsBackground = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('/api/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                keywords: keywords,
                                timestamp: timestamp
                            })
                        })];
                case 1:
                    _a.sent();
                    console.log('키워드 데이터가 백그라운드에서 저장되었습니다.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('백그라운드 저장 중 오류 발생:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Telegram으로 전송
    var handleSendToTelegram = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSending || !analysisText)
                        return [2 /*return*/];
                    setIsSending(true);
                    setSendStatus('sending');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/notify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                analysisText: analysisText
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("\uC804\uC1A1 API \uC624\uB958: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        setSendStatus('success');
                        console.log('분석 결과가 텔레그램으로 전송되었습니다.');
                    }
                    else {
                        throw new Error('Telegram 메시지 전송에 실패했습니다.');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Telegram 전송 중 오류 발생:', error_2);
                    setSendStatus('error');
                    return [3 /*break*/, 6];
                case 5:
                    setIsSending(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="card bg-gray-50">
      <h3 className="text-lg font-medium mb-4">분석 결과 공유</h3>
      
      <div className="flex flex-col space-y-3">
        {sendStatus === 'none' ? (<p className="text-gray-500 text-sm">분석 결과가 자동으로 저장 및 공유됩니다.</p>) : sendStatus === 'sending' ? (<div className="flex items-center text-gray-500 text-sm">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            텔레그램으로 전송 중...
          </div>) : sendStatus === 'success' ? (<div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
            텔레그램으로 전송 완료
          </div>) : (<div className="flex items-center text-red-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            텔레그램 전송 실패 - 다시 시도해주세요
            <button onClick={handleSendToTelegram} className="ml-2 text-blue-500 hover:text-blue-700 underline">
              재시도
            </button>
          </div>)}
        
        <p className="text-xs text-gray-400 mt-2">
          분석 결과는 자동으로 저장되며 텔레그램으로 전송됩니다.
        </p>
      </div>
    </div>);
};
export default ActionButtons;
