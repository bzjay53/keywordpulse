/**
 * API 에러 클래스 (호환성 목적)
 *
 * 참고: 이 파일은 호환성을 위해 유지되며, 새로운 코드에서는 @/lib/exceptions 사용을 권장합니다.
 */
import { ApiError as OriginalApiError } from './exceptions';
// 기존 ApiError 클래스를 재내보내기
export { OriginalApiError as ApiError };
