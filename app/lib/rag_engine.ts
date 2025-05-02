/**
 * RAG (Retrieval Augmented Generation) 엔진 모듈
 * 검색 기반 생성 기능을 제공합니다.
 */

import logger from './logger';

export interface RagOptions {
  maxResults?: number;
  threshold?: number;
  includeMetadata?: boolean;
  searchProvider?: 'supabase' | 'elasticsearch' | 'pinecone' | 'llm';
}

export interface RagDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface RagSearchResult {
  query: string;
  results: RagDocument[];
  totalCount: number;
  executionTime: number;
}

export interface RagGenerationResult {
  sourceQuery: string;
  generatedContent: string;
  citations: RagDocument[];
  confidence: number;
}

/**
 * 키워드 카테고리 타입
 */
export type KeywordCategory = 
  | 'AI 기술'
  | '디지털 마케팅'
  | '앱 개발' 
  | '교육/학습'
  | '건강/의료'
  | '금융/투자'
  | '3D 모델링/AI'
  | '일반';

/**
 * 지원되는 언어 타입
 */
export type SupportedLanguage = 'ko' | 'en';

/**
 * 사용자 설정 인터페이스
 */
export interface UserPreferences {
  language?: SupportedLanguage;
  industry?: string;
  insightCount?: number;
  strategyCount?: number;
  detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}

/**
 * RAG 검색을 실행합니다
 * @param query 검색 쿼리
 * @param options 검색 옵션
 * @returns 검색 결과
 */
export async function ragSearch(query: string, options: RagOptions = {}): Promise<RagSearchResult> {
  const startTime = Date.now();
  const {
    maxResults = 5,
    threshold = 0.7,
    includeMetadata = true,
    searchProvider = 'supabase'
  } = options;

  try {
    logger.log({
      message: `RAG 검색 시작: "${query}"`,
      level: 'info',
      context: { maxResults, threshold, searchProvider }
    });

    // 여기서는 더미 데이터 반환
    // 실제 구현에서는 searchProvider에 따라 다른 데이터베이스나 벡터 스토어를 쿼리합니다
    const results: RagDocument[] = [
      {
        id: '1',
        content: '인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.',
        metadata: includeMetadata ? { source: 'AI 문서', date: '2023-01-01' } : undefined,
        score: 0.95
      },
      {
        id: '2',
        content: '기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.',
        metadata: includeMetadata ? { source: 'ML 문서', date: '2023-02-15' } : undefined,
        score: 0.85
      },
      {
        id: '3',
        content: '자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.',
        metadata: includeMetadata ? { source: 'NLP 문서', date: '2023-03-20' } : undefined,
        score: 0.75
      }
    ];

    // 임계값과 최대 결과 수에 따라 필터링
    const filteredResults = results
      .filter(doc => doc.score && doc.score >= threshold)
      .slice(0, maxResults);

    const executionTime = Date.now() - startTime;

    logger.log({
      message: `RAG 검색 완료: ${filteredResults.length} 결과 찾음`,
      level: 'info',
      context: { executionTime }
    });

    return {
      query,
      results: filteredResults,
      totalCount: filteredResults.length,
      executionTime
    };
  } catch (error) {
    logger.error({
      message: `RAG 검색 실패: ${error.message}`,
      error,
      context: { query, options }
    });

    throw new Error(`RAG 검색 실패: ${error.message}`);
  }
}

/**
 * 검색 결과를 기반으로 콘텐츠를 생성합니다
 * @param query 사용자 쿼리
 * @param searchResults 검색 결과
 * @returns 생성된 콘텐츠와 인용 정보
 */
export async function generateFromResults(
  query: string,
  searchResults: RagSearchResult
): Promise<RagGenerationResult> {
  try {
    logger.log({
      message: `RAG 콘텐츠 생성 시작: "${query}"`,
      level: 'info',
      context: { resultCount: searchResults.results.length }
    });

    // 여기서는 단순한 더미 응답을 반환합니다
    // 실제 구현에서는 여기서 LLM을 호출하여 검색 결과를 바탕으로 콘텐츠를 생성합니다
    const generatedContent = `
    ${query}에 대한 답변입니다:
    
    ${searchResults.results[0]?.content || '관련 정보를 찾을 수 없습니다.'} 
    ${searchResults.results[1]?.content || ''} 
    ${searchResults.results[2]?.content || ''}
    
    결론적으로, 이는 중요한 AI 개념입니다.
    `;

    return {
      sourceQuery: query,
      generatedContent: generatedContent.trim(),
      citations: searchResults.results,
      confidence: 0.85
    };
  } catch (error) {
    logger.error({
      message: `RAG 콘텐츠 생성 실패: ${error.message}`,
      error,
      context: { query, resultCount: searchResults.results.length }
    });

    throw new Error(`RAG 콘텐츠 생성 실패: ${error.message}`);
  }
}

