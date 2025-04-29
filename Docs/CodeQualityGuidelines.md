# KeywordPulse 코드 품질 가이드라인

이 문서는 KeywordPulse 프로젝트의 코드 품질을 유지하기 위한 표준, 관행 및 절차를 정의합니다. 모든 팀원은 코드 작성 및 리뷰 시 이 가이드라인을 참조해야 합니다.

## 1. 코딩 표준

### 1.1 일반 원칙

- **가독성**: 코드는 명확하고 이해하기 쉽게 작성합니다.
- **일관성**: 프로젝트 전체에서 일관된 스타일과 패턴을 유지합니다.
- **간결함**: 불필요한 코드를 제거하고 직관적인 해결책을 선호합니다.
- **자체 문서화**: 코드는 가능한 한 스스로를 설명해야 합니다.
- **테스트 용이성**: 모든 코드는 테스트 가능하게 설계합니다.

### 1.2 TypeScript/JavaScript 표준

#### 변수 및 함수 명명

- **카멜 케이스(camelCase)** 사용: 변수, 함수, 메서드 이름에 적용
  ```typescript
  // 올바른 예
  const userData = fetchUserData();
  function calculateTotalScore() { /* ... */ }
  
  // 잘못된 예
  const user_data = fetchUserData();
  function calculate_total_score() { /* ... */ }
  ```

- **파스칼 케이스(PascalCase)** 사용: 클래스, 인터페이스, 타입, 컴포넌트 이름에 적용
  ```typescript
  // 올바른 예
  interface UserProfile { /* ... */ }
  class AuthenticationService { /* ... */ }
  function UserDashboard() { /* ... */ }
  
  // 잘못된 예
  interface userProfile { /* ... */ }
  class authenticationService { /* ... */ }
  ```

- **상수는 대문자와 언더스코어** 사용
  ```typescript
  // 올바른 예
  const MAX_RETRY_COUNT = 3;
  
  // 잘못된 예
  const maxRetryCount = 3;
  ```

#### 형식 및 구조

- 들여쓰기는 **2칸 공백**을 사용합니다.
- 한 줄은 **80자 이내**로 제한합니다.
- 중괄호는 같은 줄에서 시작합니다.
  ```typescript
  // 올바른 예
  function example() {
    if (condition) {
      // 코드
    }
  }
  
  // 잘못된 예
  function example() 
  {
    if (condition) 
    {
      // 코드
    }
  }
  ```

- 세미콜론을 항상 사용합니다.
- 문자열에는 작은따옴표 대신 큰따옴표를 사용합니다.

#### 타입 정의

- TypeScript의 강력한 타입 시스템을 활용합니다.
- `any` 타입은 가능한 사용하지 않습니다.
- 인터페이스와 타입에 의미 있는 이름을 사용합니다.
- 범용 타입 정의는 별도 파일로 분리합니다.

```typescript
// 올바른 예
interface UserData {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

// 잘못된 예
interface Data {
  id: any;
  name: any;
  email: any;
  prefs: any;
}
```

### 1.3 React 컴포넌트 표준

#### 컴포넌트 구조

- **함수형 컴포넌트** 사용을 권장합니다.
- 각 컴포넌트는 단일 책임 원칙을 따릅니다.
- 컴포넌트는 가능한 작고 재사용 가능하게 유지합니다.
- JSX 내에서 복잡한 로직은 피합니다.

```tsx
// 올바른 예
function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="profile-container">
      <h2>{user.name}</h2>
      <UserDetails data={user} />
      <UserActions userId={user.id} />
    </div>
  );
}

// 잘못된 예
function UserProfile({ user }: UserProfileProps) {
  let detailsContent;
  if (user.role === "admin") {
    detailsContent = <div>관리자 정보: {user.adminInfo}</div>;
  } else {
    detailsContent = <div>일반 사용자 정보</div>;
  }
  
  return (
    <div className="profile-container">
      <h2>{user.name}</h2>
      {detailsContent}
      <button onClick={() => fetch(`/api/users/${user.id}`).then(/* ... */)}>
        데이터 로드
      </button>
    </div>
  );
}
```

