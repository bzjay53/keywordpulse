# 성능 최적화 가이드

## 1. 개요

이 문서는 KeywordPulse 프로젝트의 성능 최적화 전략과 구현 방법을 설명합니다. 웹 애플리케이션의 속도와 반응성을 개선하기 위한 모범 사례와 기술적 접근 방식을 제공합니다.

## 2. 핵심 성능 지표

### 2.1 Web Vitals

다음의 핵심 성능 지표를 기준으로 성능을 측정하고 개선합니다:

- **LCP (Largest Contentful Paint)**: 최대 콘텐츠 렌더링 시간 - 목표: < 2.5초
- **FID (First Input Delay)**: 첫 번째 입력 지연 - 목표: < 100ms
- **CLS (Cumulative Layout Shift)**: 누적 레이아웃 이동 - 목표: < 0.1
- **FCP (First Contentful Paint)**: 첫 번째 콘텐츠 렌더링 - 목표: < 1.8초
- **TTI (Time to Interactive)**: 상호작용 가능 시간 - 목표: < 3.8초

### 2.2 성능 측정 도구

다음 도구를 사용하여 성능을 정기적으로 측정합니다:

- **Lighthouse**: 전반적인 성능 점수 및 개선 사항 식별
- **Chrome DevTools Performance 탭**: 런타임 성능 분석
- **Web Vitals Report**: 실사용자 경험 데이터 수집
- **Vercel Analytics**: 배포 후 실제 사용자 기반 성능 측정

## 3. 번들 크기 최적화

### 3.1 코드 분할 (Code Splitting)

```tsx
// 동적 가져오기를 사용한 코드 분할
import dynamic from 'next/dynamic';

// 기본 로딩 상태 제공
const DynamicKeywordAnalysis = dynamic(
  () => import('@/app/components/KeywordAnalysis'),
  {
    loading: () => <p>분석 도구 로딩 중...</p>,
    ssr: false // 클라이언트 사이드에서만 로드
  }
);

export default function AnalyticsPage() {
  return (
    <div>
      <h1>키워드 분석</h1>
      <DynamicKeywordAnalysis />
    </div>
  );
}
```

### 3.2 트리 쉐이킹 최적화

- **선택적 임포트 사용**:

```tsx
// 나쁜 예: 전체 라이브러리 임포트
import * as lodash from 'lodash';

// 좋은 예: 필요한 함수만 임포트
import debounce from 'lodash/debounce';
```

### 3.3 번들 분석 및 최적화

- **@next/bundle-analyzer** 설정:

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // 기존 Next.js 설정
});
```

- 실행 방법: `ANALYZE=true npm run build`

### 3.4 불필요한 의존성 제거

정기적으로 `npm depcheck` 또는 유사 도구를 사용하여 미사용 의존성을 식별하고 제거합니다.

## 4. 이미지 최적화

### 4.1 Next.js Image 컴포넌트 활용

```tsx
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/images/banner.jpg"
      alt="설명적인 대체 텍스트"
      width={800}
      height={600}
      priority={true} // LCP 이미지에 우선순위 부여
      quality={85} // 품질 설정 (기본값: 75)
      placeholder="blur" // 로딩 중 표시할 블러 효과
      blurDataURL="data:image/jpeg;base64,..." // 블러 데이터 URL
    />
  );
}
```

### 4.2 이미지 형식 최적화

- 모던 이미지 형식(WebP, AVIF) 사용
- 적절한 이미지 크기 선택
- 이미지 지연 로딩 구현

### 4.3 CDN 활용

Vercel의 Edge Network를 통한 이미지 제공으로 글로벌 사용자에게 빠른 로딩 속도 보장.

## 5. API 성능 최적화

### 5.1 Edge Runtime 활용

```typescript
// app/api/keywords/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  // 엣지에서 실행되는 API 로직
  return new Response(JSON.stringify({ data: [...] }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
    },
  });
}
```

### 5.2 데이터 캐싱 전략

```typescript
// SWR을 사용한 클라이언트 사이드 캐싱
import useSWR from 'swr';

function useKeywords() {
  const { data, error, isLoading } = useSWR('/api/keywords', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5분마다 갱신
  });
  
  return {
    keywords: data,
    isLoading,
    isError: error
  };
}
```

### 5.3 API 응답 최적화

- GraphQL을 활용한 필요한 데이터만 요청
- 응답 데이터 압축 (gzip, brotli)
- JSON 페이로드 최소화

## 6. 렌더링 최적화

### 6.1 렌더링 전략 선택

KeywordPulse는 다음 렌더링 전략을 혼합하여 사용합니다:

- **정적 생성 (SSG)**: 자주 변경되지 않는 페이지
- **클라이언트 렌더링 (CSR)**: 사용자별 맞춤형 대시보드
- **증분 정적 재생성 (ISR)**: 정기적으로 업데이트되는 콘텐츠

```typescript
// 정적 페이지 예시
export default function StaticPage({ data }) {
  return <div>{/* 정적 콘텐츠 렌더링 */}</div>;
}

// ISR 구현 (app 디렉토리 구조에서는 다른 방식으로 구현)
export async function getStaticProps() {
  return {
    props: {
      data: await fetchData(),
    },
    revalidate: 3600, // 1시간마다 재생성
  };
}
```

### 6.2 React 컴포넌트 최적화

메모이제이션 기법을 활용하여 불필요한 리렌더링 방지:

```tsx
// React.memo를 사용한 컴포넌트 메모이제이션
const KeywordCard = React.memo(function KeywordCard({ keyword, score }) {
  return (
    <div className="card">
      <h3>{keyword}</h3>
      <p>Score: {score}</p>
    </div>
  );
});

