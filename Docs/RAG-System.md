# KeywordPulse RAG 시스템 문서

## 개요

KeywordPulse의 RAG(Retrieval-Augmented Generation) 시스템은 키워드 분석 및 검색 결과 생성을 위한 핵심 구성 요소입니다. 이 시스템은 사용자가 입력한 키워드에 대한 관련 정보를 검색하고, 이를 바탕으로 맥락에 맞는 분석 결과를 생성합니다.

## 아키텍처

![RAG 시스템 아키텍처](./diagrams/rag-architecture.png)

### 주요 구성 요소

1. **검색 엔진 (Retrieval Engine)**
   - 위치: `lib/rag_engine.ts`
   - 역할: 사용자 쿼리와 관련된 문서 또는 데이터를 검색
   - 핵심 기능: 임베딩 생성, 벡터 검색, 관련성 점수 계산

2. **생성 엔진 (Generation Engine)**
   - 위치: `lib/rag-integration.ts`
   - 역할: 검색된 정보를 바탕으로 자연어 응답 생성
   - 핵심 기능: 프롬프트 구성, 응답 생성, 후처리

3. **데이터 소스**
   - 외부 API: 트렌드 데이터 (`lib/trends_api.ts`)
   - 벡터 DB: Supabase pgvector를 활용한 키워드 관련 정보 저장소
   - 사용자 데이터: Supabase에 저장된 사용자별 검색 기록

4. **벡터 데이터베이스 (Vector Database)**
   - 구현: Supabase pgvector
   - 위치: `lib/supabaseClient.ts` (벡터 DB 관련 함수)
   - 테이블: `keyword_embeddings` (임베딩과 관련 콘텐츠 저장)
   - 핵심 기능: 벡터 저장, 유사도 기반 검색, 메타데이터 필터링

## 데이터 흐름

1. 사용자가 키워드를 입력
2. 키워드가 임베딩으로 변환됨
3. 임베딩을 사용하여 벡터 DB에서 관련 정보 검색
4. 검색된 정보를 바탕으로 프롬프트 구성
5. 생성 모델이 프롬프트를 기반으로 분석 결과 생성
6. 생성된 결과를 사용자에게 제공

## 벡터 데이터베이스 통합

### 데이터베이스 스키마

```sql
CREATE TABLE keyword_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- text-embedding-3-small의 차원 수
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 벡터 검색 함수 사용 예시

```typescript
// 벡터 검색 옵션
const searchOptions = {
  queryVector: await createEmbedding("인공지능"),
  limit: 5,
  threshold: 0.7,
  filter: {
    "metadata.category": "AI 기술"
  }
};

// Supabase 벡터 검색 실행
const results = await performVectorSearch(searchOptions);

// 결과 처리
if (results.success) {
  console.log(`검색 결과: ${results.results.length}개 항목 찾음`);
  results.results.forEach(item => {
    console.log(`- ${item.content} (유사도: ${item.score.toFixed(2)})`);
  });
}
```

### 벡터 저장 예시

```typescript
// 새 문서를 벡터 DB에 저장
const document = {
  content: "인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.",
  metadata: {
    source: "AI 기술 문서",
    category: "AI 기술",
    date: "2023-05-01"
  }
};

// 임베딩 생성 및 저장
const result = await addDocumentToVectorStore(
  document.content,
  document.metadata
);

if (result.success) {
  console.log(`문서가 성공적으로 저장됨: ${result.id}`);
} else {
  console.error(`문서 저장 실패: ${result.error}`);
}
```

## 코드 구조

### `rag_engine.ts`

```typescript
// 핵심 클래스 및 인터페이스
interface RagOptions {
  maxResults: number;
  threshold: number;
  includeMetadata: boolean;
  searchProvider: 'supabase' | 'elasticsearch' | 'pinecone' | 'hybrid';
  embeddingModel: string;
  useCache: boolean;
}

// 핵심 함수
async function createEmbedding(text: string, model: string, useCache: boolean): Promise<number[]> { ... }

async function ragSearch(query: string, options?: RagOptions): Promise<RagSearchResult> { ... }

async function hybridSearch(query: string, documents: RagDocument[], options?: RagOptions): Promise<RagSearchResult> { ... }

async function addDocumentToVectorStore(content: string, metadata?: Record<string, any>): Promise<{ success: boolean, id?: string, error?: string }> { ... }
```

### `supabaseClient.ts` (벡터 DB 관련 부분)

```typescript
// 벡터 검색 인터페이스
interface VectorSearchOptions {
  queryVector: number[];
  limit?: number;
  threshold?: number;
  filter?: Record<string, any>;
  sort?: 'similarity' | 'created_at' | 'id';
  sortDirection?: 'asc' | 'desc';
}

