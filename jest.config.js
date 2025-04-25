const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.js와 .env 파일이 있는 경로를 지정
  dir: './',
});

// Jest에 추가할 사용자 정의 설정
const customJestConfig = {
  // 테스트 환경 설정
  testEnvironment: 'jest-environment-jsdom',
  // 테스트 모듈 경로 설정
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // 파일 확장자 설정
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 테스트 파일 패턴 설정
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  // 테스트 결과 리포트 설정
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  // 기타 설정
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// createJestConfig는 Next.js의 설정을 로드하는 비동기 함수입니다
module.exports = createJestConfig(customJestConfig); 