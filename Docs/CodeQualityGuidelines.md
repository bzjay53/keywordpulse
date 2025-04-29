# KeywordPulse 코드 품질 가이드라인

## 목차
- [개요](#개요)
- [코딩 표준](#코딩-표준)
- [코드 구조화](#코드-구조화)
- [TypeScript 모범 사례](#typescript-모범-사례)
- [React 및 Next.js 모범 사례](#react-및-nextjs-모범-사례)
- [성능 최적화](#성능-최적화)
- [코드 주석](#코드-주석)
- [CSS 및 스타일링](#css-및-스타일링)
- [테스트 코드 품질](#테스트-코드-품질)
- [코드 리뷰 가이드라인](#코드-리뷰-가이드라인)
- [관련 문서](#관련-문서)

## 개요

이 문서는 KeywordPulse 프로젝트의 코드 품질을 유지하기 위한 가이드라인을 제공합니다. 이 가이드라인은 코드의 일관성, 유지보수성, 가독성을 보장하기 위한 것입니다.

## 코딩 표준

### 명명 규칙

- **변수 및 함수**: camelCase 사용
  ```typescript
  const userData = fetchUserData();
  ```

- **컴포넌트**: PascalCase 사용
  ```typescript
  const KeywordCard = ({ keyword }) => { ... };
  ```

- **인터페이스 및 타입**: PascalCase 사용, 인터페이스는 'I' 접두사 없이
  ```typescript
  interface UserData { ... }
  type KeywordScore = { ... };
  ```

- **파일 이름**: 
  - 컴포넌트: PascalCase (예: `KeywordCard.tsx`)
  - 유틸리티 및 모듈: camelCase (예: `analyticsUtils.ts`)

### 코드 포맷팅

- ESLint와 Prettier를 사용하여 코드 포맷팅 일관성 유지
- 들여쓰기는 2칸 사용
- 한 줄 최대 길이: 100자
- 세미콜론 사용
- 작은따옴표 대신 큰따옴표 사용

### 일관성 유지를 위한 도구

```bash
# 코드 포맷팅 검사
npm run lint

# 코드 포맷팅 자동 수정
npm run lint:fix
```

## 코드 구조화

### 파일 및 디렉토리 구조

- 관련 기능은 동일한 디렉토리에 그룹화
- 파일 크기는 300줄 이하로 유지 (컴포넌트 포함)
- 컴포넌트는 다음과 같은 구조로 정리:
  - 컴포넌트 인터페이스 정의
  - 상수 및 헬퍼 함수
  - 주요 컴포넌트 구현
  - 내보내기 (export)

### 모듈 분리

큰 모듈은 다음과 같이 분리:

```
KeywordAnalysis/
├── components/
│   ├── AnalysisChart.tsx
│   ├── KeywordTable.tsx
│   └── ScoreCard.tsx
├── hooks/
│   ├── useKeywordData.ts
│   └── useAnalytics.ts
├── utils/
│   ├── scoring.ts
│   └── formatting.ts
├── types.ts
└── index.ts
```

## TypeScript 모범 사례

### 타입 정의

- 모든 함수 매개변수와 반환 값에 타입 지정
  ```typescript
  function calculateScore(keyword: string, factors: ScoreFactor[]): number { ... }
  ```

- 암시적 `any` 사용 금지
- 복잡한 타입은 별도 인터페이스나 타입으로 분리
  ```typescript
  interface KeywordAnalysisResult {
    score: number;
    volume: number;
    difficulty: number;
    recommendations: Recommendation[];
  }
  ```

### 타입 안전성

- 타입 단언(`as`) 대신 타입 가드 사용
  ```typescript
  // 지양할 사항:
  const result = someValue as AnalysisResult;
  
  // 권장 사항:
  if (isAnalysisResult(someValue)) {
    const result: AnalysisResult = someValue;
    // ...
  }
  ```

- null과 undefined 처리에 Optional Chaining 및 Nullish Coalescing 사용
  ```typescript
  const score = data?.analysis?.score ?? 0;
  ```

## React 및 Next.js 모범 사례

### 컴포넌트 구조

- 함수형 컴포넌트와 훅 사용
  ```typescript
  const KeywordCard: React.FC<KeywordCardProps> = ({ keyword, score }) => {
    const { isFavorite, toggleFavorite } = useFavorites(keyword);
    // ...
  }
  ```

- 컴포넌트는 단일 책임 원칙 준수
- Props는 구조 분해 할당으로 접근

### 상태 관리

- 상태 관리는 가능한 훅으로 추상화
  ```typescript
  function useKeywordData(keywordId: string) {
    const [data, setData] = useState<KeywordData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // ...
    return { data, isLoading, refresh };
  }
  ```

- Context API는 전역 상태에만 사용
- 컴포넌트 상태 로직은 커스텀 훅으로 추출

### Next.js 특화 패턴

- 서버 컴포넌트와 클라이언트 컴포넌트 구분
  ```typescript
  // 클라이언트 컴포넌트
  'use client';
  
  // 서버 컴포넌트 (명시적 표기 불필요)
  ```

- 페이지 성능을 위한 정적 및 동적 렌더링 전략 활용
- API 라우트는 Edge Runtime 활용 (필요 시)

## 성능 최적화

### 렌더링 최적화

- `useMemo`와 `useCallback`을 활용한 불필요한 렌더링 방지
  ```typescript
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
  ```

- 렌더링 비용이 높은 컴포넌트는 `React.memo` 사용
- 불필요한 상태 업데이트 방지

### 데이터 로딩 최적화

- SWR 또는 React Query와 같은 데이터 페칭 라이브러리 활용
- 페이지 이동 간 상태 유지를 위한 캐싱 전략 구현
- 필요 시 지연 로딩 및 데이터 프리패칭 적용

## 코드 주석

### 주석 작성 가이드

- 주석은 "왜(Why)" 그리고 "무엇(What)"에 초점
- JSDoc 형식 주석 사용
  ```typescript
  /**
   * 키워드 점수에 기반한 추천 배지를 생성
   * @param score - 0-100 사이의 키워드 점수
   * @returns 적절한 추천 수준 배지 컴포넌트
   */
  function getRecommendationBadge(score: number): JSX.Element { ... }
  ```

- 복잡한 로직에는 설명 추가
- TODO 주석에는 JIRA 이슈 ID 포함
  ```typescript
  // TODO(KP-123): 키워드 분석 알고리즘 개선
  ```

### 코드 자체 설명력 높이기

- 주석을 많이 쓰는 대신 명확한 이름의 변수와 함수 사용
- 복잡한 조건문은 설명적인 변수로 추출
  ```typescript
  // 지양할 사항:
  if (score > 80 && difficulty < 30 && volume > 1000) { ... }
  
  // 권장 사항:
  const isHighValueKeyword = score > 80 && difficulty < 30 && volume > 1000;
  if (isHighValueKeyword) { ... }
  ```

## CSS 및 스타일링

### Tailwind CSS 사용 가이드

- 클래스 이름은 알파벳 순으로 정렬
- 추상화가 필요한 경우 컴포넌트로 분리
- 과도한 중첩 및 조건부 클래스는 다음과 같이 분리:
  ```typescript
  const buttonClasses = clsx(
    "px-4 py-2 rounded",
    {
      "bg-blue-500 hover:bg-blue-600": variant === "primary",
      "bg-gray-500 hover:bg-gray-600": variant === "secondary",
      "opacity-50 cursor-not-allowed": disabled
    }
  );
  ```

### 반응형 디자인

- 모바일 우선 접근법 사용
- Tailwind 반응형 클래스 활용 (예: `md:flex lg:grid`)
- 미디어 쿼리 대신 Tailwind 브레이크포인트 사용

## 테스트 코드 품질

### 테스트 구조

- 테스트 파일은 테스트 대상 파일과 동일한 디렉토리에 위치
- 테스트 이름은 설명적으로 작성
  ```typescript
  describe('KeywordAnalyzer', () => {
    it('should correctly calculate score based on volume and competition', () => {
      // ...
    });
  });
  ```

### 테스트 범위

- 모든 유틸리티 함수는 단위 테스트 작성
- 중요 컴포넌트는 통합 테스트 작성
- Edge 케이스 및 오류 시나리오도 테스트

## 코드 리뷰 가이드라인

### 코드 리뷰 체크리스트

1. 코딩 표준 준수
2. 테스트 커버리지 충분성
3. 성능 고려사항
4. 보안 문제 검토
5. 문서화 적절성

### 피드백 제공 방법

- 건설적이고 구체적인 피드백 제공
- 코드에 대한 피드백을 개인적인 비판으로 표현하지 않기
- 개선 방법 제안 포함

## 관련 문서

- [TestingStrategy.md](./TestingStrategy.md): 테스트 전략 문서
- [PerformanceOptimization.md](./PerformanceOptimization.md): 성능 최적화 가이드
- [SecurityGuidelines.md](./SecurityGuidelines.md): 보안 관련 가이드라인