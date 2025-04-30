import * as Sentry from '@sentry/nextjs';
var SENTRY_DSN = process.env.SENTRY_DSN || '';
// Sentry 초기화 환경 변수가 있을 때만 수행
if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV,
        // 성능 모니터링 설정
        tracesSampleRate: 0.5,
        // 세션 재생 설정
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
}
export default Sentry;
