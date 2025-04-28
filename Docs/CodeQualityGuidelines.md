# 코드 품질 가이드라인

이 문서는 KeywordPulse 프로젝트의 코드 품질 표준과 모범 사례를 정의합니다.

## 1. 코드 스타일

### 1.1 TypeScript/JavaScript

- **Prettier 구성**: 모든 TS/JS 파일은 Prettier 포맷팅을 따릅니다.
  - 탭 대신 2칸 공백 사용
  - 세미콜론 사용
  - 싱글 쿼트 사용
  - 후행 쉼표 사용
- **ESLint 규칙**: `eslint:recommended`, `plugin:@typescript-eslint/recommended` 규칙 적용
- **명명 규칙**:
  - 컴포넌트: PascalCase (예: `KeywordTable.tsx`)
  - 훅: camelCase, 'use' 접두사 (예: `useAuth.ts`)
  - 상수: UPPER_CASE (예: `MAX_KEYWORDS`)
  - 변수 및 함수: camelCase (예: `getKeywordScore`)
  - 타입/인터페이스: PascalCase (예: `KeywordAnalysisResult`)

### 1.2 Python

- **Black 포맷터**: Black 포맷팅 표준 적용 (라인 길이 88)
- **isort**: 모듈 가져오기 정렬
- **명명 규칙**:
  - 함수: snake_case (예: `analyze_keywords`)
  - 클래스: PascalCase (예: `KeywordAnalyzer`)
  - 상수: UPPER_CASE (예: `MAX_BATCH_SIZE`)
  - 변수: snake_case (예: `keyword_list`)

## 2. 코드 구조 및 모범 사례

### 2.1 컴포넌트 구조

- **단일 책임 원칙**: 각 컴포넌트는 하나의 책임만 가집니다.
- **컴포넌트 크기**: 한 파일은 250줄을 넘지 않도록 합니다.
- **상태 관리**: 로컬 상태는 가능한 한 낮은 수준에서 관리합니다.
- **Props 인터페이스**: 모든 컴포넌트 Props는 인터페이스로 정의합니다.

```typescript
// 좋은 예시
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  // ...
};
```

### 2.2 모듈화 및 재사용

- **DRY 원칙**: 반복되는 코드는 공통 유틸리티나 훅으로 분리합니다.
- **관심사 분리**: 비즈니스 로직과 UI 로직을 분리합니다.
- **공통 컴포넌트**: 재사용 가능한 UI 요소는 공통 컴포넌트로 분리합니다.

### 2.3 성능 최적화

- **메모이제이션**: `React.memo`, `useMemo`, `useCallback`을 적절히 사용합니다.
- **상태 업데이트**: 함수형 업데이트 패턴을 사용합니다.
- **레이지 로딩**: 큰 컴포넌트나 라이브러리는 필요할 때 로드합니다.
- **이미지 최적화**: Next.js의 Image 컴포넌트를 사용합니다.

## 3. 문서화

### 3.1 코드 주석

- **JSDoc**: 함수와 컴포넌트에 JSDoc 주석을 추가합니다.

```typescript
/**
 * 키워드 점수를 계산합니다.
 * @param keyword - 분석할 키워드
 * @param context - 키워드 컨텍스트 정보
 * @returns 0-100 사이의 키워드 점수
 */
function calculateKeywordScore(keyword: string, context?: KeywordContext): number {
  // ...
}
```

- **파이썬 독스트링**: Python 함수와 클래스는 독스트링으로 문서화합니다.

```python
def analyze_keywords(keywords: List[str]) -> Dict[str, Any]:
    """
    주어진 키워드 목록을 분석합니다.
    
    Args:
        keywords: 분석할 키워드 리스트
        
    Returns:
        키워드별 분석 결과가 포함된 딕셔너리
    """
    # ...
```

### 3.2 README 및 문서

- 각 주요 기능은 해당 README 또는 문서가 있어야 합니다.
- API 엔드포인트는 사용 방법, 매개변수, 응답 형식을 문서화해야 합니다.

## 4. 테스트

### 4.1 테스트 범위

- **유닛 테스트**: 복잡한 함수와 유틸리티는 유닛 테스트를 작성합니다.
- **컴포넌트 테스트**: 핵심 UI 컴포넌트는 렌더링과 상호작용 테스트를 작성합니다.
- **통합 테스트**: 주요 사용자 흐름은 통합 테스트로 검증합니다.

### 4.2 테스트 모범 사례

- **AAA 패턴**: Arrange(준비), Act(실행), Assert(검증) 패턴을 따릅니다.
- **모킹**: 외부 의존성은 적절히 모킹합니다.
- **테스트 가독성**: 테스트는 명확하고 이해하기 쉽게 작성합니다.

## 5. 코드 리뷰 체크리스트

코드 리뷰 시 다음 항목을 확인합니다:

- [ ] 코드가 스타일 가이드를 준수하는가?
- [ ] 중복 코드가 없는가?
- [ ] 함수와 컴포넌트가 단일 책임 원칙을 따르는가?
- [ ] 적절한 에러 처리가 있는가?
- [ ] 성능 문제가 없는가?
- [ ] 코드가 적절히 문서화되어 있는가?
- [ ] 테스트가 충분히 작성되었는가?
- [ ] 타입 정의가 명확한가?
- [ ] 보안 취약점이 없는가?

## 6. 자동화 도구

다음 도구를 사용하여 코드 품질을 자동으로 검사합니다:

- **Prettier**: 코드 포맷팅
- **ESLint**: 코드 품질 및 스타일 규칙 검사
- **TypeScript**: 타입 검사
- **Jest**: 테스트 실행
- **Black**: Python 코드 포맷팅
- **isort**: Python 가져오기 정렬
- **Pylint**: Python 코드 품질 검사

---

이 문서는 프로젝트의 진행 상황에 따라 지속적으로 업데이트됩니다. 