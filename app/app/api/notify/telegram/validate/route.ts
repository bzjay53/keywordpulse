import { NextResponse } from 'next/server';
import { validateTelegramChatId } from '@/lib/telegram';
import { ApiError } from '@/lib/errors';

/**
 * POST /api/notify/telegram/validate
 * 
 * 텔레그램 채팅 ID의 유효성을 검증하는 API 엔드포인트
 * 
 * @param {Object} request - 요청 객체
 * @param {string} request.token - 텔레그램 봇 토큰
 * @param {string} request.chat_id - 검증할 텔레그램 채팅 ID
 * 
 * @returns {Object} 유효성 검증 결과
 * @throws {Error} 필수 매개변수 누락 시 오류 발생
 */
export async function POST(request: Request) {
  try {
    const { token, chat_id } = await request.json();

    // 필수 매개변수 검증
    if (!token) {
      throw new ApiError('텔레그램 봇 토큰이 필요합니다.', 400);
    }

    if (!chat_id) {
      throw new ApiError('텔레그램 채팅 ID가 필요합니다.', 400);
    }

    // 채팅 ID 유효성 검증
    const validationResult = await validateTelegramChatId(token, chat_id);

    return NextResponse.json({
      success: validationResult.valid,
      message: validationResult.message,
      chat_id
    });
  } catch (error) {
    console.error('텔레그램 채팅 ID 검증 오류:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: '채팅 ID 검증 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 