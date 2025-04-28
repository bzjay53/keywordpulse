# KeywordPulse 보안 가이드라인

이 문서는 KeywordPulse 프로젝트의 보안 모범 사례와 가이드라인을 제공합니다.

## 1. 인증 및 권한 관리

### 1.1 Supabase 인증

KeywordPulse는 Supabase Authentication을 사용하여 사용자 인증을 관리합니다. 주요 보안 조치:

- 안전한 패스워드 정책 시행 (최소 8자, 영문/숫자/특수문자 조합)
- 이메일 인증 필수
- 비밀번호 재설정 시 안전한 토큰 사용
- OAuth 공급자 통합 시 적절한 스코프 제한

```typescript
// app/lib/supabaseClient.ts에서 인증 설정
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 1.2 세션 관리

- 모든 세션은 자동 토큰 갱신 설정 (autoRefreshToken)
- 세션 데이터는 클라이언트에 안전하게 저장
- 토큰 만료 시간 적절히 설정 (기본 1시간)
- 정적 내보내기 호환을 위한 안전한 세션 처리

### 1.3 권한 체계

- 역할 기반 접근 제어 (RBAC) 구현:
  - 관리자(admin): 시스템 전체 접근
  - 사용자(user): 자신의 데이터만 접근
  - 비회원: 제한된 공개 데이터만 접근
- DB 레벨의 RLS(Row Level Security) 정책 적용

```sql
-- Supabase 테이블 RLS 정책 예시
CREATE POLICY "사용자는 자신의 데이터만 볼 수 있음"
  ON "public"."user_data"
  FOR SELECT
  USING (auth.uid() = user_id);
```

## 2. 데이터 보안

### 2.1 민감 데이터 처리

- 개인 식별 정보(PII)는 필요한 최소한으로 수집
- 사용자 비밀번호는 절대 평문으로 저장하지 않음
- API 키와 같은 민감 정보는 환경 변수로 관리
- 클라이언트에 노출되는 환경 변수는 `NEXT_PUBLIC_` 접두사 사용

### 2.2 데이터 암호화

- 전송 중 데이터는 항상 HTTPS로 보호
- 중요 데이터는 저장 전 암호화
- Supabase의 내장 암호화 기능 활용

### 2.3 환경 변수 관리

- 로컬 개발: `.env.local` 파일 (git에서 제외)
- 프로덕션: Vercel 환경 변수 안전하게 설정
- 기본값 관리: `next.config.js`에 안전한 기본값 설정

```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key',
  }
}
```

## 3. API 보안

### 3.1 API 요청 검증

- 모든 API 입력은 적절한 검증 수행
- 타입스크립트 타입과 런타임 검증 모두 구현
- 입력 길이 및 형식 제한 적용

```typescript
// API 요청 검증 예시
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(3).max(100),
  filters: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = searchSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: '잘못된 요청 형식' }), {
        status: 400
      });
    }
    
    // 검증된 데이터로 처리 진행
    const { query, filters } = result.data;
    // ...
  } catch (error) {
    return new Response(JSON.stringify({ error: '요청 처리 중 오류 발생' }), {
      status: 500
    });
  }
}
```

### 3.2 CORS 관리

- 필요한 출처만 허용하도록 CORS 정책 설정
- 리소스 공유 헤더 적절히 구성

```typescript
// API 라우트에서 CORS 관리
const allowedOrigins = [
  'https://keywordpulse.com',
  'https://www.keywordpulse.com'
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  
  // 허용된 출처인지 확인
  if (allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }
  
  return NextResponse.next();
}
```

### 3.3 속도 제한

- 공개 API에 속도 제한 적용
- IP 기반 및 API 키 기반 제한 구현
- 인증된 사용자에게 더 높은 한도 제공

```typescript
// 속도 제한 구현 예시
const rateLimit = {
  anonymous: 10, // 시간당 요청 수
  user: 100,     // 시간당 요청 수
  windowMs: 60 * 60 * 1000 // 1시간
};

