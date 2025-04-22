'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 에러 발생 시 상태 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 정보를 Sentry에 보고
    Sentry.captureException(error, { extra: { errorInfo } });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 에러 발생 시 대체 UI 표시
      return this.props.fallback || (
        <div className="p-6 rounded-lg bg-red-50 border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">오류가 발생했습니다</h2>
          <p className="text-red-600 mb-4">
            죄송합니다. 문제가 발생했습니다. 개발팀에 문제가 보고되었습니다.
          </p>
          <div className="bg-white p-2 rounded border border-red-200 text-red-600 text-sm font-mono overflow-auto max-h-48">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 