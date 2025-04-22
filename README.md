# 🔍 KeywordPulse

KeywordPulse는 서버리스 환경에서 동작하는 실시간 키워드 분석 서비스입니다. Python 기반의 키워드 분석 로직을 웹 환경에서 실행하고, 사용자 친화적인 UI를 통해 결과를 제공합니다.

## 📋 주요 기능

- **키워드 검색 및 분석**: 입력된 키워드에 대한 연관 키워드 추출 및 점수화
- **RAG 기반 텍스트 생성**: 키워드 분석 결과를 자연어 텍스트로 요약
- **Google Sheets 연동**: 분석 결과를 스프레드시트에 저장
- **Telegram 알림**: 분석 결과를 텔레그램으로 전송
- **반응형 UI**: 모바일/데스크탑 환경 모두에서 최적화된 경험

## 🛠️ 기술 스택

- **프론트엔드**: Next.js, React, TypeScript, TailwindCSS
- **백엔드**: Python, FastAPI, Vercel Serverless Functions
- **인증**: Supabase Auth
- **외부 연동**: Google Sheets API, Telegram Bot API

## 🚀 시작하기

### 필수 환경변수

프로젝트 실행을 위해 다음 환경변수가 필요합니다:

```
# Google Sheets 연동
GOOGLE_SERVICE_ACCOUNT=<Base64 인코딩된 서비스 계정 JSON>

# Telegram 연동
TELEGRAM_BOT_TOKEN=<텔레그램 봇 토큰>
TELEGRAM_CHAT_ID=<텔레그램 채팅 ID>

# Supabase 연동 (선택)
NEXT_PUBLIC_SUPABASE_URL=<Supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_KEY=<Supabase 공개 API 키>
```

### 로컬 개발 환경 설정

1. 저장소 클론:
   ```bash
   git clone https://github.com/yourusername/keywordpulse.git
   cd keywordpulse
   ```

2. 의존성 설치:
   ```bash
   # 백엔드 (Python)
   pip install -r requirements.txt

   # 프론트엔드 (Node.js)
   cd app
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   # 백엔드 (Python)
   # Vercel Dev로 실행하는 것을 권장하나, 다음으로도 가능:
   uvicorn api.main:app --reload --port 3001

   # 프론트엔드 (Node.js)
   cd app
   npm run dev
   ```

## 📦 배포

이 프로젝트는 Vercel에 서버리스 환경으로 배포되도록 설계되었습니다:

1. Vercel CLI 설치:
   ```bash
   npm i -g vercel
   ```

2. 배포:
   ```bash
   vercel
   ```

## 📝 라이선스

이 프로젝트는 MIT 라이선스로 제공됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요. 