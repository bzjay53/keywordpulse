/**
 * 경로 참조 검증 스크립트
 * 
 * 이 스크립트는 프로젝트 전체에서 다음을 확인합니다:
 * 1. 중복된 app 디렉토리 구조 (app/app/...)
 * 2. 일관되지 않은 import 경로 사용
 * 3. 잘못된 상대 경로 참조
 * 
 * 문제를 찾으면 콘솔에 보고하고 수정 제안을 제공합니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 코드 정의
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 설정
const config = {
  rootDir: path.resolve(__dirname, '..'),
  ignoreDirs: ['node_modules', '.next', '.git', 'public/images'],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.md'],
  checkPatterns: {
    duplicateAppDir: /['"]\.\.\/\.\.\/app\//,
    inconsistentImports: /from ['"](@\/app\/|\.\.\/app\/)/,
    appAppImports: /from ['"].*app\/app\//
  },
  fixMode: process.argv.includes('--fix')
};

console.log(`${colors.cyan}경로 참조 검증 시작${colors.reset}`);
console.log(`루트 디렉토리: ${config.rootDir}`);
console.log(`수정 모드: ${config.fixMode ? '활성화' : '비활성화'}\n`);

let issues = {
  duplicateAppDir: [],
  inconsistentImports: [],
  appAppImports: []
};

// 디렉토리 구조 검증
function checkDirectoryStructure() {
  console.log(`${colors.blue}디렉토리 구조 검증 중...${colors.reset}`);
  
  const appDir = path.join(config.rootDir, 'app');
  const appAppDir = path.join(appDir, 'app');
  
  if (fs.existsSync(appAppDir)) {
    console.log(`${colors.yellow}경고: 중복된 app 디렉토리 구조 발견 (app/app)${colors.reset}`);
    
    // app/app 디렉토리 내 콘텐츠 확인
    const contents = fs.readdirSync(appAppDir);
    console.log(`app/app 디렉토리 내 항목: ${contents.length}개`);
    
    // API 디렉토리 존재 확인
    const apiDir = path.join(appAppDir, 'api');
    if (fs.existsSync(apiDir)) {
      console.log(`${colors.yellow}app/app/api 디렉토리 발견${colors.reset}`);
      
      // 상위 app/api 디렉토리도 있는지 확인
      const parentApiDir = path.join(appDir, 'api');
      if (fs.existsSync(parentApiDir)) {
        console.log(`${colors.red}경고: app/api와 app/app/api가 모두 존재합니다!${colors.reset}`);
      } else {
        console.log(`app/api 디렉토리는 존재하지 않음`);
      }
    }
  } else {
    console.log(`${colors.green}중복된 app 디렉토리 구조 없음${colors.reset}`);
  }
}

// 파일 내용 검사
function scanFiles() {
  console.log(`\n${colors.blue}파일 내용 검사 중...${colors.reset}`);
  
  // 모든 대상 파일 찾기
  let command = `find ${config.rootDir} -type f `;
  
  // 확장자 필터
  const extPattern = config.fileExtensions.join('\\|');
  command += `-name "*\\(${extPattern}\\)" `;
  
  // 무시할 디렉토리 제외
  config.ignoreDirs.forEach(dir => {
    command += `-not -path "*/${dir}/*" `;
  });
  
  const files = execSync(command).toString().trim().split('\n');
  console.log(`검사할 파일 수: ${files.length}`);
  
  // 각 파일 검사
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(config.rootDir, filePath);
      
      // 패턴 검사
      if (config.checkPatterns.duplicateAppDir.test(content)) {
        issues.duplicateAppDir.push({ file: relativePath });
      }
      
      if (config.checkPatterns.inconsistentImports.test(content)) {
        issues.inconsistentImports.push({ file: relativePath });
      }
      
      if (config.checkPatterns.appAppImports.test(content)) {
        issues.appAppImports.push({ file: relativePath });
      }
    } catch (err) {
      console.error(`${colors.red}파일 읽기 오류: ${filePath}${colors.reset}`);
    }
  });
}

// 결과 보고 및 수정 제안
function reportResults() {
  console.log(`\n${colors.blue}검증 결과${colors.reset}`);
  
  let totalIssues = 0;
  
  // 중복된 app 디렉토리 참조
  if (issues.duplicateAppDir.length > 0) {
    console.log(`\n${colors.yellow}중복된 app 디렉토리 참조 (${issues.duplicateAppDir.length}개):${colors.reset}`);
    issues.duplicateAppDir.forEach(issue => {
      console.log(`- ${issue.file}`);
    });
    totalIssues += issues.duplicateAppDir.length;
  }
  
  // 일관되지 않은 import 방식
  if (issues.inconsistentImports.length > 0) {
    console.log(`\n${colors.yellow}일관되지 않은 import 경로 (${issues.inconsistentImports.length}개):${colors.reset}`);
    issues.inconsistentImports.forEach(issue => {
      console.log(`- ${issue.file}`);
    });
    totalIssues += issues.inconsistentImports.length;
  }
  
  // app/app 참조
  if (issues.appAppImports.length > 0) {
    console.log(`\n${colors.yellow}app/app 디렉토리 참조 (${issues.appAppImports.length}개):${colors.reset}`);
    issues.appAppImports.forEach(issue => {
      console.log(`- ${issue.file}`);
    });
    totalIssues += issues.appAppImports.length;
  }
  
  // 종합 결과
  if (totalIssues === 0) {
    console.log(`\n${colors.green}✓ 모든 검사 통과!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ ${totalIssues}개의 문제 발견${colors.reset}`);
    
    console.log(`\n${colors.magenta}수정 제안:${colors.reset}`);
    console.log(`1. tsconfig.json의 경로 별칭 확인 및 수정`);
    console.log(`2. 상대 경로 대신 경로 별칭(@/) 사용`);
    console.log(`3. app/app 디렉토리 구조 정리 (app/api로 통합)`);
    
    if (config.fixMode) {
      console.log(`\n${colors.green}자동 수정 시도...${colors.reset}`);
      // 여기에 자동 수정 로직 추가
    } else {
      console.log(`\n수정 모드로 실행하려면: node scripts/path-check.js --fix`);
    }
  }
}

// 메인 실행
function main() {
  checkDirectoryStructure();
  scanFiles();
  reportResults();
}

main(); 