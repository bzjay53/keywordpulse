# KeywordPulse 의존성 관리 문서

이 문서는 KeywordPulse 프로젝트의 의존성 관리에 대한 정보와 가이드라인을 제공합니다.

## 1. 주요 의존성 개요

### 1.1 프론트엔드 의존성

| 패키지 | 버전 | 용도 | 라이선스 |
|-------|------|------|----------|
| next | 14.0.3 | React 프레임워크 | MIT |
| react | ^18 | UI 라이브러리 | MIT |
| react-dom | ^18 | DOM 렌더링 | MIT |
| typescript | ^5.0.0 | 타입 시스템 | Apache-2.0 |
| @supabase/supabase-js | ^2.38.4 | Supabase 클라이언트 | MIT |
| @supabase/auth-helpers-react | 0.4.2 | Supabase 인증 헬퍼 | MIT |
| @radix-ui/react-slot | ^1.2.0 | UI 컴포넌트 | MIT |
| class-variance-authority | ^0.7.1 | 컴포넌트 스타일링 | MIT |
| clsx | ^2.1.1 | 클래스 조건부 결합 | MIT |
| tailwind-merge | ^3.2.0 | Tailwind 클래스 병합 | MIT |
| react-markdown | ^9.0.0 | 마크다운 렌더링 | MIT |
| @sentry/nextjs | ^7.81.0 | 에러 모니터링 | MIT |

### 1.2 개발 의존성

| 패키지 | 버전 | 용도 | 라이선스 |
|-------|------|------|----------|
| eslint | ^8 | 코드 린팅 | MIT |
| eslint-config-next | 14.0.3 | Next.js 린팅 규칙 | MIT |
| jest | ^29.7.0 | 테스트 프레임워크 | MIT |
| jest-environment-jsdom | ^29.7.0 | Jest DOM 환경 | MIT |
| ts-jest | ^29.3.2 | TypeScript Jest 통합 | MIT |
| @types/jest | ^29.5.14 | Jest 타입 정의 | MIT |
| @types/node | ^20 | Node.js 타입 정의 | MIT |
| @types/react | ^18 | React 타입 정의 | MIT |
| @types/react-dom | ^18.3.6 | React DOM 타입 정의 | MIT |
| autoprefixer | ^10.0.1 | CSS 접두사 자동화 | MIT |
| postcss | ^8 | CSS 변환 도구 | MIT |
| tailwindcss | ^3.3.0 | CSS 프레임워크 | MIT |

### 1.3 빌드 및 최적화 도구

| 패키지 | 버전 | 용도 | 라이선스 |
|-------|------|------|----------|
| critters | ^0.0.23 | CSS 인라인화 | Apache-2.0 |

## 2. 의존성 관리 전략

### 2.1 버전 관리 정책

- **메이저 버전 업데이트**: 분기별로 검토하여 적용 여부 결정
- **마이너 버전 업데이트**: 월 1회 검토하여 호환성 테스트 후 적용
- **패치 버전 업데이트**: 보안 패치는 즉시 적용, 기타 패치는 스프린트 종료 시 적용

### 2.2 의존성 추가 프로세스

1. 새 라이브러리 추가 전 팀 내 논의 필수
2. 다음 사항 검토:
   - 라이선스 호환성
   - 번들 사이즈 영향
   - 유지보수 활성도
   - 보안 취약점 여부
3. 코드 리뷰를 통해 의존성 추가 승인

### 2.3 취약점 관리

- GitHub의 Dependabot 알림 활성화
- npm audit을 CI/CD 파이프라인에 통합
- 심각도 높은 취약점은 즉시 대응
- 매월 보안 취약점 정기 검토

## 3. 정적 내보내기 관련 의존성 고려사항

Next.js의 정적 내보내기(Static Export) 사용 시 호환되지 않는 라이브러리:

- 서버 사이드 전용 API에 의존하는 라이브러리
- 동적 라우팅이 필요한 인증 라이브러리 (별도 구성 필요)
- 서버 컴포넌트 전용 기능을 사용하는 라이브러리

이러한 제약사항을 고려하여 호환되는 대안:

| 제약이 있는 라이브러리 | 정적 내보내기 호환 대안 |
|----------------------|----------------------|
| next-auth | supabase-js 직접 사용 |
| prisma | 클라이언트 사이드 데이터 페칭 |
| mongoose | REST API 호출 |

## 4. 환경별 의존성 구성

### 4.1 개발 환경

```json
// 개발 환경 전용 의존성 설치
npm install --save-dev @types/node @types/react @types/react-dom eslint eslint-config-next
```

### 4.2 테스트 환경

```json
// 테스트 환경 의존성 설치
npm install --save-dev jest jest-environment-jsdom ts-jest @types/jest
```

### 4.3 프로덕션 환경

최적화된 빌드를 위한 설정:

```js
// next.config.js
module.exports = {
  // 프로덕션 빌드 최적화
  swcMinify: true,
  // 실험적 기능 설정
  experimental: {
    optimizeCss: true,
  }
}
```

## 5. 의존성 문제 해결

### 5.1 일반적인 문제 및 해결책

- **버전 충돌**: `npm ls <패키지명>`으로 중복 설치 확인
- **peer dependency 경고**: `npm install <peer-dependency>@<version>`로 해결
- **빌드 오류**: `npm cache clean --force` 후 `node_modules` 삭제 및 재설치

### 5.2 정적 내보내기 관련 문제

- **API 라우트 오류**: Edge Runtime 사용 또는 클라이언트 사이드 대체 구현
- **서버 컴포넌트 오류**: 클라이언트 컴포넌트로 변환 ('use client' 지시문 추가)
- **환경 변수 문제**: `NEXT_PUBLIC_` 접두사 사용 및 `next.config.js`에 기본값 설정

## 6. 미래 계획

- **번들 크기 최적화**: 불필요한 의존성 제거 및 코드 스플리팅 강화
- **ESM 지원 전환**: CommonJS에서 ESM으로 점진적 마이그레이션
- **React 19 준비**: 호환성 테스트 및 필요한 의존성 업데이트 계획 수립
- **WebAssembly 활용**: 성능 중심 기능의 WebAssembly 라이브러리 통합 검토

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다.

최종 업데이트: 2023-05-04 