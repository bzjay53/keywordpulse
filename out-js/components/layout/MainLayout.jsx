import React from 'react';
import Head from 'next/head';
import { FeedbackButton } from '@/components/feedback';
import { useFeedback } from '@/hooks/useFeedback';
import { useAnalytics } from '@/hooks/useAnalytics';
import '@/components/feedback/feedback.css';
export var MainLayout = function (_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? 'KeywordPulse' : _b, _c = _a.description, description = _c === void 0 ? '키워드 분석 및 트렌드 모니터링 솔루션' : _c;
    var submitFeedback = useFeedback({
        onSuccess: function () {
            console.log('피드백이 성공적으로 제출되었습니다.');
        },
        onError: function (error) {
            console.error('피드백 제출 중 오류 발생:', error.message);
        }
    }).submitFeedback;
    var analytics = useAnalytics();
    React.useEffect(function () {
        analytics.trackEvent('page_metadata', {
            title: title,
            description: description,
            canonical: window.location.href
        });
    }, [analytics, title, description]);
    return (<>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div className="main-layout">
        <main className="main-content">
          {children}
        </main>

        {/* 피드백 버튼 추가 */}
        <FeedbackButton onSubmit={submitFeedback} position="bottom-right" variant="icon" contextData={{
            pageTitle: title,
            pageUrl: typeof window !== 'undefined' ? window.location.href : ''
        }}/>
      </div>
    </>);
};
