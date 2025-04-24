'use client';

import React, { useState } from 'react';
import useKeywordScoreBadge from '../hooks/useKeywordScoreBadge';

interface KeywordInfo {
  keyword: string;
  monthlySearches: number;
  competitionRate: number;
  score: number;
  recommendation: string;
}

interface TrendingKeyword {
  keyword: string;
  monthlySearches: number;
  competitionRate: number;
  score: number;
  recommendation: string;
}

interface KeywordTableProps {
  keywords: KeywordInfo[];
  trendingKeywords?: TrendingKeyword[]; // 실시간 인기 키워드 배열 (선택적)
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords, trendingKeywords = [] }) => {
  const [sortField, setSortField] = useState<keyof KeywordInfo>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'analysis' | 'trending'>('analysis');
  const { getRecommendationBadge } = useKeywordScoreBadge();

  // 정렬 핸들러
  const handleSort = (field: keyof KeywordInfo) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 정렬된 키워드 목록
  const sortedKeywords = [...keywords].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // 숫자 또는 다른 타입인 경우
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  // 정렬된 인기 키워드 목록
  const sortedTrendingKeywords = [...trendingKeywords].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  // 정렬 방향 아이콘
  const getSortIcon = (field: keyof KeywordInfo) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // 현재 활성화된 탭에 따라 테이블 데이터 선택
  const currentKeywords = activeTab === 'analysis' ? sortedKeywords : sortedTrendingKeywords;

  return (
    <div className="card overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">키워드 분석</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'analysis' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            키워드 분석 결과
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'trending' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            실시간 인기 키워드
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {activeTab === 'analysis' ? '키워드 분석 결과' : '실시간 인기 키워드'}
      </h3>
      
      {activeTab === 'trending' && trendingKeywords.length === 0 ? (
        <div className="py-8 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">현재 실시간 인기 키워드 데이터가 없습니다.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('keyword')}
              >
                키워드{getSortIcon('keyword')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('monthlySearches')}
              >
                월간 검색량{getSortIcon('monthlySearches')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('competitionRate')}
              >
                경쟁률{getSortIcon('competitionRate')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
              >
                점수{getSortIcon('score')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                추천도
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentKeywords.length > 0 ? (
              currentKeywords.map((keyword, index) => (
                <tr 
                  key={index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{keyword.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{keyword.monthlySearches.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{keyword.competitionRate.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{keyword.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRecommendationBadge(keyword.score)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {activeTab === 'analysis' ? '키워드 분석 결과가 없습니다.' : '실시간 인기 키워드 데이터가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KeywordTable; 