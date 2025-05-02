/**
 * RAG 통합 모듈
 * RAG 엔진을 텔레그램 및 기타 시스템과 통합하기 위한 모듈입니다.
 */

import logger from './logger';
import ragEngine, { RagDocument, RagSearchResult, SupportedLanguage } from './rag_engine';
import { sendTelegramMessage } from './telegram';

/**
 * RAG 통합 옵션
 */
export interface RagIntegrationOptions {
  maxResults?: number;
  threshold?: number;
  formatOutput?: boolean;
  includeCitations?: boolean;
  outputType?: 'text' | 'markdown' | 'html';
  language?: SupportedLanguage;
  cacheResults?: boolean;
  timeout?: number;
}

/**
 * RAG 통합 응답
 */
export interface RagIntegrationResponse {
  originalQuery: string;
  answer: string;
  sources: RagDocument[];
  success: boolean;
  error?: string;
  language?: SupportedLanguage;
  executionTime?: number;
  cached?: boolean;
}

// 캐시 스토리지 객체
const resultCache: Record<string, {
  response: RagIntegrationResponse;
  timestamp: number;
}> = {};

// 캐시 유효 기간(밀리초) - 기본 30분
const CACHE_TTL = 30 * 60 * 1000;

/**
 * 캐시키 생성 함수
 */
function generateCacheKey(query: string, options: RagIntegrationOptions): string {
  const { maxResults, threshold, outputType, language } = options;
  return `${query}_${maxResults}_${threshold}_${outputType}_${language}`;
}

/**
 * RAG 쿼리를 처리하고 응답을 반환합니다.
 * @param query 사용자 쿼리
 * @param options 통합 옵션
 * @returns RAG 통합 응답
 */
export async function processRagQuery(
  query: string,
  options: RagIntegrationOptions = {}
): Promise<RagIntegrationResponse> {
  const startTime = Date.now();
  
  const {
    maxResults = 5,
    threshold = 0.7,
    formatOutput = true,
    includeCitations = true,
    outputType = 'text',
    language = 'ko',
    cacheResults = true,
    timeout = 30000 // 기본 타임아웃 30초
  } = options;

  // 캐시 결과 확인
  if (cacheResults) {
    const cacheKey = generateCacheKey(query, options);
    const cachedResult = resultCache[cacheKey];
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_TTL) {
      logger.log({
        message: `RAG 쿼리 캐시 결과 사용: "${query}"`,
        level: 'info',
        context: { cached: true, cacheAge: Date.now() - cachedResult.timestamp }
      });
      
      return {
        ...cachedResult.response,
        cached: true
      };
    }
  }

  try {
    // 타임아웃 제어를 위한 Promise.race 구현
    const queryPromise = executeRagQuery(query, maxResults, threshold, formatOutput, includeCitations, outputType, language);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('쿼리 처리 시간 초과')), timeout);
    });

    const result = await Promise.race([queryPromise, timeoutPromise]);
    const executionTime = Date.now() - startTime;
    
    // 성공한 경우 실행 시간 및 언어 정보 추가
    const response: RagIntegrationResponse = {
      ...result,
      executionTime,
      language
    };

    // 결과 캐싱
    if (cacheResults) {
      const cacheKey = generateCacheKey(query, options);
      resultCache[cacheKey] = {
        response,
        timestamp: Date.now()
      };
      
      // 캐시 크기 제한 (최대 100개)
      const cacheKeys = Object.keys(resultCache);
      if (cacheKeys.length > 100) {
        // 가장 오래된 캐시 제거
        const oldestKey = cacheKeys.reduce((oldest, key) => 
          resultCache[key].timestamp < resultCache[oldest].timestamp ? key : oldest
        , cacheKeys[0]);
        
        delete resultCache[oldestKey];
      }
    }

    return response;
  } catch (error) {
    logger.error({
      message: `RAG 쿼리 처리 실패: ${error.message}`,
      error,
      context: { query, options, executionTime: Date.now() - startTime }
    });

    return {
      originalQuery: query,
      answer: getErrorMessage(error.message, language),
      sources: [],
      success: false,
      error: error.message,
      language,
      executionTime: Date.now() - startTime
    };
  }
}

/**
 * 언어에 따른 오류 메시지 반환
 */
function getErrorMessage(errorMsg: string, language: SupportedLanguage): string {
  if (language === 'en') {
    return `An error occurred during processing: ${errorMsg}`;
  }
  return `처리 중 오류가 발생했습니다: ${errorMsg}`;
}

/**
 * RAG 쿼리 실행 함수
 */
async function executeRagQuery(
  query: string,
  maxResults: number,
  threshold: number,
  formatOutput: boolean,
  includeCitations: boolean,
  outputType: 'text' | 'markdown' | 'html',
  language: SupportedLanguage
): Promise<RagIntegrationResponse> {
  logger.log({
    message: `RAG 쿼리 처리 시작: "${query}"`,
    level: 'info',
    context: { maxResults, threshold, outputType, language }
  });

  // 1. RAG 검색 실행
  const searchResults = await ragEngine.search(query, { maxResults, threshold });

  // 2. 검색 결과가 없으면 빈 응답 반환
  if (!searchResults.results || searchResults.results.length === 0) {
    const noResultsMessage = language === 'en' 
      ? 'Sorry, I could not find relevant information.'
      : '죄송합니다. 적절한 정보를 찾을 수 없습니다.';
      
    return {
      originalQuery: query,
      answer: noResultsMessage,
      sources: [],
      success: true
    };
  }

  // 3. 검색 결과를 기반으로 생성 실행
  const generationResult = await ragEngine.generate(query, searchResults);

  // 4. 출력 포맷 적용
  let formattedAnswer = generationResult.generatedContent;
  const sources = generationResult.citations || [];

  if (formatOutput) {
    formattedAnswer = formatRagOutput(
      formattedAnswer,
      sources,
      includeCitations,
      outputType,
      language
    );
  }

  return {
    originalQuery: query,
    answer: formattedAnswer,
    sources,
    success: true
  };
}

