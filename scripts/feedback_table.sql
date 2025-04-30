-- Supabase에서 피드백 데이터를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  browser_info TEXT,
  platform TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'ignored')),
  tags TEXT[],
  assigned_to TEXT,
  response TEXT,
  response_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 테이블이 업데이트될 때 트리거 설정
DROP TRIGGER IF EXISTS update_feedback_modtime ON feedback;
CREATE TRIGGER update_feedback_modtime
BEFORE UPDATE ON feedback
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- RLS 정책 설정
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 피드백을 제출할 수 있음
CREATE POLICY "Anyone can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- 인증된 사용자는 자신의 피드백을 볼 수 있음
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

-- 관리자만 모든 피드백을 볼 수 있음
CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 관리자만 피드백을 업데이트할 수 있음
CREATE POLICY "Admins can update feedback" ON feedback
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS feedback_rating_idx ON feedback(rating);
CREATE INDEX IF NOT EXISTS feedback_status_idx ON feedback(status);
CREATE INDEX IF NOT EXISTS feedback_timestamp_idx ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);

-- 피드백 상태 변경 기록을 위한 테이블
CREATE TABLE IF NOT EXISTS feedback_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id UUID REFERENCES feedback(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 피드백 상태 변경 트리거
CREATE OR REPLACE FUNCTION track_feedback_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO feedback_status_history
      (feedback_id, old_status, new_status, changed_by)
    VALUES
      (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_feedback_status ON feedback;
CREATE TRIGGER track_feedback_status
AFTER UPDATE ON feedback
FOR EACH ROW
EXECUTE PROCEDURE track_feedback_status_changes(); 