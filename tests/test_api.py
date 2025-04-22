"""
KeywordPulse API 기능 테스트 스크립트

환경 변수와 API 기능이 제대로 동작하는지 확인합니다.
"""
import os
import json
import requests
from datetime import datetime
import unittest
import sys

# 프로젝트 루트 디렉토리 추가 (CI 환경에서 필요)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.api.routes import search_keywords, analyze_keywords

# 테스트 설정
BASE_URL = "http://localhost:3001"
KEYWORD = "AI 마케팅"

def test_search_api():
    """키워드 검색 API를 테스트합니다."""
    print("\n===== 키워드 검색 API 테스트 =====")
    
    endpoint = f"{BASE_URL}/api/search"
    payload = {"keyword": KEYWORD}
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"상태코드: {response.status_code}")
        print(f"캐시 사용 여부: {data['cached']}")
        print(f"발견된 키워드 수: {len(data['keywords'])}")
        
        if data['keywords']:
            print("\n상위 3개 키워드:")
            for i, kw in enumerate(sorted(data['keywords'], key=lambda x: x['score'], reverse=True)[:3]):
                print(f"  {i+1}. {kw['keyword']} - 점수: {kw['score']}, 검색량: {kw['monthlySearches']}, 경쟁률: {kw['competitionRate']:.2f}")
        
        return data['keywords']
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        return None

def test_analyze_api(keywords):
    """분석 텍스트 생성 API를 테스트합니다."""
    print("\n===== 분석 텍스트 생성 API 테스트 =====")
    
    if not keywords:
        print("이전 검색 결과가 없어 테스트를 건너뜁니다.")
        return None
    
    endpoint = f"{BASE_URL}/api/analyze"
    payload = {"keywords": [kw['keyword'] for kw in keywords]}
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"상태코드: {response.status_code}")
        print(f"분석 텍스트 길이: {len(data['analysisText'])} 글자")
        print("\n--- 분석 텍스트 ---")
        print(data['analysisText'])
        print("----------------")
        
        return data['analysisText']
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        return None

def test_sync_api(keywords):
    """Google Sheets 동기화 API를 테스트합니다."""
    print("\n===== Google Sheets 동기화 API 테스트 =====")
    
    if not keywords:
        print("이전 검색 결과가 없어 테스트를 건너뜁니다.")
        return False
    
    if not os.getenv('GOOGLE_SERVICE_ACCOUNT'):
        print("경고: GOOGLE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.")
    
    endpoint = f"{BASE_URL}/api/sync"
    payload = {
        "keywords": keywords,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"상태코드: {response.status_code}")
        print(f"저장 성공 여부: {data['success']}")
        
        if data['success'] and data.get('spreadsheetUrl'):
            print(f"스프레드시트 URL: {data['spreadsheetUrl']}")
        
        return data['success']
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        return False

def test_notify_api(analysis_text):
    """Telegram 알림 API를 테스트합니다."""
    print("\n===== Telegram 알림 API 테스트 =====")
    
    if not analysis_text:
        print("이전 분석 결과가 없어 테스트를 건너뜁니다.")
        return False
    
    if not os.getenv('TELEGRAM_BOT_TOKEN') or not os.getenv('TELEGRAM_CHAT_ID'):
        print("경고: TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다.")
    
    endpoint = f"{BASE_URL}/api/notify"
    payload = {"analysisText": analysis_text}
    
    try:
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"상태코드: {response.status_code}")
        print(f"전송 성공 여부: {data['success']}")
        
        if data['success'] and data.get('messageId'):
            print(f"메시지 ID: {data['messageId']}")
        
        return data['success']
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        return False

def run_all_tests():
    """모든 API 테스트를 실행합니다."""
    print("KeywordPulse API 테스트 시작...")
    
    # 1. 검색 API 테스트
    keywords = test_search_api()
    
    # 2. 분석 API 테스트
    analysis_text = test_analyze_api(keywords)
    
    # 3. Google Sheets 동기화 API 테스트
    sync_success = test_sync_api(keywords)
    
    # 4. Telegram 알림 API 테스트
    notify_success = test_notify_api(analysis_text)
    
    # 결과 요약
    print("\n===== 테스트 결과 요약 =====")
    print(f"검색 API: {'성공' if keywords else '실패'}")
    print(f"분석 API: {'성공' if analysis_text else '실패'}")
    print(f"동기화 API: {'성공' if sync_success else '실패'}")
    print(f"알림 API: {'성공' if notify_success else '실패'}")

class TestAPI(unittest.TestCase):
    """API 엔드포인트에 대한 테스트 케이스"""
    
    def test_search_keywords(self):
        """키워드 검색 API 테스트"""
        # 테스트 요청 데이터
        test_request = {
            "body": json.dumps({"keyword": "AI 마케팅"})
        }
        
        # API 함수 호출
        response = search_keywords(test_request)
        
        # 응답 검증
        self.assertEqual(response["statusCode"], 200)
        
        body = json.loads(response["body"])
        self.assertIn("keywords", body)
        self.assertIsInstance(body["keywords"], list)
        
        if len(body["keywords"]) > 0:
            # 첫 번째 키워드 항목 구조 검증
            first_keyword = body["keywords"][0]
            self.assertIn("keyword", first_keyword)
            self.assertIn("volume", first_keyword)
    
    def test_analyze_keywords(self):
        """키워드 분석 API 테스트"""
        # 테스트 요청 데이터
        test_request = {
            "body": json.dumps({
                "keywords": ["AI 마케팅", "콘텐츠 전략", "디지털 마케팅"]
            })
        }
        
        # API 함수 호출
        response = analyze_keywords(test_request)
        
        # 응답 검증
        self.assertEqual(response["statusCode"], 200)
        
        body = json.loads(response["body"])
        self.assertIn("analysisText", body)
        self.assertIsInstance(body["analysisText"], str)
        self.assertTrue(len(body["analysisText"]) > 0)

if __name__ == "__main__":
    unittest.main() 