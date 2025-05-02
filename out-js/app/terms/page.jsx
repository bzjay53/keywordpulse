'use client';
import React from 'react';
import Link from 'next/link';
export default function TermsPage() {
    return (<div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">이용약관</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="mb-4">
          본 이용약관은 KeywordPulse(이하 '서비스')의 이용 조건과 절차, 회사와 회원 간의 권리와 의무 등 기본적인 사항을 규정합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. 서비스 개요</h2>
        <p>
          KeywordPulse는 키워드 분석 및 콘텐츠 최적화 서비스를 제공합니다. 본 서비스는 회원에게 키워드 추천, 검색량 분석, 연관 키워드 제안 등의 기능을 제공합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. 회원 가입 및 서비스 이용</h2>
        <p>
          본 서비스를 이용하기 위해서는 회원 가입이 필요합니다. 회원 가입 시 제공한 정보는 개인정보처리방침에 따라 관리됩니다.
          회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 계정 정보 유출로 인한 피해는 회원 본인에게 책임이 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. 서비스 이용 제한</h2>
        <p>
          다음 각 호에 해당하는 행위를 할 경우 서비스 이용이 제한될 수 있습니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>타인의 정보를 도용하거나 부정한 방법으로 서비스를 이용하는 행위</li>
          <li>서비스의 운영을 방해하는 행위</li>
          <li>서비스를 통해 얻은 정보를 상업적으로 이용하는 행위 (별도 계약 없이)</li>
          <li>기타 관련 법령에 위배되는 행위</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. 서비스 변경 및 중단</h2>
        <p>
          회사는 서비스의 내용이나 운영 방식을 변경할 수 있으며, 기술적인 문제나 기타 사유로 서비스를 일시적으로 중단할 수 있습니다.
          서비스 변경이나 중단 시 사전에 공지하나, 긴급한 경우에는 사후에 공지할 수 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. 면책 조항</h2>
        <p>
          회사는 서비스를 통해 제공되는 정보의 정확성이나 신뢰성을 보증하지 않으며, 서비스 이용으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.
          천재지변, 전쟁, 폭동, 통신 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해서도 책임을 지지 않습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. 약관 변경</h2>
        <p>
          회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지한 후 적용됩니다.
          회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
        </p>
        
        <p className="mt-8 text-sm text-gray-600">
          시행일: 2024년 5월 1일
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          홈으로 돌아가기
        </Link>
      </div>
    </div>);
}
