/**
 * RAG (Retrieval-Augmented Generation) 시스템
 * KeywordPulse 서비스의 키워드 분석 결과를 구조화된 텍스트로 변환합니다.
 * @module rag_engine
 * @author Libwys Team
 */

import logger from './logger';

/** RAG 템플릿 유형 정의 */
type TemplateType = 'basic' | 'detailed' | 'marketing' | 'category' | 'technical' | 'educational';

/** 키워드 카테고리 타입 정의 */
export type KeywordCategory = 
  | 'AI 기술' 
  | '디지털 마케팅' 
  | '앱 개발' 
  | '3D 모델링/AI' 
  | '교육/학습'
  | '건강/의료'
  | '금융/투자'
  | '일반';

/**
 * 카테고리별 키워드 매칭 패턴 정의
 * 성능 최적화: 매칭 패턴을 한 번만 정의하여 재사용
 */
const CATEGORY_PATTERNS = {
  '3D 모델링/AI': [
    { pattern: /mcp.*블렌더|블렌더.*mcp|3d\s*모델링|모델링/i, match: true },
  ],
  'AI 기술': [
    { pattern: /ai|인공지능|llm|gpt|머신러닝|딥러닝|챗봇|claude/i, match: true },
  ],
  '디지털 마케팅': [
    { pattern: /마케팅|광고|seo|콘텐츠|브랜딩|sns|소셜미디어/i, match: true },
  ],
  '앱 개발': [
    { pattern: /앱|app|개발|프로그래밍|코딩|웹사이트|모바일/i, match: true },
  ],
  '교육/학습': [
    { pattern: /교육|학습|강의|과외|코스|수업|학생|교사|교수법/i, match: true },
  ],
  '건강/의료': [
    { pattern: /건강|의료|병원|치료|약품|영양|다이어트|웰빙|운동/i, match: true },
  ],
  '금융/투자': [
    { pattern: /금융|투자|주식|펀드|자산|부동산|저축|재테크|은행/i, match: true },
  ],
};

// 캐시 객체 선언 (메모이제이션용)
const keywordCategoryCache: Map<string, KeywordCategory> = new Map<string, KeywordCategory>();

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
    const cachedCategory = keywordCategoryCache.get(normalizedKeyword);
    return cachedCategory as KeywordCategory;
  }
  
  // 개선된 카테고리 분류 알고리즘: 가중치 기반 접근
  const categoryScores: Record<KeywordCategory, number> = {
    'AI 기술': 0,
    '디지털 마케팅': 0,
    '앱 개발': 0,
    '3D 모델링/AI': 0,
    '교육/학습': 0,
    '건강/의료': 0,
    '금융/투자': 0,
    '일반': 0
  };
  
  // 각 카테고리별 패턴을 확인하고 점수 계산
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const { pattern, match } of patterns) {
      if (pattern.test(normalizedKeyword) === match) {
        // 패턴이 일치하면 해당 카테고리에 점수 추가
        categoryScores[category as KeywordCategory] += 1;
      }
    }
  }
  
  // 복합 키워드 분석 - 단어 단위로 분리하여 추가 분석
  const words = normalizedKeyword.split(/\s+/);
  for (const word of words) {
    if (word.length < 2) continue; // 너무 짧은 단어는 무시
    
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
      for (const { pattern, match } of patterns) {
        if (pattern.test(word) === match) {
          // 개별 단어가 패턴과 일치하면 약한 가중치 부여
          categoryScores[category as KeywordCategory] += 0.5;
        }
      }
    }
  }
  
  // 점수가 가장 높은 카테고리 선택
  let bestCategory: KeywordCategory = '일반';
  let highestScore = 0;
  
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category as KeywordCategory;
    }
  }
  
  // 모든 카테고리의 점수가 0이면 '일반' 카테고리로 분류
  if (highestScore === 0) {
    bestCategory = '일반';
  }
  
  // 결과 캐싱
  keywordCategoryCache.set(normalizedKeyword, bestCategory);
  
  logger.log({
    message: '키워드 카테고리 분류 완료',
    level: 'debug',
    context: { 
      keyword: normalizedKeyword,
      category: bestCategory,
      scores: categoryScores 
    },
    tags: { module: 'rag_engine', function: 'categorizeKeyword' }
  });
  
  return bestCategory;
}

/** 지원 언어 타입 정의 */
export type SupportedLanguage = 'ko' | 'en';