/**
 * 키워드를 해당 카테고리로 분류합니다.
 * @param keyword 분류할 키워드
 * @returns 키워드 카테고리
 */
export function categorizeKeyword(keyword: string): KeywordCategory {
  if (!keyword) return '일반';
  
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // 카테고리별 키워드 목록과 일치하는지 확인
  const categoryKeywords: Record<KeywordCategory, string[]> = {
    'AI 기술': ['AI', 'GPT', '인공지능', '머신러닝', '딥러닝', 'Claude', 'LLM', '생성형 AI'],
    '디지털 마케팅': ['마케팅', 'SEO', '디지털 마케팅', '소셜미디어', '광고', '콘텐츠 마케팅'],
    '앱 개발': ['앱 개발', '웹 개발', '프로그래밍', '모바일 앱', '웹사이트', '프론트엔드', '백엔드'],
    '교육/학습': ['교육', '학습', '강의', '온라인 강의', 'e러닝', '학교', '대학'],
    '건강/의료': ['건강', '의료', '병원', '운동', '다이어트', '건강관리', '헬스케어'],
    '금융/투자': ['금융', '투자', '주식', '경제', '재테크', '자산관리', '암호화폐'],
    '3D 모델링/AI': ['3D', '모델링', '렌더링', 'CAD', 'Blender', 'Unity', 'Unreal'],
    '일반': []
  };
  
  // 각 카테고리의 키워드 목록과 일치하는지 확인
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => normalizedKeyword.includes(kw.toLowerCase()))) {
      return category as KeywordCategory;
    }
  }
  
  // 일치하는 카테고리가 없으면 '일반' 반환
  return '일반';
}

/**
 * 키워드 배열로부터 마크다운 형식의 분석 결과를 생성합니다.
 * @param keywords 분석할 키워드 배열
 * @param preferences 사용자 설정
 * @returns 마크다운 형식의 분석 결과
 */
