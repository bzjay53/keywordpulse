/**
 * Telegram 메시지 전송 관련 유틸리티 함수
 */

interface TelegramMessageOptions {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: {
    message_id?: number;
  };
}

/**
 * Telegram API를 통해 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param options 메시지 옵션
 * @returns API 응답
 */
export async function sendTelegramMessage(
  botToken: string,
  options: TelegramMessageOptions
): Promise<TelegramResponse> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Telegram 메시지 전송 실패:', error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

/**
 * 마크다운 형식의 텍스트를 Telegram에서 사용할 수 있는 HTML로 변환합니다.
 * @param markdownText 마크다운 텍스트
 * @returns HTML 형식의 텍스트
 */
export function formatMessageAsHTML(markdownText: string): string {
  // 간단한 마크다운 -> HTML 변환
  return markdownText
    // 헤더 변환
    .replace(/^# (.+)$/gm, '<b>$1</b>')
    .replace(/^## (.+)$/gm, '<b>$1</b>')
    .replace(/^### (.+)$/gm, '<b>$1</b>')
    // 강조 변환
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/_(.+?)_/g, '<i>$1</i>')
    // 리스트 변환
    .replace(/^- (.+)$/gm, '• $1')
    .replace(/^([0-9]+)\. (.+)$/gm, '$1. $2')
    // 링크 변환
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // 줄바꿈 보존
    .replace(/\n/g, '\n');
}

/**
 * 여러 채팅방에 동일한 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param chatIds 채팅방 ID 배열
 * @param text 전송할 텍스트
 * @param options 추가 옵션
 * @returns 성공한 전송 수와 실패한 전송 수
 */
export async function sendMultipleMessages(
  botToken: string,
  chatIds: string[],
  text: string,
  options: Partial<TelegramMessageOptions> = {}
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  
  const sendPromises = chatIds.map(async (chatId) => {
    try {
      const result = await sendTelegramMessage(botToken, {
        chat_id: chatId,
        text,
        ...options
      });
      
      if (result.ok) {
        success++;
      } else {
        failed++;
      }
      
      return result;
    } catch {
      failed++;
      return { ok: false };
    }
  });
  
  await Promise.all(sendPromises);
  
  return { success, failed };
}

/**
 * 여러 채팅방에 메시지를 전송합니다.
 * @param botToken Telegram Bot Token
 * @param chatIds 채팅방 ID 배열
 * @param message 전송할 메시지
 * @returns API 응답
 */
export async function sendMessageToMultipleChats(
  botToken: string,
  chatIds: string[],
  message: string,
  parseMode: 'HTML' | 'Markdown' | 'MarkdownV2' = 'HTML'
): Promise<{ success: number; failed: number; responses: TelegramResponse[] }> {
  const responses: TelegramResponse[] = [];
  let success = 0;
  let failed = 0;

  for (const chatId of chatIds) {
    try {
      const response = await sendTelegramMessage(botToken, {
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: true
      });

      responses.push(response);
      
      if (response.ok) {
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      responses.push({
        ok: false,
        description: error instanceof Error ? error.message : '알 수 없는 오류'
      });
    }
  }

  return { success, failed, responses };
}

/**
 * Telegram API 에러 코드 처리
 * @param errorCode 에러 코드
 * @returns 처리 결과
 */
export function handleTelegramErrorCode(errorCode: number): { 
  retryable: boolean; 
  message: string;
  waitTime?: number;
} {
  switch (errorCode) {
    case 400:
      return { retryable: false, message: '잘못된 요청 형식입니다. 요청 내용을 확인하세요.' };
    case 401:
      return { retryable: false, message: '인증 토큰이 유효하지 않습니다. 봇 토큰을 확인하세요.' };
    case 403:
      return { retryable: false, message: '봇이 차단되었거나 권한이 없습니다.' };
    case 404:
      return { retryable: false, message: '요청한 리소스를 찾을 수 없습니다. Chat ID를 확인하세요.' };
    case 409:
      return { retryable: true, message: '충돌이 발생했습니다. 잠시 후 다시 시도하세요.' };
    case 429:
      return { retryable: true, message: '요청 한도를 초과했습니다.', waitTime: 60 };
    case 500:
    case 502:
    case 503:
    case 504:
      return { retryable: true, message: 'Telegram 서버 오류입니다. 잠시 후 다시 시도하세요.' };
    default:
      return { retryable: true, message: `알 수 없는 오류가 발생했습니다. (코드: ${errorCode})` };
  }
}

/**
 * 에러 메시지 형식화
 * @param error 에러 객체
 * @returns 사용자 친화적인 에러 메시지
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `오류가 발생했습니다: ${error.message}`;
  }
  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * Telegram 설정 유효성 검사
 * @param token 봇 토큰
 * @param chatId 채팅 ID
 * @returns 검증 결과
 */
export function validateTelegramConfig(token?: string, chatId?: string): { 
  valid: boolean; 
  message: string;
} {
  if (!token) {
    return { valid: false, message: 'Telegram 봇 토큰이 설정되지 않았습니다.' };
  }
  
  if (!token.match(/^\d+:[A-Za-z0-9_-]{35}$/)) {
    return { valid: false, message: 'Telegram 봇 토큰 형식이 유효하지 않습니다.' };
  }
  
  if (!chatId) {
    return { valid: false, message: 'Telegram 채팅 ID가 설정되지 않았습니다.' };
  }
  
  return { valid: true, message: 'Telegram 설정이 유효합니다.' };
}

/**
 * Telegram 채팅 ID 유효성 검사
 * @param chatId 채팅 ID
 * @returns 검증 결과
 */
export function validateTelegramChatId(chatId: string): { 
  valid: boolean; 
  message: string;
} {
  if (!chatId) {
    return { valid: false, message: '채팅 ID가 제공되지 않았습니다.' };
  }
  
  if (!chatId.match(/^-?\d+$/)) {
    return { valid: false, message: '채팅 ID는 숫자여야 합니다.' };
  }
  
  return { valid: true, message: '채팅 ID가 유효합니다.' };
}

/**
 * 키워드 분석 결과를 Telegram 메시지로 포맷팅
 * @param data 키워드 분석 데이터
 * @returns 포맷팅된 HTML 메시지
 */
export function formatKeywordAnalysisMessage(data: any): string {
  if (!data || !data.keyword) {
    return '<b>⚠️ 잘못된 분석 데이터</b>';
  }
  
  const keyword = data.keyword;
  const volume = data.volume || '정보 없음';
  const trend = data.trend || '정보 없음';
  const sentiment = data.sentiment || { positive: 0, neutral: 0, negative: 0 };
  
  // 감성 분석 그래프 생성
  const positiveBar = '🟢'.repeat(Math.round(sentiment.positive * 10)) || '▫️';
  const neutralBar = '🟡'.repeat(Math.round(sentiment.neutral * 10)) || '▫️';
  const negativeBar = '🔴'.repeat(Math.round(sentiment.negative * 10)) || '▫️';
  
  // 관련 키워드 처리
  const relatedKeywords = data.related && data.related.length > 0
    ? data.related.slice(0, 5).map((k: string) => `• ${k}`).join('\n')
    : '관련 키워드 정보 없음';
  
  return `
<b>📊 키워드 분석 결과</b>

<b>키워드:</b> ${keyword}
<b>검색량:</b> ${volume}
<b>추세:</b> ${trend}

<b>감성 분석:</b>
긍정적 (${Math.round(sentiment.positive * 100)}%): ${positiveBar}
중립적 (${Math.round(sentiment.neutral * 100)}%): ${neutralBar}
부정적 (${Math.round(sentiment.negative * 100)}%): ${negativeBar}

<b>관련 키워드:</b>
${relatedKeywords}

<i>분석 시간: ${new Date().toLocaleString('ko-KR')}</i>
`;
}

/**
 * RAG 결과를 Telegram 메시지로 포맷팅
 * @param data RAG 검색 결과 데이터
 * @returns 포맷팅된 HTML 메시지
 */
export function formatRagResultForTelegram(data: any): string {
  if (!data || !data.query || !data.results) {
    return '<b>⚠️ 잘못된 검색 결과 데이터</b>';
  }
  
  const query = data.query;
  const results = data.results.slice(0, 3); // 상위 3개만 표시
  
  // 검색 결과 포맷팅
  const formattedResults = results.map((result: any, index: number) => `
<b>${index + 1}. ${result.title || '제목 없음'}</b>
${result.snippet || result.content?.substring(0, 150) + '...' || '내용 없음'}
${result.url ? `<a href="${result.url}">자세히 보기</a>` : ''}
`).join('\n');
  
  return `
<b>🔍 지식 검색 결과</b>

<b>검색어:</b> ${query}

<b>검색 결과:</b>
${formattedResults || '검색 결과가 없습니다.'}

<i>검색 시간: ${new Date().toLocaleString('ko-KR')}</i>
`;
} 