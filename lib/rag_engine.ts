/**
 * RAG (Retrieval Augmented Generation) 엔진 모듈
 * 검색 기반 생성 기능을 제공합니다.
 */

import logger from './logger';
import OpenAI from 'openai';
import crypto from 'crypto';
import { performVectorSearch, storeVectorData, VectorData } from './supabaseClient';
import responseFormatter, { ResponseFormatOptions, FormattedResponse } from './response_formatter';

// OpenAI API 클라이언트 초기화
// 환경 변수가 설정되어 있지 않은 경우 개발 목적으로 기본값을 사용
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-xxxxxxxx', // 실제 배포 시 환경 변수 반드시 설정 필요
  dangerouslyAllowBrowser: true // 클라이언트 측 사용을 위한 설정 (개발 환경에서만 사용)
});

// 임베딩 캐시 인터페이스
interface EmbeddingCache {
  [key: string]: {
    embedding: number[];
    timestamp: number;
    model: string;
  };
}

// 캐시 스토리지
const embeddingCache: EmbeddingCache = {};

// 캐시 설정
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간 캐시 유효기간
const MAX_CACHE_SIZE = 1000; // 최대 캐시 항목 수

export interface RagOptions {
  maxResults?: number;
  threshold?: number;
  includeMetadata?: boolean;
  searchProvider?: 'supabase' | 'elasticsearch' | 'pinecone' | 'llm' | 'hybrid';
  embeddingModel?: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002';
  useCache?: boolean; // 캐시 사용 여부
}

export interface RagDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  score?: number;
  embedding?: number[];
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
 * 캐시 키를 생성합니다
 * @param text 임베딩할 텍스트
 * @param model 사용할 모델
 * @returns 캐시 키
 */
function createCacheKey(text: string, model: string): string {
  return crypto
    .createHash('md5')
    .update(`${text}_${model}`)
    .digest('hex');
}

/**
 * 캐시 항목 정리
 * 만료된 항목 및 캐시 크기 제한을 관리합니다
 */
function cleanupCache(): void {
  const now = Date.now();
  const keys = Object.keys(embeddingCache);
  
  // 만료된 항목 삭제
  keys.forEach(key => {
    if (now - embeddingCache[key].timestamp > CACHE_TTL) {
      delete embeddingCache[key];
    }
  });
  
  // 캐시 크기 제한 관리
  if (keys.length > MAX_CACHE_SIZE) {
    // 가장 오래된 항목부터 삭제
    const sortedKeys = keys.sort(
      (a, b) => embeddingCache[a].timestamp - embeddingCache[b].timestamp
    );
    
    const keysToRemove = sortedKeys.slice(0, keys.length - MAX_CACHE_SIZE);
    keysToRemove.forEach(key => {
      delete embeddingCache[key];
    });
    
    logger.log({
      message: `임베딩 캐시 크기 제한으로 ${keysToRemove.length}개 항목 제거됨`,
      level: 'info'
    });
  }
}

/**
 * 텍스트 임베딩을 생성합니다
 * @param text 임베딩할 텍스트
 * @param model 사용할 임베딩 모델
 * @param useCache 캐시 사용 여부
 * @returns 벡터 임베딩 배열
 */
