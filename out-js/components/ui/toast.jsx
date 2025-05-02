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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useState } from 'react';
var ToastContext = React.createContext({
    showToast: function () { },
    hideToast: function () { },
});
export var useToast = function () { return React.useContext(ToastContext); };
var Toast = function (_a) {
    var message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b, _c = _a.duration, duration = _c === void 0 ? 3000 : _c, onClose = _a.onClose, _d = _a.position, position = _d === void 0 ? 'bottom-right' : _d;
    var _e = useState(true), visible = _e[0], setVisible = _e[1];
    var positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };
    var typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };
    useEffect(function () {
        var timer = setTimeout(function () {
            setVisible(false);
            if (onClose)
                onClose();
        }, duration);
        return function () { return clearTimeout(timer); };
    }, [duration, onClose]);
    return visible ? (<div className={"fixed ".concat(positionClasses[position], " p-4 rounded-md text-white shadow-lg transition-opacity duration-500 ").concat(typeClasses[type], " z-50")} role="alert">
      <div className="flex items-center">
        <div className="mr-3">
          {type === 'success' && (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>)}
          {type === 'error' && (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>)}
          {type === 'warning' && (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>)}
          {type === 'info' && (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>)}
        </div>
        <div className="ml-2">{message}</div>
        <button type="button" className="ml-auto bg-transparent text-sm text-white" onClick={function () {
            setVisible(false);
            if (onClose)
                onClose();
        }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>) : null;
};
export var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = useState([]), toasts = _b[0], setToasts = _b[1];
    var showToast = function (props) {
        var id = Date.now().toString();
        setToasts(function (prevToasts) { return __spreadArray(__spreadArray([], prevToasts, true), [__assign(__assign({}, props), { id: id })], false); });
        if (props.duration !== Infinity) {
            setTimeout(function () {
                hideToast(id);
            }, props.duration || 3000);
        }
    };
    var hideToast = function (id) {
        if (id) {
            setToasts(function (prevToasts) { return prevToasts.filter(function (toast) { return toast.id !== id; }); });
        }
        else {
            setToasts([]);
        }
    };
    return (<ToastContext.Provider value={{ showToast: showToast, hideToast: hideToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(function (toast) { return (<Toast key={toast.id} {...toast} onClose={function () { return hideToast(toast.id); }}/>); })}
      </div>
    </ToastContext.Provider>);
};
export { Toast };
