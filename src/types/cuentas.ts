// Enums
export enum TipoCuenta {
  AHORROS = 'AHORROS',
  CORRIENTE = 'CORRIENTE',
  PLAZO_FIJO = 'PLAZO_FIJO',
  EMPRESA = 'EMPRESA',
}

export enum Moneda {
  PEN = 'PEN', // Soles
  USD = 'USD', // Dólares
  EUR = 'EUR', // Euros
}

// Interfaces
export interface Cuenta {
  id: number;
  titular?: string;
  numeroCuenta?: string;
  cci?: string;
  moneda?: Moneda;
  tipo?: TipoCuenta;
  banco?: string;
  esEmpresa?: boolean;
  isActive?: boolean;
  createdBy?: number;
  sucursalId?: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  sucursal?: {
    id: number;
    name: string;
    code?: string;
  };
}

// DTOs para crear cuenta
export interface CreateCuentaDto {
  titular?: string;
  numeroCuenta?: string;
  cci?: string;
  moneda?: Moneda;
  tipo?: TipoCuenta;
  banco?: string;
  esEmpresa?: boolean;
  isActive?: boolean;
  sucursalId?: number;
}

// DTOs para actualizar cuenta
export interface UpdateCuentaDto {
  titular?: string;
  numeroCuenta?: string;
  cci?: string;
  moneda?: Moneda;
  tipo?: TipoCuenta;
  banco?: string;
  esEmpresa?: boolean;
  isActive?: boolean;
  sucursalId?: number;
}

// Filtros para búsqueda
export interface CuentaFilters {
  search?: string;
  moneda?: Moneda;
  tipo?: TipoCuenta;
  banco?: string;
  esEmpresa?: boolean;
  isActive?: boolean;
  sucursalId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Respuesta paginada
export interface PaginatedCuentas {
  data: Cuenta[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Opciones para selects
export interface TipoCuentaOption {
  value: TipoCuenta;
  label: string;
}

export interface MonedaOption {
  value: Moneda;
  label: string;
}

// Constantes para opciones
export const TIPO_CUENTA_OPTIONS: TipoCuentaOption[] = [
  { value: TipoCuenta.AHORROS, label: 'Ahorros' },
  { value: TipoCuenta.CORRIENTE, label: 'Corriente' },
  { value: TipoCuenta.PLAZO_FIJO, label: 'Plazo Fijo' },
  { value: TipoCuenta.EMPRESA, label: 'Empresa' },
];

export const MONEDA_OPTIONS: MonedaOption[] = [
  { value: Moneda.PEN, label: 'Soles (PEN)' },
  { value: Moneda.USD, label: 'Dólares (USD)' },
  { value: Moneda.EUR, label: 'Euros (EUR)' },
];

// Funciones de utilidad
export const getTipoCuentaLabel = (tipo: TipoCuenta): string => {
  const option = TIPO_CUENTA_OPTIONS.find(opt => opt.value === tipo);
  return option?.label || tipo;
};

export const getMonedaLabel = (moneda: Moneda): string => {
  const option = MONEDA_OPTIONS.find(opt => opt.value === moneda);
  return option?.label || moneda;
};