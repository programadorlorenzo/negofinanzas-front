import { apiClient } from '@/lib/axios-config';

export interface Sucursal {
	id: number;
	name: string;
	code?: string;
	address?: string;
	phone?: string;
	email?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedSucursalesResponse {
	data: Sucursal[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class SucursalesAPI {
	private static baseUrl = '/sucursales';

	static async getAll(filters: { page?: number; limit?: number } = {}): Promise<PaginatedSucursalesResponse> {
		const params = new URLSearchParams();
		
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
		return response.data;
	}
}