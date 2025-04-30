var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * 클래스명 조합 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 사용하기 쉬운 클래스 결합 함수를 제공
 */
export function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
}
/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
 */
export function formatDate(date) {
    return date.toISOString().split('T')[0];
}
/**
 * 문자열의 첫 글자를 대문자로 변환
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * 숫자를 통화 형식으로 포맷팅
 */
export function formatCurrency(value, locale, currency) {
    if (locale === void 0) { locale = 'ko-KR'; }
    if (currency === void 0) { currency = 'KRW'; }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
}
/**
 * 현재 시간에 따라 인사말 생성
 */
export function getGreeting() {
    var hour = new Date().getHours();
    if (hour < 12) {
        return '안녕하세요, 좋은 아침입니다';
    }
    else if (hour < 18) {
        return '안녕하세요, 좋은 오후입니다';
    }
    else {
        return '안녕하세요, 좋은 저녁입니다';
    }
}
/**
 * 문자열 길이 제한하여 말줄임표(...) 추가
 */
export function truncateString(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength) + '...';
}
/**
 * 간단한 이메일 형식 검증
 */
export function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * 배열의 아이템을 랜덤하게 섞는 함수
 */
export function shuffleArray(array) {
    var _a;
    var newArray = __spreadArray([], array, true);
    for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [newArray[j], newArray[i]], newArray[i] = _a[0], newArray[j] = _a[1];
    }
    return newArray;
}
/**
 * URL에서 쿼리 파라미터를 가져오는 함수
 */
export function getQueryParam(url, param) {
    var searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
}
/**
 * 정리된 에러 메시지 생성
 */
export function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
/**
 * 주어진 문자열이 유효한 URL인지 확인하는 함수
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * 두 날짜 사이의 시간 차이를 계산하는 함수
 */
export function getTimeDifference(dateA, dateB) {
    return Math.abs(dateA.getTime() - dateB.getTime());
}
/**
 * 문자열을 지정된 길이로의 해시로 변환하는 함수
 */
export function stringToHash(str, length) {
    if (length === void 0) { length = 10; }
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // 32비트 정수로 변환
    }
    // 양수로 변환 후 문자열로 변환하여 해당 길이만큼 반환
    return Math.abs(hash).toString().slice(0, length);
}
