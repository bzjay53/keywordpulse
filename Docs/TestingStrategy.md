# 테스트 전략 문서

이 문서는 KeywordPulse 프로젝트의 테스트 전략과 테스트 구현에 관한 지침을 제공합니다.

## 1. 테스트 접근 방식

KeywordPulse 프로젝트는 다음 테스트 접근 방식을 채택합니다:

1. **단위 테스트**: 개별 함수, 컴포넌트 및 모듈 테스트
2. **통합 테스트**: 여러 모듈 간 상호작용 테스트
3. **End-to-End 테스트**: 주요 사용자 시나리오 테스트
4. **성능 테스트**: 중요 기능의 성능 테스트

## 2. 테스트 기술 스택

### 2.1 JavaScript/TypeScript 테스트

- **Jest**: 기본 테스트 프레임워크
- **React Testing Library**: 리액트 컴포넌트 테스트
- **MSW (Mock Service Worker)**: API 모킹
- **Cypress**: End-to-End 테스트

### 2.2 Python 테스트

- **pytest**: 기본 테스트 프레임워크
- **unittest**: 표준 테스트 라이브러리
- **httpx**: 비동기 API 테스트
- **pytest-cov**: 코드 커버리지 측정

## 3. 테스트 구조

```
libwys/
├── __tests__/                  # JavaScript/TypeScript 테스트
│   ├── components/             # 컴포넌트 테스트
│   ├── hooks/                  # 훅 테스트
│   ├── pages/                  # 페이지 테스트
│   └── utils/                  # 유틸리티 테스트
├── tests/                      # Python 테스트
│   ├── unit/                   # 단위 테스트
│   ├── integration/            # 통합 테스트
│   └── e2e/                    # End-to-End 테스트
└── cypress/                    # Cypress E2E 테스트
    ├── e2e/                    # 테스트 스펙
    ├── fixtures/               # 테스트 데이터
    └── support/                # 헬퍼 및 커맨드
```

## 4. 테스트 유형별 가이드라인

### 4.1 단위 테스트

#### 4.1.1 JavaScript/TypeScript 단위 테스트

```typescript
// hooks/useKeywordAnalysis.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useKeywordAnalysis } from '@/hooks/useKeywordAnalysis';

describe('useKeywordAnalysis', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useKeywordAnalysis());
    expect(result.current.keywords).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add keyword correctly', () => {
    const { result } = renderHook(() => useKeywordAnalysis());
    act(() => {
      result.current.addKeyword('test keyword');
    });
    expect(result.current.keywords).toContain('test keyword');
  });
});
```

#### 4.1.2 Python 단위 테스트

```python
# tests/unit/test_rag_engine.py
import unittest
from lib.rag_engine import analyze_keywords

class TestRagEngine(unittest.TestCase):
    def test_analyze_keywords_with_valid_input(self):
        keywords = ["seo", "marketing", "content"]
        result = analyze_keywords(keywords)
        self.assertIsInstance(result, dict)
        self.assertIn("seo", result)
        self.assertIn("score", result["seo"])

    def test_analyze_keywords_with_empty_input(self):
        keywords = []
        result = analyze_keywords(keywords)
        self.assertEqual(result, {})
```

### 4.2 통합 테스트

#### 4.2.1 API 통합 테스트

```typescript
// __tests__/api/analyze.test.ts
import { createMocks } from 'node-mocks-http';
import analyzeHandler from '@/app/api/analyze/route';

describe('/api/analyze', () => {
  it('should analyze keywords and return results', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        keywords: ['seo', 'marketing']
      }
    });

    await analyzeHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('results');
  });

  it('should return 400 for invalid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {}
    });

    await analyzeHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});
```

#### 4.2.2 Python API 통합 테스트

```python
# tests/integration/test_api_integration.py
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_analyze_endpoint():
    response = client.post(
        "/api/analyze",
        json={"keywords": ["seo", "marketing"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) == 2
```

### 4.3 End-to-End 테스트

```javascript
// cypress/e2e/keyword_analysis.cy.js
describe('Keyword Analysis Flow', () => {
  it('should allow user to analyze keywords', () => {
    // 홈페이지 방문
    cy.visit('/');
    
    // 키워드 입력
    cy.get('[data-testid="keyword-input"]').type('seo marketing');
    
    // 분석 버튼 클릭
    cy.get('[data-testid="analyze-button"]').click();
    
    // 로딩 상태 확인
    cy.get('[data-testid="loading-indicator"]').should('be.visible');
    
    // 결과 확인
    cy.get('[data-testid="analysis-result"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="keyword-score"]').should('exist');
    
    // 결과 저장 확인
    cy.get('[data-testid="save-button"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

## 5. 테스트 커버리지

- 목표 테스트 커버리지: **80%** 이상
- 핵심 모듈(RAG 엔진, 인증 시스템)은 **90%** 이상
- 커버리지 측정: Jest와 pytest-cov 사용
- 커버리지 보고서는 CI/CD 파이프라인에서 자동 생성

## 6. 모킹 전략

### 6.1 외부 API 모킹

- **MSW(Mock Service Worker)** 사용
- API 응답 시나리오별 모킹
- 에러 케이스 시뮬레이션

### 6.2 인증 모킹

- Supabase 인증 모킹
- 다양한 사용자 역할 시뮬레이션

## 7. 테스트 환경

### 7.1 로컬 테스트 환경

```bash
# JavaScript/TypeScript 테스트 실행
npm test

# JavaScript/TypeScript 개별 테스트 실행
npm test -- -t "useKeywordAnalysis"

# 커버리지 보고서 생성
npm test -- --coverage

# Python 테스트 실행
pytest

# Python 커버리지 보고서 생성
pytest --cov=.
```

### 7.2 CI 테스트 환경

GitHub Actions에서 자동으로 실행:
- Pull Request 생성 시
- Main 브랜치 푸시 시
- 스케줄링된 정기 테스트(주 1회)

## 8. 테스트 데이터 관리

- 테스트 픽스처는 `__tests__/fixtures` 또는 `tests/fixtures` 디렉토리에 저장
- 민감한 테스트 데이터는 환경 변수 또는 CI/CD 시크릿으로 관리
- 대용량 테스트 데이터는 별도 저장소 또는 S3에 저장

## 9. 테스트 우선순위

1. **핵심 비즈니스 로직**: RAG 엔진, 키워드 분석
2. **사용자 인증 및 권한**: 로그인, 회원가입, 권한 검증
3. **데이터 흐름**: API 엔드포인트 및 데이터 처리
4. **UI 컴포넌트**: 주요 사용자 인터페이스 요소

## 10. 테스트 결과 모니터링

- GitHub Actions에서 테스트 결과 확인
- 테스트 실패 시 자동 알림(이메일, Slack)
- 주기적인 테스트 결과 분석 및 개선

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다. 