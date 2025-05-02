/**
 * response_formatter.ts
 * RAG 시스템의 생성 결과를 후처리하는 유틸리티 모듈
 */

import logger from './logger';
import { RagDocument, RagGenerationResult } from './rag_engine';
import OpenAI from 'openai';

// OpenAI API 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-xxxxxxxx', // 실제 배포 시 환경 변수 반드시 설정 필요
  dangerouslyAllowBrowser: true // 클라이언트 측 사용을 위한 설정 (개발 환경에서만 사용)
});

/**
 * 응답 형식 옵션
 */
export interface ResponseFormatOptions {
  // 응답 형식 (기본: 마크다운)
  format?: 'markdown' | 'html' | 'json' | 'text';
  // 인용 스타일
  citationStyle?: 'numbered' | 'authorYear' | 'none';
  // 요약 포함 여부
  includeSummary?: boolean;
  // 최대 응답 길이
  maxLength?: number;
  // 신뢰도 임계값 (0-1)
  confidenceThreshold?: number;
}

/**
 * 포맷팅된 응답 인터페이스
 */
export interface FormattedResponse {
  content: string;          // 주요 컨텐츠
  summary?: string;         // 요약 (옵션)
  citations: Citation[];    // 인용 정보
  confidence: number;       // 신뢰도 점수
  metadata: {               // 메타데이터
    format: string;
    processedAt: string;
    responseLength: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
}

/**
 * 인용 정보 인터페이스
 */
export interface Citation {
  id: string;
  content: string;
  source?: string;
  author?: string;
  date?: string;
  url?: string;
}

/**
 * 생성 결과의 신뢰도를 평가합니다
 * @param generationResult 생성 결과
 * @param citationTexts 인용 텍스트 배열
 * @returns 신뢰도 점수 (0-1)
 */
export async function evaluateConfidence(
  generationResult: RagGenerationResult,
  citationTexts: string[]
): Promise<number> {
  try {
    // 인용 소스가 없는 경우 낮은 신뢰도 반환
    if (!citationTexts.length) {
      return 0.3;
    }

    // 생성된 텍스트와 인용 소스 간의 일관성 확인
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 텍스트와 소스 간의 일관성을 평가하는 도구입니다. 생성된 텍스트와 인용 소스 사이의 일관성을 0부터 1 사이의 점수로 평가하세요.'
        },
        {
          role: 'user',
          content: `생성된 텍스트: "${generationResult.generatedContent}"\n\n인용 소스:\n${citationTexts.join('\n\n')}`
        }
      ],
      temperature: 0.2,
    });

    // 응답에서 숫자만 추출
    const confidenceText = response.choices[0].message.content;
    const confidenceMatch = confidenceText.match(/0\.\d+|1\.0|1/);
    
    if (confidenceMatch) {
      return parseFloat(confidenceMatch[0]);
    }

    // 기본 신뢰도 (중간 수준)
    return 0.7;
  } catch (error) {
    logger.error({
      message: `신뢰도 평가 중 오류 발생: ${error.message}`,
      error,
      context: { 
        generationContentLength: generationResult.generatedContent.length,
        citationsCount: citationTexts.length
      }
    });

    // 오류 발생 시 중간 수준의 신뢰도 반환
    return 0.5;
  }
}

/**
 * 생성 결과에서 인용 정보를 추출합니다
 * @param documents 인용 문서 배열
 * @param citationStyle 인용 스타일
 * @returns 인용 정보 배열
 */
export function extractCitations(
  documents: RagDocument[],
  citationStyle: 'numbered' | 'authorYear' | 'none' = 'numbered'
): Citation[] {
  if (citationStyle === 'none') return [];

  return documents.map((doc, index) => {
    // 메타데이터에서 소스 정보 추출
    const metadata = doc.metadata || {};
    
    return {
      id: doc.id,
      content: doc.content,
      source: metadata.source || '알 수 없는 소스',
      author: metadata.author || '작성자 미상',
      date: metadata.date || '날짜 미상',
      url: metadata.url
    };
  });
}

/**
 * 긴 텍스트의 요약을 생성합니다
 * @param text 요약할 텍스트
 * @returns 요약된 텍스트
 */
export async function generateSummary(text: string): Promise<string> {
  // 텍스트가 너무 짧으면 요약하지 않음
  if (text.length < 500) return '';
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '다음 텍스트를 2-3문장으로 간결하게 요약하세요.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    logger.error({
      message: `텍스트 요약 중 오류 발생: ${error.message}`,
      error,
      context: { textLength: text.length }
    });

    // 오류 발생 시 빈 요약 반환
    return '';
  }
}

/**
 * 텍스트에 인용 마크업을 추가합니다
 * @param text 원본 텍스트
 * @param citations 인용 정보 배열
 * @param format 출력 형식
 * @param citationStyle 인용 스타일
 * @returns 인용이 추가된 텍스트
 */
