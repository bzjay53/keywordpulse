import React, { useState } from 'react';
export var StarRating = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.max, max = _b === void 0 ? 5 : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d;
    var _e = useState(0), hoverValue = _e[0], setHoverValue = _e[1];
    // 별 크기 설정
    var getSizeClass = function () {
        switch (size) {
            case 'small': return 'star-small';
            case 'large': return 'star-large';
            default: return 'star-medium';
        }
    };
    // 별 색상 결정 (선택, 호버, 기본)
    var getStarClass = function (index) {
        var baseClass = 'star';
        var sizeClass = getSizeClass();
        if (disabled) {
            return "".concat(baseClass, " ").concat(sizeClass, " ").concat(index <= value ? 'star-filled' : 'star-empty', " star-disabled");
        }
        if (hoverValue >= index) {
            return "".concat(baseClass, " ").concat(sizeClass, " star-hover");
        }
        if (value >= index) {
            return "".concat(baseClass, " ").concat(sizeClass, " star-filled");
        }
        return "".concat(baseClass, " ").concat(sizeClass, " star-empty");
    };
    // 클릭 핸들러
    var handleClick = function (rating) {
        if (disabled)
            return;
        // 같은 별 클릭 시 취소 가능
        if (rating === value) {
            onChange(0);
        }
        else {
            onChange(rating);
        }
    };
    // 호버 핸들러
    var handleMouseEnter = function (rating) {
        if (disabled)
            return;
        setHoverValue(rating);
    };
    // 호버 종료 핸들러
    var handleMouseLeave = function () {
        if (disabled)
            return;
        setHoverValue(0);
    };
    // 평점 텍스트
    var getRatingText = function (rating) {
        if (rating === 0)
            return '';
        var texts = ['나쁨', '별로', '보통', '좋음', '훌륭함'];
        return texts[Math.min(rating - 1, texts.length - 1)];
    };
    // 별 렌더링
    var renderStars = function () {
        var stars = [];
        var _loop_1 = function (i) {
            stars.push(<span key={i} className={getStarClass(i)} onClick={function () { return handleClick(i); }} onMouseEnter={function () { return handleMouseEnter(i); }} onMouseLeave={handleMouseLeave} role="button" aria-label={"".concat(i, "\uC810 \uD3C9\uAC00")} tabIndex={disabled ? -1 : 0}>
          ★
        </span>);
        };
        for (var i = 1; i <= max; i++) {
            _loop_1(i);
        }
        return stars;
    };
    return (<div className="star-rating-container">
      <div className="star-rating">
        {renderStars()}
      </div>
      <div className="star-rating-text">
        {(hoverValue > 0 || value > 0) && (<span>{getRatingText(hoverValue > 0 ? hoverValue : value)}</span>)}
      </div>
    </div>);
};
