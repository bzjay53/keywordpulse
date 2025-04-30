/**
 * RAG (Retrieval-Augmented Generation) 엔진
 * 키워드 분석과 콘텐츠 생성을 위한 기능을 제공합니다.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import logger from './logger';
// 카테고리별 키워드 맵핑
var categoryKeywords = {
    'AI 기술': ['AI', 'GPT', '인공지능', '머신러닝', '딥러닝', 'Claude', 'LLM', '생성형 AI'],
    '디지털 마케팅': ['마케팅', 'SEO', '디지털 마케팅', '소셜미디어', '광고', '콘텐츠 마케팅'],
    '앱 개발': ['앱 개발', '웹 개발', '프로그래밍', '모바일 앱', '웹사이트', '프론트엔드', '백엔드'],
    '교육/학습': ['교육', '학습', '강의', '온라인 강의', 'e러닝', '학교', '대학'],
    '건강/의료': ['건강', '의료', '병원', '운동', '다이어트', '건강관리', '헬스케어'],
    '금융/투자': ['금융', '투자', '주식', '경제', '재테크', '자산관리', '암호화폐'],
    '3D 모델링/AI': ['3D', '모델링', '렌더링', 'CAD', 'Blender', 'Unity', 'Unreal'],
    '일반': []
};
// 분석 결과 캐시 (메모이제이션)
var analysisCache = new Map();
/**
 * 키워드를 해당 카테고리로 분류합니다.
 * @param keyword 분류할 키워드
 * @returns 키워드 카테고리
 */
export function categorizeKeyword(keyword) {
    if (!keyword)
        return '일반';
    var normalizedKeyword = keyword.toLowerCase().trim();
    // 각 카테고리의 키워드 목록과 일치하는지 확인
    for (var _i = 0, _a = Object.entries(categoryKeywords); _i < _a.length; _i++) {
        var _b = _a[_i], category = _b[0], keywords = _b[1];
        if (keywords.some(function (kw) { return normalizedKeyword.includes(kw.toLowerCase()); })) {
            return category;
        }
    }
    // 일치하는 카테고리가 없으면 '일반' 반환
    return '일반';
}
/**
 * 키워드 배열로부터 마크다운 형식의 분석 결과를 생성합니다.
 * @param keywords 분석할 키워드 배열
 * @param preferences 사용자 설정
 * @returns 마크다운 형식의 분석 결과
 */
