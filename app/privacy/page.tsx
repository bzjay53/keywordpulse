'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">개인정보 처리방침</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="lead text-gray-700 mb-8">
          KeywordPulse는 사용자의 개인정보를 중요하게 생각하며, 관련 법규를 준수하고 있습니다.
          본 개인정보 처리방침은 당사가 수집하는 정보와 그 사용 방법에 대해 설명합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. 수집하는 개인정보 항목</h2>
        <p>
          KeywordPulse는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>필수항목: 이메일 주소, 비밀번호</li>
          <li>서비스 이용 과정에서 생성되는 정보: 검색 기록, IP 주소, 쿠키, 로그 데이터</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. 개인정보 수집 목적</h2>
        <p>
          수집한 개인정보는 다음 목적을 위해 활용됩니다:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>서비스 제공 및 계정 관리</li>
          <li>사용자 인증 및 본인확인</li>
          <li>서비스 개선 및 맞춤화</li>
          <li>불법 이용 방지 및 보안</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. 개인정보 보유 및 파기</h2>
        <p>
          KeywordPulse는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
          다만, 관련 법령에 따라 보존할 필요가 있는 경우 법령에 명시된 기간 동안 보관됩니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. 제3자 정보 제공</h2>
        <p>
          KeywordPulse는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          다만, 다음 경우에는 예외적으로 제공될 수 있습니다:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>사용자의 명시적 동의가 있는 경우</li>
          <li>법령에 의해 요구되는 경우</li>
          <li>서비스 제공에 필요한 업무 처리를 위해 위탁하는 경우</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. 쿠키 사용</h2>
        <p>
          KeywordPulse는 사용자 경험 개선을 위해 쿠키를 사용할 수 있습니다.
          사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">6. 개인정보 보호 조치</h2>
        <p>
          KeywordPulse는 개인정보 보호를 위해 다음과 같은 보안 조치를 취하고 있습니다:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>암호화: 비밀번호 등 중요 정보 암호화 저장</li>
          <li>접근 제한: 개인정보 처리 시스템에 대한 접근 권한 관리</li>
          <li>보안 업데이트: 정기적인 보안 점검 및 업데이트</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">7. 사용자 권리</h2>
        <p>
          사용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
          요청 사항은 이메일(privacy@keywordpulse.io)을 통해 접수 가능합니다.
        </p>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>최종 업데이트: 2025년 5월 10일</p>
          <p>개인정보 보호책임자: 김개인 (privacy@keywordpulse.io)</p>
        </div>
      </div>
      
      <div className="mt-10">
        <Link 
          href="/"
          className="text-blue-500 hover:underline"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
} 