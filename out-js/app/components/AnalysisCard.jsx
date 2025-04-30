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
import React, { useState } from 'react';
import useClipboard from '../hooks/useClipboard';
import AnalysisRenderer from './AnalysisRenderer';
/**
 * 분석 결과를 표시하는 카드 컴포넌트
 * 리팩토링: 커스텀 클래스 지원, 복사 상태 시각화 개선, aria 속성 추가
 */
var AnalysisCard = function (_a) {
    var analysisText = _a.analysisText, _b = _a.className, className = _b === void 0 ? '' : _b, onCopy = _a.onCopy;
    var _c = useClipboard(), isCopied = _c.isCopied, copyToClipboard = _c.copyToClipboard;
    var _d = useState(false), isExpanded = _d[0], setIsExpanded = _d[1];
    // 복사 버튼 핸들러
    var handleCopy = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, copyToClipboard(analysisText)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        // 부모 컴포넌트에 복사 이벤트 알림 (선택적)
                        if (onCopy)
                            onCopy();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // 접기/펼치기 토글
    var toggleExpand = function () {
        setIsExpanded(!isExpanded);
    };
    if (!analysisText) {
        return (<div className={"card bg-gray-50 min-h-[200px] flex items-center justify-center text-gray-500 ".concat(className)}>
        <p>키워드 분석 후 인사이트가 이곳에 표시됩니다.</p>
      </div>);
    }
    // 분석 카드에 적용할 높이 계산
    var maxHeight = isExpanded ? 'none' : '350px';
    return (<div className={"card ".concat(className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">분석 인사이트</h2>
        <div className="flex space-x-2">
          <button onClick={toggleExpand} className="text-sm text-gray-500 hover:text-primary-600 flex items-center" aria-label={isExpanded ? '분석 내용 접기' : '분석 내용 펼치기'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isExpanded ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>)}
            </svg>
            {isExpanded ? '접기' : '펼치기'}
          </button>
          <button onClick={handleCopy} className="text-sm text-gray-500 hover:text-primary-600 flex items-center transition-colors duration-200" disabled={isCopied} aria-label="분석 내용 복사하기">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            {isCopied ? (<span className="text-green-600">복사됨</span>) : ('복사')}
          </button>
        </div>
      </div>
      
      <AnalysisRenderer analysisText={analysisText} maxHeight={maxHeight} className={isExpanded ? 'pb-4' : ''}/>
      
      {isCopied && (<div className="mt-2 text-xs text-green-600 flex items-center justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          클립보드에 복사되었습니다
        </div>)}
    </div>);
};
export default AnalysisCard;
