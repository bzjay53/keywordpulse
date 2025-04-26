import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatAnalysisNotification } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

/**
 * 키워드 분석 결과를 텔레그램으로 전송하는 API
 * POST: 키워드 분석 결과와 사용자의 텔레그램 설정을 사용하여 알림을 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 읽기
    const { 
      token, 
      chat_id, 
      keyword,
      score,
      trends,
      customMessage
    } = await request.json();

    // 필수 파라미터 확인
    if (!token || !chat_id) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다. (token, chat_id)' },
        { status: 400 }
      );
    }

    // 커스텀 메시지 또는 분석 결과 형식화
    let messageText;
    if (customMessage) {
      messageText = customMessage;
    } else if (keyword) {
      // 키워드, 점수, 트렌드 정보가 있는 경우 분석 결과 메시지 생성
      messageText = formatAnalysisNotification(
        keyword,
        score || 0,
        trends || []
      );
    } else {
      return NextResponse.json(
        { error: '전송할 메시지 내용이 누락되었습니다. (customMessage 또는 keyword)' },
        { status: 400 }
      );
    }

    // 텔레그램 API 호출
    const telegramResult = await sendTelegramMessage(token, {
      chat_id: chat_id,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: true
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
      message: '알림이 성공적으로 전송되었습니다.',
      details: {
        message_id: telegramResult.result?.message_id,
        date: telegramResult.result?.date
      }
    });
  } catch (error) {
    console.error('텔레그램 알림 전송 중 오류 발생:', error);
    return NextResponse.json(
      { error: '알림 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 