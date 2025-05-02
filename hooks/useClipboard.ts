import { useState, useCallback, useEffect } from 'react';

type CopyStatus = 'idle' | 'copied' | 'error';

interface UseClipboardOptions {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 클립보드 복사 기능을 제공하는 Hook
 * @param options 클립보드 옵션
 * @returns 클립보드 상태와 복사 함수
 */
function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000, onSuccess, onError } = options;
  const [status, setStatus] = useState<CopyStatus>('idle');
  const [value, setValue] = useState<string>('');

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          // navigator.clipboard을 지원하지 않는 경우의 대체 방법
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        setValue(text);
        setStatus('copied');
        onSuccess?.();
      } catch (error) {
        setStatus('error');
        onError?.(error as Error);
        console.error('클립보드 복사 실패:', error);
      }
    },
    [onError, onSuccess]
  );

  useEffect(() => {
    if (status === 'copied') {
      const timeoutId = setTimeout(() => {
        setStatus('idle');
      }, timeout);

      return () => clearTimeout(timeoutId);
    }
  }, [status, timeout]);

  return { value, status, copy, isIdle: status === 'idle', isCopied: status === 'copied', isError: status === 'error' };
}

export default useClipboard; 