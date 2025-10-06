import { apiClient } from '@/lib/axios-config';
import { 
  Sucursal, 
  CreateSucursalDto, 
  UpdateSucursalDto, 
  SucursalFilters, 
  PaginatedSucursales 
} from '@/types/sucursales';

export const sucursalesApi = {
  // Obtener todas las sucursales con filtros y paginación
  getAll: async (filters: SucursalFilters = {}): Promise<PaginatedSucursales> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/sucursales?${params.toString()}`);
    return response.data;
  },

  // Obtener una sucursal por ID
  getById: async (id: number): Promise<Sucursal> => {
    const response = await apiClient.get(`/sucursales/${id}`);
    return response.data;
  },

  // Crear nueva sucursal
  create: async (data: CreateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.post('/sucursales', data);
    return response.data;
  },

  // Actualizar sucursal
  update: async (id: number, data: UpdateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.patch(`/sucursales/${id}`, data);
    return response.data;
  },

  // Eliminar sucursal
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sucursales/${id}`);
  },

  // Cambiar estado activo/inactivo
  toggleStatus: async (id: number): Promise<Sucursal> => {
    const response = await apiClient.patch(`/sucursales/${id}/toggle-status`);
    return response.data;
  },
};