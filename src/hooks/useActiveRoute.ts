import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook personalizado para determinar si una ruta está activa
 * Optimiza la verificación de rutas activas en la navegación
 */
export const useActiveRoute = () => {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return (href: string) => {
      // Exact match para la ruta raíz
      if (href === '/dashboard' && pathname === '/dashboard') {
        return true;
      }
      
      // Para otras rutas, verificar si la ruta actual comienza con la href
      if (href !== '/dashboard' && pathname.startsWith(href)) {
        return true;
      }
      
      return false;
    };
  }, [pathname]);

  return {
    pathname,
    isActive,
  };
};