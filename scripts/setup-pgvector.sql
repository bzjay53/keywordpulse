-- pgvector 확장 활성화 (Supabase에서 이미 설치되어 있지만 명시적으로 활성화)
CREATE EXTENSION IF NOT EXISTS vector;

-- 키워드 임베딩 테이블 생성
CREATE TABLE IF NOT EXISTS keyword_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- text-embedding-3-small은 1536 차원 벡터 사용
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 컨텐츠 내용에 대한 전체 텍스트 검색 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_keyword_embeddings_content_trgm 
ON keyword_embeddings USING gin (content gin_trgm_ops);

-- 메타데이터에 대한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_keyword_embeddings_metadata
ON keyword_embeddings USING gin (metadata);

-- 임베딩 벡터에 대한 HNSW 인덱스 생성 (근사 최근접 이웃 검색)
CREATE INDEX IF NOT EXISTS idx_keyword_embeddings_embedding
ON keyword_embeddings USING hnsw (embedding vector_cosine_ops);

-- 데모 데이터 삽입 (필요한 경우)
-- 임베딩 값은 실제 생성된 임베딩으로 대체해야 함
INSERT INTO keyword_embeddings (content, metadata, embedding) VALUES
(
  '인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.',
  '{"source": "AI 문서", "date": "2023-01-01", "category": "AI 기술"}',
  '[0.1, 0.2, 0.3, ...]'::vector
),
(
  '기계 학습은 AI의 하위 분야로, 데이터로부터 학습하는 알고리즘을 포함합니다.',
  '{"source": "ML 문서", "date": "2023-02-15", "category": "AI 기술"}',
  '[0.2, 0.3, 0.4, ...]'::vector
),
(
  '자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 AI 분야입니다.',
  '{"source": "NLP 문서", "date": "2023-03-20", "category": "AI 기술"}',
  '[0.3, 0.4, 0.5, ...]'::vector
);

-- 업데이트 트리거 생성 (updated_at 필드 자동 업데이트)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_keyword_embeddings_updated_at
BEFORE UPDATE ON keyword_embeddings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- RLS 정책 설정 (Row Level Security)
-- 모든 사용자가 벡터 데이터를 읽을 수 있음
ALTER TABLE keyword_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 사용자가 키워드 임베딩을 읽을 수 있음" ON keyword_embeddings
  FOR SELECT USING (true);

-- 인증된 사용자만 벡터 데이터를 삽입할 수 있음
CREATE POLICY "인증된 사용자만 키워드 임베딩을 삽입할 수 있음" ON keyword_embeddings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 자신이 생성한 벡터 데이터를 업데이트할 수 있음 (메타데이터에 user_id 필드 사용 시)
CREATE POLICY "인증된 사용자만 자신의 키워드 임베딩을 업데이트할 수 있음" ON keyword_embeddings
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    (metadata->>'user_id')::uuid = auth.uid()
  );

-- 인증된 사용자만 자신이 생성한 벡터 데이터를 삭제할 수 있음 (메타데이터에 user_id 필드 사용 시)
CREATE POLICY "인증된 사용자만 자신의 키워드 임베딩을 삭제할 수 있음" ON keyword_embeddings
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    (metadata->>'user_id')::uuid = auth.uid()
  );

-- 벡터 검색 함수 생성 (코사인 유사도 기반)
CREATE OR REPLACE FUNCTION search_keyword_embeddings(
  query_embedding VECTOR,
  similarity_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ke.id,
    ke.content,
    ke.metadata,
    1 - (ke.embedding <=> query_embedding) AS similarity
  FROM keyword_embeddings ke
  WHERE 1 - (ke.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$; 