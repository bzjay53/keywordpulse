import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';

// 엣지 런타임 사용 설정 추가
export const runtime = "edge";

/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // 개발 모드 체크 - URL에 dev=true가 있으면 개발 모드로 간주
  const isDev = requestUrl.searchParams.get('dev') === 'true';
  
  // 개발 모드에서는 코드 검증을 생략하고 바로 로그인 처리
  if (isDev) {
    return NextResponse.redirect(new URL('/?dev_login=true', requestUrl.origin));
  }

  // Supabase 환경 변수가 없는 경우 오류 메시지와 함께 로그인 페이지로 리다이렉트
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase 환경 변수가 설정되지 않았습니다.');
    return NextResponse.redirect(
      new URL('/login?error=no_supabase_env', requestUrl.origin)
    );
  }

  if (code) {
    try {
      // 안전하게 Supabase 클라이언트 생성
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      // 환경 변수 유효성 검사 추가
      if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.redirect(
          new URL('/login?error=invalid_supabase_env', requestUrl.origin)
        );
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

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