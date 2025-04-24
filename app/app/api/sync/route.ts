import { NextRequest, NextResponse } from 'next/server';

/**
 * 키워드 분석 결과를 Google Sheets에 저장하는 API 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    
    if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
      return NextResponse.json(
        { error: '저장할 키워드 데이터가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 환경 변수 확인
    const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;
    
    if (!serviceAccount) {
      console.error('Google 서비스 계정 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { 
          success: false,
          error: 'GOOGLE_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.' 
        },
        { status: 500 }
      );
    }
    
    // 이 예제에서는 실제 Google Sheets API 연동 대신 모의 응답을 반환합니다
    // 실제 프로덕션 환경에서는 Google API를 호출해야 합니다
    console.log(`${body.keywords.length}개 키워드를 시트에 저장하려고 시도합니다...`);
    
    try {
      // 가상의 구글 시트 URL 생성 (실제 구현에서는 Google API 응답 사용)
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/example-sheet-id/edit`;
      
      return NextResponse.json({
        success: true,
        spreadsheetUrl: spreadsheetUrl
      });
    } catch (error: any) {
      throw new Error(`Google Sheets API 오류: ${error.message}`);
    }
  } catch (error: any) {
    console.error('시트 저장 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 