#### 상태 관리

- 로컬 상태는 React 훅(`useState`, `useReducer`)을 사용합니다.
- 컴포넌트 간 상태 공유는 Context API를 사용합니다.
- 비즈니스 로직은 UI 컴포넌트와 분리합니다.
- 사이드 이펙트는 `useEffect` 내에서 처리합니다.

#### Props 및 상태

- Props와 상태에 명시적인 타입을 정의합니다.
- Props의 기본값을 설정합니다.
- Props 분해 할당을 사용하여 가독성을 높입니다.

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false
}: ButtonProps) {
  // ...
}
```

### 1.4 Next.js 표준

- App Router 구조에 맞게 파일을 조직합니다.
- API 라우트는 기능별로 구조화합니다.
- 서버 컴포넌트와 클라이언트 컴포넌트의 명확한 구분을 유지합니다.
- 중복되는 메타데이터 설정을 피하고 계층적으로 구성합니다.

## 2. 코드 리팩토링 가이드

### 2.1 리팩토링 원칙

- 기능 변경 없이 코드 구조와 품질만 개선합니다.
- 리팩토링은 작은 단위로 점진적으로 진행합니다.
- 테스트를 사용하여 리팩토링 전후 동작이 동일한지 확인합니다.
- 각 리팩토링은 문제와 해결 방법을 명확히 기록합니다.

### 2.2 리팩토링 대상

- **중복 코드**: 반복되는 코드는 함수, 유틸리티 또는 훅으로 추출합니다.
- **긴 함수**: 함수가 너무 길면 작고 명확한 역할을 하는 함수들로 분리합니다.
- **큰 컴포넌트**: 너무 많은 역할을 하는 컴포넌트는 작은 컴포넌트로 분해합니다.
- **일관성 없는 스타일**: 코드베이스 전체에서 일관된 스타일을 유지합니다.
- **복잡한 조건문**: 가능한 단순화하고 설명이 필요한 경우 주석을 추가합니다.

### 2.3 성능 최적화

- 불필요한 렌더링을 방지하기 위해 `React.memo`, `useMemo`, `useCallback`을 적절히 사용합니다.
- 큰 목록을 렌더링할 때 가상화를 고려합니다.
- 이미지와 자산을 최적화합니다.
- 코드 분할을 통해 초기 로드 시간을 개선합니다.

## 3. 코드 리뷰 프로세스

### 3.1 리뷰 절차

1. **PR 준비**: 
   - 명확한 제목과 설명 포함
   - 관련 이슈 연결
   - 작은 단위의 변경사항을 포함

2. **자체 리뷰**:
   - PR 제출 전 자체 리뷰 수행
   - 불필요한 console.log 및 주석 제거
   - 코드가 스타일 가이드를 준수하는지 확인

3. **리뷰 요청**:
   - 최소 1명의 리뷰어를 지정
   - 복잡한 변경의 경우 관련 도메인 전문가 포함

4. **리뷰 제공**:
   - 48시간 이내에 리뷰 완료
   - 명확하고 건설적인 의견 제공
   - 필요한 경우 대안 제시

5. **리뷰 피드백 반영**:
   - 모든 코멘트에 답변
   - 합의된 변경사항 적용
   - 해결된 코멘트 마크

6. **병합**:
   - 모든 리뷰어 승인 후 병합
   - 병합 전 최신 메인 브랜치와 리베이스/병합

### 3.2 코드 리뷰 체크리스트

#### 기능

- 코드가 요구 사항을 충족하는가?
- 모든 에지 케이스를 처리하는가?
- 오류 처리가 적절한가?

#### 코드 품질

- 코드가 가독성이 높고 이해하기 쉬운가?
- 변수와 함수 이름이 의미 있게 지정되었는가?
- 중복 코드가 없는가?
- 함수와 컴포넌트가 단일 책임을 가지는가?

#### 성능

- 불필요한 렌더링이나 계산이 없는가?
- 데이터 구조와 알고리즘이 효율적인가?
- 비동기 작업이 적절하게 처리되는가?

#### 테스트

- 충분한 테스트 커버리지가 있는가?
- 테스트 케이스가 유의미한가?
- 모든 핵심 로직이 테스트되는가?

#### 보안

- 사용자 입력을 적절히 검증하고 소독하는가?
- 민감한 정보가 노출되지 않는가?
- 인증 및 권한 검사가 적절한가?

## 4. 테스트 품질 표준

### 4.1 단위 테스트

- 각 유틸리티 함수 및 훅에 단위 테스트를 작성합니다.
- 특정 기능을 격리하고 의존성을 모킹합니다.
- 경계 조건과 예외 케이스를 테스트합니다.

```typescript
// 함수 예시
export function calculateScore(keywords: string[]): number {
  if (!keywords.length) return 0;
  // 계산 로직...
}

