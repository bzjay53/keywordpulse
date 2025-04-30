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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TrendChart from '../components/TrendChart';
import KeywordCloud from '../components/KeywordCloud';
import { getTrendingKeywords, getRelatedKeywords, getKeywordTrend } from '../lib/trends_api';
import logger from '../lib/logger';
/**
 * 트렌드 대시보드 컴포넌트
 * 트렌드 API의 데이터를 로드하고 시각화하는 대시보드 컴포넌트
 */
export default function TrendDashboard() {
    var _a;
    // 상태 관리
    var _b = useState('all'), category = _b[0], setCategory = _b[1];
    var _c = useState([]), trendingKeywords = _c[0], setTrendingKeywords = _c[1];
    var _d = useState(''), selectedKeyword = _d[0], setSelectedKeyword = _d[1];
    var _e = useState([]), relatedKeywords = _e[0], setRelatedKeywords = _e[1];
    var _f = useState([]), trendData = _f[0], setTrendData = _f[1];
    var _g = useState({
        trending: true,
        related: false,
        trend: false,
    }), isLoading = _g[0], setIsLoading = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    var _j = useState('blue'), colorScheme = _j[0], setColorScheme = _j[1];
    // 카테고리 옵션
    var categoryOptions = useMemo(function () { return [
        { value: 'all', label: '전체', color: 'blue' },
        { value: 'business', label: '비즈니스', color: 'green' },
        { value: 'technology', label: '기술', color: 'purple' },
        { value: 'entertainment', label: '엔터테인먼트', color: 'orange' },
        { value: 'health', label: '건강', color: 'green' },
    ]; }, []);
    // 초기 트렌딩 키워드 로드
    useEffect(function () {
        function loadTrendingKeywords() {
            return __awaiter(this, void 0, void 0, function () {
                var data, categoryOption, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            setIsLoading(function (prev) { return (__assign(__assign({}, prev), { trending: true })); });
                            setError(null);
                            return [4 /*yield*/, getTrendingKeywords(category)];
                        case 1:
                            data = _a.sent();
                            setTrendingKeywords(data);
                            // 첫 번째 키워드 선택
                            if (data.length > 0 && !selectedKeyword) {
                                setSelectedKeyword(data[0].keyword);
                            }
                            categoryOption = categoryOptions.find(function (opt) { return opt.value === category; });
                            if (categoryOption && categoryOption.color) {
                                setColorScheme(categoryOption.color);
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            err_1 = _a.sent();
                            logger.error({
                                message: '트렌딩 키워드 로드 오류',
                                error: err_1,
                                tags: { module: 'TrendDashboard', action: 'loadTrendingKeywords' }
                            });
                            setError('트렌딩 키워드를 불러오는 중 오류가 발생했습니다.');
                            return [3 /*break*/, 4];
                        case 3:
                            setIsLoading(function (prev) { return (__assign(__assign({}, prev), { trending: false })); });
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        loadTrendingKeywords();
    }, [category, categoryOptions]);
    // 키워드 선택 시 관련 키워드 및 트렌드 데이터 로드
    useEffect(function () {
        if (!selectedKeyword)
            return;
        function loadKeywordData() {
            return __awaiter(this, void 0, void 0, function () {
                var relatedData, trendData_1, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            // 로딩 상태 설정
                            setIsLoading(function (prev) { return (__assign(__assign({}, prev), { related: true, trend: true })); });
                            setError(null);
                            return [4 /*yield*/, getRelatedKeywords(selectedKeyword)];
                        case 1:
                            relatedData = _a.sent();
                            setRelatedKeywords(relatedData);
                            return [4 /*yield*/, getKeywordTrend(selectedKeyword)];
                        case 2:
                            trendData_1 = _a.sent();
                            setTrendData(trendData_1);
                            return [3 /*break*/, 5];
                        case 3:
                            err_2 = _a.sent();
                            logger.error({
                                message: '키워드 데이터 로드 오류',
                                error: err_2,
                                context: { keyword: selectedKeyword },
                                tags: { module: 'TrendDashboard', action: 'loadKeywordData' }
                            });
                            setError('키워드 데이터를 불러오는 중 오류가 발생했습니다.');
                            return [3 /*break*/, 5];
                        case 4:
                            setIsLoading(function (prev) { return (__assign(__assign({}, prev), { related: false, trend: false })); });
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        loadKeywordData();
    }, [selectedKeyword]);
    // 키워드 선택 핸들러
    var handleKeywordSelect = useCallback(function (keyword) {
        setSelectedKeyword(keyword);
    }, []);
    // 카테고리 변경 핸들러
    var handleCategoryChange = useCallback(function (e) {
        setCategory(e.target.value);
    }, []);
    // 높은 변화율을 가진 키워드 필터링
    var trendingKeywordsWithHighChange = useMemo(function () {
        return trendingKeywords.filter(function (k) { return k.change !== undefined && k.change > 20; });
    }, [trendingKeywords]);
    return (<div className="trend-dashboard">
      {/* 오류 메시지 */}
      {error && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">오류</p>
          <p>{error}</p>
        </div>)}

      {/* 카테고리 선택 */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="category" className="font-medium text-gray-700">
            카테고리 선택
          </label>
          <select id="category" value={category} onChange={handleCategoryChange} className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" disabled={isLoading.trending}>
            {categoryOptions.map(function (option) { return (<option key={option.value} value={option.value}>{option.label}</option>); })}
          </select>
          
          <div className="ml-auto text-sm text-gray-500">
            {!isLoading.trending && "".concat(trendingKeywords.length, "\uAC1C \uD0A4\uC6CC\uB4DC \uB85C\uB4DC\uB428")}
          </div>
        </div>
      </div>

      {/* 트렌딩 키워드 목록 및 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 트렌딩 키워드 목록 */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">인기 키워드</h2>
          
          {isLoading.trending ? (<div className="animate-pulse">
              {__spreadArray([], Array(10), true).map(function (_, index) { return (<div key={index} className="h-10 bg-gray-200 rounded my-2"></div>); })}
            </div>) : (<ul className="divide-y divide-gray-200">
              {trendingKeywords.map(function (item) { return (<li key={item.keyword} className="py-2">
                  <button onClick={function () { return handleKeywordSelect(item.keyword); }} className={"w-full text-left px-3 py-2 rounded-md transition-colors ".concat(selectedKeyword === item.keyword
                    ? "bg-".concat(colorScheme, "-100 text-").concat(colorScheme, "-800")
                    : 'hover:bg-gray-50')} aria-current={selectedKeyword === item.keyword ? 'true' : 'false'}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.keyword}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">{item.count}</span>
                        {item.change !== undefined && (<span className={"text-xs ".concat(item.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {item.change >= 0 ? "+".concat(item.change, "%") : "".concat(item.change, "%")}
                          </span>)}
                      </div>
                    </div>
                  </button>
                </li>); })}
            </ul>)}

          {!isLoading.trending && trendingKeywords.length === 0 && (<div className="text-center p-6 text-gray-500">
              <p>인기 키워드가 없습니다.</p>
            </div>)}
        </div>

        {/* 선택된 키워드 트렌드 차트 */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
            {selectedKeyword ? "\"".concat(selectedKeyword, "\" \uD2B8\uB80C\uB4DC") : '키워드 트렌드'}
          </h2>
          
          <TrendChart keyword={selectedKeyword} trendData={trendData} height={320} className="mt-4" isLoading={isLoading.trend} colorScheme={colorScheme}/>
        </div>
      </div>

      {/* 관련 키워드 클라우드 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          {selectedKeyword ? "\"".concat(selectedKeyword, "\" \uAD00\uB828 \uD0A4\uC6CC\uB4DC") : '관련 키워드'}
        </h2>
        
        <KeywordCloud keywords={relatedKeywords} mainKeyword={selectedKeyword} className="mt-4" onKeywordClick={handleKeywordSelect} isLoading={isLoading.related} animate={true}/>
      </div>

      {/* 카테고리별 인사이트 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">카테고리별 인사이트</h2>
        
        {isLoading.trending ? (<div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>) : (<>
            <p className="text-gray-600 mb-4">
              선택한 카테고리({(_a = categoryOptions.find(function (option) { return option.value === category; })) === null || _a === void 0 ? void 0 : _a.label})의 인기 키워드 및 트렌드 분석을 통해 다음과 같은 인사이트를 도출할 수 있습니다:
            </p>
            
            <div className={"bg-".concat(colorScheme, "-50 p-5 rounded-lg")}>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                {trendingKeywords.length > 0 && (<li>
                    인기 키워드 상위 {Math.min(5, trendingKeywords.length)}개({trendingKeywords.slice(0, 5).map(function (k) { return "\"".concat(k.keyword, "\""); }).join(', ')})는 최근 트렌드의 핵심 주제입니다.
                  </li>)}
                
                {trendingKeywordsWithHighChange.length > 0 ? (<li>
                    급상승 키워드({trendingKeywordsWithHighChange.map(function (k) { return "\"".concat(k.keyword, "\""); }).join(', ')})에 주목할 필요가 있습니다.
                  </li>) : (<li>현재 급상승 중인 주목할 만한 키워드가 없습니다.</li>)}
                
                {selectedKeyword && relatedKeywords.length > 0 && (<li>
                    "{selectedKeyword}" 키워드는 {relatedKeywords.length}개의 관련 키워드와 연결되어 있어 콘텐츠 확장성이 있습니다.
                  </li>)}
                
                <li>
                  콘텐츠 전략 수립 시 인기 키워드와 관련 키워드를 포함한 콘텐츠를 우선적으로 고려하세요.
                </li>
                
                {selectedKeyword && trendData.length > 0 && (<li>
                    "{selectedKeyword}" 키워드는 {(function () {
                    var values = trendData.map(function (item) { return item.value; });
                    var first = values[0];
                    var last = values[values.length - 1];
                    var diff = last - first;
                    var percentage = Math.round((diff / first) * 100);
                    if (percentage > 10)
                        return '상승세를 보이고 있어 적극적 활용이 권장됩니다';
                    if (percentage < -10)
                        return '하락세를 보이고 있어 신중한 접근이 필요합니다';
                    return '안정적인 추세를 보이고 있습니다';
                })()}
                  </li>)}
              </ul>
            </div>
          </>)}
      </div>
    </div>);
}
