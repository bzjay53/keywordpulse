#!/bin/bash

# 디버그 모드 활성화 (모든 명령어 출력)
set -x

echo "====================================================="
echo "=== Vercel 빌드 스크립트 시작 ($(date)) ==="
echo "====================================================="

echo "=== 현재 디렉토리 확인 ==="
pwd
ls -la

echo "====================================================="
echo "=== 경로 환경 문제 해결 시작 ==="
echo "====================================================="

# 1. Node.js 스크립트를 사용하여 app/lib 생성 및 경로 수정
echo "=== create-app-lib.js 스크립트 실행 (Node.js) ==="
node scripts/create-app-lib.js

# 2. 경로 검증
echo "=== API 파일 경로 검증 ==="
find app/api -name "*.ts" -type f -exec grep -l "@/lib" {} \; || echo "모든 @/lib 참조가 수정되었습니다!"

# 3. app/lib 설정 확인
echo "=== app/lib 디렉토리 내용 확인 ==="
ls -la app/lib/

echo "====================================================="
echo "=== 빌드 환경 정보 ==="
echo "====================================================="

# Node.js 및 NPM 버전 확인
echo "=== Node.js 및 NPM 버전 ==="
node --version
npm --version

# tsconfig.json paths 확인 로그
echo "=== tsconfig.json paths 확인 ==="
cat tsconfig.json | grep -A 10 '"paths"' || echo "tsconfig.json에서 paths를 찾을 수 없습니다."

# next.config.js alias 확인 로그
echo "=== next.config.js alias 확인 ==="
cat next.config.js | grep -A 10 'alias' || echo "next.config.js에서 alias를 찾을 수 없습니다."

echo "====================================================="
echo "=== Next.js 빌드 실행 ==="
echo "====================================================="
npm run build

echo "====================================================="
echo "=== Vercel 빌드 스크립트 종료 ($(date)) ==="
echo "=====================================================" 