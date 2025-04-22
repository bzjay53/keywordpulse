'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, getUser, signOut } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// 기본값으로 Context 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  refreshSession: async () => {},
});

// Context 사용을 위한 훅
export const useAuth = () => useContext(AuthContext);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 세션 새로고침 함수
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      
      // 서버 사이드 렌더링 시 실행 방지
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const { data } = await getSession();
      const currentUser = await getUser();
      setUser(currentUser || null);
    } catch (error) {
      console.error('세션 새로고침 중 오류:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // 서버 사이드 렌더링 시 실행 방지
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 시 세션 확인 (클라이언트 사이드에서만 실행)
  useEffect(() => {
    // 서버 사이드 렌더링 시 실행 방지
    if (typeof window === 'undefined') {
      return;
    }
    
    const initializeAuth = async () => {
      await refreshSession();
    };

    initializeAuth();
  }, []);

  // Auth 상태 변경 감지를 위한 이벤트 리스너 설정 (클라이언트 사이드에서만 실행)
  useEffect(() => {
    // 서버 사이드 렌더링 시 실행 방지
    if (typeof window === 'undefined') {
      return;
    }
    
    // Supabase 이벤트 리스너 설정
    // 참고: 이 부분은 Supabase의 실시간 이벤트를 사용하는 방식으로 업데이트될 수 있음
    const checkInterval = setInterval(() => {
      refreshSession();
    }, 60 * 60 * 1000); // 1시간마다 세션 갱신

    return () => clearInterval(checkInterval);
  }, []);

  const value = {
    user,
    isLoading,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 