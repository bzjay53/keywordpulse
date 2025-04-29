# KeywordPulse 모니터링 시스템 설계

## 1. 개요

이 문서는 KeywordPulse 프로젝트의 모니터링 시스템 설계와 구현 가이드라인을 제공합니다. 모니터링 시스템은 실시간 오류 추적, 성능 모니터링, 사용자 행동 분석을 통합하여 서비스의 안정성과 품질을 보장합니다.

## 2. 모니터링 목표

- **오류 감지 및 추적**: 프로덕션 환경에서 발생하는 모든 오류를 실시간으로 감지하고 기록
- **성능 측정**: 애플리케이션의 성능 지표 모니터링 및 병목 현상 식별
- **사용자 행동 분석**: 사용자 상호작용 및 패턴 추적을 통한 UX 개선
- **시스템 건강 상태 확인**: 서비스 컴포넌트의 가용성 및 응답 시간 모니터링
- **알림 시스템**: 중요 이슈 발생 시 즉각적인 알림 제공

## 3. 모니터링 도구 및 인프라

### 3.1 핵심 도구

| 도구 | 목적 | 구성 상태 |
|-----|------|----------|
| **Sentry** | 에러 추적 및 모니터링 | 구현됨 |
| **Vercel Analytics** | 웹 성능 및 사용자 경험 지표 | 구현됨 |
| **Google Analytics 4** | 사용자 행동 및 전환 추적 | 구현 예정 |
| **Uptime Robot** | 서비스 가용성 모니터링 | 구현 예정 |
| **LogDNA** | 중앙화된 로그 관리 | 구현 예정 |

### 3.2 커스텀 모니터링 솔루션

- **내부 대시보드**: 핵심 성능 지표 및 경고 현황을 보여주는 관리자 대시보드
- **사용자 피드백 시스템**: 사용자 보고 문제를 수집하고 분류하는 시스템
- **자동 상태 페이지**: 서비스 상태를 자동으로 업데이트하는 공개 상태 페이지

## 4. 모니터링 구현 상세

### 4.1 Sentry 통합

Sentry는 애플리케이션의 오류를 실시간으로 추적하고 기록하는 핵심 도구입니다.

#### 4.1.1 구성 설정

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.3, // 성능 모니터링 샘플링 비율
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.05, // 세션 리플레이 샘플링 비율
  replaysOnErrorSampleRate: 0.5, // 오류 발생 시 리플레이 샘플링 비율
});
```

#### 4.1.2 주요 모니터링 포인트

Sentry를 활용한 주요 모니터링 포인트 목록:

- API 요청 실패 및 응답 오류
- 인증 및 권한 관련 오류
- 프론트엔드 렌더링 오류
- 비동기 작업 실패
- RAG 엔진 실행 오류
- 사용자 인터랙션 관련 오류

#### 4.1.3 커스텀 오류 컨텍스트

```typescript
// 커스텀 오류 컨텍스트 예시
try {
  // 위험한 작업 수행
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: 'KeywordAnalysis',
      operation: 'fetchKeywords',
      userId: user.id
    },
    extra: {
      keywords: selectedKeywords,
      requestParams: params
    }
  });
}
```

### 4.2 성능 모니터링

#### 4.2.1 웹 바이탈(Web Vitals) 측정

```typescript
// app/lib/analytics.ts
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

function sendToAnalytics({ name, delta, id }) {
  // 성능 데이터를 분석 서비스로 전송
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({
      name,
      delta,
      id,
      page: window.location.pathname
    }),
  });
}
```

#### 4.2.2 API 성능 측정

```typescript
// app/lib/apiMetrics.ts
export async function withMetrics<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    // 메트릭 기록
    logMetric(name, duration);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // 실패한 작업 메트릭 기록
    logMetric(`${name}_failed`, duration);
    
    throw error;
  }
}

function logMetric(name: string, duration: number) {
  // 로컬 스토리지에 저장 후 배치로 전송하거나 즉시 API 호출
  // ...
}
```

### 4.3 사용자 행동 분석

#### 4.3.1 이벤트 추적

주요 추적 이벤트:

- 페이지 조회 및 탐색
- 키워드 검색 및 분석 실행
- 사용자 계정 관련 액션 (로그인, 회원가입, 설정 변경)
- 콘텐츠 상호작용 (다운로드, 공유)
- 전환 이벤트 (프리미엄 구독, 기능 사용)

#### 4.3.2 구현 예시

```typescript
// app/lib/userEvents.ts
export enum EventType {
  PAGE_VIEW = 'page_view',
  SEARCH = 'search',
  ANALYZE = 'analyze',
  AUTH = 'auth',
  CONTENT = 'content',
  CONVERSION = 'conversion'
}

