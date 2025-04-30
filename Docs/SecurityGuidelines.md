# 보안 가이드라인

## 1. 개요

이 문서는 KeywordPulse 프로젝트의 보안 모범 사례, 지침 및 요구사항을 정의합니다. 개발자 및 운영 팀은 이러한 가이드라인을 따라 애플리케이션 및 데이터의 보안을 유지해야 합니다.

## 2. 인증 및 권한 부여

### 2.1 인증 시스템

KeywordPulse는 Supabase Authentication을 사용하여 사용자 인증을 처리합니다:

- **지원 인증 방법**:
  - 이메일/비밀번호 인증
  - 소셜 로그인 (Google, GitHub)
  - 매직 링크 (비밀번호 없는 로그인)

- **인증 흐름**:
  ```
  사용자 → 인증 요청 → Supabase Auth → JWT 발급 → 클라이언트에 JWT 저장 → API 요청 시 JWT 포함
  ```

- **세션 관리**:
  - JWT 토큰은 쿠키에 저장 (HttpOnly, SameSite=Strict, Secure)
  - 기본 세션 만료: 24시간
  - 자동 갱신 토큰을 통한 세션 연장

### 2.2 권한 부여

- **역할 기반 접근 제어 (RBAC)**:
  - 기본 사용자 (Default)
  - 프리미엄 사용자 (Premium)
  - 관리자 (Admin)

- **데이터베이스 권한**:
  - Supabase의 Row-Level Security (RLS) 정책을 사용하여 데이터 접근 제한
  - 사용자는 자신의 데이터만 접근 가능

```sql
-- RLS 정책 예시
CREATE POLICY "Users can only access their own data"
  ON public.user_data
  FOR ALL
  USING (auth.uid() = user_id);
```

### 2.3 비밀번호 정책

- **비밀번호 요구사항**:
  - 최소 8자 이상
  - 대소문자 혼합
  - 숫자 포함
  - 특수문자 포함
  - 일반적인 취약 비밀번호 사용 방지

- **비밀번호 저장**:
  - 모든 비밀번호는 Supabase에서 bcrypt 알고리즘으로 해시
  - 절대 평문 비밀번호 저장 금지

## 3. 데이터 보안

### 3.1 민감한 데이터 처리

- **민감한 데이터 분류**:
  - 높은 민감도: 인증 정보, API 키, 결제 정보
  - 중간 민감도: 개인 식별 정보(PII), 분석 결과
  - 낮은 민감도: 공개 키워드 데이터, 메타데이터

- **데이터 저장 및 전송**:
  - 모든 민감한 데이터는 저장 시 암호화
  - 전송 중 데이터는 항상 TLS/SSL 사용
  - API 키 및 비밀은 환경 변수로 관리

### 3.2 데이터 접근 로깅

- 중요 데이터에 대한 모든 접근 로깅
- 로그에 다음 정보 포함:
  - 접근 시간
  - 사용자 식별 정보
  - 수행한 작업
  - 접근한 데이터
  - IP 주소

### 3.3 데이터 백업 및 복구

- 일일 자동 백업 구성
- 백업 데이터 암호화
- 정기적인 복구 테스트 실시
- 백업 보관 정책: 30일

## 4. API 보안

### 4.1 API 엔드포인트 보호

- **인증 요구사항**:
  - 모든 비공개 API 엔드포인트는 인증 필요
  - JWT 토큰을 통한 API 인증 구현

- **속도 제한**:
  - 공개 API: 분당 30회 요청 제한
  - 인증된 사용자: 분당 100회
  - 프리미엄 사용자: 분당 300회

- **입력 검증**:
  - 모든 API 입력 데이터 검증
  - 유효하지 않은 입력 즉시 거부
  - 오류 응답은 최소한의 정보만 포함

### 4.2 API 보안 헤더

모든 API 응답에 다음 보안 헤더 적용:

