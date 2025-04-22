# ⚙️ Vercel 배포 설정 가이드

KeywordPulse 프로젝트를 Vercel에 서버리스 환경으로 배포하기 위한 설정 파일 및 환경변수 구성을 설명합니다.

---

## 📁 디렉토리 구조 예시

```
/project-root
├── api/
│   └── main.py
├── app/ (또는 web/)
│   └── page.tsx
├── public/
├── requirements.txt
├── vercel.json
└── README.md
```

---

## 📄 `vercel.json`

```jsonc
{
  "version": 2,
  "functions": {
    "api/*.py": {
      "runtime": "python3.10",
      "maxDuration": 30
    }
  },
  "builds": [
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    },
    {
      "src": "app/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "/app/$1"
    }
  ]
}
```

- **version**: Vercel 플랫폼 버전
- **functions**: Python 함수 런타임 및 실행 시간 제한 설정
- **builds**: 빌드 단계 정의
  - `@vercel/python`: Python serverless functions
  - `@vercel/next`: Next.js 프론트엔드 번들링
- **routes**: 커스텀 경로 매핑
  - `/api/*` 요청은 Python 함수로
  - 그 외 경로는 Next.js 앱으로 라우팅

---

## 📜 `requirements.txt`

```txt
fastapi
uvicorn
pydantic
requests
gspread
oauth2client
python-telegram-bot
```

- Vercel은 `requirements.txt`를 자동으로 감지하여 필요한 패키지를 설치합니다.
- Python 3.10 런타임을 기준으로 호환 가능한 버전을 명시하세요.

---

## 🔐 환경 변수 설정 (Vercel Dashboard)

| Key                      | 설명                        | 예시                                         |
| ------------------------ | ------------------------- | ------------------------------------------ |
| GOOGLE\_SERVICE\_ACCOUNT | Base64 인코딩된 서비스 계정 JSON   | (Base64를 이용해 credentials.json 인코딩 값)       |
| TELEGRAM\_BOT\_TOKEN     | Telegram Bot API 토큰       | 1234567890\:ABCDefGhIJK\_lmnopqrst\_uvWXYZ |
| TELEGRAM\_CHAT\_ID       | 메시지를 보낼 채팅 ID             | -1001234567890                             |
| OPENAI\_API\_KEY (선택)    | RAG 고도화를 위한 OpenAI API 키  | sk-...                                     |
| VERCEL\_ENV              | "production" 또는 "preview" | production                                 |

- Vercel Dashboard > 프로젝트 설정 > Environment Variables 에서 추가
- Production 환경, Preview 환경 별도 관리 가능

---

## 🚀 배포 절차

1. **GitHub 연동**: Vercel 프로젝트를 GitHub 리포지토리와 연결
2. **브랜치 Push**: `main` 브랜치에 커밋 후 Push
3. **자동 빌드 & 배포**: Vercel이 `vercel.json`에 따라 빌드 및 배포 수행
4. **배포 URL 확인**: Vercel 대시보드에서 배포된 URL 확인
5. **테스트**: API 엔드포인트 및 UI 정상 동작 확인

---

## 🛠️ 추가 팁

- **Preview 배포**: PR마다 자동으로 Preview 환경 생성 가능
- **로그 확인**: Vercel Dashboard > Functions > Logs 에서 함수 실행 로그 확인
- **Timeout 조정**: `maxDuration` 값을 늘려 장시간 실행 로직 허용 가능 (최대 900초)
- **빌드 캐시**: `pip cache`를 활용하여 빌드 속도를 최적화

---

> 위 설정 파일과 절차를 참고하여, Cursor AI 기반 KeywordPulse 프로젝트를 Vercel에 손쉽게 배포할 수 있습니다. 문제가 발생하면 Vercel Docs([https://vercel.com/docs)를](https://vercel.com/docs\)를) 참조하세요.

