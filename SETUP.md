# 🛠️ KeywordPulse 설정 가이드

이 문서는 KeywordPulse 프로젝트의 설정 및 실행 방법을 단계별로 설명합니다.

## 환경 변수 설정

다음 환경 변수를 설정해야 프로젝트가 정상적으로 동작합니다:

### 필수 환경 변수
```
# Google Sheets 연동
GOOGLE_SERVICE_ACCOUNT=<Base64 인코딩된 서비스 계정 JSON>

# Telegram 연동
TELEGRAM_BOT_TOKEN=<텔레그램 봇 토큰>
TELEGRAM_CHAT_ID=<텔레그램 채팅 ID>
```

### 선택 환경 변수
```
# Supabase 연동 (선택)
NEXT_PUBLIC_SUPABASE_URL=<Supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_KEY=<Supabase 공개 API 키>
```

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