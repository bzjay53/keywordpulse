import { NextRequest, NextResponse } from 'next/server';

// 샘플 데이터를 사용하여 키워드 검색 결과 생성
function generateKeywordData(keyword: string) {
  const related = [
    `${keyword} 마케팅`,
    `${keyword} 트렌드`,
    `${keyword} 전략`,
    `${keyword} 가이드`,
    `${keyword} 분석`,
    `${keyword} 활용법`,
    `${keyword} 예시`,
    `${keyword} 케이스 스터디`,
    `${keyword} 툴`,
    `${keyword} 비교`
  ];
  
  return related.map(kw => {
    const monthlySearches = Math.floor(Math.random() * 50000) + 1000;
    const competitionRate = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
    const score = Math.floor((monthlySearches / 1000) * (1 - competitionRate) * 10);
    
    return {
      keyword: kw,
      monthlySearches,
      competitionRate,
      score
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    if (!body.keyword) {
      return NextResponse.json(
        { error: '키워드가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 키워드 데이터 생성 (실제로는 외부 API 호출 또는 DB 조회)
    const keywords = generateKeywordData(body.keyword);
    
    // 응답 반환
    return NextResponse.json({
      keywords,
      cached: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('키워드 검색 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 