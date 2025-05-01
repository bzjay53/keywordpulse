/**
 * app/lib 디렉토리 동기화 및 API 경로 참조 수정 스크립트
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { execSync } = require('child_process');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

// 디렉토리 경로
const LIB_DIR = path.join(process.cwd(), 'lib');
const APP_LIB_DIR = path.join(process.cwd(), 'app/lib');
const API_DIR = path.join(process.cwd(), 'app/api');

/**
 * app/lib 디렉토리 생성 및 lib 파일 복사
 */
async function syncLibFiles() {
  console.log('=== app/lib 디렉토리 동기화 시작 ===');
  
  // app/lib 디렉토리 생성 (없는 경우)
  try {
    await mkdir(APP_LIB_DIR, { recursive: true });
    console.log('app/lib 디렉토리가 생성되었습니다.');
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error('디렉토리 생성 중 오류 발생:', error);
      throw error;
    }
    console.log('app/lib 디렉토리가 이미 존재합니다.');
  }
  
  // lib 디렉토리의 모든 파일 목록 가져오기
  const libFiles = await readdir(LIB_DIR);
  
  // 모든 .ts, .js 파일 복사
  let copiedFiles = 0;
  
  for (const file of libFiles) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      const srcPath = path.join(LIB_DIR, file);
      const destPath = path.join(APP_LIB_DIR, file);
      
      try {
        await copyFile(srcPath, destPath);
        console.log(`${file} 파일이 복사되었습니다.`);
        copiedFiles++;
      } catch (error) {
        console.error(`${file} 파일 복사 중 오류 발생:`, error);
      }
    }
  }
  
  console.log(`총 ${copiedFiles}개 파일이 복사되었습니다.`);
  
  // index.js 파일 생성 (재내보내기)
  await createIndexFile();
  
  console.log('=== app/lib 디렉토리 동기화 완료 ===');
}

/**
 * index.js 파일 생성 (re-export)
 */
async function createIndexFile() {
  console.log('=== index.js 파일 생성 중 ===');
  
  const indexContent = `/**
 * app/lib 모듈 재내보내기 파일
 * 이 파일은 app/lib 디렉토리의 모든 모듈을 다시 내보냅니다.
 */

// 주요 모듈 내보내기
export * from './telegram';
export * from './errors';
export * from './exceptions';
export * from './logger';
export * from './trends_api';
export * from './rag_engine';
export * from './rag-integration';
export * from './supabaseClient';
export * from './analytics';
export * from './apiMetrics';
export * from './AuthContext';
export * from './utils';

// 기본 내보내기가 있는 모듈들
export { default as logger } from './logger';
export { createClient, supabase } from './supabaseClient';
`;

  try {
    await writeFile(path.join(APP_LIB_DIR, 'index.js'), indexContent);
    console.log('index.js 파일이 생성되었습니다.');
  } catch (error) {
    console.error('index.js 파일 생성 중 오류 발생:', error);
    throw error;
  }
}

/**
 * API 라우트 파일의 모듈 참조 경로 수정
 */
async function fixApiImports() {
  console.log('=== API 라우트 파일 경로 수정 시작 ===');
  
  // 경로 수정 규칙 - API 디렉토리 깊이별 맵핑
  const pathMappings = [
    {
      // app/api/xxx/route.ts 파일 - 상위 디렉토리 2개 올라감
      depth: 1,
      fromPrefix: '@/lib',
      toPrefix: '../../lib'
    },
    {
      // app/api/xxx/yyy/route.ts 파일 - 상위 디렉토리 3개 올라감
      depth: 2,
      fromPrefix: '@/lib',
      toPrefix: '../../../lib'
    },
    {
      // app/api/xxx/yyy/zzz/route.ts 파일 - 상위 디렉토리 4개 올라감
      depth: 3,
      fromPrefix: '@/lib',
      toPrefix: '../../../../lib'
    },
    {
      // app/api/xxx/yyy/zzz/www/route.ts 파일 - 상위 디렉토리 5개 올라감
      depth: 4,
      fromPrefix: '@/lib',
      toPrefix: '../../../../../lib'
    }
  ];
  
  // 재귀적으로 API 디렉토리 처리
  await processDirectory(API_DIR, 0, pathMappings);
  
  console.log('=== API 라우트 파일 경로 수정 완료 ===');
}

