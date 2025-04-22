# 🚀 KeywordPulse Vercel 배포 가이드

이 문서는 KeywordPulse 프로젝트를 Vercel에 배포하기 위한 단계별 가이드를 제공합니다. Vercel 액세스 토큰을 사용하여 배포를 설정하고 필요한 환경 변수를 구성하는 방법을 설명합니다.

## 📋 사전 요구사항

- GitHub 계정 및 저장소 접근 권한
- Vercel 계정
- Vercel 개인 액세스 토큰

## 🔄 배포 단계

### 1. Vercel 계정 설정

1. [Vercel 웹사이트](https://vercel.com)에 접속하여 로그인합니다.
2. 필요한 경우 계정을 생성합니다.

### 2. 개인 액세스 토큰 생성

1. Vercel 대시보드의 오른쪽 상단에 있는 프로필 아이콘을 클릭합니다.
2. `Settings` > `Tokens`로 이동합니다.
3. `Create` 버튼을 클릭하여 새 토큰을 생성합니다.
4. 토큰 이름을 입력하고(예: "KeywordPulse Deployment") 적절한 범위를 선택합니다.
5. 생성된 토큰을 안전한 곳에 저장합니다.

### 3. 프로젝트 설정

1. Vercel 대시보드에서 `Add New...` > `Project`를 클릭합니다.
2. GitHub 저장소 목록에서 KeywordPulse 프로젝트를 선택합니다.
3. 프로젝트 설정 화면에서:
   - **Framework Preset**: Next.js를 선택합니다.
   - **Root Directory**: `app`을 입력합니다.
   - **Build Command**: `npm run build`가 자동으로 설정됩니다.
   - **Output Directory**: `.next`가 자동으로 설정됩니다.

### 4. 환경 변수 구성

다음 환경 변수를 Vercel 프로젝트 설정에 추가합니다:

```
# Vercel 배포 설정
VERCEL_ACCESS_TOKEN=your_personal_access_token

# Sentry 설정
SENTRY_DSN=your_sentry_dsn

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google API 설정
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_SHEETS_ID=your_google_sheets_id

# Telegram 설정
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Next.js 설정
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

각 값을 프로젝트에 맞게 변경하세요.

### 5. 배포 설정 확인

프로젝트 루트 디렉토리에 있는 `vercel.json` 파일이 올바르게 구성되었는지 확인합니다:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "github": {
    "enabled": true,
    "silent": false
  },
  "framework": "nextjs"
}
```

### 6. 배포 트리거

1. 모든 설정이 완료되면 `Deploy` 버튼을 클릭합니다.
2. Vercel이 프로젝트를 빌드하고 배포하는 동안 로그를 모니터링합니다.
3. 배포가 완료되면 제공된 URL로 접속하여 프로젝트가 올바르게 동작하는지 확인합니다.

## 🔄 지속적 배포

GitHub 저장소에 대한 Vercel 통합이 설정되면 주 브랜치에 대한 모든 커밋이 자동으로 새 배포를 트리거합니다.

## 🔍 문제 해결

- **빌드 오류**: Vercel 배포 로그를 확인하여 빌드 프로세스 중에 발생한 오류를 확인합니다.
- **환경 변수 문제**: 모든 필요한 환경 변수가 올바르게 설정되었는지 확인합니다.
- **API 연결 문제**: CORS 설정 및 API 엔드포인트가 올바르게 구성되었는지 확인합니다.

## 📈 모니터링

배포 후 Sentry 대시보드를 통해 애플리케이션 성능과 오류를 모니터링할 수 있습니다. 