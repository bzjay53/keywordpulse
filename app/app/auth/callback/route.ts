import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      // Supabase 인증 코드 교환
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('인증 오류:', error.message);
        return NextResponse.redirect(
          new URL('/login?error=auth_session_error', requestUrl.origin)
        );
      }
      
      // 홈페이지로 리다이렉트
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    } catch (error) {
      console.error('예기치 않은 오류:', error);
      return NextResponse.redirect(
        new URL('/login?error=auth_unexpected_error', requestUrl.origin)
      );
    }
  }

  // 오류 발생 시 로그인 페이지로 리다이렉트 (에러 메시지 포함)
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_error', requestUrl.origin)
  );
} 