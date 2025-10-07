'use client';

import { useState, useEffect, useCallback } from 'react';
import {
	Container,
	Title,
	Button,
	Stack,
	Card,
	Group,
	Text,
	Pagination,
	Loader,
	Alert,
	Box,
} from '@mantine/core';
import { IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { PagoFiltersComponent } from '@/components/pagos/PagoFilters';
import { PagoTable } from '@/components/pagos/PagoTable';
import { usePagoModals } from '@/components/pagos/PagoModals';
import { PagosAPI } from '@/lib/api/pagos';
import { Pago, PagoFilters, PaginatedPagosResponse } from '@/types/pago';
import { SucursalesAPI } from '@/lib/api/sucursales';

const initialFilters: PagoFilters = {
	page: 1,
	limit: 10,
};

export default function PagosPage() {
	const [pagos, setPagos] = useState<Pago[]>([]);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [filters, setFilters] = useState<PagoFilters>(initialFilters);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sucursales, setSucursales] = useState<Array<{ id: number; name: string; code?: string }>>([]);

	const fetchPagos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response: PaginatedPagosResponse = await PagosAPI.getAll(filters);
			setPagos(response.data);
			setPagination({
				total: response.total,
				page: response.page,
				limit: response.limit,
				totalPages: Math.ceil(response.total / response.limit),
			});
		} catch (err) {
			setError('Error al cargar los pagos');
			console.error('Error fetching pagos:', err);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	const fetchSucursales = useCallback(async () => {
		try {
			const response = await SucursalesAPI.getAll({ page: 1, limit: 100 });
			setSucursales(response.data);
		} catch (err) {
			console.error('Error fetching sucursales:', err);
		}
	}, []);

	const { openCreateModal, openEditModal, openViewModal, openDeleteModal } = usePagoModals({
		sucursales,
		onSuccess: fetchPagos,
	});

	useEffect(() => {
		fetchPagos();
	}, [fetchPagos]);

	useEffect(() => {
		fetchSucursales();
	}, [fetchSucursales]);

	const handleFiltersChange = (newFilters: PagoFilters) => {
		setFilters(newFilters);
	};

	const handleClearFilters = () => {
		setFilters(initialFilters);
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	return (
		<Container size="xl" py="md">
			<Stack gap="lg">
				{/* Header */}
				<Group justify="space-between">
					<div>
						<Title order={2}>Gestión de Pagos</Title>
						<Text c="dimmed">Administra los pagos y sus documentos</Text>
					</div>
					<Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
						Nuevo Pago
					</Button>
				</Group>

				{/* Filters */}
				<Card withBorder>
					<PagoFiltersComponent
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onClearFilters={handleClearFilters}
						sucursales={sucursales}
						loading={loading}
					/>
				</Card>

				{/* Error Alert */}
				{error && (
					<Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
						{error}
					</Alert>
				)}

				{/* Table */}
				<Card withBorder>
					<Stack gap="md">
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								{loading
									? 'Cargando...'
									: `Mostrando ${pagos.length} de ${pagination.total} pagos`}
							</Text>
							{pagination.totalPages > 1 && (
								<Text size="sm" c="dimmed">
									Página {pagination.page} de {pagination.totalPages}
								</Text>
							)}
						</Group>

						{loading ? (
							<Box ta="center" py="xl">
								<Loader size="lg" />
							</Box>
						) : (
							<PagoTable
								pagos={pagos}
								loading={loading}
								onEdit={openEditModal}
								onDelete={openDeleteModal}
								onView={openViewModal}
							/>
						)}

						{/* Pagination */}
						{pagination.totalPages > 1 && (
							<Group justify="center" mt="md">
								<Pagination
									value={pagination.page}
									onChange={handlePageChange}
									total={pagination.totalPages}
									size="sm"
									disabled={loading}
								/>
							</Group>
						)}
					</Stack>
				</Card>

				{/* Summary */}
				{!loading && pagos.length > 0 && (
					<Card withBorder>
						<Group justify="space-between">
							<Text size="sm" c="dimmed">
								Total de registros: {pagination.total}
							</Text>
							<Text size="sm" c="dimmed">
								Registros por página: {pagination.limit}
							</Text>
						</Group>
					</Card>
				)}
			</Stack>
		</Container>
	);
}