// 테스트 예시
describe('calculateScore', () => {
  it('returns 0 for empty array', () => {
    expect(calculateScore([])).toBe(0);
  });
  
  it('calculates score correctly for valid keywords', () => {
    expect(calculateScore(['test', 'keywords'])).toBe(/* 예상 값 */);
  });
});
```

### 4.2 통합 테스트

- 컴포넌트 간 상호 작용을 테스트합니다.
- API 호출과 데이터 흐름을 테스트합니다.
- 실제 의존성을 사용하여 테스트합니다.

### 4.3 E2E 테스트

- 핵심 사용자 흐름을 테스트합니다.
- 실제 환경과 유사하게 설정합니다.
- 성능 및 접근성 테스트를 포함합니다.

## 5. 지속적 통합

- 모든 PR은 자동화된 린팅과 테스트를 통과해야 합니다.
- 코드 품질 지표를 모니터링합니다.
- 기술 부채는 정기적으로 해결합니다.

## 6. 문서화

### 6.1 코드 문서화

- 복잡한 함수와 컴포넌트에 JSDoc 스타일 주석을 추가합니다.
- API와 중요 기능에 참조 문서를 작성합니다.
- TypeScript 타입을 통해 코드를 자체 문서화합니다.

```typescript
/**
 * 키워드 점수를 계산합니다.
 * 
 * @param keywords - 분석할 키워드 배열
 * @param options - 계산 옵션 (선택사항)
 * @returns 0-100 사이의 점수
 * 
 * @example
 * ```typescript
 * const score = calculateKeywordScore(['seo', 'marketing']);
 * console.log(score); // 75
 * ```
 */
function calculateKeywordScore(
  keywords: string[],
  options?: ScoreOptions
): number {
  // 구현...
}
```

### 6.2 README 및 기술 문서

- 각 모듈에 명확한 README를 제공합니다.
- 아키텍처와 주요 결정 사항을 문서화합니다.
- 설치, 설정, 기여 가이드를 포함합니다.

## 7. 접근성 표준

- 모든 UI 컴포넌트는 WCAG 2.1 AA 표준을 준수해야 합니다.
- 스크린 리더 호환성을 유지합니다.
- 키보드 네비게이션을 지원합니다.
- 충분한 색상 대비를 제공합니다.

```tsx
// 접근성을 위한 예시
<button
  onClick={handleSubmit}
  aria-label="제출"
  role="button"
  tabIndex={0}
>
  <span className="icon">✓</span>
</button>
```

## 8. 보안 표준

- 사용자 입력은 항상 검증 및 소독합니다.
- API 키와 비밀은 안전하게 관리합니다.
- 인증과 권한 부여를 명확히 분리합니다.
- 정기적인 보안 검토를 수행합니다.

---

이 가이드라인은 프로젝트가 발전함에 따라 지속적으로 업데이트될 예정입니다. 모든 팀원은 코드 품질 향상을 위한 제안을 할 수 있습니다.