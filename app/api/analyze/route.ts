import { NextRequest, NextResponse } from 'next/server';
import { generateKeywordAnalysis } from '../../../lib/rag_engine';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
      return NextResponse.json(
        { error: '분석할 키워드가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 분석 텍스트 생성 (리팩토링된 외부 모듈 사용)
    const analysisText = generateKeywordAnalysis(body.keywords);
    
    // 응답 반환
    return NextResponse.json({
      analysisText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('키워드 분석 중 오류 발생:', error);
    return NextResponse.json(
      { error: '분석 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 