'use client';

import React from 'react';
import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, any>;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
};

export default JsonLd;

// FAQ 타입 구조화 데이터 생성기
export function createFaqJsonLd(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

// 소프트웨어 애플리케이션 타입 구조화 데이터 생성기
export function createAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'KeywordPulse',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '24',
    },
  };
}

// 조직 타입 구조화 데이터 생성기
export function createOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KeywordPulse',
    url: 'https://keywordpulse.vercel.app',
    logo: 'https://keywordpulse.vercel.app/images/logo.png',
    sameAs: [
      'https://twitter.com/keywordpulse',
      'https://github.com/keywordpulse',
    ],
  };
} 