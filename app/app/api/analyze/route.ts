import { NextRequest, NextResponse } from 'next/server';

// 키워드 분석 텍스트 생성 함수
function generateAnalysisText(keywords: string[]) {
  if (!keywords || keywords.length === 0) {
    return '분석할 키워드가 없습니다.';
  }
  
  // 간단한 분석 요약 생성
  let summary = `## ${keywords[0]} 키워드 분석 결과\n\n`;
  
  summary += `분석된 키워드 중 **${keywords[0]}**에 대한 전략적 접근이 중요해 보입니다. `;
  summary += `${keywords.length}개의 연관 키워드를 분석한 결과, 다음과 같은 인사이트를 얻을 수 있습니다.\n\n`;
  
  summary += "### 주요 인사이트\n\n";
  
  // 랜덤 인사이트 생성
  const insights = [
    `**${keywords[0]}**는 월간 검색량이 높고 경쟁이 심하지 않아 접근성이 좋습니다.`,
    `**${keywords[Math.floor(Math.random() * keywords.length)]}**는 틈새 키워드로, 경쟁이 적어 초기 진입에 유리합니다.`,
    `**${keywords[Math.floor(Math.random() * keywords.length)]}**에 대한 콘텐츠는 구체적인 방법론을 다루면 효과적일 것입니다.`,
  ];
  
  insights.forEach(insight => {
    summary += `- ${insight}\n`;
  });
  
  summary += "\n### 키워드 활용 전략\n\n";
  summary += `1. **${keywords[0]}**를 메인 키워드로 사용하되, 콘텐츠 초반부에 배치하세요.\n`;
  summary += `2. **${keywords[1] || keywords[0]}**와 **${keywords[2] || keywords[0]}**를 부제목(H2, H3)에 활용하세요.\n`;
  summary += `3. 연관 키워드들을 자연스럽게 본문에 통합하되, 키워드 밀도는 2-3%를 유지하세요.\n`;
  
  summary += "\n### 콘텐츠 제작 방향\n\n";
  summary += `- 실제 사례 연구와 데이터 기반의 인사이트를 제공하세요.\n`;
  summary += `- 단계별 가이드나 체크리스트 형식의 콘텐츠가 효과적일 것입니다.\n`;
  summary += `- 시각적 자료(인포그래픽, 차트)를 포함하여 정보 전달력을 높이세요.\n`;
  
  return summary;
}

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
    
    // 분석 텍스트 생성
    const analysisText = generateAnalysisText(body.keywords);
    
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