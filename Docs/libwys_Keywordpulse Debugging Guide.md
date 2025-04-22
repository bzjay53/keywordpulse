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

---

## 📌 디버깅 대상 범위

| 시스템 | 주요 감시 항목 |
|--------|----------------|
| API (Python) | 검색/분석/sync/notify 응답 시간, 오류율 |
| UI (Next.js) | 검색 흐름, 오류 메시지 출력 유무 |
| 외부 API | 호출 실패율, 응답 딜레이, 예외 응답 코드 분석 |
