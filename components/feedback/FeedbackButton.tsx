import React, { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';
import { FeedbackData } from './FeedbackForm';
import analytics from '@/lib/analytics';

interface FeedbackButtonProps {
  onSubmit: (data: FeedbackData) => Promise<void>;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'inline';
  variant?: 'primary' | 'secondary' | 'text' | 'icon';
  contextData?: Record<string, any>;
  className?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onSubmit,
  label = '피드백 보내기',
  position = 'bottom-right',
  variant = 'primary',
  contextData = {},
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    
    // 분석 이벤트: 피드백 버튼 클릭
    analytics.logButtonClick('feedback_button', 'feedback', {
      position,
      variant,
      label
    });
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    
    // 분석 이벤트: 피드백 모달 닫기
    analytics.logFeatureUsage('feedback', 'modal_close');
  };
  
  // 피드백 제출 시 분석 이벤트 추가
  const handleSubmit = async (data: FeedbackData) => {
    try {
      // 원래 제출 함수 호출
      await onSubmit(data);
      
      // 분석 이벤트: 피드백 제출 성공
      analytics.logFeatureUsage('feedback', 'submit_success', {
        rating: data.rating,
        hasContent: !!data.feedback.trim(),
        position,
        variant
      });
    } catch (error) {
      // 분석 이벤트: 피드백 제출 실패
      analytics.logError('피드백 제출 실패', 'FEEDBACK_SUBMIT_ERROR', {
        errorDetails: error instanceof Error ? error.message : '알 수 없는 오류',
        position,
        variant
      });
      
      // 오류를 상위로 다시 던짐
      throw error;
    }
  };

  // 버튼 아이콘 (variant가 icon일 때 사용)
  const renderIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  // 위치 클래스
  const getPositionClass = () => {
    if (position === 'inline') return '';
    return `feedback-button-${position}`;
  };

  // 스타일 클래스
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'feedback-button-secondary';
      case 'text': return 'feedback-button-text';
      case 'icon': return 'feedback-button-icon';
      default: return 'feedback-button-primary';
    }
  };

  return (
    <>
      <button
        className={`feedback-button ${getPositionClass()} ${getVariantClass()} ${className}`}
        onClick={openModal}
        aria-label={label}
        data-testid="feedback-button"
      >
        {variant === 'icon' ? renderIcon() : label}
      </button>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        contextData={{
          source: 'FeedbackButton',
          position,
          variant,
          ...contextData
        }}
      />
    </>
  );
}; 