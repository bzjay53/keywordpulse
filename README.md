# 🔍 KeywordPulse

KeywordPulse는 서버리스 환경에서 동작하는 실시간 키워드 분석 서비스입니다. Python 기반의 키워드 분석 로직을 웹 환경에서 실행하고, 사용자 친화적인 UI를 통해 결과를 제공합니다.

## 📋 주요 기능

- **키워드 검색 및 분석**: 입력된 키워드에 대한 연관 키워드 추출 및 점수화
- **RAG 기반 텍스트 생성**: 키워드 분석 결과를 자연어 텍스트로 요약
- **Google Sheets 연동**: 분석 결과를 스프레드시트에 저장
- **Telegram 알림**: 분석 결과를 텔레그램으로 전송
- **반응형 UI**: 모바일/데스크탑 환경 모두에서 최적화된 경험
- **정적 내보내기**: Next.js의 정적 내보내기를 통해 서버 없이도 배포 가능

## 🤖 RAG 시스템 (Retrieval-Augmented Generation)

KeywordPulse는 고급 RAG(Retrieval-Augmented Generation) 시스템을 통해 키워드 분석 결과를 구조화된 마크다운 형식의 텍스트로 변환합니다.

### 주요 특징

- **카테고리 기반 분석**: 입력 키워드를 '디지털 마케팅', '앱 개발', 'AI 기술', '3D 모델링/AI', '일반' 등 카테고리로 자동 분류
- **캐싱 메커니즘**: 성능 최적화를 위한 메모이제이션 구현
- **마크다운 출력**: 분석 결과를 마크다운 형식으로 제공하여 즉시 활용 가능
- **인사이트와 전략**: 키워드별 맞춤형 인사이트와 콘텐츠 제작 전략 제공

### 사용 방법

RAG 시스템은 API 엔드포인트를 통해 접근하거나, 프론트엔드 UI를 통해 간편하게 사용할 수 있습니다:

```typescript
// API를 통한 직접 호출 예시
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ keywords: ['인공지능', 'GPT4', '머신러닝'] })
});
const data = await response.json();
console.log(data.analysis); // 마크다운 형식의 분석 결과
```

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14, React, TypeScript, TailwindCSS
- **백엔드**: Python, FastAPI, Edge Runtime API
- **인증**: Supabase Auth
- **외부 연동**: Google Sheets API, Telegram Bot API
- **배포**: 정적 내보내기 (Static Export)를 통한 배포

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
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase 익명 키>
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
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   # 개발 모드 실행
   npm run dev
   
   # 빌드 및 정적 내보내기
   npm run build
   ```

## 📦 배포

이 프로젝트는 다음과 같은 방법으로 배포할 수 있습니다:

### 정적 내보내기 (추천)

1. 정적 빌드 생성:
   ```bash
   npm run build
   ```

2. `out` 디렉토리를 웹 서버 또는 정적 호스팅 서비스(GitHub Pages, Netlify, Vercel 등)에 배포

### Vercel 배포

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

## 📅 최근 업데이트

- Next.js 14 업그레이드
- 정적 내보내기(Static Export) 지원 추가
- Edge Runtime API 적용
- 빌드 및 배포 프로세스 최적화

최종 업데이트: 2023-11-20 