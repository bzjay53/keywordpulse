'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, getSession } from './supabaseClient';

// AuthContext 타입 정의
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

// AuthContext 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

// AuthProvider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 세션 정보 갱신
  const refreshSession = async () => {
    try {
      const { data, error } = await getSession();
      
      if (error) {
        console.error('세션 확인 오류:', error);
        setUser(null);
        setSession(null);
        return;
      }
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('세션 갱신 오류:', error);
      setUser(null);
      setSession(null);
    }
  };

  // 로그아웃 함수
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // 초기 세션 로드
  useEffect(() => {
    setIsLoading(true);
    
    // 현재 세션 확인
    refreshSession().finally(() => {
      setIsLoading(false);
    });
    
    // 인증 상태 변경 이벤트 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // AuthContext 값 제공
  const value = {
    user,
    session,
    isLoading,
    signOut: handleSignOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// AuthContext 사용을 위한 hook
export const useAuth = () => useContext(AuthContext); 