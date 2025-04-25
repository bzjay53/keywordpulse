# 🧠 RAG (Retrieval-Augmented Generation) 시스템 문서

이 문서는 KeywordPulse 서비스의 핵심 기능 중 하나인 RAG (Retrieval-Augmented Generation) 기반 텍스트 분석 시스템의 구조, 동작 방식, 적용 방식에 대해 설명합니다.

---

## 📌 목적
- 키워드 분석 결과를 **사실 기반 자연어 요약**으로 생성
- 사용자가 검색한 키워드 목록을 바탕으로 **자동 인사이트 문장** 제공
- 점수 기반 키워드 추천을 **텍스트 형태로 설명**하는 인터페이스 구현

---

## 🧠 RAG 시스템 개요

| 구성 요소 | 설명 |
|------------|------|
| Retriever | 분석된 키워드와 점수 정보를 구조화된 텍스트 형태로 정리 |
| Generator | 사전 템플릿 또는 LLM(OpenAI) 기반 텍스트 생성기 |
| Output Formatter | 마크다운 형식 또는 HTML UI로 렌더링되는 텍스트 결과 |

### 텍스트 생성 흐름

```plaintext
사용자 키워드 입력 → 검색 결과 → 상위 N개 추출 → 점수 기반 구조화 → 템플릿 → 최종 텍스트 출력
```

---

## ⚙️ 동작 프로세스

1. `/api/search` 응답에서 추천 점수 60점 이상 키워드를 선별
2. 해당 키워드를 리스트화하여 요약 입력값으로 구성
3. 템플릿 또는 LLM에게 전달 → 요약문 생성
4. `/api/analyze` 응답으로 마크다운 형태 텍스트 반환
5. 프론트에서 Card UI로 표시

---

## 📦 구현 구조 (2023.05.12 업데이트)

### 모듈화된 RAG 엔진
리팩토링을 통해 RAG 관련 로직을 외부 모듈로 분리했습니다:

```ts
// app/lib/rag_engine.ts
export function generateKeywordAnalysis(keywords: string[]): string {
  // 메인 키워드를 기반으로 카테고리 분류
  const mainKeyword = keywords[0];
  const category = categorizeKeyword(mainKeyword);
  
  // 카테고리별 전문 분석 함수 호출
  switch (category) {
    case '3D 모델링/AI': return generateModelingAnalysis(mainKeyword, keywords);
    case 'AI 기술': return generateAIAnalysis(mainKeyword, keywords);
    case '디지털 마케팅': return generateMarketingAnalysis(mainKeyword, keywords);
    case '앱 개발': return generateDevelopmentAnalysis(mainKeyword, keywords);
    default: return generateGenericAnalysis(mainKeyword, keywords);
  }
}
```

### 카테고리별 분석
각 카테고리별로 전문화된 분석 함수 구현:

| 카테고리 | 분석 템플릿 |
|--------|-----------|
| 3D 모델링/AI | 블렌더, 3D 모델링 중심 |
| AI 기술 | LLM, 딥러닝 중심 |
| 디지털 마케팅 | SEO, 콘텐츠 마케팅 중심 |
| 앱 개발 | 프로그래밍, 개발 관련 중심 |
| 일반 | 범용 템플릿 |

### 로깅 및 오류 처리 통합
```ts
try {
  // 분석 로직
} catch (error) {
  // 로깅: 분석 중 오류
  logger.error({
    message: 'RAG 키워드 분석 오류',
    error: error as Error,
    context: { keywordCount: keywords.length }
  });
  
  // 에러 발생 시 기본 메시지 반환
  return '키워드 분석 중 오류가 발생했습니다. 다시 시도해 주세요.';
}
```

---

## ✨ 템플릿 기반 RAG 예시 (TypeScript 함수형)

```typescript
function generateMarketingAnalysis(mainKeyword: string, keywords: string[]): string {
  let analysis = `## ${mainKeyword} 키워드 분석\n\n`;
  
  analysis += `디지털 마케팅 분야에서 **${mainKeyword}**에 대한 트렌드를 분석한 결과, `;
  analysis += `ROI 측정, 효과적인 전략 수립, 그리고 성공 사례에 대한 관심이 높습니다.\n\n`;
  
  analysis += "### 주요 인사이트\n\n";
  
  const topKeywords = keywords.slice(0, 3);
  const insights = [
    `**${topKeywords[0]}**에 대한 검색이 가장 많으며, 구체적인 성과 측정과 ROI 관련 정보에 대한 수요가 높습니다.`,
    `${topKeywords[1]} 관련 콘텐츠는 경쟁이 적은 편으로, 구체적인 방법론과 단계별 가이드를 제공하면 경쟁 우위를 점할 수 있습니다.`,
    `최근 6개월간 ${topKeywords[2]}에 대한 검색이 45% 증가했으며, 성공 사례와 실패 사례를 모두 다루는 콘텐츠가 주목받고 있습니다.`,
  ];
  
  insights.forEach(insight => {
    analysis += `- ${insight}\n`;
  });
  
  return analysis;
}
```

---

## 🤖 LLM 기반 확장 가능성
- 향후 OpenAI GPT, Claude, Gemini 등 API 연동 가능
- `prompt_template + structured_keywords` 형태로 Prompt Engineering 가능
- 예시:
```text
[시작]
아래 키워드 분석 데이터를 바탕으로 마케팅 인사이트 요약을 생성해줘:

키워드: AI 마케팅 / 검색량: 28,000 / 경쟁률: 0.25 / 점수: 91
...
```

---

## 📦 API 통합 및 프론트엔드 연동

| 구성 요소 | 설명 |
|----------|------|
| `/api/analyze` | 키워드 목록 전달 → `generateKeywordAnalysis()` 호출 |
| `/api/search` | 키워드 검색 결과 및 추천 점수 제공 |
| `AnalysisRenderer` | 분석 결과 마크다운 렌더링 컴포넌트 |
| `AnalysisCard` | 컨테이너 컴포넌트 (제목, 복사 기능 포함) |

### 리팩토링된 프론트엔드 구조
분석 결과를 표시하는 컴포넌트 개선:
```jsx
<AnalysisCard analysisText={analysisText} />
  ↓
<AnalysisRenderer 
  analysisText={analysisText} 
  maxHeight="350px"
  className="custom-styles"
/>
```

---

## 🧪 테스트 전략
- 템플릿 기반 → 단위 테스트 (문장 포함 여부, 숫자 포맷 확인)
- GPT 기반 → 프롬프트 리턴 구조 비교 테스트 (텍스트 길이, 구성 체크)
- 카테고리 분류 테스트 → `categorizeKeyword` 함수의 정확도 확인

---

## 🔄 유지보수 전략
- 모듈화된 구조로 템플릿 추가/수정 용이
- 카테고리별 템플릿을 독립적으로 관리하여 확장성 확보
- 토큰 최적화 및 결과 캐싱 고려 (향후 LLM 기반 확장 시)

---

## 📌 관련 문서
- [Refactoring 문서] → 템플릿 코드 분리 기준 정의
- [API 명세서] → `/api/analyze` 구조 참고
- [UI/UX 문서] → 분석 텍스트 렌더링 위치
- [Cursor Rules 문서] → 분석 생성 규칙 유지 필요

---

> 이 문서는 KeywordPulse에서 사용되는 RAG 시스템의 전체 흐름과 템플릿 및 확장 가능성, 구현 방식에 대해 기술한 핵심 아키텍처 문서입니다. 2023.05.12 업데이트 내용 포함.

