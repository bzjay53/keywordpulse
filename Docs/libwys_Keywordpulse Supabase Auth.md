# 🔐 Supabase Auth 통합 가이드

KeywordPulse 웹앱에 Supabase Auth를 통합하여 사용자 인증 및 권한 관리를 구현하는 방법을 설명합니다.

---

## 📌 개요

- **목적**: 사용자 계정 기반 기능(예: 키워드 저장, 알림 설정 등)을 제공하기 위한 인증/인가 시스템 구축
- **도구**: Supabase Auth (PostgreSQL 기반 백엔드), JWT, Next.js 클라이언트 SDK
- **구성**:
  - Supabase 프로젝트 설정
  - 환경변수 설정
  - 클라이언트 측 Next.js 통합
  - 서버리스 함수 보호

---

## 1. Supabase 프로젝트 설정

1. [Supabase 콘솔](https://supabase.com/)에 접속하여 새 프로젝트 생성
2. Database 비밀번호 및 리전을 선택 후 프로젝트 생성
3. **Authentication** 탭으로 이동하여:
   - **Sign-up** 설정: 이메일/비밀번호, OAuth Providers(Google, GitHub) 활성화
   - **Redirect URL**에 `https://<your-domain>/` 및 `http://localhost:3000/` 추가
   - 이메일 템플릿(메일 제목, 내용) 필요 시 커스터마이징
4. **API Keys** 섹션에서:
   - `anon` 공개 키 (클라이언트용)
   - `service_role` 비공개 키 (서버사이드용) 확보

---

## 2. 환경 변수 설정 (Vercel)

| Key                          | 설명                         | 예시                                                       |
| ---------------------------- | -------------------------- | -------------------------------------------------------- |
| SUPABASE\_URL                | Supabase 프로젝트 URL          | [https://abc123.supabase.co](https://abc123.supabase.co) |
| SUPABASE\_ANON\_KEY          | Supabase 공개 익명 API 키       | `eyJhbGciOiJI...`                                        |
| SUPABASE\_SERVICE\_ROLE\_KEY | 서버사이드 서비스 역할 키 (비공개)       | `eyJhbGciOiJI...`                                        |
| NEXT\_PUBLIC\_SUPABASE\_URL  | Next.js 클라이언트 접근용 URL (동일) | `process.env.SUPABASE_URL`                               |
| NEXT\_PUBLIC\_SUPABASE\_KEY  | Next.js 클라이언트 익명 키         | `process.env.SUPABASE_ANON_KEY`                          |

- Vercel Dashboard > Environment Variables > 추가
- **Preview**와 **Production** 환경 모두에 변수 설정

---

## 3. 클라이언트 측 통합 (Next.js)

### 3.1 Supabase 클라이언트 설정

```bash
npm install @supabase/supabase-js
```

```ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 인증 기능이 동작하지 않을 수 있습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

### 3.2 인증 Context 구현 (AuthContext)

```tsx
// lib/AuthContext.tsx
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
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 시 세션 확인
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
    };

    initializeAuth();
  }, []);

  // Auth 상태 변경 감지를 위한 이벤트 리스너 설정
  useEffect(() => {
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
```

### 3.3 레이아웃에 AuthProvider 적용

```tsx
// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { AuthProvider } from '@/lib/AuthContext';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KeywordPulse - 실시간 키워드 분석 도구',
  // ... 기타 메타 정보
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-gray-100 mt-12">
            {/* ... 푸터 내용 ... */}
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 3.4 헤더 컴포넌트 - 로그인 상태 반영

```tsx
// components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // 로그아웃 후 홈으로 리다이렉트는 자동으로 처리됨
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            KeywordPulse
          </Link>
        </div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary-600">
                홈
              </Link>
            </li>
            
            {isLoading ? (
              // 로딩 중일 때 표시
              <li className="text-gray-400">
                <span className="inline-flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </li>
            ) : user ? (
              // 로그인 상태일 때 표시
              <>
                <li>
                  <Link href="/profile" className="text-gray-600 hover:text-primary-600">
                    내 프로필
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              // 로그아웃 상태일 때 표시
              <li>
                <Link href="/login" className="text-gray-600 hover:text-primary-600">
                  로그인
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### 3.5 로그인/회원가입 페이지

```tsx
// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }

      if (mode === 'login') {
        // Supabase 로그인 실행
        const { data, error: signInError } = await signIn(email, password);
        
        if (signInError) {
          throw new Error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
        
        console.log('로그인 성공:', data);
        router.push('/');
      } else {
        // Supabase 회원가입 실행
        const { data, error: signUpError } = await signUp(email, password);
        
        if (signUpError) {
          if (signUpError.message.includes('already')) {
            throw new Error('이미 가입된 이메일입니다. 로그인을 시도해주세요.');
          }
          throw new Error('회원가입에 실패했습니다: ' + signUpError.message);
        }
        
        console.log('회원가입 성공:', data);
        setMode('login');
        setError('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* ... 폼 UI 내용 ... */}
    </div>
  );
}
```

### 3.6 보호된 프로필 페이지

```tsx
// app/profile/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 로딩 중 또는 미인증 상태일 때 표시할 내용
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... 프로필 내용 ... */}
    </div>
  );
}
```

---

## 4. 인증 테스트 구현

프로젝트의 `tests/` 디렉토리에 Supabase 인증 기능을 테스트하기 위한 스크립트를 추가했습니다:

```python
# tests/test_auth.py
import os
import uuid
import time
from supabase import create_client

