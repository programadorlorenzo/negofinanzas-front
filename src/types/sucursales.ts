export interface Sucursal {
  id: number;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSucursalDto {
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateSucursalDto {
  name?: string;
  code?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

export interface SucursalFilters {
  page?: number;
  limit?: number;
  name?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedSucursales {
  data: Sucursal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}