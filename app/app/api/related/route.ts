import { NextRequest, NextResponse } from 'next/server';
import { getRelatedKeywords } from '@/lib/trends_api';

export async function GET(request: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const count = parseInt(searchParams.get('count') || '5', 10);
    const geo = searchParams.get('geo') || 'KR';
    
    // 키워드가 제공되지 않았을 경우 에러 응답
    if (!keyword) {
      return NextResponse.json(
        { error: '키워드 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 관련 검색어 가져오기
    const relatedKeywords = await getRelatedKeywords(keyword, count, geo);
    
    // 응답 반환
    return NextResponse.json({
      keyword,
      related: relatedKeywords,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('관련 검색어 처리 중 오류:', error);
    return NextResponse.json(
      { error: '관련 검색어를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 