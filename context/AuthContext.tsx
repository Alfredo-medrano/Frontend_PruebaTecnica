'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
// CORRECCIÓN: Eliminamos 'api' de la importación porque ya no se usa (corrige Eslint)
import { setAuthHeader } from '@/lib/axios';
import { AuthState, User } from '@/types/task'; 

// Interfaces necesarias para el Context (AHORA INCLUIDAS)
interface AuthContextType extends AuthState {
  login: (token: string | null | undefined, user: User) => void;
  logout: () => void;
  register: (token: string | null | undefined, user: User) => void;
}

// Constante inicial (AHORA INCLUIDA)
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Creación del Context (AHORA INCLUIDO)
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // CORRECCIÓN: Valida que el token no sea el string "undefined"
  const resolveAuthState = useCallback((token: string | null) => {
    const validToken = (token && token !== 'undefined') ? token : null;

    setState({
      user: validToken ? { id: 0, name: 'Usuario', email: 'email@test.com' } : null,
      token: validToken,
      isAuthenticated: !!validToken,
      isLoading: false,
    });
    
    setAuthHeader(validToken); 
  }, []);

  // CORRECCIÓN: Valida el token ANTES de guardarlo para evitar "undefined"
  const handleAuth = (token: string | null | undefined) => { 
    if (token && typeof token === 'string' && token !== 'undefined') {
      localStorage.setItem('jwt_token', token);
      resolveAuthState(token); 
    } else {
      // Si el token es inválido (null, undefined, o "undefined"), limpiamos todo
      localStorage.removeItem('jwt_token');
      resolveAuthState(null);
    }
  };

  // Silenciamos el warning de 'user' no usado
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = (token: string | null | undefined, user: User) => handleAuth(token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = (token: string | null | undefined, user: User) => handleAuth(token);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    
    // Esta línea sigue comentada para evitar el bucle infinito
    // api.post('/logout').catch(() => {});

    resolveAuthState(null);
  }, [resolveAuthState]);

  useEffect(() => {
    let isMounted = true; 

    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      
      // La validación en resolveAuthState se encargará del string "undefined"
      if (storedToken && isMounted) {
          resolveAuthState(storedToken); 
      } else if (isMounted) {
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