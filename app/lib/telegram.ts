/**
 * 텔레그램 API 통신을 위한 유틸리티 함수들
 */

import { KeywordData, generateRagAnalysis, RagAnalysisOptions } from './rag-integration';

export interface TelegramSendMessageParams {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

export interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: any;
  error_code?: number;
}

/**
 * 텔레그램 메시지 전송 함수
 * @param token 텔레그램 봇 토큰
 * @param params 메시지 전송 파라미터
 * @returns 텔레그램 API 응답
 */
export async function sendTelegramMessage(
  token: string,
  params: TelegramSendMessageParams
): Promise<TelegramResponse> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('텔레그램 메시지 전송 중 오류 발생:', error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
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