// 핵심 함수
async function storeVectorData(data: VectorData): Promise<{ success: boolean, id?: string, error?: string }> { ... }

async function performVectorSearch(options: VectorSearchOptions): Promise<{ success: boolean, results: any[], error?: string }> { ... }

async function getVectorDataById(id: string): Promise<{ success: boolean, data?: any, error?: string }> { ... }

async function updateVectorData(id: string, data: Partial<VectorData>): Promise<{ success: boolean, error?: string }> { ... }

async function deleteVectorData(id: string): Promise<{ success: boolean, error?: string }> { ... }
```

## 성능 지표

| 지표 | 이전 값 | 현재 값 | 목표 값 |
|------|---------|---------|---------|
| 평균 응답 시간 | 2.5초 | 1.8초 | <1초 |
| 검색 정확도 | 78% | 85% | >90% |
| 생성 품질 점수 | 7.2/10 | 8.0/10 | >8.5/10 |
| 벡터 검색 지연 시간 | N/A | 350ms | <200ms |

## 개선 계획

### 단기 개선 사항 (1-2주)

1. **임베딩 모델 업그레이드** ✓
   - 현재: OpenAI text-embedding-3-small 구현 완료
   - 다음 단계: 추가 수정 및 최적화

2. **검색 알고리즘 최적화** ✓
   - 현재: 하이브리드 검색(벡터 + BM25) 구현 완료
   - 다음 단계: 가중치 미세 조정 및 성능 측정

3. **캐싱 구현** ✓
   - 현재: 메모리 내 임베딩 캐싱 구현 완료
   - 다음 단계: 캐싱 성능 모니터링 및 TTL 최적화

4. **벡터 데이터베이스 통합** ✓
   - 현재: Supabase pgvector 통합 구현 완료
   - 다음 단계: 데이터베이스 인덱스 최적화 및 성능 테스트

### 중기 개선 사항 (1-2개월)

1. **데이터 소스 확장**
   - 현재: 제한된 외부 API
   - 목표: 다양한 트렌드 소스 통합
   - 작업: 추가 API 통합 개발

2. **맥락 처리 개선**
   - 현재: 단순한 컨텍스트 윈도우
   - 목표: 계층적 컨텍스트 처리
   - 작업: 컨텍스트 관리 로직 재설계

3. **개인화 기능**
   - 현재: 모든 사용자에게 동일한 결과
   - 목표: 사용자 검색 기록 기반 개인화
   - 작업: 사용자 프로필 및 히스토리 통합

4. **자동 벡터 DB 업데이트**
   - 현재: 수동 데이터 추가
   - 목표: 새로운 키워드 및 트렌드 자동 추가
   - 작업: 크롤링 및 주기적 업데이트 시스템 구축

### 장기 개선 사항 (3-6개월)

1. **멀티모달 통합**
   - 현재: 텍스트만 처리
   - 목표: 이미지 및 차트 데이터 포함
   - 작업: 멀티모달 모델 통합

2. **분산 처리 시스템**
   - 현재: 단일 서버 처리
   - 목표: 분산 처리로 확장성 향상
   - 작업: 작업 큐 및 워커 시스템 구현

3. **자체 모델 미세 조정**
   - 현재: 일반 API 모델 사용
   - 목표: 키워드 분석에 특화된 모델 개발
   - 작업: 데이터 수집 및 모델 미세 조정

## 모니터링 및 평가

### 모니터링 지표

- API 호출 횟수 및 지연 시간
- 토큰 사용량 및 비용
- 오류율 및 재시도 횟수
- 벡터 DB 쿼리 성능 및 캐시 적중률

### 평가 방법

- A/B 테스트: 새로운 알고리즘과 기존 알고리즘 비교
- 사용자 피드백 수집 및 분석
- 자동화된 품질 평가 스크립트

## 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs/introduction)
- [Supabase Vector 가이드](https://supabase.com/docs/guides/database/extensions/pgvector)
- [벡터 검색 최적화 기법](https://www.pinecone.io/learn/vector-search-optimization/)
- [RAG 아키텍처 설계 가이드](https://www.deeplearning.ai/blog/building-rag-applications/)

## 변경 이력

| 날짜 | 버전 | 설명 | 작성자 |
|------|------|------|--------|
| 2025-05-01 | 0.1 | 초기 문서 작성 | 개발팀 |
| 2025-05-15 | 0.2 | 개선 계획 업데이트 | 개발팀 |
| 2025-05-18 | 0.3 | 벡터 데이터베이스 통합 정보 추가 | 개발팀 | 