import { IconHome, IconMapPin, IconChartBar, IconUsers, IconSettings } from '@tabler/icons-react';

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
export const getMenuItems = (_userPermissions?: string[]): MenuItem[] => {
  // Por ahora retornamos todos los elementos, pero aquí se puede filtrar por permisos
  return navigationMenu.filter(item => !item.disabled);
};