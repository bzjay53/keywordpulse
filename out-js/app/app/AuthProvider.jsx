'use client';
import React from 'react';
import { AuthProvider as AuthContextProvider } from '../lib/AuthContext';
export default function AuthProvider(_a) {
    var children = _a.children;
    return <AuthContextProvider>{children}</AuthContextProvider>;
}
