import { useState } from 'react';
import { FeedbackData } from '@/components/feedback';

interface UseFeedbackOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseFeedbackReturn {
  submitFeedback: (data: FeedbackData) => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * 피드백 제출을 위한 훅
 */
export function useFeedback(options: UseFeedbackOptions = {}): UseFeedbackReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 피드백 제출 함수
  const submitFeedback = async (data: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '피드백 제출 중 오류가 발생했습니다.');
      }
      
      setIsSuccess(true);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorObj);
      
      if (options.onError) {
        options.onError(errorObj);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 상태 초기화
  const reset = () => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  };
  
  return {
    submitFeedback,
    isSubmitting,
    isSuccess,
    error,
    reset
  };
} 