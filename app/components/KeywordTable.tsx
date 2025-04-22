'use client';

import React, { useState } from 'react';

interface KeywordInfo {
  keyword: string;
  monthlySearches: number;
  competitionRate: number;
  score: number;
  recommendation: string;
}

interface KeywordTableProps {
  keywords: KeywordInfo[];
}

const KeywordTable: React.FC<KeywordTableProps> = ({ keywords }) => {
  const [sortField, setSortField] = useState<keyof KeywordInfo>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  // 점수에 따른 추천도 뱃지 스타일
  const getRecommendationBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          🟢 강력 추천
        </span>
      );
    } else if (score >= 50) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          🟡 추천
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          ⚪ 낮은 우선순위
        </span>
      );
    }
  };

  // 정렬 방향 아이콘
  const getSortIcon = (field: keyof KeywordInfo) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">키워드 분석 결과</h2>
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
          {sortedKeywords.map((keyword, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordTable; 