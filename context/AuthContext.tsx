'use client';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { setAuthHeader } from '@/lib/axios';
import { AuthState, User } from '@/types/task'; 

// Definición de la interfaz del Contexto de Autenticación
interface AuthContextType extends AuthState {
  login: (token: string | null | undefined, user: User) => void;
  logout: () => void;
  register: (token: string | null | undefined, user: User) => void;
}

// Estado inicial de autenticación
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Creación del Contexto de Autenticación
export const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // Función para resolver el estado de autenticación
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

  // Manejo de autenticación (login y register)
  const handleAuth = (token: string | null | undefined) => { 
    if (token && typeof token === 'string' && token !== 'undefined') {
      localStorage.setItem('jwt_token', token);
      resolveAuthState(token); 
    } else {
      // Si el token no es válido, asegurarse de limpiar el estado y el almacenamiento
      localStorage.removeItem('jwt_token');
      resolveAuthState(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = (token: string | null | undefined, user: User) => handleAuth(token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = (token: string | null | undefined, user: User) => handleAuth(token);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');

    resolveAuthState(null);
  }, [resolveAuthState]);

  useEffect(() => {
    let isMounted = true; 

    // Función asíncrona para verificar el estado de autenticación
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('jwt_token');

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