// 언어 별 분석 템플릿 캐시 (메모이제이션용)
const templateCacheByLang: Record<SupportedLanguage, Map<string, string>> = {
  'ko': new Map<string, string>(),
  'en': new Map<string, string>()
};

/** 사용자 맞춤 설정 타입 정의 */
export interface UserPreferences {
  /** 사용자가 선호하는 분석 언어 */
  language?: SupportedLanguage;
  /** 인사이트 갯수 조정 (1-5) */
  insightCount?: number;
  /** 전략 갯수 조정 (1-5) */
  strategyCount?: number;
  /** 분석 상세도 조정 */
  detailLevel?: 'basic' | 'detailed';
  /** 특정 산업 분야에 맞춤화 */
  industry?: string;
  /** 사용자 필터링된 키워드 */
  excludedKeywords?: string[];
}

/**
 * 키워드 문자열 배열을 받아 분석 텍스트를 생성하는 메인 함수
 * @param {string[]} keywords - 분석할 키워드 배열 (첫 번째 키워드가 메인 키워드로 사용됨)
 * @param {UserPreferences} userPreferences - 사용자 맞춤 설정 (선택적)
 * @returns {string} 마크다운 형식의 분석 텍스트
 * @throws {Error} 키워드 배열이 유효하지 않을 경우 에러 발생 가능
 */
