# 🔄 KeywordPulse 사용자 피드백 시스템

## 개요

KeywordPulse 서비스의 지속적인 개선과 사용자 중심 개발을 위한 피드백 수집 및 관리 시스템 문서입니다. 이 문서는 피드백 수집부터 분석, 우선순위 결정, 구현 및 검증까지의 전체 프로세스를 설명합니다.

## 📝 구현 현황 (2023.06.12 업데이트)

### 완료된 항목
- ✅ 인앱 피드백 폼 컴포넌트 개발
- ✅ 피드백 모달 및 버튼 컴포넌트 개발 
- ✅ 피드백 데이터베이스 스키마 설계
- ✅ 피드백 저장 API 엔드포인트 구현
- ✅ 피드백 제출 훅(useFeedback) 개발
- ✅ 사용자 행동 분석 시스템 구현
- ✅ 분석 데이터 수집 및 저장 기능 구현

### 진행 중인 항목
- ⏳ 관리자 대시보드 개발 (15% 완료)
- ⏳ 피드백 분류 시스템 개발 (10% 완료)

### 예정된 항목
- 🔜 피드백 우선순위 결정 알고리즘 개발
- 🔜 사용자 여정 맵 작성
- 🔜 A/B 테스트 프레임워크 구현

## 목차

1. [피드백 수집 채널](#피드백-수집-채널)
2. [피드백 분류 및 관리](#피드백-분류-및-관리)
3. [피드백 분석 프레임워크](#피드백-분석-프레임워크)
4. [우선순위 결정 방법론](#우선순위-결정-방법론)
5. [피드백 기반 개선 프로세스](#피드백-기반-개선-프로세스)
6. [A/B 테스트 전략](#ab-테스트-전략)
7. [사용자 행동 분석](#사용자-행동-분석)
8. [관리자 대시보드](#관리자-대시보드)
9. [기술 스택](#기술-스택)

## 피드백 수집 채널

### 인앱 피드백 폼 (구현 완료)

KeywordPulse 앱 내에서 직접 피드백을 수집하는 주요 채널입니다.

**구현된 기능:**
- 실시간 사용 중 발생하는 문제점 또는 개선 사항 보고
- 각 주요 기능 페이지에 컨텍스트 기반 피드백 버튼 배치
- 간편한 별점 및 텍스트 입력 지원
- 다양한 위치 및 스타일 옵션 지원
- 다크 모드 지원

**기술 구현:**
```tsx
// FeedbackButton 컴포넌트 사용 예시
<FeedbackButton
  onSubmit={submitFeedback}
  position="bottom-right"
  variant="icon"
  contextData={{ page: 'dashboard' }}
/>
```

### 사용자 행동 로깅 (구현 중)

사용자의 행동 패턴을 분석하여 간접적인 피드백을 수집합니다.

**수집 데이터:**
- 페이지 방문 시간 및 체류 시간
- 기능 사용 빈도 및 순서
- 중단점/이탈 지점 분석
- 오류 발생 지점 및 빈도

**프라이버시 준수:**
- 모든 데이터는 익명화하여 수집
- 사용자에게 명확한 데이터 수집 고지 제공
- GDPR 및 개인정보보호법 준수

### 직접 인터뷰 및 설문조사 (계획 단계)

정기적인 사용자 인터뷰와 설문조사를 통해 질적 피드백을 수집합니다.

**주요 질문 영역:**
- 서비스 사용 만족도
- 가장 자주 사용하는 기능
- 가장 개선이 필요한 기능
- 추가되었으면 하는 기능

## 피드백 분류 및 관리

### 피드백 데이터베이스 스키마 (구현 완료)

```sql
-- 피드백 테이블 스키마
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  browser_info TEXT,
  platform TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'ignored')),
  tags TEXT[],
  assigned_to TEXT,
  response TEXT,
  response_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 피드백 분류 시스템 (설계 중)

피드백은 다음과 같은 카테고리로 분류됩니다:

1. **버그 리포트**: 기능 오작동, 오류 메시지 등
2. **기능 요청**: 새로운 기능 추가 제안
3. **UX 개선**: 사용성 및 인터페이스 개선 제안
4. **성능 관련**: 속도, 반응성 등 성능 관련 피드백
5. **기타**: 위 카테고리에 속하지 않는 기타 피드백

## 피드백 분석 프레임워크

### 텍스트 분석 (계획 단계)

자연어 처리(NLP)를 활용한 피드백 텍스트 분석:

- 감성 분석: 긍정/부정/중립 의견 분류
- 키워드 추출: 주요 이슈 및 관심사 파악
- 토픽 모델링: 전체 피드백에서 반복되는 주제 도출

### 정량적 분석 (계획 단계)

수치화된 데이터 기반 분석:

- 기능별 만족도 점수 추적
- 시간에 따른 피드백 트렌드 분석
- 사용자 그룹별 피드백 분포 분석

## 우선순위 결정 방법론

### 우선순위 결정 매트릭스 (설계 중)

각 피드백 항목은 다음 기준으로 우선순위가 결정됩니다:

| 기준 | 가중치 | 설명 |
|-----|------|-----|
| 영향도 | 40% | 해당 문제/개선이 영향을 미치는 사용자 비율 |
| 심각도 | 30% | 문제의 심각성 또는 개선의 잠재적 가치 |
| 구현 난이도 | 20% | 구현에 필요한 시간 및 리소스 |
| 전략적 부합성 | 10% | 제품 로드맵과의 부합도 |

### 피드백 투표 시스템 (계획 단계)

사용자가 직접 중요하다고 생각하는 기능/개선사항에 투표할 수 있는 시스템:

- 특정 피드백 항목에 "Me too" 또는 "+1" 기능 제공
- 투표 결과를 우선순위 결정에 반영
- 인기 요청에 대한 상태 업데이트 공유

## 피드백 기반 개선 프로세스

### 개선 사이클

1. **계획**: 우선순위가 결정된 항목에 대한 개발 계획 수립
2. **설계**: UX/UI 설계 및 기술적 설계
3. **구현**: 코드 개발 및 리뷰
4. **테스트**: A/B 테스트 및 품질 검증
5. **배포**: 변경사항 적용
6. **모니터링**: 개선 효과 측정 및 추가 피드백 수집

### 피드백 루프 닫기

사용자 피드백에 대한 응답 및 조치 결과 공유:

- 피드백 제출자에게 상태 업데이트 알림
- 주요 변경사항에 대한 "What's New" 섹션 운영
- 릴리스 노트에 피드백 기반 개선사항 명시

## A/B 테스트 전략

### 테스트 프레임워크 (계획 단계)

주요 변경사항에 대한 A/B 테스트 프레임워크:

- 테스트 그룹 구성: 통제군(A)과 실험군(B)
- 핵심 지표 설정: 전환율, 체류 시간, 작업 완료율 등
- 통계적 유의성 검증 방법
- 테스트 기간 및 샘플 크기 결정

### 구현 방법

```javascript
// A/B 테스트 설정 예시
const abTestConfig = {
  testId: 'new-keyword-analysis-ui',
  variants: {
    'control': { weight: 0.5 },
    'experiment': { weight: 0.5 }
  },
  audience: {
    userType: ['free', 'premium'],
    minAppVersion: '1.5.0'
  },
  metrics: {
    primary: 'completion_rate',
    secondary: ['time_on_task', 'satisfaction_score']
  }
};
```

## 사용자 행동 분석

### 주요 분석 지표 (구현 중)

- **활성 사용자 수**: DAU, WAU, MAU
- **세션 정보**: 평균 세션 길이, 세션당 작업 수
- **전환율**: 주요 작업 완료 비율
- **이탈률**: 중간에 작업을 포기하는 비율
- **기능 사용 빈도**: 각 기능별 사용 빈도 및 패턴

### 히트맵 및 사용자 여정 분석 (계획 단계)

- 페이지 내 클릭/터치 히트맵 생성
- 사용자 여정 흐름 시각화
- 페이지 간 이동 패턴 분석

## 관리자 대시보드 (개발 시작)

### 대시보드 기능

- 실시간 피드백 모니터링
- 피드백 트렌드 및 분포 시각화
- 우선순위별 피드백 목록 관리
- 팀별 작업 할당 및 추적
- A/B 테스트 결과 보고

### UI 프로토타입

관리자 대시보드는 다음 섹션으로 구성됩니다:

- **개요**: 주요 지표 및 트렌드 요약
- **피드백 목록**: 모든 피드백 항목 검색 및 필터링
- **분석**: 피드백 데이터 심층 분석 및 시각화
- **작업**: 개발 작업 추적 및 관리
- **설정**: 피드백 시스템 설정 관리

## 기술 스택

### 프론트엔드 (구현 완료)

- **피드백 UI**: React 컴포넌트 (FeedbackForm, FeedbackModal, FeedbackButton, StarRating)
- **상태 관리**: React 훅(useFeedback)
- **스타일링**: CSS(feedback.css, 다크 모드 지원)

### 백엔드 (구현 완료)

- **데이터 저장**: Supabase(feedback 테이블)
- **API**: Next.js API 라우트(/api/feedback)
- **알림**: Telegram 알림 통합(중요 피드백)

### 모니터링 (구현 중)

- **사용자 행동 추적**: 맞춤형 이벤트 로깅
- **오류 모니터링**: Sentry 통합
- **성능 모니터링**: 커스텀 로깅

---

## 다음 단계 및 일정

### 1. 사용자 행동 분석 시스템 완료 (6월 13일까지)
- 이벤트 추적 로직 구현
- 사용자 세션 분석 도구 통합
- 히트맵 데이터 수집 시작

### 2. 관리자 대시보드 개발 (6월 15일까지)
- 피드백 목록 페이지 구현
- 필터링 및 정렬 기능 개발
- 간단한 분석 차트 구현

### 3. 피드백 분류 시스템 구현 (6월 18일까지)
- 자동 분류 알고리즘 개발
- 태그 시스템 구현
- 우선순위 자동 결정 로직 구현

### 4. A/B 테스트 프레임워크 구축 (6월 20일까지)
- 테스트 설정 UI 개발
- 결과 분석 도구 구현
- 첫 번째 A/B 테스트 시작

---

## 참조 문서

- [UX 연구 방법론](docs/ux-research-methodology.md)
- [데이터 프라이버시 정책](docs/data-privacy-policy.md)
- [A/B 테스트 가이드라인](docs/ab-testing-guidelines.md)
- [사용자 세그먼트 정의](docs/user-segments.md)

## 새로 구현된 분석 시스템 기능

### 사용자 행동 추적 모듈 (analytics.ts)
사용자의 행동을 추적하고 수집하기 위한 핵심 모듈로, 다음 이벤트 유형을 지원합니다:
- 페이지 조회(`PAGE_VIEW`)
- 기능 사용(`FEATURE_USAGE`)
- 버튼 클릭(`BUTTON_CLICK`)
- 폼 제출(`FORM_SUBMIT`)
- 검색(`SEARCH`)
- 오류 발생(`ERROR`)
- 작업 시간(`TIMING`)
- 피드백(`FEEDBACK`)

```typescript
// 간단한 사용 예시
import analytics from '@/lib/analytics';

// 페이지 조회 이벤트 기록
analytics.logPageView();

// 버튼 클릭 이벤트 기록
analytics.logButtonClick('search_button', 'search', { query: 'keyword' });

// 기능 사용 이벤트 기록
analytics.logFeatureUsage('keyword_analysis', 'start_analysis');

// 작업 시간 측정
analytics.measureTiming('api', 'search_request', async () => {
  // API 호출 또는 기타 비동기 작업
  return await fetchSearchResults(query);
});
```

### 분석 React 훅 (useAnalytics.ts)
React 컴포넌트에서 쉽게 사용할 수 있는 훅 기능으로, 다음 기능을 제공합니다:
- 자동 페이지 조회 추적
- 클릭 이벤트 캡처
- 기능 사용 이벤트 캡처
- 검색 이벤트 캡처
- 작업 시간 측정
- 에러 이벤트 캡처
- 피드백 이벤트 캡처

```typescript
// React 컴포넌트에서 사용 예시
import { useAnalytics } from '@/hooks/useAnalytics';

function SearchComponent() {
  const { trackSearch, trackClick, measureTask } = useAnalytics();
  
  const handleSearch = async (query) => {
    trackSearch(query);
    
    // 검색 작업 시간 측정
    const results = await measureTask(
      'search', 
      'execute_search', 
      () => performSearch(query)
    );
    
    setResults(results);
  };
  
  return (
    <button onClick={() => trackClick('search_button')}>
      검색
    </button>
  );
}
```

### 데이터베이스 설계
사용자 행동 데이터는 Supabase의 `user_events` 테이블에 저장되며, 구조는 다음과 같습니다:

```sql
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  category TEXT,
  action TEXT,
  label TEXT,
  value NUMERIC,
  path TEXT,
  referrer TEXT,
  duration NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 통계 분석 뷰
데이터 분석을 위한 데이터베이스 뷰를 설계하여 다양한 인사이트를 추출할 수 있습니다:
- `daily_page_views` - 일별 페이지 방문 통계
- `session_page_duration` - 세션별 페이지 체류 시간
- `feature_usage_stats` - 기능 사용 빈도 및 통계

### 피드백 시스템과의 통합
사용자 피드백 시스템과 분석 시스템을 통합하여 다음과 같은 이벤트를 추적합니다:
- 피드백 버튼 클릭
- 피드백 폼 열기/닫기
- 별점 선택
- 텍스트 입력 시작
- 피드백 제출 성공/실패 