/**
 * 로깅 시스템
 *
 * 정적 빌드와 호환되는 간단한 로깅 유틸리티
 * 환경에 따라 콘솔 또는 Sentry로 로그를 전송합니다.
 */
// 환경에 따라 Sentry를 조건부로 가져오기
var Sentry = null;
if (typeof window !== 'undefined') {
    try {
        // 클라이언트 사이드에서만 Sentry 로드 시도
        Sentry = require('@sentry/nextjs');
    }
    catch (e) {
        console.warn('Sentry 로드 실패:', e);
    }
}
/**
 * 애플리케이션 로깅 유틸리티
 * Sentry 및 콘솔 로깅을 처리합니다.
 */
export var logger = {
    /**
     * 일반 정보 로깅
     */
    log: function (_a) {
        var message = _a.message, _b = _a.level, level = _b === void 0 ? 'info' : _b, context = _a.context, user = _a.user, tags = _a.tags;
        // 콘솔 로깅
        console[level](message, context);
        // Sentry로 이벤트 전송 (info 레벨 이상, Sentry가 로드된 경우에만)
        if (level !== 'debug' && Sentry) {
            var sentryLevel_1 = level === 'warn' ? 'warning' : level;
            try {
                Sentry.withScope(function (scope) {
                    if (context)
                        scope.setExtras(context);
                    if (user)
                        scope.setUser(user);
                    if (tags)
                        Object.entries(tags).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            return scope.setTag(key, value);
                        });
                    Sentry.captureMessage(message, sentryLevel_1);
                });
            }
            catch (e) {
                console.error('Sentry 이벤트 캡처 실패:', e);
            }
        }
    },
    /**
     * 에러 로깅
     */
    error: function (_a) {
        var message = _a.message, error = _a.error, context = _a.context, user = _a.user, tags = _a.tags;
        // 콘솔 에러 로깅
        console.error(message, error, context);
        // Sentry로 예외 전송 (Sentry가 로드된 경우에만)
        if (Sentry) {
            try {
                Sentry.withScope(function (scope) {
                    if (context)
                        scope.setExtras(context);
                    if (user)
                        scope.setUser(user);
                    if (tags)
                        Object.entries(tags).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            return scope.setTag(key, value);
                        });
                    if (error) {
                        Sentry.captureException(error);
                    }
                    else {
                        Sentry.captureMessage(message, 'error');
                    }
                });
            }
            catch (e) {
                console.error('Sentry 에러 캡처 실패:', e);
            }
        }
    },
    /**
     * 성능 모니터링 트랜잭션 시작
     */
    startTransaction: function (name, op) {
        if (Sentry) {
            try {
                return Sentry.startTransaction({
                    name: name,
                    op: op,
                });
            }
            catch (e) {
                console.error('Sentry 트랜잭션 시작 실패:', e);
            }
        }
        return undefined;
    },
    /**
     * 사용자 정보 설정
     */
    setUser: function (user) {
        if (Sentry) {
            try {
                Sentry.setUser(user);
            }
            catch (e) {
                console.error('Sentry 사용자 설정 실패:', e);
            }
        }
    }
};
export default logger;
