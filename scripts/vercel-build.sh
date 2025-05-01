#!/bin/bash

# 디버그 모드 활성화 (모든 명령어 출력)
set -x

echo "=== Vercel 빌드 스크립트 시작 ==="
pwd
ls -la

# app/lib 디렉토리 생성 (없는 경우)
echo "=== app/lib 디렉토리 생성 ==="
mkdir -p app/lib

# lib 디렉토리가 존재하는지 확인
if [ ! -d "lib" ]; then
  echo "=== 오류: lib 디렉토리가 없습니다 ==="
  ls -la
  exit 1
fi

# lib 디렉토리의 모든 파일 목록 확인
echo "=== lib 디렉토리 내용 확인 ==="
ls -la lib/

# lib 디렉토리의 모든 .ts 파일 복사
echo "=== lib 파일 복사 시작 ==="
cp -fv lib/*.ts app/lib/ || echo "TS 파일 복사 중 오류 발생"

# lib 디렉토리의 모든 .js 파일 복사
cp -fv lib/*.js app/lib/ || echo "JS 파일 복사 중 오류 발생"

# 앱 API 디렉토리 내 모든 API 라우트 확인
echo "=== API 라우트 내 import 검사 ==="
find app/api -name "*.ts" -type f -exec grep -l "@/lib" {} \;

# app/lib 디렉토리 내용 확인
echo "=== app/lib 디렉토리 내용 확인 ==="
ls -la app/lib/

# lib/index.js 파일이 있는지 확인하고 없으면 생성
if [ ! -f app/lib/index.js ]; then
  echo "=== app/lib/index.js 파일 생성 ==="
  cat > app/lib/index.js << 'EOF'
/**
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
EOF
fi

# 필요한 경우: 모든 API 경로의 @/lib 참조를 상대 경로로 자동 변환
echo "=== @/lib 참조를 상대 경로로 자동 변환 ==="

# 1. app/api/notify/route.ts (2단계 중첩)
find app/api/notify -maxdepth 1 -name "*.ts" -type f -exec sed -i 's|@/lib/|../lib/|g' {} \;

# 2. app/api/notify/telegram/route.ts (3단계 중첩)
find app/api/notify/telegram -maxdepth 1 -name "*.ts" -type f -exec sed -i 's|@/lib/|../../lib/|g' {} \;

# 3. app/api/notify/telegram/*/route.ts (4단계 중첩)
find app/api/notify/telegram/* -maxdepth 1 -name "*.ts" -type f -exec sed -i 's|@/lib/|../../../lib/|g' {} \;

# 4. app/api/feedback, app/api/keywords 등 다른 2단계 경로
find app/api/* -maxdepth 1 -name "*.ts" -type f -not -path "app/api/notify*" -exec sed -i 's|@/lib/|../lib/|g' {} \;

# 모든 변경사항 확인 (디버깅용)
echo "=== 변경된 파일 내용 확인 ==="
find app/api -name "*.ts" -type f -exec grep -A 3 "import.*lib/" {} \; || echo "import 문이 발견되지 않았습니다."

# tsconfig.json paths 확인 로그
echo "=== tsconfig.json paths 확인 ==="
cat tsconfig.json | grep -A 10 '"paths"' || echo "tsconfig.json에서 paths를 찾을 수 없습니다."

# next.config.js alias 확인 로그
echo "=== next.config.js alias 확인 ==="
cat next.config.js | grep -A 10 'alias' || echo "next.config.js에서 alias를 찾을 수 없습니다."

# 기본 빌드 명령어 실행
echo "=== Next.js 빌드 실행 ==="
npm run build

echo "=== Vercel 빌드 스크립트 종료 ===" 