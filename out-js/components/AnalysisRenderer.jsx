import React from 'react';
import ReactMarkdown from 'react-markdown';
/**
 * 마크다운 형식의 분석 텍스트를 렌더링하는 컴포넌트
 */
var AnalysisRenderer = function (_a) {
    var analysisText = _a.analysisText, _b = _a.maxHeight, maxHeight = _b === void 0 ? '350px' : _b;
    if (!analysisText) {
        return (<div className="bg-gray-50 min-h-[100px] flex items-center justify-center text-gray-500">
        <p>표시할 분석 결과가 없습니다.</p>
      </div>);
    }
    return (<div className={"prose prose-sm max-w-none overflow-y-auto max-h-[".concat(maxHeight, "] text-gray-800")}>
      <ReactMarkdown>{analysisText}</ReactMarkdown>
    </div>);
};
export default AnalysisRenderer;
