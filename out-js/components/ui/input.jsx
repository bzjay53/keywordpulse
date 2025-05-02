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
var Input = React.forwardRef(function (_a, ref) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, label = _a.label, error = _a.error, _c = _a.fullWidth, fullWidth = _c === void 0 ? false : _c, props = __rest(_a, ["className", "label", "error", "fullWidth"]);
    var baseStyles = 'border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500';
    var errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    var widthStyles = fullWidth ? 'w-full' : '';
    var classes = "".concat(baseStyles, " ").concat(errorStyles, " ").concat(widthStyles, " ").concat(className);
    return (<div className={fullWidth ? 'w-full' : ''}>
        {label && (<label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>)}
        <input ref={ref} className={classes} {...props}/>
        {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
      </div>);
});
Input.displayName = 'Input';
export { Input };