export function generateKeywordAnalysis(
  keywords: string[], 
  userPreferences: UserPreferences = {}
): string {
  try {
    // 기본 언어 설정
    const language = userPreferences.language || 'ko';
    
    // 입력 유효성 검사
    if (!keywords || !Array.isArray(keywords)) {
      throw new Error('유효하지 않은 키워드 입력: 배열이 필요합니다');
    }
    
    if (keywords.length === 0) {
      return language === 'ko' 
        ? '분석할 키워드가 없습니다.' 
        : 'No keywords to analyze.';
    }
    
    // 사용자 필터링: 제외된 키워드 필터링
    let filteredKeywords = keywords;
    if (userPreferences.excludedKeywords?.length) {
      const excludeSet = new Set(userPreferences.excludedKeywords.map(k => k.toLowerCase().trim()));
      filteredKeywords = keywords.filter(k => !excludeSet.has(k.toLowerCase().trim()));
      
      // 필터링 후 키워드가 없으면 원래 키워드 사용
      if (filteredKeywords.length === 0) {
        filteredKeywords = keywords;
      }
    }
    
    const mainKeyword = filteredKeywords[0];
    
    if (!mainKeyword || typeof mainKeyword !== 'string') {
      throw new Error('유효하지 않은 메인 키워드: 문자열이 필요합니다');
    }
    
    // 캐시 키 생성 (메인 키워드, 키워드 수, 사용자 설정 기반)
    const prefsHash = JSON.stringify(userPreferences); 
    const cacheKey = `${mainKeyword}:${filteredKeywords.length}:${prefsHash.slice(0, 20)}`;
    
    // 선택된 언어의 캐시 사용
    const templateCache = templateCacheByLang[language];
    
    // 캐시된 결과가 있으면 반환 (메모이제이션)
    if (templateCache.has(cacheKey)) {
      logger.log({
        message: '캐시된 분석 결과 사용',
        level: 'info',
        context: { mainKeyword, cacheKey, language },
        tags: { module: 'rag_engine', action: 'cache_hit' }
      });
      return templateCache.get(cacheKey)!;
    }
    
    logger.log({
      message: '키워드 분석 시작',
      level: 'info',
      context: { 
        mainKeyword,
        keywordCount: filteredKeywords.length,
        language,
        userPreferences
      },
      tags: { module: 'rag_engine', action: 'analyze' }
    });
    
    const category = categorizeKeyword(mainKeyword);
    
    // 사용자 맞춤: 산업 분야 기반 카테고리 오버라이드
    let effectiveCategory = category;
    if (userPreferences.industry) {
      switch (userPreferences.industry.toLowerCase()) {
        case 'marketing':
        case '마케팅':
          effectiveCategory = '디지털 마케팅';
          break;
        case 'development':
        case '개발':
          effectiveCategory = '앱 개발';
          break;
        case 'ai':
        case '인공지능':
          effectiveCategory = 'AI 기술';
          break;
        case 'education':
        case '교육':
          effectiveCategory = '교육/학습';
          break;
        case 'health':
        case '건강':
        case '의료':
          effectiveCategory = '건강/의료';
          break;
        case 'finance':
        case '금융':
        case '투자':
          effectiveCategory = '금융/투자';
          break;
      }
    }
    
    // 카테고리별 분석 템플릿 생성 (언어에 따라 다른 함수 호출)
    let analysis = generateAnalysisByCategory(effectiveCategory, mainKeyword, filteredKeywords, language);
    
    // 사용자 맞춤: 분석 결과를 사용자 설정에 따라 조정
    analysis = customizeAnalysisForUser(analysis, userPreferences, language);
    
    // 결과 캐싱 (최대 50개 항목으로 제한)
    if (templateCache.size >= 50) {
      // 가장 오래된 항목 하나 제거
      const firstKey = templateCache.keys().next().value;
      if (firstKey !== undefined) {
        templateCache.delete(firstKey);
      }
    }
    templateCache.set(cacheKey, analysis);
    
    return analysis;
  } catch (error) {
    // 로깅: 분석 중 오류
    logger.error({
      message: 'RAG 키워드 분석 오류',
      error: error as Error,
      context: { 
        keywordCount: keywords?.length || 0,
        firstKeyword: keywords?.[0] || 'none',
        language: userPreferences.language || 'ko',
        userPreferences
      },
      tags: { module: 'rag_engine', action: 'error' }
    });
    
    // 에러 발생 시 기본 메시지 반환 (선택된 언어에 따라)
    return userPreferences.language === 'en'
      ? 'An error occurred during keyword analysis. Please try again.'
      : '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

/**
 * 카테고리별로 적절한 분석 함수를 호출하는 도우미 함수
 */
function generateAnalysisByCategory(
  category: KeywordCategory, 
  mainKeyword: string, 
  keywords: string[], 
  language: SupportedLanguage
): string {
  if (language === 'ko') {
    // 한국어 분석
    switch (category) {
      case '3D 모델링/AI':
        return generateModelingAnalysis(mainKeyword, keywords);
      case 'AI 기술':
        return generateAIAnalysis(mainKeyword, keywords);
      case '디지털 마케팅':
        return generateMarketingAnalysis(mainKeyword, keywords);
      case '앱 개발':
        return generateDevelopmentAnalysis(mainKeyword, keywords);
      case '교육/학습':
        return generateEducationalAnalysis(mainKeyword, keywords);
      case '건강/의료':
        return generateHealthAnalysis(mainKeyword, keywords);
      case '금융/투자':
        return generateFinanceAnalysis(mainKeyword, keywords);
      default:
        return generateGenericAnalysis(mainKeyword, keywords);
    }
  } else {
    // 영어 분석
    switch (category) {
      case '3D 모델링/AI':
        return generateModelingAnalysisEn(mainKeyword, keywords);
      case 'AI 기술':
        return generateAIAnalysisEn(mainKeyword, keywords);
      case '디지털 마케팅':
        return generateMarketingAnalysisEn(mainKeyword, keywords);
      case '앱 개발':
        return generateDevelopmentAnalysisEn(mainKeyword, keywords);
      case '교육/학습':
        return generateEducationalAnalysisEn(mainKeyword, keywords);
      case '건강/의료':
        return generateHealthAnalysisEn(mainKeyword, keywords);
      case '금융/투자':
        return generateFinanceAnalysisEn(mainKeyword, keywords);
      default:
        return generateGenericAnalysisEn(mainKeyword, keywords);
    }
  }
}

/**
 * 사용자 설정에 따라 분석 결과를 조정하는 함수
 */
function customizeAnalysisForUser(
  analysis: string, 
  preferences: UserPreferences,
  language: SupportedLanguage
): string {
  if (!preferences || Object.keys(preferences).length === 0) {
    return analysis; // 사용자 설정이 없으면 원본 그대로 반환
  }
  
  let customized = analysis;
  
  // 인사이트 수 조정
  if (preferences.insightCount !== undefined && preferences.insightCount > 0) {
    const insightPattern = language === 'ko' 
      ? /### 주요 인사이트\n\n((?:- .+\n)+)/
      : /### Key Insights\n\n((?:- .+\n)+)/;
    
    const insightMatch = customized.match(insightPattern);
    if (insightMatch) {
      const insights = insightMatch[1].split('\n').filter(line => line.startsWith('- '));
      const limitedInsights = insights.slice(0, Math.min(preferences.insightCount, insights.length));
      
      const insightsSection = language === 'ko' 
        ? `### 주요 인사이트\n\n${limitedInsights.join('\n')}\n` 
        : `### Key Insights\n\n${limitedInsights.join('\n')}\n`;
      
      customized = customized.replace(insightPattern, insightsSection);
    }
  }
  
  // 전략 수 조정
  if (preferences.strategyCount !== undefined && preferences.strategyCount > 0) {
    const strategyPattern = language === 'ko' 
      ? /### 콘텐츠 제작 전략\n\n((?:\d+\. .+\n?)+)/
      : /### Content Strategy\n\n((?:\d+\. .+\n?)+)/;
    
    const strategyMatch = customized.match(strategyPattern);
    if (strategyMatch) {
      const strategies = strategyMatch[1].split('\n').filter(line => /^\d+\./.test(line));
      const limitedStrategies = strategies.slice(0, preferences.strategyCount); // 정확히 요청한 개수만큼 제한
      
      // 번호 재지정
      const renumberedStrategies = limitedStrategies.map((strategy, index) => 
        strategy.replace(/^\d+\./, `${index + 1}.`)
      );
      
      const strategiesSection = language === 'ko'
        ? `### 콘텐츠 제작 전략\n\n${renumberedStrategies.join('\n')}\n`
        : `### Content Strategy\n\n${renumberedStrategies.join('\n')}\n`;
      
      customized = customized.replace(strategyPattern, strategiesSection);
    }
  }
  
  // 상세도 조정
  if (preferences.detailLevel === 'basic') {
    // 기본 모드: 더 간결한 형태로 조정
    // 각 항목에서 세부 내용 일부 제거
    customized = customized.replace(/\*\*[\w\s가-힣]+\*\*: /g, ''); // 볼드 제목 제거
    
    // 행 길이가 너무 긴 경우 자르기
    const lines = customized.split('\n');
    const shortenedLines = lines.map(line => {
      if (line.startsWith('- ') || /^\d+\./.test(line)) {
        // 60자 이상인 행 자르기
        if (line.length > 60) {
          return line.substring(0, 57) + '...';
        }
      }
      return line;
    });
    
    customized = shortenedLines.join('\n');
  }
  
  return customized;
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

/**
 * 교육/학습 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateEducationalAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `교육/학습 분야에서 **${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, 효과적인 교육 방법론, 맞춤형 학습 자료, 그리고 학습 성과 향상 방안에 대한 관심이 높습니다.`;
  
  // 안전한 키워드 선택
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `**${mainKeyword}** 관련 검색의 약 55%는 실제 교육 현장에서의 적용 사례와 효과에 집중되어 있어, 실증적 연구 결과와 사례 중심 콘텐츠가 높은 관심을 받고 있습니다.`,
    `${kw1}에 대한 검색이 최근 3개월간 40% 증가했으며, 특히 온라인 학습 환경에서의 활용 방안에 대한 수요가 증가하고 있습니다.`,
    `${kw2} 관련 콘텐츠 중 학생 참여도와 동기부여 전략을 다루는 주제가 높은 인기를 얻고 있습니다.`,
  ];
  
  const strategies = [
    `**사례 연구 중심**: 현장에서의 실제 적용 사례와 결과를 상세히 소개하는 콘텐츠를 제작하세요.`,
    `**실행 가능한 팁**: 교사나 학부모가 바로 적용할 수 있는 구체적인 전략과 방법을 제공하세요.`,
    `**시각적 자료**: 복잡한 교육 방법론을 인포그래픽, 차트, 다이어그램으로 시각화하여 이해를 돕는 콘텐츠가 효과적입니다.`,
    `**차별화된 접근**: 다양한 학습 스타일과 능력을 고려한 맞춤형 교육 전략을 제시하는 콘텐츠를 개발하세요.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 건강/의료 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateHealthAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `건강/의료 분야에서 **${mainKeyword}**에 대한 검색 패턴을 분석한 결과, 과학적 근거 기반 정보, 실용적인 건강 관리 방법, 그리고 전문가 의견에 대한 관심이 높습니다.`;
  
  // 안전한 키워드 접근
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `**${mainKeyword}** 관련 검색의 약 60%는 과학적 근거와 연구 결과에 기반한 정보를 찾는 것으로, 신뢰성 있는 의학 정보에 대한 수요가 높습니다.`,
    `${kw1} 관련 정보 중 실생활에 적용 가능한 건강 관리 방법과 예방책에 대한 콘텐츠가 높은 참여율을 보입니다.`,
    `최근 ${kw2}와 관련된 검색이 35% 증가했으며, 특히 개인화된 건강 솔루션과 홈케어 방법에 대한 관심이 높아지고 있습니다.`,
  ];
  
  const strategies = [
    `**전문가 의견 인용**: 신뢰할 수 있는 의료 전문가의 견해와 최신 연구 결과를 인용하여 콘텐츠의 신뢰도를 높이세요.`,
    `**시각적 가이드**: 복잡한 의학 정보나 건강 관리 방법을 단계별 이미지나 동영상으로 설명하는 콘텐츠가 효과적입니다.`,
    `**개인화 가능한 조언**: 다양한 상황과 조건에 맞게 조정할 수 있는 유연한 건강 관리 전략을 제시하세요.`,
    `**미신 바로잡기**: 건강 관련 흔한 오해와 잘못된 정보를 과학적 근거를 들어 바로잡는 콘텐츠가 높은 가치를 제공합니다.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 금융/투자 관련 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateFinanceAnalysis(mainKeyword: string, keywords: string[]): string {
  const intro = `금융/투자 분야에서 **${mainKeyword}**에 대한 검색 트렌드를 분석한 결과, 실용적인 투자 전략, 리스크 관리 방법, 그리고 최신 시장 동향에 대한 관심이 높습니다.`;
  
  // 안전한 키워드 선택
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `**${mainKeyword}** 관련 검색의 약 50%는 구체적인 투자 방법론과 전략에 집중되어 있어, 실용적이고 적용 가능한 정보에 대한 수요가 높습니다.`,
    `${kw1} 관련 콘텐츠 중 초보자를 위한 단계별 가이드와 리스크 관리 전략을 다루는 주제가 높은 참여율을 보입니다.`,
    `최근 ${kw2}와 관련된 검색이 증가 추세이며, 특히 경제 불확실성 속에서의 안전한 투자 방안에 대한 관심이 높아지고 있습니다.`,
  ];
  
  const strategies = [
    `**데이터 시각화**: 복잡한 금융 데이터나 시장 트렌드를 차트, 그래프, 인포그래픽으로 시각화하여 이해를 돕는 콘텐츠가 효과적입니다.`,
    `**단계별 가이드**: 금융 초보자도 쉽게 따라할 수 있는 단계별 투자 가이드나 재테크 전략을 제공하세요.`,
    `**사례 연구**: 실제 투자 성공 및 실패 사례를 분석하고 교훈을 도출하는 콘텐츠가 높은 가치를 제공합니다.`,
    `**전문가 인터뷰**: 금융 전문가들의 인사이트와 전망을 담은 인터뷰 형식의 콘텐츠로 신뢰도를 높이세요.`,
  ];
  
  return buildAnalysisText(mainKeyword, intro, insights, strategies);
}

/**
 * 영어 분석 문자열 생성 빌더 함수
 * @param mainKeyword 메인 키워드
 * @param intro 도입부 텍스트
 * @param insights 인사이트 배열
 * @param strategies 전략 배열
 * @returns 포맷된 분석 텍스트
 */
function buildAnalysisTextEn(
  mainKeyword: string, 
  intro: string, 
  insights: string[], 
  strategies: string[]
): string {
  // 이스케이프 처리 - null 또는 undefined 방지
  const safeMainKeyword = (mainKeyword || '').replace(/[*_]/g, '\\$&');
  
  // StringBuilder 패턴 사용
  const parts: string[] = [
    `## ${safeMainKeyword} Keyword Analysis\n\n`,
    intro, 
    "\n\n### Key Insights\n\n"
  ];
  
  // 반복문 대신 map과 join 사용
  parts.push(insights.map(insight => `- ${insight}`).join('\n'));
  
  parts.push("\n\n### Content Strategy\n\n");
  parts.push(strategies.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n'));
  
  // 한 번에 문자열 결합
  return parts.join('');
}

/**
 * AI 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateAIAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analyzing search trends for **${mainKeyword}** in the AI technology field reveals that users are primarily interested in practical applications and technology comparisons.`;
  
  // 안전한 키워드 선택
  const randomKeyword = keywords.length > 1 
    ? keywords[1] // 두 번째 키워드 사용
    : mainKeyword;
  
  const insights = [
    `About 40% of searches related to **${mainKeyword}** focus on practical use cases and examples, making content with real-world applications particularly effective.`,
    `Searches for ${randomKeyword} are trending upward, with comparison content between different AI models gaining popularity.`,
    `Beginner guides and API usage examples show consistent demand, with content containing code examples generating higher engagement.`,
  ];
  
  const strategies = [
    `**Focus on Real Cases**: Create content that showcases concrete applications and results rather than abstract explanations.`,
    `**Comparative Analysis**: Provide content that analyzes the differences between similar AI technologies and their suitable use cases.`,
    `**Step-by-Step Tutorials**: Cover setup to advanced features, including screenshots or videos for each step.`,
    `**Code Examples and Practical Exercises**: Content that provides executable code examples and practical projects offers high value.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 디지털 마케팅 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateMarketingAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of trends for **${mainKeyword}** in the digital marketing field shows high interest in ROI measurement, effective strategy development, and success case studies.`;
  
  // 안전하게 키워드 배열 접근
  const getKeyword = (index: number) => keywords.length > index ? keywords[index] : mainKeyword;
  
  const insights = [
    `Searches for **${getKeyword(0)}** are most common, with high demand for information on concrete performance metrics and ROI.`,
    `Content related to ${getKeyword(1)} faces less competition, offering an opportunity to gain competitive advantage by providing specific methodologies and step-by-step guides.`,
    `Searches for ${getKeyword(2)} have increased by 45% over the past six months, with content covering both success and failure cases receiving notable attention.`,
  ];
  
  const strategies = [
    `**Data-Driven Approach**: Content using specific numbers, statistics, and graphs gains higher credibility.`,
    `**Case Studies**: Content analyzing real success/failure cases and presenting lessons learned drives higher engagement.`,
    `**Actionable Strategies**: Content providing immediately applicable strategies and checklists is more effective than theoretical content.`,
    `**Incorporate Latest Trends**: Cover how artificial intelligence, automation, and other new marketing technologies can be applied to ${mainKeyword}.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 앱 개발 관련 영어 분석 생성 (다른 영어 분석 함수들도 유사한 방식으로 구현)
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateDevelopmentAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of search patterns for **${mainKeyword}** in the app development field reveals high interest in applying latest technologies, performance optimization, and specific implementation examples.`;
  
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `Searches for ${kw1} have increased by 60% compared to the previous quarter, with particularly high demand for actual implementation code and examples.`,
    `Content related to ${kw2} is being searched by a wide audience from beginner to experienced developers, making content that addresses different skill levels effective.`,
    `Topics on performance optimization and user experience improvement are included in top search queries, indicating that content focused on these areas is gaining attention.`,
  ];
  
  const strategies = [
    `**Real Code Examples**: Provide working code and actual project examples rather than theory.`,
    `**Problem-Solving Focus**: Content addressing specific problems developers commonly face provides high value.`,
    `**Performance Optimization**: Cover methods to improve ${mainKeyword} performance and optimization techniques in detail.`,
    `**Latest Updates**: Content covering recent changes in libraries or frameworks and how to adapt to them receives attention.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 3D 모델링/AI 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateModelingAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Interest in **${mainKeyword}** is growing in the 3D modeling/AI field. There's particularly high interest in using MCP Blender integrated with Claude AI or other generative AI tools.`;
  
  const insights = [
    `Currently, about 65% of searches related to **${mainKeyword}** are about tutorials and usage methods, indicating very high demand for beginner-focused content.`,
    `There are many inquiries about Blender MCP setup on **Windows 11**, with relatively low competition for detailed guides on environment configuration and optimization.`,
    `Comparison content between BlenderMCP and Midjourney 3D is gaining popularity, with content analyzing the pros and cons of each tool receiving attention.`,
  ];
  
  const strategies = [
    `**Step-by-Step Tutorials**: Create detailed guides divided into stages from installation to advanced features.`,
    `**Troubleshooting Guides**: Content that presents common problems and solutions shows high engagement rates.`,
    `**Work Gallery**: Create content that showcases works made with MCP Blender and explains the creation process.`,
    `**Performance Optimization**: Provide setup guides for optimal performance across various hardware environments.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 교육/학습 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateEducationalAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of search trends for **${mainKeyword}** in the education/learning field reveals high interest in effective teaching methodologies, customized learning materials, and ways to improve learning outcomes.`;
  
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `About 55% of searches related to **${mainKeyword}** focus on real-world application cases and effectiveness, making evidence-based research results and case-centered content highly sought after.`,
    `Searches for ${kw1} have increased by 40% over the past three months, with growing demand for utilization methods in online learning environments.`,
    `Among content related to ${kw2}, topics covering student engagement and motivation strategies are gaining popularity.`,
  ];
  
  const strategies = [
    `**Case Study Focus**: Create content that introduces real application cases and results in detail.`,
    `**Actionable Tips**: Provide specific strategies and methods that teachers or parents can immediately apply.`,
    `**Visual Materials**: Create content that visualizes complex educational methodologies using infographics, charts, and diagrams.`,
    `**Differentiated Approach**: Develop content that presents customized educational strategies considering various learning styles and abilities.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 일반 키워드 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateGenericAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of search trends for **${mainKeyword}** shows high demand for practical information and comparative analysis.`;
  
  const kw0 = keywords.length > 0 ? keywords[0] : mainKeyword;
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `Searches for ${kw0} are highest in volume, with users mainly interested in basic concepts and usage methods.`,
    `${kw1} and ${kw2} show high correlation, making content that covers both topics potentially effective.`,
    `Comparison and review content represents a niche area with less competition, with content featuring objective comparisons and real user experiences gaining attention.`,
  ];
  
  const strategies = [
    `**Beginner's Guides**: Introductory content explaining basic concepts step by step shows consistent demand.`,
    `**Comparative Analysis**: Content providing objective comparisons with similar products/services offers high value.`,
    `**Problem-Solving Guides**: Content presenting common problems and solutions provides practical help to users.`,
    `**Latest Information Updates**: Provide timely content by regularly covering the latest changes and trends related to ${mainKeyword}.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 건강/의료 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateHealthAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of search patterns for **${mainKeyword}** in the health/medical field reveals high interest in science-based information, practical health management methods, and expert opinions.`;
  
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `About 60% of searches related to **${mainKeyword}** are focused on finding information based on scientific evidence and research results, indicating high demand for reliable medical information.`,
    `Content related to ${kw1} that covers practical health management methods and preventive measures shows high engagement rates.`,
    `Searches related to ${kw2} have increased by 35% recently, with particular interest in personalized health solutions and home care methods.`,
  ];
  
  const strategies = [
    `**Cite Expert Opinions**: Enhance content credibility by citing views from trusted medical experts and recent research findings.`,
    `**Visual Guides**: Create content that explains complex medical information or health management methods using step-by-step images or videos.`,
    `**Customizable Advice**: Present flexible health management strategies that can be adjusted for various situations and conditions.`,
    `**Myth Busting**: Develop content that corrects common misconceptions and misinformation about health using scientific evidence.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

/**
 * 금융/투자 관련 영어 분석 생성
 * @param {string} mainKeyword - 메인 키워드
 * @param {string[]} keywords - 관련 키워드 배열
 * @returns {string} 마크다운 형식의 분석 텍스트
 */
function generateFinanceAnalysisEn(mainKeyword: string, keywords: string[]): string {
  const intro = `Analysis of search trends for **${mainKeyword}** in the finance/investment field shows high interest in practical investment strategies, risk management methods, and latest market trends.`;
  
  const kw1 = keywords.length > 1 ? keywords[1] : mainKeyword;
  const kw2 = keywords.length > 2 ? keywords[2] : mainKeyword;
  
  const insights = [
    `About 50% of searches related to **${mainKeyword}** focus on specific investment methodologies and strategies, indicating high demand for practical and applicable information.`,
    `Content related to ${kw1} that covers step-by-step guides for beginners and risk management strategies shows high engagement rates.`,
    `Searches related to ${kw2} are trending upward, with growing interest in safe investment options during economic uncertainty.`,
  ];
  
  const strategies = [
    `**Data Visualization**: Create content that visualizes complex financial data or market trends using charts, graphs, and infographics.`,
    `**Step-by-Step Guides**: Provide step-by-step investment guides or financial strategies that even financial beginners can easily follow.`,
    `**Case Studies**: Develop content that analyzes real investment success and failure cases and derives lessons from them.`,
    `**Expert Interviews**: Enhance credibility with content featuring insights and forecasts from financial experts.`,
  ];
  
  return buildAnalysisTextEn(mainKeyword, intro, insights, strategies);
}

// 나머지 영어 분석 함수들은 필요에 따라 구현... 