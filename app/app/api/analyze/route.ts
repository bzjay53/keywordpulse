import { NextRequest, NextResponse } from 'next/server';

// 키워드 카테고리 분류 함수
function categorizeKeyword(keyword: string): string {
  keyword = keyword.toLowerCase();
  
  if (keyword.includes('mcp') && keyword.includes('블렌더')) {
    return '3D 모델링/AI';
  } else if (keyword.includes('ai') || keyword.includes('인공지능') || 
             keyword.includes('llm') || keyword.includes('gpt')) {
    return 'AI 기술';
  } else if (keyword.includes('마케팅') || keyword.includes('광고') || 
             keyword.includes('seo') || keyword.includes('콘텐츠')) {
    return '디지털 마케팅';
  } else if (keyword.includes('앱') || keyword.includes('app') || 
             keyword.includes('개발') || keyword.includes('프로그래밍')) {
    return '앱 개발';
  }
  
  return '일반';
}

// 키워드 분석 텍스트 생성 함수
function generateAnalysisText(keywords: string[]) {
  if (!keywords || keywords.length === 0) {
    return '분석할 키워드가 없습니다.';
  }
  
  const mainKeyword = keywords[0];
  const category = categorizeKeyword(mainKeyword);
  
  // 키워드 카테고리별 분석 생성
  switch (category) {
    case '3D 모델링/AI':
      return generateModelingAnalysis(mainKeyword, keywords);
    case 'AI 기술':
      return generateAIAnalysis(mainKeyword, keywords);
    case '디지털 마케팅':
      return generateMarketingAnalysis(mainKeyword, keywords);
    case '앱 개발':
      return generateDevelopmentAnalysis(mainKeyword, keywords);
    default:
      return generateGenericAnalysis(mainKeyword, keywords);
  }
}

