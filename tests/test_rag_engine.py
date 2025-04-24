import unittest
import sys
import os
from unittest import mock
from typing import List, Dict, Any

# 상위 디렉토리를 시스템 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# lib 모듈에서 RAG 엔진 임포트
from lib.rag_engine import generate_analysis_text, generate_with_llm

class TestRagEngine(unittest.TestCase):
    """RAG 엔진 테스트 케이스"""
    
    def setUp(self):
        """테스트 데이터 설정"""
        self.test_keywords = [
            {"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85},
            {"keyword": "디지털 마케팅 전략", "monthlySearches": 18000, "competitionRate": 0.35, "score": 78},
            {"keyword": "SEO 최적화", "monthlySearches": 30000, "competitionRate": 0.45, "score": 65},
            {"keyword": "소셜 미디어 광고", "monthlySearches": 22000, "competitionRate": 0.30, "score": 75},
            {"keyword": "콘텐츠 마케팅", "monthlySearches": 15000, "competitionRate": 0.20, "score": 82}
        ]
        
        self.empty_keywords = []
        
    def test_generate_analysis_text(self):
        """generate_analysis_text 함수가 올바른 분석 텍스트를 생성하는지 테스트"""
        result = generate_analysis_text(self.test_keywords)
        
        # 결과가 문자열인지 확인
        self.assertIsInstance(result, str)
        
        # 결과에 예상 텍스트가 포함되어 있는지 확인
        self.assertIn("AI 마케팅", result)
        self.assertIn("주요 키워드 분석", result)
        self.assertIn("추천 전략", result)
        
        # 강력 추천 키워드가 결과에 포함되어 있는지 확인
        self.assertIn("🟢 강력 추천", result)
        
        # 점수가 포함되어 있는지 확인
        self.assertIn("점수 85", result)
        
    def test_empty_keywords(self):
        """키워드 목록이 비어있을 때 적절한 메시지를 반환하는지 테스트"""
        result = generate_analysis_text(self.empty_keywords)
        self.assertEqual(result, "분석할 키워드가 없습니다.")
        
    def test_format_and_structure(self):
        """결과 텍스트가 마크다운 형식을 따르는지 테스트"""
        result = generate_analysis_text(self.test_keywords)
        
        # 마크다운 헤더 포맷 확인
        self.assertIn("##", result)
        
        # 마크다운 리스트 포맷 확인
        self.assertIn("- **", result)
        
    def test_generate_with_llm_default_template(self):
        """generate_with_llm 함수가 기본 템플릿 모드에서 올바르게 작동하는지 테스트"""
        result = generate_with_llm(self.test_keywords, provider="template")
        
        # generate_analysis_text와 동일한 결과를 반환하는지 확인
        expected = generate_analysis_text(self.test_keywords)
        self.assertEqual(result, expected)
        
    @mock.patch('lib.rag_engine.generate_analysis_text')
    def test_generate_with_llm_calls_template(self, mock_generate):
        """generate_with_llm이 template 프로바이더로 호출될 때 generate_analysis_text를 호출하는지 테스트"""
        mock_generate.return_value = "Mock 분석 결과"
        
        result = generate_with_llm(self.test_keywords, provider="template")
        
        # generate_analysis_text가 호출되었는지 확인
        mock_generate.assert_called_once_with(self.test_keywords)
        
        # 반환값이 mock_generate의 반환값과 일치하는지 확인
        self.assertEqual(result, "Mock 분석 결과")

    def test_high_score_strategy_recommendation(self):
        """높은 점수의 키워드가 있을 때 추천 전략 섹션이 포함되는지 테스트"""
        # 80점 이상인 키워드가 2개인 테스트 데이터
        test_data = [
            {"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85},
            {"keyword": "콘텐츠 마케팅", "monthlySearches": 15000, "competitionRate": 0.20, "score": 82},
            {"keyword": "SEO 최적화", "monthlySearches": 30000, "competitionRate": 0.45, "score": 65}
        ]
        
        result = generate_analysis_text(test_data)
        
        # 추천 전략 섹션이 있는지 확인
        self.assertIn("## 추천 전략", result)
        
        # 80점 이상인 키워드 수가 언급되었는지 확인
        self.assertIn("2개 키워드", result)
        
    def test_no_high_score_strategy(self):
        """높은 점수의 키워드가 없을 때 추천 전략 섹션이 없는지 테스트"""
        # 모든 키워드가 80점 미만인 테스트 데이터
        test_data = [
            {"keyword": "디지털 마케팅 전략", "monthlySearches": 18000, "competitionRate": 0.35, "score": 78},
            {"keyword": "SEO 최적화", "monthlySearches": 30000, "competitionRate": 0.45, "score": 65},
            {"keyword": "소셜 미디어 광고", "monthlySearches": 22000, "competitionRate": 0.30, "score": 75}
        ]
        
        result = generate_analysis_text(test_data)
        
        # 추천 전략 섹션이 없는지 확인
        self.assertNotIn("## 추천 전략", result)

if __name__ == "__main__":
    unittest.main() 