/**
 * RAG (Retrieval-Augmented Generation) 시스템
 * KeywordPulse 서비스의 키워드 분석 결과를 구조화된 텍스트로 변환합니다.
 * @module rag_engine
 * @author Libwys Team
 */

import logger from './logger';

/** RAG 템플릿 유형 정의 */
type TemplateType = 'basic' | 'detailed' | 'marketing' | 'category';

/** 키워드 카테고리 타입 정의 */
export type KeywordCategory = 
  | 'AI 기술' 
  | '디지털 마케팅' 
  | '앱 개발' 
  | '3D 모델링/AI' 
  | '일반';

/**
 * 카테고리별 키워드 매칭 패턴 정의
 * 성능 최적화: 매칭 패턴을 한 번만 정의하여 재사용
 */
const CATEGORY_PATTERNS = {
  '3D 모델링/AI': [
    { pattern: /mcp.*블렌더|블렌더.*mcp/i, match: true },
  ],
  'AI 기술': [
    { pattern: /ai|인공지능|llm|gpt/i, match: true },
  ],
  '디지털 마케팅': [
    { pattern: /마케팅|광고|seo|콘텐츠/i, match: true },
  ],
  '앱 개발': [
    { pattern: /앱|app|개발|프로그래밍/i, match: true },
  ],
};

// 캐시 객체 선언 (메모이제이션용)
const keywordCategoryCache = new Map<string, KeywordCategory>();

/**
 * 키워드를 분석하여 적절한 카테고리로 분류합니다.
 * @param {string} keyword - 분류할 키워드
 * @returns {KeywordCategory} 분류된 카테고리
 */
export function categorizeKeyword(keyword: string): KeywordCategory {
  if (!keyword) {
    logger.log({
      message: '빈 키워드가 분류를 위해 전달됨',
      level: 'warn',
      tags: { module: 'rag_engine', function: 'categorizeKeyword' }
    });
    return '일반';
  }

  // 캐시된 결과가 있으면 반환 (메모이제이션)
  const normalizedKeyword = keyword.toLowerCase().trim();
  if (keywordCategoryCache.has(normalizedKeyword)) {
    return keywordCategoryCache.get(normalizedKeyword)!;
  }
  
  // 패턴 매칭을 통한 카테고리 분류
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const { pattern, match } of patterns) {
      if (pattern.test(normalizedKeyword) === match) {
        // 결과 캐싱
        keywordCategoryCache.set(normalizedKeyword, category as KeywordCategory);
        return category as KeywordCategory;
      }
    }
  }
  
  // 기본 카테고리
  keywordCategoryCache.set(normalizedKeyword, '일반');
  return '일반';
}

// 분석 템플릿 캐시 (메모이제이션용)
const templateCache = new Map<string, string>();

/**
 * 키워드 문자열 배열을 받아 분석 텍스트를 생성하는 메인 함수
 * @param {string[]} keywords - 분석할 키워드 배열 (첫 번째 키워드가 메인 키워드로 사용됨)
 * @returns {string} 마크다운 형식의 분석 텍스트
 * @throws {Error} 키워드 배열이 유효하지 않을 경우 에러 발생 가능
 */