const requestCounts = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const isAuthenticated = !!request.cookies.get('session');
  const limit = isAuthenticated ? rateLimit.user : rateLimit.anonymous;
  
  const currentCount = requestCounts.get(ip) || 0;
  
  if (currentCount >= limit) {
    return new Response(JSON.stringify({ error: '너무 많은 요청' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '3600'
      }
    });
  }
  
  requestCounts.set(ip, currentCount + 1);
  
  // 윈도우 리셋 타이머 설정
  setTimeout(() => {
    requestCounts.set(ip, 0);
  }, rateLimit.windowMs);
  
  return NextResponse.next();
}
```

## 4. 클라이언트 측 보안

### 4.1 XSS 방지

- React의 기본 이스케이프 활용
- 사용자 입력 데이터 표시 시 주의
- 안전한 컨텐츠만 dangerouslySetInnerHTML 사용

```tsx
// 안전하게 HTML 컨텐츠 렌더링
import DOMPurify from 'dompurify';

function SafeHTML({ html }) {
  return (
    <div dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(html)
    }} />
  );
}
```

### 4.2 CSRF 보호

- 상태 변경 요청에 CSRF 토큰 사용
- Supabase 인증 토큰 활용
- SameSite 쿠키 정책 적용

### 4.3 보안 헤더

Vercel 구성에 다음 보안 헤더 추가:

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://analytics.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.example.com; connect-src 'self' https://*.supabase.co;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        }
      ]
    }
  ]
}
```

## 5. 의존성 관리

### 5.1 취약점 스캔

- npm audit 정기적 실행
- GitHub Dependabot 알림 활성화
- CI/CD 파이프라인에 취약점 스캔 통합

### 5.2 의존성 업데이트 전략

- 보안 패치는 최우선으로 적용
- 메이저 버전 업그레이드 전 테스트 필수
- 의존성 최소화 (불필요한 패키지 제거)

### 5.3 신뢰할 수 있는 패키지

- 평판이 좋은 라이브러리 사용
- 의존성 트리 정기적 검토
- 라이센스 호환성 확인

## 6. 인프라 보안

### 6.1 Vercel 배포 보안

- 환경별 분리된 프로젝트와 변수 사용
- 프로덕션 브랜치 보호 설정
- 배포 권한 제한

### 6.2 Supabase 보안

- 데이터베이스 백업 정기적 수행
- 공개 접근은 최소 권한으로 제한
- API 키 안전하게 관리

### 6.3 모니터링 및 로깅

- Sentry 설정으로 오류 및 보안 이슈 모니터링
- 중요 보안 이벤트 로깅
- 비정상 활동 감지 및 알림

```typescript
// Sentry 구성 예시
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
});
```

## 7. 보안 인시던트 대응

### 7.1 대응 절차

1. **식별**: 보안 이슈 감지 및 기록
2. **격리**: 영향받는 시스템 분리
3. **완화**: 즉각적인 완화 조치 적용
4. **복구**: 시스템 정상 상태로 복원
5. **학습**: 사후 분석 및 개선사항 도출

### 7.2 연락 체계

- 보안 담당자 지정
- 에스컬레이션 경로 문서화
- 필요 시 사용자에게 투명한 소통

## 8. 개인정보 보호

### 8.1 데이터 수집 및 동의

- 명시적 사용자 동의 획득
- 개인정보 처리방침 접근성 확보
- 최소한의 필요 데이터만 수집

### 8.2 데이터 보존 및 삭제

- 목적에 필요한 기간만 데이터 보존
- 사용자 요청 시 데이터 삭제 기능 제공
- 장기 미사용 계정 처리 정책 수립

```typescript
// 사용자 데이터 삭제 API 예시
export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const userId = await authenticateRequest(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: '인증 필요' }), { status: 401 });
    }
    
    // 데이터 삭제 처리
    await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId);
      
    // 계정 삭제
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: '삭제 처리 실패' }), { status: 500 });
  }
}
```

## 9. 보안 테스트

### 9.1 정적 분석

- ESLint 보안 규칙 적용
- TypeScript 엄격 모드 활성화
- GitHub CodeQL 분석 활용

### 9.2 보안 검토

- 코드 리뷰 시 보안 관점 고려
- 정기적인 보안 취약점 평가
- 외부 보안 전문가 검토 (가능한 경우)

## 10. 교육 및 인식

### 10.1 개발자 교육

- 보안 모범 사례 공유
- 보안 관련 교육 자료 제공
- 코드 리뷰에 보안 체크리스트 포함

### 10.2 사용자 교육

- 안전한 비밀번호 설정 안내
- 의심스러운 활동 보고 방법 제공
- 개인정보 보호에 관한 명확한 정보 제공

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다.

최종 업데이트: 2023-05-04 