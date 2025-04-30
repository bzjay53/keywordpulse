import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';
import logger from '@/lib/logger';
import { sendTelegramMessage } from '@/lib/telegram';

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
    // 요청 데이터 파싱
    const data: FeedbackData = await request.json();
    
    // 데이터 유효성 검증
    if (!data.rating || !data.feedback) {
      return NextResponse.json({ 
        success: false, 
        message: '평점과 피드백 내용은 필수입니다.' 
      }, { status: 400 });
    }
    
    // Supabase 클라이언트 생성
    const supabase = createClient();
    
    // 피드백 저장
    const { data: savedFeedback, error } = await supabase
      .from('feedback')
      .insert([
        {
          rating: data.rating,
          feedback: data.feedback,
          context: data.context ?? {},
          timestamp: data.timestamp ?? new Date().toISOString(),
          user_id: data.userId || null,
          browser_info: data.browser || null,
          platform: data.platform || null,
          status: 'new'
        }
      ])
      .select()
      .single();
    
    // 저장 오류 처리
    if (error) {
      logger.error('피드백 저장 중 오류 발생', { error, data });
      return NextResponse.json({ 
        success: false, 
        message: '피드백을 저장하는 중 오류가 발생했습니다.' 
      }, { status: 500 });
    }
    
    // 중요 피드백(1-2점)은 텔레그램으로 알림 전송
    if (data.rating <= 2) {
      try {
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        
        if (telegramToken && telegramChatId) {
          const message = formatFeedbackMessage(data);
          
          await sendTelegramMessage(telegramToken, {
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'HTML'
          });
          
          logger.info('중요 피드백 알림 전송 완료', { 
            feedbackId: savedFeedback.id,
            rating: data.rating 
          });
        }
      } catch (notifyError) {
        // 알림 전송 실패는 API 응답에 영향을 주지 않음
        logger.warn('피드백 알림 전송 중 오류 발생', { notifyError });
      }
    }
    
    // 성공 응답
    return NextResponse.json({ 
      success: true, 
      message: '피드백이 성공적으로 제출되었습니다.',
      data: {
        id: savedFeedback.id,
        timestamp: savedFeedback.timestamp
      }
    });
    
  } catch (error) {
    // 예상치 못한 오류 처리
    logger.error('피드백 API 처리 중 오류 발생', { error });
    return NextResponse.json({ 
      success: false, 
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    }, { status: 500 });
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