/**
 * RAG 엔진 산업 분야별 맞춤 분석 테스트
 * @jest-environment node
 */

import {
  generateKeywordAnalysis,
  type UserPreferences
} from '../../app/lib/rag_engine';

// logger 모듈 모킹
jest.mock('../../app/lib/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('RAG 엔진 산업 분야별 맞춤 분석 테스트', () => {
  describe('산업 분야별 카테고리 오버라이드', () => {
    // 테스트할 산업 분야 및 기대 결과
    const testCases = [
      { industry: 'marketing', expectedText: '디지털 마케팅' },
      { industry: '마케팅', expectedText: '디지털 마케팅' },
      { industry: 'development', expectedText: '앱 개발' },
      { industry: '개발', expectedText: '앱 개발' },
      { industry: 'ai', expectedText: 'AI 기술' },
      { industry: '인공지능', expectedText: 'AI 기술' },
      { industry: 'education', expectedText: '교육/학습' },
      { industry: '교육', expectedText: '교육/학습' },
      { industry: 'health', expectedText: '건강/의료' },
      { industry: '건강', expectedText: '건강/의료' },
      { industry: '의료', expectedText: '건강/의료' },
      { industry: 'finance', expectedText: '금융/투자' },
      { industry: '금융', expectedText: '금융/투자' },
      { industry: '투자', expectedText: '금융/투자' }
    ];
    
    test.each(testCases)('산업 분야 "$industry"는 $expectedText 관련 내용을 포함해야 함', ({ industry, expectedText }) => {
      // 일반적인 키워드(산업 분야 특정하지 않음)
      const keywords = ['분석', '전략', '동향'];
      
      const preferences: UserPreferences = {
        industry
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // 해당 산업 분야의 특성이 분석에 반영되었는지 확인
      expect(analysis).toContain(expectedText);
    });
  });
  
  describe('산업 분야별 특화 콘텐츠 확인', () => {
    test('마케팅 산업 분야는 마케팅 관련 전략이 포함되어야 함', () => {
      const keywords = ['콘텐츠', '전략', '분석'];
      
      const preferences: UserPreferences = {
        industry: 'marketing'
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // 마케팅 특화 용어 포함 확인
      expect(analysis).toMatch(/ROI|마케팅|콘텐츠|전략|SEO|광고/);
    });
    
    test('AI 산업 분야는 AI 관련 인사이트가 포함되어야 함', () => {
      const keywords = ['기술', '최신', '개발'];
      
      const preferences: UserPreferences = {
        industry: 'ai'
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // AI 관련 용어 포함 확인
      expect(analysis).toMatch(/AI|인공지능|머신러닝|딥러닝|모델/);
    });
    
    test('건강/의료 산업 분야는 의학 관련 내용이 포함되어야 함', () => {
      const keywords = ['건강', '관리', '예방'];
      
      const preferences: UserPreferences = {
        industry: 'health'
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // 건강/의료 관련 용어 포함 확인
      expect(analysis).toMatch(/건강|의료|관리|예방|전문가/);
    });
  });
  
  describe('산업 분야와 다국어 설정 결합', () => {
    test('영어 설정과 마케팅 산업 분야 설정이 함께 적용되어야 함', () => {
      const keywords = ['마케팅', '전략', '분석'];
      
      const preferences: UserPreferences = {
        language: 'en',
        industry: 'marketing'
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // 영어 형식인지 확인
      expect(analysis).toContain('Keyword Analysis');
      expect(analysis).toContain('Key Insights');
      expect(analysis).toContain('Content Strategy');
      
      // 마케팅 관련 영어 용어 포함 확인
      expect(analysis).toMatch(/marketing|strategy|ROI|content|digital/i);
    });
  });
  
  describe('맞춤형 설정 조합', () => {
    test('산업 분야, 언어, 인사이트 개수 설정이 모두 적용되어야 함', () => {
      const keywords = ['전략', '기술', '분석'];
      
      const preferences: UserPreferences = {
        industry: 'development',
        language: 'en',
        insightCount: 2,
        strategyCount: 1
      };
      
      const analysis = generateKeywordAnalysis(keywords, preferences);
      
      // 영어 형식인지 확인
      expect(analysis).toContain('Keyword Analysis');
      
      // 인사이트 수 제한 확인 (2개만 있어야 함)
      const insightMatches = analysis.match(/- .+/g) || [];
      expect(insightMatches.length).toBeLessThanOrEqual(2);
      
      // 전략 수 제한 확인 (1개만 있어야 함)
      const strategyMatches = analysis.match(/\d+\. .+/g) || [];
      expect(strategyMatches.length).toBeLessThanOrEqual(1);
    });
  });
}); 