export async function createEmbedding(
  text: string,
  model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002' = 'text-embedding-3-small',
  useCache: boolean = true
): Promise<number[]> {
  try {
    // 캐시 사용이 설정된 경우 캐시에서 임베딩 검색
    if (useCache) {
      const cacheKey = createCacheKey(text, model);
      
      if (embeddingCache[cacheKey]) {
        logger.log({
          message: `캐시에서 임베딩 로드됨`,
          level: 'info',
          context: { textLength: text.length, model, cached: true }
        });
        
        return embeddingCache[cacheKey].embedding;
      }
    }
    
    logger.log({
      message: `텍스트 임베딩 생성 시작`,
      level: 'info',
      context: { textLength: text.length, model, cached: false }
    });

    const response = await openai.embeddings.create({
      model: model,
      input: text,
      encoding_format: 'float'
    });
    
    const embedding = response.data[0].embedding;

    // 캐시 사용이 설정된 경우 결과 캐싱
    if (useCache) {
      const cacheKey = createCacheKey(text, model);
      embeddingCache[cacheKey] = {
        embedding,
        timestamp: Date.now(),
        model
      };
      
      // 정기적으로 캐시 정리 (1% 확률로 실행)
      if (Math.random() < 0.01) {
        cleanupCache();
      }
    }

    logger.log({
      message: `텍스트 임베딩 생성 완료`,
      level: 'info'
    });

    return embedding;
  } catch (error) {
    logger.error({
      message: `텍스트 임베딩 생성 실패: ${error.message}`,
      error,
      context: { textLength: text.length, model }
    });
    throw new Error(`임베딩 생성 실패: ${error.message}`);
  }
}

/**
 * 두 벡터 간의 코사인 유사도를 계산합니다
 * @param vec1 첫 번째 벡터
 * @param vec2 두 번째 벡터
 * @returns 코사인 유사도 (0~1)
 */
export function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('벡터 차원이 일치하지 않습니다');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * BM25 관련 설정
 */
interface BM25Config {
  k1: number;   // 용어 빈도 가중치 (일반적으로 1.2-2.0)
  b: number;    // 문서 길이 정규화 (일반적으로 0.75)
}

const DEFAULT_BM25_CONFIG: BM25Config = {
  k1: 1.5,
  b: 0.75
};

/**
 * BM25 검색 점수를 계산합니다
 * @param query 검색 쿼리 단어 배열
 * @param document 문서 내용
 * @param avgDocLength 평균 문서 길이
 * @param docFrequencies 단어별 문서 빈도
 * @param totalDocs 전체 문서 수
 * @param config BM25 설정
 * @returns BM25 점수
 */
export function calculateBM25Score(
  query: string[],
  document: string,
  avgDocLength: number,
  docFrequencies: Record<string, number>,
  totalDocs: number,
  config: BM25Config = DEFAULT_BM25_CONFIG
): number {
  const { k1, b } = config;
  const words = document.toLowerCase().split(/\s+/);
  const docLength = words.length;
  
  // 문서 내 각 단어의 빈도 계산
  const termFrequencies: Record<string, number> = {};
  words.forEach(word => {
    termFrequencies[word] = (termFrequencies[word] || 0) + 1;
  });
  
  // 쿼리 단어별 BM25 점수 계산 및 합산
  return query.reduce((score, term) => {
    term = term.toLowerCase();
    
    if (!termFrequencies[term]) return score;
    
    // 역문서 빈도 (IDF) 계산
    const df = docFrequencies[term] || 0.5;
    const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
    
    // 정규화된 용어 빈도 (TF)
    const tf = termFrequencies[term];
    const normTf = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLength / avgDocLength)));
    
    return score + idf * normTf;
  }, 0);
}

/**
 * 텍스트에서 주요 키워드를 추출합니다
 * @param text 텍스트
 * @param limit 키워드 수 제한
 * @returns 키워드 배열
 */
