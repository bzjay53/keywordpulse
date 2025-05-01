import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramChatId } from '../../../lib/telegram';
import { ApiError } from '../../../lib/errors';

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
export async function POST(request: NextRequest) {
  try {
    const { token, chat_id } = await request.json();

    // 필수 매개변수 검증
    if (!token) {
      throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
    }

    if (!chat_id) {
      throw new ApiError(400, '유효성을 검사할 텔레그램 채팅 ID가 필요합니다.');
    }

    // 채팅 ID 유효성 검증
    const validationResult = await validateTelegramChatId(token, chat_id);

    return NextResponse.json({
      success: true,
      ...validationResult
    });
  } catch (error: any) {
    console.error('텔레그램 채팅 ID 유효성 검사 중 오류 발생:', error);
    
    let status = 500;
    let errorMessage = '텔레그램 채팅 ID 유효성 검사 중 오류가 발생했습니다.';
    
    if (error instanceof ApiError) {
      status = error.statusCode;
      errorMessage = error.message;
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