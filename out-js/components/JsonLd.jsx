import React from 'react';
import Head from 'next/head';
/**
 * JSON-LD 구조화된 데이터를 페이지 헤드에 삽입하는 컴포넌트
 * SEO 최적화에 사용됩니다.
 */
var JsonLd = function (_a) {
    var data = _a.data;
    return (<Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}/>
    </Head>);
};
/**
 * 애플리케이션 정보에 대한 JSON-LD 데이터를 생성합니다.
 * @returns 애플리케이션 JSON-LD 데이터
 */
export function createAppJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'KeywordPulse',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'description': '실시간 키워드 분석 및 추천 플랫폼',
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.7',
            'ratingCount': '125'
        }
    };
}
/**
 * FAQ 정보에 대한 JSON-LD 데이터를 생성합니다.
 * @param items FAQ 항목 배열
 * @returns FAQ JSON-LD 데이터
 */
export function createFaqJsonLd(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': items.map(function (item) { return ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
            }
        }); })
    };
}
export default JsonLd;
