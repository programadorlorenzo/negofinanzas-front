import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { clearSessionCache } from '@/lib/axios-config';

export const useAuth = () => {
  const { data: session, status } = useSession();

  // Función para cerrar sesión con limpieza ULTRA agresiva
  const signOut = async () => {
    try {
      console.log('🚪 LOGOUT - Iniciando proceso de logout...');
      
      // 1. Limpiar cache de sesión de axios INMEDIATAMENTE
      console.log('🧹 LOGOUT - Limpiando cache de axios...');
      clearSessionCache();
      
      // 2. Limpiar todas las cookies de NextAuth manualmente
      if (typeof window !== 'undefined') {
        console.log('🍪 LOGOUT - Limpiando cookies de NextAuth...');
        const cookieNames = [
          'next-auth.session-token',
          'next-auth.callback-url',
          'next-auth.csrf-token',
          '__Secure-next-auth.session-token',
          '__Host-next-auth.csrf-token',
          'next-auth.pkce.code_verifier'
        ];
        
        cookieNames.forEach(name => {
          // Limpiar en múltiples variaciones de dominio y path
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
        });
        
        // 3. Limpiar todo el almacenamiento
        console.log('💾 LOGOUT - Limpiando localStorage y sessionStorage...');
        localStorage.clear();
        sessionStorage.clear();
        
        // 4. Limpiar cache del navegador si es posible
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
      }
      
      // 5. Cerrar sesión de NextAuth SIN redirección
      console.log('🔐 LOGOUT - Ejecutando signOut de NextAuth...');
      await nextAuthSignOut({ 
        redirect: false,
        callbackUrl: '/auth/signin' 
      });
      
      // 6. Pequeña pausa para asegurar que todo se procese
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 7. Forzar recarga COMPLETA de la página para eliminar cualquier cache
      console.log('🔄 LOGOUT - Forzando recarga completa...');
      window.location.href = '/auth/signin';
      
    } catch (error) {
      console.error('❌ LOGOUT - Error al cerrar sesión:', error);
      // En caso de error, forzar recarga de todas formas
      window.location.href = '/auth/signin';
    }
  };

  // Estado combinado de carga
  const isLoading = status === 'loading';

  return {
    // Datos del usuario
    user: session?.user,
    session,
    
    // Estados
    isAuthenticated: !!session,
    isLoading,
    
    // Funciones
    signOut,
    
    // Información adicional
    accessToken: session?.accessToken,
    sessionStatus: status,
  };
};