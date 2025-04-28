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
    
    // 개발 모드인 경우 인증 우회
    if (requestUrl.searchParams.get("dev") === "true") {
      console.log("개발 모드로 인증을 우회합니다.");
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    }
    
    // 인증 코드 확인
    const code = requestUrl.searchParams.get("code");
    if (!code) {
      console.error("인증 코드가 없습니다.");
      return NextResponse.redirect(new URL("/login?error=no_code", requestUrl.origin));
    }
    
    // Supabase 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === "https://example.supabase.co" || 
        supabaseAnonKey === "example-anon-key") {
      console.error("Supabase 환경 변수가 올바르게 설정되지 않았습니다.");
      return NextResponse.redirect(new URL("/login?error=invalid_supabase_config", requestUrl.origin));
    }
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 인증 코드로 세션 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("인증 코드 교환 중 오류 발생:", error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
    
    // 인증 성공 시 대시보드로 리다이렉트
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  } catch (error) {
    console.error("인증 처리 중 예상치 못한 오류 발생:", error);
    return NextResponse.redirect(new URL("/login?error=unexpected_error", request.url));
  }
} 