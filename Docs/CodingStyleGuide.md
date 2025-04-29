# 코딩 스타일 가이드

## 1. 개요

이 문서는 KeywordPulse 프로젝트의 코드 작성 스타일에 대한 가이드라인을 제공합니다. 일관된 코딩 스타일을 유지하는 것은 코드의 가독성을 높이고 유지보수를 용이하게 합니다.

## 2. 일반 원칙

- **가독성 우선**: 항상 코드의 가독성을 최우선으로 고려합니다.
- **일관성**: 프로젝트 전체에 걸쳐 일관된 스타일을 유지합니다.
- **단순성**: 복잡한 코드보다 단순하고 명확한 코드를 선호합니다.
- **자체 문서화 코드**: 코드 자체가 그 의도를 명확하게 전달할 수 있어야 합니다.

## 3. 파일 구조

### 3.1 파일 명명 규칙

- **컴포넌트 파일**: PascalCase 사용 (예: `KeywordTable.tsx`)
- **유틸리티/라이브러리 파일**: camelCase 사용 (예: `supabaseClient.ts`)
- **훅 파일**: `use` 접두사 + PascalCase 사용 (예: `useKeywordSorting.tsx`)
- **테스트 파일**: 테스트 대상 파일명 + `.test.ts(x)` (예: `KeywordTable.test.tsx`)

### 3.2 디렉토리 구조

- 기능 또는 도메인 별로 디렉토리 구성
- 관련 파일들은 가능한 같은 디렉토리에 위치
- 깊은 중첩 구조 대신 평평한 구조 선호

## 4. TypeScript / JavaScript 스타일

### 4.1 변수 선언

- 가능한 `const`를 사용하고, 필요한 경우에만 `let` 사용
- `var` 사용 금지
- 변수는 사용 직전에 선언

```typescript
// 좋은 예
const userName = 'user123';
let count = 0;

// 나쁜 예
var userName = 'user123';
```

### 4.2 명명 규칙

