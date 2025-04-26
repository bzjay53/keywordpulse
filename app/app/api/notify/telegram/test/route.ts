import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

/**
 * 텔레그램 테스트 메시지 전송 API
 * POST: 사용자가 제공한 봇 토큰과 채팅 ID를 사용하여 테스트 메시지를 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 읽기
    const { token, chat_id, message } = await request.json();

    // 필수 파라미터 확인
    if (!token || !chat_id || !message) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다. (token, chat_id, message)' },
        { status: 400 }
      );
    }

    // 텔레그램 API 호출
    const telegramResult = await sendTelegramMessage(token, {
      chat_id: chat_id,
      text: message,
      parse_mode: 'HTML',
    });

    // 텔레그램 API 응답 확인
    if (!telegramResult.ok) {
      console.error('텔레그램 API 오류:', telegramResult);
      return NextResponse.json(
        { 
          error: `텔레그램 API 오류: ${telegramResult.description || '알 수 없는 오류'}`,
          details: telegramResult
        },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '테스트 메시지가 성공적으로 전송되었습니다.',
      details: telegramResult
    });
  } catch (error) {
    console.error('텔레그램 메시지 전송 중 오류 발생:', error);
    return NextResponse.json(
      { error: '메시지 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 