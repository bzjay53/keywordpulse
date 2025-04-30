/**
 * RAG 엔진 다국어 지원 테스트
 * @jest-environment node
 */
import { generateKeywordAnalysis } from '@/lib/rag_engine';
// logger 모듈 모킹
jest.mock('@/app/lib/logger', function () { return ({
    log: jest.fn(),
    error: jest.fn(),
}); });
describe('RAG 엔진 다국어 지원 테스트', function () {
    describe('언어별 분석 결과 생성', function () {
        // 여러 언어로 테스트할 키워드 목록
        var testKeywords = ['인공지능', 'GPT', '머신러닝'];
        test('한국어(기본) 분석이 올바르게 생성되어야 함', function () {
            var analysis = generateKeywordAnalysis(testKeywords);
            // 한국어 마크다운 형식 확인
            expect(analysis).toContain('## 인공지능 키워드 분석');
            expect(analysis).toContain('### 주요 인사이트');
            expect(analysis).toContain('### 콘텐츠 제작 전략');
            // 한국어 콘텐츠 포함 확인
            expect(analysis).toMatch(/AI|인공지능|머신러닝/);
        });
        test('영어 분석이 올바르게 생성되어야 함', function () {
            var preferences = {
                language: 'en'
            };
            var analysis = generateKeywordAnalysis(testKeywords, preferences);
            // 영어 마크다운 형식 확인
            expect(analysis).toContain('## 인공지능 Keyword Analysis');
            expect(analysis).toContain('### Key Insights');
            expect(analysis).toContain('### Content Strategy');
            // 영어 콘텐츠 포함 확인
            expect(analysis).toMatch(/AI|artificial intelligence|machine learning/i);
        });
    });
    describe('다국어 사용자 맞춤 설정', function () {
        test('영어 설정에서 오류 메시지가 영어로 반환되어야 함', function () {
            var preferences = {
                language: 'en'
            };
            // 빈 배열 전달 (오류 상황)
            var analysis = generateKeywordAnalysis([], preferences);
            // 영어 오류 메시지 확인
            expect(analysis).toBe('No keywords to analyze.');
        });
        test('영어 설정에서 에러 처리가 영어로 되어야 함', function () {
            var preferences = {
                language: 'en'
            };
            // @ts-ignore - 의도적으로 잘못된 타입 전달
            var analysis = generateKeywordAnalysis('invalid input', preferences);
            // 영어 에러 메시지 확인
            expect(analysis).toBe('An error occurred during keyword analysis. Please try again.');
        });
    });
    describe('다국어 지원이 다양한 카테고리에 적용되는지 테스트', function () {
        var categories = [
            { name: 'AI 기술', keyword: 'artificial intelligence' },
            { name: '디지털 마케팅', keyword: 'digital marketing' },
            { name: '앱 개발', keyword: 'app development' },
            { name: '3D 모델링/AI', keyword: '3d modeling' },
            { name: '일반', keyword: 'general topic' }
        ];
        test.each(categories)('$name 카테고리의 영어 분석이 생성되어야 함', function (_a) {
            var keyword = _a.keyword;
            var preferences = {
                language: 'en'
            };
            var analysis = generateKeywordAnalysis([keyword], preferences);
            // 영어 형식 확인
            expect(analysis).toContain("## ".concat(keyword, " Keyword Analysis"));
            expect(analysis).toContain('### Key Insights');
            expect(analysis).toContain('### Content Strategy');
        });
    });
    describe('언어 전환 테스트', function () {
        test('동일한 키워드에 대해 언어별로 다른 결과가 생성되어야 함', function () {
            var keywords = ['기술 트렌드', 'technology', '미래 기술'];
            // 한국어 분석
            var koAnalysis = generateKeywordAnalysis(keywords, { language: 'ko' });
            // 영어 분석
            var enAnalysis = generateKeywordAnalysis(keywords, { language: 'en' });
            // 결과가 달라야 함
            expect(koAnalysis).not.toBe(enAnalysis);
            // 한국어 결과에만 있는 텍스트 확인
            expect(koAnalysis).toContain('주요 인사이트');
            expect(koAnalysis).toContain('콘텐츠 제작 전략');
            // 영어 결과에만 있는 텍스트 확인
            expect(enAnalysis).toContain('Key Insights');
            expect(enAnalysis).toContain('Content Strategy');
        });
    });
});
