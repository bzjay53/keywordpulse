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
// 기본 메타데이터
export var defaultMetadata = {
    title: 'KeywordPulse - 실시간 키워드 분석 도구',
    description: '마케터와 콘텐츠 제작자를 위한 실시간 키워드 분석 및 추천 플랫폼',
    keywords: ['키워드 분석', '네이버 키워드', '마케팅 도구', 'Google Sheets', 'RAG 텍스트 분석'],
    authors: [{ name: 'KeywordPulse Team' }],
    robots: 'index, follow',
    metadataBase: new URL('https://keywordpulse.vercel.app'),
    openGraph: {
        title: 'KeywordPulse 키워드 분석',
        description: '최신 트렌드 기반 키워드 추천 및 자연어 분석 플랫폼',
        siteName: 'KeywordPulse',
        images: [
            {
                url: '/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'KeywordPulse 오픈그래프 이미지',
            },
        ],
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KeywordPulse 실시간 키워드 분석',
        description: 'RAG 기반 텍스트 분석과 네이버 키워드 트렌드를 한눈에.',
        images: ['/images/og-image.png'],
    },
};
// 앱 내 다른 페이지의 메타데이터 생성 함수
export function createMetadata(_a) {
    var title = _a.title, description = _a.description, path = _a.path, ogImagePath = _a.ogImagePath;
    var baseTitle = 'KeywordPulse';
    var finalTitle = title ? "".concat(title, " | ").concat(baseTitle) : defaultMetadata.title;
    var finalDesc = description || defaultMetadata.description;
    var ogImage = ogImagePath || '/images/og-image.png';
    var url = path ? "https://keywordpulse.vercel.app".concat(path) : 'https://keywordpulse.vercel.app';
    var ogConfig = defaultMetadata.openGraph ? __assign({}, defaultMetadata.openGraph) : {};
    var twitterConfig = defaultMetadata.twitter ? __assign({}, defaultMetadata.twitter) : {};
    return __assign(__assign({}, defaultMetadata), { title: finalTitle, description: finalDesc, alternates: {
            canonical: url,
        }, openGraph: __assign(__assign({}, ogConfig), { title: finalTitle, description: finalDesc, url: url, images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: "".concat(finalTitle, " \uC774\uBBF8\uC9C0"),
                },
            ] }), twitter: __assign(__assign({}, twitterConfig), { title: finalTitle, description: finalDesc, images: [ogImage] }) });
}
