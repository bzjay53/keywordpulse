# KeywordPulse 코드 품질 가이드라인

이 문서는 KeywordPulse 프로젝트의 코드 품질 유지를 위한 표준과 모범 사례를 제공합니다.

## 1. 코드 스타일 및 포맷팅

### 1.1 TypeScript/JavaScript

- [ESLint](https://eslint.org/) 및 [Prettier](https://prettier.io/)를 사용하여 일관된 코드 스타일 유지
- 들여쓰기: 2 스페이스
- 세미콜론: 사용
- 문자열: 작은따옴표(`'`) 사용
- 객체 스프레드: 객체 복사 시 `Object.assign()` 대신 스프레드 연산자(`{...obj}`) 사용
- 화살표 함수: 가능한 화살표 함수 사용
- 최대 줄 길이: 100자

```typescript
// 잘못된 예
function doSomething(value) {
    if (value == true) {
        return "success";
    }
    return "fail"
}

// 올바른 예
const doSomething = (value: boolean): string => {
  if (value === true) {
    return 'success';
  }
  return 'fail';
};
```

### 1.2 CSS/Tailwind

- 컴포넌트별 스타일링: Tailwind CSS 클래스 사용
- 클래스 이름 구성: [tailwind-merge](https://github.com/dcastil/tailwind-merge) 및 [clsx](https://www.npmjs.com/package/clsx) 사용
- 복잡한 스타일은 별도의 유틸리티 함수로 분리

```tsx
// 잘못된 예
<div className="bg-blue-500 hover:bg-blue-700 hover:text-white px-4 py-2 rounded shadow-md">Button</div>

// 올바른 예
import { cn } from '@/lib/utils';

const buttonClasses = cn(
  'px-4 py-2 rounded shadow-md',
  'bg-blue-500 hover:bg-blue-700',
  'text-white hover:text-white',
);

<div className={buttonClasses}>Button</div>
```

## 2. 코드 구조 및 조직

### 2.1 파일 구성

- 모든 컴포넌트는 자체 파일에 정의
- 복잡한 컴포넌트는 하위 컴포넌트로 분리
- 파일 이름은 PascalCase로 작성 (예: `UserProfile.tsx`)
- 관련 유틸리티/헬퍼 함수는 `utils` 디렉토리에 배치
- 페이지 및 라우트는 App Router 패턴 준수

```
app/
├── api/            # API 라우트
├── components/     # 공유 컴포넌트
│   ├── ui/         # UI 기본 요소 
│   └── forms/      # 폼 컴포넌트
├── hooks/          # 커스텀 훅
├── lib/            # 유틸리티 및 서비스
├── (routes)/       # 페이지 라우트
```

### 2.2 모듈 임포트/익스포트

- 타입/인터페이스는 별도 파일로 분리하여 중앙 관리
- 절대 경로 임포트 사용 (`@/app/components` 형식)
- 임포트 순서: 1) 외부 라이브러리, 2) 내부 모듈, 3) 타입, 4) 스타일
- 배럴 파일(`index.ts`)을 통한 내보내기 구성

```typescript
// 잘못된 예
import React from 'react';
import styles from './styles.module.css';
import { UserData } from '../../../types';
import { Button } from '../../components';
import { fetchData } from '../api';

// 올바른 예
import React from 'react';

import { fetchData } from '@/app/lib/api';
import { Button } from '@/app/components/ui';
import type { UserData } from '@/app/types';

import styles from './styles.module.css';
```

## 3. 컴포넌트 설계

### 3.1 컴포넌트 구조

- 각 컴포넌트는 단일 책임 원칙 준수
- Props는 명시적으로 인터페이스 정의
- 컴포넌트 매개변수 구조분해할당 사용
- 필요 시 `React.memo()` 사용하여 불필요한 리렌더링 방지

```tsx
// 잘못된 예
const UserCard = (props) => {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.email}</p>
      <button onClick={props.onClick}>View Profile</button>
    </div>
  );
};

// 올바른 예
interface UserCardProps {
  name: string;
  email: string;
  onClick: () => void;
}

const UserCard = ({ name, email, onClick }: UserCardProps) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      <button 
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        View Profile
      </button>
    </div>
  );
};

export default React.memo(UserCard);
```

### 3.2 상태 관리

- 로컬 상태: React `useState` 사용
- 컴포넌트 간 상태 공유: React Context API 사용
- 복잡한 상태 로직: 적절한 커스텀 훅으로 분리
- 상태 업데이트: 함수형 업데이트 사용 (`setState(prev => updated)`)

```tsx
// 잘못된 예
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  // ...
};

// 올바른 예
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);
  
  // ...
};
```

## 4. 성능 최적화

