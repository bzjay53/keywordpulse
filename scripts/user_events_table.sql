-- 사용자 행동 이벤트를 저장하는 테이블 생성
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  category TEXT,
  action TEXT,
  label TEXT,
  value NUMERIC,
  path TEXT,
  referrer TEXT,
  duration NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 조회 성능 향상을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS user_events_event_type_idx ON user_events(event_type);
CREATE INDEX IF NOT EXISTS user_events_timestamp_idx ON user_events(timestamp);
CREATE INDEX IF NOT EXISTS user_events_user_id_idx ON user_events(user_id);
CREATE INDEX IF NOT EXISTS user_events_session_id_idx ON user_events(session_id);
CREATE INDEX IF NOT EXISTS user_events_path_idx ON user_events(path);
CREATE INDEX IF NOT EXISTS user_events_category_action_idx ON user_events(category, action);

-- RLS 정책 설정
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 이벤트를 생성할 수 있음
CREATE POLICY "Anyone can insert events" ON user_events
  FOR INSERT WITH CHECK (true);

-- 관리자만 이벤트를 조회할 수 있음
CREATE POLICY "Admins can view all events" ON user_events
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 자동 정리 기능 (3개월 이상 된 데이터 삭제)
CREATE OR REPLACE FUNCTION cleanup_old_events()
RETURNS void AS $$
BEGIN
  DELETE FROM user_events
  WHERE timestamp < NOW() - INTERVAL '3 months';
END;
$$ LANGUAGE plpgsql;

-- 통계 뷰 생성: 일별 페이지 방문수
CREATE OR REPLACE VIEW daily_page_views AS
SELECT
  DATE_TRUNC('day', timestamp) AS day,
  path,
  COUNT(*) AS view_count
FROM user_events
WHERE event_type = 'page_view'
GROUP BY DATE_TRUNC('day', timestamp), path
ORDER BY day DESC, view_count DESC;

-- 통계 뷰 생성: 세션별 페이지 체류 시간
CREATE OR REPLACE VIEW session_page_duration AS
SELECT
  session_id,
  path,
  AVG(duration) AS avg_duration,
  MAX(duration) AS max_duration,
  SUM(duration) AS total_duration,
  COUNT(*) AS timing_event_count
FROM user_events
WHERE event_type = 'timing' AND action = 'total_time_on_page'
GROUP BY session_id, path
ORDER BY total_duration DESC;

-- 통계 뷰 생성: 기능 사용 빈도
CREATE OR REPLACE VIEW feature_usage_stats AS
SELECT
  category AS feature,
  action,
  COUNT(*) AS usage_count,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(DISTINCT user_id) AS unique_users,
  DATE_TRUNC('week', timestamp) AS week
FROM user_events
WHERE event_type = 'feature_usage'
GROUP BY feature, action, week
ORDER BY week DESC, usage_count DESC; 