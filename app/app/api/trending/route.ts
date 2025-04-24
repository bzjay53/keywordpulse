import { NextRequest, NextResponse } from 'next/server';
import { getTrendingKeywords } from '@/lib/trends_api';

export async function GET(request: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as any || 'all';
    const count = parseInt(searchParams.get('count') || '10', 10);
    const geo = searchParams.get('geo') || 'KR';
    
    // 인기 검색어 가져오기
    const trendingKeywords = await getTrendingKeywords(category, count, geo);
    
    // 응답 반환
    return NextResponse.json({
      keywords: trendingKeywords,
      timestamp: new Date().toISOString(),
      category,
    });
  } catch (error) {
    console.error('인기 검색어 처리 중 오류:', error);
    return NextResponse.json(
      { error: '인기 검색어를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 