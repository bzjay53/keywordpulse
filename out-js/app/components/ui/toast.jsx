"use client";
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
import * as React from "react";
import { cn } from "../../lib/utils";
var ToastContext = React.createContext({
    toast: function () { return null; },
});
export function useToast() {
    var context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
export function ToastProvider(_a) {
    var children = _a.children;
    var _b = React.useState([]), toasts = _b[0], setToasts = _b[1];
    var toast = React.useCallback(function (props) {
        var id = String(Math.random());
        var newToast = __assign({ id: id }, props);
        setToasts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newToast], false); });
        if (props.duration !== 0) {
            setTimeout(function () {
                var _a;
                setToasts(function (prev) { return prev.filter(function (t) { return t.id !== id; }); });
                (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props);
            }, props.duration || 5000);
        }
    }, []);
    return (<ToastContext.Provider value={{ toast: toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map(function (t) { return (<div key={t.id} className={cn('p-4 rounded-md shadow-lg max-w-md transform transition-all', t.variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-white text-gray-900 border border-gray-200')}>
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
          </div>); })}
      </div>
    </ToastContext.Provider>);
}