export function extractKeywords(text: string, limit: number = 10): string[] {
  // 한국어, 영어 불용어(stopwords) 정의
  const stopwords = new Set([
    // 한국어 불용어
    '이', '그', '저', '것', '및', '에', '를', '을', '이', '가', '은', '는', '와', '과',
    '의', '로', '으로', '에서', '도', '만', '에게', '께', '에게서', '부터', '까지',
    // 영어 불용어
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'have', 'has',
    'had', 'do', 'does', 'did', 'of', 'at', 'in', 'on', 'for', 'to', 'with', 'by'
  ]);
  
  // 텍스트를 단어로 분리하고 불용어 제거
  const words = text.toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')  // 특수 문자 제거 (한글 포함)
    .split(/\s+/)
    .filter(word => word.length > 1 && !stopwords.has(word));  // 불용어 및 한 글자 단어 제거
  
  // 단어 빈도 계산
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  // 빈도 기준 정렬 후 상위 키워드 반환
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * 하이브리드 검색을 실행합니다
 * @param query 검색 쿼리
 * @param documents 검색 대상 문서 배열
 * @param options 검색 옵션
 * @returns 검색 결과
 */
export async function hybridSearch(
  query: string,
  documents: RagDocument[],
  options: RagOptions = {}
): Promise<RagSearchResult> {
  const startTime = Date.now();
  const {
    maxResults = 5,
    threshold = 0.5,
    includeMetadata = true,
    embeddingModel = 'text-embedding-3-small',
    useCache = true
  } = options;
  
  try {
    // 쿼리에서 키워드 추출
    const keywords = extractKeywords(query);
    
    // 임베딩 기반 의미적 검색
    const queryEmbedding = await createEmbedding(query, embeddingModel, useCache);
    
    // BM25 검색을 위한 데이터 준비
    const docLengths = documents.map(doc => doc.content.split(/\s+/).length);
    const avgDocLength = docLengths.reduce((sum, len) => sum + len, 0) / documents.length;
    
    // 용어 빈도 계산
    const docFrequencies: Record<string, number> = {};
    keywords.forEach(keyword => {
      docFrequencies[keyword] = documents.filter(doc => 
        doc.content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
    });
    
    // 하이브리드 점수 계산 (의미적 + 키워드 기반)
    const scoredResults = await Promise.all(documents.map(async (doc) => {
      // 의미적 유사도 점수 (코사인 유사도)
      const semanticScore = doc.embedding 
        ? calculateCosineSimilarity(queryEmbedding, doc.embedding)
        : 0;
      
      // 키워드 기반 점수 (BM25)
      const keywordScore = calculateBM25Score(
        keywords,
        doc.content,
        avgDocLength,
        docFrequencies,
        documents.length
      );
      
      // 최종 하이브리드 점수 (가중치 적용: 의미적 70%, 키워드 30%)
      const hybridScore = (semanticScore * 0.7) + (keywordScore * 0.3);
      
      return {
        ...doc,
        score: hybridScore
      };
    }));
    
    // 점수 기준으로 정렬하고 필터링
    const filteredResults = scoredResults
      .filter(doc => doc.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    
    const executionTime = Date.now() - startTime;
    
    logger.log({
      message: `하이브리드 검색 완료: "${query}"`,
      level: 'info',
      context: {
        resultCount: filteredResults.length,
        executionTime,
        keywords
      }
    });
    
    return {
      query,
      results: filteredResults,
      totalCount: filteredResults.length,
      executionTime
    };
  } catch (error) {
    logger.error({
      message: `하이브리드 검색 실패: ${error.message}`,
      error,
      context: { query }
    });
    
    throw new Error(`하이브리드 검색 실패: ${error.message}`);
  }
}

/**
 * 검색 결과를 기반으로 콘텐츠를 생성합니다
 * @param query 사용자 쿼리
 * @param searchResults 검색 결과
 * @param formatOptions 응답 형식 옵션
 * @returns 생성된 콘텐츠와 인용 정보
 */
export async function generateFromResults(
  query: string,
  searchResults: RagSearchResult,
  formatOptions: ResponseFormatOptions = {}
): Promise<FormattedResponse> {
  try {
    logger.log({
      message: `RAG 콘텐츠 생성 시작: "${query}"`,
      level: 'info',
      context: { resultCount: searchResults.results.length }
    });

    // 검색 결과가 없으면 기본 응답
    if (!searchResults.results || searchResults.results.length === 0) {
      const defaultResponse: RagGenerationResult = {
        sourceQuery: query,
        generatedContent: '관련 정보를 찾을 수 없습니다.',
        citations: [],
        confidence: 0
      };
      
      return responseFormatter.formatRagResponse(defaultResponse, formatOptions);
    }

    // 검색 결과를 컨텍스트로 포맷팅
    const context = searchResults.results.map(doc => doc.content).join('\n\n');

    // OpenAI API로 콘텐츠 생성
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 유용한 정보를 제공하는 도우미입니다. 제공된 정보를 기반으로 사용자 질문에 명확하고 정확하게 답변하세요.'
        },
        {
          role: 'user',
          content: `다음 정보를 기반으로 "${query}"에 대한 답변을 작성해주세요:\n\n${context}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const generatedContent = response.choices[0].message.content;

    // 생성 결과 객체 생성
    const generationResult: RagGenerationResult = {
      sourceQuery: query,
      generatedContent: generatedContent.trim(),
      citations: searchResults.results,
      confidence: 0.85 // 초기 신뢰도 값 (나중에 평가됨)
    };

    // response_formatter를 사용하여 응답 형식화
    const formattedResponse = await responseFormatter.formatRagResponse(generationResult, formatOptions);

    logger.log({
      message: `RAG 콘텐츠 생성 완료: "${query}"`,
      level: 'info',
      context: { 
        responseLength: formattedResponse.content.length,
        confidenceLevel: formattedResponse.metadata.confidenceLevel 
      }
    });

    return formattedResponse;
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

/**
 * 캐시 통계를 반환합니다
 * @returns 캐시 통계 정보
 */
export function getCacheStats() {
  const now = Date.now();
  const cacheKeys = Object.keys(embeddingCache);
  const activeItems = cacheKeys.filter(
    key => now - embeddingCache[key].timestamp <= CACHE_TTL
  ).length;
  
  return {
    totalItems: cacheKeys.length,
    activeItems,
    expiredItems: cacheKeys.length - activeItems,
    cacheSize: JSON.stringify(embeddingCache).length / 1024, // KB 단위
    maxItems: MAX_CACHE_SIZE
  };
}

/**
 * 캐시를 수동으로 비웁니다
 */
export function clearCache(): void {
  const itemCount = Object.keys(embeddingCache).length;
  Object.keys(embeddingCache).forEach(key => {
    delete embeddingCache[key];
  });
  
  logger.log({
    message: `임베딩 캐시 수동 삭제됨: ${itemCount}개 항목`,
    level: 'info'
  });
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
    searchProvider = 'supabase',
    embeddingModel = 'text-embedding-3-small',
    useCache = true
  } = options;

  try {
    logger.log({
      message: `RAG 검색 시작: "${query}"`,
      level: 'info',
      context: { maxResults, threshold, searchProvider, embeddingModel, useCache }
    });

    // 쿼리 임베딩 생성 (캐시 사용)
    const queryEmbedding = await createEmbedding(query, embeddingModel, useCache);

    // 하이브리드 검색 사용 (벡터 + 키워드 검색)
    if (searchProvider === 'hybrid') {
      return hybridSearch(query, await getDocumentsForSearch(), options);
    }

    let results: RagDocument[] = [];

    // 검색 공급자에 따라 다른 검색 로직 사용
    if (searchProvider === 'supabase') {
      // Supabase 벡터 검색 사용
      const searchResult = await performVectorSearch({
        queryVector: queryEmbedding,
        limit: maxResults,
        threshold: threshold,
      });

      if (searchResult.success) {
        // Supabase 검색 결과를 RagDocument 형식으로 변환
        results = searchResult.results.map(item => ({
          id: item.id,
          content: item.content,
          metadata: includeMetadata ? item.metadata : undefined,
          score: item.score
        }));
      } else {
        // 오류 발생 시 로깅
        logger.error({
          message: `Supabase 벡터 검색 실패: ${searchResult.error}`,
          error: searchResult.error,
          context: { query }
        });
        
        // 오류 시 대체 검색 결과 사용 (데모 데이터)
        results = await getDocumentsForSearch().then(docs => {
          // 코사인 유사도 기반 점수 계산
          return docs.map(doc => {
            const similarity = calculateCosineSimilarity(queryEmbedding, doc.embedding);
            return {
              ...doc,
              score: similarity
            };
          });
        });
      }
    } else {
      // 기존 검색 로직 (데모 데이터 사용)
      const documents = await getDocumentsForSearch();
      
      // 코사인 유사도 기반 점수 계산
      results = documents.map(doc => {
        const similarity = calculateCosineSimilarity(queryEmbedding, doc.embedding);
        return {
          ...doc,
          score: similarity
        };
      });
    }

    // 점수 기준으로 정렬하고 필터링
    const filteredResults = results
      .filter(doc => doc.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // 결과에서 임베딩 제거 (응답 크기 감소)
    const cleanResults = filteredResults.map(({ embedding, ...rest }) => rest);

    const executionTime = Date.now() - startTime;

    logger.log({
      message: `RAG 검색 완료: ${cleanResults.length} 결과 찾음`,
      level: 'info',
      context: { executionTime, searchProvider }
    });

    return {
      query,
      results: cleanResults,
      totalCount: cleanResults.length,
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
 * 검색에 사용할 문서 데이터를 가져옵니다
 * @returns 문서 배열
 */
async function getDocumentsForSearch(): Promise<RagDocument[]> {
  // 데모 문서 데이터 (실제 환경에서는 데이터베이스나 벡터 저장소에서 가져와야 함)
  const demoDocuments: RagDocument[] = [
    {
      id: '1',
      content: '인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.',
      metadata: { source: 'AI 문서', date: '2023-01-01' },
      embedding: await createEmbedding('인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.', 'text-embedding-3-small', true)
    },
    {
      id: '2',
      content: '기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.',
      metadata: { source: 'ML 문서', date: '2023-02-15' },
      embedding: await createEmbedding('기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.', 'text-embedding-3-small', true)
    },
    {
      id: '3',
      content: '자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.',
      metadata: { source: 'NLP 문서', date: '2023-03-20' },
      embedding: await createEmbedding('자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.', 'text-embedding-3-small', true)
    }
  ];

  return demoDocuments;
}

/**
 * 벡터 데이터를 저장소에 추가합니다
 * @param content 문서 내용
 * @param metadata 메타데이터
 * @param embeddingModel 임베딩 모델
 * @returns 저장 결과
 */
export async function addDocumentToVectorStore(
  content: string,
  metadata: Record<string, any> = {},
  embeddingModel: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002' = 'text-embedding-3-small'
) {
  try {
    // 임베딩 생성
    const embedding = await createEmbedding(content, embeddingModel, true);
    
    // 벡터 데이터 생성 및 저장
    const vectorData: VectorData = {
      content,
      embedding,
      metadata
    };
    
    // Supabase에 벡터 데이터 저장
    const result = await storeVectorData(vectorData);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    logger.log({
      message: `벡터 데이터 저장 성공: ${result.id}`,
      level: 'info',
      context: { contentLength: content.length, model: embeddingModel }
    });
    
    return {
      success: true,
      id: result.id,
      error: null
    };
  } catch (error) {
    logger.error({
      message: `벡터 데이터 저장 실패: ${error.message}`,
      error,
      context: { contentLength: content.length }
    });
    
    return {
      success: false,
      id: null,
      error: error.message
    };
  }
}

// 인라인 RAG 유틸리티 기본 내보내기
export default {
  search: ragSearch,
  generate: generateFromResults,
  generateKeywordAnalysis,
  categorizeKeyword,
  createEmbedding,
  calculateCosineSimilarity,
  calculateBM25Score,
  extractKeywords,
  getCacheStats,
  clearCache
}; 