# 🐞 디버깅 가이드 (KeywordPulse)

KeywordPulse 프로젝트의 전반적인 디버깅 전략, 환경 설정, 문제 분석 절차, 공통 에러 처리 및 로그 추적 기법을 포함한 실무 기준의 디버깅 가이드입니다.

---

## 🧭 디버깅 목표
- 서버리스 환경(Vercel) 기반 제한 내에서 문제를 신속하게 식별 및 해결
- API/프론트엔드 통합 디버깅을 위한 구조화된 추적법 제시
- Supabase, Google Sheets, Telegram 등 외부 연동 이슈 대응법 포함

---

## 🛠 디버깅 환경 구성

| 항목 | 도구 / 설명 |
|------|---------------|
| 프론트 디버깅 | Vercel Preview, React DevTools, Lighthouse, Dev Console |
| 백엔드 디버깅 | `print()` 또는 `logging` 모듈 → Vercel Logs 확인 |
| API 테스트 | Postman, Curl, VSCode REST Client, `pytest` |
| DB 확인 | Supabase Console → Table View or SQL Editor |
| 시트 확인 | Google Sheets → 로그 시트에 접근 시도 |

---

## 🔍 공통 에러 패턴

### 1. **API 응답 없음 / 500 오류**
- `Vercel > Functions > Logs`에서 로그 확인
- Python 오류 추적 시 traceback에 위치 표시됨

### 2. **Google Sheets 저장 실패**
- 인증 문제: `GOOGLE_SERVICE_ACCOUNT` 환경변수 누락 여부 확인
- `gspread` 오류 메시지 내 `403`, `401`, `404` 구분 필요

### 3. **Telegram 알림 전송 실패**
- `TELEGRAM_BOT_TOKEN` 또는 `CHAT_ID` 불일치
- Bot이 해당 채널에 초대되지 않았을 가능성

### 4. **Supabase 로그인 문제**
- 이메일 전송 실패 시: redirect 설정 확인 (`Supabase Auth → URL 설정`)
- 토큰 만료 → `localStorage` clear 후 재로그인

### 5. **Next.js 프로젝트 구조 및 경로 문제**
- **증상**: `Module not found`, `Cannot find module` 에러
- **원인**: 
  - 경로 별칭(`@/`) 잘못 설정
  - 디렉토리 구조 불일치
  - 삭제된 파일 참조
  - Vercel 배포와 로컬 개발 환경의 경로 차이
  - 중첩된 디렉토리 구조(`app/app/`)와 상대/절대 경로 혼용 문제
- **해결방법**:
  - `tsconfig.json`에서 경로 별칭 설정 확인 (paths 설정)
  - 루트 레이아웃(`app/layout.tsx`) 존재 여부 확인
  - Next.js 캐시 클리어: `.next` 디렉토리 삭제 후 다시 빌드
  - import 경로 수정: 절대 경로(`@/`)에서 상대 경로로 변경 고려
  - 중첩된 디렉토리 구조(`app/app/`)에서는 상대 경로(`../../lib/file`)로 변경
  - 프로젝트 구조와 파일 위치 재검토 및 조정
  - 훅과 컴포넌트 경로 일관성 확보: 중복된 위치의 파일 통합
  - **최근 개선**: 훅 파일을 루트 디렉토리의 hooks 폴더로 복사하고 모든 import를 상대 경로로 통일

---

## 📊 로그 추적 방식

### 백엔드 로그 예시
```python
print("[search] 시작: keyword=AI")
logger.info("[sync] 구글 시트 저장 완료: rows=10")
logger.error("[notify] 텔레그램 전송 실패: error=403")
```

### 프론트엔드 오류 추적 예시
```tsx
try {
  const res = await fetch('/api/search', { method: 'POST' });
  if (!res.ok) throw new Error("검색 실패: " + res.status);
} catch (err) {
  console.error("[UI Error]", err);
  toast.error("분석 요청에 실패했습니다.");
}
```

### 에러 구조화 로그 (권장 패턴)
```json
{
  "service": "search",
  "status": "error",
  "message": "related_keywords is empty",
  "keyword": "ai",
  "timestamp": "2025-05-01T12:00:00Z"
}
```

---

## ✅ 체크리스트 기반 디버깅 절차

```plaintext
1. 문제가 발생한 위치 파악 (API vs UI vs 외부 연동)
2. 콘솔 및 Vercel Logs를 통해 에러 메시지 수집
3. 최근 배포 이력 확인 (GitHub commit, Vercel Preview)
4. 해당 기능 테스트 재현 (Postman, UI Flow)
5. 관련 환경변수, 인증 키 누락 여부 점검
6. 캐시, 토큰, 상태값 재설정 후 재시도
7. 디버깅 완료 후 동일 상황 재현 테스트 → 해결 여부 확인
```

---

## 🔁 디버깅 개선 제안

| 항목 | 제안 |
|------|------|
| 로그 표준화 | 서비스별 prefix, JSON 구조화 (`[api/search]`, `[rag/analyze]`) |
| 재현 스크립트 | 주요 에러 재현용 `curl` 또는 Postman Collection 제작 |
| 자동 알림 연동 | `Sentry` 또는 `Slack Webhook`으로 치명적 오류 자동 전송 |
| 유닛 테스트 커버리지 | `pytest` + 실패 로그 자동 보고 |
| 경로 검증 스크립트 | 파일 경로 참조 자동 검증하는 빌드 전 스크립트 추가 |
| 배포 전 검증 | 로컬에서 `next build` 후 Vercel에 배포하여 환경 차이 최소화 |

