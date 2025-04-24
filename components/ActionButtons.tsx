'use client';

import React, { useState } from 'react';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  // Google Sheets에 저장
  const handleSaveToSheets = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords,
          timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`저장 API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.spreadsheetUrl) {
        setSheetUrl(data.spreadsheetUrl);
        alert('Google Sheets에 키워드가 저장되었습니다.');
      } else {
        throw new Error('스프레드시트 URL을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('Google Sheets 저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생했습니다. 환경변수를 확인해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // Telegram으로 전송
  const handleSendToTelegram = async () => {
    if (isSending) return;
    
    setIsSending(true);
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
        alert('분석 결과가 Telegram으로 전송되었습니다.');
      } else {
        throw new Error('Telegram 메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Telegram 전송 중 오류 발생:', error);
      alert('전송 중 오류가 발생했습니다. 환경변수를 확인해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card bg-gray-50">
      <h3 className="text-lg font-medium mb-4">결과 공유하기</h3>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSaveToSheets}
          disabled={isSaving}
          className="btn btn-primary flex items-center justify-center whitespace-nowrap"
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              저장 중...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              구글 시트에 저장
            </span>
          )}
        </button>
        
        {sheetUrl && (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 text-sm hover:underline text-center"
          >
            스프레드시트 열기 ↗
          </a>
        )}
        
        <button
          onClick={handleSendToTelegram}
          disabled={isSending}
          className="btn btn-outline flex items-center justify-center whitespace-nowrap"
        >
          {isSending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              전송 중...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              텔레그램으로 전송
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons; 