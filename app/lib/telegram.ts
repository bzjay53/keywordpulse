/**
 * KeywordPulse 텔레그램 API 유틸리티 라이브러리
 * 
 * 텔레그램 메시지 전송, 형식화, 에러 처리 등을 위한 유틸리티 함수 모음
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { KeywordData, generateRagAnalysis, RagAnalysisOptions } from './rag-integration';

// Telegram API URL 생성
export const getTelegramApiUrl = (token: string, method: string) => {
  return `https://api.telegram.org/bot${token}/${method}`;
};

// 공통 스타일 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 메시지 개체 유형 정의
export interface TelegramMessageOptions {
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

// 키워드 분석 데이터 타입
export interface KeywordAnalysisData {
  keyword: string;
  score: number;
  trend: string;
  customMessage?: string;
}

// RAG 분석 데이터 타입
export interface RagAnalysisData {
  keyword: string;
  analysis: string;
  templateType?: 'full' | 'summary' | 'compact';
}

/**
 * 텔레그램 메시지 전송
 * @param token 텔레그램 봇 토큰
 * @param messageOptions 메시지 옵션 (채팅 ID, 텍스트, 파싱 모드 등)
 * @returns 텔레그램 API 응답
 */
export async function sendTelegramMessage(
  token: string, 
  messageOptions: {
    chat_id: string;
    text: string;
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
  }
) {
  const defaultOptions = {
    parse_mode: 'HTML',
    disable_web_page_preview: false,
    disable_notification: false,
  };

  const options = { ...defaultOptions, ...messageOptions };
  
  // 메시지 길이 검사 (텔레그램 제한: 4096자)
  if (options.text.length > 4096) {
    console.warn('텔레그램 메시지가 4096자를 초과합니다. 메시지가 잘립니다.');
    options.text = options.text.substring(0, 4090) + '...';
  }

  const response = await fetch(getTelegramApiUrl(token, 'sendMessage'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: options.chat_id,
      text: options.text,
      parse_mode: options.parse_mode,
      disable_web_page_preview: options.disable_web_page_preview,
      disable_notification: options.disable_notification,
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`텔레그램 API 오류: ${result.description} (${result.error_code})`);
  }

  return result;
}

/**
 * 마크다운 텍스트를 HTML로 변환
 * 단순 마크다운 구문 변환 (완전한 파서는 아님)
 * @param markdown 마크다운 텍스트
 * @returns HTML 형식 텍스트
 */
export function markdownToHtml(markdown: string): string {
  // 기본적인 마크다운 -> HTML 변환
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // 굵게
    .replace(/\*(.*?)\*/g, '<b>$1</b>')     // 굵게 (단일 *)
    .replace(/_(.*?)_/g, '<i>$1</i>')       // 기울임
    .replace(/`(.*?)`/g, '<code>$1</code>') // 코드
    .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>') // 코드 블록
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>'); // 링크
}

/**
 * 키워드 분석 결과를 텔레그램 메시지로 형식화합니다.
 */
