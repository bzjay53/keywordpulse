# KeywordPulse 테스트 전략

## 목차
- [개요](#개요)
- [테스트 유형](#테스트-유형)
- [테스트 도구](#테스트-도구)
- [테스트 구조](#테스트-구조)
- [테스트 커버리지](#테스트-커버리지)
- [테스트 자동화](#테스트-자동화)
- [테스트 환경](#테스트-환경)
- [테스트 데이터 관리](#테스트-데이터-관리)
- [테스트 모범 사례](#테스트-모범-사례)
- [특별한 테스트 시나리오](#특별한-테스트-시나리오)
- [테스트 유지 관리](#테스트-유지-관리)
- [관련 문서](#관련-문서)

## 개요

KeywordPulse의 테스트 전략은 애플리케이션의 안정성, 신뢰성, 사용자 경험을 보장하기 위해 설계되었습니다. 이 문서는 프로젝트의 테스트 접근 방식, 도구, 모범 사례 및 프로세스를 정의합니다.

## 테스트 유형

KeywordPulse 프로젝트는 다음과 같은 테스트 유형을 활용합니다:

### 단위 테스트
- **대상**: 개별 함수, 훅, 컴포넌트
- **도구**: Jest, React Testing Library
- **목표**: 개별 모듈의 기능 검증, 엣지 케이스 처리 확인
- **범위**: 
  - 유틸리티 함수
  - 커스텀 훅
  - UI 컴포넌트 (독립적인 동작)
  - API 핸들러 로직

### 통합 테스트
- **대상**: 여러 컴포넌트나 모듈 간의 상호 작용
- **도구**: Jest, React Testing Library, MSW(Mock Service Worker)
- **목표**: 컴포넌트 간 상호 작용 및 데이터 흐름 검증
- **범위**:
  - 폼 제출 및 검증
  - API 호출 및 데이터 표시
  - 상태 관리 로직
  - 복잡한 UI 워크플로우

### E2E(End-to-End) 테스트
- **대상**: 전체 애플리케이션 워크플로우
- **도구**: Cypress
- **목표**: 실제 사용자 시나리오를 시뮬레이션하여 전체 시스템 검증
- **범위**:
  - 사용자 인증 및 권한 부여
  - 검색 및 분석 워크플로우
  - 결제 및 등록 프로세스
  - 주요 기능 전체 흐름

### 성능 테스트
- **대상**: 애플리케이션 성능 및 로딩 시간
- **도구**: Lighthouse, WebPageTest, web-vitals
- **목표**: 주요 성능 메트릭 모니터링 및 개선
- **범위**:
  - 페이지 로드 시간
  - 웹 바이탈(CLS, LCP, FID 등)
  - 번들 크기
  - API 응답 시간

### 접근성 테스트
- **대상**: UI 컴포넌트 및 페이지
- **도구**: axe-core, Lighthouse
- **목표**: WCAG 가이드라인 준수 확인
- **범위**:
  - 키보드 탐색
  - 스크린 리더 호환성
  - 색상 대비
  - ARIA 속성 검증

## 테스트 도구

KeywordPulse는 다음 도구를 활용합니다:

| 도구 | 용도 | 설정 파일 |
|------|------|----------|
| Jest | 단위 및 통합 테스트 프레임워크 | jest.config.js |
| React Testing Library | 컴포넌트 테스트 | N/A |
| Testing Library User Event | 사용자 상호작용 시뮬레이션 | N/A |
| MSW (Mock Service Worker) | API 요청 모킹 | src/mocks/handlers.js |
| Cypress | E2E 테스트 | cypress.config.js |
| axe-core | 접근성 테스트 | N/A |
| Lighthouse CI | 성능 및 접근성 자동화 | .lighthouserc.js |

## 테스트 구조

### 파일 구조

테스트 파일은 다음 구조를 따릅니다:

```
keywordpulse/
├── app/
│   ├── components/
│   │   ├── KeywordCard.tsx
│   │   └── __tests__/
│   │       ├── KeywordCard.test.tsx      # 단위 테스트
│   │       └── KeywordCard.int.test.tsx  # 통합 테스트
│   ├── lib/
│   │   ├── analytics.ts
│   │   └── __tests__/
│   │       └── analytics.test.ts
├── tests/
│   ├── e2e/                     # Cypress E2E 테스트
│   │   ├── search.cy.js
│   │   └── auth.cy.js
│   ├── fixtures/                # 테스트 데이터
│   │   └── keywords.json
│   └── utils/                   # 테스트 유틸리티
│       └── testHelpers.ts
```

### 테스트 네이밍

```typescript
// 단위 테스트
describe('KeywordCard', () => {
  it('renders keyword title and score', () => {});
  it('shows recommendation badge based on score', () => {});
  it('applies correct color based on score threshold', () => {});
});

// 통합 테스트
describe('Search Flow', () => {
  it('fetches and displays search results when form is submitted', async () => {});
  it('shows error message when API returns error', async () => {});
});
```

## 테스트 커버리지

### 커버리지 목표

| 구성 요소 | 최소 커버리지 목표 |
|----------|-----------------|
| 유틸리티 함수 | 90% |
| 커스텀 훅 | 85% |
| UI 컴포넌트 | 80% |
| API 라우트 | 85% |
| 전체 코드베이스 | 75% |

### 커버리지 보고

- 모든 PR에서 테스트 커버리지 확인
- 정기적인 커버리지 리포트 생성 및 검토
- 커버리지가 감소하는 PR 승인 전 검토

```bash
# 커버리지 보고서 생성
npm run test:coverage
```

## 테스트 자동화

### CI/CD 통합

GitHub Actions 워크플로우에서 다음 단계를 자동화합니다:

1. **빌드 검증**: 
   - 코드 변경 사항이 빌드 가능한지 확인

2. **단위 및 통합 테스트**: 
   - 모든 테스트 실행
   - 커버리지 보고서 생성

3. **E2E 테스트**: 
   - 주요 사용자 흐름 검증
   - 시각적 회귀 테스트 

4. **성능 및 접근성 검사**: 
   - Lighthouse CI를 통한 스코어 측정
   - 임계값 미달 시 경고

## 테스트 환경

### 환경 구성

| 환경 | 용도 | 데이터 | 설정 |
|------|------|-------|------|
| 로컬 | 개발 중 테스트 | 모의 데이터 | `.env.test.local` |
| CI | 자동화된 테스트 | 고정 테스트 데이터 | `.env.test` |
| 스테이징 | 통합 테스트 | 샘플링된 프로덕션 데이터 | `.env.staging` |

### 환경 변수

테스트용 환경 변수는 `.env.test` 파일에 정의합니다:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
SUPABASE_URL=https://test-instance.supabase.co
SUPABASE_ANON_KEY=test-anon-key
```

## 테스트 데이터 관리

### 테스트 픽스처

테스트 데이터는 고정 픽스처로 관리합니다:

```typescript
// tests/fixtures/keywords.json
export const testKeywords = [
  {
    id: "1",
    keyword: "react hooks tutorial",
    volume: 18500,
    difficulty: 45,
    score: 78,
    createdAt: "2023-10-20T12:00:00Z"
  },
  // ...
];
```

### 데이터 시딩

통합 테스트를 위한 데이터베이스 시딩:

```typescript
// tests/utils/seedTestDatabase.ts
export async function seedTestDatabase() {
  const supabase = createTestClient();
  await supabase.from('keywords').delete().neq('id', '0');
  await supabase.from('keywords').insert(testKeywords);
}
```

## 테스트 모범 사례

### 단위 테스트

```typescript
// Good unit test example
describe('calculateKeywordScore', () => {
  it('returns high score for high volume and low difficulty', () => {
    expect(calculateKeywordScore({ volume: 10000, difficulty: 20 })).toBeGreaterThan(80);
  });

  it('returns low score for low volume and high difficulty', () => {
    expect(calculateKeywordScore({ volume: 100, difficulty: 90 })).toBeLessThan(30);
  });

  it('handles edge cases correctly', () => {
    expect(calculateKeywordScore({ volume: 0, difficulty: 0 })).toBe(0);
    expect(calculateKeywordScore({ volume: 100000, difficulty: 100 })).toBe(50);
  });
});
```

### 컴포넌트 테스트

```typescript
// Good component test example
describe('KeywordCard', () => {
  it('renders keyword information correctly', () => {
    const keyword = { 
      id: '1', 
      keyword: 'test keyword', 
      score: 85, 
      volume: 5000 
    };
    
    render(<KeywordCard keyword={keyword} />);
    
    expect(screen.getByText('test keyword')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('강력 추천')).toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    
    render(<KeywordCard keyword={{ id: '1', keyword: 'test' }} onClick={handleClick} />);
    
    userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API 테스트

```typescript
// Good API test example
jest.mock('@/app/lib/supabaseClient');

describe('GET /api/keywords', () => {
  it('returns keywords with correct format', async () => {
    mockSupabaseQuery.mockResolvedValue({
      data: testKeywords,
      error: null
    });
    
    const response = await fetch('/api/keywords');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.keywords).toHaveLength(testKeywords.length);
    expect(data.keywords[0]).toHaveProperty('keyword');
    expect(data.keywords[0]).toHaveProperty('score');
  });
});
```

## 특별한 테스트 시나리오

### 비동기 작업 테스트

```typescript
it('loads and displays keyword data', async () => {
  render(<KeywordDashboard />);
  
  // 로딩 상태 확인
  expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  
  // 데이터 로드 대기
  await waitFor(() => {
    expect(screen.queryByText('로딩 중...')).not.toBeInTheDocument();
  });
  
  // 결과 확인
  expect(screen.getByText('검색 결과')).toBeInTheDocument();
});
```

### 에러 시나리오 테스트

```typescript
it('displays error message when API fails', async () => {
  // API 오류 모킹
  server.use(
    rest.get('/api/keywords', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );
  
  render(<KeywordDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('데이터를 불러오는 중 오류가 발생했습니다')).toBeInTheDocument();
  });
});
```

## 테스트 유지 관리

### 테스트 리팩토링

코드가 변경될 때 테스트도 함께 업데이트합니다:

- 컴포넌트 인터페이스 변경 시 관련 테스트 조정
- 유틸리티 함수 시그니처 변경 시 테스트 케이스 수정
- 중복된 테스트 설정은 공통 헬퍼 함수로 추출

### 플레이키(Flaky) 테스트 처리

- 비결정적 테스트 식별 및 수정
- 타임아웃 및 비동기 작업에 적절한 대기 시간 설정
- 환경 의존성 최소화 

## 관련 문서

- [CodeQualityGuidelines.md](./CodeQualityGuidelines.md): 코드 품질 가이드라인
- [CICDPipeline.md](./CICDPipeline.md): CI/CD 파이프라인 문서
- [PerformanceOptimization.md](./PerformanceOptimization.md): 성능 최적화 가이드 