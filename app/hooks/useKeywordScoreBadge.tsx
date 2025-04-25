import React from 'react';

/**
 * 키워드 점수에 따른 추천도 뱃지를 반환하는 커스텀 훅
 * 리팩토링: 색상 세분화, aria 속성 추가, 배지 등급 세분화
 * @param score 키워드 점수 (0-100)
 * @returns JSX 뱃지 엘리먼트
 */
const useKeywordScoreBadge = () => {
  // 점수에 따른 추천도 뱃지 생성 함수
  const getRecommendationBadge = (score: number) => {
    if (score >= 85) {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          aria-label={`강력 추천 - 점수: ${score}`}
        >
          🟢 강력 추천
        </span>
      );
    } else if (score >= 70) {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
          aria-label={`추천 - 점수: ${score}`}
        >
          🟡 추천
        </span>
      );
    } else if (score >= 50) {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          aria-label={`고려 - 점수: ${score}`}
        >
          🔵 고려
        </span>
      );
    } else {
      return (
        <span 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          aria-label={`낮은 우선순위 - 점수: ${score}`}
        >
          ⚪ 낮은 우선순위
        </span>
      );
    }
  };

  return { getRecommendationBadge };
};

export default useKeywordScoreBadge; 