export function formatKeywordAnalysisMessage({
  keyword,
  score,
  trend,
  customMessage
}: {
  keyword: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  customMessage?: string;
}): string {
  // 트렌드에 따른 이모지 설정
  let trendEmoji: string;
  switch (trend) {
    case 'up':
      trendEmoji = '🔼';
      break;
    case 'down':
      trendEmoji = '🔽';
      break;
    default:
      trendEmoji = '➡️';
  }

  // 점수에 따른 이모지 설정
  let scoreEmoji: string;
  if (score >= 80) {
    scoreEmoji = '🔥';
  } else if (score >= 60) {
    scoreEmoji = '⭐';
  } else if (score >= 40) {
    scoreEmoji = '✅';
  } else if (score >= 20) {
    scoreEmoji = '⚠️';
  } else {
    scoreEmoji = '❌';
  }

  // 메시지 형식화
  let message = `<b>${scoreEmoji} 키워드: ${keyword}</b>\n\n`;
  message += `<b>점수:</b> ${score}/100 ${trendEmoji}\n`;
  
  // 점수별 분석 내용
  let analysis = '';
  if (score >= 80) {
    analysis = '현재 이 키워드는 매우 높은 관심을 받고 있으며, 빠르게 조치를 취하는 것이 좋습니다.';
  } else if (score >= 60) {
    analysis = '이 키워드는 상당한 관심을 받고 있으며, 주의 깊게 모니터링해야 합니다.';
  } else if (score >= 40) {
    analysis = '이 키워드는 보통 수준의 관심을 받고 있으며, 정기적으로 확인하는 것이 좋습니다.';
  } else if (score >= 20) {
    analysis = '이 키워드는 낮은 관심을 받고 있으나, 상황이 변할 수 있으므로 주기적으로 확인하세요.';
  } else {
    analysis = '이 키워드는 현재 매우 낮은 관심을 받고 있습니다.';
  }
  
  message += `<b>분석:</b> ${analysis}\n`;
  
  // 사용자 지정 메시지가 있는 경우 추가
  if (customMessage) {
    message += `\n<b>추가 정보:</b> ${customMessage}\n`;
  }
  
  // 푸터 추가
  message += `\n<a href="https://keywordpulse.app/dashboard/${encodeURIComponent(keyword)}">대시보드에서 자세히 보기</a>`;

  return message;
}

/**
 * RAG 기반 분석 결과 메시지 형식화
 * @param data RAG 분석 데이터
 * @returns 형식화된 HTML 메시지
 */
export function formatRagAnalysisMessage(data: RagAnalysisData): string {
  const { keyword, analysis, templateType = 'full' } = data;
  
  // 분석 결과가 너무 길지 않도록 제한
  const maxAnalysisLength = templateType === 'full' ? 3000 : 
                           templateType === 'summary' ? 1500 : 800;
  
  const analysisText = analysis.length > maxAnalysisLength 
    ? analysis.substring(0, maxAnalysisLength - 3) + '...' 
    : analysis;

  // 템플릿 유형에 따른 메시지 형식
  let message = '';
  
  switch (templateType) {
    case 'compact':
      message = `
<b>📊 키워드 분석: ${keyword}</b>

${analysisText}

<a href="https://keywordpulse.app/analysis/${encodeURIComponent(keyword)}">전체 분석 보기</a>
`;
      break;
      
    case 'summary':
      message = `
<b>📊 키워드 분석 요약</b>

<b>키워드:</b> <code>${keyword}</code>

<b>분석 요약:</b>
${analysisText}

<a href="https://keywordpulse.app/analysis/${encodeURIComponent(keyword)}">전체 분석 보기</a>
`;
      break;
      
    case 'full':
    default:
      message = `
<b>📊 키워드 상세 분석</b>

<b>키워드:</b> <code>${keyword}</code>

<b>분석 결과:</b>
${analysisText}

<a href="https://keywordpulse.app/analysis/${encodeURIComponent(keyword)}">대시보드에서 보기</a>
`;
      break;
  }
  
  return message;
}

/**
 * 에러 메시지 형식화
 * @param error 에러 객체 또는 메시지
 * @returns 형식화된 에러 메시지
 */
export function formatErrorMessage(error: Error | string): string {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return `
<b>❌ 오류 발생</b>

${errorMessage}

오류가 계속되면 관리자에게 문의하세요.
`;
}

/**
 * 텔레그램 API 에러 코드 처리
 * @param errorCode 텔레그램 API 에러 코드
 * @returns 사용자 친화적인 에러 메시지
 */
