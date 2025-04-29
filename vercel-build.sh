#!/bin/bash
set -e

# 디버깅 정보 출력
echo "현재 디렉토리: $(pwd)"
echo "Node 버전: $(node -v)"
echo "NPM 버전: $(npm -v)"

# TypeScript 설치
echo "TypeScript 설치 중..."
npm install --no-save typescript

# 의존성 설치 확인
echo "의존성 설치 확인 중..."
if [ ! -d "node_modules/typescript" ]; then
  echo "TypeScript가 설치되지 않았습니다. 다시 설치 시도합니다."
  npm install --no-save typescript
fi

# Next.js 빌드 실행
echo "Next.js 빌드 실행 중..."
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max_old_space_size=4096 npx next build

# 상태 확인
exit_code=$?
if [ $exit_code -ne 0 ]; then
  echo "빌드 실패: 종료 코드 $exit_code"
  exit $exit_code
else
  echo "빌드 성공!"
fi 