export function trackEvent(
  type: EventType,
  action: string,
  properties: Record<string, any> = {}
) {
  // Google Analytics 이벤트 발송
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: type,
      ...properties
    });
  }
  
  // 내부 분석 API에도 이벤트 기록
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      action,
      properties,
      timestamp: new Date().toISOString()
    })
  }).catch(err => console.error('Event tracking failed:', err));
}
```

### 4.4 알림 시스템

#### 4.4.1 알림 정책 구성

| 알림 유형 | 조건 | 매체 | 우선순위 |
|---------|-----|------|---------|
| 치명적 오류 | 서비스 중단 또는 핵심 기능 장애 | 이메일, SMS, Slack | 높음 |
| 성능 저하 | API 응답 시간 2초 초과 | Slack | 중간 |
| 사용량 급증 | 일반 트래픽 150% 초과 | Slack | 중간 |
| 보안 이슈 | 인증 실패 시도 급증 | 이메일, Slack | 높음 |
| 배치 작업 실패 | 정기 작업 실패 | 이메일 | 낮음 |

#### 4.4.2 Slack 알림 구현

```typescript
// app/lib/notifications.ts
export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export async function sendSlackAlert(
  level: AlertLevel,
  title: string,
  message: string,
  details?: Record<string, any>
) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  
  const emoji = {
    [AlertLevel.INFO]: ':information_source:',
    [AlertLevel.WARNING]: ':warning:',
    [AlertLevel.ERROR]: ':x:',
    [AlertLevel.CRITICAL]: ':rotating_light:'
  };
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `${emoji[level]} *${title}*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji[level]} *${title}*\n${message}`
          }
        },
        details && {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(details, null, 2) + '```'
          }
        }
      ].filter(Boolean)
    })
  });
}
```

## 5. 대시보드 및 시각화

### 5.1 관리자 대시보드 기능

관리자 대시보드는 다음 정보를 제공합니다:

- 실시간 오류 발생 횟수 및 상세 정보
- 주요 성능 지표 (TTFB, LCP, FID, CLS)
- API 엔드포인트별 응답 시간 및 사용량
- RAG 분석 요청 수 및 평균 처리 시간
- 활성 사용자 수 및 전환율
- 시스템 건강 상태 개요

### 5.2 데이터 시각화

```typescript
// app/admin/dashboard/page.tsx
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { fetchErrorMetrics, fetchPerformanceData } from '@/lib/metrics';

export default async function DashboardPage() {
  const errorData = await fetchErrorMetrics();
  const performanceData = await fetchPerformanceData();
  
  return (
    <div className="dashboard">
      <h1>시스템 모니터링 대시보드</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h2>오류 발생 추이</h2>
          <LineChart data={errorData.timeSeries} />
        </div>
        
        <div className="card">
          <h2>API 성능</h2>
          <BarChart data={performanceData.apiResponseTimes} />
        </div>
        
        {/* 추가 차트 및 위젯 */}
      </div>
    </div>
  );
}
```

## 6. 로깅 전략

### 6.1 로그 수준 및 필터링

| 로그 수준 | 용도 | 예시 |
|---------|-----|------|
| **ERROR** | 예기치 않은 오류 또는 예외 | API 요청 실패, 데이터베이스 연결 오류 |
| **WARN** | 잠재적 문제 또는 이상 신호 | 느린 쿼리 실행, 접근 권한 문제 |
| **INFO** | 주요 작업 또는 이벤트 기록 | 사용자 로그인, RAG 분석 완료 |
| **DEBUG** | 상세 진단 정보 | API 요청/응답 세부사항, 함수 호출 추적 |

### 6.2 구조화된 로깅 구현

```typescript
// app/lib/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  defaultMeta: { service: 'keywordpulse' },
  transports: [
    new transports.Console(),
    // 프로덕션 환경에서는 원격 로깅 서비스 추가
    process.env.NODE_ENV === 'production' && new transports.Http({
      host: 'logs.logdna.com',
      path: `/v1/log?apikey=${process.env.LOGDNA_KEY}`,
      ssl: true
    })
  ].filter(Boolean)
});

export default logger;

// 사용 예시
export function logWithContext(
  level: string,
  message: string,
  context: Record<string, any> = {}
) {
  logger.log({
    level,
    message,
    ...context,
    timestamp: new Date().toISOString()
  });
}
```

## 7. 모니터링 구현 로드맵

### 7.1 1단계: 기본 오류 모니터링 (완료)

- [x] Sentry 설정 및 통합
- [x] 기본 오류 추적 구현
- [x] 로깅 시스템 구축

### 7.2 2단계: 성능 모니터링 (진행 중)

- [ ] Web Vitals 추적 구현
- [ ] API 엔드포인트 성능 측정
- [ ] 성능 데이터 수집 API 개발

### 7.3 3단계: 사용자 행동 분석 (예정)

- [ ] Google Analytics 4 설정
- [ ] 이벤트 추적 레이어 구현
- [ ] 사용자 세션 분석 기능 개발

### 7.4 4단계: 알림 시스템 (예정)

- [ ] Slack 알림 웹훅 구성
- [ ] 이메일 알림 시스템 개발
- [ ] 알림 정책 및 임계값 설정

### 7.5 5단계: 대시보드 및 시각화 (예정)

- [ ] 관리자 대시보드 UI 개발
- [ ] 실시간 메트릭 표시 구현
- [ ] 데이터 시각화 컴포넌트 개발

## 8. 보안 고려사항

- **로그 보안**: 개인식별정보(PII) 및 민감한 데이터 필터링
- **접근 제어**: 모니터링 데이터에 대한 권한 기반 접근 관리
- **데이터 보존**: 규정 준수를 위한 로그 및 메트릭 데이터 보존 정책
- **암호화**: 전송 중 및 저장 중 모니터링 데이터 보호

## 9. 참고 자료

- [Sentry 공식 문서](https://docs.sentry.io/)
- [Web Vitals 측정 가이드](https://web.dev/vitals/)
- [GA4 이벤트 추적 가이드](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Vercel Analytics 통합 문서](https://vercel.com/docs/concepts/analytics)
- [LogDNA 사용 가이드](https://docs.logdna.com/) 