# ✅ 자동화 테스트 전략 문서 (KeywordPulse)

이 문서는 KeywordPulse 프로젝트의 프론트엔드 및 백엔드 API에 대한 자동화 테스트 전략을 정의합니다.

---

## 📌 테스트 목적
- 주요 기능의 안정성 검증
- 기능 배포 전 회귀 테스트 자동화
- 사용자 경험 향상을 위한 예외 처리 확인
- CI/CD 파이프라인과의 연동을 통한 지속적인 품질 확보

---

## 🧪 테스트 구성

### 1. 테스트 도구
| 영역 | 도구 | 설명 |
|------|------|------|
| 프론트엔드 | Playwright / Cypress | 사용자 시나리오 기반 E2E 테스트 |
| 백엔드 API | pytest + httpx / requests | 서버리스 API 단위 및 통합 테스트 |
| CI 연동 | GitHub Actions / Vercel Checks | 푸시 시 자동 테스트 실행 |

---

## 🧩 테스트 범위 및 항목

### 1. 프론트엔드 (Next.js)

| 테스트 ID | 항목 | 설명 |
|-----------|------|------|
| FE-01 | 키워드 입력 → 결과 조회 | 실제 검색 흐름 시나리오 |
| FE-02 | 분석 텍스트 노출 | RAG 결과 텍스트 정상 출력 여부 |
| FE-03 | 스프레드시트 저장 버튼 클릭 | 동기화 후 알림 메시지 확인 |
| FE-04 | 텔레그램 알림 전송 버튼 클릭 | 메시지 전송 여부 확인 |
| FE-05 | 로그인/로그아웃 흐름 | Supabase Auth 연동 확인 |
| FE-06 | 예외 처리 UI | API 오류 시 피드백 메시지 출력 여부 |

### 2. 백엔드 API (FastAPI)

| 테스트 ID | 항목 | 설명 |
|-----------|------|------|
| BE-01 | /api/search 정상 응답 | 키워드 검색 → JSON 반환 확인 |
| BE-02 | /api/analyze 분석 텍스트 생성 | RAG 시스템 정상 작동 확인 |
| BE-03 | /api/sync → Google 시트 동기화 | 구글 API 호출 및 결과 검증 |
| BE-04 | /api/notify → 텔레그램 전송 | 성공 응답 및 messageId 확인 |
| BE-05 | 인증된 토큰 유효성 검증 | Supabase JWT 검증 성공/실패 확인 |
| BE-06 | 캐시 처리 여부 | 동일 요청 시 캐시 여부 확인 |

---

## 🧪 예시 코드

### pytest (API 단위 테스트)
```python
import requests

BASE_URL = "https://keywordpulse.vercel.app/api"

def test_search():
    res = requests.post(f"{BASE_URL}/search", json={"keyword": "AI"})
    assert res.status_code == 200
    assert "keywords" in res.json()

def test_notify():
    res = requests.post(f"{BASE_URL}/notify", json={"analysisText": "테스트입니다"})
    assert res.status_code == 200
```

### Playwright (E2E 테스트)
```ts
import { test, expect } from '@playwright/test';

test('키워드 검색 후 분석 결과 확인', async ({ page }) => {
  await page.goto('https://keywordpulse.vercel.app');
  await page.fill('#keyword-input', 'AI 마케팅');
  await page.keyboard.press('Enter');
  await expect(page.locator('#analysis-result')).toContainText('분석 결과');
});
```

---

## 🔁 CI 연동 전략 (GitHub Actions)

```yaml
name: Run Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest requests
      - name: Run API Tests
        run: pytest tests/
```

> 프론트엔드용 Playwright도 별도 워크플로우로 구성 가능 (Node.js 기반)

---

## ✅ 테스트 결과 리포트

| 항목 | 수단 |
|------|------|
| 콘솔 결과 | pytest 출력 or Playwright HTML 리포트 |
| CI 상태 | GitHub PR에 상태 표시 (✔️ / ❌) |
| 배포 차단 조건 | 테스트 실패 시 Vercel 배포 차단 설정 가능 |

---

## 📌 향후 계획
- 테스트 커버리지 측정 도구 도입 (Coverage.py, Istanbul)
- 테스트 데이터 시드 자동화 (Supabase row seed script)
- 에러 로그 모니터링 (Sentry 또는 Vercel Log 연동)

---

> 이 테스트 전략 문서는 KeywordPulse의 안정성과 품질을 확보하기 위한 프로덕션 기준 테스트 체계를 정의합니다.

