#!/bin/bash

# 디버그 모드 활성화 (모든 명령어 출력)
set -x

echo "=== Vercel 빌드 스크립트 시작 ==="

# app/lib 디렉토리 생성 (없는 경우)
mkdir -p app/lib

# lib 디렉토리의 모든 .ts 파일 복사
echo "=== lib 파일 복사 시작 ==="
cp -f lib/*.ts app/lib/ || echo "TS 파일 복사 중 오류 발생"

# lib 디렉토리의 모든 .js 파일 복사
cp -f lib/*.js app/lib/ || echo "JS 파일 복사 중 오류 발생"

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

# tsconfig.json paths 확인 로그
echo "=== tsconfig.json paths 확인 ==="
cat tsconfig.json | grep -A 10 '"paths"'

# next.config.js alias 확인 로그
echo "=== next.config.js alias 확인 ==="
cat next.config.js | grep -A 10 'alias'

# 기본 빌드 명령어 실행
echo "=== Next.js 빌드 실행 ==="
npm run build

echo "=== Vercel 빌드 스크립트 종료 ===" 