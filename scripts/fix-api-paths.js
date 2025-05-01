/**
 * API 라우트 파일의 모듈 경로를 정확히 수정하는 스크립트
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { execSync } = require('child_process');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// 디렉토리 매핑 설정
const PATHS_MAPPING = {
  'app/api/notify/route.ts': {
    from: '../lib/',
    to: '../../lib/'
  },
  'app/api/notify/telegram/route.ts': {
    from: '../../../lib/',
    to: '../../../lib/'
  },
  'app/api/notify/telegram/multi/route.ts': {
    from: '../../../lib/',
    to: '../../../../lib/'
  },
  'app/api/notify/telegram/rag/route.ts': {
    from: '../../../lib/',
    to: '../../../../lib/'
  },
  'app/api/notify/telegram/test/route.ts': {
    from: '../../../lib/',
    to: '../../../../lib/'
  },
  'app/api/notify/telegram/validate/route.ts': {
    from: '../../../lib/',
    to: '../../../../lib/'
  }
};

async function fixFiles() {
  console.log('API 경로 수정 스크립트 시작...');
  
  // 모든 파일 목록을 가져옵니다
  const filesList = Object.keys(PATHS_MAPPING);
  
  for (const filePath of filesList) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      
      // 파일 존재 여부 확인
      if (!fs.existsSync(fullPath)) {
        console.log(`파일이 존재하지 않습니다: ${filePath}`);
        continue;
      }
      
      // 파일 내용 읽기
      console.log(`파일 수정 중: ${filePath}`);
      const content = await readFile(fullPath, 'utf8');
      
      // 경로 매핑 가져오기
      const mapping = PATHS_MAPPING[filePath];
      
      // 경로 수정
      let updatedContent = content;
      
      if (mapping) {
        const regex = new RegExp(`from ['"]${mapping.from}`, 'g');
        updatedContent = content.replace(regex, `from '${mapping.to}`);
        
        // 변경사항이 있는 경우에만 파일 업데이트
        if (content !== updatedContent) {
          await writeFile(fullPath, updatedContent);
          console.log(`✅ ${filePath} 파일 경로 업데이트 완료`);
        } else {
          console.log(`ℹ️ ${filePath} 파일에는 변경이 필요 없습니다`);
        }
      }
    } catch (error) {
      console.error(`파일 처리 중 오류 발생 (${filePath}):`, error);
    }
  }
  
  console.log('API 경로 수정 완료');
}

// 스크립트 실행
fixFiles().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
}); 