export function handleTelegramErrorCode(errorCode: number): string {
  switch (errorCode) {
    case 400:
      return '잘못된 요청입니다. 매개변수를 확인하세요.';
    case 401:
      return '인증에 실패했습니다. 올바른 봇 토큰을 사용하고 있는지 확인하세요.';
    case 403:
      return '권한이 없습니다. 봇이 해당 채팅방에 추가되었는지 확인하세요.';
    case 404:
      return '사용자 또는 채팅방을 찾을 수 없습니다. 채팅 ID를 확인하세요.';
    case 409:
      return '충돌이 발생했습니다. 나중에 다시 시도하세요.';
    case 429:
      return '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도하세요.';
    case 500:
    case 502:
    case 503:
    case 504:
      return '텔레그램 서버 오류가 발생했습니다. 나중에 다시 시도하세요.';
    default:
      return `알 수 없는 오류가 발생했습니다. (오류 코드: ${errorCode})`;
  }
}

/**
 * 텔레그램 인라인 키보드 버튼으로 메시지 전송
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @param text 전송할 메시지
 * @param buttons 인라인 키보드 버튼 배열 (2차원 배열)
 * @param options 추가 메시지 옵션
 * @returns 텔레그램 API 응답
 */
export async function sendMessageWithButtons(
  token: string,
  chatId: string,
  text: string,
  buttons: Array<Array<{ text: string; url?: string; callback_data?: string }>>,
  options: TelegramMessageOptions = {}
) {
  const defaultOptions: TelegramMessageOptions = {
    parse_mode: 'HTML',
    disable_web_page_preview: false,
    disable_notification: false,
  };

  const messageOptions = { ...defaultOptions, ...options };

  const response = await fetch(getTelegramApiUrl(token, 'sendMessage'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: messageOptions.parse_mode,
      disable_web_page_preview: messageOptions.disable_web_page_preview,
      disable_notification: messageOptions.disable_notification,
      reply_markup: {
        inline_keyboard: buttons,
      },
    }),
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`텔레그램 API 오류: ${result.description} (${result.error_code})`);
  }

  return result;
}

/**
 * 텔레그램 메시지를 여러 부분으로 나누어 전송
 * 메시지가 텔레그램 제한(4096자)을 초과할 경우 사용
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @param text 전송할 메시지
 * @param options 메시지 옵션
 * @returns 결과 배열
 */
