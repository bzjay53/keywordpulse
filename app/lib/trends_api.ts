/**
 * Google Trends API와 유사한 기능을 제공하는 모듈
 * 트렌드 키워드, 관련 키워드 및 검색 트렌드 데이터를 제공합니다.
 */

// 키워드 타입 정의
export type TrendingKeyword = {
  keyword: string;
  count: number;  // 검색 상대 지수
  change?: number; // 변화량 (백분율)
};

// 카테고리 타입 정의
export type TrendCategory = 'all' | 'business' | 'technology' | 'entertainment' | 'health';

// 결과 캐싱을 위한 객체
const trendCache: Record<string, { 
  data: any, 
  timestamp: number, 
  expiry: number 
}> = {};

// 캐시 유효시간 (밀리초): 1시간
const CACHE_TTL = 60 * 60 * 1000;

// 트렌드 카테고리 데이터
const TREND_CATEGORIES = {
  all: [
    { keyword: 'AI 생성 모델', count: 342, change: 45 },
    { keyword: '디지털 마케팅', count: 298, change: 20 },
    { keyword: 'MCP 블렌더', count: 286, change: 72 },
    { keyword: '콘텐츠 전략', count: 267, change: 15 },
    { keyword: 'SEO 최적화', count: 254, change: 5 },
    { keyword: '소셜 미디어 트렌드', count: 243, change: 25 },
    { keyword: '앱 개발', count: 231, change: 10 },
    { keyword: '데이터 분석', count: 219, change: 30 },
    { keyword: '온라인 쇼핑몰', count: 205, change: -5 },
    { keyword: '유튜브 알고리즘', count: 198, change: 35 },
  ],
  business: [
    { keyword: '디지털 트랜스포메이션', count: 287, change: 30 },
    { keyword: '원격 근무 도구', count: 265, change: 15 },
    { keyword: '스타트업 펀딩', count: 251, change: 45 },
    { keyword: '고객 경험', count: 236, change: 20 },
    { keyword: '비즈니스 자동화', count: 224, change: 25 },
    { keyword: '기업 ESG', count: 212, change: 50 },
    { keyword: '직원 웰빙', count: 195, change: 35 },
    { keyword: '전자상거래 전략', count: 183, change: 10 },
    { keyword: '마케팅 ROI', count: 176, change: 5 },
    { keyword: '중소기업 디지털화', count: 168, change: 15 },
  ],
  technology: [
    { keyword: '인공지능 윤리', count: 298, change: 55 },
    { keyword: '블록체인 활용', count: 267, change: 35 },
    { keyword: '클라우드 네이티브', count: 245, change: 20 },
    { keyword: '프롬프트 엔지니어링', count: 232, change: 80 },
    { keyword: '엣지 컴퓨팅', count: 213, change: 15 },
    { keyword: '제로 트러스트 보안', count: 201, change: 40 },
    { keyword: 'Web3 개발', count: 189, change: 10 },
    { keyword: '양자 컴퓨팅', count: 178, change: 30 },
    { keyword: '사이버 보안 트렌드', count: 166, change: 5 },
    { keyword: '5G 활용 사례', count: 154, change: -10 },
  ],
  entertainment: [
    { keyword: '신규 넷플릭스 시리즈', count: 298, change: 40 },
    { keyword: '인기 웹툰', count: 267, change: 25 },
    { keyword: '디즈니플러스 영화', count: 245, change: 15 },
    { keyword: '인디 게임 추천', count: 231, change: 60 },
    { keyword: '연말 콘서트', count: 222, change: 85 },
    { keyword: '핫한 유튜버', count: 210, change: 30 },
    { keyword: '오디오북 추천', count: 195, change: 20 },
    { keyword: '전시회 일정', count: 183, change: 5 },
    { keyword: '새 앨범 발매', count: 176, change: 15 },
    { keyword: 'MBTI 테스트', count: 168, change: -10 },
  ],
  health: [
    { keyword: '겨울철 건강관리', count: 287, change: 45 },
    { keyword: '면역력 높이는 음식', count: 265, change: 30 },
    { keyword: '홈트레이닝 루틴', count: 246, change: 20 },
    { keyword: '건강한 수면습관', count: 232, change: 15 },
    { keyword: '비타민 추천', count: 218, change: 25 },
    { keyword: '근력운동 방법', count: 206, change: 10 },
    { keyword: '디지털 디톡스', count: 193, change: 60 },
    { keyword: '채식주의 식단', count: 187, change: 35 },
    { keyword: '목 스트레칭', count: 175, change: 5 },
    { keyword: '겨울 스포츠', count: 168, change: 40 },
  ],
};

