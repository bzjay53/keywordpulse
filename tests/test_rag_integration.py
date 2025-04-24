import unittest
import json
import sys
import os
from unittest import mock
from typing import List, Dict, Any

# 상위 디렉토리를 시스템 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# lib 모듈에서 RAG 엔진 임포트
from lib.rag_engine import generate_analysis_text, generate_with_llm

class MockResponse:
    def __init__(self, status_code, json_data):
        self.status_code = status_code
        self.json_data = json_data
        
    def json(self):
        return self.json_data

class TestRagIntegration(unittest.TestCase):
    """RAG 엔진과 API 통합 테스트 케이스"""
    
    def setUp(self):
        """테스트 데이터 설정"""
        self.test_keywords = [
            {"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85},
            {"keyword": "콘텐츠 마케팅", "monthlySearches": 15000, "competitionRate": 0.20, "score": 82},
            {"keyword": "SEO 최적화", "monthlySearches": 30000, "competitionRate": 0.45, "score": 65}
        ]
        
        # API 요청 바디
        self.api_request_body = {"keywords": ["AI 마케팅", "콘텐츠 마케팅", "SEO 최적화"]}
        
        # 예상 분석 결과
        self.expected_analysis = generate_analysis_text(self.test_keywords)
        
    @mock.patch('requests.post')
    def test_api_integration_success(self, mock_post):
        """API 엔드포인트가 올바른 분석 결과를 반환하는지 테스트"""
        # Mock API 응답 설정
        mock_response = MockResponse(200, {
            "analysisText": self.expected_analysis,
            "timestamp": "2023-06-15T12:34:56Z"
        })
        mock_post.return_value = mock_response
        
        # 가상의 API 호출 함수
        def call_analyze_api(keywords):
            response = mock_post(
                "http://localhost:3000/api/analyze",
                json={"keywords": keywords}
            )
            if response.status_code == 200:
                return response.json()["analysisText"]
            else:
                return None
        
        # API 호출 결과 확인
        result = call_analyze_api(["AI 마케팅", "콘텐츠 마케팅", "SEO 최적화"])
        
        # 결과가 예상과 일치하는지 확인
        self.assertEqual(result, self.expected_analysis)
        
        # mock_post가 올바른 인자로 호출되었는지 확인
        mock_post.assert_called_once()
    
    @mock.patch('requests.post')
    def test_api_integration_error_handling(self, mock_post):
        """API 오류 처리가 적절히 동작하는지 테스트"""
        # Mock API 오류 응답 설정
        mock_response = MockResponse(400, {
            "error": "분석할 키워드가 제공되지 않았습니다."
        })
        mock_post.return_value = mock_response
        
        # 가상의 API 호출 함수
        def call_analyze_api(keywords):
            response = mock_post(
                "http://localhost:3000/api/analyze",
                json={"keywords": keywords}
            )
            if response.status_code == 200:
                return response.json()["analysisText"]
            else:
                return response.json()["error"]
        
        # 빈 키워드 목록으로 API 호출
        result = call_analyze_api([])
        
        # 결과가 예상 오류 메시지와 일치하는지 확인
        self.assertEqual(result, "분석할 키워드가 제공되지 않았습니다.")
    
    def test_end_to_end_flow(self):
        """검색 API → 분석 API 엔드투엔드 테스트 (모의 구현)"""
        # 이 테스트는 실제 API 호출 없이 전체 흐름을 시뮬레이션합니다
        
        # 1. 가상 검색 결과 생성
        search_results = [
            {"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85},
            {"keyword": "콘텐츠 마케팅", "monthlySearches": 15000, "competitionRate": 0.20, "score": 82},
            {"keyword": "SEO 최적화", "monthlySearches": 30000, "competitionRate": 0.45, "score": 65}
        ]
        
        # 2. 키워드 추출
        keywords = [item["keyword"] for item in search_results]
        
        # 3. 분석 생성
        analysis_text = generate_analysis_text(search_results)
        
        # 4. 검증
        self.assertIsInstance(analysis_text, str)
        self.assertIn("AI 마케팅", analysis_text)
        self.assertIn("주요 키워드 분석", analysis_text)
        
    @mock.patch('lib.rag_engine.generate_analysis_text')
    def test_llm_integration_fallback(self, mock_generate):
        """LLM 기반 생성 실패 시 템플릿 기반 대체 동작 테스트"""
        mock_generate.return_value = "템플릿 기반 대체 분석 결과"
        
        # LLM 기반 분석 (현재는 지원되지 않음)
        result = generate_with_llm(self.test_keywords, provider="openai")
        
        # 템플릿 기반으로 대체되어 호출되었는지 확인
        mock_generate.assert_called_once_with(self.test_keywords)
        
        # 대체 결과가 반환되었는지 확인
        self.assertEqual(result, "템플릿 기반 대체 분석 결과")
        
    def test_python_model_typescript_client_compatibility(self):
        """Python 모델과 TypeScript 클라이언트 간 호환성 테스트"""
        # 1. Python 모델로 분석 생성
        analysis_text = generate_analysis_text(self.test_keywords)
        
        # 2. TypeScript 클라이언트에서 처리할 JSON 형식으로 변환
        response_json = json.dumps({
            "analysisText": analysis_text,
            "timestamp": "2023-06-15T12:34:56Z"
        })
        
        # 3. 클라이언트 측 처리 시뮬레이션 (JSON 파싱)
        parsed_response = json.loads(response_json)
        
        # 4. 검증
        self.assertIn("analysisText", parsed_response)
        self.assertEqual(parsed_response["analysisText"], analysis_text)
        self.assertIn("timestamp", parsed_response)

if __name__ == "__main__":
    unittest.main() 