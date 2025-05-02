/**
 * 애플리케이션 로깅 시스템
 */
var isSentryInitialized = false;
// 프로덕션 환경에서 Sentry 초기화
function initSentry() {
    // Sentry 통합 여부 확인 (환경 변수 또는 전역 변수로 제어 가능)
    var enableSentry = typeof window !== 'undefined' &&
        (window === null || window === void 0 ? void 0 : window.__ENABLE_SENTRY__) ||
        process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true';
    if (enableSentry && !isSentryInitialized) {
        try {
            // Note: 여기서는 실제 Sentry 초기화를 하지 않습니다.
            // 실제 구현에서는 Sentry를 초기화하는 코드가 들어갑니다.
            isSentryInitialized = true;
        }
        catch (error) {
            console.error('Sentry 초기화 실패:', error);
        }
    }
}
/**
 * 로그 메시지를 기록합니다.
 * @param params 로그 매개변수
 */
function log(params) {
    var message = params.message, _a = params.level, level = _a === void 0 ? 'info' : _a, context = params.context, user = params.user, tags = params.tags;
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
        var logMethod = level === 'error' ? console.error :
            level === 'warn' ? console.warn :
                level === 'debug' ? console.debug :
                    console.log;
        logMethod("[".concat(level.toUpperCase(), "] ").concat(message), {
            context: context,
            user: user,
            tags: tags,
            timestamp: new Date().toISOString()
        });
    }
    // 프로덕션 환경에서는 Sentry 또는 다른 로깅 서비스로 전송 가능
    if (process.env.NODE_ENV === 'production') {
        // Sentry 초기화
        initSentry();
        // 여기에 프로덕션 로깅 로직을 구현
        // 예: Sentry 이벤트 전송, 서버 로그 API 호출 등
    }
}
/**
 * 정보 수준의 로그를 기록합니다.
 * @param message 로그 메시지
 * @param context 추가 컨텍스트 정보
 */
function info(message, context) {
    log({
        message: message,
        level: 'info',
        context: context
    });
}
/**
 * 경고 수준의 로그를 기록합니다.
 * @param message 로그 메시지
 * @param context 추가 컨텍스트 정보
 */
function warn(message, context) {
    log({
        message: message,
        level: 'warn',
        context: context
    });
}
/**
 * 디버그 수준의 로그를 기록합니다.
 * @param message 로그 메시지
 * @param context 추가 컨텍스트 정보
 */
function debug(message, context) {
    log({
        message: message,
        level: 'debug',
        context: context
    });
}
/**
 * 오류를 기록합니다.
 * @param params 오류 로그 매개변수
 */
function error(params) {
    var message = params.message, err = params.error, context = params.context, user = params.user, tags = params.tags;
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
        console.error("[ERROR] ".concat(message), {
            error: err,
            stack: err === null || err === void 0 ? void 0 : err.stack,
            context: context,
            user: user,
            tags: tags,
            timestamp: new Date().toISOString()
        });
    }
    // 프로덕션 환경에서는 Sentry로 전송
    if (process.env.NODE_ENV === 'production') {
        // Sentry 초기화
        initSentry();
        // 여기에 프로덕션 오류 로깅 로직을 구현
        // 예: Sentry captureException 호출
    }
}
/**
 * 성능 측정을 위한 트랜잭션을 시작합니다.
 * @param name 트랜잭션 이름
 * @param op 작업 타입
 * @returns 트랜잭션 객체
 */
function startTransaction(name, op) {
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
        console.log("[TRANSACTION] \uC2DC\uC791: ".concat(name, " (").concat(op, ")"));
        // 간단한 트랜잭션 객체 반환
        return {
            finish: function () {
                console.log("[TRANSACTION] \uC885\uB8CC: ".concat(name, " (").concat(op, ")"));
            },
            setTag: function (key, value) {
                console.log("[TRANSACTION] \uD0DC\uADF8 \uC124\uC815: ".concat(key, "=").concat(value));
            }
        };
    }
    // 프로덕션 환경에서는 Sentry 트랜잭션 반환
    if (process.env.NODE_ENV === 'production') {
        // Sentry 초기화
        initSentry();
        // 간단한 더미 객체 반환 (실제 구현에서는 Sentry 트랜잭션 반환)
        return {
            finish: function () { },
            setTag: function (key, value) { }
        };
    }
    // 기본 더미 객체 반환
    return {
        finish: function () { },
        setTag: function (key, value) { }
    };
}
/**
 * 사용자 정보를 설정합니다.
 * @param user 사용자 정보
 */
function setUser(user) {
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
        console.log("[USER] \uC0AC\uC6A9\uC790 \uC124\uC815:", user);
    }
    // 프로덕션 환경에서는 Sentry 사용자 설정
    if (process.env.NODE_ENV === 'production') {
        // Sentry 초기화
        initSentry();
        // 여기에 프로덕션 사용자 설정 로직을 구현
        // 예: Sentry setUser 호출
    }
}
// 로거 객체 내보내기
var logger = {
    log: log,
    info: info,
    warn: warn,
    debug: debug,
    error: error,
    startTransaction: startTransaction,
    setUser: setUser
};
export default logger;
