'use client';

import { memo } from 'react';
import { Table, Badge, Group, ActionIcon, Text, Tooltip, Stack, Menu } from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconFileText, IconDots, IconCheck, IconX, IconClock, IconCreditCard } from '@tabler/icons-react';
import { Pago, StatusPagoColors, StatusPagoLabels, MonedaPagoLabels, StatusPago } from '@/types/pago';

interface PagoTableProps {
	pagos: Pago[];
	loading?: boolean;
	onEdit: (pago: Pago) => void;
	onDelete: (pago: Pago) => void;
	onView: (pago: Pago) => void;
	onChangeStatus: (pago: Pago, newStatus: StatusPago) => void;
}

export const PagoTable = memo(function PagoTable({
	pagos,
	loading = false,
	onEdit,
	onDelete,
	onView,
	onChangeStatus,
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

	const getStatusIcon = (status: StatusPago) => {
		switch (status) {
			case StatusPago.PENDIENTE:
				return <IconClock size={14} />;
			case StatusPago.APROBADO:
				return <IconCheck size={14} />;
			case StatusPago.RECHAZADO:
				return <IconX size={14} />;
			case StatusPago.PAGADO:
				return <IconCreditCard size={14} />;
			default:
				return <IconClock size={14} />;
		}
	};

	const getStatusChangeOptions = (currentStatus: StatusPago) => {
		const allStatuses = [
			{ status: StatusPago.PENDIENTE, label: StatusPagoLabels[StatusPago.PENDIENTE], color: StatusPagoColors[StatusPago.PENDIENTE] },
			{ status: StatusPago.APROBADO, label: StatusPagoLabels[StatusPago.APROBADO], color: StatusPagoColors[StatusPago.APROBADO] },
			{ status: StatusPago.RECHAZADO, label: StatusPagoLabels[StatusPago.RECHAZADO], color: StatusPagoColors[StatusPago.RECHAZADO] },
			{ status: StatusPago.PAGADO, label: StatusPagoLabels[StatusPago.PAGADO], color: StatusPagoColors[StatusPago.PAGADO] },
		];
		
		return allStatuses.filter(item => item.status !== currentStatus);
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
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<Tooltip label={`${pago.documentFiles.length} documento(s) - Click para ver`}>
									<ActionIcon size="sm" variant="light" color="green">
										<IconFileText size={14} />
									</ActionIcon>
								</Tooltip>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label>Documentos</Menu.Label>
								{pago.documentFiles.map((file) => (
									<Menu.Item
										key={file.id}
										leftSection={<IconFileText size={14} />}
										component="a"
										href={getFileUrl(file.id)}
										target="_blank"
										rel="noopener noreferrer"
									>
										{file.originalName}
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
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
					
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Tooltip label="Cambiar estado">
								<ActionIcon
									size="sm"
									variant="light"
									color="grape"
									disabled={loading}
								>
									<IconDots size={14} />
								</ActionIcon>
							</Tooltip>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Cambiar estado</Menu.Label>
							{getStatusChangeOptions(pago.status).map((option) => (
								<Menu.Item
									key={option.status}
									leftSection={getStatusIcon(option.status)}
									onClick={() => onChangeStatus(pago, option.status)}
								>
									{option.label}
								</Menu.Item>
							))}
						</Menu.Dropdown>
					</Menu>

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