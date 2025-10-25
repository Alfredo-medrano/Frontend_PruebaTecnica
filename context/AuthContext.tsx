'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
// IMPORTAMOS setAuthHeader
// CORRECCIÓN: Eliminamos LaravelValidationData del import de types
import api, { setAuthHeader } from '@/lib/axios';
import { AuthState, User } from '@/types/task'; 

// Interfaces necesarias para el Context
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

  const resolveAuthState = useCallback((token: string | null) => {
    setState({
      user: token ? { id: 0, name: 'Usuario', email: 'email@test.com' } : null,
      token: token,
      isAuthenticated: !!token,
      isLoading: false,
    });
    
    // CLAVE: Configura la cabecera de Axios de forma inmediata.
    setAuthHeader(token); 
  }, []);

  const handleAuth = (token: string) => { 
    localStorage.setItem('jwt_token', token);
    resolveAuthState(token); // Esto dispara setAuthHeader(token)
  };

  // Silenciamos el warning de 'user' no usado, ya que solo necesitamos el token para handleAuth.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = (token: string, user: User) => handleAuth(token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = (token: string, user: User) => handleAuth(token);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    // setAuthHeader(null) se llama dentro de resolveAuthState.
    api.post('/logout').catch(() => {});
    resolveAuthState(null);
  }, [resolveAuthState]);

  useEffect(() => {
    let isMounted = true; 

    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      
      if (storedToken && isMounted) {
          // Si hay token, lo establecemos (y setAuthHeader se llama)
          resolveAuthState(storedToken); 
      } else if (isMounted) {
          // Si no hay token, resolvemos sin token (y setAuthHeader(null) se llama)
          resolveAuthState(null);
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
  }, [logout, resolveAuthState]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
