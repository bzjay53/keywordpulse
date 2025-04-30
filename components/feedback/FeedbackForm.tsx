import React, { useState } from 'react';
import { StarRating } from './StarRating';
import analytics from '@/lib/analytics';

interface FeedbackFormProps {
  onSubmit?: (data: FeedbackData) => Promise<void>;
  onClose?: () => void;
  initialRating?: number;
  contextData?: Record<string, any>;
  compact?: boolean;
}

export interface FeedbackData {
  rating: number;
  feedback: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  browser?: string;
  platform?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  onClose,
  initialRating = 0,
  contextData = {},
  compact = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 분석 이벤트: 별점 변경
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    analytics.logEvent({
      eventType: analytics.EventType.FEATURE_USAGE,
      category: 'feedback',
      action: 'rating_changed',
      value: newRating
    });
  };

  const getCurrentContext = () => {
    return {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      ...contextData
    };
  };

  const getBrowserInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('평점을 선택해주세요');
      return;
    }
    
    if (!feedback.trim()) {
      setError('피드백 내용을 입력해주세요');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const feedbackData: FeedbackData = {
        rating,
        feedback,
        context: getCurrentContext(),
        timestamp: new Date().toISOString(),
        browser: JSON.stringify(getBrowserInfo()),
        platform: navigator.platform
      };
      
      // 분석 이벤트: 피드백 제출
      analytics.logEvent({
        eventType: analytics.EventType.FEEDBACK,
        value: rating,
        label: feedback,
        metadata: {
          context: getCurrentContext(),
          formType: compact ? 'compact' : 'full'
        }
      });
      
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // 기본 제출 로직 (개발용)
        console.log('피드백 데이터:', feedbackData);
        await new Promise(r => setTimeout(r, 1000)); // 제출 지연 시뮬레이션
      }
      
      setSubmitted(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err) {
      setError('피드백 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('피드백 제출 오류:', err);
      
      // 분석 이벤트: 피드백 제출 실패
      analytics.logError('피드백 제출 실패', 'FEEDBACK_SUBMIT_ERROR', {
        errorDetails: err instanceof Error ? err.message : '알 수 없는 오류'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="feedback-form-success">
        <div className="success-icon">✓</div>
        <h3>피드백이 성공적으로 제출되었습니다!</h3>
        <p>소중한 의견 감사합니다.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className={`feedback-form ${compact ? 'compact' : ''}`}>
      <div className="feedback-header">
        <h3>{compact ? '간편 피드백' : '서비스 개선을 위한 피드백'}</h3>
        {onClose && (
          <button 
            type="button" 
            className="close-button" 
            onClick={() => {
              onClose();
              // 분석 이벤트: 피드백 폼 닫기
              analytics.logButtonClick('feedback_form_close', 'feedback', {
                feedbackEntered: !!feedback.trim(),
                ratingSelected: rating > 0
              });
            }}
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="rating-container">
        <label>이 페이지가 얼마나 유용했나요?</label>
        <StarRating value={rating} onChange={handleRatingChange} size={compact ? 'small' : 'medium'} />
      </div>
      
      <div className="feedback-input-container">
        <label htmlFor="feedback-text">개선을 위한 의견을 알려주세요</label>
        <textarea
          id="feedback-text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="서비스를 개선하는데 도움이 될 의견을 알려주세요"
          rows={compact ? 3 : 5}
          onFocus={() => {
            // 분석 이벤트: 피드백 입력 시작
            analytics.logFeatureUsage('feedback', 'text_focus');
          }}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="feedback-actions">
        {onClose && !compact && (
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => {
              onClose();
              // 분석 이벤트: 피드백 취소
              analytics.logButtonClick('feedback_form_cancel', 'feedback', {
                feedbackEntered: !!feedback.trim(),
                ratingSelected: rating > 0
              });
            }} 
            disabled={submitting}
          >
            취소
          </button>
        )}
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? '제출 중...' : '의견 제출하기'}
        </button>
      </div>
      
      <div className="feedback-privacy-notice">
        제출된 피드백은 서비스 개선을 위해서만 사용됩니다.
      </div>
    </form>
  );
}; 