'use client';

import React, { useState, useEffect } from 'react';

interface KeywordInfo {
  keyword: string;
  monthlySearches: number;
  competitionRate: number;
  score: number;
  recommendation: string;
}

interface ActionButtonsProps {
  keywords: KeywordInfo[];
  analysisText: string;
  timestamp: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ keywords, analysisText, timestamp }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'none' | 'sending' | 'success' | 'error'>('none');

  // 컴포넌트 마운트 시 자동으로 데이터 저장 및 전송
  useEffect(() => {
    if (analysisText && keywords.length > 0) {
      // 구글 시트에 자동 저장 (백그라운드)
      saveToSheetsBackground();
      
      // 텔레그램으로 자동 전송
      handleSendToTelegram();
    }
  }, [analysisText, keywords]); // 분석 텍스트나 키워드가 변경될 때만 실행

  // 백그라운드에서 구글 시트에 저장
  const saveToSheetsBackground = async () => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          timestamp
        })
      });

      console.log('키워드 데이터가 백그라운드에서 저장되었습니다.');
    } catch (error) {
      console.error('백그라운드 저장 중 오류 발생:', error);
    }
  };

  // Telegram으로 전송
  const handleSendToTelegram = async () => {
    if (isSending || !analysisText) return;
    
    setIsSending(true);
    setSendStatus('sending');
    
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisText
        })
      });

      if (!response.ok) {
        throw new Error(`전송 API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSendStatus('success');
        console.log('분석 결과가 텔레그램으로 전송되었습니다.');
      } else {
        throw new Error('Telegram 메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Telegram 전송 중 오류 발생:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card bg-gray-50">
      <h3 className="text-lg font-medium mb-4">분석 결과 공유</h3>
      
      <div className="flex flex-col space-y-3">
        {sendStatus === 'none' ? (
          <p className="text-gray-500 text-sm">분석 결과가 자동으로 저장 및 공유됩니다.</p>
        ) : sendStatus === 'sending' ? (
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            텔레그램으로 전송 중...
          </div>
        ) : sendStatus === 'success' ? (
          <div className="flex items-center text-green-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
            텔레그램으로 전송 완료
          </div>
        ) : (
          <div className="flex items-center text-red-600 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            텔레그램 전송 실패 - 다시 시도해주세요
            <button 
              onClick={handleSendToTelegram}
              className="ml-2 text-blue-500 hover:text-blue-700 underline"
            >
              재시도
            </button>
          </div>
        )}
        
        <p className="text-xs text-gray-400 mt-2">
          분석 결과는 자동으로 저장되며 텔레그램으로 전송됩니다.
        </p>
      </div>
    </div>
  );
};

export default ActionButtons; 