### 4.1 메모이제이션

- `useMemo`: 계산 비용이 높은 값 메모이제이션
- `useCallback`: 자식 컴포넌트에 전달되는 콜백 함수 메모이제이션
- 의존성 배열 정확하게 지정

```tsx
// 잘못된 예
const Component = ({ data, onUpdate }) => {
  const processedData = expensiveCalculation(data);
  
  const handleUpdate = () => {
    onUpdate(data);
  };
  
  return <ChildComponent data={processedData} onUpdate={handleUpdate} />;
};

// 올바른 예
const Component = ({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  const handleUpdate = useCallback(() => {
    onUpdate(data);
  }, [data, onUpdate]);
  
  return <ChildComponent data={processedData} onUpdate={handleUpdate} />;
};
```

### 4.2 Code Splitting

- 다이나믹 임포트로 라우트별 코드 분할
- 큰 컴포넌트/라이브러리 지연 로딩

```tsx
// 잘못된 예
import LargeComponent from '@/app/components/LargeComponent';

// 올바른 예
import dynamic from 'next/dynamic';

const LargeComponent = dynamic(() => import('@/app/components/LargeComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## 5. 에러 처리

### 5.1 에러 경계

- 컴포넌트 트리의 일부를 격리하기 위한 에러 경계 구현
- 에러 발생 시 대체 UI 제공

```tsx
// app/components/ErrorBoundary.tsx
'use client';

import React, { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 5.2 비동기 에러 처리

- `try/catch` 블록을 사용하여 비동기 작업 에러 처리
- 에러 상태를 사용자에게 시각적으로 표시
- 일관된 에러 메시지 형식 사용

```tsx
// 잘못된 예
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
};

// 올바른 예
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // 상위 호출자에게 에러 전파
  }
};
```

## 6. 테스트

### 6.1 단위 테스트

- 각 컴포넌트/유틸리티 함수에 대한 단위 테스트 작성
- Jest 및 React Testing Library 사용
- 테스트 파일 위치: 테스트 대상 파일과 동일한 디렉토리에 `*.test.tsx` 형식으로 배치

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 6.2 통합 테스트

- 여러 컴포넌트/기능의 상호작용 테스트
- 실제 사용자 시나리오 기반 테스트 작성
- 테스트 더블(mock)을 사용하여 외부 의존성 격리

## 7. 접근성(A11Y)

- 시맨틱 HTML 요소 사용
- ARIA 속성 적절히 사용
- 키보드 네비게이션 지원
- 적절한 색상 대비 유지
- 화면 리더 호환성 확인

```tsx
// 잘못된 예
<div onClick={handleClick}>Click me</div>

// 올바른 예
<button 
  onClick={handleClick}
  aria-label="Action button"
>
  Click me
</button>
```

## 8. 코드 리뷰 가이드라인

### 8.1 리뷰 프로세스

1. Pull Request(PR) 생성 시 명확한 설명 제공
2. PR은 자체 포함적이고 작은 단위로 분할
3. 코드 리뷰어는 24시간 이내에 피드백 제공
4. 모든 코멘트는 건설적이고 구체적이어야 함

### 8.2 PR 체크리스트

- [ ] ESLint/Prettier 검사 통과
- [ ] 기존 테스트 통과
- [ ] 새 코드에 대한 테스트 추가
- [ ] 문서화 업데이트(필요 시)
- [ ] 브랜치 최신 상태 유지(리베이스)
- [ ] 불필요한 콘솔 로그 제거
- [ ] 성능 영향 고려

## 9. 코드 문서화

### 9.1 JSDoc 주석

- 모든 함수와 컴포넌트에 JSDoc 주석 추가
- 매개변수, 반환 유형, 예외 등 문서화

```typescript
/**
 * 사용자 정보를 가져오는 함수
 * @param {string} userId - 조회할 사용자의 ID
 * @returns {Promise<User>} 사용자 정보 객체
 * @throws {Error} 사용자를 찾을 수 없는 경우
 */
export const fetchUser = async (userId: string): Promise<User> => {
  // 구현...
};
```

### 9.2 인라인 주석

- 복잡한 로직에 인라인 주석 추가
- "왜" 그렇게 구현했는지 설명(구현이 명확하지 않은 경우)
- TODO/FIXME 주석은 이슈 번호 포함

```typescript
// 잘못된 예
// 사용자 데이터 가져오기
const data = await fetchUsers();

// 올바른 예
// GraphQL 쿼리가 너무 느려서 REST API로 대체함 (#123)
const data = await fetchUsersRest();

// TODO(#456): 캐싱 구현으로 성능 개선 필요
```

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다.

최종 업데이트: 2023-05-04 