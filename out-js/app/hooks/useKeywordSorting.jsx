var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useMemo } from 'react';
/**
 * 데이터 목록에 대한 정렬 기능을 제공하는 커스텀 훅
 * @template T 정렬할 아이템의 타입
 * @param items 정렬할 아이템 배열
 * @param initialSortField 초기 정렬 필드
 * @param initialSortDirection 초기 정렬 방향
 * @returns 정렬 상태 및 함수들
 */
function useKeywordSorting(items, initialSortField, initialSortDirection) {
    if (initialSortField === void 0) { initialSortField = 'score'; }
    if (initialSortDirection === void 0) { initialSortDirection = 'desc'; }
    // 정렬 상태
    var _a = useState(initialSortField), sortField = _a[0], setSortField = _a[1];
    var _b = useState(initialSortDirection), sortDirection = _b[0], setSortDirection = _b[1];
    // 정렬 방향 전환 핸들러
    var handleSort = function (field) {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('desc'); // 새로운 필드로 정렬 시 기본값은 내림차순
        }
    };
    // 정렬 방향 아이콘 생성기
    var getSortIcon = function (field) {
        if (field !== sortField)
            return null;
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };
    // 정렬된 아이템 목록 (메모이제이션 적용)
    var sortedItems = useMemo(function () {
        if (!items || items.length === 0)
            return [];
        return __spreadArray([], items, true).sort(function (a, b) {
            var aValue = a[sortField];
            var bValue = b[sortField];
            // 문자열인 경우 localeCompare 사용
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            // 숫자 또는 기타 타입인 경우
            else {
                return sortDirection === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }
        });
    }, [items, sortField, sortDirection]);
    return {
        sortField: sortField,
        sortDirection: sortDirection,
        handleSort: handleSort,
        getSortIcon: getSortIcon,
        sortedItems: sortedItems
    };
}
export default useKeywordSorting;