export async function sendLongMessage(
  token: string,
  chatId: string,
  text: string,
  options: TelegramMessageOptions = {}
) {
  const maxLength = 4000; // 여유있게 4000자로 설정
  const results = [];

  // 메시지가 최대 길이보다 길면 여러 부분으로 나눔
  if (text.length <= maxLength) {
    // 단일 메시지로 전송
    const result = await sendTelegramMessage(token, {
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode,
      disable_web_page_preview: options.disable_web_page_preview,
      disable_notification: options.disable_notification,
    });
    results.push(result);
  } else {
    // 메시지를 여러 부분으로 나누어 전송
    let remainingText = text;
    let partNumber = 1;
    
    while (remainingText.length > 0) {
      // 최대한 적절한 위치(줄바꿈, 공백 등)에서 분할
      let splitIndex = maxLength;
      if (remainingText.length > maxLength) {
        // 적절한 분할 지점 찾기 (줄바꿈, 마침표, 공백)
        const newlineIndex = remainingText.lastIndexOf('\n', maxLength);
        const periodIndex = remainingText.lastIndexOf('. ', maxLength);
        const spaceIndex = remainingText.lastIndexOf(' ', maxLength);
        
        if (newlineIndex > maxLength / 2) {
          splitIndex = newlineIndex + 1; // \n 포함
        } else if (periodIndex > maxLength / 2) {
          splitIndex = periodIndex + 2; // '. ' 포함
        } else if (spaceIndex > maxLength / 2) {
          splitIndex = spaceIndex + 1; // 공백 포함
        }
      }
      
      const part = remainingText.substring(0, splitIndex);
      remainingText = remainingText.substring(splitIndex);
      
      // 파트 번호 표시 추가 (파트가 여러 개인 경우)
      let partText = part;
      if (text.length > maxLength) {
        // 첫 부분이면 '계속...' 추가, 아니면 '...계속' 추가
        if (partNumber === 1) {
          partText += '\n\n(계속...)';
        } else {
          partText = `(...계속)\n\n${partText}`;
        }
      }
      
      const result = await sendTelegramMessage(token, {
        chat_id: chatId,
        text: partText,
        parse_mode: options.parse_mode,
        disable_web_page_preview: options.disable_web_page_preview,
        disable_notification: options.disable_notification,
      });
      results.push(result);
      partNumber++;
      
      // 텔레그램 API 속도 제한 방지를 위한 지연
      if (remainingText.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  return results;
}

/**
 * 텔레그램 메시지 형식을 HTML로 변환
 * @param message 원본 메시지
 * @returns HTML 형식의 메시지
 */
export function formatMessageAsHTML(message: string): string {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **bold** -> <b>bold</b>
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // *italic* -> <i>italic</i>
    .replace(/`(.*?)`/g, '<code>$1</code>'); // `code` -> <code>code</code>
}

/**
 * 텔레그램 설정 유효성 검사
 * @param token 텔레그램 봇 토큰
 * @param chatId 텔레그램 채팅 ID
 * @returns 유효성 검사 결과
 */
export async function validateTelegramConfig(
  token: string,
  chatId: string
): Promise<{ valid: boolean; message: string }> {
  try {
    const result = await sendTelegramMessage(token, {
      chat_id: chatId,
      text: '텔레그램 설정 검증 메시지',
      parse_mode: 'HTML',
    });

    if (result.ok) {
      return { valid: true, message: '텔레그램 설정이 유효합니다.' };
    } else {
      return { 
        valid: false, 
        message: `텔레그램 설정이 유효하지 않습니다: ${result.description || '알 수 없는 오류'}` 
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: `텔레그램 설정 검증 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
    };
  }
}

/**
 * 분석 결과 알림 메시지 형식화
 * @param keyword 키워드
 * @param score 점수
 * @param trends 트렌드 정보
 * @returns 포맷된 메시지
 */
export function formatAnalysisNotification(
  keyword: string,
  score: number,
  trends: { period: string; change: number }[]
): string {
  let message = `<b>키워드 분석 결과</b>\n\n`;
  message += `<b>키워드:</b> ${keyword}\n`;
  message += `<b>점수:</b> ${score}\n\n`;
  
  if (trends && trends.length > 0) {
    message += '<b>트렌드 변화:</b>\n';
    trends.forEach(trend => {
      const changeSymbol = trend.change > 0 ? '📈' : trend.change < 0 ? '📉' : '➡️';
      message += `${trend.period}: ${changeSymbol} ${Math.abs(trend.change)}%\n`;
    });
  }
  
  message += '\n<i>자세한 분석 결과는 KeywordPulse 웹사이트에서 확인하세요</i>';
  
  return message;
}

/**
 * RAG 기반 분석 결과를 텔레그램 메시지로 형식화
 * @param keywords 키워드 데이터 배열
 * @param options RAG 분석 옵션
 * @returns 텔레그램용 HTML 포맷 메시지
 */
export async function formatRagResultForTelegram(
  keywords: KeywordData[],
  options: RagAnalysisOptions = {}
): Promise<string> {
  try {
    // RAG 시스템을 통해 분석 텍스트 생성
    const ragAnalysisText = await generateRagAnalysis(keywords, options);
    
    // 마크다운을 HTML로 변환
    const htmlMessage = formatMessageAsHTML(ragAnalysisText);
    
    // 텔레그램 메시지 헤더와 푸터 추가
    return `<b>🔍 KeywordPulse 분석 결과</b>\n\n${htmlMessage}\n\n<i>KeywordPulse에서 더 자세한 분석을 확인하세요.</i>`;
  } catch (error) {
    console.error('RAG 분석 텍스트 생성 중 오류:', error);
    return '<b>⚠️ 분석 생성 중 오류가 발생했습니다.</b>\n\n자세한 내용은 KeywordPulse 웹사이트를 확인하세요.';
  }
} 