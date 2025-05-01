# 환경 변수 관리 지침 (Environment Variables Management Guide)

이 문서는 KeywordPulse 프로젝트의 환경 변수 관리에 대한 표준 지침을 제공합니다. 환경 변수는 프로젝트의 핵심 설정을 담고 있어 적절한 관리가 필수적입니다.

## 1. 환경 변수 파일 구조

KeywordPulse 프로젝트에서는 다음과 같은 환경 변수 파일을 사용합니다:

| 파일 | 위치 | 목적 | 관리 방법 |
|-----|------|-----|----------|
| `.env.local` | 프로젝트 루트 | 로컬 개발 환경 및 빌드 시 사용 | 수동 관리, Git에서 제외 |
| `.env` | 프로젝트 루트 | 기본 환경 변수 (fallback) | 수동 관리, Git에서 제외 |
| `app/.env.local` | app 디렉토리 | 백업용 환경 변수 | 수동 관리, Git에서 제외 |
| `.env.example` | 프로젝트 루트 | 환경 변수 예제 (실제 키 값 없음) | Git에 포함 |

## 2. 환경 변수 관리 원칙

### 2.1 환경 변수 백업 원칙

환경 변수 파일은 중요한 API 키와 접근 정보를 담고 있어 실수로 삭제되거나 변경되면 프로젝트 전체에 영향을 미칠 수 있습니다. 따라서 다음 원칙을 따라야 합니다:

1. **항상 백업 유지**: 루트 디렉토리의 `.env.local`과 동일한 내용을 `app/.env.local`에 백업으로 유지합니다.
2. **동기화 필수**: 환경 변수를 추가하거나 변경할 때는 반드시 두 파일을 동시에 업데이트합니다.
3. **버전 관리 제외**: 모든 환경 변수 파일은 `.gitignore`에 포함하여 Git 저장소에 커밋되지 않도록 합니다.
4. **중요 키 값 보호**: 실제 API 키와 비밀 값은 문서나 코드 주석에 절대 포함하지 않습니다.

### 2.2 필수 환경 변수 목록

다음은 프로젝트에 필요한 필수 환경 변수 목록입니다:

```
# Vercel 배포 설정
VERCEL_ACCESS_TOKEN=<Vercel 접근 토큰>

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=<Supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase 익명 키>

# Sentry 설정
SENTRY_DSN=<Sentry 데이터 소스 이름>

# Google API 설정
GOOGLE_SHEETS_API_KEY=<Google Sheets API 키>
GOOGLE_SHEETS_ID=<Google Sheets 문서 ID>

# Telegram 설정
TELEGRAM_BOT_TOKEN=<Telegram 봇 토큰>
TELEGRAM_CHAT_ID=<Telegram 채팅 ID>

# OpenAI API 설정
OPENAI_API_KEY=<OpenAI API 키>

# 애플리케이션 설정
NEXT_PUBLIC_BASE_URL=<애플리케이션 기본 URL>
```

## 3. 환경 변수 복원 및 백업 절차

### 3.1 환경 변수 복원 방법

환경 변수 파일이 손상되거나 삭제된 경우 다음 절차에 따라 복원합니다:

```bash
# app 디렉토리의 백업에서 복원
cp ./app/.env.local ./.env.local
cp ./app/.env.local ./.env

# 복원 후 확인
cat .env.local
```

### 3.2 환경 변수 백업 절차

환경 변수를 변경했을 때 다음 절차에 따라 백업합니다:

```bash
# 루트 디렉토리의 파일을 app 디렉토리로 백업
cp ./.env.local ./app/.env.local

# 또는 app 디렉토리의 파일을 루트 디렉토리로 동기화
cp ./app/.env.local ./.env.local
```

## 4. 환경별 설정 관리

### 4.1 개발 환경 설정

개발 환경에서는 로컬 서비스나 테스트 계정을 사용할 수 있습니다:

```bash
# 개발용 환경 변수 설정 예시
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4.2 프로덕션 환경 설정

프로덕션 환경에서는 실제 서비스 계정과 프로덕션 URL을 사용합니다:

```bash
# 프로덕션용 환경 변수 설정 예시
NEXT_PUBLIC_BASE_URL=https://keywordpulse.vercel.app
```

## 5. 환경 변수 사용 지침

### 5.1 프론트엔드에서 환경 변수 사용

프론트엔드에서 사용 가능한 환경 변수는 `NEXT_PUBLIC_` 접두사를 붙여야 합니다:

```javascript
// 올바른 사용법
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 잘못된 사용법 (프론트엔드에서 접근 불가)
const apiKey = process.env.API_SECRET_KEY;
```

### 5.2 백엔드에서 환경 변수 사용

서버 측 코드에서는 모든 환경 변수에 접근할 수 있습니다:

```javascript
// 서버 측 API 라우트 또는 서버 컴포넌트에서
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const sentryDsn = process.env.SENTRY_DSN;
```

### 5.3 빌드 시 환경 변수 주입

빌드 시에는 다음과 같이 환경 변수를 주입할 수 있습니다:

```bash
# 단일 명령으로 환경 변수 주입 및 빌드
NEXT_PUBLIC_FEATURE_FLAG=true npm run build
```

## 6. 환경 변수 보안 모범 사례

1. **민감한 키 관리**: API 키 등 민감한 정보는 안전하게 보관하고 정기적으로 갱신합니다.
2. **권한 제한**: 각 서비스 계정의 권한을 최소한으로 제한합니다.
3. **키 노출 방지**: 환경 변수가 포함된 오류 메시지나 로그가 공개되지 않도록 합니다.
4. **키 순환**: 중요 API 키는 정기적으로 교체합니다.
5. **IP 제한**: 가능한 경우 API 키에 IP 접근 제한을 설정합니다.

## 7. Vercel 환경 변수 설정 방법

Vercel에 배포할 때는 다음 단계에 따라 환경 변수를 설정합니다:

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Environment Variables 선택
3. 필요한 환경 변수 추가
4. 각 환경 변수의 범위 설정 (Production, Preview, Development)
5. Save 클릭

## 8. 문제 해결

### 8.1 환경 변수가 로드되지 않는 경우

1. `.env.local` 파일이 프로젝트 루트에 존재하는지 확인
2. 파일 형식이 올바른지 확인 (UTF-8 인코딩, CRLF/LF 줄바꿈 문자 호환성)
3. 환경 변수 이름에 오타가 없는지 확인
4. 개발 서버를 재시작하여 환경 변수 변경사항 적용

### 8.2 배포 후 환경 변수 문제

1. Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
2. 빌드 로그에서 환경 변수 관련 오류 확인
3. 로컬에서 `.env.local`을 사용하여 문제를 재현할 수 있는지 테스트

---

이 문서는 프로젝트 요구사항의 변화에 따라 지속적으로 업데이트됩니다.

마지막 업데이트: 2023-04-29 