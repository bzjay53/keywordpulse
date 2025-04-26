'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true
});

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => useContext(AuthContext);

// 테스트용 더미 사용자
const DUMMY_USER: User = {
  id: 'dummy-user-id',
  email: 'user@example.com',
  name: '테스트 사용자'
};

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 여기서 세션/토큰 검증 등을 수행
    const checkAuth = async () => {
      try {
        // 테스트를 위해 더미 사용자 반환 (실제 구현에서는 API 호출)
        setUser(DUMMY_USER);
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 