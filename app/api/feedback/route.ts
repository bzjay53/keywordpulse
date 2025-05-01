import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../lib/supabaseClient';
import logger from '../../lib/logger';
import { sendTelegramMessage } from '../../lib/telegram';

interface FeedbackData {
  rating: number;
  feedback: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  browser?: string;
  platform?: string;
}

/**
 * 피드백 데이터를 받아 Supabase에 저장하고 필요시 알림을 보내는 API
 * @route POST /api/feedback
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.text) {
      return NextResponse.json(
        { error: '피드백 내용을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 피드백 데이터 구성
    const feedbackData = {
      text: body.text,
      email: body.email || null,
      name: body.name || null,
      rating: body.rating || null,
      category: body.category || '일반',
      page: body.page || null,
      ip: request.headers.get('x-forwarded-for') || request.ip || null,
      user_agent: request.headers.get('user-agent') || null,
      created_at: new Date().toISOString()
    };
    
    // Supabase에 피드백 저장
    const supabase = createClient();
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select();
    
    if (error) {
      logger.error('피드백 저장 중 오류 발생:', error);
      throw error;
    }
    
    // 텔레그램으로 알림 전송 (선택 사항)
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
      
      if (botToken && chatId) {
        const telegramMessage = `
📝 <b>새 피드백 접수</b>

<b>내용:</b> ${feedbackData.text}
${feedbackData.name ? `<b>이름:</b> ${feedbackData.name}` : ''}
${feedbackData.email ? `<b>이메일:</b> ${feedbackData.email}` : ''}
${feedbackData.rating ? `<b>평점:</b> ${feedbackData.rating}/5` : ''}
<b>카테고리:</b> ${feedbackData.category}
${feedbackData.page ? `<b>페이지:</b> ${feedbackData.page}` : ''}
<b>시간:</b> ${new Date().toLocaleString('ko-KR')}
        `;
        
        await sendTelegramMessage(botToken, {
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'HTML'
        });
      }
    } catch (telegramError) {
      // 텔레그램 오류는 전체 피드백 처리에 영향을 주지 않도록 함
      logger.warn('텔레그램 알림 전송 중 오류:', telegramError);
    }
    
    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '피드백이 성공적으로 제출되었습니다.',
      data: data ? data[0] : null
    });
  } catch (error: any) {
    logger.error('피드백 처리 중 오류 발생:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || '피드백 처리 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

/**
 * 피드백 데이터를 텔레그램 메시지로 포맷팅
 */
function formatFeedbackMessage(data: FeedbackData): string {
  const rating = '⭐'.repeat(data.rating);
  const path = data.context?.path || '알 수 없음';
  const browser = data.browser ? JSON.parse(data.browser) : { userAgent: '알 수 없음' };
  
  return `
<b>⚠️ 중요 피드백 접수</b>

<b>평점:</b> ${rating} (${data.rating}/5)
<b>페이지:</b> ${path}
<b>시간:</b> ${new Date(data.timestamp).toLocaleString('ko-KR')}

<b>내용:</b>
${data.feedback}

<b>환경:</b>
- 플랫폼: ${data.platform || '알 수 없음'}
- 브라우저: ${browser.userAgent}
`;
} 