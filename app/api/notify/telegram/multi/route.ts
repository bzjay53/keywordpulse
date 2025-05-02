import { NextRequest, NextResponse } from 'next/server';
import { sendMessageToMultipleChats, handleTelegramErrorCode, formatErrorMessage } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';

/**
 * 여러 채팅 ID로 텔레그램 메시지를 보내는 API 엔드포인트
 * 
 * 요청 형식:
 * {
 *   "token": "텔레그램 봇 토큰", 
 *   "chat_ids": ["채팅ID1", "채팅ID2", ...], 
 *   "message": "전송할 메시지"
 * }
 * 
 * 응답 형식:
 * {
 *   "success": true/false,
 *   "data": {
 *     "results": { "채팅ID1": {...}, "채팅ID2": {...} },
 *     "errors": { "채팅ID3": "오류 메시지" },
 *     "summary": { "total": 3, "success": 2, "failed": 1 }
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, chat_ids, message } = body;

    // 필수 파라미터 검증
    if (!token) {
      throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
    }

    if (!chat_ids || !Array.isArray(chat_ids) || chat_ids.length === 0) {
      throw new ApiError(400, '최소 하나 이상의 유효한 채팅 ID가 필요합니다.');
    }

    // 기본 메시지 설정
    const messageText = message || '이것은 KeywordPulse에서 보낸 테스트 메시지입니다.';

    // 여러 채팅 ID로 메시지 전송
    const result = await sendMessageToMultipleChats(token, chat_ids, messageText, {
      parse_mode: 'HTML',
      disable_notification: false,
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('텔레그램 다중 메시지 전송 오류:', error);
    
    // 텔레그램 API 오류 처리
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    // 일반 오류 처리
    const errorMessage = error instanceof Error 
      ? formatErrorMessage(error.message) 
      : '알 수 없는 오류가 발생했습니다.';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 