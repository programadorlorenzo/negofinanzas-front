import { IconHome, IconMapPin, IconChartBar, IconUsers, IconSettings, IconCreditCard, IconCurrencyDollar } from '@tabler/icons-react';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number; stroke?: number; }>;
  description?: string;
  disabled?: boolean;
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

// Función para obtener elementos del menú filtrados por permisos
export const getMenuItems = (userPermissions?: string[]): MenuItem[] => {
  // Por ahora retornamos todos los elementos, pero aquí se puede filtrar por permisos
  // En el futuro se puede usar userPermissions para filtrar
  console.log('User permissions:', userPermissions); // Para evitar el warning, se usará más adelante
  return navigationMenu.filter(item => !item.disabled);
};