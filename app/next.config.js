/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 외부 API로의 프록시 설정 (필요시)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*', // API 요청을 Server Functions로 전달
      },
    ];
  },
  // 환경변수 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  poweredByHeader: false,
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    optimizeCss: true,
  },
  // 빌드 중에 상태 파일 생성을 제한하여 스택 오버플로우 방지
  webpack: (config, { isServer }) => {
    // 불필요한 미니파이 비활성화로 빌드 리소스 절약
    config.optimization.minimize = false;
    
    return config;
  },
};

module.exports = nextConfig; 