// 관련 키워드 데이터
const RELATED_KEYWORDS_MAP: Record<string, string[]> = {
  'MCP 블렌더': [
    'MCP 블렌더 튜토리얼',
    'MCP 블렌더 다운로드',
    'Blender MCP 설치 방법',
    'MCP 블렌더 윈도우 11',
    'Claude AI 블렌더 연동',
    '블렌더 MCP 모델링',
    'MCP 3D 작품 갤러리',
    'MCP vs Midjourney',
    'AI 3D 모델링 도구',
    'MCP 블렌더 최적화'
  ],
  'AI 생성 모델': [
    'GPT-4 기능',
    'Stable Diffusion 최신 버전',
    'AI 이미지 생성',
    'DALL-E 3 특징',
    'Claude AI 사용법',
    'Midjourney 프롬프트',
    'AI 텍스트 생성',
    '오픈소스 AI 모델',
    'AI 음악 생성',
    'AI 동영상 생성'
  ],
  '디지털 마케팅': [
    'SEO 최적화 방법',
    '소셜 미디어 마케팅',
    '콘텐츠 마케팅 전략',
    '이메일 마케팅 툴',
    'PPC 광고 효과',
    'SNS 마케팅 트렌드',
    '인플루언서 마케팅 비용',
    '퍼포먼스 마케팅 성과',
    '디지털 마케팅 ROI',
    '마케팅 자동화 도구'
  ],
  '콘텐츠 전략': [
    '콘텐츠 전략 수립 방법',
    '콘텐츠 마케팅 전략',
    '콘텐츠 전략 사례',
    '콘텐츠 전략 프레임워크',
    '콘텐츠 유형별 전략',
    '콘텐츠 전략 KPI',
    '콘텐츠 캘린더 작성법',
    '타깃 고객 페르소나',
    '콘텐츠 전략 도구',
    '콘텐츠 SEO 최적화'
  ]
};

/**
 * 특정 카테고리의 인기 키워드를 가져옵니다.
 * @param category 키워드 카테고리
 * @param count 반환할 키워드 수
 * @param geo 지역 코드
 * @returns 트렌딩 키워드 배열
 */
export async function getTrendingKeywords(
  category: TrendCategory = 'all',
  count: number = 10,
  geo: string = 'KR'
): Promise<TrendingKeyword[]> {
  console.log(`[trends_api] 인기 키워드 요청: 카테고리=${category}, 국가=${geo}, 개수=${count}`);
  
  // 캐시 키 생성
  const cacheKey = `trending_${category}_${geo}_${count}`;
  
  // 캐시에서 확인
  if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
    console.log(`[trends_api] 캐시된 결과 사용: ${cacheKey}`);
    return trendCache[cacheKey].data;
  }
  
  // 요청된 카테고리의 키워드 반환
  const result = TREND_CATEGORIES[category].slice(0, count);
  
  // 결과 캐싱
  trendCache[cacheKey] = {
    data: result,
    timestamp: Date.now(),
    expiry: Date.now() + CACHE_TTL
  };
  
  return result;
}

/**
 * 특정 키워드의 관련 검색어를 가져옵니다.
 * @param keyword 검색 키워드
 * @param count 반환할 관련 검색어 수
 * @param geo 지역 코드
 * @returns 관련 검색어 배열
 */
