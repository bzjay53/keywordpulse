"""
API 모델 정의

Pydantic 모델을 사용한 요청/응답 데이터 구조 정의
"""
from pydantic import BaseModel
from typing import List, Optional

# 검색 API 모델
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

# 분석 API 모델
class AnalyzeRequest(BaseModel):
    keywords: List[str]

class AnalyzeResponse(BaseModel):
    analysisText: str

# 동기화 API 모델
class SyncRequest(BaseModel):
    keywords: List[KeywordInfo]
    timestamp: str  # ISO 8601

class SyncResponse(BaseModel):
    success: bool
    spreadsheetUrl: Optional[str] = None

# 알림 API 모델
class NotifyRequest(BaseModel):
    analysisText: str

class NotifyResponse(BaseModel):
    success: bool
    messageId: Optional[str] = None 