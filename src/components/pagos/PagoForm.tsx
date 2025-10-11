'use client';

import { memo, useState } from 'react';
import {
	Stack,
	TextInput,
	Textarea,
	NumberInput,
	Select,
	Button,
	Group,
	FileInput,
	Text,
	Badge,
	ActionIcon,
	Box,
	Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconTrash, IconFile } from '@tabler/icons-react';
import {
	CreatePagoData,
	UpdatePagoData,
	Pago,
	MonedaPago,
	MonedaPagoLabels,
	StatusPago,
	// StatusPagoLabels removido - no se usa más
} from '@/types/pago';
import { FilesAPI } from '@/lib/api/pagos';

// Tipo específico para el formulario donde sucursalId es string para el Select
interface PagoFormData {
	descripcion: string;
	justificacion?: string;
	coordinadoCon?: string;
	total: number;
	moneda: MonedaPago;
	sucursalId?: string;
	cuentaDestinoId?: string;
	cuentaPropiaEmpresaId?: string;
	status?: StatusPago;
}

interface PagoFormProps {
	initialData?: Pago;
	onSubmit: (data: CreatePagoData | UpdatePagoData) => Promise<void>;
	onCancel: () => void;
	sucursales: Array<{ id: number; name: string; code?: string }>;
	cuentas: Array<{ 
		id: number; 
		titular: string; 
		numeroCuenta: string; 
		cci?: string;
		banco?: string;
		moneda?: string;
		tipo: string; 
		propiaEmpresa?: boolean;
	}>;
	loading?: boolean;
	isEdit?: boolean;
}

