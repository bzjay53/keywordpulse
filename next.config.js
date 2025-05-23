/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 정적 페이지 내보내기 설정은 Vercel 배포에서는 필요하지 않음 (주석 처리)
  // output: 'export',
  // 외부 종속성 설정
  transpilePackages: ['next-auth'],
  // 실험적 기능 설정
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true,
  },
  // Vercel 빌드 디렉토리 설정
  distDir: '.next',
  trailingSlash: true,
  // 환경변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  poweredByHeader: false,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // 빌드에서 특정 페이지 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // 프로덕션 빌드에서 TypeScript 검사 비활성화
  typescript: {
    // 프로덕션 빌드에서 TypeScript 타입 체크 오류 무시
    ignoreBuildErrors: true,
    tsconfigPath: 'tsconfig.json'
  },
  eslint: {
    // ESLint 오류가 있어도 빌드 진행
    ignoreDuringBuilds: true
  },
  // 빌드 중에 상태 파일 생성을 제한하여 스택 오버플로우 방지
  webpack: (config, { isServer }) => {
    config.optimization.minimize = true;
    
    // 경로 별칭 설정 확장
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app/lib': path.resolve(__dirname, './app/lib'),
      '@/components': path.resolve(__dirname, './components'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/app': path.resolve(__dirname, './app'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/utils': path.resolve(__dirname, './utils'),
    };
    
    return config;
  },
  // 모든 빌드 예외 무시
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2
  },
};

module.exports = nextConfig; 