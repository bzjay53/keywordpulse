// jest.setup.js
// 모든 테스트 전에 실행되는 코드

// Next.js의 환경 변수를 설정할 수 있습니다
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

// 모든 테스트에서 사용될 전역 설정
global.console = {
  ...console,
  // 테스트 중 경고 메시지 무시 (원하는 경우)
  // warn: jest.fn(),
  // 테스트 중 에러 메시지 무시 (원하는 경우)
  // error: jest.fn(),
};

// 정의되지 않은 속성 접근 시 콘솔 경고 표시 - 문제가 있어서 주석 처리
// global.Object.defineProperty(global, 'undefined', {
//   get: function() {
//     throw new Error('undefined 변수에 접근했습니다. 이는 에러의 원인이 될 수 있습니다.');
//   },
// }); 