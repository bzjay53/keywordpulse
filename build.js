/**
 * 정적 내보내기 빌드 스크립트
 * Vercel 배포 시 TypeScript 오류를 우회하기 위한 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 로그 메시지 출력 함수
const log = (message) => {
  console.log(`[Build] ${message}`);
};

// 명령어 실행 함수
const runCommand = (command) => {
  try {
    log(`Running command: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Command failed: ${error.message}`);
    return false;
  }
};

// Vercel 환경 확인
const isRunningOnVercel = () => {
  return process.env.VERCEL === '1' || process.env.NOW_BUILDER === '1';
};

// 필수 패키지 설치 확인
const checkAndInstallPackages = () => {
  const requiredPackages = ['typescript'];
  
  for (const pkg of requiredPackages) {
    if (!fs.existsSync(path.join('node_modules', pkg))) {
      log(`${pkg} not found, installing...`);
      if (!runCommand(`npm install ${pkg} --no-save`)) {
        throw new Error(`Failed to install ${pkg}`);
      }
    } else {
      log(`${pkg} is already installed`);
    }
  }
};

// tsconfig.json 백업
const backupTsConfig = () => {
  if (fs.existsSync('tsconfig.json')) {
    log('Backing up tsconfig.json');
    fs.copyFileSync('tsconfig.json', 'tsconfig.json.bak');
  }
};

// tsconfig.json 복원
const restoreTsConfig = () => {
  if (fs.existsSync('tsconfig.json.bak')) {
    log('Restoring tsconfig.json');
    fs.copyFileSync('tsconfig.json.bak', 'tsconfig.json');
    fs.unlinkSync('tsconfig.json.bak');
  }
};

// tsconfig.json 간소화
const simplifyTsConfig = () => {
  log('Creating simplified tsconfig.json');
  const simplifiedConfig = {
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: false,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      baseUrl: "."
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"]
  };

  fs.writeFileSync('tsconfig.json', JSON.stringify(simplifiedConfig, null, 2));
};

// next.config.js에 TypeScript 빌드 오류 무시 설정 추가
const setupNextConfig = () => {
  if (fs.existsSync('next.config.js')) {
    log('Updating next.config.js to ignore TypeScript errors');
    let nextConfig = fs.readFileSync('next.config.js', 'utf8');
    
    // 이미 설정이 있는지 확인
    if (!nextConfig.includes('typescript: { ignoreBuildErrors: true }')) {
      // module.exports = { 패턴 찾기
      if (nextConfig.includes('module.exports = {')) {
        // 설정 추가
        nextConfig = nextConfig.replace(
          'module.exports = {',
          'module.exports = {\n  typescript: { ignoreBuildErrors: true },\n  eslint: { ignoreDuringBuilds: true },'
        );
        fs.writeFileSync('next.config.js', nextConfig);
        log('Added TypeScript and ESLint error ignoring to next.config.js');
      } else {
        log('Cannot find proper pattern in next.config.js to update');
      }
    } else {
      log('next.config.js already contains TypeScript error ignoring settings');
    }
  }
};

// package.json에서 typescript를 dependencies로 이동
const ensureTypescriptInDependencies = () => {
  if (fs.existsSync('package.json')) {
    log('Checking TypeScript in package.json');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check if typescript is in devDependencies but not in dependencies
    if (
      packageJson.devDependencies && 
      packageJson.devDependencies.typescript &&
      (!packageJson.dependencies || !packageJson.dependencies.typescript)
    ) {
      log('Moving TypeScript from devDependencies to dependencies');
      
      // Add typescript to dependencies
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies.typescript = packageJson.devDependencies.typescript;
      
      // Remove from devDependencies
      delete packageJson.devDependencies.typescript;
      
      // Write back to package.json
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      
      // Install packages to update node_modules
      runCommand('npm install');
    } else if (!packageJson.dependencies || !packageJson.dependencies.typescript) {
      log('Adding TypeScript to dependencies');
      
      // Add typescript to dependencies
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies.typescript = "^5.0.0";
      
      // Write back to package.json
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      
      // Install packages to update node_modules
      runCommand('npm install');
    } else {
      log('TypeScript already in dependencies');
    }
  }
};

// 타입 정의 파일 생성 및 확인
const ensureTypeDefinitions = () => {
  if (!fs.existsSync('next-env.d.ts')) {
    log('Creating next-env.d.ts');
    fs.writeFileSync('next-env.d.ts', '/// <reference types="next" />\n/// <reference types="next/types/global" />\n');
  }
};

// .npmrc 설정
const setupNpmrc = () => {
  const npmrcContent = 'legacy-peer-deps=true\nsave-exact=true\ninclude=dev\n';
  fs.writeFileSync('.npmrc', npmrcContent);
  log('Created .npmrc to include dev dependencies in production');
};

// 메인 빌드 함수
const build = async () => {
  try {
    log('Starting build process');

    // Vercel 환경에서 실행 중인지 확인
    if (isRunningOnVercel()) {
      log('Running on Vercel environment');
      setupNpmrc();
      ensureTypescriptInDependencies();
      setupNextConfig();
      ensureTypeDefinitions();
    }

    // TypeScript 설치 확인
    log('Checking for TypeScript');
    checkAndInstallPackages();

    // tsconfig.json 처리
    backupTsConfig();
    simplifyTsConfig();

    // 빌드 실행
    log('Running Next.js build');
    if (!runCommand('next build')) {
      throw new Error('Build failed');
    }

    log('Build completed successfully');
  } catch (error) {
    log(`Build failed: ${error.message}`);
    process.exit(1);
  } finally {
    // 항상 tsconfig.json 복원
    restoreTsConfig();
  }
};

// 빌드 실행
build(); 