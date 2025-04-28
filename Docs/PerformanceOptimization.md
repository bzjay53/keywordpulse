# 성능 최적화 가이드 문서

이 문서는 KeywordPulse 프로젝트의 성능 최적화 전략과 구현 가이드라인을 제공합니다.

## 1. 프론트엔드 성능 최적화

### 1.1 코드 스플리팅

- **페이지 별 코드 스플리팅**
  - Next.js의 동적 가져오기 활용
  - 필요한 시점에 컴포넌트 로드

```typescript
// 동적 가져오기 예시
import dynamic from 'next/dynamic';

const DynamicAnalysisCard = dynamic(
  () => import('@/components/AnalysisCard'),
  { 
    loading: () => <p>분석 결과 로딩 중...</p>,
    ssr: false 
  }
);
```

### 1.2 이미지 최적화

- **Next.js Image 컴포넌트 사용**
  - 적절한 이미지 크기 및 포맷 자동 조정
  - WebP 포맷 활용
  - 지연 로딩 적용

```typescript
import Image from 'next/image';

// 최적화된 이미지 사용 예시
<Image 
  src="/images/logo.png"
  alt="KeywordPulse Logo"
  width={200}
  height={60}
  priority={true}
/>
```

### 1.3 컴포넌트 메모이제이션

- **React.memo 활용**
  - 자주 렌더링되는 컴포넌트에 적용
  - props 비교 함수 최적화

- **useMemo 및 useCallback 활용**
  - 계산 비용이 높은 작업 메모이제이션
  - 콜백 함수 참조 안정성 유지

```typescript
// 메모이제이션 예시
const MemoizedKeywordTable = React.memo(KeywordTable, (prev, next) => {
  return prev.keywords.length === next.keywords.length &&
    prev.keywords.every((k, i) => k.id === next.keywords[i].id);
});

// useMemo 사용 예시
const sortedKeywords = useMemo(() => {
  return [...keywords].sort((a, b) => b.score - a.score);
}, [keywords]);
```

### 1.4 가상 스크롤

- **긴 목록에 가상 스크롤 적용**
  - react-window 또는 react-virtualized 사용
  - 화면에 보이는 항목만 렌더링

```typescript
import { FixedSizeList } from 'react-window';

// 가상 스크롤 예시
<FixedSizeList
  height={500}
  width="100%"
  itemCount={keywords.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      <KeywordItem keyword={keywords[index]} />
    </div>
  )}
</FixedSizeList>
```

## 2. 백엔드 성능 최적화

### 2.1 API 응답 캐싱

- **서버 사이드 캐싱**
  - 자주 요청되는 데이터 캐싱
  - 캐시 무효화 전략 구현

```typescript
// Next.js API 라우트 캐싱 예시
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  // 캐시 헤더 설정
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60, s-maxage=180, stale-while-revalidate=300'
    }
  });
}
```

### 2.2 데이터베이스 쿼리 최적화

- **인덱스 활용**
  - 자주 검색되는 필드에 인덱스 추가
  - 복합 인덱스 필요 시 적용

- **쿼리 최적화**
  - 필요한 필드만 선택
  - 페이지네이션 구현
  - 조인 최소화

```typescript
// Supabase 쿼리 최적화 예시
const { data, error } = await supabase
  .from('keywords')
  .select('id, text, score')  // 필요한 필드만 선택
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .range(0, 19);  // 페이지네이션
```

### 2.3 RAG 엔진 최적화

- **배치 처리**
  - 키워드 분석 배치 처리
  - 비동기 처리 활용

- **계산 결과 캐싱**
  - 동일 키워드 재분석 방지
  - 임시 결과 저장

```typescript
// RAG 엔진 최적화 예시
async function analyzeKeywordsBatch(keywords: string[]): Promise<AnalysisResult[]> {
  // 캐시된 결과 확인
  const cachedResults = await getCachedResults(keywords);
  
  // 캐시에 없는 키워드만 분석
  const keywordsToAnalyze = keywords.filter(k => !cachedResults.has(k));
  
  // 배치 처리
  const batchResults = await Promise.all(
    chunk(keywordsToAnalyze, 10).map(batch => 
      analyzeKeywordBatch(batch)
    )
  );
  
  // 결과 캐싱
  await cacheResults(batchResults.flat());
  
  // 전체 결과 반환
  return keywords.map(k => cachedResults.get(k) || findResult(k, batchResults));
}
```

