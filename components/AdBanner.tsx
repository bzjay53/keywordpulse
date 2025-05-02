import React from 'react';
import Link from 'next/link';

interface AdBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  position?: 'top' | 'inline' | 'bottom';
  type?: 'primary' | 'secondary' | 'feature';
}

/**
 * 광고 배너 컴포넌트
 * 페이지 내 다양한 위치에 프로모션 내용을 표시합니다.
 */
const AdBanner: React.FC<AdBannerProps> = ({
  title = '프리미엄 기능 이용하기',
  description = '더 많은 분석과 인사이트를 원하시나요? 프리미엄 기능을 이용해보세요.',
  ctaText = '자세히 알아보기',
  ctaLink = '/pricing',
  position = 'inline',
  type = 'primary'
}) => {
  // 위치에 따른 스타일
  const positionClasses = {
    top: 'mb-6 w-full',
    inline: 'my-6 w-full',
    bottom: 'mt-6 w-full'
  };

  // 타입에 따른 스타일
  const typeClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    feature: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
  };

  return (
    <div className={`rounded-lg p-4 ${positionClasses[position]} ${typeClasses[type]}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className={`mt-1 text-sm ${type === 'secondary' ? 'text-gray-600' : 'text-white/90'}`}>
            {description}
          </p>
        </div>
        <Link
          href={ctaLink}
          className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors ${
            type === 'secondary'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-blue-600 hover:bg-gray-100'
          }`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
};

export default AdBanner; 