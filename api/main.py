from fastapi import FastAPI, HTTPException
from typing import List
import os
from datetime import datetime

# 유틸리티 모듈 임포트
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib.models import (
    SearchRequest, SearchResponse, 
    AnalyzeRequest, AnalyzeResponse,
    SyncRequest, SyncResponse,
    NotifyRequest, NotifyResponse
)
from lib.search_utils import search_keywords, get_cached_results, save_to_cache
from lib.rag_engine import generate_analysis_text
from lib.google_client import save_keywords_to_sheet
from lib.telegram_client import send_telegram_message, format_keywords_message

app = FastAPI(
    title="KeywordPulse API",
    version="1.0.0",
    description="서버리스 환경에서 동작하는 키워드 분석 API"
)

# --- API 엔드포인트 ---
@app.post("/api/search", response_model=SearchResponse)
async def search_keywords_api(request: SearchRequest):
    """
    키워드 검색 및 분석을 수행합니다.
    """
    try:
        print(f"[search] 키워드 검색 시작: {request.keyword}")
        # 캐시 확인
        cached_results = get_cached_results(request.keyword)
        if cached_results:
            print(f"[search] 캐시된 결과 사용: {request.keyword}")
            return SearchResponse(keywords=cached_results, cached=True)
        
        # 신규 검색 수행
        keywords_data = search_keywords(request.keyword)
        
        # 캐시에 저장
        save_to_cache(request.keyword, keywords_data)
        
        print(f"[search] 검색 완료: {len(keywords_data)}개 키워드 발견")
        return SearchResponse(keywords=keywords_data, cached=False)
    except Exception as e:
        print(f"[search] 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def generate_analysis_api(request: AnalyzeRequest):
    """
    RAG 기반으로 키워드 분석 텍스트를 생성합니다.
    """
    try:
        print(f"[analyze] 분석 시작: {len(request.keywords)}개 키워드")
        
        # 분석 텍스트 생성
        keywords_info = []
        for keyword in request.keywords:
            # 간소화를 위해 임시 데이터 생성
            keywords_info.append({
                "keyword": keyword,
                "monthlySearches": 10000,  # 실제로는 DB나 검색 결과에서 가져와야 함
                "competitionRate": 0.5,
                "score": 75
            })
        
        analysis_text = generate_analysis_text(keywords_info)
        
        print(f"[analyze] 분석 완료: {len(analysis_text)} 글자")
        return AnalyzeResponse(analysisText=analysis_text)
    except Exception as e:
        print(f"[analyze] 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync", response_model=SyncResponse)
async def sync_to_sheets_api(request: SyncRequest):
    """
    키워드 분석 결과를 Google Sheets에 저장합니다.
    """
    try:
        print(f"[sync] 구글 시트 저장 시작: {len(request.keywords)}개 키워드")
        
        # Google Sheets에 저장
        spreadsheet_url = save_keywords_to_sheet(
            [dict(kw) for kw in request.keywords],
            request.timestamp
        )
        
        print(f"[sync] 저장 완료: {spreadsheet_url}")
        return SyncResponse(success=True, spreadsheetUrl=spreadsheet_url)
    except Exception as e:
        print(f"[sync] 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notify", response_model=NotifyResponse)
async def send_notification_api(request: NotifyRequest):
    """
    분석 결과를 Telegram으로 전송합니다.
    """
    try:
        print(f"[notify] 텔레그램 알림 전송 시작")
        
        # Telegram으로 전송
        response = send_telegram_message(request.analysisText)
        
        # API 응답에서 message_id 추출
        message_id = str(response.get('result', {}).get('message_id', ''))
        
        print(f"[notify] 전송 완료: message_id={message_id}")
        return NotifyResponse(success=True, messageId=message_id)
    except Exception as e:
        print(f"[notify] 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Root 경로 추가
@app.get("/")
async def root():
    return {"message": "KeywordPulse API가 실행 중입니다. /api/search, /api/analyze, /api/sync, /api/notify 엔드포인트를 사용하세요."} 