## 3. 네트워크 최적화

### 3.1 API 요청 최적화

- **요청 배치 처리**
  - 여러 요청을 하나로 합치기
  - 배치 API 엔드포인트 구현

- **데이터 압축**
  - 응답 데이터 Gzip 압축
  - JSON 최소화

### 3.2 서비스 워커

- **오프라인 지원**
  - PWA 구현
  - 핵심 리소스 캐싱

- **백그라운드 동기화**
  - 네트워크 조건에 따른 데이터 동기화
  - 오프라인 작업 대기열 구현

```typescript
// 서비스 워커 등록 예시
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(
      function(registration) {
        console.log('ServiceWorker registration successful');
      },
      function(err) {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}
```

## 4. 렌더링 최적화

### 4.1 서버 사이드 렌더링 (SSR)

- **핵심 페이지 SSR 적용**
  - 초기 로딩 속도 개선
  - SEO 최적화

### 4.2 정적 사이트 생성 (SSG)

- **변경이 적은 페이지 SSG 적용**
  - 문서, 랜딩 페이지 등
  - revalidate 시간 설정

```typescript
// Next.js SSG 예시
export async function generateStaticParams() {
  return [
    { slug: 'about' },
    { slug: 'privacy' },
    { slug: 'terms' }
  ];
}
```

### 4.3 증분 정적 재생성 (ISR)

- **데이터 업데이트 빈도에 맞춘 ISR**
  - 자주 변경되지 않는 데이터에 적용
  - 적절한 revalidate 시간 설정

```typescript
// Next.js ISR 예시
export async function generateMetadata({ params }) {
  // ...
}

export const revalidate = 3600; // 1시간마다 재검증
```

## 5. 자산 최적화

### 5.1 정적 자산 최적화

- **번들 크기 최적화**
  - 번들 분석 및 최적화
  - 트리 쉐이킹 활용

- **코드 미니파이**
  - JavaScript 및 CSS 미니파이
  - 불필요한 공백 및 주석 제거

### 5.2 폰트 최적화

- **웹 폰트 최적화**
  - 필요한 글리프만 포함
  - font-display: swap 사용
  - 로컬 폰트 사용

```css
/* 폰트 최적화 예시 */
@font-face {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Pretendard Regular'),
       url('/fonts/Pretendard-Regular.woff2') format('woff2');
}
```

## 6. 성능 측정 및 모니터링

### 6.1 성능 측정 도구

- **Lighthouse**
  - 웹 성능, 접근성, SEO 측정
  - CI/CD 파이프라인 통합

- **Web Vitals**
  - LCP, FID, CLS 등 핵심 지표 측정
  - 사용자 경험 모니터링

```typescript
// Web Vitals 측정 예시
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) || 
    fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### 6.2 실시간 모니터링

- **Sentry Performance**
  - 실시간 성능 모니터링
  - 성능 이슈 알림 설정

- **Google Analytics**
  - 사용자 행동 분석
  - 페이지 로드 시간 측정

## 7. 모바일 최적화

- **반응형 디자인**
  - 모바일 우선 접근법
  - CSS 미디어 쿼리 최적화

- **터치 최적화**
  - 터치 타겟 크기 적절히 설정 (최소 44x44px)
  - 터치 피드백 제공

- **모바일 네트워크 최적화**
  - 저대역폭 환경 고려
  - 필수 리소스 우선 로드

## 8. 성능 최적화 체크리스트

### 8.1 프론트엔드 체크리스트

- [ ] 번들 크기 10% 이상 감소
- [ ] Lighthouse 성능 점수 90 이상
- [ ] LCP 2.5초 이하
- [ ] FID 100ms 이하
- [ ] CLS 0.1 이하
- [ ] 이미지 최적화 적용
- [ ] 코드 스플리팅 구현
- [ ] 컴포넌트 메모이제이션 적용
- [ ] 폰트 최적화 완료

### 8.2 백엔드 체크리스트

- [ ] API 응답 시간 200ms 이하
- [ ] 데이터베이스 쿼리 최적화 완료
- [ ] 캐싱 전략 구현
- [ ] 배치 처리 API 제공
- [ ] 서버 리소스 사용 모니터링 설정

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다. 