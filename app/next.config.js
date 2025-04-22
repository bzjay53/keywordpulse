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
  }
};

module.exports = nextConfig; 