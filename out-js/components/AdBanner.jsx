import React from 'react';
import Link from 'next/link';
/**
 * 광고 배너 컴포넌트
 * 페이지 내 다양한 위치에 프로모션 내용을 표시합니다.
 */
var AdBanner = function (_a) {
    var _b = _a.title, title = _b === void 0 ? '프리미엄 기능 이용하기' : _b, _c = _a.description, description = _c === void 0 ? '더 많은 분석과 인사이트를 원하시나요? 프리미엄 기능을 이용해보세요.' : _c, _d = _a.ctaText, ctaText = _d === void 0 ? '자세히 알아보기' : _d, _e = _a.ctaLink, ctaLink = _e === void 0 ? '/pricing' : _e, _f = _a.position, position = _f === void 0 ? 'inline' : _f, _g = _a.type, type = _g === void 0 ? 'primary' : _g;
    // 위치에 따른 스타일
    var positionClasses = {
        top: 'mb-6 w-full',
        inline: 'my-6 w-full',
        bottom: 'mt-6 w-full'
    };
    // 타입에 따른 스타일
    var typeClasses = {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-100 text-gray-900',
        feature: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
    };
    return (<div className={"rounded-lg p-4 ".concat(positionClasses[position], " ").concat(typeClasses[type])}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className={"mt-1 text-sm ".concat(type === 'secondary' ? 'text-gray-600' : 'text-white/90')}>
            {description}
          </p>
        </div>
        <Link href={ctaLink} className={"inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors ".concat(type === 'secondary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-blue-600 hover:bg-gray-100')}>
          {ctaText}
        </Link>
      </div>
    </div>);
};
export default AdBanner;
