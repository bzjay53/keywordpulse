'use client';

import React, { useState, useMemo, useEffect } from 'react';

/**
 * 키워드 아이템 타입 정의
 */
interface KeywordItem {
  text: string;
  value: number;
}

/**
 * 컴포넌트 Props 타입 정의
 */
interface KeywordCloudProps {
  keywords: string[] | KeywordItem[];
  mainKeyword?: string;
  className?: string;
  maxKeywords?: number;
  onKeywordClick?: (keyword: string) => void;
  colorScale?: string[];
  isLoading?: boolean;
  animate?: boolean;
}

/**
 * 관련 키워드 클라우드 컴포넌트
 * 관련 키워드들을 시각적으로 표현하며, 클릭 시 해당 키워드 분석으로 이동할 수 있습니다.
 */
const KeywordCloud: React.FC<KeywordCloudProps> = ({
  keywords,
  mainKeyword,
  className = '',
  maxKeywords = 20,
  onKeywordClick,
  colorScale = ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2'],
  isLoading = false,
  animate = true,
}) => {
  // 애니메이션 상태
  const [visibleItems, setVisibleItems] = useState<number>(0);

  // 키워드 배열 정규화
  const normalizedKeywords = useMemo(() => {
    if (isLoading || !keywords || keywords.length === 0) return [];

    // 문자열 배열인 경우 KeywordItem 객체로 변환
    if (typeof keywords[0] === 'string') {
      return (keywords as string[])
        .map((keyword, index) => ({
          text: keyword,
          value: Math.max(100 - index * 5, 30), // 인덱스가 높을수록 값이 낮아짐
        }))
        .slice(0, maxKeywords);
    }

    // 이미 KeywordItem 객체인 경우
    return (keywords as KeywordItem[]).slice(0, maxKeywords);
  }, [keywords, maxKeywords, isLoading]);

  // 애니메이션 실행 (키워드 하나씩 나타나기)
  useEffect(() => {
    if (!animate || isLoading) {
      setVisibleItems(normalizedKeywords.length);
      return;
    }

    if (normalizedKeywords.length > 0) {
      setVisibleItems(0);
      const interval = setInterval(() => {
        setVisibleItems(prev => {
          if (prev >= normalizedKeywords.length) {
            clearInterval(interval);
            return normalizedKeywords.length;
          }
          return prev + 1;
        });
      }, 100); // 100ms 간격으로 키워드 추가

      return () => clearInterval(interval);
    }
  }, [normalizedKeywords, animate, isLoading]);

  // 값 범위 계산
  const { minValue, maxValue } = useMemo(() => {
    if (normalizedKeywords.length === 0) {
      return { minValue: 0, maxValue: 0 };
    }
    
    const values = normalizedKeywords.map(item => item.value);
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [normalizedKeywords]);

  // 값에 따른 폰트 크기 계산
  const getFontSize = (value: number) => {
    if (minValue === maxValue) return 18;
    const range = maxValue - minValue;
    const normalized = (value - minValue) / range;
    return 14 + (normalized * 18); // 14px ~ 32px
  };

  // 값에 따른 색상 계산
  const getColor = (value: number) => {
    if (minValue === maxValue) return colorScale[colorScale.length - 1];
    const range = maxValue - minValue;
    const normalized = (value - minValue) / range;
    const colorIndex = Math.min(
      Math.floor(normalized * colorScale.length),
      colorScale.length - 1
    );
    return colorScale[colorIndex];
  };

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword: string) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <div
        className={`p-6 bg-gray-50 rounded-lg ${className}`}
        aria-label="관련 키워드 로딩 중"
      >
        <div className="animate-pulse space-y-4">
          {mainKeyword && (
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(10)].map((_, i) => (
              <div 
                key={`skeleton-${i}`}
                className="h-8 bg-gray-200 rounded-full"
                style={{ 
                  width: `${Math.max(40, Math.min(120, 40 + Math.random() * 80))}px`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우 대체 UI
  if (!normalizedKeywords || normalizedKeywords.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg p-6 ${className}`}
        aria-label="관련 키워드가 없습니다"
      >
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 mx-auto text-gray-400 mb-2"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-gray-500">관련 키워드 데이터가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">다른 키워드를 선택해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`keyword-cloud p-4 rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      aria-label={`${mainKeyword ? `'${mainKeyword}'의 ` : ''}관련 키워드 클라우드`}
    >
      {mainKeyword && (
        <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          &quot;{mainKeyword}&quot; 관련 키워드
        </h3>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 py-3 min-h-[120px]">
        {normalizedKeywords.slice(0, visibleItems).map((item, index) => (
          <button
            key={`${item.text}-${index}`}
            onClick={() => handleKeywordClick(item.text)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full px-3 py-1 shadow-sm"
            style={{
              fontSize: `${getFontSize(item.value)}px`,
              backgroundColor: getColor(item.value),
              color: item.value > (minValue + maxValue) / 2 ? '#fff' : '#333',
              opacity: 0,
              animation: animate ? `fadeIn 0.5s ease forwards ${index * 0.05}s` : 'none',
            }}
            aria-label={`키워드: ${item.text}, 관련도: ${item.value}`}
          >
            {item.text}
          </button>
        ))}
      </div>
      
      {normalizedKeywords.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 text-right flex justify-between items-center">
          <span className="text-gray-400 text-xs italic">
            클릭하여 키워드 분석
          </span>
          <span>
            총 {normalizedKeywords.length}개 키워드
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default KeywordCloud; 