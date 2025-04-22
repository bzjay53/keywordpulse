"""
RAG (Retrieval-Augmented Generation) 엔진

KeywordPulse의 키워드 분석 결과를 자연어 텍스트로 변환하는 RAG 시스템 핵심 모듈입니다.
"""
from typing import List, Dict, Any

def generate_analysis_text(keywords: List[Dict[str, Any]]) -> str:
    """
    입력된 키워드 목록을 기반으로 분석 텍스트를 생성합니다.
    
    Args:
        keywords: 키워드 정보가 담긴 사전 리스트
                  [{"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85}, ...]
    
    Returns:
        str: 마크다운 형식의 분석 텍스트
    """
    if not keywords:
        return "분석할 키워드가 없습니다."
    
    # 점수 기준 상위 키워드 선별
    top_keywords = sorted(keywords, key=lambda x: x.get('score', 0), reverse=True)[:5]
    
    # 분석 텍스트 생성
    summary = ""
    
    # 서두
    if top_keywords:
        summary += f"이번 분석된 키워드 중 '{top_keywords[0]['keyword']}'는 가장 높은 추천 점수를 기록했습니다.\n\n"
    
    # 주요 키워드 목록
    summary += "## 주요 키워드 분석\n\n"
    for kw in top_keywords:
        score = kw.get('score', 0)
        recommendation = ""
        
        if score >= 80:
            recommendation = "🟢 강력 추천"
        elif score >= 50:
            recommendation = "🟡 추천"
        else:
            recommendation = "⚪ 낮은 우선순위"
        
        summary += f"- **{kw['keyword']}**: 검색량 {kw.get('monthlySearches', 0):,}회, "
        summary += f"경쟁률 {kw.get('competitionRate', 0):.2f}, "
        summary += f"점수 {score}점 ({recommendation})\n"
    
    # 결론
    high_score_keywords = [kw for kw in keywords if kw.get('score', 0) >= 80]
    if high_score_keywords:
        summary += "\n## 추천 전략\n\n"
        summary += f"특히 점수가 80점 이상인 {len(high_score_keywords)}개 키워드는 "
        summary += "콘텐츠 제작 우선순위로 고려하시길 권장합니다.\n"
    
    return summary

# LLM 기반 확장 가능성을 위한 인터페이스
def generate_with_llm(keywords: List[Dict[str, Any]], provider: str = "template") -> str:
    """
    LLM을 활용한 키워드 분석 텍스트 생성 (확장용)
    
    Args:
        keywords: 키워드 정보 리스트
        provider: 'template'(기본값), 'openai', 'claude' 등
    
    Returns:
        str: 생성된 분석 텍스트
    """
    if provider == "template":
        return generate_analysis_text(keywords)
    
    # TODO: 향후 OpenAI, Claude 등 API 연동 시 구현
    return generate_analysis_text(keywords)  # 현재는 기본 템플릿 사용 