- **변수/함수**: camelCase (예: `userData`, `fetchResults()`)
- **클래스/인터페이스/타입**: PascalCase (예: `UserProfile`, `KeywordResult`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- **불리언 변수**: is/has/should 접두사 (예: `isLoading`, `hasError`)
- **프라이빗 멤버/메서드**: `_` 접두사 (예: `_privateMethod()`)

### 4.3 함수 선언

- 함수 표현식보다 화살표 함수 선호
- 함수 이름은 동사 또는 동사구로 시작
- 함수는 한 가지 작업만 수행하도록 구성

```typescript
// 좋은 예
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// 나쁜 예
function calc(i) {
  // 여러 작업 수행...
}
```

### 4.4 타입 정의

- 명시적 타입 지정 선호
- 복잡한 타입은 별도 인터페이스/타입으로 정의
- `any` 사용 자제, 필요시 `unknown`으로 대체

```typescript
// 좋은 예
interface UserData {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (userId: string): Promise<UserData> => {
  // ...
};

// 나쁜 예
const fetchUser = async (userId) => {
  // ...
};
```

## 5. React 컴포넌트 스타일

### 5.1 컴포넌트 선언

- 함수형 컴포넌트 사용
- 컴포넌트 이름은 PascalCase로 선언
- 가능한 화살표 함수로 컴포넌트 정의

```typescript
// 좋은 예
const UserProfile: React.FC<UserProfileProps> = ({ userId, name }) => {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>ID: {userId}</p>
    </div>
  );
};

// 또는
export default function UserProfile({ userId, name }: UserProfileProps) {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>ID: {userId}</p>
    </div>
  );
}
```

### 5.2 컴포넌트 구성

컴포넌트 파일은 다음 순서로 구성:

1. 임포트 문
2. 타입/인터페이스 정의
3. 상수/헬퍼 함수
4. 컴포넌트 선언
   - 상태(state) 선언
   - 훅 사용
   - 이벤트 핸들러
   - 메모이제이션 로직
   - 렌더링 로직
5. 내보내기(export) 문

```typescript
// 임포트
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/lib/AuthContext';

// 타입 정의
interface ProfileProps {
  userId: string;
}

// 헬퍼 함수
const formatName = (name: string): string => name.trim();

// 컴포넌트
const Profile: React.FC<ProfileProps> = ({ userId }) => {
  // 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 훅
  const { user } = useAuth();
  
  // 이벤트 핸들러
  const handleClick = () => {
    // ...
  };
  
  // 사이드 이펙트
  useEffect(() => {
    // ...
  }, [userId]);
  
  // 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 내보내기
export default Profile;
```

### 5.3 JSX 스타일

- 조건부 렌더링은 삼항 연산자 또는 논리 연산자 사용
- props가 많은 경우 여러 줄로 나누어 작성
- className은 문자열 템플릿 또는 조건부 클래스 유틸리티(clsx, tailwind-merge) 사용

```typescript
// 조건부 렌더링
{isLoading ? <Spinner /> : <Content />}
{hasError && <ErrorMessage />}

// props 작성
<Button
  variant="primary"
  size="large"
  onClick={handleClick}
  disabled={isSubmitting}
>
  제출
</Button>

// 조건부 클래스
<div
  className={clsx(
    'base-style',
    isActive && 'active-style',
    hasError && 'error-style'
  )}
>
  내용
</div>
```

## 6. CSS / Styling

### 6.1 TailwindCSS 사용

- TailwindCSS 클래스는 일관된 순서로 정렬
  - 레이아웃(display, position)
  - 크기(width, height)
  - 간격(margin, padding)
  - 테두리(border)
  - 배경(background)
  - 텍스트(font, text)
  - 기타(opacity, cursor)

```html
<div className="flex items-center justify-between w-full p-4 mb-2 border rounded-md bg-white text-gray-800 hover:bg-gray-50">
  내용
</div>
```

### 6.2 Custom CSS

- 필요한 경우에만 사용자 정의 CSS 작성
- CSS 모듈 또는 CSS-in-JS 라이브러리 사용
- 글로벌 스타일은 최소화

## 7. 주석 및 문서화

### 7.1 코드 주석

- 복잡한 로직에만 주석 추가
- "무엇을"이 아닌 "왜"에 초점을 맞추어 주석 작성
- 주석은 항상 최신 상태 유지

```typescript
// 나쁜 예
// 카운터 증가
const incrementCounter = () => {
  count += 1;
};

// 좋은 예
// 연속 클릭을 방지하기 위해 쿨다운 기간 동안 버튼 비활성화
const handleSubmit = () => {
  submitForm();
  setIsDisabled(true);
  setTimeout(() => setIsDisabled(false), 1000);
};
```

### 7.2 JSDoc 문서화

- 공개 API와 복잡한 함수에 JSDoc 주석 사용
- 파라미터, 반환 값, 예외 설명

```typescript
/**
 * 키워드 점수에 따라 추천 배지를 생성합니다.
 * @param {number} score - 0에서 100 사이의 키워드 점수
 * @returns {JSX.Element} 해당 점수에 맞는 배지 컴포넌트
 */
const getRecommendationBadge = (score: number): JSX.Element => {
  // 구현
};
```

## 8. 임포트 순서

임포트는 다음 순서로 그룹화:

1. React 및 Next.js 관련 임포트
2. 서드파티 라이브러리
3. 프로젝트 내 컴포넌트
4. 프로젝트 내 유틸리티, 훅, 타입
5. 정적 자원 (이미지, CSS 등)

각 그룹 사이에는 빈 줄로 구분:

```typescript
// 1. React 및 Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. 서드파티 라이브러리
import clsx from 'clsx';
import { motion } from 'framer-motion';

// 3. 프로젝트 컴포넌트
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 4. 유틸리티, 훅, 타입
import { useAuth } from '@/app/lib/AuthContext';
import type { UserProfile } from '@/types/user';

// 5. 정적 자원
import '@/styles/profile.css';
import profileImage from '@/public/images/profile.png';
```

## 9. 코드 포맷팅

### 9.1 기본 포맷팅 규칙

- 들여쓰기: 2 스페이스
- 최대 줄 길이: 100자
- 세미콜론 사용
- 작은따옴표 사용

### 9.2 자동 포맷팅

- Prettier 설정을 통한 자동 포맷팅
- ESLint로 코드 규칙 검사
- 저장 시 자동 포맷팅 활성화

### 9.3 Prettier 설정

```javascript
// .prettierrc.js
module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid',
};
```

## 10. Linting 규칙

- ESLint 확장으로 코드 품질 관리
- TypeScript-ESLint 규칙 준수
- React 훅 규칙 적용

```javascript
// .eslintrc.js (주요 규칙)
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-unused-vars': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

## 11. Git 커밋 메시지

- 명령형 현재 시제 사용 (예: "Add feature" not "Added feature")
- 첫 글자는 대문자로 시작
- 50자 이내로 제목 작성
- 필요한 경우 빈 줄 후 본문 작성

```
// 좋은 예
Add keyword sorting functionality

Implement sorting by relevance, alphabetical order, and date.
Fix performance issues with large keyword sets.

// 나쁜 예
fixed stuff
```

## 12. 참고 자료

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Docs - Style Guide](https://reactjs.org/docs/code-style.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) 