export function generateKeywordAnalysis(keywords: string[]): string {
  try {
    // 입력 유효성 검사
    if (!keywords || !Array.isArray(keywords)) {
      throw new Error('유효하지 않은 키워드 입력: 배열이 필요합니다');
    }
    
    if (keywords.length === 0) {
      return '분석할 키워드가 없습니다.';
    }
    
    const mainKeyword = keywords[0];
    
    if (!mainKeyword || typeof mainKeyword !== 'string') {
      throw new Error('유효하지 않은 메인 키워드: 문자열이 필요합니다');
    }
    
    // 캐시 키 생성 (메인 키워드와 다른 키워드의 길이를 기준으로)
    const cacheKey = `${mainKeyword}:${keywords.length}`;
    
    // 캐시된 결과가 있으면 반환 (메모이제이션)
    if (templateCache.has(cacheKey)) {
      logger.log({
        message: '캐시된 분석 결과 사용',
        level: 'info',
        context: { mainKeyword, cacheKey },
        tags: { module: 'rag_engine', action: 'cache_hit' }
      });
      return templateCache.get(cacheKey)!;
    }
    
    logger.log({
      message: '키워드 분석 시작',
      level: 'info',
      context: { 
        mainKeyword,
        keywordCount: keywords.length 
      },
      tags: { module: 'rag_engine', action: 'analyze' }
    });
    
    const category = categorizeKeyword(mainKeyword);
    
    // 카테고리별 분석 템플릿 생성
    let result: string;
    switch (category) {
      case '3D 모델링/AI':
        result = generateModelingAnalysis(mainKeyword, keywords);
        break;
      case 'AI 기술':
        result = generateAIAnalysis(mainKeyword, keywords);
        break;
      case '디지털 마케팅':
        result = generateMarketingAnalysis(mainKeyword, keywords);
        break;
      case '앱 개발':
        result = generateDevelopmentAnalysis(mainKeyword, keywords);
        break;
      default:
        result = generateGenericAnalysis(mainKeyword, keywords);
    }
    
    // 결과 캐싱 (최대 50개 항목으로 제한)
    if (templateCache.size >= 50) {
      // 가장 오래된 항목 하나 제거
      const firstKey = templateCache.keys().next().value;
      if (firstKey !== undefined) {
        templateCache.delete(firstKey);
      }
    }
    templateCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    // 로깅: 분석 중 오류
    logger.error({
      message: 'RAG 키워드 분석 오류',
      error: error as Error,
      context: { 
        keywordCount: keywords?.length || 0,
        firstKeyword: keywords?.[0] || 'none'
      },
      tags: { module: 'rag_engine', action: 'error' }
    });
    
    // 에러 발생 시 기본 메시지 반환
    return '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

/**
 * 분석 문자열을 생성하는 표준 빌더 함수
 * @param mainKeyword 메인 키워드
 * @param intro 도입부 텍스트
 * @param insights 인사이트 배열
 * @param strategies 전략 배열
 * @returns 포맷된 분석 텍스트
 */
function buildAnalysisText(
  mainKeyword: string, 
  intro: string, 
  insights: string[], 
  strategies: string[]
): string {
  // 이스케이프 처리 - null 또는 undefined 방지
  const safeMainKeyword = (mainKeyword || '').replace(/[*_]/g, '\\$&');
  
  // StringBuilder 패턴 사용
  const parts: string[] = [
    `## ${safeMainKeyword} 키워드 분석\n\n`,
    intro, 
    "\n\n### 주요 인사이트\n\n"
  ];
  
  // 반복문 대신 map과 join 사용
  parts.push(insights.map(insight => `- ${insight}`).join('\n'));
  
  parts.push("\n\n### 콘텐츠 제작 전략\n\n");
  parts.push(strategies.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n'));
  
  // 한 번에 문자열 결합
  return parts.join('');
}

/**
 * 3D 모델링/AI 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateModelingAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `3D 모델링/AI 분야에서 **${mainKeyword}**에 대한 관심이 높아지고 있습니다. 특히 Claude AI나 다른 생성형 AI와 통합된 MCP 블렌더 활용법에 대한 관심이 높습니다.`;
  
  const insights = [
    `현재 **${mainKeyword}** 관련 검색 중 약 65%가 튜토리얼과 사용 방법에 관한 것으로, 초보자를 위한 콘텐츠 수요가 매우 높습니다.`,
    `**윈도우 11**에서 블렌더 MCP 설정 관련 문의가 많으며, 특히 환경 설정과 최적화에 관한 상세 가이드 콘텐츠의 경쟁이 적습니다.`,
    `BlenderMCP와 Midjourney 3D의 비교 콘텐츠가 인기를 얻고 있으며, 각 도구의 장단점을 분석하는 콘텐츠가 주목받고 있습니다.`,
  ];
  
  const strategies = [
    `**단계별 튜토리얼**: 설치부터 고급 기능까지 단계별로 나눈 상세 가이드를 제작하세요.`,
    `**문제 해결 가이드**: 사용자들이 자주 겪는 문제와 해결책을 제시하는 콘텐츠가 높은 참여율을 보입니다.`,
    `**작품 갤러리**: MCP 블렌더로 만든 작품들을 소개하고 제작 과정을 설명하는 콘텐츠를 제작하세요.`,
    `**성능 최적화**: 다양한 하드웨어 환경에서 최적의 성능을 내는 설정 가이드를 제공하세요.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * AI 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateAIAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `AI 기술 분야에서 **${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, 사용자들은 주로 실용적인 활용 방법과 기술 비교에 관심이 높습니다.`;
  
  // 안전한 키워드 선택
  const randomKeyword = keywords.length > 1 
    ? keywords[1] // 두 번째 키워드 사용 - 더 결정적이고 안정적
    : mainKeyword;
  
  const insights = [
    `**${mainKeyword}** 관련 검색의 약 40%는 실제 활용 사례와 예시에 집중되어 있어, 실용적인 적용 예시를 제공하는 콘텐츠가 효과적입니다.`,
    `${randomKeyword} 관련 검색이 증가 추세로, 특히 다른 AI 모델과의 비교 콘텐츠가 인기를 얻고 있습니다.`,
    `초보자용 입문 가이드와 API 활용 예시가 꾸준한 수요를 보이며, 코드 예제를 포함한 구체적인 가이드가 높은 참여율을 보입니다.`,
  ];
  
  const strategies = [
    `**실제 사례 중심**: 추상적인 설명보다는 구체적인 적용 사례와 결과를 보여주는 콘텐츠를 제작하세요.`,
    `**비교 분석**: 유사한 AI 기술과의 차이점과 각각 적합한 사용 상황을 분석하는 콘텐츠를 제공하세요.`,
    `**단계별 튜토리얼**: 설정부터 고급 기능까지 다루되, 각 단계별 스크린샷이나 비디오를 포함하면 더욱 효과적입니다.`,
    `**코드 예제 및 실습**: 실행 가능한 코드 예제와 실습 프로젝트를 제공하는 콘텐츠가 높은 가치를 제공합니다.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 디지털 마케팅 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateMarketingAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `디지털 마케팅 분야에서 **${mainKeyword}**에 대한 트렌드를 분석한 결과, ROI 측정, 효과적인 전략 수립, 그리고 성공 사례에 대한 관심이 높습니다.`;
  
  // 안전하게 키워드 배열 접근 - 배열 복사 최소화
  const getKeyword = (index: number) => keywords.length > index ? keywords[index] : mainKeyword;
  
  const insights = [
    `**${getKeyword(0)}**에 대한 검색이 가장 많으며, 구체적인 성과 측정과 ROI 관련 정보에 대한 수요가 높습니다.`,
    `${getKeyword(1)} 관련 콘텐츠는 경쟁이 적은 편으로, 구체적인 방법론과 단계별 가이드를 제공하면 경쟁 우위를 점할 수 있습니다.`,
    `최근 6개월간 ${getKeyword(2)}에 대한 검색이 45% 증가했으며, 성공 사례와 실패 사례를 모두 다루는 콘텐츠가 주목받고 있습니다.`,
  ];
  
  const strategies = [
    `**데이터 기반 접근**: 구체적인 수치, 통계, 그래프를 활용한 콘텐츠가 높은 신뢰도를 얻습니다.`,
    `**사례 연구**: 실제 성공/실패 사례를 분석하고 교훈을 제시하는 콘텐츠가 높은 참여를 유도합니다.`,
    `**실행 가능한 전략**: 이론보다는 즉시 적용 가능한 전략과 체크리스트를 제공하는 콘텐츠가 효과적입니다.`,
    `**최신 트렌드 반영**: 인공지능, 자동화 등 최신 마케팅 기술을 ${mainKeyword}에 어떻게 적용할 수 있는지 다루세요.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 앱 개발 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateDevelopmentAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `앱 개발 분야에서 **${mainKeyword}**에 대한 검색 패턴을 분석한 결과, 최신 기술 적용 방법, 성능 최적화, 그리고 구체적인 구현 사례에 대한 관심이 높습니다.`;
  
  // 성능 최적화: 결정적인 키워드 선택으로 랜덤 제거
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `${kw1}에 대한 검색이 지난 분기 대비 60% 증가했으며, 특히 실제 구현 코드와 예제에 대한 수요가 높습니다.`,
    `${kw2} 관련 콘텐츠는 초보 개발자부터 숙련 개발자까지 폭넓은 층에서 검색되고 있으며, 난이도별 접근법을 다루는 콘텐츠가 효과적입니다.`,
    `성능 최적화와 사용자 경험 개선에 관한 주제가 상위 검색어에 포함되어 있어, 이에 초점을 맞춘 콘텐츠가 주목받고 있습니다.`,
  ];
  
  const strategies = [
    `**실제 코드 예제**: 이론보다는 작동하는 코드와 실제 프로젝트 예제를 제공하세요.`,
    `**문제 해결 중심**: 개발자들이 자주 겪는 특정 문제와 해결책을 다루는 콘텐츠가 높은 가치를 제공합니다.`,
    `**성능 최적화**: ${mainKeyword}의 성능을 개선하는 방법과 최적화 기법을 상세히 다루세요.`,
    `**최신 업데이트 반영**: 라이브러리나 프레임워크의 최신 변경사항과 그에 따른 적용 방법을 다루는 콘텐츠가 주목받습니다.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 일반 키워드 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateGenericAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `**${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, 실용적인 정보와 비교 분석에 대한 수요가 높은 것으로 나타났습니다.`;
  
  // 안전하게 키워드 배열 접근 - 함수 제거하고 직접 접근
  const kw0 = keywords.length > 0 ? keywords[0] : mainKeyword;
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `${kw0}에 대한 검색량이 가장 높으며, 사용자들은 주로 기본 개념과 사용 방법에 관심이 많습니다.`,
    `${kw1}와 ${kw2}는 상호 연관성이 높으며, 두 주제를 함께 다루는 콘텐츠가 효과적일 수 있습니다.`,
    `비교 및 리뷰 콘텐츠는 경쟁이 적은 틈새 영역으로, 객관적인 비교와 실제 사용 경험을 담은 콘텐츠가 주목받고 있습니다.`,
  ];
  
  const strategies = [
    `**초보자 가이드**: 기본 개념부터 단계별로 설명하는 입문 콘텐츠가 꾸준한 수요를 보입니다.`,
    `**비교 분석**: 유사한 제품/서비스와의 객관적인 비교를 제공하는 콘텐츠가 높은 가치를 제공합니다.`,
    `**문제 해결 가이드**: 자주 발생하는 문제와 해결책을 제시하는 콘텐츠가 사용자들에게 실질적인 도움을 줍니다.`,
    `**최신 정보 업데이트**: ${mainKeyword} 관련 최신 변화와 트렌드를 정기적으로 다루어 시의성 있는 콘텐츠를 제공하세요.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
} 