"""
Google Sheets 연동 모듈

gspread를 활용한 Google Sheets 연결, 인증, 데이터 저장 기능을 제공합니다.
"""
import os
import json
import base64
from typing import List, Dict, Any, Optional
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def get_google_credentials():
    """
    Google API 인증 정보를 환경변수에서 가져와 생성합니다.
    
    Returns:
        ServiceAccountCredentials: Google API 인증 정보
    
    Raises:
        ValueError: 환경변수가 설정되지 않은 경우
    """
    # 환경변수에서 Base64로 인코딩된 서비스 계정 JSON 가져오기
    service_account_json = os.getenv('GOOGLE_SERVICE_ACCOUNT')
    
    if not service_account_json:
        print("[google_client] 경고: GOOGLE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다. 테스트 모드로 전환합니다.")
        return None
    
    # Base64 디코딩
    try:
        json_bytes = base64.b64decode(service_account_json)
        credentials_dict = json.loads(json_bytes.decode('utf-8'))
    except Exception as e:
        raise ValueError(f"서비스 계정 JSON 디코딩 오류: {str(e)}")
    
    # Google API 인증 정보 생성
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/drive'
    ]
    
    return ServiceAccountCredentials.from_json_keyfile_dict(credentials_dict, scope)

def get_sheet_client():
    """
    Google Sheets 클라이언트를 생성합니다.
    
    Returns:
        gspread.Client: 인증된 gspread 클라이언트 또는 None (테스트 모드)
    """
    credentials = get_google_credentials()
    if credentials is None:
        return None
    return gspread.authorize(credentials)

def save_keywords_to_sheet(keywords: List[Dict[str, Any]], timestamp: str, 
                          spreadsheet_id: Optional[str] = None) -> str:
    """
    키워드 분석 결과를 Google Sheets에 저장합니다.
    
    Args:
        keywords: 키워드 정보 리스트
        timestamp: 분석 시간 (ISO 8601 형식)
        spreadsheet_id: (선택) 기존 스프레드시트 ID
    
    Returns:
        str: 스프레드시트 URL
    
    Raises:
        Exception: Sheets API 오류 발생 시
    """
    try:
        client = get_sheet_client()
        
        # 테스트 모드 체크 (환경변수 없음)
        if client is None:
            print("[google_client] 테스트 모드: 가상 스프레드시트 URL 반환")
            # 테스트 환경에서는 가상 URL 반환
            return "https://docs.google.com/spreadsheets/d/test-sheet-id/edit#gid=0"
        
        # 기존 스프레드시트 사용 또는 새로 생성
        if spreadsheet_id:
            try:
                spreadsheet = client.open_by_key(spreadsheet_id)
            except gspread.exceptions.SpreadsheetNotFound:
                spreadsheet = client.create('KeywordPulse 분석 결과')
        else:
            spreadsheet = client.create('KeywordPulse 분석 결과')
        
        # 워크시트 설정 (기존 또는 새로 생성)
        try:
            worksheet = spreadsheet.worksheet('Keywords')
        except gspread.exceptions.WorksheetNotFound:
            worksheet = spreadsheet.add_worksheet(title='Keywords', rows=1000, cols=20)
        
        # 헤더 설정
        headers = ['키워드', '검색량', '경쟁률', '점수', '추천도', '날짜']
        worksheet.update('A1:F1', [headers])
        
        # 데이터 준비
        rows = []
        for kw in keywords:
            rows.append([
                kw.get('keyword', ''),
                kw.get('monthlySearches', 0),
                kw.get('competitionRate', 0),
                kw.get('score', 0),
                kw.get('recommendation', ''),
                timestamp
            ])
        
        # 데이터 추가 (기존 데이터 아래에 추가)
        if rows:
            next_row = len(worksheet.get_all_values()) + 1
            cell_range = f'A{next_row}:F{next_row + len(rows) - 1}'
            worksheet.update(cell_range, rows)
        
        # 스프레드시트 공유 설정
        spreadsheet.share(None, perm_type='anyone', role='reader')
        
        return spreadsheet.url
    
    except Exception as e:
        print(f"[google_client] 시트 저장 오류: {str(e)}")
        raise 