export function generateKeywordAnalysis(keywords, preferences) {
    if (preferences === void 0) { preferences = {}; }
    try {
        // 빈 배열 체크
        if (!keywords || keywords.length === 0) {
            // 언어 설정에 따른 메시지 반환
            return preferences.language === 'en' ? 'No keywords to analyze.' : '분석할 키워드가 없습니다.';
        }
        // 캐시 키 생성 (키워드 + 설정 조합)
        var cacheKey = JSON.stringify({ keywords: keywords, preferences: preferences });
        // 캐시된 결과가 있으면 반환
        if (analysisCache.has(cacheKey)) {
            return analysisCache.get(cacheKey);
        }
        // 기본 설정
        var language = preferences.language || 'ko';
        var insightCount = preferences.insightCount || 3;
        var strategyCount = preferences.strategyCount || 3;
        var detailLevel = preferences.detailLevel || 'detailed';
        // 키워드 중 첫 번째 것을 대표 키워드로 사용
        var mainKeyword = keywords[0];
        // 키워드 카테고리 결정
        var category = categorizeKeyword(mainKeyword);
        // 산업 분야가 지정된 경우 카테고리 오버라이드
        if (preferences.industry) {
            var industry = preferences.industry.toLowerCase();
            if (industry.includes('market') || industry.includes('마케팅')) {
                category = '디지털 마케팅';
            }
            else if (industry.includes('dev') || industry.includes('개발')) {
                category = '앱 개발';
            }
            else if (industry.includes('ai') || industry.includes('인공지능')) {
                category = 'AI 기술';
            }
            else if (industry.includes('edu') || industry.includes('교육')) {
                category = '교육/학습';
            }
            else if (industry.includes('health') || industry.includes('건강') || industry.includes('의료')) {
                category = '건강/의료';
            }
            else if (industry.includes('finance') || industry.includes('금융') || industry.includes('투자')) {
                category = '금융/투자';
            }
        }
        // 언어별 제목과 섹션 이름
        var title = language === 'en' ? "## ".concat(mainKeyword, " Keyword Analysis") : "## ".concat(mainKeyword, " \uD0A4\uC6CC\uB4DC \uBD84\uC11D");
        var insightTitle = language === 'en' ? '### Key Insights' : '### 주요 인사이트';
        var strategyTitle = language === 'en' ? '### Content Strategy' : '### 콘텐츠 제작 전략';
        // 인사이트 생성 (간단한 예시)
        var insights = [];
        for (var i = 0; i < insightCount; i++) {
            var insightText = generateInsight(category, language, i);
            insights.push("- ".concat(insightText));
        }
        // 전략 생성 (간단한 예시)
        var strategies = [];
        for (var i = 0; i < strategyCount; i++) {
            var strategyText = generateStrategy(category, language, i);
            strategies.push("".concat(i + 1, ". ").concat(strategyText));
        }
        // 최종 마크다운 조합
        var analysisText = __spreadArray(__spreadArray(__spreadArray([
            title,
            '',
            insightTitle
        ], insights, true), [
            '',
            strategyTitle
        ], false), strategies, true).join('\n');
        // 캐시에 저장
        analysisCache.set(cacheKey, analysisText);
        return analysisText;
    }
    catch (error) {
        logger.error({
            message: '키워드 분석 중 오류 발생',
            error: error,
            context: { keywords: keywords }
        });
        // 오류 메시지 (언어에 맞게)
        return preferences.language === 'en'
            ? 'An error occurred during keyword analysis. Please try again.'
            : '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
    }
}
/**
 * 카테고리와 언어에 맞는 인사이트를 생성합니다.
 * @param category 키워드 카테고리
 * @param language 언어 설정
 * @param index 인사이트 인덱스
 * @returns 인사이트 텍스트
 */
