# KeywordPulse CI/CD 파이프라인

## 목차
- [개요](#개요)
- [CI/CD 아키텍처](#cicd-아키텍처)
- [파이프라인 단계](#파이프라인-단계)
- [환경 구성](#환경-구성)
- [파이프라인 구성](#파이프라인-구성)
- [배포 전략](#배포-전략)
- [보안 고려사항](#보안-고려사항)
- [모니터링 및 알림](#모니터링-및-알림)
- [롤백 전략](#롤백-전략)
- [지속적 개선](#지속적-개선)
- [관련 문서](#관련-문서)

## 개요

KeywordPulse의 CI/CD 파이프라인은 코드 품질을 보장하고 안정적인 배포를 가능하게 하는 자동화된 프로세스입니다. 이 문서는 프로젝트의 CI/CD 워크플로우, 환경 구성, 배포 전략 및 모범 사례를 설명합니다.

## CI/CD 아키텍처

KeywordPulse는 다음과 같은 CI/CD 아키텍처를 사용합니다:

```
[GitHub] → [GitHub Actions] → [Vercel]
    ↑             ↓              ↓
    └──────── [통합 테스트] ← [배포 미리보기]
```

### 주요 구성 요소

- **소스 코드 관리**: GitHub
- **CI 서버**: GitHub Actions
- **배포 플랫폼**: Vercel
- **품질 게이트**: 테스트, 린팅, 타입 검사
- **환경**: 개발(PR 미리보기), 스테이징, 프로덕션

## 파이프라인 단계

### 1. 코드 품질 검증

- **린팅**: ESLint를 사용한 코드 스타일 및 패턴 검증
- **타입 검사**: TypeScript 컴파일러를 사용한 타입 안전성 검증
- **포맷팅**: Prettier를 사용한 코드 포맷팅 검증

### 2. 테스트

- **단위 테스트**: 개별 컴포넌트 및 함수 테스트
- **통합 테스트**: 컴포넌트 간 상호 작용 테스트
- **E2E 테스트**: 주요 사용자 흐름 테스트

### 3. 빌드

- Next.js 애플리케이션 빌드
- 정적 자산 최적화
- 번들 분석

### 4. 배포

- **PR 배포**: Pull Request에 대한 미리보기 환경 배포
- **스테이징 배포**: 개발 브랜치 병합 시 스테이징 환경 배포
- **프로덕션 배포**: 릴리스 태그 생성 또는 메인 브랜치 병합 시 프로덕션 환경 배포

### 5. 사후 배포 검증

- 자동화된 스모크 테스트
- 성능 메트릭 수집
- 오류 모니터링

## 환경 구성

KeywordPulse는 다음과 같은 환경을 사용합니다:

### 개발 환경

- **목적**: 개발자 로컬 환경 및 PR 미리보기
- **URL 패턴**: `https://keywordpulse-git-{branch}-username.vercel.app`
- **환경 변수**: `.env.development` 및 Vercel 환경 변수
- **데이터베이스**: 개발용 Supabase 인스턴스

### 스테이징 환경

- **목적**: QA 및 테스트
- **URL**: `https://staging-keywordpulse.vercel.app`
- **환경 변수**: `.env.staging` 및 Vercel 환경 변수
- **데이터베이스**: 스테이징용 Supabase 인스턴스
- **배포 트리거**: 개발 브랜치 병합

### 프로덕션 환경

- **목적**: 최종 사용자 서비스
- **URL**: `https://keywordpulse.com`
- **환경 변수**: `.env.production` 및 Vercel 환경 변수
- **데이터베이스**: 프로덕션용 Supabase 인스턴스
- **배포 트리거**: 메인 브랜치 병합 또는 릴리스 태그

## 파이프라인 구성

### GitHub Actions 워크플로우

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop')
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel 구성

Vercel 플랫폼 설정:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Development Command**: `npm run dev`
- **환경 변수**: 환경별 구성

## 배포 전략

### 지속적 배포

KeywordPulse는 다음과 같은 배포 워크플로우를 따릅니다:

1. 개발자는 기능 브랜치에서 작업
2. Pull Request 생성 시 자동 미리보기 환경 배포
3. 코드 리뷰 및 자동화된 테스트 통과 후 브랜치 병합
4. 병합 시 자동으로 다음 환경으로 배포

### 배포 승인 프로세스

프로덕션 배포는 추가 승인 프로세스를 따릅니다:

1. 스테이징 환경에서 QA 검증
2. 제품 책임자 승인
3. 배포 담당자의 배포 승인
4. 자동화된 프로덕션 배포 실행

### 배포 일정

- **스테이징 배포**: 개발 작업 병합 시 자동 배포
- **프로덕션 배포**: 주 1회 정기 배포 (화요일 오전 10시)
- **긴급 배포**: 중요 버그 수정 시 필요에 따라 진행

## 보안 고려사항

### 환경 변수 관리

- 모든 민감한 정보는 환경 변수로 관리
- Vercel의 환경 변수 암호화 활용
- GitHub Secrets를 사용한 CI/CD 환경에서의 보안 정보 관리

### 배포 권한

- 프로덕션 배포 권한은 지정된 팀원으로 제한
- 배포 키와 토큰은 정기적으로 교체
- 액세스 권한은 최소 권한 원칙 준수

### 취약점 스캔

- 의존성 취약점 스캔 자동화
- 보안 이슈 발견 시 자동 알림
- 중요 취약점 발견 시 배포 차단

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * *'  # 매일 실행
  push:
    branches: [main, develop]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: npm audit --audit-level=high
```

## 모니터링 및 알림

### 배포 모니터링

- Vercel 배포 로그 및 상태 모니터링
- Sentry를 통한 에러 추적
- 핵심 웹 바이탈 성능 메트릭 모니터링

### 알림 시스템

- 배포 성공/실패 시 Slack 알림
- 중요 에러 발생 시 이메일 및 Slack 알림
- 주간 성능 및 배포 요약 보고서

```yaml
# GitHub Actions Slack 알림 예시
- name: Send Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always()
```

## 롤백 전략

### 자동 롤백

심각한 이슈 감지 시 자동 롤백 실행:

1. 오류율 임계값 초과 시 알림 트리거
2. 지정된 시간 내에 수정되지 않으면 자동 롤백
3. 이전 안정 버전으로 복원

### 수동 롤백

긴급 상황에서의 수동 롤백 절차:

1. Vercel 대시보드에서 이전 배포 선택
2. "Promote to Production" 기능 사용
3. 롤백 실행 후 팀에 알림

### 롤백 테스트

- 정기적인 롤백 훈련 실시
- 롤백 프로세스에 대한 문서화 및 교육
- 롤백 시간 측정 및 개선

## 지속적 개선

### 파이프라인 성능 최적화

- 빌드 및 테스트 시간 모니터링
- 병렬 실행을 통한 CI/CD 속도 향상
- 캐싱 전략 개선

### 피드백 루프

- 배포 후 회고 미팅 진행
- 파이프라인 개선 사항 식별
- 자동화 범위 지속 확장

### 메트릭 추적

- 배포 주기 시간
- 빌드 및 테스트 성공률
- 롤백 빈도 및 원인

## 관련 문서

- [Architecture.md](./Architecture.md): 시스템 아키텍처 문서
- [TestingStrategy.md](./TestingStrategy.md): 테스트 전략 문서
- [SecurityGuidelines.md](./SecurityGuidelines.md): 보안 가이드라인

# KeywordPulse CI/CD 파이프라인 문서

## 개요

KeywordPulse 프로젝트는 GitHub Actions와 Vercel을 활용한 지속적 통합 및 배포(CI/CD) 파이프라인을 구축하여 개발 및 배포 프로세스를 자동화하였습니다. 이 문서는 해당 파이프라인의 구조, 작동 방식, 그리고 관리 방법을 설명합니다.

## 파이프라인 아키텍처

![CI/CD 파이프라인 다이어그램](./diagrams/cicd-pipeline.png)

### 파이프라인 단계

1. **코드 변경 감지**
   - GitHub 저장소에 푸시 또는 PR 생성

2. **자동화된 테스트**
   - 린팅 및 코드 품질 검사
   - 단위 테스트
   - 통합 테스트

3. **빌드 프로세스**
   - 코드 컴파일
   - 번들링 및 최적화

4. **미리보기 배포** (PR 환경)
   - Vercel 미리보기 환경 배포
   - 자동 URL 생성 및 PR에 댓글 추가

5. **프로덕션 배포** (main 브랜치)
   - 프로덕션 환경 배포
   - 환경 변수 및 구성 적용

## GitHub Actions 워크플로우

KeywordPulse는 다음과 같은 GitHub Actions 워크플로우를 사용합니다:

### 1. 품질 검사 워크플로우 (`quality-check.yml`)

```yaml
name: Quality Check

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Check Types
        run: npm run type-check

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
```

### 2. 빌드 검증 워크플로우 (`build-check.yml`)

```yaml
name: Build Check

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Archive build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: .next
```

## Vercel 배포 설정

### 프로젝트 설정

Vercel에서는 다음과 같은 프로젝트 설정을 사용합니다:

1. **기본 설정**
   - 프레임워크 프리셋: Next.js
   - 루트 디렉토리: `/`
   - 빌드 명령어: `bash vercel-build.sh`
   - 출력 디렉토리: `.next`

2. **환경 변수**
   - 프로덕션, 프리뷰, 개발 환경별 환경 변수 설정
   - 비밀 값은 Vercel 프로젝트 설정에서 암호화하여 저장

3. **도메인 설정**
   - 프로덕션 도메인: `keywordpulse.app`
   - 커스텀 도메인 SSL 인증서 적용

### 배포 통합

GitHub 저장소와 Vercel 프로젝트는 다음과 같이 통합되어 있습니다:

1. **자동 배포 트리거**
   - `main` 브랜치에 푸시 → 프로덕션 배포
   - Pull Request 생성 → 미리보기 배포

2. **배포 설정**
   - 정적 파일 캐싱 최적화
   - Serverless 함수 리전 설정
   - 빌드 캐시 최적화

## 배포 전략

### 브랜치 전략

KeywordPulse는 다음과 같은 Git 브랜치 전략을 사용합니다:

1. **main**: 프로덕션 코드
2. **dev**: 개발 중인 코드
3. **feature/{name}**: 새로운 기능 개발
4. **bugfix/{name}**: 버그 수정
5. **release/{version}**: 릴리스 준비

### 배포 프로세스

1. **개발 단계**
   - 개발자는 `feature/*` 또는 `bugfix/*` 브랜치에서 작업
   - 작업 완료 후 `dev` 브랜치로 PR 생성
   - 자동화된 테스트 및 빌드 검증 진행
   - 코드 리뷰 후 승인 시 `dev` 브랜치로 병합

2. **릴리스 준비**
   - `dev` 브랜치에서 `release/{version}` 브랜치 생성
   - 최종 테스트 및 QA 진행
   - 릴리스 노트 작성 및 버전 업데이트

3. **프로덕션 배포**
   - `release/{version}` 브랜치에서 `main` 브랜치로 PR 생성
   - 최종 승인 후 `main` 브랜치로 병합
   - GitHub Actions를 통한 최종 검증
   - Vercel을 통한 프로덕션 자동 배포

## 롤백 프로세스

배포 후 문제 발생 시 신속한 롤백을 위한 프로세스:

1. **Vercel 롤백**
   - Vercel 대시보드에서 이전 배포로 롤백
   - 롤백은 1-2분 내에 완료됨

2. **코드 롤백**
   - `main` 브랜치를 이전 상태로 되돌리는 PR 생성
   - 긴급 승인 후 병합
   - 새로운 배포 자동 트리거

## 모니터링 및 알림

### 배포 알림

다음 채널을 통해 배포 상태 알림을 제공합니다:

1. **Slack**
   - GitHub Actions 및 Vercel 통합
   - 배포 성공/실패 알림

2. **이메일**
   - 팀 이메일로 주요 배포 알림
   - 실패 시 담당자에게 즉시 알림

### 모니터링

배포 후 시스템 모니터링:

1. **Sentry**
   - 실시간 오류 모니터링
   - 성능 모니터링

2. **Vercel Analytics**
   - 배포 성능 분석
   - Edge 함수 성능 분석

3. **자체 모니터링**
   - API 응답 시간 모니터링
   - 서비스 가용성 체크

## 보안 스캔

파이프라인에는 다음과 같은 보안 스캔이 포함되어 있습니다:

1. **의존성 취약점 스캔**
   ```yaml
   - name: Security scan
     run: npm audit --production
   ```

2. **코드 취약점 분석**
   - CodeQL 스캔
   - SAST(Static Application Security Testing)

## 성능 최적화

CI/CD 파이프라인 성능 최적화를 위한 전략:

1. **캐싱**
   - npm 의존성 캐싱
   - Next.js 빌드 캐싱

2. **병렬 작업**
   - 테스트 및 빌드 병렬화
   - 독립적인 작업 분리

## 개발자 워크플로우

개발자는 다음과 같은 워크플로우를 따릅니다:

1. 최신 `dev` 브랜치에서 feature 브랜치 생성
2. 변경 사항 구현 및 로컬 테스트
3. 커밋 및 푸시
4. GitHub에서 PR 생성
5. 자동화된 검증 확인
6. 코드 리뷰 요청 및 피드백 반영
7. PR 병합 승인

## 파이프라인 유지 관리

### 정기 점검

1. **월간 점검**
   - 워크플로우 성능 분석
   - 불필요한 단계 최적화

2. **분기별 업데이트**
   - GitHub Actions 액션 버전 업데이트
   - 새로운 CI/CD 도구 및 기능 평가

## 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vercel 배포 문서](https://vercel.com/docs/deployments/overview)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment) 