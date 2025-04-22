/**
 * RAG 시스템과 로깅 시스템 통합 유틸리티
 * KeywordPulse 프로젝트의 RAG 기반 텍스트 생성과 로깅 인프라를 연결합니다.
 */

import logger from './logger';

export interface KeywordData {
  keyword: string;
  monthlySearches: number;
  competitionRate: number;
  score: number;
}

export interface RagAnalysisOptions {
  templateType?: 'basic' | 'detailed' | 'marketing';
  maxKeywords?: number;
  scoreThreshold?: number;
  includeStats?: boolean;
}

/**
 * 키워드 데이터로부터 RAG 분석 텍스트를 생성하고 로깅합니다.
 */
export async function generateRagAnalysis(
  keywords: KeywordData[],
  options: RagAnalysisOptions = {}
): Promise<string> {
  const startTime = Date.now();
  
  try {
    // 옵션 기본값 설정
    const {
      templateType = 'basic',
      maxKeywords = 5,
      scoreThreshold = 60,
      includeStats = true
    } = options;
    
    // 로깅: 분석 시작
    logger.log({
      message: 'RAG 분석 시작',
      context: {
        keywordCount: keywords.length,
        options
      },
      tags: { module: 'rag_engine', action: 'start' }
    });
    
    // 점수별 키워드 필터링 및 정렬
    const filteredKeywords = keywords
      .filter(kw => kw.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxKeywords);
    
    // 결과가 없는 경우 처리
    if (filteredKeywords.length === 0) {
      logger.log({
        message: 'RAG 분석: 필터링 후 키워드 없음',
        level: 'warn',
        context: { scoreThreshold },
        tags: { module: 'rag_engine' }
      });
      return '분석할 키워드가 충분하지 않습니다. 점수 기준을 낮추거나 더 많은 키워드를 추가해 주세요.';
    }
    
    // 템플릿 기반 텍스트 생성
    let analysisText = '';
    
    switch (templateType) {
      case 'detailed':
        analysisText = generateDetailedTemplate(filteredKeywords, includeStats);
        break;
      case 'marketing':
        analysisText = generateMarketingTemplate(filteredKeywords, includeStats);
        break;
      case 'basic':
      default:
        analysisText = generateBasicTemplate(filteredKeywords, includeStats);
        break;
    }
    
    const endTime = Date.now();
    const generationTime = endTime - startTime;
    
    // 로깅: 분석 완료
    logger.log({
      message: 'RAG 분석 완료',
      context: {
        templateType,
        filteredKeywordCount: filteredKeywords.length,
        originalKeywordCount: keywords.length,
        outputLength: analysisText.length,
        generationTimeMs: generationTime
      },
      tags: { module: 'rag_engine', action: 'complete' }
    });
    
    return analysisText;
  } catch (error) {
    // 로깅: 분석 중 오류
    logger.error({
      message: 'RAG 분석 오류',
      error: error as Error,
      context: {
        keywordCount: keywords.length,
        options
      },
      tags: { module: 'rag_engine', action: 'error' }
    });
    
    // 에러 발생 시 기본 메시지 반환
    return '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
}

/**
 * 기본 분석 템플릿 생성
 */
function generateBasicTemplate(keywords: KeywordData[], includeStats: boolean): string {
  const topKeyword = keywords[0];
  
  let summary = `## 키워드 분석 결과\n\n`;
  summary += `이번 분석된 키워드 중 **'${topKeyword.keyword}'**가 가장 높은 추천 점수인 ${topKeyword.score}점을 기록했습니다.\n\n`;
  
  summary += `### 추천 키워드 목록\n\n`;
  for (const kw of keywords) {
    summary += `- **${kw.keyword}**${includeStats ? `: 검색량 ${kw.monthlySearches.toLocaleString()}회, 점수 ${kw.score}점` : ''}\n`;
  }
  
  summary += `\n80점 이상 키워드는 콘텐츠 제작 우선순위로 고려하세요.`;
  
  return summary;
}

/**
 * 상세 분석 템플릿 생성
 */
function generateDetailedTemplate(keywords: KeywordData[], includeStats: boolean): string {
  const topKeyword = keywords[0];
  
  let summary = `## 상세 키워드 분석 보고서\n\n`;
  summary += `총 ${keywords.length}개 키워드를 분석한 결과, **'${topKeyword.keyword}'**가 ${topKeyword.score}점으로 최고 점수를 기록했습니다.\n\n`;
  
  if (includeStats) {
    summary += `### 분석 지표 설명\n\n`;
    summary += `- **검색량**: 월간 검색 횟수\n`;
    summary += `- **경쟁률**: 0~1 사이 값 (높을수록 경쟁 치열)\n`;
    summary += `- **점수**: 검색량과 경쟁률을 고려한 종합 점수 (100점 만점)\n\n`;
  }
  
  summary += `### 주요 추천 키워드\n\n`;
  summary += `| 키워드 | 검색량 | 경쟁률 | 종합 점수 |\n`;
  summary += `|--------|---------|---------|----------|\n`;
  
  for (const kw of keywords) {
    summary += `| ${kw.keyword} | ${kw.monthlySearches.toLocaleString()} | ${kw.competitionRate.toFixed(2)} | ${kw.score} |\n`;
  }
  
  summary += `\n### 활용 전략\n\n`;
  summary += `- 80점 이상: 핵심 콘텐츠로 개발\n`;
  summary += `- 70-79점: 보조 콘텐츠로 활용\n`;
  summary += `- 60-69점: 장기적 콘텐츠 계획에 포함\n`;
  
  return summary;
}

/**
 * 마케팅 분석 템플릿 생성
 */
function generateMarketingTemplate(keywords: KeywordData[], includeStats: boolean): string {
  const highScoreKeywords = keywords.filter(kw => kw.score >= 80);
  const midScoreKeywords = keywords.filter(kw => kw.score >= 70 && kw.score < 80);
  
  let summary = `## 마케팅 키워드 인사이트\n\n`;
  
  if (highScoreKeywords.length > 0) {
    summary += `### 🔥 우선순위 키워드\n\n`;
    for (const kw of highScoreKeywords) {
      summary += `- **${kw.keyword}**${includeStats ? ` (점수: ${kw.score}, 검색량: ${kw.monthlySearches.toLocaleString()})` : ''}\n`;
    }
    summary += `\n`;
  }
  
  if (midScoreKeywords.length > 0) {
    summary += `### ⭐ 잠재력 키워드\n\n`;
    for (const kw of midScoreKeywords) {
      summary += `- **${kw.keyword}**${includeStats ? ` (점수: ${kw.score}, 검색량: ${kw.monthlySearches.toLocaleString()})` : ''}\n`;
    }
    summary += `\n`;
  }
  
  summary += `### 마케팅 전략 제안\n\n`;
  
  if (highScoreKeywords.length > 0) {
    summary += `- **${highScoreKeywords[0].keyword}**${highScoreKeywords.length > 1 ? `와(과) **${highScoreKeywords[1].keyword}**` : ''}를 중심으로 핵심 콘텐츠 개발\n`;
  }
  
  summary += `- 검색 광고, SEO, 소셜 미디어에 이 키워드들 중점적으로 활용\n`;
  summary += `- 단기 트래픽 증가는 우선순위 키워드, 장기적 성장은 잠재력 키워드에 집중\n`;
  
  return summary;
}

export default {
  generateRagAnalysis
}; 