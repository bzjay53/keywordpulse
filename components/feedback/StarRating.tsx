import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'medium',
  disabled = false
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  // 별 크기 설정
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'star-small';
      case 'large': return 'star-large';
      default: return 'star-medium';
    }
  };
  
  // 별 색상 결정 (선택, 호버, 기본)
  const getStarClass = (index: number) => {
    const baseClass = 'star';
    const sizeClass = getSizeClass();
    
    if (disabled) {
      return `${baseClass} ${sizeClass} ${index <= value ? 'star-filled' : 'star-empty'} star-disabled`;
    }
    
    if (hoverValue >= index) {
      return `${baseClass} ${sizeClass} star-hover`;
    }
    
    if (value >= index) {
      return `${baseClass} ${sizeClass} star-filled`;
    }
    
    return `${baseClass} ${sizeClass} star-empty`;
  };
  
  // 클릭 핸들러
  const handleClick = (rating: number) => {
    if (disabled) return;
    
    // 같은 별 클릭 시 취소 가능
    if (rating === value) {
      onChange(0);
    } else {
      onChange(rating);
    }
  };
  
  // 호버 핸들러
  const handleMouseEnter = (rating: number) => {
    if (disabled) return;
    setHoverValue(rating);
  };
  
  // 호버 종료 핸들러
  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverValue(0);
  };
  
  // 평점 텍스트
  const getRatingText = (rating: number) => {
    if (rating === 0) return '';
    
    const texts = ['나쁨', '별로', '보통', '좋음', '훌륭함'];
    return texts[Math.min(rating - 1, texts.length - 1)];
  };
  
  // 별 렌더링
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= max; i++) {
      stars.push(
        <span
          key={i}
          className={getStarClass(i)}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label={`${i}점 평가`}
          tabIndex={disabled ? -1 : 0}
        >
          ★
        </span>
      );
    }
    
    return stars;
  };
  
  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {renderStars()}
      </div>
      <div className="star-rating-text">
        {(hoverValue > 0 || value > 0) && (
          <span>{getRatingText(hoverValue > 0 ? hoverValue : value)}</span>
        )}
      </div>
    </div>
  );
}; 