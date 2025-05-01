/**
 * API 라우트 파일에서 @/lib 경로를 상대 경로로 변환하는 스크립트
 * Vercel 배포 오류를 해결하기 위한 조치
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
console.log('=== API 라우트 파일 경로 수정 스크립트 시작 ===');

// 디렉토리 내 모든 파일을 재귀적으로 처리하는 함수
async function processDirectory(dirPath, relativePath = '../') {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    // 각 항목 처리
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // 디렉토리인 경우 재귀적으로 처리
        // 디렉토리 레벨이 깊어질 때마다 상대 경로 업데이트 (../ 추가)
        await processDirectory(fullPath, relativePath + '../');
      } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js')) {
        // TS/JS 파일인 경우 내용 수정
        await processFile(fullPath, relativePath);
      }
    }
  } catch (error) {
    console.error(`디렉토리 처리 중 오류 발생 (${dirPath}):`, error);
  }
}

// 파일 내용 수정 함수
async function processFile(filePath, relativePath) {
  try {
    // 파일 내용 읽기
    const content = await readFile(filePath, 'utf8');
    
    // @/lib/ 패턴을 찾아 상대 경로로 변환
    const updatedContent = content.replace(/@\/lib\//g, relativePath + 'lib/');
    
    // 변경사항이 있는 경우에만 파일 업데이트
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent);
      console.log(`✅ ${filePath} 파일 경로 업데이트 완료`);
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
    
    console.log('=== 모든 API 라우트 파일 경로 수정 완료 ===');
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 