export const PagoForm = memo(function PagoForm({
	initialData,
	onSubmit,
	onCancel,
	sucursales,
	cuentas,
	loading = false,
	isEdit = false,
}: PagoFormProps) {
	const [voucherFile, setVoucherFile] = useState<File | null>(null);
	const [documentFiles, setDocumentFiles] = useState<File[]>([]);
	const [uploadingVoucher, setUploadingVoucher] = useState(false);
	const [uploadingDocs, setUploadingDocs] = useState(false);
	const [voucherFileId, setVoucherFileId] = useState<number | undefined>(initialData?.voucherFile?.id);
	const [documentFileIds, setDocumentFileIds] = useState<number[]>(
		initialData?.documentFiles?.map((file) => file.id) || []
	);

	const form = useForm<PagoFormData>({
		initialValues: {
			descripcion: initialData?.descripcion || '',
			justificacion: initialData?.justificacion || '',
			coordinadoCon: initialData?.coordinadoCon || '',
			total: initialData?.total || 0,
			moneda: initialData?.moneda || MonedaPago.PEN,
			sucursalId: initialData?.sucursalId?.toString() || '',
			cuentaDestinoId: initialData?.cuentaDestinoId?.toString() || '',
			cuentaPropiaEmpresaId: initialData?.cuentaPropiaEmpresaId?.toString() || '',
			// Campo status removido - usar acción específica en tabla para cambiar estado
		},
		validate: {
			descripcion: (value: string) => (!value?.trim() ? 'La descripción es requerida' : null),
			total: (value: number) => (!value || value <= 0 ? 'El monto debe ser mayor a 0' : null),
		},
	});

	const monedaOptions = Object.entries(MonedaPagoLabels).map(([value, label]) => ({
		value,
		label,
	}));

	// Campo status removido del formulario - usar acción específica en tabla

	const sucursalOptions = [
		{ value: '', label: 'General (Sin sucursal específica)' },
		...sucursales.map((sucursal) => ({
			value: sucursal.id.toString(),
			label: `${sucursal.name} ${sucursal.code ? `(${sucursal.code})` : ''}`.trim(),
		})),
	];

	const cuentaDestinoOptions = [
		{ value: '', label: 'Sin cuenta destino específica' },
		...cuentas.map((cuenta) => {
			const cuentaInfo = cuenta.banco === 'BCP' ? cuenta.numeroCuenta : cuenta.cci;
			const bancoInfo = cuenta.banco ? ` - ${cuenta.banco}` : '';
			const monedaInfo = cuenta.moneda ? ` (${cuenta.moneda})` : '';
			const tipoInfo = cuenta.tipo ? ` [${cuenta.tipo}]` : '';
			
			return {
				value: cuenta.id.toString(),
				label: `${cuenta.titular} - ${cuentaInfo}${bancoInfo}${monedaInfo}${tipoInfo}`,
			};
		}),
	];

	const cuentaPropiaEmpresaOptions = [
		{ value: '', label: 'Sin cuenta propia empresa' },
		...cuentas
			.filter((cuenta) => cuenta.propiaEmpresa === true)
			.map((cuenta) => ({
				value: cuenta.id.toString(),
				label: `${cuenta.titular} - ${cuenta.numeroCuenta} (${cuenta.tipo})`,
			})),
	];

	const handleVoucherUpload = async (file: File | null) => {
		if (!file) {
			setVoucherFile(null);
			setVoucherFileId(undefined);
			return;
		}

		setVoucherFile(file);
		setUploadingVoucher(true);

		try {
			const response = await FilesAPI.upload(file, 'voucher');
			setVoucherFileId(response.id);
		} catch (error) {
			console.error('Error uploading voucher:', error);
			setVoucherFile(null);
			setVoucherFileId(undefined);
		} finally {
			setUploadingVoucher(false);
		}
	};

	const handleDocumentUpload = async (files: File[]) => {
		if (!files.length) return;

		setUploadingDocs(true);
		const newDocumentFiles = [...documentFiles];
		const newDocumentFileIds = [...documentFileIds];

		try {
			for (const file of files) {
				const response = await FilesAPI.upload(file, 'document');
				newDocumentFiles.push(file);
				newDocumentFileIds.push(response.id);
			}

			setDocumentFiles(newDocumentFiles);
			setDocumentFileIds(newDocumentFileIds);
		} catch (error) {
			console.error('Error uploading documents:', error);
		} finally {
			setUploadingDocs(false);
		}
	};

	const removeDocument = async (index: number) => {
		const fileIdToRemove = documentFileIds[index];
		
		try {
			if (fileIdToRemove) {
				await FilesAPI.delete(fileIdToRemove);
			}
		} catch (error) {
			console.error('Error deleting file:', error);
		}

		const newDocumentFiles = [...documentFiles];
		const newDocumentFileIds = [...documentFileIds];
		newDocumentFiles.splice(index, 1);
		newDocumentFileIds.splice(index, 1);
		setDocumentFiles(newDocumentFiles);
		setDocumentFileIds(newDocumentFileIds);
	};

	const handleSubmit = async (values: PagoFormData) => {
		const submitData = {
			...values,
			sucursalId: values.sucursalId && values.sucursalId !== '' ? Number(values.sucursalId) : undefined,
			cuentaDestinoId: values.cuentaDestinoId && values.cuentaDestinoId !== '' ? Number(values.cuentaDestinoId) : undefined,
			cuentaPropiaEmpresaId: values.cuentaPropiaEmpresaId && values.cuentaPropiaEmpresaId !== '' ? Number(values.cuentaPropiaEmpresaId) : undefined,
			voucherFileId,
			documentFileIds: documentFileIds.length > 0 ? documentFileIds : undefined,
		} as CreatePagoData | UpdatePagoData;

		await onSubmit(submitData);
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack gap="md">
				<Grid>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<TextInput
							label="Descripción"
							placeholder="Descripción del pago..."
							required
							{...form.getInputProps('descripcion')}
							disabled={loading}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<TextInput
							label="Coordinado con"
							placeholder="Persona responsable..."
							{...form.getInputProps('coordinadoCon')}
							disabled={loading}
						/>
					</Grid.Col>
				</Grid>

				<Textarea
					label="Justificación"
					placeholder="Justificación del pago..."
					minRows={3}
					{...form.getInputProps('justificacion')}
					disabled={loading}
				/>

				<Grid>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<NumberInput
							label="Monto"
							placeholder="0.00"
							required
							min={0}
							decimalScale={2}
							thousandSeparator=","
							{...form.getInputProps('total')}
							disabled={loading}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Select
							label="Moneda"
							placeholder="Seleccionar moneda"
							data={monedaOptions}
							required
							{...form.getInputProps('moneda')}
							disabled={loading}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 4 }}>
						<Select
							label="Sucursal"
							placeholder="Seleccionar sucursal"
							data={sucursalOptions}
							{...form.getInputProps('sucursalId')}
							disabled={loading}
						/>
					</Grid.Col>
				</Grid>

				<Grid>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Select
							label="Cuenta Destino"
							placeholder="Seleccionar cuenta destino"
							data={cuentaDestinoOptions}
							{...form.getInputProps('cuentaDestinoId')}
							disabled={loading}
						/>
					</Grid.Col>
					<Grid.Col span={{ base: 12, md: 6 }}>
						<Select
							label="Cuenta Propia Empresa"
							placeholder="Seleccionar cuenta propia empresa"
							data={cuentaPropiaEmpresaOptions}
							{...form.getInputProps('cuentaPropiaEmpresaId')}
							disabled={loading}
						/>
					</Grid.Col>
				</Grid>

				{/* Campo status removido - usar acción específica de cambio de estado en tabla */}

				{/* Voucher Upload */}
				<Box>
					<Text size="sm" fw={500} mb="xs">
						Voucher (Imagen)
					</Text>
					<FileInput
						placeholder="Seleccionar imagen del voucher"
						accept="image/*"
						onChange={handleVoucherUpload}
						disabled={loading || uploadingVoucher || (!initialData || initialData.status !== StatusPago.APROBADO)}
						leftSection={<IconUpload size={16} />}
					/>
					{(!initialData || initialData.status !== StatusPago.APROBADO) && (
						<Text size="xs" c="orange" mt="xs">
							{!initialData 
								? "El voucher solo puede ser subido cuando el pago esté aprobado (durante la actualización)"
								: "El voucher solo puede ser subido cuando el pago esté aprobado"
							}
						</Text>
					)}
					{uploadingVoucher && <Text size="xs" c="dimmed" mt="xs">Subiendo voucher...</Text>}
					{voucherFile && (
						<Badge color="green" size="sm" mt="xs">
							{voucherFile.name}
						</Badge>
					)}
					{initialData?.voucherFile && !voucherFile && (
						<Badge color="blue" size="sm" mt="xs">
							{initialData.voucherFile.originalName}
						</Badge>
					)}
				</Box>

				{/* Documents Upload */}
				<Box>
					<Text size="sm" fw={500} mb="xs">
						Documentos adicionales
					</Text>
					<FileInput
						placeholder="Seleccionar documentos (PDF, Word, Excel, Imágenes)"
						accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,*"
						multiple
						onChange={handleDocumentUpload}
						disabled={loading || uploadingDocs}
						leftSection={<IconFile size={16} />}
					/>
					{uploadingDocs && <Text size="xs" c="dimmed" mt="xs">Subiendo documentos...</Text>}
					
					{(documentFiles.length > 0 || (initialData?.documentFiles && initialData.documentFiles.length > 0)) && (
						<Stack gap="xs" mt="sm">
							{documentFiles.map((file, index) => (
								<Group key={index} justify="space-between">
									<Badge color="blue" size="sm">
										{file.name}
									</Badge>
									<ActionIcon
										size="sm"
										color="red"
										variant="light"
										onClick={() => removeDocument(index)}
										disabled={loading}
									>
										<IconTrash size={12} />
									</ActionIcon>
								</Group>
							))}
							{initialData?.documentFiles?.map((file) => (
								<Group key={`initial-${file.id}`} justify="space-between">
									<Badge color="green" size="sm">
										{file.originalName}
									</Badge>
								</Group>
							))}
						</Stack>
					)}
				</Box>

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" onClick={onCancel} disabled={loading}>
						Cancelar
					</Button>
					<Button type="submit" loading={loading}>
						{isEdit ? 'Actualizar' : 'Crear'} Pago
					</Button>
				</Group>
			</Stack>
		</form>
	);
});