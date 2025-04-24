'use client';

import React, { useState } from 'react';
import useClipboard from '../hooks/useClipboard';
import AnalysisRenderer from './AnalysisRenderer';

interface AnalysisCardProps {
  analysisText: string;
  className?: string;
  onCopy?: () => void;
}

/**
 * 분석 결과를 표시하는 카드 컴포넌트
 * 리팩토링: 커스텀 클래스 지원, 복사 상태 시각화 개선, aria 속성 추가
 */
const AnalysisCard: React.FC<AnalysisCardProps> = ({ 
  analysisText, 
  className = '',
  onCopy
}) => {
  const { isCopied, copyToClipboard } = useClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 복사 버튼 핸들러
  const handleCopy = async () => {
    const success = await copyToClipboard(analysisText);
    if (success) {
      // 부모 컴포넌트에 복사 이벤트 알림 (선택적)
      if (onCopy) onCopy();
    }
  };
  
  // 접기/펼치기 토글
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!analysisText) {
    return (
      <div className={`card bg-gray-50 min-h-[200px] flex items-center justify-center text-gray-500 ${className}`}>
        <p>키워드 분석 후 인사이트가 이곳에 표시됩니다.</p>
      </div>
    );
  }

  // 분석 카드에 적용할 높이 계산
  const maxHeight = isExpanded ? 'none' : '350px';

  return (
    <div className={`card ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">분석 인사이트</h2>
        <div className="flex space-x-2">
          <button 
            onClick={toggleExpand}
            className="text-sm text-gray-500 hover:text-primary-600 flex items-center"
            aria-label={isExpanded ? '분석 내용 접기' : '분석 내용 펼치기'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            {isExpanded ? '접기' : '펼치기'}
          </button>
          <button 
            onClick={handleCopy}
            className="text-sm text-gray-500 hover:text-primary-600 flex items-center transition-colors duration-200"
            disabled={isCopied}
            aria-label="분석 내용 복사하기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {isCopied ? (
              <span className="text-green-600">복사됨</span>
            ) : (
              '복사'
            )}
          </button>
        </div>
      </div>
      
      <AnalysisRenderer 
        analysisText={analysisText} 
        maxHeight={maxHeight} 
        className={isExpanded ? 'pb-4' : ''}
      />
      
      {isCopied && (
        <div className="mt-2 text-xs text-green-600 flex items-center justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          클립보드에 복사되었습니다
        </div>
      )}
    </div>
  );
};

export default AnalysisCard; 