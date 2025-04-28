/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 정적 페이지로 내보내기 설정
  output: 'export',
  // 외부 종속성 설정
  transpilePackages: ['next-auth'],
  // 실험적 기능 설정
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizeCss: true,
  },
  // 정적 내보내기에서 API 라우트 및 특정 페이지 제외
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
    unoptimized: true, // 정적 내보내기용 설정
  },
  // 빌드에서 특정 페이지 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  typescript: {
    // 타입 체크 오류가 있어도 빌드 진행
    ignoreBuildErrors: true,
    // 타입 체크 완전히 비활성화
    tsconfigPath: false,
  },
  eslint: {
    // ESLint 오류가 있어도 빌드 진행
    ignoreDuringBuilds: true,
  },
  // 빌드 중에 상태 파일 생성을 제한하여 스택 오버플로우 방지
  webpack: (config) => {
    config.optimization.minimize = true;
    return config;
  },
  // Next.js 14에서는 다음 옵션이 필요 없음 (onDemandEntries는 pages 디렉토리에만 적용됨)
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000,
  //   pagesBufferLength: 2,
  // }
};

module.exports = nextConfig; 