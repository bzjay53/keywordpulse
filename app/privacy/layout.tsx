import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | KeywordPulse',
  description: 'KeywordPulse의 개인정보 처리방침에 대한 안내입니다.'
};

export default function PrivacyLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="privacy-layout">
      {children}
    </div>
  );
} 