# 🛠️ KeywordPulse 설정 가이드

이 문서는 KeywordPulse 프로젝트의 설정 및 실행 방법을 단계별로 설명합니다.

## 환경 변수 관리 (매우 중요)

이 프로젝트는 여러 외부 서비스와 통합되므로 환경 변수 관리가 매우 중요합니다. 다음 지침을 반드시 따라주세요:

### 환경 변수 파일 구조

1. **루트 디렉토리 환경 변수**: 프로젝트 루트의 `.env.local` 파일이 주 환경 설정 파일입니다
2. **백업 환경 변수**: `app/.env.local` 파일은 동일한 내용의 백업으로 반드시 유지해야 합니다

### 환경 변수 복원 방법

만약 환경 변수 파일이 손상되거나 삭제된 경우:

```bash
# app 디렉토리의 백업에서 복원
cp ./app/.env.local ./.env.local
cp ./app/.env.local ./.env

# 또는 Git 저장소에서 복원 (만약 저장소에 있다면)
git checkout -- .env.local
```

### 필수 환경 변수 목록

```
# Vercel 배포 설정
VERCEL_ACCESS_TOKEN=JQS1F0aogmkRWvyRTiXheF9f

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://tfhrtcjgkqyzjkqucnvp.supabase.co/tfhrtcjgkqyzjkqucnvp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Sentry 설정
SENTRY_DSN=https://45dd54cc5eef5bd4080849c58a9f7ad1@o4509196090736640.ingest.us.sentry.io/4509196092571648

# Google API 설정
GOOGLE_SHEETS_API_KEY=AIzaSyDmd9EzkH4-y_lzKaVW5hG1hLq0hFjJu1g
GOOGLE_SHEETS_ID=1SSKQCKtPxZAZ-K5lxpKAy_8OHjR_e4nZ6UVHf-DV02A

# Telegram 설정
TELEGRAM_BOT_TOKEN=7812528858:AAEFwg-z9BnfWBwDE2zhE0uQURySFqsnpW8
TELEGRAM_CHAT_ID=192668562

# 애플리케이션 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 주의사항

- **커밋 금지**: 환경 변수 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 포함되어 있습니다)
- **모든 서비스 확인**: 환경 변수가 없으면 Supabase 인증, Telegram 알림, Google Sheets 연동 등이 작동하지 않습니다
- **빌드 전 확인**: 배포나 빌드 전에 항상 환경 변수 파일이 올바른지 확인하세요

## 프로젝트 설치 및 설정

1. 저장소 클론
```bash
git clone https://github.com/yourusername/keywordpulse.git
cd keywordpulse
```

2. 의존성 설치
```bash
# Node.js 의존성 설치
npm install

# Python 의존성 설치 (선택적)
pip install -r requirements.txt
```

3. 환경 변수 설정
```bash
# .env.local 템플릿을 복사
cp .env.example .env.local

# 값 편집
nano .env.local
```

4. 개발 서버 실행
```bash
npm run dev
```

## 정적 내보내기 및 배포

1. 정적 내보내기 (Static Export) 빌드
```bash
npm run build-static
```

2. Vercel CLI로 배포
```bash
npx vercel
```

3. 환경 변수가 올바르게 설정되어 있는지 확인
```bash
npx vercel env ls
```

## 문제 해결

### 환경 변수 오류

- **빌드 실패**: 환경 변수가 없거나 잘못된 경우 빌드가 실패할 수 있습니다. `.env.local` 파일을 확인하세요.
- **Supabase 인증 오류**: Supabase URL 또는 Anon Key가 올바른지 확인하세요.
- **Telegram 알림 오류**: Telegram 봇 토큰과 채팅 ID가 유효한지 확인하세요.

### 빌드 오류

- **TypeScript 오류**: `npm run build-static` 명령을 사용하여 TypeScript 오류를 우회하세요.
- **정적 내보내기 오류**: `next.config.js`에서 `output: 'export'` 설정을 확인하세요.

### 배포 오류

- **Vercel 배포 실패**: 환경 변수가 Vercel 프로젝트 설정에도 추가되어 있는지 확인하세요.
- **API 경로 오류**: 정적 내보내기는 API 경로를 직접 지원하지 않으므로 별도 API 서버 설정이 필요할 수 있습니다.

## 서비스 계정 설정 방법

### 1. Google Sheets API 서비스 계정 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. Google Sheets API와 Google Drive API 활성화
3. [서비스 계정](https://console.cloud.google.com/iam-admin/serviceaccounts) 생성
4. 키 생성 (JSON 형식)
5. 다운로드한 JSON 파일을 Base64로 인코딩:
   ```bash
   cat your-service-account-file.json | base64
   ```
6. 인코딩된 문자열을 `GOOGLE_SERVICE_ACCOUNT` 환경변수로 설정

### 2. Telegram Bot 설정
1. Telegram에서 [@BotFather](https://t.me/botfather)와 대화 시작
2. `/newbot` 명령어로 새 봇 생성
3. 봇 토큰을 `TELEGRAM_BOT_TOKEN` 환경변수로 설정
4. 봇을 채널이나 그룹에 추가하고 해당 채팅 ID 확인:
   - 개인 채팅: [@userinfobot](https://t.me/userinfobot)에게 메시지 보내기
   - 그룹: 그룹에서 봇에게 메시지 보내고 `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates` 호출
5. 확인한 채팅 ID를 `TELEGRAM_CHAT_ID` 환경변수로 설정

## 로컬 개발 환경 설정

1. 의존성 설치:
   ```bash
   # 백엔드 (Python)
   pip install -r requirements.txt

   # 프론트엔드 (Node.js)
   cd app
   npm install
   ```

2. 환경 변수 설정:
   - 로컬 `.env` 파일 생성 (또는 IDE의 환경 변수 설정 기능 사용)
   - 위에서 설명한 환경 변수 추가

3. 개발 서버 실행:
   ```bash
   # 백엔드 (Python) - 터미널 1
   uvicorn api.main:app --reload --port 3001

   # 프론트엔드 (Node.js) - 터미널 2
   cd app
   npm run dev
   ```

4. 브라우저에서 `http://localhost:3000` 접속

## Vercel에 배포하기

1. [Vercel](https://vercel.com) 계정 생성 및 로그인

2. GitHub 저장소 연결 또는 Vercel CLI 사용하여 배포:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

3. 환경 변수 설정:
   - Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
   - 위에서 설명한 모든 환경 변수 추가

4. 배포 설정 확인:
   - `vercel.json` 파일이 프로젝트 루트에 있는지 확인
   - 프로젝트 구조가 Vercel 서버리스 함수 규칙을 따르는지 확인

## 문제 해결

- **API 호출 오류**: 환경 변수가 올바르게 설정되었는지 확인
- **Google Sheets 저장 실패**: 서비스 계정에 적절한 권한이 있는지 확인
- **Telegram 알림 실패**: 봇 토큰 및 채팅 ID 확인, 봇이 채널에 초대되었는지 확인 