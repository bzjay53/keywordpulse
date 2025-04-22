import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import Header from '@/components/Header';
import { defaultMetadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <p className="text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} KeywordPulse. All rights reserved.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
} 