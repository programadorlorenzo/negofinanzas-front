'use client';

import { Button, Group, Text, Stack, Badge, Grid, Anchor } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconAlertTriangle, IconEye, IconDownload } from '@tabler/icons-react';
import {
	Pago,
	CreatePagoData,
	UpdatePagoData,
	StatusPagoLabels,
	MonedaPagoLabels,
	StatusPagoColors,
} from '@/types/pago';
import { PagoForm } from './PagoForm';
import { PagosAPI } from '@/lib/api/pagos';

interface UsePagoModalsProps {
	sucursales: Array<{ id: number; name: string; code?: string }>;
	onSuccess: () => void;
}

export function usePagoModals({ sucursales, onSuccess }: UsePagoModalsProps) {
	const formatCurrency = (amount: number, currency: string) => {
		const symbols = {
			PEN: 'S/.',
			USD: '$',
			EUR: '€',
		};
		const symbol = symbols[currency as keyof typeof symbols] || currency;
		return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-PE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getFileUrl = (fileId: number) => {
		return `${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`;
	};

	const openCreateModal = () => {
		modals.open({
			title: 'Crear Nuevo Pago',
			size: 'xl',
			children: (
				<PagoForm
					onSubmit={async (data: CreatePagoData | UpdatePagoData) => {
						try {
							await PagosAPI.create(data as CreatePagoData);
							notifications.show({
								title: 'Éxito',
								message: 'Pago creado correctamente',
								color: 'green',
							});
							modals.closeAll();
							onSuccess();
						} catch {
							notifications.show({
								title: 'Error',
								message: 'Error al crear el pago',
								color: 'red',
							});
						}
					}}
					onCancel={() => modals.closeAll()}
					sucursales={sucursales}
				/>
			),
		});
	};

	const openEditModal = (pago: Pago) => {
		modals.open({
			title: `Editar Pago #${pago.id}`,
			size: 'xl',
			children: (
				<PagoForm
					initialData={pago}
					isEdit
					onSubmit={async (data: CreatePagoData | UpdatePagoData) => {
						try {
							await PagosAPI.update(pago.id, data as UpdatePagoData);
							notifications.show({
								title: 'Éxito',
								message: 'Pago actualizado correctamente',
								color: 'green',
							});
							modals.closeAll();
							onSuccess();
						} catch {
							notifications.show({
								title: 'Error',
								message: 'Error al actualizar el pago',
								color: 'red',
							});
						}
					}}
					onCancel={() => modals.closeAll()}
					sucursales={sucursales}
				/>
			),
		});
	};

	const openViewModal = (pago: Pago) => {
		modals.open({
			title: `Pago #${pago.id} - Detalles`,
			size: 'lg',
			children: (
				<Stack gap="md">
					<Grid>
						<Grid.Col span={6}>
							<Text size="sm" c="dimmed">Estado</Text>
							<Badge color={StatusPagoColors[pago.status]} size="lg">
								{StatusPagoLabels[pago.status]}
							</Badge>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text size="sm" c="dimmed">Monto</Text>
							<Text size="xl" fw={700}>
								{formatCurrency(pago.total, pago.moneda)}
							</Text>
							<Text size="sm" c="dimmed">{MonedaPagoLabels[pago.moneda]}</Text>
						</Grid.Col>
					</Grid>

					<div>
						<Text size="sm" c="dimmed">Descripción</Text>
						<Text size="md">{pago.descripcion}</Text>
					</div>

					{pago.justificacion && (
						<div>
							<Text size="sm" c="dimmed">Justificación</Text>
							<Text size="md">{pago.justificacion}</Text>
						</div>
					)}

					{pago.coordinadoCon && (
						<div>
							<Text size="sm" c="dimmed">Coordinado con</Text>
							<Text size="md">{pago.coordinadoCon}</Text>
						</div>
					)}

					{pago.sucursal && (
						<div>
							<Text size="sm" c="dimmed">Sucursal</Text>
							<Text size="md">
								{pago.sucursal.name} {pago.sucursal.code && `(${pago.sucursal.code})`}
							</Text>
						</div>
					)}

					{pago.voucherFile && (
						<div>
							<Text size="sm" c="dimmed" mb="xs">Voucher</Text>
							<Group>
								<Badge color="blue">{pago.voucherFile.originalName}</Badge>
								<Group gap="xs">
									<Anchor
										href={getFileUrl(pago.voucherFile.id)}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button size="xs" variant="light" leftSection={<IconEye size={14} />}>
											Ver
										</Button>
									</Anchor>
									<Anchor
										href={getFileUrl(pago.voucherFile.id)}
										download={pago.voucherFile.originalName}
									>
										<Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
											Descargar
										</Button>
									</Anchor>
								</Group>
							</Group>
						</div>
					)}

					{pago.documentFiles && pago.documentFiles.length > 0 && (
						<div>
							<Text size="sm" c="dimmed" mb="xs">Documentos</Text>
							<Stack gap="xs">
								{pago.documentFiles.map((file) => (
									<Group key={file.id} justify="space-between">
										<Badge color="green">{file.originalName}</Badge>
										<Group gap="xs">
											<Anchor
												href={getFileUrl(file.id)}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Button size="xs" variant="light" leftSection={<IconEye size={14} />}>
													Ver
												</Button>
											</Anchor>
											<Anchor href={getFileUrl(file.id)} download={file.originalName}>
												<Button size="xs" variant="light" leftSection={<IconDownload size={14} />}>
													Descargar
												</Button>
											</Anchor>
										</Group>
									</Group>
								))}
							</Stack>
						</div>
					)}

					<Grid>
						<Grid.Col span={6}>
							<Text size="sm" c="dimmed">Fecha de creación</Text>
							<Text size="sm">{formatDate(pago.createdAt)}</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text size="sm" c="dimmed">Última actualización</Text>
							<Text size="sm">{formatDate(pago.updatedAt)}</Text>
						</Grid.Col>
					</Grid>
				</Stack>
			),
		});
	};

	const openDeleteModal = (pago: Pago) => {
		modals.openConfirmModal({
			title: 'Eliminar Pago',
			children: (
				<Stack gap="md">
					<Group>
						<IconAlertTriangle size={24} color="orange" />
						<Text>¿Estás seguro de que deseas eliminar este pago?</Text>
					</Group>
					<Text size="sm" c="dimmed">
						<strong>Pago:</strong> {pago.descripcion}
					</Text>
					<Text size="sm" c="dimmed">
						<strong>Monto:</strong> {formatCurrency(pago.total, pago.moneda)}
					</Text>
					<Text size="sm" c="red">
						Esta acción no se puede deshacer.
					</Text>
				</Stack>
			),
			labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
			confirmProps: { color: 'red', leftSection: <IconTrash size={16} /> },
			onConfirm: async () => {
				try {
					await PagosAPI.delete(pago.id);
					notifications.show({
						title: 'Éxito',
						message: 'Pago eliminado correctamente',
						color: 'green',
					});
					onSuccess();
				} catch {
					notifications.show({
						title: 'Error',
						message: 'Error al eliminar el pago',
						color: 'red',
					});
				}
			},
		});
	};

	return {
		openCreateModal,
		openEditModal,
		openViewModal,
		openDeleteModal,
	};
}