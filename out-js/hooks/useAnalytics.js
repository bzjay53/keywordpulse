var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import analytics, { EventType } from '@/lib/analytics';
/**
 * 페이지 및 구성요소에서 분석 이벤트를 캡처하기 위한 React 훅
 */
export function useAnalytics() {
    var router = useRouter();
    // 페이지 조회 이벤트 캡처
    useEffect(function () {
        // 페이지 로드 시 이벤트 기록
        var logInitialPageView = function () {
            analytics.logPageView();
        };
        // 라우트 변경 시 이벤트 기록
        var handleRouteChange = function (url) {
            analytics.logPageView(url);
        };
        // 페이지 체류 시간 추적 (컴포넌트가 언마운트될 때 정리됨)
        var stopTracking = analytics.trackTimeOnPage();
        // 초기 페이지 조회 기록
        logInitialPageView();
        // 라우트 변경 이벤트 구독
        router.events.on('routeChangeComplete', handleRouteChange);
        // 정리 함수
        return function () {
            router.events.off('routeChangeComplete', handleRouteChange);
            stopTracking();
        };
    }, [router]);
    // 클릭 이벤트 캡처 함수
    var trackClick = useCallback(function (elementId, category, metadata) {
        analytics.logButtonClick(elementId, category, metadata);
    }, []);
    // 기능 사용 이벤트 캡처 함수
    var trackFeature = useCallback(function (featureName, action, metadata) {
        analytics.logFeatureUsage(featureName, action, metadata);
    }, []);
    // 검색 이벤트 캡처 함수
    var trackSearch = useCallback(function (searchTerm, resultCount, metadata) {
        analytics.logSearch(searchTerm, resultCount, metadata);
    }, []);
    // 사용자 작업 시간 측정 함수
    var measureTask = useCallback(function (category, taskName, task, metadata) {
        return analytics.measureTiming(category, taskName, task, metadata);
    }, []);
    // 에러 이벤트 캡처 함수
    var trackError = useCallback(function (errorMessage, errorCode, metadata) {
        analytics.logError(errorMessage, errorCode, metadata);
    }, []);
    // 일반 이벤트 캡처 함수
    var trackEvent = useCallback(function (eventType, data) {
        analytics.logEvent(__assign({ eventType: eventType }, data));
    }, []);
    // 피드백 이벤트 캡처 함수
    var trackFeedback = useCallback(function (rating, feedback, metadata) {
        analytics.logEvent({
            eventType: EventType.FEEDBACK,
            value: rating,
            label: feedback,
            metadata: metadata
        });
    }, []);
    return {
        trackClick: trackClick,
        trackFeature: trackFeature,
        trackSearch: trackSearch,
        measureTask: measureTask,
        trackError: trackError,
        trackEvent: trackEvent,
        trackFeedback: trackFeedback
    };
}
