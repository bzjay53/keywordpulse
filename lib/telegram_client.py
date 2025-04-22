"""
Telegram 알림 클라이언트

텔레그램 봇을 통한 메시지 전송 기능을 제공합니다.
"""
import os
import requests
from typing import Dict, Any, Optional

def send_telegram_message(message: str) -> Dict[str, Any]:
    """
    텔레그램 봇을 통해 메시지를 전송합니다.
    
    Args:
        message: 전송할 메시지 내용
    
    Returns:
        Dict: 텔레그램 API 응답
    
    Raises:
        ValueError: 환경변수가 설정되지 않은 경우
        Exception: 텔레그램 API 오류 발생 시
    """
    # 환경변수에서 봇 토큰 및 채팅 ID 가져오기
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        raise ValueError("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다.")
    
    # 텔레그램 API URL
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    # 메시지 데이터
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'Markdown'
    }
    
    try:
        # API 요청 전송
        response = requests.post(url, json=payload)
        response.raise_for_status()  # 4xx, 5xx 오류 시 예외 발생
        
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f"[telegram_client] 메시지 전송 오류: {str(e)}")
        if response := getattr(e, 'response', None):
            print(f"[telegram_client] 응답 데이터: {response.text}")
        raise Exception(f"텔레그램 메시지 전송 실패: {str(e)}")
        
def format_keywords_message(keywords: list, analysis_text: Optional[str] = None) -> str:
    """
    키워드 목록을 텔레그램 메시지 형식으로 포맷팅합니다.
    
    Args:
        keywords: 키워드 목록
        analysis_text: (선택) RAG 생성 분석 텍스트
    
    Returns:
        str: 포맷팅된 메시지
    """
    if analysis_text:
        return f"{analysis_text}\n\n*KeywordPulse 자동 분석 결과*"
    
    # 분석 텍스트가 없는 경우, 키워드 데이터로 간단 메시지 생성
    message = "*KeywordPulse 키워드 분석 결과*\n\n"
    
    # 상위 5개 키워드만 추출
    top_keywords = sorted(keywords, key=lambda x: x.get('score', 0), reverse=True)[:5]
    
    for kw in top_keywords:
        message += f"• *{kw.get('keyword', '')}*: "
        message += f"검색량 {kw.get('monthlySearches', 0):,}회, "
        message += f"점수 {kw.get('score', 0)}점\n"
    
    message += "\n자세한 분석은 KeywordPulse 앱에서 확인하세요."
    
    return message 