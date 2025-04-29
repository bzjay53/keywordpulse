/**
 * Vercel 배포 디버깅 스크립트
 * 환경 정보와 설정을 자세히 출력합니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 로그 기록 함수
const log = (message, isError = false) => {
  const timestamp = new Date().toISOString();
  const logPrefix = isError ? '[ERROR]' : '[INFO]';
  console.log(`${logPrefix} ${timestamp} - ${message}`);
};

// 파일 존재 확인 함수
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    log(`파일 존재 확인 오류 (${filePath}): ${err.message}`, true);
    return false;
  }
};

// 명령어 실행 함수
const runCommand = (command) => {
  try {
    log(`명령 실행: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    log(`명령 결과: ${output.trim().substring(0, 200)}${output.length > 200 ? '...(잘림)' : ''}`);
    return { success: true, output };
  } catch (error) {
    log(`명령 실행 오류: ${error.message}`, true);
    if (error.stdout) log(`명령 출력: ${error.stdout.toString().substring(0, 200)}`, false);
    if (error.stderr) log(`명령 오류 출력: ${error.stderr.toString().substring(0, 200)}`, true);
    return { success: false, error };
  }
};

// 환경 검사 시작
log('============= Vercel 배포 디버깅 시작 =============');

// 1. 시스템 정보 수집
log('1. 시스템 정보 수집');
log(`Node.js 버전: ${process.version}`);
log(`운영 체제: ${process.platform} (${process.arch})`);
log(`현재 작업 디렉토리: ${process.cwd()}`);
log(`Vercel 환경 여부: ${process.env.VERCEL === '1' ? '예' : '아니오'}`);

// 2. 디렉토리 구조 검사
log('2. 디렉토리 구조 검사');
try {
  const rootFiles = fs.readdirSync('.');
  log(`루트 디렉토리 파일 목록: ${rootFiles.join(', ')}`);
  
  // 중요 파일 존재 여부 확인
  const criticalFiles = [
    'package.json', 
    'package-lock.json', 
    'next.config.js', 
    'tsconfig.json', 
    'vercel.json',
    '.vercelignore'
  ];
  
  criticalFiles.forEach(file => {
    log(`${file} 파일 존재 여부: ${fileExists(file) ? '예' : '아니오'}`);
  });
  
} catch (err) {
  log(`디렉토리 검사 오류: ${err.message}`, true);
}

// 3. package.json 검사
log('3. package.json 검사');
try {
  if (fileExists('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log(`프로젝트명: ${packageJson.name}`);
    log(`버전: ${packageJson.version}`);
    log(`빌드 스크립트: ${packageJson.scripts?.build || '없음'}`);
    log(`dependencies에 typescript 존재 여부: ${packageJson.dependencies?.typescript ? '예' : '아니오'}`);
    log(`devDependencies에 typescript 존재 여부: ${packageJson.devDependencies?.typescript ? '예' : '아니오'}`);
  } else {
    log('package.json 파일을 찾을 수 없습니다.', true);
  }
} catch (err) {
  log(`package.json 분석 오류: ${err.message}`, true);
}

// 4. 설치된 패키지 검사
log('4. 설치된 패키지 검사');
runCommand('npm list typescript --depth=0');
runCommand('npm list @types/node --depth=0');
runCommand('npm list @types/react --depth=0');
runCommand('npm list --depth=0');

// 5. node_modules 디렉토리 확인
log('5. node_modules 디렉토리 검사');
const typescriptPath = path.join('node_modules', 'typescript');
log(`node_modules 존재 여부: ${fileExists('node_modules') ? '예' : '아니오'}`);
log(`typescript 패키지 존재 여부: ${fileExists(typescriptPath) ? '예' : '아니오'}`);

if (fileExists(typescriptPath)) {
  try {
    const typescriptFiles = fs.readdirSync(typescriptPath);
    log(`typescript 패키지 내 파일 수: ${typescriptFiles.length}`);
    log(`typescript 패키지 내 주요 파일: ${typescriptFiles.slice(0, 5).join(', ')}${typescriptFiles.length > 5 ? '...' : ''}`);
  } catch (err) {
    log(`typescript 패키지 검사 오류: ${err.message}`, true);
  }
}

// 6. TypeScript 설치 시도
log('6. TypeScript 설치 시도');
runCommand('npm install typescript --no-save');
runCommand('npm list typescript --depth=0');

// 7. 환경 변수 검사
log('7. 환경 변수 검사');
try {
  const envKeys = Object.keys(process.env).filter(key => 
    key.startsWith('NODE_') || 
    key.startsWith('NPM_') || 
    key.startsWith('NEXT_') ||
    key.startsWith('VERCEL_')
  );
  
  if (envKeys.length > 0) {
    log(`관련 환경 변수: ${envKeys.join(', ')}`);
  } else {
    log('관련 환경 변수가 없습니다.');
  }
} catch (err) {
  log(`환경 변수 검사 오류: ${err.message}`, true);
}

// 8. Next.js 빌드 명령 수동 실행
log('8. Next.js 빌드 명령 수동 실행 (오류 무시)');
runCommand('npx next build --help');

// 9. tsconfig.json 검사
log('9. tsconfig.json 검사');
try {
  if (fileExists('tsconfig.json')) {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    log(`tsconfig.json 내용: ${JSON.stringify(tsConfig, null, 2).substring(0, 200)}...`);
  } else {
    log('tsconfig.json 파일을 찾을 수 없습니다.', true);
  }
} catch (err) {
  log(`tsconfig.json 분석 오류: ${err.message}`, true);
}

// 10. TypeScript 수동 설치 및 컴파일 시도
log('10. TypeScript 수동 설치 및 컴파일 시도');
runCommand('npm install --no-save typescript @types/node @types/react @types/react-dom');
runCommand('npx tsc --version');

// 11. 요약 정보
log('============= 요약 =============');
log('디버깅 정보 수집 완료.');
log('제안: 이 로그를 분석하여 TypeScript 빌드 실패 원인을 파악하세요.');
log('Vercel 대시보드에서 빌드 명령을 수동으로 변경하는 것을 고려하세요.');
log('============= 디버깅 종료 ============='); 