export function addCitationMarkup(
  text: string,
  citations: Citation[],
  format: 'markdown' | 'html' | 'json' | 'text' = 'markdown',
  citationStyle: 'numbered' | 'authorYear' | 'none' = 'numbered'
): string {
  if (citationStyle === 'none' || !citations.length) {
    return text;
  }

  let result = text;
  
  // 형식에 따라 다른 인용 마크업 추가
  if (format === 'markdown') {
    // 마크다운 형식의 인용 추가
    result += '\n\n## 참고 자료\n\n';
    
    if (citationStyle === 'numbered') {
      // 번호 형식 인용
      citations.forEach((citation, index) => {
        result += `[${index + 1}] ${citation.source}`;
        if (citation.author) result += `, ${citation.author}`;
        if (citation.date) result += ` (${citation.date})`;
        if (citation.url) result += `, [링크](${citation.url})`;
        result += '\n';
      });
    } else {
      // 저자-연도 형식 인용
      citations.forEach(citation => {
        const author = citation.author || '작성자 미상';
        const date = citation.date?.slice(0, 4) || '날짜 미상';
        
        result += `${author} (${date}). ${citation.source}`;
        if (citation.url) result += `, [링크](${citation.url})`;
        result += '\n';
      });
    }
  } else if (format === 'html') {
    // HTML 형식의 인용 추가
    result += '<h2>참고 자료</h2><ol>';
    
    citations.forEach(citation => {
      result += '<li>';
      result += citation.source || '알 수 없는 소스';
      
      if (citation.author) result += `, <em>${citation.author}</em>`;
      if (citation.date) result += ` (${citation.date})`;
      if (citation.url) result += `, <a href="${citation.url}">링크</a>`;
      
      result += '</li>';
    });
    
    result += '</ol>';
  }
  
  return result;
}

/**
 * 텍스트 길이를 제한합니다
 * @param text 원본 텍스트
 * @param maxLength 최대 길이
 * @returns 길이가 제한된 텍스트
 */
export function limitTextLength(text: string, maxLength: number = 2000): string {
  if (text.length <= maxLength) return text;
  
  // 문장 단위로 자르기
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let result = '';
  
  for (const sentence of sentences) {
    if ((result + sentence).length <= maxLength) {
      result += sentence;
    } else {
      break;
    }
  }
  
  // 잘린 표시 추가
  if (result.length < text.length) {
    result += ' [...]';
  }
  
  return result;
}

/**
 * 신뢰도 수준을 결정합니다
 * @param score 신뢰도 점수 (0-1)
 * @returns 신뢰도 수준 ('high', 'medium', 'low')
 */
export function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.8) return 'high';
  if (score >= 0.5) return 'medium';
  return 'low';
}

/**
 * RAG 생성 결과를 형식화합니다
 * @param generationResult RAG 생성 결과
 * @param options 응답 형식 옵션
 * @returns 형식화된 응답
 */
export async function formatRagResponse(
  generationResult: RagGenerationResult,
  options: ResponseFormatOptions = {}
): Promise<FormattedResponse> {
  // 기본 옵션 설정
  const {
    format = 'markdown',
    citationStyle = 'numbered',
    includeSummary = true,
    maxLength = 2000,
    confidenceThreshold = 0.5
  } = options;

  try {
    logger.log({
      message: '응답 형식화 시작',
      level: 'info',
      context: { format, citationStyle, includeSummary }
    });

    // 인용 정보 추출
    const citations = extractCitations(generationResult.citations, citationStyle);
    const citationTexts = citations.map(c => c.content);

    // 신뢰도 평가
    const confidence = await evaluateConfidence(generationResult, citationTexts);
    const confidenceLevel = getConfidenceLevel(confidence);

    // 텍스트 길이 제한
    let content = limitTextLength(generationResult.generatedContent, maxLength);

    // 신뢰도에 따른 경고 추가
    if (confidence < confidenceThreshold) {
      const warningText = format === 'markdown' 
        ? '\n\n> **참고**: 이 응답의 신뢰도가 낮으므로 정보를 주의해서 검토하세요.\n\n' 
        : '\n\n주의: 이 응답의 신뢰도가 낮으므로 정보를 주의해서 검토하세요.\n\n';
      content = warningText + content;
    }

    // 인용 마크업 추가
    content = addCitationMarkup(content, citations, format, citationStyle);

    // 요약 생성 (옵션이 활성화된 경우)
    let summary = '';
    if (includeSummary && content.length > 500) {
      summary = await generateSummary(generationResult.generatedContent);
    }

    // 최종 형식화된 응답 생성
    const formattedResponse: FormattedResponse = {
      content,
      summary,
      citations,
      confidence,
      metadata: {
        format,
        processedAt: new Date().toISOString(),
        responseLength: content.length,
        confidenceLevel
      }
    };

    logger.log({
      message: '응답 형식화 완료',
      level: 'info',
      context: { 
        responseLength: content.length,
        confidenceLevel,
        citationsCount: citations.length
      }
    });

    return formattedResponse;
  } catch (error) {
    logger.error({
      message: `응답 형식화 중 오류 발생: ${error.message}`,
      error,
      context: { generationResult }
    });

    // 오류 발생 시 기본 응답 반환
    return {
      content: generationResult.generatedContent,
      citations: [],
      confidence: 0.5,
      metadata: {
        format: format,
        processedAt: new Date().toISOString(),
        responseLength: generationResult.generatedContent.length,
        confidenceLevel: 'medium'
      }
    };
  }
}

// 기본 내보내기
export default {
  formatRagResponse,
  evaluateConfidence,
  extractCitations,
  generateSummary,
  addCitationMarkup,
  limitTextLength,
  getConfidenceLevel
}; 