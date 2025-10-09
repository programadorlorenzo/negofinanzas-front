import { IconHome, IconMapPin, IconChartBar, IconUsers, IconSettings, IconCreditCard, IconCurrencyDollar } from '@tabler/icons-react';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number; stroke?: number; }>;
  description?: string;
  disabled?: boolean;
  requiredRoles?: string[]; // Roles requeridos para ver este item
}

export const navigationMenu: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    href: '/dashboard',
    icon: IconHome,
    description: 'Panel principal',
  },
  {
    id: 'sucursales',
    label: 'Sucursales',
    href: '/sucursales',
    icon: IconMapPin,
    description: 'Gestión de sucursales',
    requiredRoles: ['superadmin', 'admin'],
  },
  {
    id: 'cuentas',
    label: 'Cuentas',
    href: '/cuentas',
    icon: IconCreditCard,
    description: 'Gestión de cuentas bancarias',
  },
  {
    id: 'pagos',
    label: 'Pagos',
    href: '/pagos',
    icon: IconCurrencyDollar,
    description: 'Gestión de pagos y vouchers',
  },
  {
    id: 'reportes',
    label: 'Reportes',
    href: '/reportes',
    icon: IconChartBar,
    description: 'Reportes y estadísticas',
    disabled: true, // Temporalmente deshabilitado
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    href: '/usuarios',
    icon: IconUsers,
    description: 'Gestión de usuarios',
    disabled: true, // Temporalmente deshabilitado
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    href: '/configuracion',
    icon: IconSettings,
    description: 'Configuración del sistema',
    disabled: true, // Temporalmente deshabilitado
  },
];

// Función para obtener elementos del menú filtrados por permisos y roles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getMenuItems = (userRole?: string, userPermissions?: string[]): MenuItem[] => {
  // Filtrar por elementos no deshabilitados y por roles
  return navigationMenu.filter(item => {
    // Si está deshabilitado, no mostrar
    if (item.disabled) return false;
    
    // Si requiere roles específicos, verificar que el usuario tenga uno de esos roles
    if (item.requiredRoles && item.requiredRoles.length > 0) {
      return userRole && item.requiredRoles.includes(userRole);
    }
    
    // Si no tiene restricciones de roles, mostrar
    return true;
  });
};