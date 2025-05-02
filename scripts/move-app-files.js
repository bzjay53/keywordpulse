/**
 * app/app 디렉토리에서 app 디렉토리로 파일을 이동시키는 스크립트
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'app', 'app');
const destDir = path.join(rootDir, 'app');

// 디렉토리가 존재하는지 확인
if (!fs.existsSync(srcDir)) {
  console.log(`${colors.red}소스 디렉토리가 존재하지 않습니다: ${srcDir}${colors.reset}`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  console.log(`${colors.red}대상 디렉토리가 존재하지 않습니다: ${destDir}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.cyan}app/app에서 app으로 파일 이동 시작${colors.reset}`);

// 파일 및 디렉토리 복사 함수
function copyRecursive(src, dest, stats = { files: 0, dirs: 0 }) {
  // 디렉토리 존재 여부 확인
  if (!fs.existsSync(src)) {
    return stats;
  }

  // src가 디렉토리인지 확인
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    // api 디렉토리는 이미 path-fix.js에서 처리했으므로 건너뜀
    if (path.basename(src) === 'api') {
      console.log(`${colors.yellow}api 디렉토리는 건너뜁니다 (이미 처리됨)${colors.reset}`);
      return stats;
    }

    // 대상 디렉토리가 없으면 생성
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
      stats.dirs++;
      console.log(`${colors.green}디렉토리 생성: ${dest}${colors.reset}`);
    }

    // 디렉토리 내용 복사
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      const srcEntry = path.join(src, entry);
      const destEntry = path.join(dest, entry);
      copyRecursive(srcEntry, destEntry, stats);
    }
  } 
  // 파일인 경우 복사
  else {
    const relativePath = path.relative(srcDir, src);
    console.log(`파일 이동: ${relativePath}`);

    // 파일 복사
    fs.copyFileSync(src, dest);
    stats.files++;
  }

  return stats;
}

// 파일 이동 실행
const stats = copyRecursive(srcDir, destDir);

console.log(`${colors.green}이동 완료!${colors.reset}`);
console.log(`생성된 디렉토리: ${stats.dirs}, 이동된 파일: ${stats.files}`);

// 이제 app/app 디렉토리를 삭제할지 물어봄
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`${colors.yellow}app/app 디렉토리를 삭제하시겠습니까? (yes/no): ${colors.reset}`, (answer) => {
  if (answer.toLowerCase() === 'yes') {
    // 재귀적으로 디렉토리 삭제
    // 주의: 이 작업은 복원할 수 없습니다!
    try {
      fs.rmSync(srcDir, { recursive: true });
      console.log(`${colors.green}app/app 디렉토리가 삭제되었습니다.${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}디렉토리 삭제 중 오류 발생: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.blue}app/app 디렉토리를 유지합니다.${colors.reset}`);
  }
  
  rl.close();
}); 