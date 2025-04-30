import React from 'react';
import { Inter } from 'next/font/google';
import './app/globals.css';
import AuthProvider from './AuthProvider';
var inter = Inter({ subsets: ['latin'] });
export var metadata = {
    title: 'KeywordPulse - 키워드 분석 및 모니터링 서비스',
    description: '키워드 분석 및 모니터링을 통해 마케팅 전략을 최적화하세요.',
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="ko" className={inter.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>);
}
