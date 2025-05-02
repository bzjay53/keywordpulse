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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KeywordTable from '../components/KeywordTable';
import AnalysisCard from '../components/AnalysisCard';
import ActionButtons from '../components/ActionButtons';
import JsonLd, { createAppJsonLd, createFaqJsonLd } from '../components/JsonLd';
import { useAuth } from '../lib/AuthContext';
import { trackSearchUsage, incrementSearchCount, hasWatchedAd, setAdWatched } from '../lib/supabaseClient';
import AdBanner from '../components/AdBanner';
import PremiumFeatures from '../components/PremiumFeatures';
// 인기 검색어 목록
var TRENDING_KEYWORDS = [
    { keyword: 'AI 마케팅', count: 342 },
    { keyword: '콘텐츠 전략', count: 267 },
    { keyword: 'SNS 광고', count: 201 },
    { keyword: '이커머스 트렌드', count: 189 },
    { keyword: '디지털 마케팅', count: 175 }
];
// 인기 키워드 데이터 (실시간 데이터 연동 전 임시 데이터)
var TRENDING_KEYWORDS_DATA = [
    {
        keyword: 'AI 마케팅',
        monthlySearches: 42500,
        competitionRate: 0.31,
        score: 92,
        recommendation: '강력 추천'
    },
    {
        keyword: '콘텐츠 전략',
        monthlySearches: 38200,
        competitionRate: 0.25,
        score: 87,
        recommendation: '강력 추천'
    },
    {
        keyword: 'SNS 광고',
        monthlySearches: 31400,
        competitionRate: 0.42,
        score: 76,
        recommendation: '추천'
    },
    {
        keyword: '이커머스 트렌드',
        monthlySearches: 28600,
        competitionRate: 0.38,
        score: 72,
        recommendation: '추천'
    },
    {
        keyword: '디지털 마케팅',
        monthlySearches: 45700,
        competitionRate: 0.51,
        score: 68,
        recommendation: '추천'
    }
];
// 메타데이터는 클라이언트 컴포넌트에서 직접 export할 수 없으므로 제거
// metadata.ts 파일에서 별도로 관리됩니다
export default function Home() {
    var _this = this;
    var _a = useState(''), keyword = _a[0], setKeyword = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState([]), searchResults = _c[0], setSearchResults = _c[1];
    var _d = useState(''), analysisText = _d[0], setAnalysisText = _d[1];
    var _e = useState(''), searchTime = _e[0], setSearchTime = _e[1];
    var _f = useState(false), showAdModal = _f[0], setShowAdModal = _f[1];
    var _g = useState(false), adCompleted = _g[0], setAdCompleted = _g[1];
    var _h = useState(false), searchLimitReached = _h[0], setSearchLimitReached = _h[1];
    var user = useAuth().user;
    var router = useRouter();
    // 검색 제한 확인
    useEffect(function () {
        // 로그인된 사용자는 검색 제한을 적용하지 않음
        if (user) {
            setSearchLimitReached(false);
            return;
        }
        var canSearch = trackSearchUsage();
        setSearchLimitReached(!canSearch);
    }, [user]);
    var handleSearch = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var canSearch, searchResponse, searchData, keywordStrings, analyzeResponse, analyzeData, canSearchAgain, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!keyword.trim())
                        return [2 /*return*/];
                    // 로그인된 사용자는 검색 제한을 적용하지 않음
                    if (!user) {
                        canSearch = trackSearchUsage();
                        if (!canSearch) {
                            // 광고를 이미 시청했는지 확인
                            if (hasWatchedAd()) {
                                alert('오늘의 검색 한도를 모두 사용했습니다. 내일 다시 시도하거나 회원가입 후 이용해주세요.');
                                return [2 /*return*/];
                            }
                            else {
                                // 광고 시청 모달 표시
                                setShowAdModal(true);
                                return [2 /*return*/];
                            }
                        }
                    }
                    setIsLoading(true);
                    setSearchResults([]);
                    setAnalysisText('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    // 비로그인 사용자만 검색 카운트 증가
                    if (!user) {
                        incrementSearchCount();
                    }
                    return [4 /*yield*/, fetch('/api/search', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ keyword: keyword.trim() })
                        })];
                case 2:
                    searchResponse = _a.sent();
                    if (!searchResponse.ok) {
                        throw new Error("\uAC80\uC0C9 API \uC624\uB958: ".concat(searchResponse.status));
                    }
                    return [4 /*yield*/, searchResponse.json()];
                case 3:
                    searchData = _a.sent();
                    setSearchResults(searchData.keywords);
                    // 현재 시간 저장
                    setSearchTime(new Date().toISOString());
                    if (!(searchData.keywords && searchData.keywords.length > 0)) return [3 /*break*/, 6];
                    keywordStrings = searchData.keywords.map(function (k) { return k.keyword; });
                    return [4 /*yield*/, fetch('/api/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ keywords: keywordStrings })
                        })];
                case 4:
                    analyzeResponse = _a.sent();
                    if (!analyzeResponse.ok) {
                        throw new Error("\uBD84\uC11D API \uC624\uB958: ".concat(analyzeResponse.status));
                    }
                    return [4 /*yield*/, analyzeResponse.json()];
                case 5:
                    analyzeData = _a.sent();
                    setAnalysisText(analyzeData.analysisText);
                    _a.label = 6;
                case 6:
                    // 검색 후 검색 제한 갱신 (로그인 사용자는 제외)
                    if (!user) {
                        canSearchAgain = trackSearchUsage();
                        setSearchLimitReached(!canSearchAgain);
                    }
                    return [3 /*break*/, 9];
                case 7:
                    error_1 = _a.sent();
                    console.error('검색 및 분석 중 오류 발생:', error_1);
                    alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
                    return [3 /*break*/, 9];
                case 8:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    // 광고 시청 완료 핸들러
    var handleAdComplete = function () {
        setAdWatched();
        setAdCompleted(true);
        setShowAdModal(false);
        setSearchLimitReached(false);
        // 광고 시청 후 검색 실행
        handleSearch({ preventDefault: function () { } });
    };
    return (<>
      {/* 구조화된 데이터 추가 */}
      <JsonLd data={createAppJsonLd()}/>
      <JsonLd data={createFaqJsonLd([
            {
                question: 'KeywordPulse는 어떤 서비스인가요?',
                answer: 'KeywordPulse는 마케터와 콘텐츠 제작자를 위한 실시간 키워드 분석 및 추천 플랫폼입니다. RAG 기반의 자연어 분석으로 키워드 인사이트를 제공합니다.'
            },
            {
                question: '키워드 분석 결과를 어떻게 저장할 수 있나요?',
                answer: 'Google Sheets와 연동하여 분석 결과를 자동으로 저장하거나, Telegram으로 전송하여 공유할 수 있습니다.'
            },
            {
                question: '무료로 사용할 수 있나요?',
                answer: '네, KeywordPulse는 현재 무료로 제공되고 있습니다. 회원가입 후 모든 기능을 이용하실 수 있습니다.'
            }
        ])}/>

      <div className="flex flex-col gap-8">
        {/* 헤더 섹션 */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">KeywordPulse</h1>
          <p className="text-gray-600 text-xl mb-8">
            키워드 검색부터 분석, 저장, 알림까지 한번에
          </p>
        </section>
        
        {/* 검색 폼 */}
        <section className="max-w-2xl mx-auto w-full">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <input type="text" value={keyword} onChange={function (e) { return setKeyword(e.target.value); }} placeholder="예: AI 마케팅" className="input flex-grow py-3" disabled={isLoading || showAdModal}/>
            <button type="submit" className="btn btn-primary py-2 px-4 text-center whitespace-nowrap min-w-[120px]" disabled={isLoading || showAdModal || (!user && searchLimitReached)}>
              {isLoading ? '검색 중...' : '키워드 분석'}
            </button>
          </form>
          
          {/* 검색 제한 경고 */}
          {searchLimitReached && !user && (<div className="mt-3 text-center">
              <p className="text-amber-600 text-sm">
                무료 검색 횟수를 모두 사용했습니다. 
                <Link href="/login" className="font-medium ml-1 underline">
                  회원가입하여 더 많은 검색을 이용하세요.
                </Link>
              </p>
            </div>)}
          
          {/* 로그인 유도 메시지 */}
          {!user && searchResults.length > 0 && (<div className="mt-3 bg-blue-50 p-3 rounded-md">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">지금 회원가입하면 추가 검색 및 더 많은 기능을 이용할 수 있습니다!</span> 
                <Link href="/login" className="font-bold ml-1 underline">
                  가입하기 &rarr;
                </Link>
              </p>
            </div>)}
        </section>
        
        {/* 검색 결과 섹션 */}
        {isLoading && (<div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>키워드를 분석 중입니다...</p>
          </div>)}
        
        {searchResults.length > 0 && (<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 키워드 테이블 */}
            <div className="lg:col-span-2">
              <KeywordTable keywords={searchResults} trendingKeywords={TRENDING_KEYWORDS_DATA}/>
            </div>
            
            {/* 분석 및 액션 카드 */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <AnalysisCard analysisText={analysisText}/>
              
              {analysisText && (<ActionButtons keywords={searchResults} analysisText={analysisText} timestamp={searchTime}/>)}
            </div>
          </section>)}
        
        {/* 인기 키워드 섹션 */}
        {!searchResults.length && !isLoading && (<>
            <section className="text-center py-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">실시간 인기 검색어</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING_KEYWORDS.map(function (item, index) { return (<button key={item.keyword} onClick={function () { return setKeyword(item.keyword); }} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">
                    <span className="font-bold text-primary-600 mr-1">{index + 1}</span>
                    <span className="text-gray-700">{item.keyword}</span>
                    <span className="ml-1 text-xs text-gray-500">({item.count})</span>
                  </button>); })}
              </div>
            </section>
            
            {/* 키워드 테이블 (메인 페이지에 직접 표시) */}
            <section className="mx-auto max-w-4xl w-full">
              <KeywordTable keywords={[]} trendingKeywords={TRENDING_KEYWORDS_DATA}/>
            </section>
            
            {/* 광고 배너 */}
            <AdBanner className="my-8"/>
            
            {/* 프리미엄 기능 섹션 */}
            <PremiumFeatures />
          </>)}
      </div>
      
      {/* 광고 모달 */}
      {showAdModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">무료 검색 이용권 받기</h3>
            <p className="mb-4">
              무료 검색 횟수를 모두 사용했습니다. 광고를 시청하고 추가 검색을 이용하세요.
            </p>
            
            <div className="bg-gray-100 border border-gray-200 h-48 flex items-center justify-center mb-4">
              <p className="text-gray-500 text-center">
                {adCompleted ?
                '광고 시청 완료! 이제 검색을 계속할 수 있습니다.' :
                '여기에 광고가 표시됩니다. (개발 모드에서는 즉시 완료)'}
              </p>
            </div>
            
            <div className="flex justify-between">
              <button className="btn btn-outline" onClick={function () { return setShowAdModal(false); }}>
                닫기
              </button>
              <button className="btn btn-primary" onClick={handleAdComplete} disabled={adCompleted}>
                {adCompleted ? '완료됨' : '광고 시청 완료'}
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <Link href="/login" className="text-primary-600 underline">
                회원가입
              </Link>
              하면 더 많은 검색과 프리미엄 기능을 이용할 수 있습니다.
            </div>
          </div>
        </div>)}
    </>);
}
