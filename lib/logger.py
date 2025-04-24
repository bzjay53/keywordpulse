"""
KeywordPulse 로깅 시스템

구조화된 로깅, 로그 레벨 관리, 포맷팅 등 시스템 전반의 로깅 기능을 제공합니다.
"""
import os
import json
import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional, Union

# 로그 레벨 설정
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
LOG_FILE = os.environ.get("LOG_FILE", "logs/keywordpulse.log")
ENABLE_CONSOLE_LOGS = os.environ.get("ENABLE_CONSOLE_LOGS", "TRUE").upper() == "TRUE"

# 로그 디렉토리 생성
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

class JSONFormatter(logging.Formatter):
    """JSON 형식의 로그 포맷터"""
    
    def format(self, record: logging.LogRecord) -> str:
        """로그 레코드를 JSON 형식으로 변환"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "message": record.getMessage(),
        }
        
        # 예외 정보가 있는 경우 추가
        if record.exc_info:
            log_data["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
                "traceback": traceback.format_exception(*record.exc_info)
            }
        
        # 추가 컨텍스트 정보가 있는 경우 추가
        if hasattr(record, "context") and record.context:
            log_data["context"] = record.context
        
        return json.dumps(log_data)

class ContextLogger(logging.Logger):
    """컨텍스트 정보를 포함한 로거"""
    
    def _log_with_context(self, level: int, msg: str, context: Optional[Dict[str, Any]] = None, 
                          exc_info: Optional[Any] = None, stacklevel: int = 1, **kwargs) -> None:
        """컨텍스트 정보를 포함하여 로깅"""
        if context:
            extra = kwargs.get("extra", {})
            extra["context"] = context
            kwargs["extra"] = extra
        
        self.log(level, msg, exc_info=exc_info, stacklevel=stacklevel+1, **kwargs)
    
    def debug(self, msg: str, context: Optional[Dict[str, Any]] = None, **kwargs) -> None:
        """DEBUG 레벨 로깅"""
        self._log_with_context(logging.DEBUG, msg, context, stacklevel=2, **kwargs)
    
    def info(self, msg: str, context: Optional[Dict[str, Any]] = None, **kwargs) -> None:
        """INFO 레벨 로깅"""
        self._log_with_context(logging.INFO, msg, context, stacklevel=2, **kwargs)
    
    def warning(self, msg: str, context: Optional[Dict[str, Any]] = None, **kwargs) -> None:
        """WARNING 레벨 로깅"""
        self._log_with_context(logging.WARNING, msg, context, stacklevel=2, **kwargs)
    
    def error(self, msg: str, context: Optional[Dict[str, Any]] = None, error: Optional[Exception] = None, **kwargs) -> None:
        """ERROR 레벨 로깅"""
        self._log_with_context(logging.ERROR, msg, context, exc_info=error, stacklevel=2, **kwargs)
    
    def critical(self, msg: str, context: Optional[Dict[str, Any]] = None, error: Optional[Exception] = None, **kwargs) -> None:
        """CRITICAL 레벨 로깅"""
        self._log_with_context(logging.CRITICAL, msg, context, exc_info=error, stacklevel=2, **kwargs)
    
    def log_dict(self, level: int, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None, **kwargs) -> None:
        """사전 형태의 데이터를 로깅"""
        msg = json.dumps(data)
        self._log_with_context(level, msg, context, stacklevel=2, **kwargs)

# 로깅 설정
def setup_logging() -> None:
    """로깅 시스템 초기화"""
    # 커스텀 로거 등록
    logging.setLoggerClass(ContextLogger)
    
    # 루트 로거 설정
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, LOG_LEVEL))
    
    # 핸들러 설정
    handlers = []
    
    # 파일 핸들러
    file_handler = logging.FileHandler(LOG_FILE)
    file_handler.setFormatter(JSONFormatter())
    handlers.append(file_handler)
    
    # 콘솔 핸들러 (선택적)
    if ENABLE_CONSOLE_LOGS:
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(JSONFormatter())
        handlers.append(console_handler)
    
    # 핸들러 적용
    for handler in handlers:
        root_logger.addHandler(handler)

# 애플리케이션 시작 시 로깅 설정
setup_logging()

def get_logger(name: str) -> ContextLogger:
    """지정된 이름으로 로거 인스턴스 반환"""
    return logging.getLogger(name)

# API 호출 로깅을 위한 미들웨어 함수
async def log_api_request(request: Any, call_next: Any) -> Any:
    """API 요청 로깅 미들웨어"""
    logger = get_logger("api.middleware")
    
    # 요청 시작 시간
    start_time = datetime.utcnow()
    
    # 요청 정보 로깅
    logger.info(
        f"API 요청 시작: {request.method} {request.url.path}",
        context={
            "request_id": request.headers.get("X-Request-ID", "unknown"),
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("User-Agent", "unknown")
        }
    )
    
    try:
        # 다음 미들웨어 또는 엔드포인트 실행
        response = await call_next(request)
        
        # 요청 처리 시간
        processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        # 응답 정보 로깅
        logger.info(
            f"API 요청 완료: {request.method} {request.url.path} - {response.status_code}",
            context={
                "request_id": request.headers.get("X-Request-ID", "unknown"),
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "processing_time_ms": processing_time
            }
        )
        
        return response
    except Exception as e:
        # 예외 발생 시 로깅
        logger.error(
            f"API 요청 처리 오류: {request.method} {request.url.path}",
            context={
                "request_id": request.headers.get("X-Request-ID", "unknown"),
                "method": request.method,
                "path": request.url.path
            },
            error=e
        )
        # 예외 재발생
        raise 