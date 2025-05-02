/**
 * 사용자 행동 이벤트 추적 API 엔드포인트
 * analytics.ts의 trackEvent 함수에서 전송된 이벤트를 처리합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { EventType } from '@/lib/analytics';

// Edge 런타임 설정
export const runtime = 'edge';

// 이벤트 요청 타입 정의
type TrackEventRequest = {
  type: EventType;
  action: string;
  properties?: Record<string, any>;
  path: string;
  timestamp: string;
};

/**
 * 이벤트 추적 핸들러
 * @param req 요청 객체
 * @returns 응답 객체
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 요청 본문 파싱
    const event = await req.json() as TrackEventRequest;
    
    // 기본 검증
    if (!event || !event.type || !event.action) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // 요청 정보 추출
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               '0.0.0.0';
    
    // IP 주소 익명화 (개인정보 보호)
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0';

    // 이벤트 로깅
    logger.info({
      message: '사용자 이벤트 추적',
      context: {
        eventType: event.type,
        action: event.action,
        path: event.path,
        timestamp: event.timestamp,
        properties: event.properties,
        // 기본 메타데이터
        userAgent,
        referer,
        anonymizedIp
      },
      tags: { 
        module: 'analytics', 
        action: 'trackEvent', 
        eventType: event.type 
      }
    });
    
    // 특정 이벤트 유형에 따른 추가 처리
    switch (event.type) {
      case EventType.CONVERSION:
        // 전환 이벤트는 중요하므로 별도 처리
        logger.info({
          message: '전환 이벤트 발생',
          context: {
            action: event.action,
            properties: event.properties
          },
          tags: { module: 'analytics', action: 'conversion' }
        });
        
        // 여기서 데이터베이스에 전환 이벤트 저장 또는 기타 서비스에 알림 가능
        break;
        
      case EventType.SEARCH:
        // 검색 이벤트 분석
        if (event.properties?.query) {
          // 검색어 로깅 (개인정보 보호를 위해 필요시 익명화)
          logger.info({
            message: '검색 이벤트',
            context: {
              query: event.properties.query,
              resultCount: event.properties.resultCount
            },
            tags: { module: 'analytics', action: 'search' }
          });
        }
        break;
    }
    
    // 여기서 이벤트를 데이터베이스나 분석 서비스로 전송 가능
    // (구현은 생략)
    
    // 성공 응답
    return NextResponse.json(
      { success: true },
      { status: 202 } // Accepted
    );
  } catch (error) {
    // 오류 로깅
    logger.error({
      message: '이벤트 추적 처리 중 오류 발생',
      error: error as Error,
      tags: { module: 'analytics', action: 'trackError' }
    });
    
    // 오류 응답
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 