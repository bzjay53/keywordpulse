import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 클래스명 조합 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 사용하기 쉬운 클래스 결합 함수를 제공
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * 문자열의 첫 글자를 대문자로 변환
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 숫자를 통화 형식으로 포맷팅
 */
export function formatCurrency(value: number, locale = 'ko-KR', currency = 'KRW'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * 현재 시간에 따라 인사말 생성
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return '안녕하세요, 좋은 아침입니다'
  } else if (hour < 18) {
    return '안녕하세요, 좋은 오후입니다'
  } else {
    return '안녕하세요, 좋은 저녁입니다'
  }
}

/**
 * 문자열 길이 제한하여 말줄임표(...) 추가
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * 간단한 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 배열의 아이템을 랜덤하게 섞는 함수
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * URL에서 쿼리 파라미터를 가져오는 함수
 */
export function getQueryParam(url: string, param: string): string | null {
  const searchParams = new URLSearchParams(new URL(url).search)
  return searchParams.get(param)
}

/**
 * 정리된 에러 메시지 생성
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
} 