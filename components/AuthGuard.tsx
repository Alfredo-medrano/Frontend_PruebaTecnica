'use client';

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Componente de orden superior para proteger rutas.
 * Muestra un spinner mientras verifica la sesión y redirige si no está autenticado.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const router = useRouter();

  // Esta variable se mantiene solo para ayudar al useEffect a decidir
  // si debe redirigir si NO hay token (es un chequeo de cliente).
  const isClientTokenAvailable = 
    typeof window !== 'undefined' && localStorage.getItem('jwt_token');

  useEffect(() => {
    // CONDICIÓN PARA REDIRIGIR: Si AuthContext terminó de cargar (false) Y 
    // no está autenticado (false) Y no hay token en el almacenamiento local.
    if (!isLoading && !isAuthenticated && !isClientTokenAvailable) {
      router.push('/login');
    }
    
  }, [isAuthenticated, isLoading, router, isClientTokenAvailable]);

  // CORRECCIÓN CLAVE: Solo mostrar el spinner si el contexto *todavía está cargando*.
  // Si isLoading es false, el flujo debe ser: o muestra contenido (isAuthenticated) o redirige (useEffect).
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="ml-2 text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  // Si está autenticado, renderiza el contenido inmediatamente.
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // Si no está autenticado (y ya terminó de cargar), 
  // no muestra nada. El useEffect ya habrá disparado la redirección a /login.
  return null; 
}
