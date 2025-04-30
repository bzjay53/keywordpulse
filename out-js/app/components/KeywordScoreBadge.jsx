'use client';
import React from 'react';
import useKeywordScoreBadge from '../hooks/useKeywordScoreBadge';
/**
 * 키워드 점수에 따른 추천도 배지를 표시하는 컴포넌트
 */
var KeywordScoreBadge = function (_a) {
    var score = _a.score, _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.showScore, showScore = _c === void 0 ? false : _c;
    var getRecommendationBadge = useKeywordScoreBadge().getRecommendationBadge;
    // 크기별 스타일 설정
    var sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1'
    };
    // 기본 배지 얻기
    var badge = getRecommendationBadge(score);
    // 점수 표시가 필요한 경우 점수를 포함한 배지로 확장
    if (showScore) {
        // badge의 className과 aria-label 속성을 가져와서 확장
        var className = badge.props.className;
        var ariaLabel = badge.props['aria-label'];
        return (<span className={"".concat(className, " ").concat(sizeClasses[size])} aria-label={ariaLabel}>
        {badge.props.children} ({score})
      </span>);
    }
    // 크기만 조정된 기본 배지 반환
    return React.cloneElement(badge, {
        className: "".concat(badge.props.className, " ").concat(sizeClasses[size])
    });
};
export default KeywordScoreBadge;
