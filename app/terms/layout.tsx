import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 이용약관 | KeywordPulse',
  description: 'KeywordPulse의 서비스 이용약관에 대한 안내입니다.'
};

export default function TermsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="terms-layout">
      {children}
    </div>
  );
} 