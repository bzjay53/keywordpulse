# KeywordPulse 프로젝트 구조도

## 목차
- [개요](#개요)
- [디렉토리 구조](#디렉토리-구조)
- [주요 구성 요소](#주요-구성-요소)
- [기술 스택](#기술-스택)
- [의존성 관계](#의존성-관계)
- [데이터 흐름](#데이터-흐름)
- [관련 문서](#관련-문서)

## 개요
KeywordPulse는 Next.js 14 기반의 웹 애플리케이션으로, 키워드 분석과 추적을 위한 솔루션을 제공합니다. 이 문서는 프로젝트의 전체적인 구조와 주요 컴포넌트들의 역할 및 상호 작용을 설명합니다.

## 디렉토리 구조

```
keywordpulse/
├── app/                     # 애플리케이션 핵심 코드
│   ├── api/                 # API 라우트
│   │   ├── metrics/         # 성능 측정 API
│   │   ├── track/           # 사용자 이벤트 추적 API
│   │   ├── search/          # 키워드 검색 API
│   │   ├── analyze/         # 키워드 분석 API
│   │   ├── notify/          # 알림 관련 API
│   │   └── ...
│   ├── auth/                # 인증 관련 컴포넌트
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── hooks/               # 커스텀 React 훅
│   ├── lib/                 # 유틸리티 및 핵심 라이브러리
│   │   ├── analytics.ts     # 분석 관련 유틸리티
│   │   ├── logger.ts        # 로깅 유틸리티
│   │   └── ...
│   ├── styles/              # 전역 스타일 및 테마
│   └── ...
├── public/                  # 정적 파일
├── Docs/                    # 프로젝트 문서
│   ├── Architecture.md
│   ├── BrowserSupportPolicy.md
│   ├── CICDPipeline.md
│   ├── CodeQualityGuidelines.md
│   ├── Dependencies.md
│   ├── DocumentMap.md
│   ├── ProjectStructure.md
│   ├── RAG_WBS.md
│   ├── TestingStrategy.md
│   └── ...
├── tests/                   # 테스트 코드
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example             # 환경 변수 예제
├── .eslintrc.js             # ESLint 설정
├── .gitignore               # Git 무시 파일 목록
├── jest.config.js           # Jest 설정
├── next.config.js           # Next.js 설정
├── package.json             # 패키지 정보 및 의존성
├── postcss.config.js        # PostCSS 설정
├── tailwind.config.js       # Tailwind CSS 설정
└── tsconfig.json            # TypeScript 설정
```

## 주요 구성 요소

### 프론트엔드
- **페이지/컴포넌트**: Next.js App Router를 사용한 모던 React 컴포넌트
- **상태 관리**: React Context API 및 커스텀 훅
- **스타일링**: Tailwind CSS와 CSS Modules
- **클라이언트-서버 통신**: React Query 및 fetch API

### 백엔드
- **API 라우트**: Next.js Edge & Serverless 함수
- **데이터베이스**: Supabase(PostgreSQL)
- **인증**: Supabase Auth
- **캐싱**: 지능형 캐싱 전략
- **분석**: 자체 분석 시스템 및 서드파티 통합

### 인프라
- **호스팅**: Vercel
- **CI/CD**: GitHub Actions + Vercel 통합
- **모니터링**: Sentry + 자체 로깅 시스템
- **보안**: 모던 웹 보안 프레임워크

## 기술 스택
- **언어**: TypeScript, JavaScript
- **프레임워크**: Next.js 14, React 18
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase
- **테스트**: Jest, React Testing Library
- **CI/CD**: GitHub Actions, Vercel 배포
- **모니터링**: Sentry, 자체 로깅 시스템
- **성능 측정**: Web Vitals API

## 의존성 관계
주요 컴포넌트들의 의존성 관계는 다음과 같습니다:

1. **UI 컴포넌트** → **커스텀 훅** → **API 요청 함수** → **백엔드 API**
2. **분석 시스템** → **로깅 시스템** → **메트릭 저장소**
3. **인증 시스템** → **사용자 권한 관리** → **보호된 리소스 접근**

## 데이터 흐름
KeywordPulse의 주요 데이터 흐름:

1. **키워드 검색 프로세스**:
   - 사용자 입력 → 검색 API → 검색 결과 처리 → UI 렌더링 → 사용자 행동 추적

2. **분석 프로세스**:
   - 키워드 입력 → 분석 API → 데이터 가공 → 시각화 → 추천 생성

3. **알림 프로세스**:
   - 트리거 이벤트 → 알림 생성 → 채널별 전송(텔레그램 등)

## 관련 문서
- [Architecture.md](./Architecture.md): 시스템 아키텍처 상세 설명
- [Dependencies.md](./Dependencies.md): 의존성 관리 가이드
- [API 문서](./libwys_KeywordPulse%20API.md): API 스펙 및 사용법
- [배포 가이드](./libwys_Keywordpulse_Vercel_Deployment.md): 배포 프로세스 설명 