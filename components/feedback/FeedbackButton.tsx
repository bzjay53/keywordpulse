import React, { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';
import { FeedbackData } from './FeedbackForm';

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      >
        {variant === 'icon' ? renderIcon() : label}
      </button>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={onSubmit}
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