# 테스트용 임시 사용자 정보 생성
TEST_EMAIL = f"test_{uuid.uuid4()}@example.com"
TEST_PASSWORD = "Password123!"

def test_signup():
    """회원가입 기능을 테스트합니다."""
    # ... 테스트 코드 ...

def test_login():
    """로그인 기능을 테스트합니다."""
    # ... 테스트 코드 ...

def test_get_user():
    """현재 사용자 정보 조회 기능을 테스트합니다."""
    # ... 테스트 코드 ...

def test_logout():
    """로그아웃 기능을 테스트합니다."""
    # ... 테스트 코드 ...

def run_all_tests():
    """모든 인증 테스트를 실행합니다."""
    # ... 테스트 실행 ...
```

### 테스트 실행 방법:
```bash
pip install supabase-py
python tests/test_auth.py
```

---

## 5. 서버리스 함수 보호

### 5.1 서비스 역할 키 사용 (Server-side)

- `/api/*` 내 민감 로직에서 `SUPABASE_SERVICE_ROLE_KEY` 사용하여 Admin 작업 수행
- 예: 사용자별 데이터 접근 제어, Row Level Security(RLS) 우회 없이 사용

### 5.2 JWT 검증 미들웨어

```python
# api/auth.py
import os
from fastapi import Header, HTTPException
import jwt
from jwt import PyJWKClient

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_JWKS = f"{SUPABASE_URL}/auth/v1/keys"

async def verify_token(x_jwt_token: str = Header(...)):
    try:
        jwks_client = PyJWKClient(SUPABASE_JWKS)
        signing_key = jwks_client.get_signing_key_from_jwt(x_jwt_token).key
        payload = jwt.decode(
            x_jwt_token,
            signing_key,
            algorithms=["RS256"],
            audience=os.getenv('SUPABASE_URL'),
            issuer=f"{SUPABASE_URL}/auth/v1"
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")
```

---

## 6. Row Level Security (RLS) 권장 설정

**Supabase Table** 설정 예시:

```sql
-- 키워드 저장 테이블 예시
create table user_keywords (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  keyword text,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table user_keywords enable row level security;

create policy "Users can manage own keywords" on user_keywords
  for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
```

- RLS 활성화 후 Supabase 클라이언트 인증 시 `supabase.auth.session()` 기반 자동 적용
- 서버사이드 `service_role` 키 사용 시 RLS 우회 가능 (주의)

---

> **참고 자료**:
>
> - Supabase Auth Docs: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
> - Supabase RLS: [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)
> - Next.js Auth Helpers: [https://supabase.com/docs/guides/auth/auth-helpers/nextjs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