function generateInsight(category, language, index) {
    // 영어 인사이트
    var enInsights = {
        'AI 기술': [
            'AI technology continues to evolve rapidly, with increasing adoption across industries',
            'Large language models are becoming more accessible to businesses of all sizes',
            'Users are increasingly concerned about ethical AI and data privacy issues'
        ],
        '디지털 마케팅': [
            'Content marketing delivers 3x more leads than traditional marketing for 62% less cost',
            'Video content generates 66% more qualified leads per year',
            'Mobile-first strategies are essential as mobile traffic exceeds 55% of total web traffic'
        ],
        '앱 개발': [
            'Cross-platform development frameworks are gaining popularity for cost efficiency',
            'UX/UI design becomes a critical differentiator in app success rates',
            'Integration with AI features is becoming a standard expectation in modern apps'
        ],
        '교육/학습': [
            'Microlearning techniques increase knowledge retention by up to 80%',
            'Interactive learning environments increase student engagement by 60%',
            'Personalized learning paths improve completion rates by 30-50%'
        ],
        '건강/의료': [
            'Preventive health content is seeing 45% higher engagement rates',
            'Mobile health tracking integration increases user retention by 40%',
            'Evidence-based health information builds 70% more user trust'
        ],
        '금융/투자': [
            'Educational finance content drives 3x more conversions than promotional content',
            'Simplified financial explanations broaden audience reach by 50%',
            'Visual data representation increases understanding of complex financial concepts by 65%'
        ],
        '3D 모델링/AI': [
            '3D visualization improves client satisfaction by 40% in project approvals',
            'AI-assisted modeling reduces production time by 35-50%',
            'Interactive 3D content increases engagement metrics by 70% compared to static images'
        ],
        '일반': [
            'Content that answers specific questions performs 70% better in search rankings',
            'Visual content is processed 60,000x faster than text by the human brain',
            'Consistent publishing schedules increase audience retention by 25-30%'
        ]
    };
    // 한국어 인사이트
    var koInsights = {
        'AI 기술': [
            'AI 기술은 계속 빠르게 발전하고 있으며, 다양한 산업에서 도입이 증가하고 있습니다',
            '대규모 언어 모델은 모든 규모의 기업에서 더 쉽게 접근할 수 있게 되었습니다',
            '사용자들은 윤리적 AI와 데이터 프라이버시 문제에 대해 더 관심을 가지고 있습니다'
        ],
        '디지털 마케팅': [
            '콘텐츠 마케팅은 기존 마케팅보다 62% 적은 비용으로 3배 더 많은 리드를 창출합니다',
            '비디오 콘텐츠는 연간 66% 더 많은 유자격 리드를 생성합니다',
            '모바일 트래픽이 전체 웹 트래픽의 55%를 초과하므로 모바일 우선 전략이 필수적입니다'
        ],
        '앱 개발': [
            '비용 효율성을 위해 크로스 플랫폼 개발 프레임워크가 인기를 얻고 있습니다',
            'UX/UI 디자인이 앱 성공률의 중요한 차별화 요소가 되고 있습니다',
            'AI 기능과의 통합은 현대 앱에서 표준 기대치가 되고 있습니다'
        ],
        '교육/학습': [
            '마이크로러닝 기법은 지식 보유율을 최대 80%까지 높입니다',
            '상호작용 학습 환경은 학생 참여도를 60% 증가시킵니다',
            '개인화된 학습 경로는 완료율을 30-50% 향상시킵니다'
        ],
        '건강/의료': [
            '예방 건강 콘텐츠는 45% 더 높은 참여율을 보입니다',
            '모바일 건강 추적 통합은 사용자 유지율을 40% 증가시킵니다',
            '증거 기반 건강 정보는 사용자 신뢰도를 70% 더 높입니다'
        ],
        '금융/투자': [
            '교육적 금융 콘텐츠는 프로모션 콘텐츠보다 3배 더 많은 전환을 유도합니다',
            '단순화된 금융 설명은 잠재 고객 도달 범위를 50% 넓힙니다',
            '시각적 데이터 표현은 복잡한 금융 개념의 이해도를 65% 향상시킵니다'
        ],
        '3D 모델링/AI': [
            '3D 시각화는 프로젝트 승인에서 클라이언트 만족도를 40% 향상시킵니다',
            'AI 지원 모델링은 제작 시간을 35-50% 단축시킵니다',
            '인터랙티브 3D 콘텐츠는 정적 이미지에 비해 참여 지표를 70% 증가시킵니다'
        ],
        '일반': [
            '특정 질문에 답하는 콘텐츠는 검색 랭킹에서 70% 더 좋은 성과를 보입니다',
            '시각적 콘텐츠는 인간의 뇌에서 텍스트보다 60,000배 더 빠르게 처리됩니다',
            '일관된 출판 일정은 잠재 고객 유지율을 25-30% 증가시킵니다'
        ]
    };
    // 언어에 따라 적절한 인사이트 배열 선택
    var insights = language === 'en' ? enInsights : koInsights;
    // 카테고리와 인덱스에 해당하는 인사이트 반환 (범위를 벗어나면 첫 번째 인사이트 반환)
    return insights[category][index % insights[category].length];
}
/**
 * 카테고리와 언어에 맞는 전략을 생성합니다.
 * @param category 키워드 카테고리
 * @param language 언어 설정
 * @param index 전략 인덱스
 * @returns 전략 텍스트
 */
