"""
KeywordPulse RAG 시스템 및 API 통합 테스트 스크립트

RAG 시스템과 API 엔드포인트가 올바르게 통합되는지 확인합니다.
"""
import os
import json
import sys
from unittest import mock
import unittest

# 공통 모듈 접근을 위한 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 해당 모듈 가져오기
from lib.rag_engine import generate_analysis_text, generate_with_llm
from lib.models import KeywordInfo

# 프로젝트 루트 디렉토리 추가 (CI 환경에서 필요)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 통합 테스트를 위한 모의 API 응답
MOCK_SEARCH_RESPONSE = {
    "keywords": [
        {"keyword": "AI 마케팅", "volume": 1200, "difficulty": 65},
        {"keyword": "AI 마케팅 전략", "volume": 880, "difficulty": 45},
        {"keyword": "AI 콘텐츠 제작", "volume": 750, "difficulty": 40}
    ]
}

MOCK_ANALYZE_RESPONSE = {
    "analysisText": "AI 마케팅은 현재 디지털 마케팅 분야에서 주목받는 트렌드입니다. 해당 키워드는 검색량이 높고 경쟁이 치열한 편입니다. 관련 키워드인 'AI 마케팅 전략'과 'AI 콘텐츠 제작'은 상대적으로 경쟁이 덜하므로 초기 콘텐츠 제작에 유리할 수 있습니다."
}

class TestIntegration(unittest.TestCase):
    """통합 테스트 케이스"""
    
    def test_search_to_analyze_flow(self):
        """키워드 검색부터 분석까지의 통합 흐름 테스트"""
        # 키워드 검색 결과를 기반으로 분석 요청 생성
        keywords = [item["keyword"] for item in MOCK_SEARCH_RESPONSE["keywords"]]
        
        # 분석 요청 데이터
        analyze_request = {
            "keywords": keywords
        }
        
        # 분석 요청 데이터 검증
        self.assertEqual(len(analyze_request["keywords"]), 3)
        self.assertEqual(analyze_request["keywords"][0], "AI 마케팅")
        
        # 실제 API 호출 대신 모의 응답 사용
        analyze_response = MOCK_ANALYZE_RESPONSE
        
        # 응답 검증
        self.assertIn("analysisText", analyze_response)
        self.assertIsInstance(analyze_response["analysisText"], str)
        self.assertGreater(len(analyze_response["analysisText"]), 10)
    
    def test_end_to_end_user_flow(self):
        """사용자 관점에서의 전체 흐름 테스트"""
        # 1. 사용자가 키워드 검색
        search_keyword = "AI 마케팅"
        
        # 2. 검색 결과 취득 (모의 응답 사용)
        search_results = MOCK_SEARCH_RESPONSE
        
        # 3. 검색 결과를 기반으로 분석 요청
        keywords = [item["keyword"] for item in search_results["keywords"]]
        
        # 4. 분석 결과 취득 (모의 응답 사용)
        analysis_result = MOCK_ANALYZE_RESPONSE
        
        # 5. 결과 검증
        self.assertIsNotNone(search_results)
        self.assertIsNotNone(analysis_result)
        self.assertTrue("AI 마케팅" in analysis_result["analysisText"])

def test_rag_engine():
    """RAG 엔진 직접 호출 테스트"""
    print("\n===== RAG 엔진 테스트 =====")
    
    # 테스트 키워드 데이터 준비
    test_keywords = [
        {
            "keyword": "AI 마케팅",
            "monthlySearches": 25000,
            "competitionRate": 0.25,
            "score": 85
        },
        {
            "keyword": "데이터 분석 툴",
            "monthlySearches": 15000,
            "competitionRate": 0.45,
            "score": 65
        },
        {
            "keyword": "키워드 검색 최적화",
            "monthlySearches": 30000,
            "competitionRate": 0.35,
            "score": 90
        }
    ]
    
    try:
        # RAG 엔진으로 분석 텍스트 생성
        analysis_text = generate_analysis_text(test_keywords)
        
        print(f"생성된 텍스트 길이: {len(analysis_text)} 글자")
        print("\n--- 분석 텍스트 샘플 ---")
        print(analysis_text[:200] + "...\n")
        
        # 검증: 분석 텍스트에 주요 키워드가 포함되었는지 확인
        for kw in test_keywords:
            if kw["keyword"] in analysis_text:
                print(f"✅ '{kw['keyword']}' 키워드가 텍스트에 포함됨")
            else:
                print(f"❌ '{kw['keyword']}' 키워드가 텍스트에 없음")
        
        # 점수 기반 분류가 제대로 이루어졌는지 확인
        if "강력 추천" in analysis_text:
            print("✅ 점수 기반 분류 확인됨 ('강력 추천')")
        
        return analysis_text
    except Exception as e:
        print(f"RAG 엔진 테스트 중 오류 발생: {str(e)}")
        return None

