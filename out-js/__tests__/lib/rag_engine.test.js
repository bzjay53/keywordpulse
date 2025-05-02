/**
 * RAG 엔진 단위 테스트
 * @jest-environment node
 */
import { categorizeKeyword, generateKeywordAnalysis } from '@/lib/rag_engine';
// logger 모듈 모킹
jest.mock('@/lib/logger', function () { return ({
    log: jest.fn(),
    error: jest.fn(),
}); });
describe('RAG 엔진 단위 테스트', function () {
    describe('categorizeKeyword 함수', function () {
        test('AI 관련 키워드가 올바르게 분류되어야 함', function () {
            var aiKeywords = ['AI', 'GPT', '인공지능', '머신러닝', '딥러닝', 'Claude'];
            aiKeywords.forEach(function (keyword) {
                var category = categorizeKeyword(keyword);
                expect(category).toBe('AI 기술');
            });
        });
        test('마케팅 관련 키워드가 올바르게 분류되어야 함', function () {
            var marketingKeywords = ['마케팅', 'SEO', '디지털 마케팅', '소셜미디어 광고'];
            marketingKeywords.forEach(function (keyword) {
                var category = categorizeKeyword(keyword);
                expect(category).toBe('디지털 마케팅');
            });
        });
        test('앱 개발 관련 키워드가 올바르게 분류되어야 함', function () {
            var devKeywords = ['앱 개발', '프로그래밍', '모바일 앱', '웹사이트 개발'];
            devKeywords.forEach(function (keyword) {
                var category = categorizeKeyword(keyword);
                expect(category).toBe('앱 개발');
            });
        });
        test('빈 키워드는 일반 카테고리로 분류되어야 함', function () {
            var emptyKeywords = ['', ' ', null, undefined];
            emptyKeywords.forEach(function (keyword) {
                // @ts-ignore - 의도적으로 잘못된 타입 전달
                var category = categorizeKeyword(keyword);
                expect(category).toBe('일반');
            });
        });
        test('분류할 수 없는 키워드는 일반 카테고리로 분류되어야 함', function () {
            var unknownKeywords = ['xyz123', '가나다라', 'test'];
            unknownKeywords.forEach(function (keyword) {
                var category = categorizeKeyword(keyword);
                expect(category).toBe('일반');
            });
        });
    });
    describe('generateKeywordAnalysis 함수', function () {
        test('키워드 배열로 마크다운 형식의 분석 결과를 반환해야 함', function () {
            var keywords = ['인공지능', 'GPT', '머신러닝'];
            var analysis = generateKeywordAnalysis(keywords);
            // 분석 결과가 문자열이어야 함
            expect(typeof analysis).toBe('string');
            // 마크다운 형식의 제목이 포함되어야 함
            expect(analysis).toContain('## 인공지능 키워드 분석');
            // 주요 섹션들이 포함되어야 함
            expect(analysis).toContain('### 주요 인사이트');
            expect(analysis).toContain('### 콘텐츠 제작 전략');
        });
        test('빈 키워드 배열이 전달되면 에러 메시지를 반환해야 함', function () {
            var emptyKeywords = [];
            var analysis = generateKeywordAnalysis(emptyKeywords);
            expect(analysis).toBe('분석할 키워드가 없습니다.');
        });
        test('영어 언어 설정으로 영어 분석 결과를 반환해야 함', function () {
            var keywords = ['Artificial Intelligence', 'GPT', 'Machine Learning'];
            var preferences = {
                language: 'en'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 영어 마크다운 형식의 제목이 포함되어야 함
            expect(analysis).toContain('## Artificial Intelligence Keyword Analysis');
            // 영어 주요 섹션들이 포함되어야 함
            expect(analysis).toContain('### Key Insights');
            expect(analysis).toContain('### Content Strategy');
        });
        test('사용자 맞춤 설정이 올바르게 적용되어야 함', function () {
            var keywords = ['인공지능', 'GPT', '머신러닝'];
            var preferences = {
                insightCount: 2,
                strategyCount: 1,
                detailLevel: 'basic'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 인사이트 카운트 확인 (정확한 수는 정규식으로 확인)
            var insightMatches = analysis.match(/- .+/g) || [];
            expect(insightMatches.length).toBeLessThanOrEqual(preferences.insightCount);
            // 전략 카운트 확인
            var strategyMatches = analysis.match(/\d+\. .+/g) || [];
            expect(strategyMatches.length).toBeLessThanOrEqual(preferences.strategyCount);
        });
        test('예외 처리가 올바르게 작동해야 함', function () {
            // @ts-ignore - 의도적으로 잘못된 타입 전달
            var invalidInput = 'not an array';
            // @ts-ignore
            var analysis = generateKeywordAnalysis(invalidInput);
            expect(analysis).toBe('키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
        });
    });
});
