/**
 * RAG 엔진 에지 케이스 테스트
 * @jest-environment node
 */

import {
  generateKeywordAnalysis,
  categorizeKeyword,
  type UserPreferences,
  KeywordCategory
} from '@/lib/rag_engine';

// logger 모듈 모킹
jest.mock('@/app/lib/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('RAG 엔진 에지 케이스 테스트', () => {
  describe('특수 문자 처리', () => {
    test('특수 문자가 포함된 키워드를 올바르게 처리해야 함', () => {
      const specialCharKeywords = [
        'AI!@#$%^&*',
        '마케팅(2023)',
        'SEO-최적화',
        'React.js & Next.js',
        '<script>alert("XSS")</script>',
      ];
      
      // 에러 없이 실행되어야 함
      specialCharKeywords.forEach(keyword => {
        const result = generateKeywordAnalysis([keyword]);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
    
    test('마크다운 특수문자(*, _, #)가 포함된 키워드를 올바르게 이스케이프해야 함', () => {
      const markdownKeywords = [
        '*강조된 키워드*',
        '_기울임꼴 키워드_',
        '# 제목 키워드',
        '## 부제목 키워드',
      ];
      
      markdownKeywords.forEach(keyword => {
        const result = generateKeywordAnalysis([keyword]);
        // 마크다운으로 해석되지 않고 텍스트 그대로 표시되어야 함
        expect(result).not.toContain('<em>');
        expect(result).not.toContain('<strong>');
        expect(result).not.toContain('<h1>');
      });
    });
  });
  
  describe('길이 제한 테스트', () => {
    test('매우 긴 키워드를 올바르게 처리해야 함', () => {
      const longKeyword = 'A'.repeat(1000); // 1000자 길이의 키워드
      
      const result = generateKeywordAnalysis([longKeyword]);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
    
    test('매우 많은 키워드를 올바르게 처리해야 함', () => {
      // 100개의 키워드 배열 생성
      const manyKeywords = Array.from({ length: 100 }, (_, i) => `keyword${i}`);
      
      const result = generateKeywordAnalysis(manyKeywords);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
  
  describe('다국어 및 인코딩 테스트', () => {
    test('유니코드/이모지가 포함된 키워드를 올바르게 처리해야 함', () => {
      const unicodeKeywords = [
        '인공지능 👍',
        '✨ 마케팅 전략 ✨',
        '💯 개발 도구',
        '🚀 성능 최적화 🚀',
      ];
      
      unicodeKeywords.forEach(keyword => {
        const result = generateKeywordAnalysis([keyword]);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
    
    test('다국어 키워드를 올바르게 처리해야 함', () => {
      const multilingualKeywords = [
        'Artificial Intelligence', // 영어
        '人工智能', // 중국어
        '人工知能', // 일본어
        'Künstliche Intelligenz', // 독일어
        'الذكاء الاصطناعي', // 아랍어
      ];
      
      multilingualKeywords.forEach(keyword => {
        const result = generateKeywordAnalysis([keyword]);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
  
  describe('캐싱 메커니즘 테스트', () => {
    test('동일한 키워드 요청에 대해 캐시된 결과를 반환해야 함', () => {
      const keywords = ['캐싱테스트', 'memorization', '성능최적화'];
      
      // 첫 번째 호출 (캐시 미스)
      const firstResult = generateKeywordAnalysis(keywords);
      
      // 두 번째 호출 (캐시 히트)
      const secondResult = generateKeywordAnalysis(keywords);
      
      // 동일한 결과를 반환해야 함
      expect(secondResult).toBe(firstResult);
    });
    
    test('사용자 설정이 다른 경우 동일한 키워드에 대해 다른 결과를 반환해야 함', () => {
      const keywords = ['테스트', '사용자설정', '맞춤화'];
      
      // 기본 설정
      const defaultResult = generateKeywordAnalysis(keywords);
      
      // 사용자 맞춤 설정
      const customPrefs: UserPreferences = {
        insightCount: 1,
        detailLevel: 'basic'
      };
      
      const customResult = generateKeywordAnalysis(keywords, customPrefs);
      
      // 다른 결과를 반환해야 함
      expect(customResult).not.toBe(defaultResult);
    });
  });
}); 