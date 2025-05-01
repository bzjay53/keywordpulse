# KeywordPulse 문서 지도

## 개요

이 문서는 KeywordPulse 프로젝트의 모든 문서를 체계적으로 정리한 지도입니다. 각 문서의 목적과 핵심 내용을 간략히 설명하고, 관련 문서 간의 연결을 안내합니다.

## 문서 구조

```
Docs/
├── 프로젝트 개요/
│   ├── ProjectStructure.md    # 프로젝트 구조 문서
│   ├── Architecture.md        # 아키텍처 문서
│   └── RAG-System.md          # RAG 시스템 문서
├── 개발 가이드/
│   ├── CodeQualityGuidelines.md  # 코드 품질 가이드라인
│   ├── Dependencies.md        # 의존성 관리 문서
│   ├── TestingStrategy.md     # 테스트 전략 문서
│   └── SecurityGuidelines.md  # 보안 가이드라인 문서
├── 운영 문서/
│   ├── CICDPipeline.md        # CI/CD 파이프라인 문서
│   ├── PerformanceOptimization.md # 성능 최적화 가이드
│   └── TeamCollaboration.md   # 팀 협업 가이드
└── 참조 문서/
    ├── APIReference.md        # API 참조 문서
    ├── TelegramIntegration.md # 텔레그램 통합 문서
    └── SupabaseSetup.md       # Supabase 설정 문서
```

## 문서 목록

### 프로젝트 개요

| 문서 | 설명 | 관련 문서 |
|------|-----|----------|
| [ProjectStructure.md](./ProjectStructure.md) | 프로젝트의 디렉토리 구조, 파일 구성, 모듈 관계 설명 | Architecture.md, Dependencies.md |
| [Architecture.md](./Architecture.md) | 시스템 아키텍처, 컴포넌트 및 서비스 간의 상호작용 설명 | RAG-System.md, CICDPipeline.md |
| [RAG-System.md](./RAG-System.md) | RAG(Retrieval-Augmented Generation) 시스템 구조 및 작동 방식 | PerformanceOptimization.md, APIReference.md |

### 개발 가이드

| 문서 | 설명 | 관련 문서 |
|------|-----|----------|
| [CodeQualityGuidelines.md](./CodeQualityGuidelines.md) | 코드 스타일, 포맷팅, 린팅 규칙 및 모범 사례 | TestingStrategy.md, CICDPipeline.md |
| [Dependencies.md](./Dependencies.md) | 의존성 관리 정책, 주요 패키지 목록, 업데이트 절차 | ProjectStructure.md, SecurityGuidelines.md |
| [TestingStrategy.md](./TestingStrategy.md) | 테스트 종류, 테스트 작성 방법, 테스트 실행 환경 | CodeQualityGuidelines.md, CICDPipeline.md |
| [SecurityGuidelines.md](./SecurityGuidelines.md) | 보안 모범 사례, 취약점 방지, 인증 및 권한 관리 | Dependencies.md, SupabaseSetup.md |

### 운영 문서

| 문서 | 설명 | 관련 문서 |
|------|-----|----------|
| [CICDPipeline.md](./CICDPipeline.md) | CI/CD 파이프라인 구성, 배포 프로세스, 자동화 워크플로우 | TestingStrategy.md, TeamCollaboration.md |
| [PerformanceOptimization.md](./PerformanceOptimization.md) | 성능 최적화 전략, 측정 방법, 개선 사례 | RAG-System.md, APIReference.md |
| [TeamCollaboration.md](./TeamCollaboration.md) | 협업 프로세스, 코드 리뷰, 이슈 관리, 의사소통 가이드 | CICDPipeline.md, CodeQualityGuidelines.md |

### 참조 문서

| 문서 | 설명 | 관련 문서 |
|------|-----|----------|
| [APIReference.md](./APIReference.md) | 내부 및 외부 API 엔드포인트, 요청/응답 형식, 사용 예제 | RAG-System.md, SupabaseSetup.md |
| [TelegramIntegration.md](./TelegramIntegration.md) | 텔레그램 봇 설정, 알림 시스템, 명령어 사용법 | APIReference.md |
| [SupabaseSetup.md](./SupabaseSetup.md) | Supabase 설정, 스키마 구성, 인증 및 스토리지 사용법 | SecurityGuidelines.md, APIReference.md |

## 문서 간 주요 관계

### 기능 중심 관계

- **키워드 분석 기능**: RAG-System.md → APIReference.md → PerformanceOptimization.md
- **텔레그램 알림 기능**: TelegramIntegration.md → APIReference.md → SecurityGuidelines.md
- **사용자 인증 기능**: SupabaseSetup.md → SecurityGuidelines.md → APIReference.md

### 개발 프로세스 관계

- **개발 시작**: ProjectStructure.md → CodeQualityGuidelines.md → TestingStrategy.md
- **지속적 통합**: TestingStrategy.md → CICDPipeline.md → PerformanceOptimization.md
- **배포 프로세스**: CICDPipeline.md → SecurityGuidelines.md → TeamCollaboration.md

## 문서 업데이트 정책

모든 문서는 다음과 같은 상황에서 업데이트됩니다:

1. **기능 변경**: 관련 기능이 추가, 수정 또는 제거될 때
2. **구조 변경**: 프로젝트 구조, 아키텍처 또는 의존성이 변경될 때
3. **프로세스 변경**: 개발, 테스트 또는 배포 프로세스가 변경될 때
4. **정기 검토**: 분기별 문서 정확성 및 최신성 검토

## 독자별 추천 읽기 순서

### 신규 개발자

1. ProjectStructure.md
2. CodeQualityGuidelines.md
3. Dependencies.md
4. TeamCollaboration.md
5. TestingStrategy.md

### 백엔드 개발자

1. Architecture.md
2. RAG-System.md
3. APIReference.md
4. SupabaseSetup.md
5. SecurityGuidelines.md

### 프론트엔드 개발자

1. ProjectStructure.md
2. APIReference.md
3. PerformanceOptimization.md
4. CodeQualityGuidelines.md
5. TelegramIntegration.md

### DevOps 담당자

1. CICDPipeline.md
2. Architecture.md
3. SecurityGuidelines.md
4. PerformanceOptimization.md
5. Dependencies.md

## 문서 기여 가이드

KeywordPulse 문서에 기여하려면 다음 지침을 따라주세요:

1. 문서는 마크다운(.md) 형식으로 작성합니다.
2. 새 문서를 추가할 경우 이 문서 지도를 업데이트합니다.
3. 문서 상단에 마지막 업데이트 날짜와 작성자를 기록합니다.
4. 특정 코드나 구성에 대한 예제를 포함할 때는 실제 동작하는 예제를 사용합니다.
5. 관련 문서를 명확히 링크합니다.

## 변경 이력

| 날짜 | 버전 | 설명 | 작성자 |
|------|------|------|--------|
| 2025-05-01 | 0.1 | 초기 문서 지도 작성 | 개발팀 |
| 2025-05-15 | 0.2 | 참조 문서 섹션 추가 | 개발팀 |