// useMemo와 useCallback을 사용한 최적화
function KeywordList({ keywords }) {
  // 키워드 정렬 로직을 메모이제이션
  const sortedKeywords = useMemo(() => {
    return [...keywords].sort((a, b) => b.score - a.score);
  }, [keywords]);
  
  // 이벤트 핸들러를 메모이제이션
  const handleClick = useCallback((id) => {
    console.log(`Keyword clicked: ${id}`);
  }, []);
  
  return (
    <div>
      {sortedKeywords.map(k => (
        <KeywordCard 
          key={k.id} 
          keyword={k.text} 
          score={k.score} 
          onClick={() => handleClick(k.id)}
        />
      ))}
    </div>
  );
}
```

### 6.3 가상화 (Virtualization)

큰 목록을 효율적으로 렌더링하기 위해 가상화 라이브러리 활용:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }) {
  const parentRef = React.useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // 각 항목의 예상 높이
  });
  
  return (
    <div 
      ref={parentRef} 
      style={{ height: '500px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 7. CSS 및 자바스크립트 최적화

### 7.1 CSS 최적화

- **Tailwind CSS의 PurgeCSS**: 미사용 CSS 제거
- **Critical CSS**: 중요 CSS를 인라인으로 포함
- **CSS 분할**: 페이지별 필요한 스타일만 로드

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // 기타 설정
};
```

### 7.2 자바스크립트 실행 최적화

- **메인 스레드 블로킹 방지**: 무거운 연산은 웹 워커로 이동
- **이벤트 리스너 최적화**: 디바운싱 및 스로틀링 적용

```typescript
// 디바운스 함수 예시
function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 사용 예시
const debouncedSearch = debounce((query) => {
  performExpensiveSearch(query);
}, 300);

// 입력 이벤트에 적용
searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

## 8. 캐싱 전략

### 8.1 브라우저 캐싱

적절한 HTTP 캐시 헤더 설정:

```typescript
// Vercel.json 설정 예시
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 8.2 서비스 워커 활용

오프라인 기능 및 성능 향상을 위한 서비스 워커 구현:

```javascript
// public/service-worker.js
const CACHE_NAME = 'keywordpulse-cache-v1';
const urlsToCache = [
  '/',
  '/static/styles/main.css',
  '/static/scripts/main.js',
  '/static/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

## 9. 폰트 최적화

### 9.1 웹 폰트 최적화

```typescript
// next.config.js에 폰트 최적화 설정
module.exports = {
  optimizeFonts: true,
  // 기타 설정
};
```

### 9.2 폰트 로딩 전략

```tsx
// _document.tsx 또는 레이아웃 컴포넌트에서 폰트 미리 로드
<link
  rel="preload"
  href="/fonts/noto-sans-kr-v13-korean-regular.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

### 9.3 가변 폰트 활용

```css
/* 가변 폰트 활용 */
@font-face {
  font-family: 'Noto Sans KR Variable';
  src: url('/fonts/noto-sans-kr-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
```

## 10. 모바일 성능 최적화

### 10.1 반응형 이미지

```tsx
// 반응형 이미지 구현
<Image
  src="/images/hero.jpg"
  alt="Hero Image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width={1200}
  height={600}
/>
```

### 10.2 터치 이벤트 최적화

```typescript
// 터치 이벤트 최적화
function setupTouchInteractions(element) {
  let touchStartX = 0;
  let touchEndX = 0;
  
  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true }); // passive: true로 설정하여 성능 향상
  
  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    if (touchEndX < touchStartX) {
      // 왼쪽 스와이프 처리
    }
    if (touchEndX > touchStartX) {
      // 오른쪽 스와이프 처리
    }
  }
}
```

## 11. 성능 모니터링 및 개선

### 11.1 실사용자 모니터링 (RUM)

```typescript
// web-vitals 라이브러리를 사용한 성능 측정
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
  
  navigator.sendBeacon('/api/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### 11.2 성능 예산 설정

프로젝트의 성능 예산:
- 전체 번들 크기: < 250KB (압축 후)
- 첫 페이지 로드 시간: < 3초 (3G 연결 기준)
- 페이지 상호작용 시간: < 100ms

### 11.3 성능 회귀 테스트

CI/CD 파이프라인에 Lighthouse CI 통합:

```yaml
# GitHub Actions 워크플로우 예시
name: Performance Testing

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run start & npx wait-on http://localhost:3000
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/keywords
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

## 12. 성능 최적화 체크리스트

### 12.1 개발 단계 체크리스트

- [ ] 코드 분할과 지연 로딩 구현
- [ ] 이미지와 폰트 최적화
- [ ] 불필요한 렌더링 방지 (React.memo, useMemo, useCallback)
- [ ] 애니메이션 및 변환 효율적 사용
- [ ] CSS 번들 최적화 및 중요 CSS 인라인화

### 12.2 빌드 단계 체크리스트

- [ ] 번들 분석 실행 및 크기 최적화
- [ ] 정적 에셋 압축 (gzip, brotli)
- [ ] 소스맵 처리 (프로덕션에서는 제거 또는 분리)
- [ ] 미사용 코드 제거 (트리 쉐이킹)
- [ ] 환경별 최적화 설정 적용

### 12.3 배포 단계 체크리스트

- [ ] CDN 구성 최적화
- [ ] 적절한 캐시 정책 설정
- [ ] HTTP/2 또는 HTTP/3 활성화
- [ ] Brotli 압축 활성화
- [ ] 성능 모니터링 설정

## 13. 결론

성능 최적화는 지속적인 과정입니다. 정기적인 성능 감사와 측정을 통해 사용자 경험을 지속적으로 개선해 나가야 합니다. 이 문서에 설명된 기법들을 적용하고 성능 데이터를 분석하여 KeywordPulse 애플리케이션의 성능을 최적화하세요. 