```typescript
// API 라우트 헤더 예시
export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  // 보안 헤더 설정
  response.headers.set('Content-Security-Policy', "default-src 'self'");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

### 4.3 CORS 구성

- 신뢰할 수 있는 도메인만 허용
- 프로덕션 환경에서 와일드카드 오리진 금지
- OPTIONS 요청에 적절히 응답

```typescript
// CORS 구성 예시
export const config = {
  cors: {
    allowedOrigins: ['https://keywordpulse.com', 'https://staging.keywordpulse.vercel.app'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    allowCredentials: true,
  },
};
```

## 5. 프론트엔드 보안

### 5.1 XSS(Cross-Site Scripting) 방지

- **입력 데이터 검증 및 소독**:
  - 사용자 입력 데이터 검증 및 이스케이프
  - React의 자동 이스케이프 활용
  - 동적 HTML 생성 시 DOMPurify 사용

- **CSP(Content Security Policy)**:
  - 인라인 스크립트 제한
  - 신뢰할 수 있는 소스에서만 리소스 로드
  - `unsafe-eval` 및 `unsafe-inline` 사용 제한

```html
<!-- CSP 메타 태그 예시 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://analytics.keywordpulse.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://res.cloudinary.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.keywordpulse.com;">
```

### 5.2 CSRF(Cross-Site Request Forgery) 방지

- 상태 변경 작업에 CSRF 토큰 사용
- SameSite 쿠키 속성 설정
- 중요한 작업에 재인증 요구

### 5.3 민감한 정보 처리

- 브라우저 로컬 스토리지에 민감한 정보 저장 금지
- 클라이언트 측 로그에 민감한 정보 출력 금지
- 개발 도구 접근 시 민감한 정보 노출 방지

## 6. 인프라 보안

### 6.1 환경 변수 관리

- 환경 변수를 통한 민감한 정보 관리
- 각 환경(개발, 스테이징, 프로덕션)별 별도 변수 세트 유지
- 소스 코드에 하드코딩된 비밀 정보 금지

```typescript
// 좋은 예시
const apiKey = process.env.API_KEY;

// 나쁜 예시
const apiKey = "sk_live_1234567890abcdef";
```

### 6.2 의존성 보안

- 정기적인 의존성 취약점 스캔
- 자동화된 의존성 업데이트 (Dependabot)
- 새 의존성 추가 전 보안 검토

```bash
# 취약점 스캔 명령어
npm audit
npm audit fix

# 의존성 설치 시 취약점 확인
npm install --audit
```

### 6.3 배포 보안

- 배포 파이프라인에 보안 검사 통합
- 최소 권한 원칙에 따른 배포 권한 설정
- 배포 자격 증명의 정기적 교체

## 7. 로깅 및 모니터링

### 7.1 보안 로깅

- 인증/권한 이벤트 로깅
- 보안 관련 오류 및 경고 로깅
- 로그에 민감한 정보 포함 금지

```typescript
// 보안 로깅 예시
import { logger } from '@/lib/logger';

try {
  // 작업 수행
} catch (error) {
  logger.error('보안 작업 실패', {
    userId: user.id,
    action: 'password_reset',
    error: error.message, // 스택 트레이스 포함 금지
    timestamp: new Date().toISOString(),
  });
}
```

### 7.2 보안 모니터링

- Sentry를 활용한 보안 이벤트 모니터링
- 비정상적인 활동에 대한 알림 설정
- 주기적인 보안 로그 검토

### 7.3 보안 사고 대응

1. **사고 식별**: 모니터링 시스템을 통한 사고 감지
2. **격리**: 영향 받은 시스템 격리
3. **조사**: 근본 원인 분석
4. **해결**: 취약점 패치 및 보안 조치 구현
5. **복구**: 영향 받은 시스템 복원
6. **보고**: 사고 보고서 작성 및 이해관계자 알림
7. **개선**: 재발 방지를 위한 프로세스 개선

## 8. 규정 준수

### 8.1 데이터 프라이버시

- **GDPR 준수**:
  - 사용자 데이터 처리 동의 획득
  - 데이터 접근, 수정, 삭제 권리 보장
  - 데이터 처리 활동 기록

- **CCPA 준수**:
  - 개인정보 수집 내용 공개
  - 개인정보 판매 거부 옵션 제공
  - 개인정보 삭제 요청 처리

### 8.2 개인정보 보호정책

- 프라이버시 정책 및 이용약관 명시
- 쿠키 정책 및 사용자 추적 정보 제공
- 사용자 데이터 보존 및 삭제 정책 설명

## 9. 개발자 보안 가이드라인

### 9.1 안전한 코딩 관행

- OWASP Top 10 취약점 방지
- 코드 리뷰에 보안 검토 포함
- 정기적인 보안 교육 및 인식 제고

### 9.2 보안 테스트

- 주요 기능에 보안 단위 테스트 작성
- 정기적인 보안 취약점 스캔
- 중요 릴리스 전 침투 테스트 수행

```typescript
// 인증 기능 보안 테스트 예시
test('should reject invalid passwords', async () => {
  // 약한 비밀번호 시도
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: '12345',
    });
  
  expect(response.status).toBe(400);
  expect(response.body.error).toContain('password requirements');
});
```

### 9.3 보안 리뷰 체크리스트

개발자는 코드 커밋 전 다음 체크리스트를 검토해야 합니다:

- [ ] 입력 데이터 검증 및 소독
- [ ] 적절한 오류 처리 구현
- [ ] 민감한 정보 노출 방지
- [ ] 적절한 인증 및 권한 확인
- [ ] SQL 인젝션 및 XSS 방지
- [ ] 보안 헤더 사용
- [ ] 취약한 의존성 없음

## 10. 보안 업데이트 및 유지보수

### 10.1 보안 패치 관리

- 정기적인 보안 업데이트 일정 수립
- 중요 취약점에 대한 긴급 패치 프로세스
- 패치 테스트 및 롤백 계획

### 10.2 보안 평가

- 분기별 보안 리스크 평가
- 연간 보안 감사
- 정기적인 보안 정책 검토 및 업데이트

## 11. 보안 관련 자원

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js 보안 모범 사례](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase 보안 고려사항](https://supabase.com/docs/guides/auth/row-level-security)
- [GDPR 규정](https://gdpr.eu/)
- [CCPA 규정](https://oag.ca.gov/privacy/ccpa) 