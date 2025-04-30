import * as Sentry from '@sentry/nextjs';
// 클라이언트와 서버 간의 일관성을 위해 SENTRY_DSN 환경 변수 사용
var SENTRY_DSN = process.env.SENTRY_DSN;
Sentry.init({
    dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
        new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
    environment: process.env.NODE_ENV,
});
