# CI/CD 파이프라인 문서

## 개요

이 문서는 KeywordPulse 프로젝트의 지속적 통합 및 배포(CI/CD) 파이프라인 설정을 설명합니다. 현재 GitHub Actions와 Vercel을 활용하여 자동화된 테스트, 빌드 및 배포 프로세스를 구현하고 있습니다.

## CI/CD 아키텍처

```
[코드 변경] → [GitHub] → [GitHub Actions] → [테스트 & 빌드] → [Vercel] → [배포]
```

## GitHub Actions 워크플로우

### 1. 풀 리퀘스트 워크플로우

**파일 위치**: `.github/workflows/pull-request.yml`

```yaml
name: Pull Request Checks

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run type check
        run: npm run typecheck
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
```

### 2. 메인 브랜치 배포 워크플로우

**파일 위치**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
      # Vercel 배포는 GitHub와 Vercel의 통합으로 자동 처리됨
```

## Vercel 배포 설정

### 1. 프로젝트 설정

- **프레임워크 프리셋**: Next.js
- **빌드 명령어**: `npm run build`
- **출력 디렉토리**: `.next`
- **개발 명령어**: `npm run dev`
- **설치 명령어**: `npm install`

### 2. 환경 변수

| 변수명 | 설명 | 환경 |
|--------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL | 모든 환경 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 익명 키 | 모든 환경 |
| SUPABASE_SERVICE_ROLE_KEY | Supabase 서비스 역할 키 | 프로덕션, 스테이징 |
| RAG_API_KEY | RAG 엔진 API 키 | 프로덕션, 스테이징 |
| TELEGRAM_BOT_TOKEN | Telegram 봇 토큰 | 프로덕션, 스테이징 |

### 3. 배포 브랜치

- **프로덕션**: `main` 브랜치
- **스테이징**: `develop` 브랜치
- **개발 미리보기**: 모든 PR에 대해 자동 생성

## 배포 환경

### 1. 개발 환경 (Development)

- **URL**: `https://dev.keywordpulse.vercel.app`
- **목적**: 개발자 테스트 및 기능 검증
- **데이터**: 테스트 데이터 (프로덕션 데이터 미사용)
- **배포 트리거**: PR 생성 시 자동 배포

### 2. 스테이징 환경 (Staging)

- **URL**: `https://staging.keywordpulse.vercel.app`
- **목적**: QA 테스트 및 최종 검증
- **데이터**: 익명화된 프로덕션 데이터 복제본
- **배포 트리거**: `develop` 브랜치에 머지 시 자동 배포

### 3. 프로덕션 환경 (Production)

- **URL**: `https://keywordpulse.com`
- **목적**: 실제 사용자 서비스
- **데이터**: 실제 프로덕션 데이터
- **배포 트리거**: `main` 브랜치에 머지 시 자동 배포

## 롤백 절차

### 1. 자동 롤백

- Vercel 대시보드에서 이전 배포로 롤백 가능
- 롤백 방법: 
  1. Vercel 대시보드 접속
  2. 프로젝트 선택
  3. Deployments 탭 선택
  4. 롤백할 이전 배포 버전 찾기
  5. "Promote to Production" 클릭

### 2. 수동 롤백

- GitHub에서 이전 커밋으로 리버트:
  ```bash
  git revert [문제가 된 커밋 해시]
  git push origin main
  ```

## 모니터링 및 알림

### 1. 배포 알림

- **Slack 채널**: #deployments
- **이메일 알림**: 배포 실패 시 팀 이메일로 알림

### 2. 성능 모니터링

- Vercel Analytics로 성능 모니터링
- Sentry로 오류 모니터링 및 추적

## 배포 베스트 프랙티스

### 1. 배포 전략

- **기능 브랜치**: 새로운 기능은 별도 브랜치에서 개발
- **PR 리뷰**: 모든 코드 변경은 PR 통해 리뷰 후 병합
- **점진적 롤아웃**: 주요 변경사항은 일부 사용자에게만 먼저 노출

### 2. 배포 일정

- **정기 배포**: 매주 수요일 오전 10시 (비긴급 업데이트)
- **긴급 배포**: 보안 이슈 및 중요 버그 수정 시 즉시 배포

### 3. 배포 체크리스트

- [ ] 모든 테스트 통과 확인
- [ ] 코드 리뷰 완료
- [ ] 빌드 성공 확인
- [ ] 스테이징 환경에서 수동 테스트 완료
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 필요성 검토
- [ ] 롤백 계획 검토 