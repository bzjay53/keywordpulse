import { Metadata } from 'next';

// 기본 메타데이터
export const defaultMetadata: Metadata = {
  title: 'KeywordPulse - 실시간 키워드 분석 도구',
  description: '마케터와 콘텐츠 제작자를 위한 실시간 키워드 분석 및 추천 플랫폼',
  keywords: ['키워드 분석', '네이버 키워드', '마케팅 도구', 'Google Sheets', 'RAG 텍스트 분석'],
  authors: [{ name: 'KeywordPulse Team' }],
  robots: 'index, follow',
  metadataBase: new URL('https://keywordpulse.vercel.app'),
  openGraph: {
    title: 'KeywordPulse 키워드 분석',
    description: '최신 트렌드 기반 키워드 추천 및 자연어 분석 플랫폼',
    siteName: 'KeywordPulse',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KeywordPulse 오픈그래프 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeywordPulse 실시간 키워드 분석',
    description: 'RAG 기반 텍스트 분석과 네이버 키워드 트렌드를 한눈에.',
    images: ['/images/og-image.png'],
  },
};

// 앱 내 다른 페이지의 메타데이터 생성 함수
export function createMetadata({
  title,
  description,
  path,
  ogImagePath,
}: {
  title?: string;
  description?: string;
  path?: string; 
  ogImagePath?: string;
}): Metadata {
  const baseTitle = 'KeywordPulse';
  const finalTitle = title ? `${title} | ${baseTitle}` : defaultMetadata.title as string;
  const finalDesc = description || (defaultMetadata.description as string);
  const ogImage = ogImagePath || '/images/og-image.png';
  const url = path ? `https://keywordpulse.vercel.app${path}` : 'https://keywordpulse.vercel.app';

  const ogConfig = defaultMetadata.openGraph ? { ...defaultMetadata.openGraph } : {};
  const twitterConfig = defaultMetadata.twitter ? { ...defaultMetadata.twitter } : {};

  return {
    ...defaultMetadata,
    title: finalTitle,
    description: finalDesc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...ogConfig,
      title: finalTitle,
      description: finalDesc,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${finalTitle} 이미지`,
        },
      ],
    },
    twitter: {
      ...twitterConfig,
      title: finalTitle,
      description: finalDesc,
      images: [ogImage],
    },
  };
} 