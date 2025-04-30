'use client';

import React from 'react';
import useClipboard from './hooks/useClipboard';
import AnalysisRenderer from './AnalysisRenderer';

interface AnalysisCardProps {
  analysisText: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysisText }) => {
  const { isCopied, copyToClipboard } = useClipboard();
  
  // 복사 버튼 핸들러
  const handleCopy = async () => {
    const success = await copyToClipboard(analysisText);
    if (success) {
      // React Toastify 등 알림 라이브러리가 있다면 사용하는 것이 좋습니다
      // 현재는 간단한 alert로 대체
      alert('분석 텍스트가 클립보드에 복사되었습니다.');
    }
  };

  if (!analysisText) {
    return (
      <div className="card bg-gray-50 min-h-[200px] flex items-center justify-center text-gray-500">
        <p>키워드 분석 후 인사이트가 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">분석 인사이트</h2>
        <button 
          onClick={handleCopy}
          className="text-sm text-gray-500 hover:text-primary-600 flex items-center"
          disabled={isCopied}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {isCopied ? '복사됨' : '복사'}
        </button>
      </div>
      
      <AnalysisRenderer analysisText={analysisText} maxHeight="350px" />
    </div>
  );
};

export default AnalysisCard; 