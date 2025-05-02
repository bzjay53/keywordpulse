import React from 'react';
import ReactMarkdown from 'react-markdown';
/**
 * 마크다운 형식의 분석 텍스트를 렌더링하는 컴포넌트
 */
var AnalysisRenderer = function (_a) {
    var analysisText = _a.analysisText, _b = _a.maxHeight, maxHeight = _b === void 0 ? '100%' : _b;
    return (<div className="markdown-content overflow-auto bg-white rounded-lg p-4" style={{ maxHeight: maxHeight }}>
      <ReactMarkdown className="prose max-w-none" components={{
            h1: function (props) { return <h1 className="text-2xl font-bold my-4" {...props}/>; },
            h2: function (props) { return <h2 className="text-xl font-bold my-3" {...props}/>; },
            h3: function (props) { return <h3 className="text-lg font-bold my-2" {...props}/>; },
            h4: function (props) { return <h4 className="text-base font-bold my-2" {...props}/>; },
            p: function (props) { return <p className="my-2" {...props}/>; },
            ul: function (props) { return <ul className="list-disc pl-5 my-2" {...props}/>; },
            ol: function (props) { return <ol className="list-decimal pl-5 my-2" {...props}/>; },
            li: function (props) { return <li className="my-1" {...props}/>; },
            a: function (props) { return <a className="text-blue-600 hover:underline" {...props}/>; },
            blockquote: function (props) { return <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props}/>; },
            code: function (props) { return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}/>; },
            pre: function (props) { return <pre className="bg-gray-100 p-4 rounded overflow-auto" {...props}/>; },
        }}>
        {analysisText}
      </ReactMarkdown>
    </div>);
};
export default AnalysisRenderer;