function generateStrategy(category, language, index) {
    // 영어 전략
    var enStrategies = {
        'AI 기술': [
            'Create educational content that demystifies complex AI concepts for your audience',
            'Develop case studies showcasing practical AI applications in relevant industries',
            'Create comparison content between different AI tools and technologies'
        ],
        '디지털 마케팅': [
            'Develop a comprehensive content calendar targeting high-value keywords in your niche',
            'Create video tutorials demonstrating practical marketing techniques with measurable results',
            'Publish data-driven case studies highlighting ROI of digital marketing strategies'
        ],
        '앱 개발': [
            'Create step-by-step tutorials for implementing popular app features and functionality',
            'Publish technology comparison guides to help developers choose the right tools',
            'Develop case studies showcasing successful app development projects and outcomes'
        ],
        '교육/학습': [
            'Create microlearning modules that can be consumed in 5-10 minute sessions',
            'Develop interactive assessments that provide immediate feedback to learners',
            'Design adaptive learning paths that adjust to individual learning styles and progress'
        ],
        '건강/의료': [
            'Create evidence-based health guides with clear citations and expert reviews',
            'Develop visual content explaining complex health concepts in accessible ways',
            'Produce symptom checker content with appropriate medical disclaimers'
        ],
        '금융/투자': [
            'Create beginner-friendly financial education content with practical action steps',
            'Develop interactive calculators and tools for financial planning scenarios',
            'Produce jargon-free explanations of complex financial concepts and strategies'
        ],
        '3D 모델링/AI': [
            'Create workflow optimization tutorials for common 3D modeling tasks',
            'Develop comparison content between different 3D software and AI tools',
            'Produce case studies showing before/after results of AI-enhanced modeling'
        ],
        '일반': [
            'Create comprehensive guides addressing common questions in your topic area',
            'Develop visual content like infographics to simplify complex information',
            'Establish a consistent publishing schedule to build audience expectations'
        ]
    };
    // 한국어 전략
    var koStrategies = {
        'AI 기술': [
            '청중을 위해 복잡한 AI 개념을 이해하기 쉽게 설명하는 교육 콘텐츠를 만드세요',
            '관련 산업에서 실용적인 AI 응용 사례를 보여주는 사례 연구를 개발하세요',
            '다양한 AI 도구와 기술 간의 비교 콘텐츠를 제작하세요'
        ],
        '디지털 마케팅': [
            '틈새 시장의 고가치 키워드를 타겟팅하는 포괄적인 콘텐츠 캘린더를 개발하세요',
            '측정 가능한 결과로 실용적인 마케팅 기법을 보여주는 비디오 튜토리얼을 제작하세요',
            '디지털 마케팅 전략의 ROI를 강조하는 데이터 기반 사례 연구를 발행하세요'
        ],
        '앱 개발': [
            '인기 있는 앱 기능과 기능성을 구현하기 위한 단계별 튜토리얼을 만드세요',
            '개발자가 적절한 도구를 선택하는 데 도움이 되는 기술 비교 가이드를 발행하세요',
            '성공적인 앱 개발 프로젝트와 결과를 보여주는 사례 연구를 개발하세요'
        ],
        '교육/학습': [
            '5-10분 세션으로 소비할 수 있는 마이크로러닝 모듈을 만드세요',
            '학습자에게 즉각적인 피드백을 제공하는 대화형 평가를 개발하세요',
            '개인 학습 스타일과 진행 상황에 맞게 조정되는 적응형 학습 경로를 설계하세요'
        ],
        '건강/의료': [
            '명확한 인용과 전문가 검토가 있는 증거 기반 건강 가이드를 만드세요',
            '복잡한 건강 개념을 이해하기 쉬운 방식으로 설명하는 시각적 콘텐츠를 개발하세요',
            '적절한 의학적 면책 조항이 있는 증상 확인 콘텐츠를 제작하세요'
        ],
        '금융/투자': [
            '실용적인 행동 단계가 있는 초보자 친화적인 금융 교육 콘텐츠를 만드세요',
            '금융 계획 시나리오를 위한 대화형 계산기 및 도구를 개발하세요',
            '복잡한 금융 개념과 전략에 대한 전문 용어 없는 설명을 제작하세요'
        ],
        '3D 모델링/AI': [
            '일반적인 3D 모델링 작업을 위한 워크플로우 최적화 튜토리얼을 만드세요',
            '다양한 3D 소프트웨어와 AI 도구 간의 비교 콘텐츠를 개발하세요',
            'AI 강화 모델링의 전/후 결과를 보여주는 사례 연구를 제작하세요'
        ],
        '일반': [
            '주제 영역의 일반적인 질문을 다루는 포괄적인 가이드를 만드세요',
            '복잡한 정보를 단순화하는 인포그래픽과 같은 시각적 콘텐츠를 개발하세요',
            '잠재 고객 기대를 구축하기 위한 일관된 출판 일정을 수립하세요'
        ]
    };
    // 언어에 따라 적절한 전략 배열 선택
    var strategies = language === 'en' ? enStrategies : koStrategies;
    // 카테고리와 인덱스에 해당하는 전략 반환 (범위를 벗어나면 첫 번째 전략 반환)
    return strategies[category][index % strategies[category].length];
}