export async function getRelatedKeywords(
  keyword: string,
  count: number = 10,
  geo: string = 'KR'
): Promise<string[]> {
  console.log(`[trends_api] 관련 검색어 요청: 키워드=${keyword}, 국가=${geo}, 개수=${count}`);
  
  // 캐시 키 생성
  const cacheKey = `related_${keyword.toLowerCase()}_${geo}_${count}`;
  
  // 캐시에서 확인
  if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
    console.log(`[trends_api] 캐시된 결과 사용: ${cacheKey}`);
    return trendCache[cacheKey].data;
  }
  
  // 키워드 정규화 (대소문자 구분 없이)
  const normalizedKeyword = keyword.toLowerCase();
  
  let result: string[] = [];
  
  // 관련 검색어 찾기
  for (const [key, values] of Object.entries(RELATED_KEYWORDS_MAP)) {
    if (normalizedKeyword.includes(key.toLowerCase())) {
      result = values.slice(0, count);
      break;
    }
  }
  
  // 관련 검색어가 없는 경우, 입력 키워드를 기반으로 관련 검색어 생성
  if (result.length === 0) {
    result = [
      `${keyword} 사용법`,
      `${keyword} 리뷰`,
      `${keyword} 비교`,
      `${keyword} 가격`,
      `${keyword} 장단점`,
      `${keyword} 추천`,
      `${keyword} 초보자`,
      `${keyword} 최신`,
      `${keyword} 대안`,
      `${keyword} 트렌드`
    ].slice(0, count);
  }
  
  // 결과 캐싱
  trendCache[cacheKey] = {
    data: result,
    timestamp: Date.now(),
    expiry: Date.now() + CACHE_TTL
  };
  
  return result;
}

/**
 * 키워드의 시간에 따른 검색 트렌드를 가져옵니다.
 * @param keyword 검색 키워드
 * @param timeRange 시간 범위 (일/주/월/년)
 * @param geo 지역 코드
 * @returns 날짜별 트렌드 값 객체 배열
 */
export async function getKeywordTrend(
  keyword: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  geo: string = 'KR'
): Promise<{ date: string; value: number }[]> {
  console.log(`[trends_api] 키워드 트렌드 요청: 키워드=${keyword}, 기간=${timeRange}, 국가=${geo}`);
  
  // 캐시 키 생성
  const cacheKey = `trend_${keyword.toLowerCase()}_${timeRange}_${geo}`;
  
  // 캐시에서 확인
  if (trendCache[cacheKey] && Date.now() < trendCache[cacheKey].expiry) {
    console.log(`[trends_api] 캐시된 결과 사용: ${cacheKey}`);
    return trendCache[cacheKey].data;
  }
  
  // 날짜 생성 함수
  const generateDates = (days: number) => {
    const dates = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };
  
  // 기간별 데이터 포인트 생성
  let dates: string[] = [];
  switch (timeRange) {
    case 'day':
      dates = generateDates(1).map(date => date + ' ' + new Date().getHours() + ':00');
      break;
    case 'week':
      dates = generateDates(7);
      break;
    case 'month':
      dates = generateDates(30);
      break;
    case 'year':
      // 년 단위는 월별 데이터로 제공
      const now = new Date();
      dates = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(now.getMonth() - i);
        return month.toISOString().split('T')[0].substring(0, 7); // YYYY-MM 형식
      }).reverse();
      break;
  }
  
  // 특정 키워드에 대한 트렌드 곡선 생성
  const normalizedKeyword = keyword.toLowerCase();
  let values: number[] = [];
  
  // MCP 블렌더 키워드는 최근에 급증하는 트렌드 패턴
  if (normalizedKeyword.includes('mcp') && normalizedKeyword.includes('블렌더')) {
    values = dates.map((_, index) => {
      const baseline = 30;
      const growth = index / dates.length * 70; // 시간이 지날수록 증가
      return Math.round(baseline + growth + (Math.random() * 10 - 5));
    });
  }
  // AI 관련 키워드는 전반적으로 높은 관심도 패턴
  else if (normalizedKeyword.includes('ai') || normalizedKeyword.includes('인공지능')) {
    values = dates.map((_, index) => {
      const baseline = 50;
      const variation = Math.sin(index / 5) * 15; // 주기적 변동
      return Math.round(baseline + variation + (Math.random() * 10 - 5));
    });
  }
  // 일반 키워드는 랜덤한 변동
  else {
    values = dates.map(() => Math.round(40 + Math.random() * 40));
  }
  
  // 날짜와 값을 결합하여 반환
  const result = dates.map((date, index) => ({
    date,
    value: values[index]
  }));
  
  // 결과 캐싱
  trendCache[cacheKey] = {
    data: result,
    timestamp: Date.now(),
    expiry: Date.now() + CACHE_TTL
  };
  
  return result;
} 