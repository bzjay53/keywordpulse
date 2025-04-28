# Keywordpulse 참조 문서

이 문서는 Keywordpulse 프로젝트의 주요 참조 정보를 제공합니다. 이 문서는 프로젝트의 다양한 측면에 대한 참조 지점 역할을 합니다.

## 문서 체계

프로젝트의 문서는 다음과 같이 구성되어 있습니다:

- **[문서 맵](./DocumentMap.md)**: 모든 문서의 관계와 참조 방법 설명
- **프로젝트 구조 문서**: 프로젝트의 구조와 의존성 관리
- **개발 가이드라인**: 코드 품질, 보안, 성능, 문서화에 대한 가이드라인
- **프로세스 문서**: 테스트, CI/CD, 협업에 대한 가이드라인
- **참조 문서**: 리팩토링, 디버깅, RAG 등에 대한 참조 문서

## 코드 구조 참조

- **디렉토리 구조**: [Architecture.md](./Architecture.md) 문서에서 상세히 설명
- **모듈 의존성**: [Dependencies.md](./Dependencies.md) 문서에서 확인 가능
- **API 정의**: `api-spec.yaml` 파일에 정의됨

## 개발 참조

- **코드 품질 가이드**: [CodeQualityGuidelines.md](./CodeQualityGuidelines.md)
- **성능 최적화**: [PerformanceOptimization.md](./PerformanceOptimization.md)
- **보안 지침**: [SecurityGuidelines.md](./SecurityGuidelines.md)

## 프로세스 참조

- **테스트 방법**: [TestingStrategy.md](./TestingStrategy.md)
- **CI/CD 파이프라인**: [CICDPipeline.md](./CICDPipeline.md)
- **협업 방식**: [CollaborationGuide.md](./CollaborationGuide.md)

## 문제 해결 참조

- **리팩토링 가이드**: [libwys_Keywordpulse Refactoring Doc.md](./libwys_Keywordpulse%20Refactoring%20Doc.md)
- **디버깅 가이드**: [libwys_Keywordpulse Debugging Guide.md](./libwys_Keywordpulse%20Debugging%20Guide.md)
- **배포 문제 해결**: [libwys_Keywordpulse_Vercel_Deployment.md](./libwys_Keywordpulse_Vercel_Deployment.md)

## 핵심 기능 참조

- **Supabase 인증**: [libwys_Keywordpulse Supabase Auth.md](./libwys_Keywordpulse%20Supabase%20Auth.md)
- **RAG 기능**: [libwys_Keywordpulse Rag Doc.md](./libwys_Keywordpulse%20Rag%20Doc.md)
- **SEO 최적화**: [libwys_Keywordpulse Seo Meta.md](./libwys_Keywordpulse%20Seo%20Meta.md)

## 자주 발생하는 오류와 해결책

- **모듈을 찾을 수 없음**: 경로 확인 및 `tsconfig.json`의 path 설정 검증
- **중복 파일 문제**: 유사한 이름의 파일 확인 (`AuthContext.ts`와 `AuthContext.tsx` 등)
- **의존성 충돌**: `package.json`의 의존성 버전 충돌 검토

## 작업 시 참조 체크리스트

1. 새 기능 개발 시 [Architecture.md](./Architecture.md) 문서 참조
2. 코드 작성 시 [CodeQualityGuidelines.md](./CodeQualityGuidelines.md) 준수
3. 테스트 작성 시 [TestingStrategy.md](./TestingStrategy.md) 참조
4. 배포 전 [libwys_Keywordpulse_Final_Release_Checklist.md](./libwys_Keywordpulse_Final_Release_Checklist.md) 검토