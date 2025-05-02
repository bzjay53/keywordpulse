import { extractCitations, addCitationMarkup, limitTextLength, getConfidenceLevel } from '../../lib/response_formatter';
import { RagDocument } from '../../lib/rag_engine';

// 모의 문서 데이터
const mockDocuments: RagDocument[] = [
  {
    id: '1',
    content: '인공지능(AI)은 컴퓨터 시스템이 인간의 지능을 시뮬레이션하는 기술입니다.',
    metadata: { 
      source: 'AI 개론', 
      author: '홍길동', 
      date: '2023-01-15' 
    }
  },
  {
    id: '2',
    content: '자연어 처리(NLP)는 컴퓨터가 인간의 언어를 이해하고 처리하는 기술 분야입니다.',
    metadata: { 
      source: 'NLP 기초', 
      author: '김철수', 
      date: '2023-03-20',
      url: 'https://example.com/nlp'
    }
  }
];

describe('Response Formatter', () => {
  // extractCitations 테스트
  describe('extractCitations', () => {
    it('numbered 스타일로 인용 정보를 추출합니다', () => {
      const citations = extractCitations(mockDocuments, 'numbered');
      
      expect(citations).toHaveLength(2);
      expect(citations[0].source).toBe('AI 개론');
      expect(citations[0].author).toBe('홍길동');
      expect(citations[1].url).toBe('https://example.com/nlp');
    });

    it('authorYear 스타일로 인용 정보를 추출합니다', () => {
      const citations = extractCitations(mockDocuments, 'authorYear');
      
      expect(citations).toHaveLength(2);
      expect(citations[0].source).toBe('AI 개론');
      expect(citations[0].author).toBe('홍길동');
    });

    it('none 스타일로 빈 인용 배열을 반환합니다', () => {
      const citations = extractCitations(mockDocuments, 'none');
      
      expect(citations).toHaveLength(0);
    });

    it('메타데이터가 없는 경우 기본값을 사용합니다', () => {
      const docsWithoutMeta = [
        {
          id: '3',
          content: '머신러닝은 데이터로부터 패턴을 학습하는 AI의 하위 분야입니다.'
        }
      ] as RagDocument[];
      
      const citations = extractCitations(docsWithoutMeta);
      
      expect(citations[0].source).toBe('알 수 없는 소스');
      expect(citations[0].author).toBe('작성자 미상');
    });
  });

  // addCitationMarkup 테스트
  describe('addCitationMarkup', () => {
    const citations = extractCitations(mockDocuments);
    const testText = '인공지능은 현대 기술의 핵심입니다.';

    it('마크다운 형식으로 인용을 추가합니다', () => {
      const result = addCitationMarkup(testText, citations, 'markdown', 'numbered');
      
      expect(result).toContain('## 참고 자료');
      expect(result).toContain('[1] AI 개론');
      expect(result).toContain('[2] NLP 기초');
    });

    it('HTML 형식으로 인용을 추가합니다', () => {
      const result = addCitationMarkup(testText, citations, 'html', 'numbered');
      
      expect(result).toContain('<h2>참고 자료</h2>');
      expect(result).toContain('<li>AI 개론');
      expect(result).toContain('<li>NLP 기초');
    });

    it('인용 스타일이 none이면 원본 텍스트를 반환합니다', () => {
      const result = addCitationMarkup(testText, citations, 'markdown', 'none');
      
      expect(result).toBe(testText);
    });

    it('인용 배열이 비어있으면 원본 텍스트를 반환합니다', () => {
      const result = addCitationMarkup(testText, [], 'markdown', 'numbered');
      
      expect(result).toBe(testText);
    });
  });

  // limitTextLength 테스트
  describe('limitTextLength', () => {
    const longText = '첫 번째 문장입니다. 두 번째 문장입니다. 세 번째 문장입니다. 네 번째 문장입니다. 다섯 번째 문장입니다.';

    it('최대 길이보다 짧은 텍스트는 그대로 반환합니다', () => {
      const result = limitTextLength('짧은 텍스트', 50);
      
      expect(result).toBe('짧은 텍스트');
    });

    it('최대 길이를 초과하는 텍스트는 문장 단위로 자릅니다', () => {
      const result = limitTextLength(longText, 30);
      
      // '첫 번째 문장입니다. 두 번째 문장입니다.' 까지만 포함하고 [...] 추가
      expect(result.length).toBeLessThanOrEqual(30 + 5); // +5는 '[...]' 문자열 길이
      expect(result).toContain('첫 번째 문장입니다.');
      expect(result).toContain('[...]');
    });

    it('기본 최대 길이는 2000자입니다', () => {
      const veryLongText = 'a'.repeat(3000);
      const result = limitTextLength(veryLongText);
      
      expect(result.length).toBeLessThanOrEqual(2005); // 2000 + 5 for '[...]'
    });
  });

  // getConfidenceLevel 테스트
  describe('getConfidenceLevel', () => {
    it('0.8 이상의 점수는 high 레벨을 반환합니다', () => {
      expect(getConfidenceLevel(0.8)).toBe('high');
      expect(getConfidenceLevel(0.9)).toBe('high');
      expect(getConfidenceLevel(1.0)).toBe('high');
    });

    it('0.5 이상 0.8 미만의 점수는 medium 레벨을 반환합니다', () => {
      expect(getConfidenceLevel(0.5)).toBe('medium');
      expect(getConfidenceLevel(0.7)).toBe('medium');
      expect(getConfidenceLevel(0.799)).toBe('medium');
    });

    it('0.5 미만의 점수는 low 레벨을 반환합니다', () => {
      expect(getConfidenceLevel(0.4)).toBe('low');
      expect(getConfidenceLevel(0.1)).toBe('low');
      expect(getConfidenceLevel(0)).toBe('low');
    });
  });
}); 