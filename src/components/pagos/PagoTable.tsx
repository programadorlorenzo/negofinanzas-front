'use client';

import { memo, useState } from 'react';
import { Table, Badge, Group, ActionIcon, Text, Tooltip, Stack, Menu, Button, Modal } from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconFileText, IconDots, IconCheck, IconX, IconClock, IconCreditCard, IconBrandWhatsapp, IconCopy } from '@tabler/icons-react';
import { Pago, StatusPagoColors, StatusPagoLabels, MonedaPagoLabels, StatusPago } from '@/types/pago';
import { useAuth } from '@/hooks/useAuth';

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
	const { user } = useAuth();
	const [whatsappModalOpened, setWhatsappModalOpened] = useState(false);
	const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
	
	// Solo Admin y SuperAdmin pueden cambiar estados
	const canChangeStatus = user?.role === 'admin' || user?.role === 'superadmin';
	
	// Solo SuperAdmin puede usar WhatsApp
	const canUseWhatsApp = user?.role === 'superadmin';

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

	const formatWhatsAppMessage = (pago: Pago, isUrgent: boolean = false) => {
		const formatCurrency = (amount: number, currency: string) => {
			const symbols = { PEN: 'S/.', USD: '$', EUR: '€' };
			const symbol = symbols[currency as keyof typeof symbols] || currency;
			return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		};

		let message = '';
		
		if (isUrgent) {
			message += '*URGENTE*\n\n';
		}

		message += `PAGO ${pago.id}: ${pago.descripcion}\n`;
		message += `Total: ${formatCurrency(pago.total, pago.moneda)}\n`;
		message += `Coordinado: ${pago.coordinadoCon || 'No especificado'}\n`;
		message += `Sucursal: ${pago.sucursal?.name || 'General'}\n`;
		message += `Justificación: ${pago.justificacion || 'No especificada'}\n\n`;

		// Información de cuenta destino
		if (pago.cuentaDestino) {
			message += `*Cuenta Destino:*\n`;
			message += `${pago.cuentaDestino.titular}\n`;
			
			// Mostrar número de cuenta o CCI según el banco
			const cuentaInfo = pago.cuentaDestino.banco === 'BCP' 
				? pago.cuentaDestino.numeroCuenta 
				: (pago.cuentaDestino.cci || pago.cuentaDestino.numeroCuenta);
			
			message += `${cuentaInfo}`;
			
			// Asegurar que siempre se muestre el banco
			const banco = pago.cuentaDestino.banco || 'Banco no especificado';
			message += ` - ${banco}`;
			
			if (pago.cuentaDestino.moneda) {
				message += ` (${pago.cuentaDestino.moneda})`;
			}
			
			message += ` [${pago.cuentaDestino.tipo}]\n\n`;
		}

		// Información de cuenta empresa
		if (pago.cuentaPropiaEmpresa) {
			message += `*Cuenta Empresa:*\n`;
			message += `${pago.cuentaPropiaEmpresa.titular}\n`;
			
			// Mostrar número de cuenta o CCI según el banco
			const cuentaInfo = pago.cuentaPropiaEmpresa.banco === 'BCP' 
				? pago.cuentaPropiaEmpresa.numeroCuenta 
				: (pago.cuentaPropiaEmpresa.cci || pago.cuentaPropiaEmpresa.numeroCuenta);
			
			message += `${cuentaInfo}`;
			
			// Asegurar que siempre se muestre el banco
			const banco = pago.cuentaPropiaEmpresa.banco || 'Banco no especificado';
			message += ` - ${banco}`;
			
			if (pago.cuentaPropiaEmpresa.moneda) {
				message += ` (${pago.cuentaPropiaEmpresa.moneda})`;
			}
			
			message += ` [${pago.cuentaPropiaEmpresa.tipo}]\n`;
			message += `💰 Sale de cuenta empresa\n`;
		} else {
			message += `💳 No sale de cuenta empresa\n`;
		}

		return message;
	};

	const handleWhatsAppClick = (pago: Pago) => {
		setSelectedPago(pago);
		setWhatsappModalOpened(true);
	};

	const copyToClipboard = async (isUrgent: boolean) => {
		if (!selectedPago) return;
		
		const message = formatWhatsAppMessage(selectedPago, isUrgent);
		try {
			await navigator.clipboard.writeText(message);
			setWhatsappModalOpened(false);
			setSelectedPago(null);
			// Aquí podrías agregar una notificación de éxito
		} catch (error) {
			console.error('Error copying to clipboard:', error);
		}
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
			<Table.Td style={{ padding: '8px' }}>
				<Text size="xs" fw={500}>
					#{pago.id}
				</Text>
			</Table.Td>
			<Table.Td style={{ padding: '8px', maxWidth: '300px' }}>
				<Text 
					size="xs" 
					fw={500} 
					lineClamp={3}
					style={{ 
						wordBreak: 'break-word',
						hyphens: 'auto'
					}}
				>
					{pago.descripcion}
				</Text>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Text size="xs">
					{pago.coordinadoCon || '-'}
				</Text>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Text size="xs" fw={600}>
					{formatCurrency(pago.total, pago.moneda)}
				</Text>
				<Text size="xs" c="dimmed" style={{ fontSize: '10px' }}>
					{MonedaPagoLabels[pago.moneda]}
				</Text>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Badge color={StatusPagoColors[pago.status]} variant="light" size="xs">
					{StatusPagoLabels[pago.status]}
				</Badge>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
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
			<Table.Td style={{ padding: '8px' }}>
				{pago.cuentaDestino ? (
					<Stack gap={2}>
						<Text size="xs">{pago.cuentaDestino.titular}</Text>
						<Text size="xs" c="dimmed" style={{ fontSize: '10px' }}>
							{pago.cuentaDestino.banco === 'BCP' 
								? pago.cuentaDestino.numeroCuenta 
								: (pago.cuentaDestino.cci || pago.cuentaDestino.numeroCuenta)
							}
							{pago.cuentaDestino.banco && ` - ${pago.cuentaDestino.banco}`}
							{pago.cuentaDestino.moneda && ` (${pago.cuentaDestino.moneda})`}
							{` [${pago.cuentaDestino.tipo}]`}
						</Text>
					</Stack>
				) : (
					<Text size="xs" c="dimmed">
						Sin cuenta destino
					</Text>
				)}
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				{pago.cuentaPropiaEmpresa ? (
					<Stack gap={2}>
						<Text size="xs">{pago.cuentaPropiaEmpresa.titular}</Text>
						<Text size="xs" c="dimmed" style={{ fontSize: '10px' }}>
							{pago.cuentaPropiaEmpresa.banco === 'BCP' 
								? pago.cuentaPropiaEmpresa.numeroCuenta 
								: (pago.cuentaPropiaEmpresa.cci || pago.cuentaPropiaEmpresa.numeroCuenta)
							}
							{pago.cuentaPropiaEmpresa.banco && ` - ${pago.cuentaPropiaEmpresa.banco}`}
							{pago.cuentaPropiaEmpresa.moneda && ` (${pago.cuentaPropiaEmpresa.moneda})`}
							{` [${pago.cuentaPropiaEmpresa.tipo}]`}
						</Text>
					</Stack>
				) : (
					<Text size="xs" c="dimmed">
						Sin cuenta empresa
					</Text>
				)}
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Group gap={2}>
					{pago.voucherFile && (
						<Tooltip label="Ver voucher">
							<ActionIcon
								size="xs"
								variant="light"
								color="blue"
								component="a"
								href={getFileUrl(pago.voucherFile.id)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IconEye size={12} />
							</ActionIcon>
						</Tooltip>
					)}
					{pago.documentFiles && pago.documentFiles.length > 0 && (
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<Tooltip label={`${pago.documentFiles.length} documento(s) - Click para ver`}>
									<ActionIcon size="xs" variant="light" color="green">
										<IconFileText size={12} />
									</ActionIcon>
								</Tooltip>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label style={{ fontSize: '11px' }}>Documentos</Menu.Label>
								{pago.documentFiles.map((file) => (
									<Menu.Item
										key={file.id}
										leftSection={<IconFileText size={12} />}
										component="a"
										href={getFileUrl(file.id)}
										target="_blank"
										rel="noopener noreferrer"
										style={{ fontSize: '11px' }}
									>
										{file.originalName}
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
					)}
				</Group>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Text size="xs">{formatDate(pago.createdAt)}</Text>
			</Table.Td>
			<Table.Td style={{ padding: '8px' }}>
				<Group gap={2}>
					<Tooltip label="Ver detalles">
						<ActionIcon
							size="xs"
							variant="light"
							color="blue"
							onClick={() => onView(pago)}
							disabled={loading}
						>
							<IconEye size={12} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Editar">
						<ActionIcon
							size="xs"
							variant="light"
							color="yellow"
							onClick={() => onEdit(pago)}
							disabled={loading}
						>
							<IconEdit size={12} />
						</ActionIcon>
					</Tooltip>
					
					{canChangeStatus && (
						<Menu shadow="md" width={200}>
							<Menu.Target>
								<Tooltip label="Cambiar estado">
									<ActionIcon
										size="xs"
										variant="light"
										color="grape"
										disabled={loading}
									>
										<IconDots size={12} />
									</ActionIcon>
								</Tooltip>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Label style={{ fontSize: '11px' }}>Cambiar estado</Menu.Label>
								{getStatusChangeOptions(pago.status).map((option) => (
									<Menu.Item
										key={option.status}
										leftSection={getStatusIcon(option.status)}
										onClick={() => onChangeStatus(pago, option.status)}
										style={{ fontSize: '11px' }}
									>
										{option.label}
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
					)}
					
					{canUseWhatsApp && (
						<Tooltip label="Copiar para WhatsApp">
							<ActionIcon
								size="xs"
								variant="light"
								color="green"
								onClick={() => handleWhatsAppClick(pago)}
								disabled={loading}
							>
								<IconBrandWhatsapp size={12} />
							</ActionIcon>
						</Tooltip>
					)}					<Tooltip label="Eliminar">
						<ActionIcon
							size="xs"
							variant="light"
							color="red"
							onClick={() => onDelete(pago)}
							disabled={loading}
						>
							<IconTrash size={12} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<>
			<Table.ScrollContainer minWidth={800}>
				<Table stickyHeader highlightOnHover withColumnBorders style={{ fontSize: '11px' }}>
					<Table.Thead>
						<Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
							<Table.Th style={{ fontSize: '11px', padding: '8px', width: '60px' }}>ID</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px', width: '300px' }}>Descripción</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px', width: '100px' }}>Coordinado</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Total</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Estado</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Sucursal</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Cuenta Destino</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Cuenta Empresa</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Archivos</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Fecha</Table.Th>
							<Table.Th style={{ fontSize: '11px', padding: '8px' }}>Acciones</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody style={{ fontSize: '11px' }}>
						{loading ? (
							<Table.Tr>
								<Table.Td colSpan={11}>
									<Text ta="center" py="md">
										Cargando...
									</Text>
								</Table.Td>
							</Table.Tr>
						) : rows.length > 0 ? (
							rows
						) : (
							<Table.Tr>
								<Table.Td colSpan={11}>
									<Text ta="center" py="md" c="dimmed">
										No se encontraron pagos
									</Text>
								</Table.Td>
							</Table.Tr>
						)}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
			
			{/* Modal para WhatsApp */}
			<Modal
				opened={whatsappModalOpened}
				onClose={() => setWhatsappModalOpened(false)}
				title="Copiar información para WhatsApp"
				size="sm"
			>
				<Stack gap="md">
					<Text size="sm">
						¿Deseas marcar este pago como urgente?
					</Text>
					<Group justify="center" gap="sm">
						<Button
							variant="light"
							color="gray"
							leftSection={<IconCopy size={16} />}
							onClick={() => copyToClipboard(false)}
						>
							No, normal
						</Button>
						<Button
							color="orange"
							leftSection={<IconCopy size={16} />}
							onClick={() => copyToClipboard(true)}
						>
							Sí, urgente
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
});