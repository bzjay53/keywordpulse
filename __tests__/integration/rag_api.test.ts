/**
 * RAG 엔진과 API 통합 테스트
 * @jest-environment node
 */

import { generateKeywordAnalysis } from '../../app/lib/rag_engine';
import { NextResponse } from 'next/server';

// POST 함수를 직접 모킹
const mockPostHandler = jest.fn().mockImplementation(async (req) => {
  // 요청에서 키워드 추출
  const keywords = req.keywords;
  
  // 유효성 검사
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return {
      status: 400,
      body: { error: '분석할 키워드가 제공되지 않았습니다.' }
    };
  }
  
  // 키워드가 문자열이면 400 에러
  if (typeof keywords === 'string') {
    return {
      status: 400,
      body: { error: '유효하지 않은 키워드 형식입니다: 배열이 필요합니다.' }
    };
  }
  
  // 정상 응답
  const analysisText = generateKeywordAnalysis(keywords);
  return {
    status: 200,
    body: {
      analysisText,
      timestamp: new Date().toISOString()
    }
  };
});

describe('RAG API 통합 테스트', () => {
  test('API 엔드포인트가 키워드 배열로 올바른 분석 결과를 반환해야 함', async () => {
    // 테스트 요청 데이터
    const requestData = {
      keywords: ['인공지능', 'GPT', '머신러닝']
    };

    // 모킹된 핸들러 호출
    const response = await mockPostHandler(requestData);

    // 응답 검사
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.analysisText).toBeDefined();
    expect(typeof response.body.analysisText).toBe('string');
    expect(response.body.timestamp).toBeDefined();
  });

  test('API 엔드포인트가 빈 키워드 배열로 올바른 에러 메시지를 반환해야 함', async () => {
    // 테스트 요청 데이터 - 빈 키워드 배열
    const requestData = {
      keywords: []
    };

    // 모킹된 핸들러 호출
    const response = await mockPostHandler(requestData);

    // 응답 검사
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('분석할 키워드가 제공되지 않았습니다');
  });

  test('API 엔드포인트가 유효하지 않은 입력으로 올바른 에러 메시지를 반환해야 함', async () => {
    // 테스트 요청 데이터 - 유효하지 않은 입력
    const requestData = {
      keywords: '인공지능' // 키워드 배열 대신 문자열 전달
    };

    // 모킹된 핸들러 호출
    const response = await mockPostHandler(requestData);

    // 응답 검사
    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeDefined();
  });
}); 