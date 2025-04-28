# KeywordPulse 프로젝트 구조도

이 문서는 KeywordPulse 프로젝트의 아키텍처와 구성 요소에 대한 개요를 제공합니다.

## 1. 프로젝트 개요

KeywordPulse는 키워드 분석 및 트렌드 모니터링을 위한 Next.js 기반 웹 애플리케이션입니다. 이 프로젝트는 다음 주요 기술 스택을 사용합니다:

- **프론트엔드**: Next.js 13 (App Router), React, TypeScript, TailwindCSS
- **백엔드**: Next.js API Routes, FastAPI (서버리스 함수)
- **인증**: Supabase Authentication
- **데이터베이스**: Supabase PostgreSQL
- **배포**: Vercel
- **CI/CD**: GitHub Actions

## 2. 디렉토리 구조

```
libwys/
├── app/                   # Next.js 애플리케이션
│   ├── api/               # API 라우트
│   ├── components/        # React 컴포넌트
│   ├── lib/               # 유틸리티 및 서비스
│   ├── (routes)/          # 페이지 및 라우트
│   ├── hooks/             # 커스텀 훅
│   └── utils/             # 헬퍼 함수
├── components/            # 루트 컴포넌트 (Legacy)
├── hooks/                 # 루트 훅 (Legacy)
├── lib/                   # 루트 라이브러리 (Legacy)
├── api/                   # 서버리스 API 함수
├── tests/                 # 테스트 파일
├── Docs/                  # 프로젝트 문서
├── .github/               # GitHub 워크플로 설정
└── public/                # 정적 파일
```

## 3. 핵심 컴포넌트

### 3.1 프론트엔드

- **app/layout.tsx**: 루트 레이아웃
- **app/page.tsx**: 메인 페이지
- **app/components/**: UI 컴포넌트
  - **ActionButtons.tsx**: 액션 버튼
  - **AnalysisCard.tsx**: 분석 결과 카드
  - **KeywordTable.tsx**: 키워드 테이블
  - **LoginForm.tsx**: 로그인 폼
  - **ProfileCard.tsx**: 사용자 프로필 카드

### 3.2 백엔드

- **app/api/**: API 엔드포인트
  - **search/route.ts**: 키워드 검색 API
  - **analyze/route.ts**: 키워드 분석 API
  - **trend/route.ts**: 트렌드 데이터 API
  - **sync/route.ts**: 데이터 동기화 API
  - **notify/route.ts**: 알림 API

### 3.3 인증

- **app/lib/AuthContext.tsx**: 인증 컨텍스트 제공자
- **app/lib/supabaseClient.ts**: Supabase 클라이언트

### 3.4 유틸리티

- **app/lib/rag_engine.ts**: RAG(Retrieval-Augmented Generation) 엔진
- **app/lib/trends_api.ts**: 트렌드 데이터 API 통합
- **app/lib/logger.ts**: 로깅 시스템

## 4. 데이터 흐름

1. 사용자가 키워드를 입력합니다.
2. 프론트엔드에서 API 요청을 보냅니다.
3. API 라우트가 요청을 처리하고 RAG 엔진을 통해 분석합니다.
4. 결과가 사용자에게 표시됩니다.
5. 필요한 경우 데이터가 Supabase에 저장됩니다.

## 5. 확장성 및 모듈화

- 독립적인 컴포넌트 구조로 재사용성 증가
- API 엔드포인트 모듈화로 기능 확장 용이
- RAG 엔진의 분리로 키워드 분석 로직 독립성 유지
- 인증 시스템의 추상화로 다양한 인증 제공자 통합 가능

## 6. 기술적 부채 및 개선 사항

- 레거시 디렉토리 구조(루트 레벨의 components, hooks, lib)를 app/ 디렉토리로 통합
- 경로 참조 표준화(상대 경로 → 절대 경로)
- 컴포넌트 간 결합도 감소
- 테스트 커버리지 증가

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다. 