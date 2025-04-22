# 🛠️ 서버리스 함수 코드 스켈레톤

아래는 Vercel Python Function으로 배포할 수 있도록 **FastAPI** 기반의 서버리스 API 스켈레톤 예시입니다. 각 endpoint는 `/api` 경로 아래에 배치됩니다.

---

## 📁 디렉토리 구조

```
/project-root
├── api/
│   └── main.py
├── requirements.txt
└── vercel.json
```

---

## 🔹 `api/main.py`
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os

app = FastAPI(
    title="KeywordPulse API",
    version="1.0.0",
    description="서버리스 환경에서 동작하는 키워드 분석 API"
)

# --- 모델 정의 ---
class SearchRequest(BaseModel):
    keyword: str

class KeywordInfo(BaseModel):
    keyword: str
    monthlySearches: int
    competitionRate: float
    score: int
    recommendation: str

class SearchResponse(BaseModel):
    keywords: List[KeywordInfo]
    cached: bool

class AnalyzeRequest(BaseModel):
    keywords: List[str]

class AnalyzeResponse(BaseModel):
    analysisText: str

class SyncRequest(BaseModel):
    keywords: List[KeywordInfo]
    timestamp: str  # ISO 8601

class SyncResponse(BaseModel):
    success: bool
    spreadsheetUrl: str = None

class NotifyRequest(BaseModel):
    analysisText: str

class NotifyResponse(BaseModel):
    success: bool
    messageId: str = None

# --- API 엔드포인트 ---
@app.post("/api/search", response_model=SearchResponse)
async def search_keywords(request: SearchRequest):
    try:
        # TODO: 기존 libwys의 검색/점수화 로직 호출
        keywords_data = []  # 예: [{'keyword':'...', 'monthlySearches':0, ...}, ...]
        cached = False
        return SearchResponse(keywords=keywords_data, cached=cached)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def generate_analysis(request: AnalyzeRequest):
    try:
        # TODO: rag_system.generate_text_from_keywords 로직 호출
        analysis = "분석 결과 텍스트"
        return AnalyzeResponse(analysisText=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync", response_model=SyncResponse)
async def sync_to_sheets(request: SyncRequest):
    try:
        # TODO: gspread로 Google Sheets에 저장
        spreadsheet_url = "https://docs.google.com/..."
        return SyncResponse(success=True, spreadsheetUrl=spreadsheet_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notify", response_model=NotifyResponse)
async def send_notification(request: NotifyRequest):
    try:
        # TODO: Telegram Bot API 호출
        message_id = "1234567890"
        return NotifyResponse(success=True, messageId=message_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🔹 `requirements.txt`
```
fastapi
uvicorn
pydantic
requests
gspread
oauth2client
python-telegram-bot
```

---

> **참고**:
> - Vercel Python Functions는 ASGI 앱(예: FastAPI)을 지원합니다.  
> - `vercel.json`에 빌드 및 런타임 설정을 추가하여 Python 런타임을 지정하세요.  
> - 필요 시 `uvicorn` 대신 내장 ASGI 런타임 사용 가능합니다.

