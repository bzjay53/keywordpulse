# KeywordPulse 설정 가이드

이 문서는 KeywordPulse 프로젝트의 설정 및 실행 방법을 단계별로 설명합니다.

## 목차
1. [환경 설정](#환경-설정)
   - [환경 변수 설정](#환경-변수-설정)
   - [Supabase 설정](#supabase-설정)
2. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
3. [배포](#배포)
4. [문제 해결](#문제-해결)

## 환경 설정

### 환경 변수 설정

애플리케이션이 정상적으로 동작하려면 다음 환경 변수를 설정해야 합니다.

`.env.local` 파일을 프로젝트 루트와 `/app` 디렉토리 모두에 생성하고 아래 내용을 추가하세요:

```
# Supabase 연동 (필수)
NEXT_PUBLIC_SUPABASE_URL=<Supabase 프로젝트 URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase 공개 API 키>

# Google API 설정 (선택)
GOOGLE_SHEETS_API_KEY=<Google Sheets API 키>
GOOGLE_SHEETS_ID=<Google Sheets ID>

# Telegram 연동 (선택)
TELEGRAM_BOT_TOKEN=<텔레그램 봇 토큰>
TELEGRAM_CHAT_ID=<텔레그램 채팅 ID>
```

### Supabase 설정

#### 1. Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com/)에 접속하여 로그인하세요.
2. "New Project" 버튼을 클릭하고 프로젝트 세부 정보를 입력하세요:
   - 프로젝트 이름: `keywordpulse` (또는 원하는 이름)
   - 데이터베이스 비밀번호: 안전한 비밀번호 설정
   - 리전: 서비스 사용자에게 가까운 리전 선택
3. "Create new project"를 클릭하여 프로젝트를 생성하세요. 생성에는 약간의 시간이 소요됩니다.

#### 2. 인증 설정

1. 생성된 프로젝트에서 좌측 메뉴의 "Authentication" > "Settings"로 이동하세요.
2. "Site URL"에 애플리케이션의 기본 URL을 설정하세요.
   - 개발 환경: `http://localhost:3000`
   - 프로덕션 환경: 실제 도메인(예: `https://yourdomain.com`)
3. "Redirect URLs"에 다음 URL을 추가하세요:
   - `http://localhost:3000/`
   - `http://localhost:3000/login`
   - 프로덕션 URL이 있다면 해당 URL도 추가하세요.
4. "Email Auth" 섹션에서 "Enable Email Signup"이 활성화되어 있는지 확인하세요.

#### 3. API 키 확인

1. 좌측 메뉴의 "Project Settings" > "API"로 이동하세요.
2. "Project URL"과 "anon public key"를 복사하여 환경 변수에 설정하세요:
   - "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - "anon public key" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 4. 관리자 사용자 설정

관리자 페이지에 접근하려면 관리자 권한이 있는 사용자가 필요합니다.

1. 일반 사용자로 회원가입 절차를 완료하세요(이메일: `admin@example.com`).
2. Supabase 대시보드의 "Authentication" > "Users"에서 해당 사용자를 찾으세요.
3. 해당 사용자 계정으로 로그인하면 자동으로 관리자 권한이 부여됩니다.

## 로컬 개발 환경 설정

1. 의존성 설치:
   ```bash
   # 백엔드 (Python)
   pip install -r requirements.txt

   # 프론트엔드 (Node.js)
   cd app
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   # API 서버 실행
   cd api
   uvicorn main:app --reload --port 3001

   # 프론트엔드 실행 (새 터미널에서)
   cd app
   npm run dev
   ```

3. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인하세요.

## 배포

### Vercel 배포

1. GitHub 저장소에 코드를 푸시하세요.
2. [Vercel](https://vercel.com/) 계정을 생성하고 로그인하세요.
3. "Import Project"를 클릭하고 GitHub 저장소를 연결하세요.
4. 환경 변수를 설정하세요 (위의 환경 변수 섹션 참조).
5. "Deploy" 버튼을 클릭하여 배포를 시작하세요.

## 문제 해결

### 로그인 문제

- **로그인이 동작하지 않는 경우**:
  1. 환경 변수가 올바르게 설정되어 있는지 확인하세요.
  2. Supabase 프로젝트에서 "Authentication" > "Settings"의 "Site URL"과 "Redirect URLs"이 올바르게 설정되어 있는지 확인하세요.
  3. 브라우저 콘솔에서 오류 메시지를 확인하세요.

- **"Invalid login credentials" 오류**:
  1. 이메일과 비밀번호가 정확한지 확인하세요.
  2. 이메일 확인을 완료했는지 확인하세요.
  3. 필요한 경우, Supabase 대시보드에서 비밀번호 재설정을 시도하세요.

### API 오류

- **키워드 검색이 동작하지 않는 경우**:
  1. API 서버가 실행 중인지 확인하세요.
  2. 네트워크 탭에서 API 호출 상태를 확인하세요.
  3. 프로젝트가 최신 상태인지 확인하세요: `git pull` 후 `npm install`을 실행하세요. 