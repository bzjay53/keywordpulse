import React, { useEffect, useState } from 'react';
// 광고 배너 컴포넌트
var AdBanner = function (_a) {
    var _b = _a.slot, slot = _b === void 0 ? '1234567890' : _b, _c = _a.format, format = _c === void 0 ? 'auto' : _c, _d = _a.responsive, responsive = _d === void 0 ? true : _d, _e = _a.className, className = _e === void 0 ? '' : _e;
    var _f = useState(false), adLoaded = _f[0], setAdLoaded = _f[1];
    var _g = useState(false), adError = _g[0], setAdError = _g[1];
    useEffect(function () {
        // 개발 환경인 경우 실제 광고를 로드하지 않음
        if (process.env.NODE_ENV === 'development') {
            var timer_1 = setTimeout(function () {
                setAdLoaded(true);
            }, 1000);
            return function () { return clearTimeout(timer_1); };
        }
        try {
            // AdSense 스크립트 삽입
            var script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.dataset.adClient = 'ca-pub-1234567890123456';
            document.head.appendChild(script);
            // 광고 로드 시도
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
        }
        catch (error) {
            console.error('광고 로드 중 오류:', error);
            setAdError(true);
        }
    }, []);
    if (adError) {
        return null; // 에러 발생 시 공간 차지하지 않음
    }
    return (<div className={"ad-container ".concat(className, " ").concat(!adLoaded ? 'min-h-[250px] bg-gray-100' : '')}>
      {process.env.NODE_ENV === 'development' ? (
        // 개발 환경에서는 플레이스홀더 표시
        <div className="w-full h-full min-h-[250px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm border border-gray-200">
          <span>광고 영역 - 프로덕션 환경에서 실제 광고가 표시됩니다</span>
        </div>) : (
        // 프로덕션 환경에서 실제 광고 출력
        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-1234567890123456" data-ad-slot={slot} data-ad-format={format} data-full-width-responsive={responsive ? 'true' : 'false'}/>)}
    </div>);
};
export default AdBanner;
