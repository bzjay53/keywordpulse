import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatMessageAsHTML } from '../../../lib/telegram';

/**
 * Telegram으로 분석 결과를 전송하는 API 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    if (!body.analysisText) {
      return NextResponse.json(
        { error: '전송할 분석 텍스트가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 환경 변수 확인
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.error('Telegram 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    // 마크다운을 HTML로 변환 (선택 사항)
    const formattedText = body.format === 'markdown' 
      ? formatMessageAsHTML(body.analysisText)
      : body.analysisText;
    
    // Telegram API에 요청 전송
    const result = await sendTelegramMessage(botToken, {
      chat_id: chatId,
      text: formattedText,
      parse_mode: body.format === 'markdown' ? 'HTML' : (body.parseMode || 'HTML'),
      disable_web_page_preview: body.disablePreview
    });
    
    if (!result.ok) {
      throw new Error(`Telegram API 오류: ${result.description || '알 수 없는 오류'}`);
    }
    
    const messageId = result.result?.message_id?.toString() || '';
    
    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      messageId
    });
  } catch (error: any) {
    console.error('Telegram 전송 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 