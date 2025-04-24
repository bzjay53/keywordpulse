import { useState, useMemo } from 'react';

/**
 * 데이터 목록에 대한 정렬 기능을 제공하는 커스텀 훅
 * @template T 정렬할 아이템의 타입
 * @param items 정렬할 아이템 배열
 * @param initialSortField 초기 정렬 필드
 * @param initialSortDirection 초기 정렬 방향
 * @returns 정렬 상태 및 함수들
 */
function useKeywordSorting<T extends Record<string, any>>(
  items: T[],
  initialSortField: keyof T = 'score' as keyof T,
  initialSortDirection: 'asc' | 'desc' = 'desc'
) {
  // 정렬 상태
  const [sortField, setSortField] = useState<keyof T>(initialSortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  // 정렬 방향 전환 핸들러
  const handleSort = (field: keyof T) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // 새로운 필드로 정렬 시 기본값은 내림차순
    }
  };

  // 정렬 방향 아이콘 생성기
  const getSortIcon = (field: keyof T) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // 정렬된 아이템 목록 (메모이제이션 적용)
  const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    return [...items].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // 문자열인 경우 localeCompare 사용
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } 
      // 숫자 또는 기타 타입인 경우
      else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }, [items, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortIcon,
    sortedItems
  };
}

export default useKeywordSorting; 