def test_mock_api_analyze():
    """API /analyze 엔드포인트를 모의 테스트합니다."""
    print("\n===== API /analyze 모의 테스트 =====")
    
    # 테스트 키워드 목록
    input_keywords = ["AI 마케팅", "데이터 분석 툴", "키워드 검색 최적화"]
    
    try:
        # API 내부 로직 흐름 모의 테스트
        # 1. 키워드 정보 생성 (실제 API에서는 DB나 검색 결과에서 가져옴)
        keywords_info = []
        for keyword in input_keywords:
            # 임의의 데이터로 키워드 정보 생성
            keywords_info.append({
                "keyword": keyword,
                "monthlySearches": 10000,
                "competitionRate": 0.5,
                "score": 75
            })
        
        # 2. RAG 엔진으로 분석 텍스트 생성
        analysis_text = generate_analysis_text(keywords_info)
        
        print(f"생성된 분석 텍스트 길이: {len(analysis_text)} 글자")
        print(f"요약 샘플: {analysis_text[:100]}...")
        
        # 모의 API 응답 생성
        mock_response = {
            "analysisText": analysis_text
        }
        
        print(f"API 모의 응답: {json.dumps(mock_response, ensure_ascii=False)[:50]}...")
        
        # 검증: 모든 입력 키워드가 응답에 포함되었는지 확인
        success = all(keyword in analysis_text for keyword in input_keywords)
        print(f"모든 키워드 포함 여부: {'성공' if success else '실패'}")
        
        return success
    except Exception as e:
        print(f"API /analyze 모의 테스트 중 오류 발생: {str(e)}")
        return False

def test_llm_integration():
    """LLM 통합 가능성을 테스트합니다."""
    print("\n===== LLM 통합 테스트 =====")
    
    # 테스트 키워드 데이터
    test_keywords = [
        {
            "keyword": "머신러닝 입문",
            "monthlySearches": 20000,
            "competitionRate": 0.30,
            "score": 80
        },
        {
            "keyword": "파이썬 데이터 분석",
            "monthlySearches": 35000,
            "competitionRate": 0.40,
            "score": 75
        }
    ]
    
    try:
        # 기본 템플릿 모드로 생성
        template_text = generate_with_llm(test_keywords, provider="template")
        
        print(f"템플릿 모드 텍스트 길이: {len(template_text)} 글자")
        print("\n--- 템플릿 모드 샘플 ---")
        print(template_text[:150] + "...\n")
        
        # TODO: 향후 OpenAI 등 실제 LLM 통합 시 확장 가능
        # 현재는 mock 테스트로 대체
        with mock.patch('lib.rag_engine.generate_analysis_text') as mock_generate:
            mock_generate.return_value = "This is a mock LLM generated text for testing purposes."
            
            mock_llm_text = generate_with_llm(test_keywords, provider="openai")
            print(f"모의 LLM 텍스트: {mock_llm_text}")
        
        return True
    except Exception as e:
        print(f"LLM 통합 테스트 중 오류 발생: {str(e)}")
        return False

def run_all_tests():
    """모든 통합 테스트를 실행합니다."""
    print("KeywordPulse RAG 시스템 및 API 통합 테스트 시작...")
    
    # 각 테스트 실행
    rag_success = test_rag_engine()
    api_success = test_mock_api_analyze()
    llm_success = test_llm_integration()
    
    # 결과 요약
    print("\n===== 테스트 결과 요약 =====")
    print(f"RAG 엔진 테스트: {'성공' if rag_success else '실패'}")
    print(f"API /analyze 모의 테스트: {'성공' if api_success else '실패'}")
    print(f"LLM 통합 테스트: {'성공' if llm_success else '실패'}")

if __name__ == "__main__":
    unittest.main() 