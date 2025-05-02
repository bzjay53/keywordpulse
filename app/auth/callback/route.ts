import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// 정적 내보내기와 호환되도록 force-dynamic 설정 제거
// export const dynamic = 'force-dynamic';

// 엣지 런타임 사용 설정 추가
export const runtime = 'edge';

/**
 * 이메일 인증 콜백 처리 라우트
 * 이메일 확인 후 Supabase에서 리다이렉트될 때 사용됩니다.
 */
export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    
    // 개발 모드에서는 코드 확인 생략 (선택 사항)
    if (requestUrl.searchParams.get("dev") === "true") {
      console.log("개발 모드로 인증 건너뛰기");
      return NextResponse.redirect(new URL('/dev-login', requestUrl.origin));
    }
    
    // 코드가 없으면 로그인 페이지로 리다이렉트
    const code = requestUrl.searchParams.get("code");
    if (!code) {
      console.error("인증 코드가 없습니다.");
      return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    }
    
    // Supabase 환경 변수 확인 - 정적 빌드에서도 오류 없도록 처리
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-anon-key';
    
    // 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 인증 코드 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("인증 코드 교환 중 오류:", error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
    
    // 성공 시 홈페이지로 리다이렉트
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error("인증 콜백 처리 중 오류 발생:", error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
} 