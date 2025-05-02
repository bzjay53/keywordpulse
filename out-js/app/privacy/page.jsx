'use client';
import React from 'react';
import Link from 'next/link';
export default function PrivacyPage() {
    return (<div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>
      
      <div className="prose prose-indigo max-w-none">
        <p className="mb-4">
          KeywordPulse(이하 '회사')는 사용자의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을 준수하고 있습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. 수집하는 개인정보 항목</h2>
        <p>회사는 다음과 같은 개인정보를 수집하고 있습니다:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>필수항목: 이메일 주소, 비밀번호</li>
          <li>서비스 이용 과정에서 생성되는 정보: IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 검색 기록</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. 개인정보 수집 목적</h2>
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>서비스 제공: 콘텐츠 제공, 키워드 분석 결과 제공</li>
          <li>회원 관리: 회원제 서비스 이용, 개인식별, 가입의사 확인, 부정이용 방지</li>
          <li>서비스 개선: 신규 서비스 개발, 기존 서비스 개선</li>
          <li>마케팅 및 광고: 이벤트 정보 및 참여기회 제공, 서비스 안내</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. 개인정보 보유 및 이용 기간</h2>
        <p>
          회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 
          단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>회원 탈퇴 시: 탈퇴 후 30일간 보관 (재가입 방지, 요청사항 처리)</li>
          <li>관련 법령에 의한 정보 보존: 전자상거래 등에서의 소비자 보호에 관한 법률 등</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. 개인정보의 파기 절차 및 방법</h2>
        <p>
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
          지체없이 해당 개인정보를 파기합니다.
        </p>
        <p>
          파기 절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 법률에 따라 일정 기간 보관 후 파기됩니다.
          파기 방법: 전자적 파일 형태의 정보는 기술적 방법을 사용하여 삭제하며, 출력물 등은 분쇄하거나 소각합니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. 개인정보 보호 대책</h2>
        <p>
          회사는 이용자의 개인정보를 안전하게 처리하기 위해 내부관리계획을 수립하고 다음과 같은 기술적, 관리적 대책을 시행하고 있습니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>암호화: 비밀번호 등 중요 정보는 암호화하여 저장 및 관리</li>
          <li>접근 제한: 개인정보에 대한 접근 권한 최소화</li>
          <li>보안 프로그램: 백신 프로그램 등 보안 소프트웨어 사용</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. 이용자의 권리와 행사 방법</h2>
        <p>
          이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
          권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. 개인정보 보호책임자</h2>
        <p>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을
          위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <p className="font-medium">
          개인정보 보호책임자: 홍길동<br />
          연락처: privacy@keywordpulse.example.com
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
