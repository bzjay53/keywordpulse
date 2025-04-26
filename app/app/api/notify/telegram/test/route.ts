import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatErrorMessage, handleTelegramErrorCode } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';

export const dynamic = 'force-dynamic';

/**
 * 텔레그램 설정 테스트 API 엔드포인트
 * POST 요청으로 토큰, 채팅 ID, 테스트 메시지를 받아 테스트 메시지를 전송합니다.
 * 
 * @param request - 요청 객체
 * @returns NextResponse 객체
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, chat_id, message } = body;

    // 필수 매개변수 검증
    if (!token) {
      throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
    }

    if (!chat_id) {
      throw new ApiError(400, '텔레그램 채팅 ID가 필요합니다.');
    }

    // 텔레그램 메시지 전송
    const result = await sendTelegramMessage(
      token, 
      {
        chat_id,
        text: message || "KeywordPulse에서 보낸 테스트 메시지입니다.",
        parse_mode: 'HTML'
      }
    );

    console.log('텔레그램 테스트 메시지 전송 성공:', result);

    return NextResponse.json({
      success: true,
      message: '텔레그램 테스트 메시지가 성공적으로 전송되었습니다.',
      data: result
    });

  } catch (error: any) {
    console.error('텔레그램 테스트 메시지 전송 중 오류:', error);
    
    let status = 500;
    let errorMessage = '텔레그램 테스트 메시지 전송 중 오류가 발생했습니다.';
    
    // API 에러인 경우
    if (error instanceof ApiError) {
      status = error.statusCode;
      errorMessage = error.message;
    } 
    // 텔레그램 API 에러인 경우
    else if (error.message && error.message.includes('텔레그램 API 오류')) {
      status = 400;
      
      // 에러 코드 추출
      const errorCodeMatch = error.message.match(/\((\d+)\)$/);
      if (errorCodeMatch && errorCodeMatch[1]) {
        const errorCode = parseInt(errorCodeMatch[1]);
        errorMessage = handleTelegramErrorCode(errorCode);
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      }, 
      { status }
    );
  }
} 