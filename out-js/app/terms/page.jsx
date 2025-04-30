'use client';
import React from 'react';
import Link from 'next/link';
export default function TermsPage() {
    return (<div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">이용약관</h1>
      
      <div className="prose prose-lg max-w-none">
        <h2 className="text-xl font-semibold mt-8 mb-4">1. 서비스 이용약관</h2>
        <p>
          KeywordPulse(이하 "서비스")를 이용해 주셔서 감사합니다. 본 약관은 사용자가 본 서비스를 이용함에 있어 
          필요한 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. 서비스 설명</h2>
        <p>
          KeywordPulse는 사용자에게 키워드 분석과 콘텐츠 전략 수립에 도움이 되는 도구를 제공합니다. 
          서비스는 기술적 제한이나 정기 점검으로 인해 일시적으로 중단될 수 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. 사용자 의무</h2>
        <p>
          사용자는 서비스 이용 시 다음 행위를 해서는 안됩니다:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>타인의 정보를 도용하거나 허위 정보를 제공하는 행위</li>
          <li>서비스의 운영을 방해하는 행위</li>
          <li>타인의 명예를 훼손하거나 모욕하는 행위</li>
          <li>지적재산권, 초상권 등 타인의 권리를 침해하는 행위</li>
          <li>법령에 위반되는 행위</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. 면책조항</h2>
        <p>
          KeywordPulse는 사용자가 서비스를 통해 제공받은 정보를 기반으로 한 의사결정에 대해 책임을 지지 않습니다. 
          모든 분석 결과와 정보는 참고용으로만 사용되어야 하며, 최종 결정은 사용자의 판단에 따라 이루어져야 합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. 개인정보 처리</h2>
        <p>
          서비스의 개인정보 수집과 이용에 관한 사항은 <Link href="/privacy" className="text-blue-500 hover:underline">개인정보 처리방침</Link>에서 
          확인하실 수 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">6. 약관의 변경</h2>
        <p>
          본 약관은 관련 법령의 변경, 서비스의 변경 사항 발생 시 개정될 수 있으며, 
          개정 시 웹사이트를 통해 공지됩니다.
        </p>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>최종 업데이트: 2025년 5월 10일</p>
          <p>문의사항: support@keywordpulse.io</p>
        </div>
      </div>
      
      <div className="mt-10">
        <Link href="/" className="text-blue-500 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    </div>);
}
