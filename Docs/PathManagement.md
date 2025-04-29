# KeywordPulse 경로 관리 가이드

이 문서는 KeywordPulse 프로젝트의 파일 경로 구조와 관리 방법에 대한 가이드라인을 제공합니다. 경로 참조의 일관성을 유지하고 구조적 문제를 예방하기 위한 전략을 설명합니다.

## 1. 현재 프로젝트 구조 개요

KeywordPulse 프로젝트는 Next.js의 App Router 구조를 기반으로 합니다. 현재 프로젝트는 다음과 같은 주요 디렉토리 구조를 가지고 있습니다:

```
keywordpulse/
├── app/             # 메인 애플리케이션 디렉토리
│   ├── api/         # API 라우트
│   ├── auth/        # 인증 관련 페이지
│   ├── components/  # 공통 컴포넌트
│   ├── hooks/       # 커스텀 훅
│   ├── lib/         # 유틸리티 함수 및 라이브러리
│   ├── trends/      # 트렌드 관련 페이지
│   └── [...]/       # 기타 페이지 및 레이아웃
├── components/      # 공유 컴포넌트
├── hooks/           # 공유 훅
├── lib/             # 공유 라이브러리
├── public/          # 정적 파일
├── styles/          # 스타일 파일
└── Docs/            # 프로젝트 문서
```

## 2. 식별된 경로 관리 문제점

### 2.1 중복 app 디렉토리 문제

현재 프로젝트에서는 다음과 같은 중복 구조가 발견되었습니다:

1. **중첩된 app 디렉토리**: `app/app/api/` 와 같은 중첩 구조 발생
2. **일관되지 않은 참조 경로**: 일부 파일에서는 상대 경로를, 다른 파일에서는 절대 경로(@/) 사용

이러한 문제로 인해:
- 빌드 오류 발생
- 개발 환경과 배포 환경 사이의 불일치
- 코드 유지 관리 어려움

### 2.2 import 경로 불일치

코드베이스 전체에서 다음과 같은 일관성 없는 import 경로가 사용되고 있습니다:

```typescript
// 일관성 없는 import 경로 예시
import { Button } from '../components/Button';  // 상대 경로
import { Button } from '@/components/Button';   // 절대 경로 (권장)
import { Button } from 'app/components/Button'; // 잘못된 절대 경로
```

## 3. 경로 관리 표준화 가이드라인

### 3.1 디렉토리 구조 원칙

- **단일 app 디렉토리**: 중첩된 app 디렉토리 사용 금지
- **명확한 역할 분리**: 컴포넌트, 훅, 유틸리티 등 역할별 디렉토리 분리
- **일관된 명명 규칙**: 모든 디렉토리와 파일은 카멜 케이스(camelCase) 사용

### 3.2 권장 import 경로 규칙

모든 imports는 다음 규칙을 따라야 합니다:

```typescript
// ✅ 권장 방식 - tsconfig.json의 path alias 사용
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { fetchData } from '@/lib/api';

// ❌ 지양해야 할 방식 - 상대 경로
import { Button } from '../components/Button';
import { Button } from '../../components/Button';

// ❌ 지양해야 할 방식 - 중첩된 app 경로
import { Button } from 'app/app/components/Button';
```

### 3.3 tsconfig.json 경로 별칭 설정

프로젝트에서는 다음과 같은 경로 별칭 설정을 사용합니다:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```

## 4. 경로 관리 자동화 도구

### 4.1 경로 참조 검증 스크립트

`scripts/path-check.js` 스크립트는 다음을 수행합니다:

- 중복 app 디렉토리 구조 감지
- 일관되지 않은 import 경로 식별
- 잠재적 문제 리포트 생성

사용 방법:
```bash
npm run path:check
```

### 4.2 자동 경로 수정 도구

`scripts/path-fix.js` 스크립트는 다음을 수행합니다:

- 중복 app 디렉토리 구조 수정
- import 경로 자동 표준화
- 개발자 승인 후 변경 적용

사용 방법:
```bash
# 드라이 런 (변경사항 미리보기)
npm run path:fix:dry

# 실제 수정 적용
npm run path:fix
```

### 4.3 CI/CD 연동

경로 검증은 CI/CD 파이프라인에 통합되어 있습니다:

```yaml
# GitHub Actions 워크플로우에서의 예제
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      # ...
      - name: Check path consistency
        run: npm run path:check
```

## 5. 경로 이슈 해결 가이드

### 5.1 중복 app 디렉토리 구조 해결

1. 자동 수정 도구 실행: `npm run path:fix`
2. 수정 후 빌드 테스트: `npm run build`
3. 중첩 구조가 여전히 발생하는 경우:
   - 중첩된 파일을 올바른 위치로 수동 이동
   - import 경로 업데이트
   - 영향받는 코드 재테스트

### 5.2 import 경로 표준화

모든 import 경로를 다음과 같이 표준화합니다:

1. 상대 경로를 절대 경로로 변환:
   ```typescript
   // 변경 전
   import { Button } from '../components/Button';
   
   // 변경 후
   import { Button } from '@/components/Button';
   ```

2. 중첩된 app 경로 제거:
   ```typescript
   // 변경 전
   import { api } from 'app/app/lib/api';
   
   // 변경 후
   import { api } from '@/lib/api';
   ```

## 6. Vercel 배포 관련 경로 고려사항

Vercel에 배포할 때 다음 사항을 고려해야 합니다:

1. **환경 변수**: 환경별 경로 차이를 관리하기 위한 환경 변수 설정
2. **빌드 설정**: Vercel의 빌드 설정에서 올바른 루트 디렉토리 지정
3. **Next.js 구성**: `next.config.js`에서 올바른 baseUrl 및 경로 설정

## 7. 경로 구조 모니터링 및 지속적 개선

### 7.1 정기적 검토

- 월간 코드 리뷰 중 경로 구조 검토
- 새로운 패턴 또는 문제점 식별
- 자동화 도구 개선 제안

### 7.2 신규 개발자 온보딩

신규 개발자를 위한 경로 관리 온보딩:

1. 이 문서 검토
2. 경로 검증 도구 사용법 교육
3. 코드 리뷰에서 경로 표준 준수 확인

## 8. 예정된 개선 사항

1. **통합 경로 검증 도구 개발**: 현재 별도로 운영 중인 검증 및 수정 도구 통합
2. **VSCode 확장 개발**: 경로 문제를 실시간으로 식별하는 VSCode 확장 프로그램
3. **import 자동 정렬**: import 문 자동 정렬 및 그룹화 도구

---

이 문서는 프로젝트의 경로 관리 전략이 발전함에 따라 지속적으로 업데이트됩니다. 문의사항이나 개선 제안은 프로젝트 리드에게 문의하세요. 