'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      // 여기에 실제 API 호출 로직이 들어갈 수 있습니다
      // 지금은 시뮬레이션만 합니다
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.'
      });
      
      // 폼 리셋
      if (!user) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setFormData(prev => ({
          ...prev,
          subject: '',
          message: ''
        }));
      }
    } catch (error) {
      console.error('문의 전송 오류:', error);
      setStatus({
        type: 'error',
        message: '문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary-600 mb-3">문의하기</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          기술 지원, 기능 제안 또는 일반적인 질문이 있으신가요? 아래 양식을 작성하시면 빠른 시일 내에 답변해 드리겠습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            {status && (
              <div className={`p-4 mb-6 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                문의 유형
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">문의 유형을 선택하세요</option>
                <option value="기술 지원">기술 지원</option>
                <option value="기능 제안">기능 제안</option>
                <option value="버그 신고">버그 신고</option>
                <option value="계정 문의">계정 문의</option>
                <option value="텔레그램 설정 도움">텔레그램 설정 도움</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                메시지
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="문의 내용을 자세히 적어주세요..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-150"
            >
              {isSubmitting ? '전송 중...' : '문의 전송하기'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">연락처 정보</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">이메일</p>
                  <p className="text-gray-600">support@keywordpulse.example.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">응답 시간</p>
                  <p className="text-gray-600">평일 기준 24시간 이내</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">자주 묻는 질문</h2>
            
            <div className="space-y-4">
              <a href="/docs#faq" className="block p-3 rounded-md hover:bg-gray-50 transition-colors">
                <p className="font-medium text-primary-600">텔레그램 설정은 어떻게 하나요?</p>
                <p className="text-sm text-gray-600 mt-1">
                  텔레그램 설정 방법에 대한 상세 가이드를 확인하세요.
                </p>
              </a>
              
              <a href="/pricing" className="block p-3 rounded-md hover:bg-gray-50 transition-colors">
                <p className="font-medium text-primary-600">유료 플랜은 어떤 혜택이 있나요?</p>
                <p className="text-sm text-gray-600 mt-1">
                  가격 정책 페이지에서 각 플랜별 혜택을 확인하세요.
                </p>
              </a>
              
              <a href="/docs" className="block p-3 rounded-md hover:bg-gray-50 transition-colors">
                <p className="font-medium text-primary-600">사용 방법을 알고 싶어요</p>
                <p className="text-sm text-gray-600 mt-1">
                  도움말 문서에서 상세한 사용법을 확인하세요.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 