# 문서 맵

이 문서는 프로젝트 내 모든 문서의 관계와 참조 방법을 설명합니다.

## 문서 체계

```
docs/
├── 프로젝트 구조 문서
│   ├── Architecture.md - 프로젝트 구조 및 디렉토리 역할 설명
│   └── Dependencies.md - 모듈 간 의존성 관리 문서
├── 개발 가이드라인
│   ├── CodeQualityGuidelines.md - 코드 품질 유지를 위한 가이드라인
│   ├── SecurityGuidelines.md - 보안 관련 모범 사례
│   ├── PerformanceOptimization.md - 성능 최적화 가이드
│   └── DocumentationGuidelines.md - 문서화 방법 가이드
├── 프로세스 문서
│   ├── TestingStrategy.md - 테스트 전략 및 방법론
│   ├── CICDPipeline.md - CI/CD 파이프라인 설정 가이드
│   └── CollaborationGuide.md - 팀 협업 프로세스
└── 참조 문서
    ├── libwys_Keywordpulse Reference Doc.md - 주요 참조 문서
    ├── libwys_Keywordpulse Rag Doc.md - RAG 관련 문서
    ├── libwys_Keywordpulse Refactoring Doc.md - 리팩토링 가이드
    └── libwys_Keywordpulse Debugging Guide.md - 디버깅 가이드
```

## 문서 간 참조 관계

- **프로젝트 구조 이해**: Architecture.md → Dependencies.md
- **코드 개발 및 리팩토링**: CodeQualityGuidelines.md → Refactoring Doc.md → Debugging Guide.md
- **성능 및 보안 개선**: PerformanceOptimization.md → SecurityGuidelines.md
- **프로세스 적용**: TestingStrategy.md → CICDPipeline.md → CollaborationGuide.md

## 문서 업데이트 흐름

1. 코드 변경 시 관련 문서 식별
2. 영향 받는 문서 업데이트
3. 문서 간 참조 확인 및 수정
4. 팀 멤버에게 문서 변경 공유

## 주요 문서별 활용 방법

- **Architecture.md**: 새로운 기능 개발 시 먼저 참조하여 적절한 디렉토리 및 모듈 구조 이해
- **Dependencies.md**: 모듈 간 의존성 확인으로 영향도 분석 시 활용
- **Refactoring Doc.md**: 코드 개선 및 리팩토링 시 참조하여 일관된 접근 방식 유지
- **Debugging Guide.md**: 오류 발생 시 체계적인 디버깅 절차 제공 