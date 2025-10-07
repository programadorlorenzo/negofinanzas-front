'use client';

import { memo } from 'react';
import { Table, Badge, Group, ActionIcon, Text, Tooltip, Stack } from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconFileText } from '@tabler/icons-react';
import { Pago, StatusPagoColors, StatusPagoLabels, MonedaPagoLabels } from '@/types/pago';

interface PagoTableProps {
	pagos: Pago[];
	loading?: boolean;
	onEdit: (pago: Pago) => void;
	onDelete: (pago: Pago) => void;
	onView: (pago: Pago) => void;
}

export const PagoTable = memo(function PagoTable({
	pagos,
	loading = false,
	onEdit,
	onDelete,
	onView,
}: PagoTableProps) {
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
			month: '2-digit',
			day: '2-digit',
		});
	};

	const getFileUrl = (fileId: number) => {
		return `${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`;
	};

	const rows = pagos.map((pago) => (
		<Table.Tr key={pago.id}>
			<Table.Td>
				<Text size="sm" fw={500}>
					#{pago.id}
				</Text>
			</Table.Td>
			<Table.Td>
				<Stack gap={4}>
					<Text size="sm" fw={500} lineClamp={2}>
						{pago.descripcion}
					</Text>
					{pago.coordinadoCon && (
						<Text size="xs" c="dimmed">
							Coordinado con: {pago.coordinadoCon}
						</Text>
					)}
				</Stack>
			</Table.Td>
			<Table.Td>
				<Text size="sm" fw={600}>
					{formatCurrency(pago.total, pago.moneda)}
				</Text>
				<Text size="xs" c="dimmed">
					{MonedaPagoLabels[pago.moneda]}
				</Text>
			</Table.Td>
			<Table.Td>
				<Badge color={StatusPagoColors[pago.status]} variant="light">
					{StatusPagoLabels[pago.status]}
				</Badge>
			</Table.Td>
			<Table.Td>
				{pago.sucursal ? (
					<Stack gap={4}>
						<Text size="sm">{pago.sucursal.name}</Text>
						{pago.sucursal.code && (
							<Text size="xs" c="dimmed">
								{pago.sucursal.code}
							</Text>
						)}
					</Stack>
				) : (
					<Text size="sm" c="dimmed">
						General
					</Text>
				)}
			</Table.Td>
			<Table.Td>
				<Group gap={4}>
					{pago.voucherFile && (
						<Tooltip label="Ver voucher">
							<ActionIcon
								size="sm"
								variant="light"
								color="blue"
								component="a"
								href={getFileUrl(pago.voucherFile.id)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IconEye size={14} />
							</ActionIcon>
						</Tooltip>
					)}
					{pago.documentFiles && pago.documentFiles.length > 0 && (
						<Tooltip label={`${pago.documentFiles.length} documento(s)`}>
							<ActionIcon size="sm" variant="light" color="green">
								<IconFileText size={14} />
							</ActionIcon>
						</Tooltip>
					)}
				</Group>
			</Table.Td>
			<Table.Td>
				<Text size="sm">{formatDate(pago.createdAt)}</Text>
			</Table.Td>
			<Table.Td>
				<Group gap={4}>
					<Tooltip label="Ver detalles">
						<ActionIcon
							size="sm"
							variant="light"
							color="blue"
							onClick={() => onView(pago)}
							disabled={loading}
						>
							<IconEye size={14} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Editar">
						<ActionIcon
							size="sm"
							variant="light"
							color="yellow"
							onClick={() => onEdit(pago)}
							disabled={loading}
						>
							<IconEdit size={14} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Eliminar">
						<ActionIcon
							size="sm"
							variant="light"
							color="red"
							onClick={() => onDelete(pago)}
							disabled={loading}
						>
							<IconTrash size={14} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Table.ScrollContainer minWidth={1200}>
			<Table striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>ID</Table.Th>
						<Table.Th>Descripción</Table.Th>
						<Table.Th>Monto</Table.Th>
						<Table.Th>Estado</Table.Th>
						<Table.Th>Sucursal</Table.Th>
						<Table.Th>Archivos</Table.Th>
						<Table.Th>Fecha</Table.Th>
						<Table.Th>Acciones</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{loading ? (
						<Table.Tr>
							<Table.Td colSpan={8}>
								<Text ta="center" py="md">
									Cargando...
								</Text>
							</Table.Td>
						</Table.Tr>
					) : rows.length > 0 ? (
						rows
					) : (
						<Table.Tr>
							<Table.Td colSpan={8}>
								<Text ta="center" py="md" c="dimmed">
									No se encontraron pagos
								</Text>
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
});