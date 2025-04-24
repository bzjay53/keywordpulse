# 🔍 KeywordPulse 모니터링 및 운영 가이드

이 문서는 KeywordPulse 서비스의 모니터링 시스템 구축, 로깅 전략, 그리고 운영 방안에 대해 설명합니다.

## 📊 모니터링 아키텍처

KeywordPulse는 다음과 같은 모니터링 아키텍처를 사용합니다:

```
구조화된 로그(JSON) → 로그 파일 → 로그 분석 도구 → 대시보드/알림
```

## 📝 로깅 시스템

### 핵심 컴포넌트

- **ContextLogger**: 컨텍스트 정보를 포함한 로깅을 위한 커스텀 로거
- **JSONFormatter**: 로그를 JSON 형식으로 변환하는 포맷터
- **로그 레벨**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **로그 저장소**: 파일 시스템 (logs 디렉토리)

### 구조화된 로그 형식

모든 로그는 다음 JSON 형식으로 저장됩니다:

```json
{
  "timestamp": "2023-06-20T15:45:32.125Z",
  "level": "INFO",
  "module": "rag_engine",
  "function": "generate_analysis_text",
  "line": 42,
  "message": "키워드 분석 텍스트 생성 완료",
  "context": {
    "keyword_count": 5,
    "top_keyword": "AI 마케팅",
    "high_score_count": 2,
    "processing_time_ms": 125.45
  }
}
```

### 로그 활용 방안

1. **성능 모니터링**: 처리 시간, API 응답 시간 추적
2. **오류 추적**: 예외 발생 및 오류 패턴 분석
3. **사용량 분석**: 키워드 분석 요청 수, 사용자 액션 추적
4. **병목 현상 감지**: 느린 응답 시간을 보이는 컴포넌트 식별

## 🔧 모니터링 설정

### 환경 변수

| 환경 변수 | 설명 | 기본값 |
|----------|------|--------|
| LOG_LEVEL | 로깅 레벨 설정 (DEBUG, INFO, WARNING, ERROR, CRITICAL) | INFO |
| LOG_FILE | 로그 파일 경로 | logs/keywordpulse.log |
| ENABLE_CONSOLE_LOGS | 콘솔 로깅 활성화 여부 | TRUE |

### 로깅 활성화

`lib/logger.py` 모듈이 시스템 전체의 로깅을 담당합니다:

```python
from lib.logger import get_logger

# 로거 인스턴스 가져오기
logger = get_logger("component_name")

# 로깅
logger.info("메시지", context={"key": "value"})
logger.error("오류 발생", context={"request_id": "123"}, error=exception)
```

## 📊 모니터링 대시보드 

### 주요 대시보드 지표

1. **API 성능 지표**
   - 요청 처리 시간 (평균, 95%, 99%)
   - 엔드포인트별 호출 빈도
   - 오류율

2. **RAG 엔진 지표**
   - 키워드 분석 생성 시간
   - 카테고리별 키워드 분류 분포
   - 캐시 히트율

3. **사용자 활동 지표**
   - 일일 활성 사용자 수
   - 키워드 분석 요청 횟수
   - 분석 결과 공유 빈도

### 대시보드 구현 방안

로깅 시스템과 통합하여 다음 도구 중 하나를 사용할 수 있습니다:

- **ELK 스택**: Elasticsearch, Logstash, Kibana
- **Grafana + Prometheus**: 메트릭 시각화
- **CloudWatch**: AWS 환경에서 사용 가능

## 🚨 알림 시스템

### 알림 트리거 조건

1. **심각한 오류 발생**: CRITICAL 레벨 로그 감지
2. **성능 저하**: API 응답 시간 임계값 초과
3. **리소스 부족**: 메모리, CPU 사용량 경고
4. **사용량 급증**: 단시간 내 요청 수 급증

### 알림 채널

- **이메일**: 시스템 관리자 알림
- **Slack**: 개발팀 채널 알림
- **SMS/모바일 푸시**: 긴급 상황 발생 시

## 🔄 운영 프로세스

### 주요 운영 작업

1. **정기 모니터링 검토**
   - 일간: 시스템 상태, 오류 로그 확인
   - 주간: 성능 추세, 사용량 패턴 분석
   - 월간: 시스템 최적화 방안 검토

2. **로그 순환 관리**
   - 로그 파일 압축 및 보관
   - 오래된 로그 자동 삭제 설정
   - 중요 로그 백업 전략

3. **장애 복구 절차**
   - 문제 감지 및 로그 분석
   - 영향 범위 평가
   - 해결 방안 적용 및 검증
   - 사후 분석 및 개선 사항 도출

## 🚀 다음 단계

1. **모니터링 대시보드 구축**: Grafana 또는 유사 도구를 사용한 대시보드 구현
2. **알림 시스템 연동**: 이메일 및 Slack 알림 설정
3. **로그 분석 자동화**: 패턴 감지 및 이상 탐지 시스템 구현
4. **성능 벤치마크 확립**: 기준 성능 측정 및 모니터링 임계값 설정

## 📚 참고 자료

- [로그 기반 모니터링 모범 사례](https://example.com/monitoring-best-practices)
- [Python 로깅 공식 문서](https://docs.python.org/3/library/logging.html)
- [ELK 스택 설정 가이드](https://www.elastic.co/guide/index.html)
- [Grafana 대시보드 튜토리얼](https://grafana.com/tutorials/) 