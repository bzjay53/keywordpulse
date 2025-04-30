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