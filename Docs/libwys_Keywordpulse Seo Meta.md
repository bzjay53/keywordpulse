# 🔍 SEO 및 메타데이터 구성 가이드

KeywordPulse 웹 애플리케이션의 검색 엔진 최적화(SEO) 및 메타데이터 구성 방법에 관한 문서입니다.

---

## 📌 개요

- **목적**: 검색 엔진 노출 최적화 및 소셜 미디어 공유 시 풍부한 콘텐츠 제공
- **구성**: 
  - Next.js 메타데이터 API 활용
  - 모든 페이지 공통 메타데이터 관리
  - 페이지별 메타데이터 커스터마이징
  - 구조화된 데이터(JSON-LD) 통합
  - 웹 표준 도구 지원

---

## 🔧 구현 내용

### 1. 공통 메타데이터 시스템 구축

중앙 집중식으로 메타데이터를 관리하기 위해 `app/metadata.ts` 파일을 생성하고 두 가지 주요 기능을 제공합니다:

- **기본 메타데이터**: 사이트 전체에 적용되는 기본 정보
- **메타데이터 생성 함수**: 페이지별 커스텀 메타데이터 생성

```typescript
// app/metadata.ts
import { Metadata } from 'next';

// 기본 메타데이터
export const defaultMetadata: Metadata = {
  title: 'KeywordPulse - 실시간 키워드 분석 도구',
  description: '마케터와 콘텐츠 제작자를 위한 실시간 키워드 분석 및 추천 플랫폼',
  // ... 기타 기본 메타데이터 ...
};

// 페이지별 메타데이터 생성 함수
export function createMetadata({ title, description, path, ogImagePath }: {...}): Metadata {
  // ... 페이지별 메타데이터 생성 로직 ...
}
```

### 2. 페이지별 메타데이터 적용 예시

각 페이지에서는 간단하게 공통 함수를 사용하여 페이지별 메타데이터를 정의할 수 있습니다:

```typescript
// app/login/page.tsx
import { createMetadata } from '../metadata';

export const metadata = createMetadata({
  title: '로그인',
  description: 'KeywordPulse에 로그인하여 키워드 분석 기능을 이용하세요.',
  path: '/login',
});
```

### 3. Next.js 웹 표준 파일 지원

검색 엔진 및 웹 표준 지원을 위한 파일들을 추가했습니다:

1. **Sitemap**: `app/sitemap.ts`
   - 검색 엔진 크롤링을 돕는 사이트맵 자동 생성
   - 페이지별 우선순위 및 변경 빈도 설정

2. **Robots**: `app/robots.ts`
   - 검색 엔진 크롤러에 대한 접근 제어
   - 사이트맵 위치 명시

3. **Manifest**: `app/manifest.ts`
   - PWA(Progressive Web App) 지원을 위한 웹 앱 매니페스트
   - 앱 설치 시 아이콘, 이름, 테마 색상 등 정의

### 4. 구조화된 데이터(JSON-LD) 추가

검색 엔진이 콘텐츠를 더 잘 이해할 수 있도록 구조화된 데이터를 추가했습니다:

```typescript
// components/JsonLd.tsx
'use client';

import React from 'react';
import Script from 'next/script';

const JsonLd: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
};
```

구현한 구조화된 데이터 유형:
- `createFaqJsonLd`: FAQ 페이지 스키마
- `createAppJsonLd`: 소프트웨어 애플리케이션 스키마
- `createOrganizationJsonLd`: 조직 정보 스키마

---

## 🖼️ 이미지 최적화

메타데이터에 사용되는 이미지 리소스는 다음과 같이 구성했습니다:

| 파일명 | 용도 | 크기 |
|------|------|------|
| `og-image.png` | 소셜 미디어 공유 이미지 | 1200×630px |
| `icon-192.png` | 작은 앱 아이콘 | 192×192px |
| `icon-512.png` | 큰 앱 아이콘 | 512×512px |
| `icon-maskable.png` | PWA 마스커블 아이콘 | 512×512px |

---

## 📊 예상 효과

- **검색 엔진 가시성**: Google, Naver 등 검색 엔진에서 더 높은 순위 기대
- **소셜 미디어 공유**: 링크 공유 시 풍부한 미리보기 제공
- **브랜딩 향상**: 일관된 메타데이터로 브랜드 인지도 향상
- **웹 표준 준수**: 최신 웹 표준 준수로 브라우저 호환성 개선

---

## 🔎 확인 및 테스트

다음 도구로 SEO 및 메타데이터 구성을 검증할 수 있습니다:

1. [Google 구조화된 데이터 테스트](https://search.google.com/structured-data/testing-tool)
2. [Facebook 공유 디버거](https://developers.facebook.com/tools/debug/)
3. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. [Google PageSpeed Insights](https://pagespeed.web.dev/)

---

## 📌 참고 문서
- [Next.js 메타데이터 API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/) - 구조화된 데이터 표준
- [Google Search Console](https://search.google.com/search-console/about) - 웹사이트 색인 및 검색 성능 모니터링