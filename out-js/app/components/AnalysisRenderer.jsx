import React from 'react';
import ReactMarkdown from 'react-markdown';
/**
 * 마크다운 형식의 분석 텍스트를 렌더링하는 컴포넌트
 * 리팩토링: 스타일 개선, 접근성 속성 추가, 커스텀 클래스 지원
 */
var AnalysisRenderer = function (_a) {
    var analysisText = _a.analysisText, _b = _a.maxHeight, maxHeight = _b === void 0 ? '350px' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    if (!analysisText) {
        return (<div className="bg-gray-50 min-h-[100px] flex items-center justify-center text-gray-500" aria-label="분석 결과 없음">
        <p>표시할 분석 결과가 없습니다.</p>
      </div>);
    }
    // 스타일 클래스 병합
    var containerClasses = "prose prose-sm max-w-none overflow-y-auto text-gray-800 \n    prose-headings:text-primary-700 prose-headings:font-semibold\n    prose-h2:text-xl prose-h3:text-lg\n    prose-ul:my-2 prose-li:my-1\n    prose-strong:text-primary-600 \n    ".concat(className).trim();
    return (<div className={containerClasses} style={{ maxHeight: maxHeight }} aria-label="키워드 분석 결과">
      <ReactMarkdown>{analysisText}</ReactMarkdown>
    </div>);
};
export default AnalysisRenderer;
