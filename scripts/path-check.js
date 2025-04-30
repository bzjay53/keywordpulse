/**
 * 경로 참조 검증 스크립트
 * 
 * 이 스크립트는 프로젝트 전체에서 다음을 확인합니다:
 * 1. 중복된 app 디렉토리 구조 (app/app/...)
 * 2. 일관되지 않은 import 경로 사용
 * 3. 잘못된 상대 경로 참조
 * 4. 경로 관리 문서화 상태 확인
 * 5. VSCode 확장 개발 상태 확인
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
  fixMode: process.argv.includes('--fix'),
  documentationFiles: {
    pathManagement: 'Docs/PathManagement.md',
    vscodeExtensions: '.vscode/extensions.json'
  }
};

console.log(`${colors.cyan}경로 참조 검증 시작${colors.reset}`);
console.log(`루트 디렉토리: ${config.rootDir}`);
console.log(`수정 모드: ${config.fixMode ? '활성화' : '비활성화'}\n`);

let issues = {
  duplicateAppDir: [],
  inconsistentImports: [],
  appAppImports: [],
  documentation: {
    missing: false,
    outdated: false
  },
  vscodeExtension: {
    missing: false
  }
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

// 재귀적으로 파일 찾기 (Windows 호환)
function findFiles(dir, extensions, ignoreDirs) {
  let results = [];
  
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(config.rootDir, fullPath);
    
    // 무시할 디렉토리 체크
    if (ignoreDirs.some(ignoreDir => relativePath.includes(ignoreDir))) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 디렉토리인 경우 재귀 호출
      results = results.concat(findFiles(fullPath, extensions, ignoreDirs));
    } else {
      // 파일 확장자 체크
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

// 파일 내용 검사
function scanFiles() {
  console.log(`\n${colors.blue}파일 내용 검사 중...${colors.reset}`);
  
  // 모든 대상 파일 찾기 (Windows 호환 방식)
  const files = findFiles(config.rootDir, config.fileExtensions, config.ignoreDirs);
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

// 문서화 상태 확인
function checkDocumentation() {
  console.log(`\n${colors.blue}문서화 상태 확인 중...${colors.reset}`);
  
  // 경로 관리 문서 존재 확인
  const pathManagementFile = path.join(config.rootDir, config.documentationFiles.pathManagement);
  if (!fs.existsSync(pathManagementFile)) {
    console.log(`${colors.red}경로 관리 문서(${config.documentationFiles.pathManagement})가 존재하지 않습니다.${colors.reset}`);
    issues.documentation.missing = true;
  } else {
    console.log(`${colors.green}경로 관리 문서 존재${colors.reset}`);
    
    // 문서 내용이 최신인지 확인 (최소 크기와 업데이트 날짜 확인)
    const stats = fs.statSync(pathManagementFile);
    const content = fs.readFileSync(pathManagementFile, 'utf8');
    
    // 문서 크기가 너무 작으면 내용이 불완전할 수 있음
    if (content.length < 1000) {
      console.log(`${colors.yellow}경로 관리 문서가 너무 짧습니다 (${content.length} 바이트).${colors.reset}`);
      issues.documentation.outdated = true;
    }
    
    // 문서가 30일 이상 업데이트되지 않았는지 확인
    const lastModified = new Date(stats.mtime);
    const now = new Date();
    const daysDiff = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 30) {
      console.log(`${colors.yellow}경로 관리 문서가 ${daysDiff}일 동안 업데이트되지 않았습니다.${colors.reset}`);
      issues.documentation.outdated = true;
    } else {
      console.log(`경로 관리 문서 최종 업데이트: ${lastModified.toLocaleDateString()} (${daysDiff}일 전)`);
    }
    
    // 문서에 필수 섹션이 포함되어 있는지 확인
    const requiredSections = ['경로 관리 표준화', '디렉토리 구조', 'import 경로'];
    const missingSections = requiredSections.filter(section => !content.includes(section));
    
    if (missingSections.length > 0) {
      console.log(`${colors.yellow}경로 관리 문서에 다음 섹션이 없습니다: ${missingSections.join(', ')}${colors.reset}`);
      issues.documentation.outdated = true;
    }
  }
  
  // VSCode 확장 개발 상태 확인
  const vscodeExtensionsFile = path.join(config.rootDir, config.documentationFiles.vscodeExtensions);
  if (!fs.existsSync(vscodeExtensionsFile)) {
    console.log(`${colors.yellow}VSCode 확장 구성 파일이 존재하지 않습니다.${colors.reset}`);
    issues.vscodeExtension.missing = true;
  } else {
    console.log(`${colors.green}VSCode 확장 구성 파일 존재${colors.reset}`);
    
    // 경로 관리 관련 확장이 포함되어 있는지 확인
    try {
      const extensionsConfig = JSON.parse(fs.readFileSync(vscodeExtensionsFile, 'utf8'));
      const pathExtensions = ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint", "mshr-h.vscode-import-sorter"];
      
      if (extensionsConfig.recommendations) {
        const missingExtensions = pathExtensions.filter(ext => !extensionsConfig.recommendations.includes(ext));
        if (missingExtensions.length > 0) {
          console.log(`${colors.yellow}다음 경로 관리 관련 VSCode 확장이 권장되지 않습니다: ${missingExtensions.join(', ')}${colors.reset}`);
        } else {
          console.log(`${colors.green}모든 필수 VSCode 확장이 구성되어 있습니다.${colors.reset}`);
        }
      }
    } catch (err) {
      console.error(`${colors.red}VSCode 확장 구성 파일 읽기 오류: ${err.message}${colors.reset}`);
    }
  }
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
  
  // 문서화 문제
  if (issues.documentation.missing) {
    console.log(`\n${colors.red}경로 관리 문서가 존재하지 않습니다.${colors.reset}`);
    totalIssues++;
  } else if (issues.documentation.outdated) {
    console.log(`\n${colors.yellow}경로 관리 문서가 업데이트되어야 합니다.${colors.reset}`);
    totalIssues++;
  }
  
  // VSCode 확장 문제
  if (issues.vscodeExtension.missing) {
    console.log(`\n${colors.yellow}VSCode 확장 구성 파일이 존재하지 않습니다.${colors.reset}`);
    totalIssues++;
  }
  
  // 종합 결과
  console.log(`\n${colors.blue}종합 결과:${colors.reset}`);
  if (totalIssues === 0) {
    console.log(`${colors.green}문제가 발견되지 않았습니다.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}총 ${totalIssues}개의 문제가 발견되었습니다.${colors.reset}`);
    
    // 수정 방법 제안
    console.log(`\n${colors.blue}수정 방법:${colors.reset}`);
    
    if (issues.duplicateAppDir.length > 0 || issues.appAppImports.length > 0) {
      console.log(`1. 'node scripts/path-fix.js --dry-run'을 실행하여 수정 사항 미리보기`);
      console.log(`2. 'node scripts/path-fix.js'를 실행하여 자동 수정 적용`);
    }
    
    if (issues.inconsistentImports.length > 0) {
      console.log(`3. import 경로를 일관되게 @/ 접두사를 사용하도록 수정`);
    }
    
    if (issues.documentation.missing || issues.documentation.outdated) {
      console.log(`4. 경로 관리 문서 업데이트 또는 작성`);
    }
    
    if (issues.vscodeExtension.missing) {
      console.log(`5. VSCode 확장 구성 파일 추가`);
    }
  }
}

function main() {
  checkDirectoryStructure();
  scanFiles();
  checkDocumentation();
  reportResults();
}

main(); 