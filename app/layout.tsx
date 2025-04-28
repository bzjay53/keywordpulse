import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './app/globals.css';
import AuthProvider from './AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KeywordPulse - 키워드 분석 및 모니터링 서비스',
  description: '키워드 분석 및 모니터링을 통해 마케팅 전략을 최적화하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 