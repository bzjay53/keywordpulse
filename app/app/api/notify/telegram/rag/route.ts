import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatRagResultForTelegram } from '@/lib/telegram';
import { KeywordData } from '@/lib/rag-integration';

export const dynamic = 'force-dynamic';

/**
 * RAG 기반 키워드 분석 결과를 텔레그램으로 전송하는 API
 * POST: 키워드 데이터와 사용자의 텔레그램 설정을 사용하여 상세 분석 결과를 전송합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디 읽기
    const { 
      token, 
      chat_id, 
      keywords,
      templateType = 'detailed',
      maxKeywords = 5,
      scoreThreshold = 60
    } = await request.json();

    // 필수 파라미터 확인
    if (!token || !chat_id) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다. (token, chat_id)' },
        { status: 400 }
      );
    }

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: '분석할 키워드 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // 키워드 데이터 유효성 검사
    const validKeywords: KeywordData[] = keywords
      .filter(k => 
        typeof k === 'object' && 
        k !== null && 
        typeof k.keyword === 'string' && 
        typeof k.score === 'number'
      )
      .map(k => ({
        keyword: k.keyword,
        monthlySearches: k.monthlySearches || 0,
        competitionRate: k.competitionRate || 0,
        score: k.score
      }));

    if (validKeywords.length === 0) {
      return NextResponse.json(
        { error: '유효한 키워드 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // RAG 시스템을 사용하여 분석 결과 텍스트 생성
    const ragMessage = await formatRagResultForTelegram(validKeywords, {
      templateType: templateType as any,
      maxKeywords,
      scoreThreshold,
      includeStats: true
    });

    // 텔레그램 API 호출
    const telegramResult = await sendTelegramMessage(token, {
      chat_id: chat_id,
      text: ragMessage,
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
      message: 'RAG 분석 결과가 성공적으로 전송되었습니다.',
      keywordCount: validKeywords.length,
      templateType,
      details: {
        message_id: telegramResult.result?.message_id,
        date: telegramResult.result?.date
      }
    });
  } catch (error) {
    console.error('RAG 분석 결과 전송 중 오류 발생:', error);
    return NextResponse.json(
      { error: '분석 결과 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 