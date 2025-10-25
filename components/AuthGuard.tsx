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

  // Evaluar si hay un token en el almacenamiento local.
  const isClientTokenAvailable = 
    typeof window !== 'undefined' && localStorage.getItem('jwt_token');

  useEffect(() => {
    // Redirigir a /login si no está autenticado y no hay token en el almacenamiento.
    if (!isLoading && !isAuthenticated && !isClientTokenAvailable) {
      router.push('/login');
    }
    
  }, [isAuthenticated, isLoading, router, isClientTokenAvailable]);

  // Mientras se verifica la sesión, mostrar un spinner de carga.
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
  
  // Si no está autenticado (y ya terminó de cargar), no muestra nada. El useEffect ya habrá disparado la redirección a /login.
  return null; 
}
