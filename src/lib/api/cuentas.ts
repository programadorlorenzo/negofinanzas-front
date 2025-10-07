import { apiClient } from '@/lib/axios-config';

export interface Cuenta {
	id: number;
	titular: string;
	numeroCuenta: string;
	cci: string;
	moneda: string;
	tipo: string;
	saldo?: number;
	sucursalId?: number;
	sucursal?: {
		id: number;
		name: string;
		code?: string;
	};
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedCuentasResponse {
	data: Cuenta[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class CuentasAPI {
	private static baseUrl = '/cuentas';

	static async getAll(filters: { page?: number; limit?: number } = {}): Promise<PaginatedCuentasResponse> {
		const params = new URLSearchParams();
		
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
		return response.data;
	}

	static async getById(id: number): Promise<Cuenta> {
		const response = await apiClient.get(`${this.baseUrl}/${id}`);
		return response.data;
	}
}