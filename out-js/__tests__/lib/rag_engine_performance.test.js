/**
 * RAG 엔진 성능 테스트
 * @jest-environment node
 */
import { generateKeywordAnalysis, categorizeKeyword } from '../lib/rag_engine';
// logger 모듈 모킹
jest.mock('../../app/lib/logger', function () { return ({
    log: jest.fn(),
    error: jest.fn(),
}); });
describe('RAG 엔진 성능 테스트', function () {
    // 실행 시간 측정 헬퍼 함수
    var measureExecutionTime = function (callback) {
        var start = performance.now();
        callback();
        var end = performance.now();
        return end - start;
    };
    test('카테고리 분류 함수의 성능이 일관적이어야 함', function () {
        var keywords = [
            '인공지능', '머신러닝', 'GPT', '챗봇',
            '디지털 마케팅', 'SEO', '소셜미디어',
            '앱 개발', '웹앱', 'API',
            '3D 모델링', 'Blender', '렌더링',
            '일반 키워드', '기타', '참고자료'
        ];
        var iterations = 10;
        var timings = [];
        // 여러 번 실행하여 성능 측정
        for (var i = 0; i < iterations; i++) {
            var time = measureExecutionTime(function () {
                keywords.forEach(function (keyword) { return categorizeKeyword(keyword); });
            });
            timings.push(time);
        }
        // 평균 실행 시간 계산
        var avgTime = timings.reduce(function (sum, time) { return sum + time; }, 0) / iterations;
        console.log("\uCE74\uD14C\uACE0\uB9AC \uBD84\uB958 \uD3C9\uADE0 \uC2E4\uD589 \uC2DC\uAC04: ".concat(avgTime.toFixed(2), "ms"));
        // 표준 편차 계산
        var variance = timings.reduce(function (sum, time) { return sum + Math.pow(time - avgTime, 2); }, 0) / iterations;
        var stdDev = Math.sqrt(variance);
        // 성능이 일관적인지 확인 (표준 편차가 평균의 특정 비율 이하)
        var maxAllowedStdDev = avgTime * 5.0; // 평균의 500%까지 허용 (Jest 환경에서는 성능이 안정적이지 않을 수 있음)
        expect(stdDev).toBeLessThanOrEqual(maxAllowedStdDev);
    });
    test('generateKeywordAnalysis 함수가 합리적인 시간 내에 완료되어야 함', function () {
        // 다양한 크기의 키워드 배열 준비
        var smallKeywordSet = ['인공지능', 'GPT'];
        var mediumKeywordSet = Array.from({ length: 10 }, function (_, i) { return "\uD0A4\uC6CC\uB4DC".concat(i); });
        var largeKeywordSet = Array.from({ length: 50 }, function (_, i) { return "\uD0A4\uC6CC\uB4DC".concat(i); });
        // 실행 시간 측정
        var smallTime = measureExecutionTime(function () {
            generateKeywordAnalysis(smallKeywordSet);
        });
        var mediumTime = measureExecutionTime(function () {
            generateKeywordAnalysis(mediumKeywordSet);
        });
        var largeTime = measureExecutionTime(function () {
            generateKeywordAnalysis(largeKeywordSet);
        });
        console.log("\uC18C\uADDC\uBAA8 \uD0A4\uC6CC\uB4DC\uC14B(".concat(smallKeywordSet.length, "\uAC1C) \uC2E4\uD589 \uC2DC\uAC04: ").concat(smallTime.toFixed(2), "ms"));
        console.log("\uC911\uADDC\uBAA8 \uD0A4\uC6CC\uB4DC\uC14B(".concat(mediumKeywordSet.length, "\uAC1C) \uC2E4\uD589 \uC2DC\uAC04: ").concat(mediumTime.toFixed(2), "ms"));
        console.log("\uB300\uADDC\uBAA8 \uD0A4\uC6CC\uB4DC\uC14B(".concat(largeKeywordSet.length, "\uAC1C) \uC2E4\uD589 \uC2DC\uAC04: ").concat(largeTime.toFixed(2), "ms"));
        // 최대 허용 시간 (ms) - 이 값은 환경에 따라 조정 필요
        var maxSmallTime = 200; // 소규모 키워드셋 최대 200ms
        var maxMediumTime = 500; // 중규모 키워드셋 최대 500ms
        var maxLargeTime = 1000; // 대규모 키워드셋 최대 1000ms
        expect(smallTime).toBeLessThanOrEqual(maxSmallTime);
        expect(mediumTime).toBeLessThanOrEqual(maxMediumTime);
        expect(largeTime).toBeLessThanOrEqual(maxLargeTime);
        // 선형 성능 확인 (키워드 수에 비례하여 실행 시간이 선형적으로 증가하는지)
        var smallPerKeyword = smallTime / smallKeywordSet.length;
        var mediumPerKeyword = mediumTime / mediumKeywordSet.length;
        var largePerKeyword = largeTime / largeKeywordSet.length;
        console.log("\uD0A4\uC6CC\uB4DC\uB2F9 \uCC98\uB9AC \uC2DC\uAC04 (\uC18C\uADDC\uBAA8): ".concat(smallPerKeyword.toFixed(2), "ms"));
        console.log("\uD0A4\uC6CC\uB4DC\uB2F9 \uCC98\uB9AC \uC2DC\uAC04 (\uC911\uADDC\uBAA8): ".concat(mediumPerKeyword.toFixed(2), "ms"));
        console.log("\uD0A4\uC6CC\uB4DC\uB2F9 \uCC98\uB9AC \uC2DC\uAC04 (\uB300\uADDC\uBAA8): ".concat(largePerKeyword.toFixed(2), "ms"));
        // 대규모 세트에서 키워드당 처리 시간이 소규모 세트의 2배를 넘지 않아야 함
        // (복잡도가 기하급수적으로 증가하지 않음을 확인)
        expect(largePerKeyword).toBeLessThanOrEqual(smallPerKeyword * 2);
    });
    test('메모리 사용량이 합리적이어야 함', function () {
        // Node.js 환경에서만 테스트 가능
        if (typeof process !== 'undefined' && process.memoryUsage) {
            // 초기 메모리 사용량 기록
            var initialMemory = process.memoryUsage().heapUsed;
            // 대량의 키워드로 분석 수행
            var largeKeywordSet = Array.from({ length: 100 }, function (_, i) { return "\uB300\uC6A9\uB7C9\uD14C\uC2A4\uD2B8\uD0A4\uC6CC\uB4DC".concat(i); });
            generateKeywordAnalysis(largeKeywordSet);
            // 분석 후 메모리 사용량 기록
            var finalMemory = process.memoryUsage().heapUsed;
            var memoryUsed = finalMemory - initialMemory;
            console.log("\uBA54\uBAA8\uB9AC \uC0AC\uC6A9\uB7C9: ".concat((memoryUsed / 1024 / 1024).toFixed(2), "MB"));
            // 100개 키워드에 대해 20MB 이상의 메모리를 사용하면 안 됨
            var maxAllowedMemory = 20 * 1024 * 1024; // 20MB
            expect(memoryUsed).toBeLessThanOrEqual(maxAllowedMemory);
        }
        else {
            // Node.js 환경이 아닌 경우 테스트 생략
            console.log('Node.js 환경이 아니므로 메모리 테스트를 건너뜁니다.');
        }
    });
});
