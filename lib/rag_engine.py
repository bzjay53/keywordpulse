"""
RAG (Retrieval-Augmented Generation) 엔진

KeywordPulse의 키워드 분석 결과를 자연어 텍스트로 변환하는 RAG 시스템 핵심 모듈입니다.
"""
from typing import List, Dict, Any, Optional
import time
from lib.logger import get_logger

# 로거 인스턴스 생성
logger = get_logger("rag_engine")

def generate_analysis_text(keywords: List[Dict[str, Any]]) -> str:
    """
    입력된 키워드 목록을 기반으로 분석 텍스트를 생성합니다.
    
    Args:
        keywords: 키워드 정보가 담긴 사전 리스트
                  [{"keyword": "AI 마케팅", "monthlySearches": 25000, "competitionRate": 0.25, "score": 85}, ...]
    
    Returns:
        str: 마크다운 형식의 분석 텍스트
    """
    # 시작 시간 기록
    start_time = time.time()
    
    # 로깅: 분석 요청 시작
    logger.info(
        "키워드 분석 텍스트 생성 시작",
        context={"keyword_count": len(keywords)}
    )
    
    try:
        if not keywords:
            logger.warning("분석할 키워드가 없음", context={"keywords": []})
            return "분석할 키워드가 없습니다."
        
        # 점수 기준 상위 키워드 선별
        top_keywords = sorted(keywords, key=lambda x: x.get('score', 0), reverse=True)[:5]
        
        # 로깅: 선별된 상위 키워드
        logger.debug(
            "상위 키워드 선별 완료", 
            context={
                "top_keywords": [kw.get('keyword') for kw in top_keywords],
                "top_scores": [kw.get('score') for kw in top_keywords]
            }
        )
        
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
        
        # 처리 시간 계산
        elapsed_time = time.time() - start_time
        
        # 로깅: 분석 요청 완료
        logger.info(
            "키워드 분석 텍스트 생성 완료",
            context={
                "keyword_count": len(keywords),
                "top_keyword": top_keywords[0]['keyword'] if top_keywords else None,
                "high_score_count": len(high_score_keywords),
                "processing_time_ms": round(elapsed_time * 1000, 2)
            }
        )
        
        return summary
    except Exception as e:
        # 로깅: 분석 중 오류
        logger.error(
            "키워드 분석 텍스트 생성 중 오류 발생",
            context={"keyword_count": len(keywords) if keywords else 0},
            error=e
        )
        return "분석 중 오류가 발생했습니다. 다시 시도해 주세요."

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
    # 로깅: LLM 생성 요청
    logger.info(
        f"LLM 기반 텍스트 생성 요청",
        context={
            "provider": provider,
            "keyword_count": len(keywords) if keywords else 0
        }
    )
    
    try:
        if provider == "template":
            return generate_analysis_text(keywords)
        
        # 향후 다른 프로바이더 지원 시 분기 처리
        if provider == "openai":
            # 현재는 지원되지 않음
            logger.warning(
                "OpenAI LLM 제공자는 아직 구현되지 않음",
                context={"fallback": "template"}
            )
            return generate_analysis_text(keywords)
        
        if provider == "claude":
            # 현재는 지원되지 않음
            logger.warning(
                "Claude LLM 제공자는 아직 구현되지 않음",
                context={"fallback": "template"}
            )
            return generate_analysis_text(keywords)
        
        # 기본 템플릿 사용
        logger.warning(
            f"알 수 없는 LLM 제공자: {provider}",
            context={"fallback": "template"}
        )
        return generate_analysis_text(keywords)
    except Exception as e:
        # 로깅: LLM 생성 중 오류
        logger.error(
            "LLM 기반 텍스트 생성 중 오류 발생",
            context={"provider": provider},
            error=e
        )
        return "LLM 분석 중 오류가 발생했습니다. 기본 템플릿을 사용해 주세요."

# 키워드 카테고리 캐싱
_keyword_category_cache = {}

def categorize_keyword(keyword: str) -> str:
    """
    키워드를 카테고리로 분류합니다.
    
    Args:
        keyword: 분류할 키워드 문자열
        
    Returns:
        str: 카테고리 이름 ('디지털 마케팅', 'AI 기술', '앱 개발' 등)
    """
    # 캐시 확인
    if keyword in _keyword_category_cache:
        logger.debug(
            "키워드 카테고리 캐시 사용",
            context={
                "keyword": keyword,
                "category": _keyword_category_cache[keyword]
            }
        )
        return _keyword_category_cache[keyword]
    
    # 소문자 변환 및 공백 제거
    k = keyword.lower().strip()
    
    # 기본 카테고리
    category = "일반"
    
    # 카테고리 분류 패턴
    patterns = {
        '디지털 마케팅': ['마케팅', 'seo', '광고', '콘텐츠', '퍼포먼스', '인플루언서', '바이럴', '브랜딩'],
        'AI 기술': ['ai', '인공지능', '머신러닝', 'gpt', '딥러닝', '자연어', '신경망', '강화학습'],
        '앱 개발': ['개발', '프로그래밍', '앱', 'app', '코딩', '소프트웨어', '웹', '모바일'],
        '3D 모델링/AI': ['3d', '모델링', '블렌더', 'blender', '렌더링', '애니메이션', 'cg', '그래픽']
    }
    
    # 패턴 매칭
    for cat, keywords in patterns.items():
        if any(kw in k for kw in keywords):
            category = cat
            break
    
    # 캐시 저장
    _keyword_category_cache[keyword] = category
    
    logger.debug(
        "키워드 카테고리 분류 완료",
        context={
            "keyword": keyword,
            "category": category
        }
    )
    
    return category 