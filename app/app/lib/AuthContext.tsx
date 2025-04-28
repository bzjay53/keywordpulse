'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSession, signOut } from './supabaseClient';

// AuthContext 타입 정의
type AuthContextType = {
  user: any | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

// 기본값 생성
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  refreshSession: async () => {},
  logout: async () => {},
};

// AuthContext 생성
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// AuthContext Provider를 위한 Props 타입
type AuthProviderProps = {
  children: ReactNode;
};

// AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 세션 새로고침 함수
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await getSession();
      
      if (error) {
        throw error;
      }
      
      setUser(data.session?.user || null);
    } catch (err: any) {
      console.error('세션 새로고침 오류:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
    } catch (err: any) {
      console.error('로그아웃 오류:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 초기 세션 로드
  useEffect(() => {
    const loadSession = async () => {
      await refreshSession();
    };
    
    loadSession();
  }, []);

  // 인증 상태 변경 시 이벤트 리스너 (실제 Supabase 환경에서 활용)
  useEffect(() => {
    // 서버 사이드 렌더링 시 실행하지 않음
    if (typeof window === 'undefined') return;
    
    const checkSession = setInterval(async () => {
      const { data } = await getSession();
      const currentUser = data.session?.user || null;
      
      // 사용자 상태가 변경된 경우에만 업데이트
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 60000); // 1분마다 세션 확인
    
    return () => clearInterval(checkSession);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// useAuth 훅
export function useAuth() {
  return useContext(AuthContext);
} 