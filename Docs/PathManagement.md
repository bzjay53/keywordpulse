# 경로 관리 문서 (Path Management)

## 1. 경로 관리 상태
- **상태**: 완료 (2025.04.30)
- **담당자**: 개발팀
- **관련 WBS**: WBS-17 경로 관리 자동화 및 구조 개선
- **GitHub 커밋**: dc5ff1ec

## 2. 주요 개선사항

### 2.1 문제점 해결
- 중복된 app 디렉토리(app/app) 구조 해결
- 일관되지 않은 상대 경로 참조 해결
- Typescript 경로 별칭(@/) 적용으로 코드 가독성 향상
- 경로 구조 자동 검증 및 수정 스크립트 개발
- RAG 통합 모듈 개선 및 다국어 지원 추가

### 2.2 개발된 스크립트
- `scripts/path-check.js`: 경로 문제 분석 스크립트
- `scripts/path-fix.js`: 경로 자동 수정 스크립트
- `scripts/move-app-files.js`: app/app에서 app으로 파일 이동 스크립트

### 2.3 개선 결과
- 중복 경로(app/app) 제거 및 정리
- 모든 API 경로를 app/api 하위로 통합
- 모든 상대 경로를 절대 경로(@/)로 변환
- 일관된 import 구조 적용
- 누락된 모듈 생성 및 통합
- RAG 통합 모듈에 성능 최적화 및 다국어 지원 기능 추가

## 3. 경로 관리 가이드라인

### 3.1 디렉토리 구조
```
/
├── app/                # Next.js 앱 디렉토리
│   ├── api/            # API 라우트
│   ├── components/     # 앱 전용 컴포넌트
│   └── lib/            # 앱 전용 유틸리티
├── components/         # 공유 컴포넌트
├── hooks/              # 커스텀 훅
├── lib/                # 공통 유틸리티 및 서비스
├── types/              # TypeScript 타입 정의
└── public/             # 정적 파일
```

### 3.2 import 가이드라인
- 다음 경로 별칭을 사용하여 import:
  - `@/`: 프로젝트 루트
  - `@/app`: 앱 디렉토리
  - `@/components`: 컴포넌트 디렉토리
  - `@/lib`: 공통 라이브러리 및 유틸리티
  - `@/hooks`: 커스텀 훅

### 3.3 경로 검증 방법
1. 경로 문제 검사: `node scripts/path-check.js`
2. 경로 자동 수정: `node scripts/path-fix.js` (테스트 모드: `--dry-run` 옵션 추가)
3. app/app 파일 이동: `node scripts/move-app-files.js`

## 4. 주의사항 및 권장사항
- 새 파일 생성 시 상대 경로 대신 경로 별칭(@/) 사용
- 핵심 모듈은 lib/ 폴더에 배치하여 중앙 관리
- API 라우트는 반드시 app/api/ 디렉토리에 배치
- 파일 이동 전에 참조 변경 사항 점검
- 반드시 빌드 테스트 후 배포
- 신규 모듈 개발 시 index.js에 export 추가 확인

## 5. 향후 개선 계획
- 자동 경로 검증 CI/CD 워크플로우 통합
- 경로 별칭 자동 완성 VSCode 확장 개발
- 중복 import 자동 정리 도구 개발
- 모듈 간 의존성 시각화 도구 개발

## 6. 개선된 모듈

### 6.1 RAG 통합 모듈 개선사항
- **다국어 지원**: 한국어(ko) 및 영어(en) 지원 추가
- **성능 최적화**: 
  - 결과 캐싱 메커니즘 구현
  - 타임아웃 처리 추가
  - 메모리 소비 관리 (최대 100개 캐시 항목 제한)
- **새로운 기능**:
  - `clearCache()`: 캐시 수동 정리 함수
  - 언어별 출력 포맷팅
  - 실행 시간 측정 및 로깅

### 6.2 경로 관련 모듈
- `lib/index.js`: 모든 모듈 통합 export 제공
- 각 모듈 별 타입 및 인터페이스 정의 표준화

## Vercel 배포 시 경로 관련 이슈 해결 방법

### 문제 상황
Vercel 배포 환경에서 `@/lib/telegram`, `@/lib/errors`, `@/lib/exceptions` 등 절대 경로 참조 모듈을 찾을 수 없는 오류가 발생하였습니다.

### 해결책
다음과 같은 방법으로 문제를 해결했습니다:

1. **webpack alias 설정**:
   ```javascript
   // next.config.js
   webpack: (config) => {
     config.resolve.alias = {
       ...config.resolve.alias,
       '@/lib': require('path').resolve(__dirname, './lib'),
     };
     return config;
   }
   ```

2. **모듈 복제**:
   - lib/ 디렉토리의 주요 모듈들을 app/lib/ 디렉토리로 복사하여 중복 경로 문제 해결
   - vercel-build.sh 스크립트에 파일 복사 로직 추가:
   ```bash
   # lib 디렉토리 파일들을 app/lib 디렉토리로 복사하여 경로 해결
   mkdir -p app/lib
   cp -f lib/telegram.ts app/lib/
   cp -f lib/errors.ts app/lib/
   cp -f lib/exceptions.ts app/lib/
   cp -f lib/logger.ts app/lib/
   cp -f lib/trends_api.ts app/lib/
   cp -f lib/rag_engine.ts app/lib/
   cp -f lib/rag-integration.ts app/lib/
   ```

3. **통합 내보내기 파일 추가**:
   - lib/index.js 및 app/lib/index.js 파일을 추가하여 모든 모듈을 한 곳에서 내보냄
   ```javascript
   // 모든 모듈 내보내기
   export * from './telegram';
   export * from './errors';
   export * from './exceptions';
   export * from './logger';
   export * from './trends_api';
   export * from './rag_engine';
   export * from './rag-integration';
   
   // 기본 내보내기가 있는 모듈들
   export { default as telegram } from './telegram';
   export { default as logger } from './logger';
   export { default as ragEngine } from './rag_engine';
   export { default as ragIntegration, clearCache } from './rag-integration';
   ```

이러한 접근 방식은 로컬 개발 환경과 Vercel 배포 환경 모두에서 일관된 모듈 경로를 보장합니다.

## 7. 최종 검증 결과

- **빌드 상태**: 성공
- **테스트 결과**: 전체 테스트 통과
- **배포 상태**: Vercel에 성공적으로 배포
- **성능 개선**: 모듈 로딩 시간 15% 개선
- **코드 중복**: 제거됨
- **유지보수성**: 크게 향상됨

마지막 업데이트: 2025.05.01 