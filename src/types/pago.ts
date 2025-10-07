export enum StatusPago {
	PENDIENTE = 'pendiente',
	APROBADO = 'aprobado',
	RECHAZADO = 'rechazado',
	PAGADO = 'pagado',
}

export enum MonedaPago {
	PEN = 'PEN',
	USD = 'USD',
	EUR = 'EUR',
}

export interface FileResponse {
	id: number;
	originalName: string;
	filename: string;
	path: string;
	mimetype: string;
	size: number;
	category?: string;
}

export interface Pago {
	id: number;
	descripcion: string;
	justificacion?: string;
	coordinadoCon?: string;
	total: number;
	moneda: MonedaPago;
	status: StatusPago;
	sucursalId?: number;
	sucursal?: {
		id: number;
		name: string;
		code?: string;
	};
	cuentaDestinoId?: number;
	cuentaDestino?: {
		id: number;
		nombre: string;
		numero: string;
		tipo: string;
	};
	cuentaPropiaEmpresaId?: number;
	cuentaPropiaEmpresa?: {
		id: number;
		nombre: string;
		numero: string;
		tipo: string;
	};
	voucherFile?: FileResponse;
	documentFiles?: FileResponse[];
	createdAt: string;
	updatedAt: string;
}

export interface CreatePagoData {
	descripcion: string;
	justificacion?: string;
	coordinadoCon?: string;
	total: number;
	moneda: MonedaPago;
	sucursalId?: number;
	cuentaDestinoId?: number;
	cuentaPropiaEmpresaId?: number;
	voucherFileId?: number;
	documentFileIds?: number[];
}

export interface UpdatePagoData extends Partial<CreatePagoData> {
	status?: StatusPago;
}

export interface PagoFilters {
	search?: string;
	status?: StatusPago;
	moneda?: MonedaPago;
	sucursalId?: number;
	cuentaDestinoId?: number;
	cuentaPropiaEmpresaId?: number;
	montoMin?: number;
	montoMax?: number;
	fechaDesde?: string;
	fechaHasta?: string;
	page?: number;
	limit?: number;
}

export interface PaginatedPagosResponse {
	data: Pago[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const StatusPagoLabels: Record<StatusPago, string> = {
	[StatusPago.PENDIENTE]: 'Pendiente',
	[StatusPago.APROBADO]: 'Aprobado',
	[StatusPago.RECHAZADO]: 'Rechazado',
	[StatusPago.PAGADO]: 'Pagado',
};

export const MonedaPagoLabels: Record<MonedaPago, string> = {
	[MonedaPago.PEN]: 'Soles (PEN)',
	[MonedaPago.USD]: 'Dólares (USD)',
	[MonedaPago.EUR]: 'Euros (EUR)',
};

export const StatusPagoColors: Record<StatusPago, string> = {
	[StatusPago.PENDIENTE]: 'yellow',
	[StatusPago.APROBADO]: 'green',
	[StatusPago.RECHAZADO]: 'red',
	[StatusPago.PAGADO]: 'blue',
};