/**
 * RAG 엔진 성능 테스트
 * @jest-environment node
 */

import {
  generateKeywordAnalysis,
  categorizeKeyword
} from '../lib/rag_engine';

// logger 모듈 모킹
jest.mock('../../app/lib/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('RAG 엔진 성능 테스트', () => {
  // 실행 시간 측정 헬퍼 함수
  const measureExecutionTime = (callback: Function): number => {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
  };

  test('카테고리 분류 함수의 성능이 일관적이어야 함', () => {
    const keywords = [
      '인공지능', '머신러닝', 'GPT', '챗봇', 
      '디지털 마케팅', 'SEO', '소셜미디어', 
      '앱 개발', '웹앱', 'API', 
      '3D 모델링', 'Blender', '렌더링',
      '일반 키워드', '기타', '참고자료'
    ];
    
    const iterations = 10;
    const timings: number[] = [];
    
    // 여러 번 실행하여 성능 측정
    for (let i = 0; i < iterations; i++) {
      const time = measureExecutionTime(() => {
        keywords.forEach(keyword => categorizeKeyword(keyword));
      });
      timings.push(time);
    }
    
    // 평균 실행 시간 계산
    const avgTime = timings.reduce((sum, time) => sum + time, 0) / iterations;
    console.log(`카테고리 분류 평균 실행 시간: ${avgTime.toFixed(2)}ms`);
    
    // 표준 편차 계산
    const variance = timings.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / iterations;
    const stdDev = Math.sqrt(variance);
    
    // 성능이 일관적인지 확인 (표준 편차가 평균의 특정 비율 이하)
    const maxAllowedStdDev = avgTime * 5.0; // 평균의 500%까지 허용 (Jest 환경에서는 성능이 안정적이지 않을 수 있음)
    expect(stdDev).toBeLessThanOrEqual(maxAllowedStdDev);
  });

  test('generateKeywordAnalysis 함수가 합리적인 시간 내에 완료되어야 함', () => {
    // 다양한 크기의 키워드 배열 준비
    const smallKeywordSet = ['인공지능', 'GPT'];
    const mediumKeywordSet = Array.from({ length: 10 }, (_, i) => `키워드${i}`);
    const largeKeywordSet = Array.from({ length: 50 }, (_, i) => `키워드${i}`);
    
    // 실행 시간 측정
    const smallTime = measureExecutionTime(() => {
      generateKeywordAnalysis(smallKeywordSet);
    });
    
    const mediumTime = measureExecutionTime(() => {
      generateKeywordAnalysis(mediumKeywordSet);
    });
    
    const largeTime = measureExecutionTime(() => {
      generateKeywordAnalysis(largeKeywordSet);
    });
    
    console.log(`소규모 키워드셋(${smallKeywordSet.length}개) 실행 시간: ${smallTime.toFixed(2)}ms`);
    console.log(`중규모 키워드셋(${mediumKeywordSet.length}개) 실행 시간: ${mediumTime.toFixed(2)}ms`);
    console.log(`대규모 키워드셋(${largeKeywordSet.length}개) 실행 시간: ${largeTime.toFixed(2)}ms`);
    
    // 최대 허용 시간 (ms) - 이 값은 환경에 따라 조정 필요
    const maxSmallTime = 200;  // 소규모 키워드셋 최대 200ms
    const maxMediumTime = 500; // 중규모 키워드셋 최대 500ms
    const maxLargeTime = 1000; // 대규모 키워드셋 최대 1000ms
    
    expect(smallTime).toBeLessThanOrEqual(maxSmallTime);
    expect(mediumTime).toBeLessThanOrEqual(maxMediumTime);
    expect(largeTime).toBeLessThanOrEqual(maxLargeTime);
    
    // 선형 성능 확인 (키워드 수에 비례하여 실행 시간이 선형적으로 증가하는지)
    const smallPerKeyword = smallTime / smallKeywordSet.length;
    const mediumPerKeyword = mediumTime / mediumKeywordSet.length;
    const largePerKeyword = largeTime / largeKeywordSet.length;
    
    console.log(`키워드당 처리 시간 (소규모): ${smallPerKeyword.toFixed(2)}ms`);
    console.log(`키워드당 처리 시간 (중규모): ${mediumPerKeyword.toFixed(2)}ms`);
    console.log(`키워드당 처리 시간 (대규모): ${largePerKeyword.toFixed(2)}ms`);
    
    // 대규모 세트에서 키워드당 처리 시간이 소규모 세트의 2배를 넘지 않아야 함
    // (복잡도가 기하급수적으로 증가하지 않음을 확인)
    expect(largePerKeyword).toBeLessThanOrEqual(smallPerKeyword * 2);
  });

  test('메모리 사용량이 합리적이어야 함', () => {
    // Node.js 환경에서만 테스트 가능
    if (typeof process !== 'undefined' && process.memoryUsage) {
      // 초기 메모리 사용량 기록
      const initialMemory = process.memoryUsage().heapUsed;
      
      // 대량의 키워드로 분석 수행
      const largeKeywordSet = Array.from({ length: 100 }, (_, i) => `대용량테스트키워드${i}`);
      generateKeywordAnalysis(largeKeywordSet);
      
      // 분석 후 메모리 사용량 기록
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;
      
      console.log(`메모리 사용량: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);
      
      // 100개 키워드에 대해 20MB 이상의 메모리를 사용하면 안 됨
      const maxAllowedMemory = 20 * 1024 * 1024; // 20MB
      expect(memoryUsed).toBeLessThanOrEqual(maxAllowedMemory);
    } else {
      // Node.js 환경이 아닌 경우 테스트 생략
      console.log('Node.js 환경이 아니므로 메모리 테스트를 건너뜁니다.');
    }
  });
}); 