---

## 📌 디버깅 대상 범위

| 시스템 | 주요 감시 항목 |
|--------|----------------|
| API (Python) | 검색/분석/sync/notify 응답 시간, 오류율 |
| UI (Next.js) | 검색 흐름, 오류 메시지 출력 유무 |
| 외부 API | 호출 실패율, 응답 딜레이, 예외 응답 코드 분석 |

## 모듈 경로 오류

### 증상

다음과 같은 오류 메시지가 표시됩니다:

```
Module not found: Can't resolve '@/lib/supabaseClient'
Module not found: Can't resolve '@/components/KeywordTable'
```

### 원인

Next.js 프로젝트에서는 `@/` 경로 별칭이 `tsconfig.json`에 설정된 경로에 따라 결정됩니다. 경로가 잘못 설정되었거나, 중첩된 디렉토리 구조로 인해 혼동이 발생할 수 있습니다.

### 해결책

1. **tsconfig.json 경로 설정 확인**

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]  // 루트 디렉토리 기준
       }
     }
   }
   ```

2. **import 경로 수정**

   ```typescript
   // 변경 전
   import { signIn } from '@/lib/supabaseClient';
   
   // 변경 후 (정확한 경로 지정)
   import { signIn } from '@/app/lib/supabaseClient';
   
   // 또는 상대 경로 사용 (권장)
   import { signIn } from '../../lib/supabaseClient';
   ```

3. **디렉토리 구조 확인**

   중첩된 app 디렉토리(`app/app/`)가 있는 경우 import 경로에 주의해야 합니다.
   
   ```
   - app/
     - page.tsx (import from './components/ComponentName')
     - components/
       - ComponentName.tsx
     - app/
       - login/
         - page.tsx (import from '../../lib/supabaseClient')
       - lib/
         - supabaseClient.ts
   ```

4. **파일 복사 및 일관성 유지**

   중첩 구조가 필요한 경우 동일한 파일을 두 위치에 유지하고 상대 경로를 사용합니다.
   
   ```
   app/lib/supabaseClient.ts
   app/app/lib/supabaseClient.ts (동일한 내용)
   ```

5. **Vercel 배포 환경 고려**

   Vercel 배포 환경과 로컬 개발 환경의 차이를 고려하여 경로 설정을 일관되게 유지합니다.
   배포 전 `next build` 명령어로 로컬에서 먼저 빌드를 테스트하는 것을 권장합니다.

---

## 인증 관련 오류

### 증상

로그인 또는 회원가입 시 다음과 같은 오류가 발생합니다:

1. "유효하지 않은 인증 정보입니다."
2. "인증 세션 생성 중 오류가 발생했습니다."

### 원인

1. Supabase 환경 변수가 설정되지 않았거나 잘못되었습니다.
2. AuthContext와 supabaseClient 간의 불일치가 있습니다.

### 해결책

1. **환경 변수 확인**

   `.env.local` 파일에 다음 변수가 올바르게 설정되어 있는지 확인합니다:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **AuthContext 구조 확인**

   `AuthContext.tsx`와 `supabaseClient.ts` 파일이 일관되게 설정되어 있는지 확인합니다.

---

## API 호출 오류

// ... 이전 내용 유지 ...

---

## Vercel 배포 오류

### 증상

Vercel에 배포 시 다음과 같은 빌드 오류가 발생합니다:

```
Failed to compile.
Module not found: Can't resolve '@/lib/supabaseClient'
```

### 원인

로컬 개발 환경과 Vercel 빌드 환경에서 경로 설정이 다를 수 있습니다.

### 해결책

1. **tsconfig.json의 경로 설정 확인**

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]  // 루트 디렉토리 기준으로 설정
       }
     }
   }
   ```

2. **Next.js 설정 확인**

   `next.config.js`의 설정이 경로와 관련된 문제를 일으키지 않는지 확인합니다.

3. **import 경로 수정**

   배포 환경에서 문제가 발생하는 경우, 상대 경로를 사용합니다:
   
   ```typescript
   // 변경 전
   import { signIn } from '@/app/lib/supabaseClient';
   
   // 변경 후
   import { signIn } from '../../lib/supabaseClient';
   ```

4. **파일 위치 확인**

   파일이 예상된 위치에 있는지 확인합니다. 중첩된 구조(`app/app/*`)가 혼동을 일으킬 수 있습니다.

5. **실제 사례 해결 방법**

   최근 경로 문제를 해결하기 위해 다음과 같은 조치를 취했습니다:
   
   - `tsconfig.json`의 경로를 루트 기준으로 변경: `"@/*": ["./*"]`
   - 중첩된 앱 디렉토리(`app/app/`)에 필요한 모듈 파일을 복사
   - 모든 import를 상대 경로로 변경
   - 로컬에서 `next build` 테스트 후 배포

---

## 추가 디버깅 팁

1. **Next.js 캐시 초기화**
   
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **의존성 재설치**
   
   ```bash
   npm ci
   ```

3. **환경 변수 확인**
   
   ```bash
   npx next env
   ```

4. **전체 프로젝트 구조 검토**

   [Architecture.md](./Architecture.md) 문서를 참조하여 파일이 올바른 위치에 있는지 확인합니다.

5. **경로와 모듈 의존성 검토**

   [Dependencies.md](./Dependencies.md) 문서를 참조하여 모듈 간 의존성을 확인합니다.
