import { apiClient } from '@/lib/axios-config';
import { 
  Cuenta, 
  CreateCuentaDto, 
  UpdateCuentaDto, 
  CuentaFilters, 
  PaginatedCuentas 
} from '@/types/cuentas';

export const cuentasApi = {
  // Obtener todas las cuentas con filtros y paginación
  getAll: async (filters: CuentaFilters = {}): Promise<PaginatedCuentas> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/cuentas?${params.toString()}`);
    return response.data;
  },

  // Obtener una cuenta por ID
  getById: async (id: number): Promise<Cuenta> => {
    const response = await apiClient.get(`/cuentas/${id}`);
    return response.data;
  },

  // Crear nueva cuenta
  create: async (data: CreateCuentaDto): Promise<Cuenta> => {
    const response = await apiClient.post('/cuentas', data);
    return response.data;
  },

  // Actualizar cuenta
  update: async (id: number, data: UpdateCuentaDto): Promise<Cuenta> => {
    const response = await apiClient.patch(`/cuentas/${id}`, data);
    return response.data;
  },

  // Eliminar cuenta (soft delete)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/cuentas/${id}`);
  },

  // Cambiar estado activo/inactivo
  toggleStatus: async (id: number): Promise<Cuenta> => {
    const response = await apiClient.patch(`/cuentas/${id}/toggle-status`);
    return response.data;
  },

  // Obtener cuentas activas (para selects)
  getActiveCuentas: async (): Promise<Cuenta[]> => {
    const response = await apiClient.get('/cuentas/active/list');
    return response.data;
  },

  // Buscar por número de cuenta
  getByNumeroCuenta: async (numeroCuenta: string): Promise<Cuenta> => {
    const response = await apiClient.get(`/cuentas/numero/${numeroCuenta}`);
    return response.data;
  },

  // Buscar por CCI
  getByCci: async (cci: string): Promise<Cuenta> => {
    const response = await apiClient.get(`/cuentas/cci/${cci}`);
    return response.data;
  },
};