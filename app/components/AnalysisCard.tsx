'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AnalysisCardProps {
  analysisText: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysisText }) => {
  // 복사 버튼 핸들러
  const handleCopy = () => {
    navigator.clipboard.writeText(analysisText)
      .then(() => {
        alert('분석 텍스트가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('텍스트 복사 실패:', err);
      });
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
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          복사
        </button>
      </div>
      
      <div className="prose prose-sm max-w-none overflow-y-auto max-h-[350px] text-gray-800">
        <ReactMarkdown>{analysisText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AnalysisCard; 