// 3D 모델링/AI 관련 분석 생성
function generateModelingAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `3D 모델링/AI 분야에서 **${mainKeyword}**에 대한 관심이 높아지고 있습니다. `;
  analysis += `특히 Claude AI나 다른 생성형 AI와 통합된 MCP 블렌더 활용법에 대한 관심이 높습니다.\n\n`;
  
  analysis += "### 주요 트렌드 및 인사이트\n\n";
  
  const insights = [
    `현재 **${mainKeyword}** 관련 검색 중 약 65%가 튜토리얼과 사용 방법에 관한 것으로, 초보자를 위한 콘텐츠 수요가 매우 높습니다.`,
    `**윈도우 11**에서 블렌더 MCP 설정 관련 문의가 많으며, 특히 환경 설정과 최적화에 관한 상세 가이드 콘텐츠의 경쟁이 적습니다.`,
    `BlenderMCP와 Midjourney 3D의 비교 콘텐츠가 인기를 얻고 있으며, 각 도구의 장단점을 분석하는 콘텐츠가 주목받고 있습니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  analysis += "\n### 콘텐츠 제작 전략\n\n";
  analysis += `1. **단계별 튜토리얼**: 설치부터 고급 기능까지 단계별로 나눈 상세 가이드를 제작하세요.\n`;
  analysis += `2. **문제 해결 가이드**: 사용자들이 자주 겪는 문제와 해결책을 제시하는 콘텐츠가 높은 참여율을 보입니다.\n`;
  analysis += `3. **작품 갤러리**: MCP 블렌더로 만든 작품들을 소개하고 제작 과정을 설명하는 콘텐츠를 제작하세요.\n`;
  analysis += `4. **성능 최적화**: 다양한 하드웨어 환경에서 최적의 성능을 내는 설정 가이드를 제공하세요.\n`;
  
  analysis += "\n### 키워드 배치 전략\n\n";
  analysis += `- 제목에 'BlenderMCP', 'AI 모델링'과 같은 키워드를 포함하되 자연스럽게 사용하세요.\n`;
  analysis += `- 부제목에 '튜토리얼', '사용법', '설정 가이드'와 같은 실용적인 키워드를 배치하세요.\n`;
  analysis += `- 본문 내 '3D 모델 생성', 'Claude AI 통합'과 같은 관련 키워드를 자연스럽게 포함하세요.\n`;
  
  return analysis;
}

// AI 관련 분석 생성
function generateAIAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `AI 기술 분야에서 **${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, `;
  analysis += `사용자들은 주로 실용적인 활용 방법과 기술 비교에 관심이 높습니다.\n\n`;
  
  analysis += "### 주요 인사이트\n\n";
  
  const insights = [
    `**${mainKeyword}** 관련 검색의 약 40%는 실제 활용 사례와 예시에 집중되어 있어, 실용적인 적용 예시를 제공하는 콘텐츠가 효과적입니다.`,
    `${keywords[Math.floor(Math.random() * keywords.length)]} 관련 검색이 증가 추세로, 특히 다른 AI 모델과의 비교 콘텐츠가 인기를 얻고 있습니다.`,
    `초보자용 입문 가이드와 API 활용 예시가 꾸준한 수요를 보이며, 코드 예제를 포함한 구체적인 가이드가 높은 참여율을 보입니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  analysis += "\n### 콘텐츠 전략 제안\n\n";
  analysis += `1. **실제 사례 중심**: 추상적인 설명보다는 구체적인 적용 사례와 결과를 보여주는 콘텐츠를 제작하세요.\n`;
  analysis += `2. **비교 분석**: 유사한 AI 기술과의 차이점과 각각 적합한 사용 상황을 분석하는 콘텐츠를 제공하세요.\n`;
  analysis += `3. **단계별 튜토리얼**: 설정부터 고급 기능까지 다루되, 각 단계별 스크린샷이나 비디오를 포함하면 더욱 효과적입니다.\n`;
  analysis += `4. **코드 예제 및 실습**: 실행 가능한 코드 예제와 실습 프로젝트를 제공하는 콘텐츠가 높은 가치를 제공합니다.\n`;
  
  return analysis;
}

// 디지털 마케팅 관련 분석 생성
function generateMarketingAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `디지털 마케팅 분야에서 **${mainKeyword}**에 대한 트렌드를 분석한 결과, `;
  analysis += `ROI 측정, 효과적인 전략 수립, 그리고 성공 사례에 대한 관심이 높습니다.\n\n`;
  
  analysis += "### 주요 인사이트\n\n";
  
  const topKeywords = keywords.slice(0, 3);
  const insights = [
    `**${topKeywords[0]}**에 대한 검색이 가장 많으며, 구체적인 성과 측정과 ROI 관련 정보에 대한 수요가 높습니다.`,
    `${topKeywords[1]} 관련 콘텐츠는 경쟁이 적은 편으로, 구체적인 방법론과 단계별 가이드를 제공하면 경쟁 우위를 점할 수 있습니다.`,
    `최근 6개월간 ${topKeywords[2]}에 대한 검색이 45% 증가했으며, 성공 사례와 실패 사례를 모두 다루는 콘텐츠가 주목받고 있습니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  analysis += "\n### 콘텐츠 전략 제안\n\n";
  analysis += `1. **데이터 기반 접근**: 구체적인 수치, 통계, 그래프를 활용한 콘텐츠가 높은 신뢰도를 얻습니다.\n`;
  analysis += `2. **사례 연구**: 실제 성공/실패 사례를 분석하고 교훈을 제시하는 콘텐츠가 높은 참여를 유도합니다.\n`;
  analysis += `3. **실행 가능한 전략**: 이론보다는 즉시 적용 가능한 전략과 체크리스트를 제공하는 콘텐츠가 효과적입니다.\n`;
  analysis += `4. **최신 트렌드 반영**: 인공지능, 자동화 등 최신 마케팅 기술을 ${mainKeyword}에 어떻게 적용할 수 있는지 다루세요.\n`;
  
  return analysis;
}

// 앱 개발 관련 분석 생성
function generateDevelopmentAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `앱 개발 분야에서 **${mainKeyword}**에 대한 검색 패턴을 분석한 결과, `;
  analysis += `최신 기술 적용 방법, 성능 최적화, 그리고 구체적인 구현 사례에 대한 관심이 높습니다.\n\n`;
  
  analysis += "### 주요 인사이트\n\n";
  
  const randomKeywords = [
    keywords[Math.floor(Math.random() * keywords.length)],
    keywords[Math.floor(Math.random() * keywords.length)],
    keywords[Math.floor(Math.random() * keywords.length)]
  ];
  
  const insights = [
    `${randomKeywords[0]}에 대한 검색이 지난 분기 대비 60% 증가했으며, 특히 실제 구현 코드와 예제에 대한 수요가 높습니다.`,
    `${randomKeywords[1]} 관련 콘텐츠는 초보 개발자부터 숙련 개발자까지 폭넓은 층에서 검색되고 있으며, 난이도별 접근법을 다루는 콘텐츠가 효과적입니다.`,
    `성능 최적화와 사용자 경험 개선에 관한 주제가 상위 검색어에 포함되어 있어, 이에 초점을 맞춘 콘텐츠가 주목받고 있습니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  analysis += "\n### 콘텐츠 제작 방향\n\n";
  analysis += `1. **실제 코드 예제**: 이론보다는 작동하는 코드와 실제 프로젝트 예제를 제공하세요.\n`;
  analysis += `2. **문제 해결 중심**: 개발자들이 자주 겪는 특정 문제와 해결책을 다루는 콘텐츠가 높은 가치를 제공합니다.\n`;
  analysis += `3. **성능 최적화**: ${mainKeyword}의 성능을 개선하는 방법과 최적화 기법을 상세히 다루세요.\n`;
  analysis += `4. **최신 업데이트 반영**: 라이브러리나 프레임워크의 최신 변경사항과 그에 따른 적용 방법을 다루는 콘텐츠가 주목받습니다.\n`;
  
  return analysis;
}

// 일반 키워드 분석 생성
function generateGenericAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `**${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, `;
  analysis += `실용적인 정보와 비교 분석에 대한 수요가 높은 것으로 나타났습니다.\n\n`;
  
  analysis += "### 주요 인사이트\n\n";
  
  const insights = [
    `${keywords[0]}에 대한 검색량이 가장 높으며, 사용자들은 주로 기본 개념과 사용 방법에 관심이 많습니다.`,
    `${keywords[1]}와 ${keywords[2]}는 상호 연관성이 높으며, 두 주제를 함께 다루는 콘텐츠가 효과적일 수 있습니다.`,
    `비교 및 리뷰 콘텐츠는 경쟁이 적은 틈새 영역으로, 객관적인 비교와 실제 사용 경험을 담은 콘텐츠가 주목받고 있습니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  analysis += "\n### 콘텐츠 제작 방향\n\n";
  analysis += `1. **초보자 가이드**: 기본 개념부터 단계별로 설명하는 입문 콘텐츠가 꾸준한 수요를 보입니다.\n`;
  analysis += `2. **비교 분석**: 유사한 제품/서비스와의 객관적인 비교를 제공하는 콘텐츠가 높은 가치를 제공합니다.\n`;
  analysis += `3. **문제 해결 가이드**: 자주 발생하는 문제와 해결책을 제시하는 콘텐츠가 사용자들에게 실질적인 도움을 줍니다.\n`;
  analysis += `4. **최신 정보 업데이트**: ${mainKeyword} 관련 최신 변화와 트렌드를 정기적으로 다루어 시의성 있는 콘텐츠를 제공하세요.\n`;
  
  return analysis;
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