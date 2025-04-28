# KeywordPulse 테스트 전략 문서

이 문서는 KeywordPulse 프로젝트의 테스트 전략과 구현 방법을 설명합니다.

## 1. 테스트 원칙

### 1.1 테스트 철학

KeywordPulse 프로젝트의
 테스트는 다음 원칙을 따릅니다:

- **테스트 피라미드**: 단위 테스트를 기반으로 하고, 통합 테스트와 E2E 테스트가 보완하는 구조
- **독립성**: 각 테스트는 독립적으로 실행 가능하며 다른 테스트에 의존하지 않음
- **신뢰성**: 테스트 결과는 일관되고 예측 가능해야 함 (깜박이는 테스트 방지)
- **유지보수성**: 테스트 코드도 제품 코드와 동일한 품질 표준 적용
- **속도**: 테스트 실행은 가능한 빠르게 진행되어야 함

### 1.2 정적 내보내기 특별 고려사항

Next.js 정적 내보내기(Static Export) 환경에서는 다음 사항을 특별히 고려합니다:

- **클라이언트 중심 테스트**: 서버 사이드 기능에 대한 제한적 테스트
- **Edge Runtime 테스트**: API 라우트에 대한 별도 테스트 전략 필요
- **환경 변수 처리**: 빌드 타임과 런타임 환경 변수 차이 고려

## 2. 테스트 유형 및 도구

### 2.1 단위 테스트

**목적**: 개별 함수, 컴포넌트, 훅의 독립적인 기능 검증

**도구**:
- Jest: 테스트 러너 및 검증
- React Testing Library: 컴포넌트 테스트
- jest-dom: DOM 관련 검증 확장

**대상 코드**:
- 유틸리티 함수
- 커스텀 훅
- UI 컴포넌트
- 상태 관리 로직

**예시**:

```tsx
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2.2 통합 테스트

**목적**: 여러 컴포넌트 또는 기능 간의 상호작용 검증

**도구**:
- Jest
- React Testing Library
- MSW(Mock Service Worker): API 모킹

**대상 코드**:
- 페이지 컴포넌트
- 데이터 페칭 로직
- 폼 제출 흐름
- 컨텍스트 제공자와 소비자 간 상호작용

**예시**:

```tsx
// src/pages/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { LoginPage } from './LoginPage';

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('submits login form and handles successful response', async () => {
  render(<LoginPage />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'user@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
  });
});
```

### 2.3 E2E 테스트

**목적**: 실제 사용자 시나리오 및 전체 애플리케이션 흐름 검증

**도구**:
- Playwright: 브라우저 자동화 및 E2E 테스트

**대상 코드**:
- 핵심 사용자 경로
- 인증 및 권한 흐름
- 복잡한 다단계 프로세스

**예시**:

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('allows user to log in and access protected content', async ({ page }) => {
    // 로그인 페이지 방문
    await page.goto('/login');
    
    // 로그인 폼 작성 및 제출
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 리다이렉트 및 보호된 콘텐츠 확인
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

## 3. 테스트 구성 및 설정

### 3.1 Jest 구성

**jest.config.js**:

```javascript
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/_*.{ts,tsx}',
    '!app/api/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
