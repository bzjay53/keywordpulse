'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TrendChart from '../components/TrendChart';
import KeywordCloud from '../components/KeywordCloud';
import { getTrendingKeywords, getRelatedKeywords, getKeywordTrend } from '../lib/trends_api';
import logger from '../lib/logger';

// 카테고리 타입 정의
type TrendCategory = 'all' | 'business' | 'technology' | 'entertainment' | 'health';

// 트렌드 데이터 타입 정의
interface TrendData {
  date: string;
  value: number;
}

/**
 * 트렌드 대시보드 컴포넌트
 * 트렌드 API의 데이터를 로드하고 시각화하는 대시보드 컴포넌트
 */
export default function TrendDashboard() {
  // 상태 관리
  const [category, setCategory] = useState<TrendCategory>('all');
  const [trendingKeywords, setTrendingKeywords] = useState<{ keyword: string; count: number; change?: number }[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState({
    trending: true,
    related: false,
    trend: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');

  // 카테고리 옵션
  const categoryOptions = useMemo(() => [
    { value: 'all', label: '전체', color: 'blue' },
    { value: 'business', label: '비즈니스', color: 'green' },
    { value: 'technology', label: '기술', color: 'purple' },
    { value: 'entertainment', label: '엔터테인먼트', color: 'orange' },
    { value: 'health', label: '건강', color: 'green' },
  ], []);

  // 초기 트렌딩 키워드 로드
  useEffect(() => {
    async function loadTrendingKeywords() {
      try {
        setIsLoading(prev => ({ ...prev, trending: true }));
        setError(null);
        
        const data = await getTrendingKeywords(category);
        setTrendingKeywords(data);
        
        // 첫 번째 키워드 선택
        if (data.length > 0 && !selectedKeyword) {
          setSelectedKeyword(data[0].keyword);
        }

        // 카테고리에 따른 색상 설정
        const categoryOption = categoryOptions.find(opt => opt.value === category);
        if (categoryOption && categoryOption.color) {
          setColorScheme(categoryOption.color as 'blue' | 'green' | 'purple' | 'orange');
        }
      } catch (err) {
        logger.error({
          message: '트렌딩 키워드 로드 오류',
          error: err as Error,
          tags: { module: 'TrendDashboard', action: 'loadTrendingKeywords' }
        });
        setError('트렌딩 키워드를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(prev => ({ ...prev, trending: false }));
      }
    }

    loadTrendingKeywords();
  }, [category, categoryOptions]);

  // 키워드 선택 시 관련 키워드 및 트렌드 데이터 로드
  useEffect(() => {
    if (!selectedKeyword) return;

    async function loadKeywordData() {
      try {
        // 로딩 상태 설정
        setIsLoading(prev => ({ ...prev, related: true, trend: true }));
        setError(null);
        
        // 관련 키워드 로드
        const relatedData = await getRelatedKeywords(selectedKeyword);
        setRelatedKeywords(relatedData);
        
        // 트렌드 데이터 로드
        const trendData = await getKeywordTrend(selectedKeyword);
        setTrendData(trendData);
      } catch (err) {
        logger.error({
          message: '키워드 데이터 로드 오류',
          error: err as Error,
          context: { keyword: selectedKeyword },
          tags: { module: 'TrendDashboard', action: 'loadKeywordData' }
        });
        setError('키워드 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(prev => ({ ...prev, related: false, trend: false }));
      }
    }

    loadKeywordData();
  }, [selectedKeyword]);

  // 키워드 선택 핸들러
  const handleKeywordSelect = useCallback((keyword: string) => {
    setSelectedKeyword(keyword);
  }, []);

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as TrendCategory);
  }, []);

  // 높은 변화율을 가진 키워드 필터링
  const trendingKeywordsWithHighChange = useMemo(() => {
    return trendingKeywords.filter(k => k.change !== undefined && k.change > 20);
  }, [trendingKeywords]);

  return (
    <div className="trend-dashboard">
      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">오류</p>
          <p>{error}</p>
        </div>
      )}

      {/* 카테고리 선택 */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="category" className="font-medium text-gray-700">
            카테고리 선택
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading.trending}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <div className="ml-auto text-sm text-gray-500">
            {!isLoading.trending && `${trendingKeywords.length}개 키워드 로드됨`}
          </div>
        </div>
      </div>

      {/* 트렌딩 키워드 목록 및 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 트렌딩 키워드 목록 */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">인기 키워드</h2>
          
          {isLoading.trending ? (
            <div className="animate-pulse">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded my-2"></div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {trendingKeywords.map(item => (
                <li key={item.keyword} className="py-2">
                  <button
                    onClick={() => handleKeywordSelect(item.keyword)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedKeyword === item.keyword 
                        ? `bg-${colorScheme}-100 text-${colorScheme}-800` 
                        : 'hover:bg-gray-50'
                    }`}
                    aria-current={selectedKeyword === item.keyword ? 'true' : 'false'}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.keyword}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">{item.count}</span>
                        {item.change !== undefined && (
                          <span className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading.trending && trendingKeywords.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              <p>인기 키워드가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 선택된 키워드 트렌드 차트 */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
            {selectedKeyword ? `"${selectedKeyword}" 트렌드` : '키워드 트렌드'}
          </h2>
          
          <TrendChart
            keyword={selectedKeyword}
            trendData={trendData}
            height={320}
            className="mt-4"
            isLoading={isLoading.trend}
            colorScheme={colorScheme}
          />
        </div>
      </div>

      {/* 관련 키워드 클라우드 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
          {selectedKeyword ? `"${selectedKeyword}" 관련 키워드` : '관련 키워드'}
        </h2>
        
        <KeywordCloud
          keywords={relatedKeywords}
          mainKeyword={selectedKeyword}
          className="mt-4"
          onKeywordClick={handleKeywordSelect}
          isLoading={isLoading.related}
          animate={true}
        />
      </div>

      {/* 카테고리별 인사이트 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">카테고리별 인사이트</h2>
        
        {isLoading.trending ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              선택한 카테고리({categoryOptions.find(option => option.value === category)?.label})의 인기 키워드 및 트렌드 분석을 통해 다음과 같은 인사이트를 도출할 수 있습니다:
            </p>
            
            <div className={`bg-${colorScheme}-50 p-5 rounded-lg`}>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                {trendingKeywords.length > 0 && (
                  <li>
                    인기 키워드 상위 {Math.min(5, trendingKeywords.length)}개({trendingKeywords.slice(0, 5).map(k => `"${k.keyword}"`).join(', ')})는 최근 트렌드의 핵심 주제입니다.
                  </li>
                )}
                
                {trendingKeywordsWithHighChange.length > 0 ? (
                  <li>
                    급상승 키워드({trendingKeywordsWithHighChange.map(k => `"${k.keyword}"`).join(', ')})에 주목할 필요가 있습니다.
                  </li>
                ) : (
                  <li>현재 급상승 중인 주목할 만한 키워드가 없습니다.</li>
                )}
                
                {selectedKeyword && relatedKeywords.length > 0 && (
                  <li>
                    "{selectedKeyword}" 키워드는 {relatedKeywords.length}개의 관련 키워드와 연결되어 있어 콘텐츠 확장성이 있습니다.
                  </li>
                )}
                
                <li>
                  콘텐츠 전략 수립 시 인기 키워드와 관련 키워드를 포함한 콘텐츠를 우선적으로 고려하세요.
                </li>
                
                {selectedKeyword && trendData.length > 0 && (
                  <li>
                    "{selectedKeyword}" 키워드는 {
                      (() => {
                        const values = trendData.map(item => item.value);
                        const first = values[0];
                        const last = values[values.length - 1];
                        const diff = last - first;
                        const percentage = Math.round((diff / first) * 100);
                        
                        if (percentage > 10) return '상승세를 보이고 있어 적극적 활용이 권장됩니다';
                        if (percentage < -10) return '하락세를 보이고 있어 신중한 접근이 필요합니다';
                        return '안정적인 추세를 보이고 있습니다';
                      })()
                    }
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 