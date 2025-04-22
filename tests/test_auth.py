"""
KeywordPulse Supabase 인증 테스트 스크립트

Supabase 인증 기능이 제대로 동작하는지 확인합니다.
"""
import os
import json
import uuid
import time
from supabase import create_client

# 테스트 설정
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_KEY')

# 테스트용 임시 사용자 정보
TEST_EMAIL = f"test_{uuid.uuid4()}@example.com"
TEST_PASSWORD = "Password123!"

def setup_supabase_client():
    """Supabase 클라이언트를 설정합니다."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("환경 변수 NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_KEY가 설정되지 않았습니다.")
        return None
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def test_signup():
    """회원가입 기능을 테스트합니다."""
    print("\n===== 회원가입 테스트 =====")
    
    supabase = setup_supabase_client()
    if not supabase:
        print("Supabase 클라이언트 설정 실패. 테스트를 건너뜁니다.")
        return False
    
    try:
        # 회원가입 시도
        response = supabase.auth.sign_up({
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        
        print(f"상태: {'성공' if response.user else '실패'}")
        print(f"이메일: {TEST_EMAIL}")
        print(f"사용자 ID: {response.user.id if response.user else 'N/A'}")
        
        # 회원가입 성공 시 사용자 정보 반환
        return response.user is not None
    except Exception as e:
        print(f"회원가입 중 오류 발생: {str(e)}")
        return False

def test_login():
    """로그인 기능을 테스트합니다."""
    print("\n===== 로그인 테스트 =====")
    
    supabase = setup_supabase_client()
    if not supabase:
        print("Supabase 클라이언트 설정 실패. 테스트를 건너뜁니다.")
        return False
    
    try:
        # 로그인 시도
        response = supabase.auth.sign_in_with_password({
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        
        print(f"상태: {'성공' if response.user else '실패'}")
        print(f"이메일: {TEST_EMAIL}")
        print(f"액세스 토큰: {response.session.access_token[:10]}... (일부만 표시)")
        
        # 로그인 성공 시 세션 정보 반환
        return response.session is not None
    except Exception as e:
        print(f"로그인 중 오류 발생: {str(e)}")
        return False

def test_get_user():
    """현재 사용자 정보 조회 기능을 테스트합니다."""
    print("\n===== 사용자 정보 조회 테스트 =====")
    
    supabase = setup_supabase_client()
    if not supabase:
        print("Supabase 클라이언트 설정 실패. 테스트를 건너뜁니다.")
        return False
    
    try:
        # 먼저 로그인
        login_response = supabase.auth.sign_in_with_password({
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        
        if not login_response.user:
            print("로그인 실패. 사용자 정보 조회를 건너뜁니다.")
            return False
        
        # 사용자 정보 조회
        user_response = supabase.auth.get_user()
        
        print(f"상태: {'성공' if user_response.user else '실패'}")
        print(f"이메일: {user_response.user.email if user_response.user else 'N/A'}")
        print(f"마지막 로그인: {user_response.user.last_sign_in_at if user_response.user else 'N/A'}")
        
        # 사용자 정보 조회 성공 시 True 반환
        return user_response.user is not None
    except Exception as e:
        print(f"사용자 정보 조회 중 오류 발생: {str(e)}")
        return False

def test_logout():
    """로그아웃 기능을 테스트합니다."""
    print("\n===== 로그아웃 테스트 =====")
    
    supabase = setup_supabase_client()
    if not supabase:
        print("Supabase 클라이언트 설정 실패. 테스트를 건너뜁니다.")
        return False
    
    try:
        # 먼저 로그인
        login_response = supabase.auth.sign_in_with_password({
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        
        if not login_response.session:
            print("로그인 실패. 로그아웃 테스트를 건너뜁니다.")
            return False
        
        # 로그아웃 시도
        supabase.auth.sign_out()
        
        # 로그아웃 후 세션 확인
        try:
            user_response = supabase.auth.get_user()
            print(f"로그아웃 상태: {'실패 (여전히 인증됨)' if user_response.user else '성공 (인증 해제됨)'}")
            return user_response.user is None
        except Exception:
            print("로그아웃 상태: 성공 (인증 해제됨)")
            return True
    except Exception as e:
        print(f"로그아웃 중 오류 발생: {str(e)}")
        return False

def cleanup_test_user():
    """테스트용 사용자를 삭제합니다."""
    print("\n===== 테스트 사용자 정리 =====")
    
    print(f"참고: 테스트 사용자({TEST_EMAIL})는 수동으로 Supabase 대시보드에서 삭제해야 할 수 있습니다.")
    print("이 기능은 Supabase 관리자 API를 통해 자동화할 수 있지만 이 테스트에서는 구현하지 않았습니다.")

def run_all_tests():
    """모든 인증 테스트를 실행합니다."""
    print("KeywordPulse Supabase 인증 테스트 시작...")
    
    # 각 테스트 실행
    signup_success = test_signup()
    
    # 회원가입 성공 시에만 다음 테스트 실행
    if signup_success:
        # 가입 처리 시간을 기다림
        print("회원가입 처리를 위해 3초 대기 중...")
        time.sleep(3)
        
        login_success = test_login()
        get_user_success = test_get_user()
        logout_success = test_logout()
    else:
        login_success = False
        get_user_success = False
        logout_success = False
    
    # 테스트 결과 요약
    print("\n===== 테스트 결과 요약 =====")
    print(f"회원가입: {'성공' if signup_success else '실패'}")
    print(f"로그인: {'성공' if login_success else '실패'}")
    print(f"사용자 정보 조회: {'성공' if get_user_success else '실패'}")
    print(f"로그아웃: {'성공' if logout_success else '실패'}")
    
    # 테스트 사용자 정리
    cleanup_test_user()

if __name__ == "__main__":
    run_all_tests() 