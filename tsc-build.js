/**
 * TypeScript 파일을 JavaScript로 변환하는 스크립트
 * Vercel 배포를 위한 임시 해결책
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// TypeScript 설치
console.log('TypeScript 패키지 설치 중...');
exec('npm install typescript --no-save', (error, stdout, stderr) => {
  if (error) {
    console.error(`TypeScript 설치 오류: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`TypeScript 설치 경고: ${stderr}`);
  }
  
  console.log(`TypeScript 설치 완료: ${stdout}`);
  
  // tsconfig.json 생성
  console.log('임시 tsconfig.json 생성 중...');
  const tsConfig = {
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: false,
      noEmit: false,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      outDir: "out-js"
    },
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"]
  };
  
  fs.writeFileSync('tsconfig.temp.json', JSON.stringify(tsConfig, null, 2));
  
  // TypeScript 컴파일 실행
  console.log('TypeScript 컴파일 실행 중...');
  exec('npx tsc --project tsconfig.temp.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`컴파일 오류 (무시됨): ${error.message}`);
    }
    
    if (stderr) {
      console.error(`컴파일 경고: ${stderr}`);
    }
    
    console.log(`컴파일 출력: ${stdout || "출력 없음 (성공)"}`);
    
    // Next.js 빌드 실행
    console.log('Next.js 빌드 실행 중...');
    exec('NODE_OPTIONS=--max_old_space_size=4096 NEXT_TELEMETRY_DISABLED=1 next build', (error, stdout, stderr) => {
      if (error) {
        console.error(`Next.js 빌드 오류: ${error.message}`);
        process.exit(1);
      }
      
      if (stderr) {
        console.error(`Next.js 빌드 경고: ${stderr}`);
      }
      
      console.log(`Next.js 빌드 출력: ${stdout}`);
      console.log('빌드 성공!');
    });
  });
}); 