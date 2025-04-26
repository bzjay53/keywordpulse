import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatKeywordAnalysisMessage } from '@/lib/telegram';
import { ApiError } from '@/lib/exceptions';

export const dynamic = 'force-dynamic';

/**
 * 키워드 분석 결과를 텔레그램으로 전송하는 API 엔드포인트
 * POST: 단일 또는 다수의 키워드 분석 결과를 텔레그램으로 전송
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 읽기
    const { token, chat_id, keyword_data, template_type = 'full' } = await request.json();

    // 필수 파라미터 확인
    if (!token) {
      throw new ApiError(400, '텔레그램 봇 토큰이 필요합니다.');
    }

    if (!chat_id) {
      throw new ApiError(400, '텔레그램 채팅 ID가 필요합니다.');
    }

    if (!keyword_data) {
      throw new ApiError(400, '키워드 분석 데이터가 필요합니다.');
    }

    // 키워드 데이터 형식 확인 및 변환
    let keywordDataArray = Array.isArray(keyword_data) ? keyword_data : [keyword_data];

    // 각 키워드 분석 데이터에 대해 메시지 전송
    const results = [];
    
    for (const data of keywordDataArray) {
      // 키워드, 점수, 트렌드 정보가 있는지 확인
      if (!data.keyword || data.score === undefined || !data.trend) {
        console.warn('키워드, 점수 또는 트렌드 정보가 누락된 데이터를 건너뜁니다:', data);
        continue;
      }

      // 메시지 형식화
      const message = formatKeywordAnalysisMessage({
        keyword: data.keyword,
        score: data.score,
        trend: data.trend,
        customMessage: data.customMessage
      });

      // 텔레그램으로 메시지 전송
      const result = await sendTelegramMessage(
        token,
        {
          chat_id,
          text: message,
          parse_mode: 'HTML'
        }
      );

      results.push({
        keyword: data.keyword,
        result
      });
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: `${results.length}개의 키워드 분석 결과가 성공적으로 전송되었습니다.`,
      results
    });
  } catch (error: any) {
    console.error('키워드 분석 결과 전송 중 오류 발생:', error);
    
    let status = 500;
    let errorMessage = '분석 결과 전송 중 오류가 발생했습니다.';
    
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