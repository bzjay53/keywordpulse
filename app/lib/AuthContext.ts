import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

// 인증 컨텍스트 타입 정의
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null, data: { user: User | null } }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

// 기본 컨텍스트 값 설정
const defaultContextValue: AuthContextType = {
  session: null,
  user: null,
  isLoading: true,
  signIn: async () => ({ error: new Error('AuthContext not initialized') }),
  signUp: async () => ({ error: new Error('AuthContext not initialized'), data: { user: null } }),
  signOut: async () => { throw new Error('AuthContext not initialized') },
  resetPassword: async () => ({ error: new Error('AuthContext not initialized') })
};

// 인증 컨텍스트 생성
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 