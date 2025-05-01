#!/bin/bash
set -e

# 디버깅 정보 출력
echo "====================================================="
echo "=== Vercel 빌드 스크립트 시작 ($(date)) ==="
echo "====================================================="

echo "=== 현재 디렉토리 확인 ==="
pwd
ls -la

# Node.js 및 NPM 버전 확인
echo "=== Node.js 및 NPM 버전 ==="
node --version
npm --version

echo "====================================================="
echo "=== 경로 수정 프로세스 시작 ==="
echo "====================================================="

# 1. 모든 API 라우트 파일에서 @/lib 경로를 상대 경로로 변환
echo "=== API 라우트 경로 변환 스크립트 실행 ==="
node scripts/path-fix.js

# 2. app/lib 디렉토리 확인 및 생성
echo "=== app/lib 디렉토리 확인 ==="
if [ ! -d "app/lib" ]; then
  mkdir -p app/lib
  echo "app/lib 디렉토리가 생성되었습니다."
else
  echo "app/lib 디렉토리가 이미 존재합니다."
fi

# 3. lib 디렉토리 파일들을 app/lib 디렉토리로 복사
echo "=== lib/ 파일들을 app/lib/으로 복사 ==="
cp -f lib/*.ts app/lib/ || echo "복사할 .ts 파일이 없습니다."
cp -f lib/*.js app/lib/ || echo "복사할 .js 파일이 없습니다."
echo "파일 복사 완료!"

# 4. tsconfig.json 경로 구성 확인
echo "=== tsconfig.json paths 설정 확인 ==="
cat tsconfig.json | grep -A 10 '"paths"' || echo "tsconfig.json에서 paths를 찾을 수 없습니다."

# 5. app/tsconfig.json 설정 확인
if [ -f "app/tsconfig.json" ]; then
  echo "=== app/tsconfig.json paths 설정 확인 ==="
  cat app/tsconfig.json | grep -A 10 '"paths"' || echo "app/tsconfig.json에서 paths를 찾을 수 없습니다."
fi

# 6. next.config.js alias 확인
echo "=== next.config.js alias 설정 확인 ==="
cat next.config.js | grep -A 10 'alias' || echo "next.config.js에서 alias를 찾을 수 없습니다."

# 7. 참조 검증
echo "=== API 파일 참조 검증 ==="
find app/api -type f -name "*.ts" -o -name "*.js" | xargs grep -l "@/lib" || echo "모든 @/lib 참조가 수정되었습니다!"

echo "====================================================="
echo "=== Next.js 빌드 실행 ==="
echo "====================================================="

# 8. next.config.js 수정이 필요한 경우 임시 백업
if grep -q "output: 'export'" next.config.js; then
  echo "=== next.config.js 임시 수정 (output: 'export' 제거) ==="
  cp next.config.js next.config.js.bak
  sed -i "s/output: 'export',/\/\/ output: 'export',/" next.config.js
  echo "next.config.js 수정 완료"
fi

# 9. Next.js 빌드 실행
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max_old_space_size=4096 npx next build

# 10. next.config.js 원복
if [ -f "next.config.js.bak" ]; then
  echo "=== next.config.js 원복 ==="
  cp next.config.js.bak next.config.js
  rm next.config.js.bak
fi

# 상태 확인
exit_code=$?
if [ $exit_code -ne 0 ]; then
  echo "빌드 실패: 종료 코드 $exit_code"
  exit $exit_code
else
  echo "빌드 성공!"
fi

echo "====================================================="
echo "=== Vercel 빌드 스크립트 종료 ($(date)) ==="
echo "=====================================================" 