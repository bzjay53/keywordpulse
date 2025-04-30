'use client';
import React, { useState } from 'react';
import useKeywordScoreBadge from '../hooks/useKeywordScoreBadge';
import useKeywordSorting from '../hooks/useKeywordSorting';
var KeywordTable = function (_a) {
    var keywords = _a.keywords, _b = _a.trendingKeywords, trendingKeywords = _b === void 0 ? [] : _b;
    var _c = useState('analysis'), activeTab = _c[0], setActiveTab = _c[1];
    var getRecommendationBadge = useKeywordScoreBadge().getRecommendationBadge;
    // 정렬 관련 로직을 훅으로 분리
    var _d = useKeywordSorting(keywords, 'score'), sortField = _d.sortField, sortDirection = _d.sortDirection, handleSort = _d.handleSort, getSortIcon = _d.getSortIcon, sortedKeywords = _d.sortedItems;
    // 인기 키워드에 동일한 정렬 로직 적용
    var sortedTrendingKeywords = useKeywordSorting(trendingKeywords, sortField, sortDirection).sortedItems;
    // 현재 활성화된 탭에 따라 테이블 데이터 선택
    var currentKeywords = activeTab === 'analysis' ? sortedKeywords : sortedTrendingKeywords;
    return (<div className="card overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">키워드 분석</h2>
        <div className="flex space-x-2">
          <button className={"px-6 py-2 text-sm font-medium rounded-md min-w-[160px] text-center ".concat(activeTab === 'analysis'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300')} onClick={function () { return setActiveTab('analysis'); }}>
            키워드 분석 결과
          </button>
          <button className={"px-6 py-2 text-sm font-medium rounded-md min-w-[160px] text-center ".concat(activeTab === 'trending'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300')} onClick={function () { return setActiveTab('trending'); }}>
            실시간 인기 키워드
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">
        {activeTab === 'analysis' ? '키워드 분석 결과' : '실시간 인기 키워드'}
      </h3>
      
      {activeTab === 'trending' && trendingKeywords.length === 0 ? (<div className="py-8 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">현재 실시간 인기 키워드 데이터가 없습니다.</p>
        </div>) : (<table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={function () { return handleSort('keyword'); }}>
                키워드{getSortIcon('keyword')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={function () { return handleSort('monthlySearches'); }}>
                월간 검색량{getSortIcon('monthlySearches')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={function () { return handleSort('competitionRate'); }}>
                경쟁률{getSortIcon('competitionRate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={function () { return handleSort('score'); }}>
                점수{getSortIcon('score')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                추천도
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentKeywords.length > 0 ? (currentKeywords.map(function (keyword, index) { return (<tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{keyword.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{keyword.monthlySearches.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{keyword.competitionRate.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{keyword.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRecommendationBadge(keyword.score)}
                  </td>
                </tr>); })) : (<tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {activeTab === 'analysis' ? '키워드 분석 결과가 없습니다.' : '실시간 인기 키워드 데이터가 없습니다.'}
                </td>
              </tr>)}
          </tbody>
        </table>)}
    </div>);
};
export default KeywordTable;
