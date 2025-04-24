import { useState } from 'react';

/**
 * 텍스트를 클립보드에 복사하는 기능을 제공하는 커스텀 훅
 * @returns 복사 상태와 복사 함수
 */
const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      // 3초 후 복사 상태 초기화
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      
      return true;
    } catch (err) {
      console.error('텍스트 복사 실패:', err);
      return false;
    }
  };

  return {
    isCopied,
    copyToClipboard
  };
};

export default useClipboard; 