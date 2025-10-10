import { apiClient } from '@/lib/axios-config';
import {
	Pago,
	CreatePagoData,
	UpdatePagoData,
	PagoFilters,
	PaginatedPagosResponse,
	FileResponse,
	StatusPago,
} from '@/types/pago';

export class PagosAPI {
	private static baseUrl = '/pagos';

	static async getAll(filters: PagoFilters = {}): Promise<PaginatedPagosResponse> {
		const params = new URLSearchParams();
		
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				params.append(key, String(value));
			}
		});

		const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
		return response.data;
	}

	static async getById(id: number): Promise<Pago> {
		const response = await apiClient.get(`${this.baseUrl}/${id}`);
		return response.data;
	}

	static async create(data: CreatePagoData): Promise<Pago> {
		const response = await apiClient.post(this.baseUrl, data);
		return response.data;
	}

	static async update(id: number, data: UpdatePagoData): Promise<Pago> {
		const response = await apiClient.patch(`${this.baseUrl}/${id}`, data);
		return response.data;
	}

	static async delete(id: number): Promise<void> {
		await apiClient.delete(`${this.baseUrl}/${id}`);
	}

	static async changeStatus(id: number, status: StatusPago): Promise<Pago> {
		const response = await apiClient.patch(`${this.baseUrl}/${id}/status`, { status });
		return response.data;
	}
}

export class FilesAPI {
	private static baseUrl = '/files';

	static async upload(file: File, category?: string): Promise<FileResponse> {
		const formData = new FormData();
		formData.append('file', file);
		if (category) {
			formData.append('category', category);
		}

		const response = await apiClient.post(`${this.baseUrl}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	}

	static async getAll(category?: string): Promise<FileResponse[]> {
		const params = category ? `?category=${category}` : '';
		const response = await apiClient.get(`${this.baseUrl}${params}`);
		return response.data;
	}

	static async delete(id: number): Promise<void> {
		await apiClient.delete(`${this.baseUrl}/${id}`);
	}

	static getFileUrl(id: number): string {
		return `${process.env.NEXT_PUBLIC_API_URL}/files/${id}`;
	}
}