'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import KeywordTable from '@/components/KeywordTable';
import AnalysisCard from '@/components/AnalysisCard';
import ActionButtons from '@/components/ActionButtons';
import JsonLd, { createAppJsonLd, createFaqJsonLd } from '@/components/JsonLd';
import { useAuth } from '@/lib/AuthContext';
import { 
  trackSearchUsage, 
  incrementSearchCount, 
  hasWatchedAd, 
  setAdWatched 
} from '@/lib/supabaseClient';
import AdBanner from '@/components/AdBanner';
import PremiumFeatures from '@/components/PremiumFeatures';

// 인기 검색어 목록
const TRENDING_KEYWORDS = [
  { keyword: 'AI 마케팅', count: 342 },
  { keyword: '콘텐츠 전략', count: 267 },
  { keyword: 'SNS 광고', count: 201 },
  { keyword: '이커머스 트렌드', count: 189 },
  { keyword: '디지털 마케팅', count: 175 }
];

// 인기 키워드 데이터 (실시간 데이터 연동 전 임시 데이터)
const TRENDING_KEYWORDS_DATA = [
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
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [analysisText, setAnalysisText] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCompleted, setAdCompleted] = useState(false);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // 검색 제한 확인
  useEffect(() => {
    const canSearch = trackSearchUsage();
    setSearchLimitReached(!canSearch);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) return;
    
    // 검색 제한 확인
    const canSearch = trackSearchUsage();
    
    if (!canSearch) {
      // 광고를 이미 시청했는지 확인
      if (hasWatchedAd()) {
        alert('오늘의 검색 한도를 모두 사용했습니다. 내일 다시 시도하거나 회원가입 후 이용해주세요.');
        return;
      } else {
        // 광고 시청 모달 표시
        setShowAdModal(true);
        return;
      }
    }
    
    setIsLoading(true);
    setSearchResults([]);
    setAnalysisText('');
    
    try {
      // 검색 카운트 증가
      incrementSearchCount();
      
      // 1. 키워드 검색 API 호출
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim() })
      });
      
      if (!searchResponse.ok) {
        throw new Error(`검색 API 오류: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      setSearchResults(searchData.keywords);
      
      // 현재 시간 저장
      setSearchTime(new Date().toISOString());
      
      // 2. 분석 텍스트 생성 API 호출
      if (searchData.keywords && searchData.keywords.length > 0) {
        const keywordStrings = searchData.keywords.map((k: any) => k.keyword);
        
        const analyzeResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: keywordStrings })
        });
        
        if (!analyzeResponse.ok) {
          throw new Error(`분석 API 오류: ${analyzeResponse.status}`);
        }
        
        const analyzeData = await analyzeResponse.json();
        setAnalysisText(analyzeData.analysisText);
      }
      
      // 검색 후 검색 제한 갱신
      const canSearchAgain = trackSearchUsage();
      setSearchLimitReached(!canSearchAgain);
      
    } catch (error) {
      console.error('검색 및 분석 중 오류 발생:', error);
      alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 광고 시청 완료 핸들러
  const handleAdComplete = () => {
    setAdWatched();
    setAdCompleted(true);
    setShowAdModal(false);
    setSearchLimitReached(false);
    
    // 광고 시청 후 검색 실행
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <>
      {/* 구조화된 데이터 추가 */}
      <JsonLd data={createAppJsonLd()} />
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
      ])} />

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
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: AI 마케팅"
              className="input flex-grow py-3"
              disabled={isLoading || showAdModal}
            />
            <button
              type="submit"
              className="btn btn-primary py-2 px-4 text-center font-medium"
              disabled={isLoading || showAdModal || searchLimitReached}
            >
              {isLoading ? '검색 중...' : '키워드 분석'}
            </button>
          </form>
          
          {/* 검색 제한 경고 */}
          {searchLimitReached && !user && (
            <div className="mt-3 text-center">
              <p className="text-amber-600 text-sm">
                무료 검색 횟수를 모두 사용했습니다. 
                <Link href="/login" className="font-medium ml-1 underline">
                  회원가입하여 더 많은 검색을 이용하세요.
                </Link>
              </p>
            </div>
          )}
          
          {/* 로그인 유도 메시지 */}
          {!user && searchResults.length > 0 && (
            <div className="mt-3 bg-blue-50 p-3 rounded-md">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">지금 회원가입하면 추가 검색 및 더 많은 기능을 이용할 수 있습니다!</span> 
                <Link href="/login" className="font-bold ml-1 underline">
                  가입하기 &rarr;
                </Link>
              </p>
            </div>
          )}
        </section>
        
        {/* 검색 결과 섹션 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>키워드를 분석 중입니다...</p>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 키워드 테이블 */}
            <div className="lg:col-span-2">
              <KeywordTable 
                keywords={searchResults} 
                trendingKeywords={TRENDING_KEYWORDS_DATA}
              />
            </div>
            
            {/* 분석 및 액션 카드 */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <AnalysisCard analysisText={analysisText} />
              
              {analysisText && (
                <ActionButtons 
                  keywords={searchResults} 
                  analysisText={analysisText} 
                  timestamp={searchTime}
                />
              )}
            </div>
          </section>
        )}
        
        {/* 인기 키워드 섹션 */}
        {!searchResults.length && !isLoading && (
          <>
            <section className="text-center py-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">실시간 인기 검색어</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING_KEYWORDS.map((item, index) => (
                  <button
                    key={item.keyword}
                    onClick={() => setKeyword(item.keyword)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                  >
                    <span className="font-bold text-primary-600 mr-1">{index+1}</span>
                    <span className="text-gray-700">{item.keyword}</span>
                    <span className="ml-1 text-xs text-gray-500">({item.count})</span>
                  </button>
                ))}
              </div>
            </section>
            
            {/* 키워드 테이블 (메인 페이지에 직접 표시) */}
            <section className="mx-auto max-w-4xl w-full">
              <KeywordTable 
                keywords={[]} 
                trendingKeywords={TRENDING_KEYWORDS_DATA}
              />
            </section>
            
            {/* 광고 배너 */}
            <AdBanner className="my-8" />
            
            {/* 프리미엄 기능 섹션 */}
            <PremiumFeatures />
          </>
        )}
      </div>
      
      {/* 광고 모달 */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
              <button 
                className="btn btn-outline" 
                onClick={() => setShowAdModal(false)}
              >
                닫기
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAdComplete}
                disabled={adCompleted}
              >
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
        </div>
      )}
    </>
  );
} 