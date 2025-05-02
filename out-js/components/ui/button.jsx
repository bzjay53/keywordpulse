var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
var Button = React.forwardRef(function (_a, ref) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.isLoading, isLoading = _d === void 0 ? false : _d, _e = _a.fullWidth, fullWidth = _e === void 0 ? false : _e, _f = _a.className, className = _f === void 0 ? '' : _f, disabled = _a.disabled, props = __rest(_a, ["children", "variant", "size", "isLoading", "fullWidth", "className", "disabled"]);
    var baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    var variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        link: 'bg-transparent text-blue-600 hover:underline focus:ring-blue-500 p-0',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };
    var sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };
    var loadingStyles = isLoading ? 'opacity-70 cursor-not-allowed' : '';
    var widthStyles = fullWidth ? 'w-full' : '';
    var classes = "".concat(baseStyles, " ").concat(variantStyles[variant], " ").concat(variant !== 'link' ? sizeStyles[size] : '', " ").concat(loadingStyles, " ").concat(widthStyles, " ").concat(className);
    return (<button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading && (<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>)}
        {children}
      </button>);
});
Button.displayName = 'Button';
export { Button };
