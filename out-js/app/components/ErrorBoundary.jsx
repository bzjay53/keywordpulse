'use client';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from 'react';
import * as Sentry from '@sentry/nextjs';
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        // 에러 발생 시 상태 업데이트
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // 에러 정보를 Sentry에 보고
        Sentry.captureException(error, { extra: { errorInfo: errorInfo } });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _this = this;
        var _a;
        if (this.state.hasError) {
            // 에러 발생 시 대체 UI 표시
            return this.props.fallback || (<div className="p-6 rounded-lg bg-red-50 border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">오류가 발생했습니다</h2>
          <p className="text-red-600 mb-4">
            죄송합니다. 문제가 발생했습니다. 개발팀에 문제가 보고되었습니다.
          </p>
          <div className="bg-white p-2 rounded border border-red-200 text-red-600 text-sm font-mono overflow-auto max-h-48">
            {(_a = this.state.error) === null || _a === void 0 ? void 0 : _a.toString()}
          </div>
          <button onClick={function () { return _this.setState({ hasError: false }); }} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            다시 시도
          </button>
        </div>);
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(Component));
export default ErrorBoundary;
