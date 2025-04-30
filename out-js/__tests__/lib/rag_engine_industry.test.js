/**
 * RAG 엔진 산업 분야별 맞춤 분석 테스트
 * @jest-environment node
 */
import { generateKeywordAnalysis } from '@/lib/rag_engine';
// logger 모듈 모킹
jest.mock('@/app/lib/logger', function () { return ({
    log: jest.fn(),
    error: jest.fn(),
}); });
describe('RAG 엔진 산업 분야별 맞춤 분석 테스트', function () {
    describe('산업 분야별 카테고리 오버라이드', function () {
        // 테스트할 산업 분야 및 기대 결과
        var testCases = [
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
        test.each(testCases)('산업 분야 "$industry"는 $expectedText 관련 내용을 포함해야 함', function (_a) {
            var industry = _a.industry, expectedText = _a.expectedText;
            // 일반적인 키워드(산업 분야 특정하지 않음)
            var keywords = ['분석', '전략', '동향'];
            var preferences = {
                industry: industry
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 해당 산업 분야의 특성이 분석에 반영되었는지 확인
            expect(analysis).toContain(expectedText);
        });
    });
    describe('산업 분야별 특화 콘텐츠 확인', function () {
        test('마케팅 산업 분야는 마케팅 관련 전략이 포함되어야 함', function () {
            var keywords = ['콘텐츠', '전략', '분석'];
            var preferences = {
                industry: 'marketing'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 마케팅 특화 용어 포함 확인
            expect(analysis).toMatch(/ROI|마케팅|콘텐츠|전략|SEO|광고/);
        });
        test('AI 산업 분야는 AI 관련 인사이트가 포함되어야 함', function () {
            var keywords = ['기술', '최신', '개발'];
            var preferences = {
                industry: 'ai'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // AI 관련 용어 포함 확인
            expect(analysis).toMatch(/AI|인공지능|머신러닝|딥러닝|모델/);
        });
        test('건강/의료 산업 분야는 의학 관련 내용이 포함되어야 함', function () {
            var keywords = ['건강', '관리', '예방'];
            var preferences = {
                industry: 'health'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 건강/의료 관련 용어 포함 확인
            expect(analysis).toMatch(/건강|의료|관리|예방|전문가/);
        });
    });
    describe('산업 분야와 다국어 설정 결합', function () {
        test('영어 설정과 마케팅 산업 분야 설정이 함께 적용되어야 함', function () {
            var keywords = ['마케팅', '전략', '분석'];
            var preferences = {
                language: 'en',
                industry: 'marketing'
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 영어 형식인지 확인
            expect(analysis).toContain('Keyword Analysis');
            expect(analysis).toContain('Key Insights');
            expect(analysis).toContain('Content Strategy');
            // 마케팅 관련 영어 용어 포함 확인
            expect(analysis).toMatch(/marketing|strategy|ROI|content|digital/i);
        });
    });
    describe('맞춤형 설정 조합', function () {
        test('산업 분야, 언어, 인사이트 개수 설정이 모두 적용되어야 함', function () {
            var keywords = ['전략', '기술', '분석'];
            var preferences = {
                industry: 'development',
                language: 'en',
                insightCount: 2,
                strategyCount: 1
            };
            var analysis = generateKeywordAnalysis(keywords, preferences);
            // 영어 형식인지 확인
            expect(analysis).toContain('Keyword Analysis');
            // 인사이트 수 제한 확인 (2개만 있어야 함)
            var insightMatches = analysis.match(/- .+/g) || [];
            expect(insightMatches.length).toBeLessThanOrEqual(2);
            // 전략 수 제한 확인 (1개만 있어야 함)
            var strategyMatches = analysis.match(/\d+\. .+/g) || [];
            expect(strategyMatches.length).toBeLessThanOrEqual(1);
        });
    });
});
