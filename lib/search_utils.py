"""
검색 유틸리티 모듈

키워드 검색, 점수화, 정규화 기능을 제공하는 모듈입니다.
"""
import random
from typing import List, Dict, Any, Optional

def search_keywords(keyword: str) -> List[Dict[str, Any]]:
    """
    입력된 키워드에 대한 연관 키워드를 검색합니다.
    
    Args:
        keyword: 검색할 키워드
    
    Returns:
        List[Dict]: 관련 키워드 정보를 담은 사전 리스트
    """
    # TODO: 실제 검색 API 호출 또는 네이버 크롤링 구현
    # 임시 데이터 반환
    sample_keywords = [
        f"{keyword} 마케팅",
        f"{keyword} 트렌드",
        f"{keyword} 전략",
        f"{keyword} 가이드",
        f"{keyword} 분석",
        f"{keyword} 활용법",
        f"{keyword} 예시",
        f"{keyword} 케이스 스터디",
        f"{keyword} 툴",
        f"{keyword} 비교"
    ]
    
    results = []
    for kw in sample_keywords:
        # 임시 데이터 생성
        monthly_searches = random.randint(1000, 50000)
        competition_rate = round(random.uniform(0.1, 0.9), 2)
        score = calculate_score(monthly_searches, competition_rate)
        recommendation = get_recommendation_label(score)
        
        results.append({
            "keyword": kw,
            "monthlySearches": monthly_searches,
            "competitionRate": competition_rate,
            "score": score,
            "recommendation": recommendation
        })
    
    return results

def calculate_score(monthly_searches: int, competition_rate: float) -> int:
    """
    검색량과 경쟁률을 기반으로 키워드 점수를 계산합니다.
    
    Args:
        monthly_searches: 월간 검색량
        competition_rate: 경쟁률 (0~1 사이 값)
    
    Returns:
        int: 0-100 사이의 점수
    """
    # 검색량 정규화 (10,000회를 50점 기준으로)
    volume_score = min(50, (monthly_searches / 10000) * 50)
    
    # 경쟁률 점수 (낮을수록 유리)
    competition_score = 50 * (1 - competition_rate)
    
    # 최종 점수 계산 및 반올림
    final_score = round(volume_score + competition_score)
    
    # 0-100 범위 제한
    return max(0, min(100, final_score))

def get_recommendation_label(score: int) -> str:
    """
    점수에 따른 추천 레이블을 반환합니다.
    
    Args:
        score: 키워드 점수 (0-100)
    
    Returns:
        str: 추천 레이블
    """
    if score >= 80:
        return "Highly Recommended"
    elif score >= 50:
        return "Recommended"
    else:
        return "Low Priority"

def get_cached_results(keyword: str) -> Optional[List[Dict[str, Any]]]:
    """
    캐시된 검색 결과가 있는지 확인합니다.
    
    Args:
        keyword: 검색 키워드
    
    Returns:
        Optional[List[Dict]]: 캐시된 결과 또는 None
    """
    # TODO: 캐시 시스템 구현 (Redis, DB, 파일 등)
    return None  # 현재는 캐싱 없음

def save_to_cache(keyword: str, results: List[Dict[str, Any]]) -> None:
    """
    검색 결과를 캐시에 저장합니다.
    
    Args:
        keyword: 검색 키워드
        results: 검색 결과
    """
    # TODO: 캐시 저장 구현
    pass 