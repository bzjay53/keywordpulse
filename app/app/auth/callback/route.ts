import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
      // 인증 성공 후 홈으로 리다이렉트
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      console.error('인증 코드 교환 중 오류:', error);
    }
  }
  
  // 오류 또는 코드가 없는 경우 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url));
} 