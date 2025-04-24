/**
 * Google Trends API 클라이언트
 * 
 * 실시간 인기 검색어 데이터를 가져오기 위한 기능을 제공합니다.
 * 참고: 공식 Google Trends API는 존재하지 않으므로 비공식 방법을 사용합니다.
 */

type TrendingKeyword = {
  keyword: string;
  count: number;  // 검색 상대 지수
  change?: number; // 변화량 (백분율)
};

// 트렌드 카테고리
type TrendCategory = 'all' | 'business' | 'technology' | 'entertainment' | 'health';

/**
 * 특정 카테고리의 인기 검색어를 가져옵니다.
 * 참고: 실제 Google Trends API 대신 미리 정의된 데이터 사용
 */
export async function getTrendingKeywords(
  category: TrendCategory = 'all',
  count: number = 10,
  geo: string = 'KR'
): Promise<TrendingKeyword[]> {
  // 실제 구현에서는 Google Trends 데이터를 가져오는 API 호출로 대체
  // 현재는 카테고리별 더미 데이터를 반환
  
  console.log(`[trends_api] 인기 검색어 요청: 카테고리=${category}, 국가=${geo}, 개수=${count}`);
  
  // 카테고리별 데이터
  const trendData: Record<TrendCategory, TrendingKeyword[]> = {
    all: [
      { keyword: 'MCP 블렌더', count: 342, change: 120 },
      { keyword: '블랙 프라이데이', count: 267, change: 85 },
      { keyword: '인공지능 챗봇', count: 211, change: 15 },
      { keyword: '월드컵 예선', count: 189, change: -5 },
      { keyword: '대입 수능', count: 175, change: 200 },
      { keyword: '겨울 여행지', count: 162, change: 30 },
      { keyword: '다이어트 식단', count: 154, change: -20 },
      { keyword: '메타버스 투자', count: 143, change: 10 },
      { keyword: '전기차 충전소', count: 132, change: 5 },
      { keyword: '에어팟 프로', count: 128, change: -15 },
    ],
    business: [
      { keyword: '비트코인 전망', count: 278, change: 50 },
      { keyword: '주식 시장 전망', count: 245, change: 15 },
      { keyword: '스타트업 투자', count: 221, change: 30 },
      { keyword: '부동산 시장', count: 209, change: -20 },
      { keyword: '원자재 가격', count: 195, change: 25 },
      { keyword: '디지털 마케팅', count: 187, change: 40 },
      { keyword: '금리 전망', count: 176, change: 10 },
      { keyword: '재택근무 기업', count: 168, change: -10 },
      { keyword: '전자상거래 트렌드', count: 155, change: 20 },
      { keyword: '블록체인 비즈니스', count: 143, change: 35 },
    ],
    technology: [
      { keyword: 'MCP 블렌더 튜토리얼', count: 312, change: 150 },
      { keyword: 'AI 생성 모델', count: 285, change: 70 },
      { keyword: 'React 18 기능', count: 246, change: 25 },
      { keyword: 'Next.js 14', count: 232, change: 80 },
      { keyword: 'GPT-5 루머', count: 217, change: 110 },
      { keyword: 'Apple M3 성능', count: 201, change: 15 },
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
  
  // 요청된 카테고리의 키워드 반환
  return trendData[category].slice(0, count);
}

/**
 * 특정 키워드의 관련 검색어를 가져옵니다.
 * 참고: 실제 Google Trends API 대신 미리 정의된 데이터 사용
 */
export async function getRelatedKeywords(
  keyword: string,
  count: number = 10,
  geo: string = 'KR'
): Promise<string[]> {
  console.log(`[trends_api] 관련 검색어 요청: 키워드=${keyword}, 국가=${geo}, 개수=${count}`);
  
  // 인기 키워드에 대한 관련 검색어 미리 정의
  const relatedKeywordsMap: Record<string, string[]> = {
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
    ]
  };
  
  // 키워드 정규화 (대소문자 구분 없이)
  const normalizedKeyword = keyword.toLowerCase();
  
  // 관련 검색어 찾기
  for (const [key, values] of Object.entries(relatedKeywordsMap)) {
    if (normalizedKeyword.includes(key.toLowerCase())) {
      return values.slice(0, count);
    }
  }
  
  // 관련 검색어가 없는 경우 일반적인 검색어 반환
  return [
    `${keyword} 사용법`,
    `${keyword} 리뷰`,
    `${keyword} 추천`,
    `${keyword} 비교`,
    `${keyword} 가격`,
    `${keyword} 장단점`,
    `${keyword} 튜토리얼`,
    `${keyword} 2023`,
    `${keyword} 최신`,
    `${keyword} 대안`
  ].slice(0, count);
}

/**
 * 키워드의 시간에 따른 검색 트렌드를 가져옵니다.
 * 참고: 실제 Google Trends API 대신 미리 정의된 데이터 사용
 */
export async function getKeywordTrend(
  keyword: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  geo: string = 'KR'
): Promise<{ date: string; value: number }[]> {
  console.log(`[trends_api] 키워드 트렌드 요청: 키워드=${keyword}, 기간=${timeRange}, 국가=${geo}`);
  
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
  
  // 특정 키워드에 대한 트렌드 곡선 생성 (랜덤 데이터 사용)
  // 실제 구현에서는 Google Trends API 결과를 반환
  const values = dates.map((_, index) => {
    // MCP 블렌더 키워드는 최근에 급증하는 트렌드 패턴
    if (keyword.toLowerCase().includes('mcp') && keyword.toLowerCase().includes('블렌더')) {
      const baseline = 30;
      const growth = index / dates.length * 70; // 시간이 지날수록 증가
      return Math.round(baseline + growth + (Math.random() * 10 - 5));
    }
    
    // AI 관련 키워드는 전반적으로 높은 관심도 패턴
    else if (keyword.toLowerCase().includes('ai') || keyword.toLowerCase().includes('인공지능')) {
      const baseline = 50;
      const variation = Math.sin(index / 5) * 15; // 주기적 변동
      return Math.round(baseline + variation + (Math.random() * 10 - 5));
    }
    
    // 일반 키워드는 랜덤한 변동
    else {
      return Math.round(40 + Math.random() * 40);
    }
  });
  
  // 날짜와 값을 결합하여 반환
  return dates.map((date, index) => ({
    date,
    value: values[index]
  }));
} 