```

**jest.setup.js**:

```javascript
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
```

### 3.2 Playwright 구성

**playwright.config.ts**:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['github']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 4. 테스트 모범 사례

### 4.1 컴포넌트 테스트

- **사용자 관점 테스트**: 내부 구현보다 사용자 상호작용에 초점
- **과도한 모킹 지양**: 실제 동작과 가까운 테스트 작성
- **접근성 고려**: `getByRole`, `getByLabelText` 등의 접근성 쿼리 우선 사용
- **컨텍스트 제공**: 컨텍스트에 의존하는 컴포넌트는 `wrapper` 옵션 사용

```tsx
// 좋은 예시
test('user can toggle theme', () => {
  render(
    <ThemeProvider initialTheme="light">
      <ThemeToggle />
    </ThemeProvider>
  );
  
  const toggle = screen.getByRole('switch', { name: /dark mode/i });
  expect(toggle).toHaveAttribute('aria-checked', 'false');
  
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-checked', 'true');
});
```

### 4.2 비동기 코드 테스트

- **waitFor** 사용: 비동기 상태 변경 대기
- **findBy** 쿼리: 요소가 나타날 때까지 기다림
- **MSW** 활용: API 요청 모킹

```tsx
test('loads and displays user data', async () => {
  render(<UserProfile userId="123" />);
  
  // 로딩 표시 확인
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // 데이터 로드 후 사용자 정보 표시 확인
  expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
});
```

### 4.3 모킹 전략

- **모듈 모킹**: `jest.mock()`을 사용해 외부 의존성 모킹
- **Spy**: `jest.spyOn()`으로 함수 호출 추적
- **모의 구현**: `jest.fn()`으로 간단한 함수 대체

```tsx
// Supabase 클라이언트 모킹 예시
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'user@example.com' } },
        error: null,
      }),
    },
  },
}));
```

## 5. 테스트 자동화 및 CI/CD 통합

### 5.1 CI 워크플로우

**GitHub Actions 구성**:

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Run unit and integration tests
        run: npm test -- --coverage
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        
      - name: Build
        run: npm run build
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### 5.2 테스트 보고서 및 분석

- **코드 커버리지**: Jest의 `--coverage` 플래그로 커버리지 보고서 생성
- **시각적 회귀 테스트**: Playwright의 스크린샷 기능 활용
- **성능 모니터링**: 테스트 실행 시간 추적

## 6. 특수 테스트 시나리오

### 6.1 인증 테스트

1. **Supabase Auth 모킹**: 테스트용 가짜 인증 응답 생성
2. **보호된 라우트 테스트**: 인증 상태에 따른 리다이렉션 검증
3. **세션 관리**: 쿠키 및 로컬 스토리지 모킹

```tsx
// Auth 컨텍스트 모킹 예시
jest.mock('@/lib/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'user@example.com' },
    isLoading: false,
    signIn: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  }),
}));
```

### 6.2 API 라우트 테스트 (Edge Runtime)

1. **요청/응답 모킹**: Next.js 요청 및 응답 객체 시뮬레이션
2. **헤더 및 쿠키 테스트**: 인증 헤더 및 쿠키 검증
3. **에러 처리**: 다양한 오류 시나리오 테스트

```typescript
// API 라우트 테스트 예시
import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/user/route';

describe('User API Route', () => {
  test('returns user data for authenticated request', async () => {
    const req = new NextRequest('http://localhost:3000/api/user', {
      headers: {
        'Authorization': 'Bearer test-token',
      },
    });
    
    const response = await GET(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('email');
  });
});
```

### 6.3 환경 변수 처리

1. **테스트용 환경 변수**: Jest 설정에서 테스트용 환경 변수 정의
2. **프로세스 환경 모킹**: `process.env` 객체 모킹
3. **조건부 테스트**: 환경에 따른 조건부 테스트 실행

```typescript
// 환경 변수 모킹 예시
beforeEach(() => {
  const originalEnv = process.env;
  
  jest.resetModules();
  process.env = { 
    ...originalEnv,
    NEXT_PUBLIC_FEATURE_FLAG: 'true',
  };
});

afterEach(() => {
  process.env = originalEnv;
});
```

## 7. 테스트 우선순위 및 커버리지 목표

### 7.1 우선순위

1. **핵심 비즈니스 로직**: 키워드 분석, 트렌드 처리 등 핵심 기능
2. **인증 및 권한**: 사용자 로그인, 권한 검사 등 보안 관련 기능
3. **데이터 변환**: API 응답 처리, 데이터 정규화 함수
4. **UI 컴포넌트**: 사용자 상호작용이 많은 핵심 컴포넌트
5. **에러 처리**: 에러 상태 및 복구 로직

### 7.2 커버리지 목표

- **전체 코드 커버리지**: 최소 70%
- **핵심 비즈니스 로직**: 90% 이상
- **UI 컴포넌트**: 80% 이상
- **유틸리티 함수**: 85% 이상

커버리지 목표는 지속적으로 검토하고 조정하며, 맹목적인 달성보다 중요 코드의 철저한 테스트를 우선시합니다.

## 8. 테스트 유지 관리

### 8.1 테스트 코드 리팩토링

- 새로운 기능이나 버그 수정과 함께 관련 테스트도 업데이트
- 중복 테스트 코드는 공통 테스트 유틸리티로 추출
- 테스트 데이터 팩토리 패턴 적용으로 테스트 설정 간소화

### 8.2 깨진 테스트 처리

1. **즉시 수정**: CI에서 실패한 테스트는 최우선적으로 수정
2. **임시 비활성화**: 수정이 복잡한 경우 `test.skip`으로 표시하고 이슈 등록
3. **테스트 개선**: 불안정한 테스트는 더 견고하게 개선

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다.

최종 업데이트: 2023-05-04 