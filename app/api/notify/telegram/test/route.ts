import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatErrorMessage, handleTelegramErrorCode, validateTelegramConfig } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';

// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';

/**
 * 텔레그램 연결을 테스트하기 위한 API 엔드포인트
 * POST: 봇 토큰과 채팅 ID를 검증하고 테스트 메시지를 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 읽기
    const { token, chat_id, message } = await request.json();

    // 필수 파라미터 확인
    if (!token || !chat_id) {
      throw new ApiError(400, '텔레그램 봇 토큰과 채팅 ID가 필요합니다.');
    }

    // 테스트 메시지 설정
    const testMessage = message || 
      `<b>KeywordPulse 텔레그램 연결 테스트</b>
      
✅ 성공적으로 연결되었습니다!
🔔 이제 키워드 분석 결과를 이 채팅으로 받을 수 있습니다.
      
✨ <i>현재 시간: ${new Date().toLocaleString('ko-KR')}</i>`;

    // 텔레그램으로 메시지 전송
    const result = await sendTelegramMessage(
      token,
      {
        chat_id,
        text: testMessage,
        parse_mode: 'HTML'
      }
    );

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '텔레그램 테스트 메시지가 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error: any) {
    console.error('텔레그램 테스트 중 오류 발생:', error);
    
    let status = 500;
    let errorMessage = '텔레그램 연결 테스트 중 오류가 발생했습니다.';
    
    if (error instanceof ApiError) {
      status = error.status;
      errorMessage = error.message;
    } else if (error.response) {
      // 텔레그램 API 오류 처리
      const telegramErrorCode = error.response.data?.error_code;
      if (telegramErrorCode) {
        const handledError = handleTelegramErrorCode(telegramErrorCode);
        errorMessage = handledError.message;
        status = handledError.status;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: formatErrorMessage(error.message || '알 수 없는 오류')
      }, 
      { status }
    );
  }
} 