/**
 * RAG 결과를 텔레그램 메시지로 전송합니다.
 * @param query 사용자 쿼리
 * @param chatId 텔레그램 채팅 ID
 * @param botToken 텔레그램 봇 토큰
 * @param options 통합 옵션
 * @returns 전송 성공 여부
 */
export async function sendRagResponseToTelegram(
  query: string,
  chatId: string,
  botToken: string,
  options: RagIntegrationOptions = {}
): Promise<boolean> {
  try {
    // 기본 옵션 설정 (텔레그램은 HTML 또는 Markdown 형식 지원)
    const telegramOptions: RagIntegrationOptions = {
      ...options,
      formatOutput: true,
      outputType: 'html',
      includeCitations: true
    };

    // RAG 쿼리 처리
    const ragResponse = await processRagQuery(query, telegramOptions);

    // 텔레그램 메시지 전송
    await sendTelegramMessage(botToken, {
      chat_id: chatId,
      text: ragResponse.answer,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    logger.log({
      message: `RAG 응답을 텔레그램으로 전송 완료: chatId=${chatId}`,
      level: 'info',
      context: { 
        query, 
        success: ragResponse.success,
        executionTime: ragResponse.executionTime,
        cached: ragResponse.cached 
      }
    });

    return true;
  } catch (error) {
    logger.error({
      message: `RAG 응답 텔레그램 전송 실패: ${error.message}`,
      error,
      context: { query, chatId }
    });

    try {
      // 오류 발생 시 오류 메시지 전송
      const errorMessage = options.language === 'en'
        ? `Error processing query: ${error.message}`
        : `쿼리 처리 중 오류가 발생했습니다: ${error.message}`;
        
      await sendTelegramMessage(botToken, {
        chat_id: chatId,
        text: errorMessage,
        parse_mode: 'HTML'
      });
    } catch (sendError) {
      logger.error({
        message: `오류 메시지 텔레그램 전송 실패: ${sendError.message}`,
        error: sendError
      });
    }

    return false;
  }
}

/**
 * RAG 출력을 지정된 형식으로 포맷팅합니다.
 * @param content 생성된 콘텐츠
 * @param sources 인용 소스
 * @param includeCitations 인용 포함 여부
 * @param outputType 출력 형식
 * @param language 출력 언어
 * @returns 포맷팅된 출력
 */
function formatRagOutput(
  content: string,
  sources: RagDocument[],
  includeCitations: boolean,
  outputType: 'text' | 'markdown' | 'html',
  language: SupportedLanguage = 'ko'
): string {
  // 기본 콘텐츠 반환
  if (!includeCitations || !sources || sources.length === 0) {
    return content;
  }

  // 인용 정보 추가
  let formattedOutput = content;
  let citationsSection = '';
  
  // 언어별 출처 텍스트
  const sourcesTitle = language === 'en' ? 'Sources:' : '출처:';

  // 출력 유형에 따라 포맷팅
  if (outputType === 'html') {
    // HTML 포맷
    citationsSection = `\n\n<b>${sourcesTitle}</b>\n<ul>`;
    sources.forEach((source, index) => {
      const sourceInfo = source.metadata?.source || (language === 'en' ? `Source ${index + 1}` : `출처 ${index + 1}`);
      citationsSection += `<li>${sourceInfo}</li>`;
    });
    citationsSection += '</ul>';
    
    formattedOutput = `${content}${citationsSection}`;
  } else if (outputType === 'markdown') {
    // 마크다운 포맷
    citationsSection = `\n\n**${sourcesTitle}**\n`;
    sources.forEach((source, index) => {
      const sourceInfo = source.metadata?.source || (language === 'en' ? `Source ${index + 1}` : `출처 ${index + 1}`);
      citationsSection += `- ${sourceInfo}\n`;
    });
    
    formattedOutput = `${content}${citationsSection}`;
  } else {
    // 일반 텍스트 포맷
    citationsSection = `\n\n${sourcesTitle}\n`;
    sources.forEach((source, index) => {
      const sourceInfo = source.metadata?.source || (language === 'en' ? `Source ${index + 1}` : `출처 ${index + 1}`);
      citationsSection += `- ${sourceInfo}\n`;
    });
    
    formattedOutput = `${content}${citationsSection}`;
  }

  return formattedOutput;
}

/**
 * 캐시를 수동으로 정리합니다.
 */
export function clearCache(): void {
  const cacheSize = Object.keys(resultCache).length;
  Object.keys(resultCache).forEach(key => delete resultCache[key]);
  
  logger.log({
    message: `RAG 캐시 지움 완료: ${cacheSize}개 항목`,
    level: 'info'
  });
}

export default {
  processRagQuery,
  sendRagResponseToTelegram,
  clearCache
}; 