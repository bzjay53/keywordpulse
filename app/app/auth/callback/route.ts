import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const referer = request.headers.get('referer');
  
  // 콜백 호출 디버깅 정보
  console.log('[인증 콜백] 인증 코드 처리 시작:', { 
    hasCode: !!code,
    referer
  });
  
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('[인증 콜백] 세션 교환 결과:', { 
        success: !error,
        hasSession: !!data?.session,
        error: error?.message
      });
      
      if (error) {
        console.error('[인증 콜백] 세션 교환 오류:', error);
        // 오류가 있는 경우 오류 페이지로 리다이렉트
        return NextResponse.redirect(new URL('/login?error=auth_session_error', request.url));
      }
      
      // 인증 성공 후 홈으로 리다이렉트
      return NextResponse.redirect(new URL('/?auth_success=true', request.url));
    } catch (error) {
      console.error('[인증 콜백] 인증 코드 교환 중 예외 발생:', error);
      // 오류 메시지와 함께 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url));
    }
  } else {
    console.error('[인증 콜백] 인증 코드가 없음');
  }
  
  // 오류 또는 코드가 없는 경우 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_code_missing', request.url));
} 