import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AnalysisRendererProps {
  analysisText: string;
  maxHeight?: string;
}

/**
 * 마크다운 형식의 분석 텍스트를 렌더링하는 컴포넌트
 */
const AnalysisRenderer: React.FC<AnalysisRendererProps> = ({ 
  analysisText, 
  maxHeight = '100%' 
}) => {
  return (
    <div 
      className="markdown-content overflow-auto bg-white rounded-lg p-4" 
      style={{ maxHeight }}
    >
      <ReactMarkdown
        className="prose max-w-none"
        components={{
          h1: (props) => <h1 className="text-2xl font-bold my-4" {...props} />,
          h2: (props) => <h2 className="text-xl font-bold my-3" {...props} />,
          h3: (props) => <h3 className="text-lg font-bold my-2" {...props} />,
          h4: (props) => <h4 className="text-base font-bold my-2" {...props} />,
          p: (props) => <p className="my-2" {...props} />,
          ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
          ol: (props) => <ol className="list-decimal pl-5 my-2" {...props} />,
          li: (props) => <li className="my-1" {...props} />,
          a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
          blockquote: (props) => <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />,
          code: (props) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />,
          pre: (props) => <pre className="bg-gray-100 p-4 rounded overflow-auto" {...props} />,
        }}
      >
        {analysisText}
      </ReactMarkdown>
    </div>
  );
};

export default AnalysisRenderer; 