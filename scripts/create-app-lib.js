/**
 * app/lib 디렉토리와 필요한 모듈 파일들을 자동으로 생성하는 스크립트
 * 빌드 오류를 해결하기 위한 임시 조치입니다.
 */

const fs = require('fs');
const path = require('path');

// 필요한 디렉토리 경로
const APP_LIB_DIR = path.join(process.cwd(), 'app/lib');
const LIB_DIR = path.join(process.cwd(), 'lib');

// app/lib 디렉토리 생성
console.log('=== app/lib 디렉토리 생성 ===');
if (!fs.existsSync(APP_LIB_DIR)) {
  fs.mkdirSync(APP_LIB_DIR, { recursive: true });
  console.log(`${APP_LIB_DIR} 디렉토리가 생성되었습니다.`);
} else {
  console.log(`${APP_LIB_DIR} 디렉토리가 이미 존재합니다.`);
}

// lib 디렉토리에서 모든 .ts 및 .js 파일 목록 가져오기
if (!fs.existsSync(LIB_DIR)) {
  console.error('=== 오류: lib 디렉토리가 없습니다 ===');
  process.exit(1);
}

// 모든 .ts 및 .js 파일 복사
const copyFiles = () => {
  let filesCopied = 0;
  
  // TS 파일 복사
  console.log('=== lib/*.ts 파일 복사 ===');
  fs.readdirSync(LIB_DIR)
    .filter(file => file.endsWith('.ts'))
    .forEach(file => {
      const srcPath = path.join(LIB_DIR, file);
      const destPath = path.join(APP_LIB_DIR, file);
      
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`${file} 파일이 복사되었습니다.`);
        filesCopied++;
      } catch (err) {
        console.error(`${file} 파일 복사 중 오류 발생:`, err);
      }
    });
    
  // JS 파일 복사
  console.log('=== lib/*.js 파일 복사 ===');
  fs.readdirSync(LIB_DIR)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const srcPath = path.join(LIB_DIR, file);
      const destPath = path.join(APP_LIB_DIR, file);
      
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`${file} 파일이 복사되었습니다.`);
        filesCopied++;
      } catch (err) {
        console.error(`${file} 파일 복사 중 오류 발생:`, err);
      }
    });
    
  return filesCopied;
};

// index.js 파일 생성 (lib에서 export하는 모든 모듈을 다시 export)
const createIndexFile = () => {
  console.log('=== app/lib/index.js 파일 생성 ===');
  const indexContent = `/**
 * lib 모듈 통합 내보내기
 * 경로 문제 해결을 위한 파일
 */

// 모든 모듈 내보내기
export * from './telegram';
export * from './errors';
export * from './exceptions';
export * from './logger';
export * from './trends_api';
export * from './rag_engine';
export * from './supabaseClient';
export * from './rag-integration';

// 기본 내보내기가 있는 모듈들
export { default as telegram } from './telegram';
export { default as logger } from './logger';
export { createClient, supabase } from './supabaseClient';
export { default as ragEngine } from './rag_engine';
export { default as ragIntegration, clearCache } from './rag-integration';
`;

  try {
    fs.writeFileSync(path.join(APP_LIB_DIR, 'index.js'), indexContent);
    console.log('index.js 파일이 생성되었습니다.');
    return true;
  } catch (err) {
    console.error('index.js 파일 생성 중 오류 발생:', err);
    return false;
  }
};

// API 파일에서 절대 경로 참조를 상대 경로로 수정하는 함수
const updateApiImports = () => {
  console.log('=== API 라우트 파일 경로 수정 ===');
  
  // 경로 레벨에 따른 상대 경로 맵
  const pathMap = {
    'app/api': '../lib/',
    'app/api/notify': '../lib/',
    'app/api/feedback': '../lib/',
    'app/api/notify/telegram': '../../lib/',
    'app/api/notify/telegram/multi': '../../../lib/',
    'app/api/notify/telegram/rag': '../../../lib/',
    'app/api/notify/telegram/test': '../../../lib/',
    'app/api/notify/telegram/validate': '../../../lib/'
  };
  
  // 각 디렉토리에 대해 파일 수정
  Object.entries(pathMap).forEach(([dir, relativePath]) => {
    const dirPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`${dirPath} 디렉토리가 존재하지 않습니다.`);
      return;
    }
    
    fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.ts'))
      .forEach(file => {
        const filePath = path.join(dirPath, file);
        
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // @/lib/ 경로를 상대 경로로 변환
          const updatedContent = content.replace(/@\/lib\//g, relativePath);
          
          if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`${filePath} 파일의 경로가 업데이트되었습니다.`);
          } else {
            console.log(`${filePath} 파일은 이미 상대 경로를 사용하고 있습니다.`);
          }
        } catch (err) {
          console.error(`${filePath} 파일 처리 중 오류 발생:`, err);
        }
      });
  });
  
  console.log('API 라우트 파일 경로 수정이 완료되었습니다.');
};

// 스크립트 실행
console.log('=== app/lib 디렉토리 생성 스크립트 시작 ===');
const filesCopied = copyFiles();
const indexCreated = createIndexFile();
updateApiImports();

console.log(`
=== 스크립트 실행 완료 ===
- 복사된 파일 수: ${filesCopied}
- index.js 생성: ${indexCreated ? '성공' : '실패'}
`); 