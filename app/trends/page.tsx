import React from 'react';
import TrendDashboard from './TrendDashboard';

export const metadata = {
  title: '키워드 트렌드 대시보드 | KeywordPulse',
  description: '실시간 키워드 트렌드와 인기 키워드를 분석하고 시각화하는 대시보드입니다.',
};

/**
 * 트렌드 대시보드 페이지
 * 트렌드 API의 데이터를 사용하여 인기 키워드와 관련 트렌드를 시각화합니다.
 */
export default function TrendsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">키워드 트렌드 대시보드</h1>
      <p className="text-gray-600 mb-8">
        실시간 인기 키워드와 트렌드를 분석하고 시각화하여 콘텐츠 전략 수립에 도움을 줍니다.
      </p>

      <TrendDashboard />
    </main>
  );
} 