# 🚀 릴리즈 노트 및 배포 체크리스트 (KeywordPulse)

이 문서는 KeywordPulse의 주요 버전 릴리즈 정보 및 안정적인 프로덕션 배포를 위한 사전/사후 점검 항목을 포함합니다.

---

## 📌 버전 관리 정책
- **Semantic Versioning (semver)** 사용
  - `MAJOR.MINOR.PATCH` 형식
  - 예: `v1.0.0` (초기 배포), `v1.1.0` (기능 추가), `v1.1.1` (버그 수정)

---

## 📦 릴리즈 노트 예시

### ✅ v1.0.0 (2025-05-01)
- KeywordPulse MVP 배포
- 기능 목록:
  - 키워드 검색 및 추천 점수 계산 API
  - RAG 기반 텍스트 생성 API
  - Google Sheets 동기화 API
  - Telegram 알림 API
  - Supabase Auth 기반 로그인 기능 (이메일/비밀번호)
  - 반응형 웹 UI (Next.js + TailwindCSS)
  - Vercel 서버리스 배포 및 Analytics 적용

---

## 📋 배포 체크리스트

### 🔧 개발 환경 준비
- [x] `.env` 또는 Vercel 환경변수 구성 완료 (Sheets, Telegram, Supabase)
- [x] `vercel.json`, `requirements.txt`, `package.json` 최신화 확인
- [x] Supabase Auth, DB, RLS 설정 적용 확인

### 🧪 테스트 점검
- [x] `pytest`, `Playwright` 또는 `Cypress` 테스트 전 항목 통과
- [x] Supabase 로그인 테스트 (가입/로그인/로그아웃)
- [x] Sheets/Telegram 연동 API 응답 테스트

### 🚀 배포 준비
- [x] GitHub main 브랜치 최신 코드 반영
- [x] Vercel Preview URL에서 사전 점검 완료
- [x] Favicon, meta 태그, OG 이미지 등 SEO 정보 등록

### 🛠 운영 점검
- [x] Sentry 프로젝트 연결 및 오류 캡처 확인
- [x] Vercel Logs 및 Analytics 확인
- [x] Google Sheets 연결 시도 및 기록 확인

### 🧑‍💻 사용자 관점 테스트
- [x] 키워드 입력 → 분석 완료 → 저장/알림 흐름 테스트
- [x] 모바일, 태블릿, 데스크탑 환경 점검
- [x] 회원가입 → 즐겨찾기 기능 정상 여부 확인 (선택 기능 시)

---

## ⛑ 롤백 플랜

| 상황 | 대응 |
|------|------|
| API 응답 오류 발생 | GitHub 이전 태그로 되돌린 후 재배포 (`vercel --prod`) |
| 인증 문제 발생 | Supabase 대시보드에서 직접 사용자 관리 or 키 초기화 |
| 기능 작동 중단 | Vercel 기능 롤백 or 긴급 `hotfix/patch` 브랜치로 배포 |

---

## 📂 Git 태그 예시

```bash
git tag -a v1.0.0 -m "MVP 프로덕션 배포"
git push origin v1.0.0
```

> CI에서 태그 Push 감지 시 자동 배포 구성 가능 (Vercel, GitHub Actions)

---

## 🧭 향후 릴리즈 계획 (로드맵 기반)

| 버전 | 예정 일자 | 내용 |
|-------|-----------|------|
| v1.1.0 | 2025-05-15 | 사용자별 즐겨찾기 키워드 저장 기능 |
| v1.2.0 | 2025-05-22 | Google Trends 그래프 시각화 연동 |
| v1.3.0 | 2025-06-01 | GPT 기반 자연어 분석 모델 연동 + PDF 보고서 생성 |

---