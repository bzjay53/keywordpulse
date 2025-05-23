# KeywordPulse 다음 작업 계획

## WBS 진행 상황 요약

현재까지 WBS에서 다음 작업들이 완료되었습니다:

1. WBS-17: **경로 관리 자동화 및 구조 개선**
   - app/app 중복 디렉토리 정리
   - 절대 경로 표준화

2. WBS-18: **RAG 시스템 개선**
   - 임베딩 캐싱 시스템 구현
   - 하이브리드 검색 알고리즘(BM25) 구현

3. WBS-19: **벡터 데이터베이스 통합**
   - Supabase pgvector 연동
   - 벡터 저장 및 검색 기능 구현
   - 벡터 DB 설정 스크립트 작성

## 다음 작업 세부 계획

WBS 문서에 따르면 다음 작업은 아래와 같습니다:

### 1. 생성 결과 후처리 (WBS-20) [진행 예정]

**작업 설명:** RAG 시스템에서 생성된 결과를 후처리하여 품질과 유용성을 향상시킵니다.

**세부 작업:**
- **응답 형식화**: 생성된 텍스트를 일관된 형식으로 구조화
- **인용 개선**: 생성 결과에 소스 인용 정보를 정확하게 포함
- **요약 생성**: 긴 응답에 대한 요약 자동 생성
- **신뢰도 점수 추가**: 응답의 신뢰도를 나타내는 점수 시스템 구현

**구현 파일:**
- `lib/rag_engine.ts`: `generateFromResults` 함수 개선
- `lib/response_formatter.ts`: 새 후처리 모듈 생성

### 2. 멀티모달 컨텐츠 지원 (WBS-21) [계획 중]

**작업 설명:** RAG 시스템이 텍스트뿐만 아니라 이미지 및 차트 데이터를 처리할 수 있도록 확장합니다.

**세부 작업:**
- **이미지 처리**: 이미지 임베딩 및 저장 기능 구현
- **멀티모달 모델 통합**: 이미지와 텍스트를 함께 처리할 수 있는 모델 통합
- **차트 데이터 지원**: 데이터셋에서 자동 차트 생성 기능 구현
- **멀티모달 검색**: 텍스트 쿼리로 이미지 검색 및 이미지로 관련 콘텐츠 검색 기능

**구현 파일:**
- `lib/multimodal_rag.ts`: 멀티모달 RAG 처리 모듈 생성
- `lib/image_processor.ts`: 이미지 처리 모듈 생성
- `lib/chart_generator.ts`: 차트 생성 모듈 생성
- `supabaseClient.ts`: 이미지 저장 및 검색 기능 추가

## 우선순위 및 일정

1. **WBS-20: 생성 결과 후처리** (1주)
   - 1일차: 응답 형식화 기능 구현
   - 2일차: 인용 개선 기능 구현
   - 3일차: 요약 생성 기능 구현
   - 4일차: 신뢰도 점수 추가
   - 5일차: 테스트 및 문서화

2. **WBS-21: 멀티모달 컨텐츠 지원** (2주)
   - 1-3일차: 이미지 처리 기능 구현
   - 4-7일차: 멀티모달 모델 통합
   - 8-10일차: 차트 데이터 지원 구현
   - 11-13일차: 테스트 및 최적화
   - 14일차: 문서화 및 배포 준비

## 참고 사항

- 생성 결과 후처리는 현재 RAG 시스템의 자연스러운 확장이므로 우선 진행
- 멀티모달 컨텐츠 지원은 복잡성이 높으므로 충분한 시간을 할당
- 두 작업 모두 완료 후 RAG-System.md 및 RAG-Upgrade.md 문서를 업데이트 필요 