export function generateKeywordAnalysis(
  keywords: string[],
  preferences: UserPreferences = {}
): string {
  try {
    // 빈 배열 체크
    if (!keywords || keywords.length === 0) {
      // 언어 설정에 따른 메시지 반환
      return preferences.language === 'en' ? 'No keywords to analyze.' : '분석할 키워드가 없습니다.';
    }
    
    // 기본 설정
    const language = preferences.language || 'ko';
    const insightCount = preferences.insightCount || 3;
    const strategyCount = preferences.strategyCount || 3;
    
    // 키워드 중 첫 번째 것을 대표 키워드로 사용
    const mainKeyword = keywords[0];
    
    // 키워드 카테고리 결정
    let category = categorizeKeyword(mainKeyword);
    
    // 산업 분야가 지정된 경우 카테고리 오버라이드
    if (preferences.industry) {
      const industry = preferences.industry.toLowerCase();
      if (industry.includes('market') || industry.includes('마케팅')) {
        category = '디지털 마케팅';
      } else if (industry.includes('dev') || industry.includes('개발')) {
        category = '앱 개발';
      } else if (industry.includes('ai') || industry.includes('인공지능')) {
        category = 'AI 기술';
      } else if (industry.includes('edu') || industry.includes('교육')) {
        category = '교육/학습';
      } else if (industry.includes('health') || industry.includes('건강') || industry.includes('의료')) {
        category = '건강/의료';
      } else if (industry.includes('finance') || industry.includes('금융') || industry.includes('투자')) {
        category = '금융/투자';
      }
    }
    
    // 언어별 제목과 섹션 이름
    const title = language === 'en' ? `## ${mainKeyword} Keyword Analysis` : `## ${mainKeyword} 키워드 분석`;
    const insightTitle = language === 'en' ? '### Key Insights' : '### 주요 인사이트';
    const strategyTitle = language === 'en' ? '### Content Strategy' : '### 콘텐츠 제작 전략';

    // 인사이트 생성
    const insights = [];
    const insightsByCategory = {
      'AI 기술': [
        language === 'en'
          ? 'AI technology continues to evolve rapidly, with increasing adoption across industries'
          : 'AI 기술은 계속 빠르게 발전하고 있으며, 다양한 산업에서 도입이 증가하고 있습니다',
        language === 'en'
          ? 'Large language models are becoming more accessible to businesses of all sizes'
          : '대규모 언어 모델은 모든 규모의 기업에서 더 쉽게 접근할 수 있게 되었습니다',
        language === 'en'
          ? 'Users are increasingly concerned about ethical AI and data privacy issues'
          : '사용자들은 윤리적 AI와 데이터 프라이버시 문제에 대해 더 관심을 가지고 있습니다'
      ],
      '디지털 마케팅': [
        language === 'en'
          ? 'Content marketing delivers 3x more leads than traditional marketing for 62% less cost'
          : '콘텐츠 마케팅은 기존 마케팅보다 62% 적은 비용으로 3배 더 많은 리드를 창출합니다',
        language === 'en'
          ? 'Video content generates 66% more qualified leads per year'
          : '비디오 콘텐츠는 연간 66% 더 많은 유자격 리드를 생성합니다',
        language === 'en'
          ? 'Mobile-first strategies are essential as mobile traffic exceeds 55% of total web traffic'
          : '모바일 트래픽이 전체 웹 트래픽의 55%를 초과하므로 모바일 우선 전략이 필수적입니다'
      ],
      '일반': [
        language === 'en'
          ? 'Content that answers specific questions performs 70% better in search rankings'
          : '특정 질문에 답하는 콘텐츠는 검색 랭킹에서 70% 더 좋은 성과를 보입니다',
        language === 'en'
          ? 'Visual content is processed 60,000x faster than text by the human brain'
          : '시각적 콘텐츠는 인간의 뇌에서 텍스트보다 60,000배 더 빠르게 처리됩니다',
        language === 'en'
          ? 'Consistent publishing schedules increase audience retention by 25-30%'
          : '일관된 출판 일정은 잠재 고객 유지율을 25-30% 증가시킵니다'
      ]
    };
    
    // 해당 카테고리의 인사이트가 있으면 사용, 없으면 일반 카테고리 사용
    const categoryInsights = insightsByCategory[category] || insightsByCategory['일반'];
    for (let i = 0; i < Math.min(insightCount, categoryInsights.length); i++) {
      insights.push(`- ${categoryInsights[i]}`);
    }
    
    // 전략 생성
    const strategies = [];
    const strategiesByCategory = {
      'AI 기술': [
        language === 'en'
          ? 'Create educational content that demystifies complex AI concepts for your audience'
          : '청중을 위해 복잡한 AI 개념을 이해하기 쉽게 설명하는 교육 콘텐츠를 만드세요',
        language === 'en'
          ? 'Develop case studies showcasing practical AI applications in relevant industries'
          : '관련 산업에서 실용적인 AI 응용 사례를 보여주는 사례 연구를 개발하세요',
        language === 'en'
          ? 'Create comparison content between different AI tools and technologies'
          : '다양한 AI 도구와 기술 간의 비교 콘텐츠를 제작하세요'
      ],
      '디지털 마케팅': [
        language === 'en'
          ? 'Develop a comprehensive content calendar targeting high-value keywords in your niche'
          : '틈새 시장의 고가치 키워드를 타겟팅하는 포괄적인 콘텐츠 캘린더를 개발하세요',
        language === 'en'
          ? 'Create video tutorials demonstrating practical marketing techniques with measurable results'
          : '측정 가능한 결과로 실용적인 마케팅 기법을 보여주는 비디오 튜토리얼을 제작하세요',
        language === 'en'
          ? 'Publish data-driven case studies highlighting ROI of digital marketing strategies'
          : '디지털 마케팅 전략의 ROI를 강조하는 데이터 기반 사례 연구를 발행하세요'
      ],
      '일반': [
        language === 'en'
          ? 'Create comprehensive guides addressing common questions in your topic area'
          : '주제 영역의 일반적인 질문을 다루는 포괄적인 가이드를 만드세요',
        language === 'en'
          ? 'Develop visual content like infographics to simplify complex information'
          : '복잡한 정보를 단순화하는 인포그래픽과 같은 시각적 콘텐츠를 개발하세요',
        language === 'en'
          ? 'Establish a consistent publishing schedule to build audience expectations'
          : '잠재 고객 기대를 구축하기 위한 일관된 출판 일정을 수립하세요'
      ]
    };
    
    // 해당 카테고리의 전략이 있으면 사용, 없으면 일반 카테고리 사용
    const categoryStrategies = strategiesByCategory[category] || strategiesByCategory['일반'];
    for (let i = 0; i < Math.min(strategyCount, categoryStrategies.length); i++) {
      strategies.push(`${i + 1}. ${categoryStrategies[i]}`);
    }
    
    // 최종 마크다운 조합
    const analysisText = [
      title,
      '',
      insightTitle,
      ...insights,
      '',
      strategyTitle,
      ...strategies
    ].join('\n');
    
    return analysisText;
  } catch (error) {
    logger.error({
      message: '키워드 분석 중 오류 발생',
      error: error as Error,
      context: { keywords }
    });

    // 오류 메시지 (언어에 맞게)
    return preferences.language === 'en'
      ? 'An error occurred during keyword analysis. Please try again.'
      : '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

// 인라인 RAG 유틸리티 기본 내보내기
export default {
  search: ragSearch,
  generate: generateFromResults,
  generateKeywordAnalysis,
  categorizeKeyword
}; 