'use client';
import React from 'react';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import './globals.css';
import AuthProvider from './AuthProvider';
import { ToastProvider } from '../components/ui/toast';
// 폰트 설정
var inter = Inter({ subsets: ['latin'] });
export default function Layout(_a) {
    var children = _a.children;
    return (<html lang="ko" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <footer className="bg-white shadow-inner py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} KeywordPulse. All rights reserved.
                </div>
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>);
}
