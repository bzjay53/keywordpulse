import React, { useEffect, useRef } from 'react';
import { FeedbackForm } from './FeedbackForm';
export var FeedbackModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSubmit = _a.onSubmit, _b = _a.contextData, contextData = _b === void 0 ? {} : _b;
    var modalRef = useRef(null);
    // 모달 외부 클릭 시 닫기
    useEffect(function () {
        var handleOutsideClick = function (event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        // ESC 키 누를 시 닫기
        var handleEscKey = function (event) {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
        }
        return function () {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = ''; // 스크롤 복원
        };
    }, [isOpen, onClose]);
    // 모달이 열릴 때 포커스 설정
    useEffect(function () {
        if (isOpen && modalRef.current) {
            var focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-content feedback-modal">
          <FeedbackForm onSubmit={onSubmit} onClose={onClose} contextData={contextData}/>
        </div>
      </div>
    </div>);
};
