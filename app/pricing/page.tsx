'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';

export default function PricingPage() {
  const { user } = useAuth();

  const plans = [
    {
      name: '무료',
      price: '0',
      description: '기본 기능을 무료로 사용해보세요',
      features: [
        '매일 3회 키워드 검색',
        '키워드 트렌드 확인',
        '관련 키워드 추천',
        '기본 데이터 통계',
      ],
      button: '시작하기',
      highlight: false,
      current: !user || user.role === 'user',
    },
    {
      name: '프로',
      price: '9,900',
      description: '전문가를 위한 더 많은 기능',
      features: [
        '무제한 키워드 검색',
        '실시간 트렌드 알림',
        '키워드 세트 저장',
        '고급 데이터 분석',
        'API 액세스',
        '우선 고객 지원',
      ],
      button: '업그레이드',
      highlight: true,
      current: user?.role === 'pro',
    },
    {
      name: '비즈니스',
      price: '29,900',
      description: '기업을 위한 확장 가능한 솔루션',
      features: [
        '프로 플랜의 모든 기능',
        '다중 사용자 계정',
        '맞춤형 리포트',
        '전용 API 키',
        '대용량 데이터 처리',
        '전담 고객 지원',
      ],
      button: '문의하기',
      highlight: false,
      current: user?.role === 'business',
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            간단하고 투명한 가격 정책
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            필요에 맞는 플랜을 선택하고 키워드 분석을 시작하세요.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg overflow-hidden ${
                plan.highlight
                  ? 'ring-2 ring-primary-600 transform scale-105'
                  : 'bg-white'
              }`}
            >
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ₩{plan.price}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    /월
                  </span>
                </p>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {plan.current ? (
                    <div className="block w-full bg-gray-200 text-gray-700 rounded-md py-3 text-center font-medium">
                      현재 사용 중
                    </div>
                  ) : (
                    <Link
                      href={plan.name === '무료' ? '/' : '/contact'}
                      className={`block w-full rounded-md py-3 text-center font-medium ${
                        plan.highlight
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      {plan.button}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            자주 묻는 질문
          </h2>
          <div className="mt-6 grid gap-6">
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900">
                무료 플랜에서 프로로 업그레이드하면 어떤 이점이 있나요?
              </h3>
              <p className="mt-2 text-base text-gray-600">
                프로 플랜으로 업그레이드하면 무제한 키워드 검색, 실시간 알림, 고급 데이터 분석 등 더 많은 기능을 사용할 수 있습니다. 특히 콘텐츠 크리에이터나 마케터에게 유용한 기능들이 제공됩니다.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900">
                결제 방법은 어떻게 되나요?
              </h3>
              <p className="mt-2 text-base text-gray-600">
                신용카드, 체크카드, 계좌이체 등 다양한 결제 방법을 지원합니다. 모든 결제는 안전한 암호화 시스템을 통해 처리됩니다.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900">
                언제든지 구독을 취소할 수 있나요?
              </h3>
              <p className="mt-2 text-base text-gray-600">
                네, 언제든지 구독을 취소할 수 있습니다. 취소 후에는 다음 결제일까지 서비스를 계속 이용할 수 있으며, 자동으로 갱신되지 않습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            아직 궁금한 점이 있으신가요?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            언제든지 문의해주세요. 친절하게 답변해드리겠습니다.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 