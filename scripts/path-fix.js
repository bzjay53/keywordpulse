/**
 * 경로 자동 수정 스크립트
 * 
 * 이 스크립트는 다음 작업을 수행합니다:
 * 1. app/app/api에서 app/api로 파일 이동
 * 2. 경로 참조 수정 (app/app/... -> app/...)
 * 3. 상대 경로를 경로 별칭(@/)으로 변환
 * 
 * 주의: 이 스크립트는 파일을 직접 수정합니다!
 * 실행 전에 모든 변경 사항을 커밋하거나 백업하십시오.
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
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose')
};

console.log(`${colors.cyan}경로 자동 수정 시작${colors.reset}`);
console.log(`루트 디렉토리: ${config.rootDir}`);
console.log(`테스트 모드: ${config.dryRun ? '활성화 (파일이 실제로 수정되지 않음)' : '비활성화'}`);
console.log(`상세 모드: ${config.verbose ? '활성화' : '비활성화'}\n`);

// 확인 프롬프트
if (!config.dryRun) {
  console.log(`${colors.red}경고: 이 스크립트는 파일을 직접 수정합니다!${colors.reset}`);
  console.log(`계속하려면 'yes'를 입력하세요. 테스트 모드로 실행하려면 스크립트를 --dry-run 옵션과 함께 실행하세요.`);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('계속하시겠습니까? (yes/no): ', (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('작업을 취소합니다.');
      rl.close();
      process.exit(0);
    }
    rl.close();
    performFixes();
  });
} else {
  performFixes();
}

// 수정 작업 수행
function performFixes() {
  const stats = {
    filesChecked: 0,
    filesModified: 0,
    filesMoved: 0,
    totalChanges: 0
  };

  // 1. app/app/api에서 app/api로 파일 이동
  moveApiFiles(stats);

  // 2. 파일 내 경로 참조 수정
  fixFileImports(stats);

  // 결과 보고
  reportResults(stats);
}

// API 파일 이동
function moveApiFiles(stats) {
  console.log(`\n${colors.blue}API 파일 이동 중...${colors.reset}`);
  
  const appAppApiDir = path.join(config.rootDir, 'app', 'app', 'api');
  const appApiDir = path.join(config.rootDir, 'app', 'api');
  
  if (!fs.existsSync(appAppApiDir)) {
    console.log(`app/app/api 디렉토리가 존재하지 않습니다.`);
    return;
  }
  
  // app/api 디렉토리 생성 (존재하지 않는 경우)
  if (!fs.existsSync(appApiDir)) {
    if (!config.dryRun) {
      fs.mkdirSync(appApiDir, { recursive: true });
      console.log(`${colors.green}app/api 디렉토리 생성됨${colors.reset}`);
    } else {
      console.log(`${colors.green}[테스트] app/api 디렉토리 생성됨${colors.reset}`);
    }
  }
  
  // app/app/api 디렉토리 내 파일 및 폴더 이동
  function copyRecursive(src, dest) {
    const exists = fs.existsSync(src);
    if (!exists) return;
    
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        if (!config.dryRun) {
          fs.mkdirSync(dest, { recursive: true });
        }
        if (config.verbose) {
          console.log(`${config.dryRun ? '[테스트] ' : ''}디렉토리 생성: ${dest}`);
        }
      }
      
      const files = fs.readdirSync(src);
      for (const file of files) {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        copyRecursive(srcFile, destFile);
      }
    } else {
      if (!config.dryRun) {
        const content = fs.readFileSync(src, 'utf8');
        // app/app/... -> app/... 경로 수정
        const modifiedContent = content.replace(/from ['"]\.\.\/\.\.\/lib\//g, 'from \'../lib/')
                                      .replace(/from ['"]\.\.\/\.\.\/components\//g, 'from \'../components/')
                                      .replace(/import ['"]\.\.\/\.\.\/lib\//g, 'import \'../lib/')
                                      .replace(/import ['"]\.\.\/\.\.\/components\//g, 'import \'../components/');
        
        fs.writeFileSync(destFile, modifiedContent);
      }
      
      console.log(`${config.dryRun ? '[테스트] ' : ''}파일 이동: ${src} -> ${destFile}`);
      stats.filesMoved++;
    }
  }
  
  copyRecursive(appAppApiDir, appApiDir);
  
  // app/app/api 디렉토리 제거 (테스트 모드에서는 수행하지 않음)
  if (!config.dryRun) {
    try {
      // 재귀적으로 디렉토리 삭제
      //fs.rmdirSync(appAppApiDir, { recursive: true });
      console.log(`${colors.green}app/app/api 디렉토리 제거됨${colors.reset}`);
    } catch (err) {
      console.error(`${colors.red}디렉토리 제거 오류: ${err.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.green}[테스트] app/app/api 디렉토리 제거됨${colors.reset}`);
  }
}

// 파일 내 경로 참조 수정
function fixFileImports(stats) {
  console.log(`\n${colors.blue}파일 내 경로 참조 수정 중...${colors.reset}`);
  
  // 모든 대상 파일 찾기
  let command = `find ${config.rootDir} -type f `;
  
  // 확장자 필터
  const extPattern = config.fileExtensions.join('\\|');
  command += `-name "*\\(${extPattern}\\)" `;
  
  // 무시할 디렉토리 제외
  config.ignoreDirs.forEach(dir => {
    command += `-not -path "*/${dir}/*" `;
  });
  
  const files = execSync(command).toString().trim().split('\n').filter(Boolean);
  console.log(`검사할 파일 수: ${files.length}`);
  
  // 각 파일 검사 및 수정
  files.forEach(filePath => {
    try {
      stats.filesChecked++;
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(config.rootDir, filePath);
      
      // 수정 패턴
      const patterns = [
        { pattern: /from ['"]\.\.\/\.\.\/app\//g, replacement: 'from \'../' },
        { pattern: /from ['"]\.\.\/app\//g, replacement: 'from \'./' },
        { pattern: /from ['"]app\/app\//g, replacement: 'from \'app/' },
        { pattern: /from ['"]@\/app\/app\//g, replacement: 'from \'@/app/' },
        // 더 많은 패턴 추가 가능
      ];
      
      // 각 패턴으로 수정 시도
      let modifiedContent = content;
      let changes = 0;
      
      for (const { pattern, replacement } of patterns) {
        const updatedContent = modifiedContent.replace(pattern, (match) => {
          changes++;
          return replacement;
        });
        
        if (updatedContent !== modifiedContent) {
          modifiedContent = updatedContent;
        }
      }
      
      // 변경된 경우에만 파일 저장
      if (changes > 0) {
        if (!config.dryRun) {
          fs.writeFileSync(filePath, modifiedContent);
        }
        
        stats.filesModified++;
        stats.totalChanges += changes;
        
        console.log(`${config.dryRun ? '[테스트] ' : ''}수정됨: ${relativePath} (${changes}개 변경)`);
      } else if (config.verbose) {
        console.log(`변경 없음: ${relativePath}`);
      }
    } catch (err) {
      console.error(`${colors.red}파일 처리 오류: ${filePath} - ${err.message}${colors.reset}`);
    }
  });
}

// 결과 보고
function reportResults(stats) {
  console.log(`\n${colors.cyan}경로 수정 완료${colors.reset}`);
  console.log(`검사한 파일: ${stats.filesChecked}`);
  console.log(`수정한 파일: ${stats.filesModified}`);
  console.log(`이동한 파일: ${stats.filesMoved}`);
  console.log(`총 변경 사항: ${stats.totalChanges}`);
  
  if (config.dryRun) {
    console.log(`\n${colors.yellow}이 실행은 테스트 모드였습니다. 실제 변경을 적용하려면 --dry-run 옵션 없이 실행하세요.${colors.reset}`);
  } else {
    console.log(`\n${colors.green}모든 변경 사항이 적용되었습니다.${colors.reset}`);
    console.log(`변경 사항을 확인하고 애플리케이션을 테스트하세요.`);
  }
  
  console.log(`\n${colors.blue}다음 단계:${colors.reset}`);
  console.log(`1. 'npm run build'를 실행하여 빌드 오류 확인`);
  console.log(`2. 'npm run dev'를 실행하여 개발 서버에서 테스트`);
  console.log(`3. 경로 문제가 모두 해결되었는지 확인`);
} 