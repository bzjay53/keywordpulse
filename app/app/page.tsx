'use client';

import { useState } from 'react';
import Image from 'next/image';
import KeywordTable from '@/components/KeywordTable';
import AnalysisCard from '@/components/AnalysisCard';
import ActionButtons from '@/components/ActionButtons';
import JsonLd, { createAppJsonLd, createFaqJsonLd } from '@/components/JsonLd';

// 메타데이터는 클라이언트 컴포넌트에서 직접 export할 수 없으므로 제거
// metadata.ts 파일에서 별도로 관리됩니다

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [analysisText, setAnalysisText] = useState('');
  const [searchTime, setSearchTime] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    setSearchResults([]);
    setAnalysisText('');
    
    try {
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
    } catch (error) {
      console.error('검색 및 분석 중 오류 발생:', error);
      // 에러 처리: 실제 구현에서는 Toast/Alert 컴포넌트 사용
      alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary py-3 min-w-20"
              disabled={isLoading}
            >
              {isLoading ? '검색 중...' : '키워드 분석'}
            </button>
          </form>
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
              <KeywordTable keywords={searchResults} />
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
        
        {/* 인기 키워드 예시 (선택 사항) */}
        {!searchResults.length && !isLoading && (
          <section className="text-center py-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">인기 검색 키워드</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {['AI 마케팅', '콘텐츠 전략', 'SNS 광고', '이커머스 트렌드', '디지털 마케팅'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => setKeyword(kw)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                >
                  {kw}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
} 