/**
 * 디렉토리 재귀적 처리
 */
async function processDirectory(dirPath, depth, pathMappings) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // 디렉토리인 경우 재귀 호출
      await processDirectory(entryPath, depth + 1, pathMappings);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
      // 파일인 경우 처리
      await processFile(entryPath, depth, pathMappings);
    }
  }
}

/**
 * 파일 내용 수정
 */
async function processFile(filePath, depth, pathMappings) {
  try {
    // route.ts 파일이 아닌 경우 제외
    if (!filePath.includes('route.ts') && !filePath.includes('route.js')) {
      return;
    }
    
    // 파일 내용 읽기
    const content = await readFile(filePath, 'utf8');
    
    // 적용할 매핑 찾기
    const mapping = pathMappings.find(m => m.depth === depth);
    if (!mapping) {
      console.log(`적절한 경로 매핑을 찾을 수 없습니다: ${filePath} (깊이: ${depth})`);
      return;
    }
    
    // 매핑 적용
    const updatedContent = content.replace(
      new RegExp(`from ['"]${mapping.fromPrefix}\\/(.*?)['"]`, 'g'),
      `from '${mapping.toPrefix}/$1'`
    );
    
    // 변경이 있는 경우에만 저장
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent);
      console.log(`✅ ${filePath} 파일 경로가 수정되었습니다.`);
    } else {
      console.log(`ℹ️ ${filePath} 파일에는 변경이 필요 없습니다.`);
    }
  } catch (error) {
    console.error(`${filePath} 파일 처리 중 오류 발생:`, error);
  }
}

/**
 * 일부 API 파일 수동 수정 - 경로가 정확하지 않은 특수 케이스
 */
async function fixSpecificFiles() {
  console.log('=== 특정 API 파일 수동 수정 시작 ===');
  
  const specificFiles = [
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/multi/route.ts'),
      from: "from '../../../lib/telegram'",
      to: "from '../../../../lib/telegram'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/multi/route.ts'),
      from: "from '../../../lib/errors'",
      to: "from '../../../../lib/errors'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/rag/route.ts'),
      from: "from '../../../lib/telegram'",
      to: "from '../../../../lib/telegram'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/rag/route.ts'),
      from: "from '../../../lib/rag-integration'",
      to: "from '../../../../lib/rag-integration'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/rag/route.ts'),
      from: "from '../../../lib/exceptions'",
      to: "from '../../../../lib/exceptions'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/test/route.ts'),
      from: "from '../../../lib/telegram'",
      to: "from '../../../../lib/telegram'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/test/route.ts'),
      from: "from '../../../lib/exceptions'",
      to: "from '../../../../lib/exceptions'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/validate/route.ts'),
      from: "from '../../../lib/telegram'",
      to: "from '../../../../lib/telegram'"
    },
    {
      path: path.join(process.cwd(), 'app/api/notify/telegram/validate/route.ts'),
      from: "from '../../../lib/errors'",
      to: "from '../../../../lib/errors'"
    }
  ];
  
  for (const file of specificFiles) {
    try {
      if (!fs.existsSync(file.path)) {
        console.log(`파일이 존재하지 않습니다: ${file.path}`);
        continue;
      }
      
      const content = await readFile(file.path, 'utf8');
      const updatedContent = content.replace(file.from, file.to);
      
      if (content !== updatedContent) {
        await writeFile(file.path, updatedContent);
        console.log(`✅ ${file.path} 파일을 수동으로 수정했습니다.`);
      } else {
        console.log(`ℹ️ ${file.path} 파일에는 이미 올바른 경로가 설정되어 있습니다.`);
      }
    } catch (error) {
      console.error(`수동 파일 수정 중 오류 발생 (${file.path}):`, error);
    }
  }
  
  console.log('=== 특정 API 파일 수동 수정 완료 ===');
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    console.log('=== 경로 동기화 스크립트 시작 ===');
    
    // 1. app/lib 디렉토리 동기화
    await syncLibFiles();
    
    // 2. API 라우트 파일 경로 수정
    await fixApiImports();
    
    // 3. 특정 파일 수동 수정
    await fixSpecificFiles();
    
    console.log('=== 경로 동기화 스크립트 완료 ===');
  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main(); 