'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { AuthState, User } from '@/types/task';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  register: (token: string, user: User) => void;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialAuthState);

  const setAuthData = useCallback((token: string | null, user: User | null) => {
    setState({
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
    });
  }, []);

  const handleAuth = (token: string, user: User) => {
    localStorage.setItem('jwt_token', token);
    setAuthData(token, user);
  };

  const login = (token: string, user: User) => handleAuth(token, user);
  const register = (token: string, user: User) => handleAuth(token, user);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    api.post('/logout').catch(() => {});
    setAuthData(null, null);
  }, [setAuthData]);

  useEffect(() => {
    let isMounted = true; 

    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem('jwt_token');
      
      if (storedToken && isMounted) {
          setAuthData(storedToken, { id: 0, name: 'Usuario', email: 'email@test.com' }); 
      } else if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthStatus();

    const handleUnauthorized = () => {
      logout();
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [logout, setAuthData]); 

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}