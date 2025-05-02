/**
 * API 라우트 파일의 statusCode 속성 오류와 로깅 문제를 수정하는 스크립트
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// API 디렉토리 경로
const API_DIR = path.join(process.cwd(), 'app/api');

// 실행 시작 로그
console.log('=== API 라우트 파일 오류 수정 스크립트 시작 ===');

// 디렉토리 내 모든 파일을 재귀적으로 처리하는 함수
async function processDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    // 각 항목 처리
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // 디렉토리인 경우 재귀적으로 처리
        await processDirectory(fullPath);
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js')) {
        // TS/JS 파일인 경우 내용 수정
        await processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`디렉토리 처리 중 오류 발생 (${dirPath}):`, error);
  }
}

// 파일 내용 수정 함수
async function processFile(filePath) {
  try {
    // 파일 내용 읽기
    const content = await readFile(filePath, 'utf8');
    
    // 1. ApiError의 statusCode 속성을 status로 수정
    const statusCodePattern = /error instanceof ApiError\s*\)\s*{\s*.*?status\s*=\s*error\.statusCode/gs;
    
    // 2. 로깅 함수 호출 수정
    const loggerInfoPattern = /logger\.(info|log|error|warn)\(\{([^}]+)\}\)/gs;
    
    // 3. 로깅 객체 인자 수정
    const loggerStringPattern = /logger\.(info|log|error|warn)\((['"])(.+?)(['"])/g;
    
    // 변경 내용 적용
    let updatedContent = content
      // statusCode를 status로 변경
      .replace(statusCodePattern, (match) => {
        return match.replace(/statusCode/g, 'status');
      })
      // 로깅 함수 호출 형식 수정 (선택적)
      .replace(loggerStringPattern, (match, method, quote1, message, quote2) => {
        return `logger.${method}(${quote1}${message}${quote2}`;
      });
    
    // 변경사항이 있는 경우에만 파일 업데이트
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent);
      console.log(`✅ ${filePath} 파일 오류 수정 완료`);
    } else {
      console.log(`ℹ️ ${filePath} 파일에는 변경이 필요 없습니다`);
    }
  } catch (error) {
    console.error(`파일 처리 중 오류 발생 (${filePath}):`, error);
  }
}

// 실행 시작
async function main() {
  try {
    // API 디렉토리 존재 확인
    const apiStats = await stat(API_DIR);
    
    if (!apiStats.isDirectory()) {
      throw new Error(`${API_DIR}는 디렉토리가 아닙니다`);
    }
    
    // API 디렉토리 처리 시작
    await processDirectory(API_DIR);
    
    console.log('=== 모든 API 라우트 파일 오류 수정 완료 ===');
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 