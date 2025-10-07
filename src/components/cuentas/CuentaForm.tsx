'use client';

import { memo } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Grid,
  Switch,
  Group,
  Button
} from '@mantine/core';
import { 
  CreateCuentaDto, 
  UpdateCuentaDto, 
  TipoCuenta, 
  Moneda, 
  TIPO_CUENTA_OPTIONS, 
  MONEDA_OPTIONS 
} from '@/types/cuentas';
import { Sucursal } from '@/types/sucursales';

interface CuentaFormProps {
  formData: CreateCuentaDto | UpdateCuentaDto;
  sucursales: Sucursal[];
  onFormDataChange: (data: CreateCuentaDto | UpdateCuentaDto) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

const CuentaFormComponent = ({
  formData,
  sucursales,
  onFormDataChange,
  onSubmit,
  onCancel,
  loading = false,
  isEditing = false
}: CuentaFormProps) => {
  const updateFormData = (field: string, value: string | number | boolean | undefined) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  // Opciones para el selector de sucursal
  const sucursalOptions = [
    { value: '', label: 'Cuenta Global (todas las sucursales)' },
    ...sucursales.map(sucursal => ({
      value: sucursal.id.toString(),
      label: sucursal.name + (sucursal.code ? ` (${sucursal.code})` : '')
    }))
  ];

  return (
    <Stack gap="md">
      <TextInput
        label="Titular"
        placeholder="Nombre del titular de la cuenta"
        value={formData.titular || ''}
        onChange={(e) => updateFormData('titular', e.target.value)}
        disabled={loading}
      />

      <Select
        label="Sucursal"
        placeholder="Seleccionar sucursal"
        data={sucursalOptions}
        value={formData.sucursalId?.toString() || ''}
        onChange={(value) => updateFormData('sucursalId', value ? parseInt(value) : undefined)}
        description="Deja vacío para crear una cuenta global (disponible en todas las sucursales)"
        disabled={loading}
        clearable
      />

      <Switch
        label="Cuenta de empresa"
        checked={formData.esEmpresa || false}
        onChange={(e) => updateFormData('esEmpresa', e.currentTarget.checked)}
        disabled={loading}
      />
      
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Número de Cuenta"
            placeholder="123-456-789"
            value={formData.numeroCuenta || ''}
            onChange={(e) => updateFormData('numeroCuenta', e.target.value)}
            disabled={loading}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="CCI"
            placeholder="002-123-001234567890-12"
            value={formData.cci || ''}
            onChange={(e) => updateFormData('cci', e.target.value)}
            disabled={loading}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <Select
            label="Moneda"
            placeholder="Seleccionar moneda"
            data={MONEDA_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
            value={formData.moneda || ''}
            onChange={(value) => updateFormData('moneda', value as Moneda)}
            disabled={loading}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Tipo de Cuenta"
            placeholder="Seleccionar tipo"
            data={TIPO_CUENTA_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
            value={formData.tipo || ''}
            onChange={(value) => updateFormData('tipo', value as TipoCuenta)}
            disabled={loading}
            clearable
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Banco"
        placeholder="Nombre del banco"
        value={formData.banco || ''}
        onChange={(e) => updateFormData('banco', e.target.value)}
        disabled={loading}
      />

      <Switch
        label="Cuenta propia de la empresa"
        description="Marcar si esta cuenta pertenece a la empresa (para usar como origen de pagos)"
        checked={formData.propiaEmpresa || false}
        onChange={(e) => updateFormData('propiaEmpresa', e.currentTarget.checked)}
        disabled={loading}
      />

      {isEditing && (
        <Switch
          label="Cuenta activa"
          checked={formData.isActive !== false}
          onChange={(e) => updateFormData('isActive', e.currentTarget.checked)}
          disabled={loading}
        />
      )}

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} loading={loading}>
          {isEditing ? 'Actualizar Cuenta' : 'Crear Cuenta'}
        </Button>
      </Group>
    </Stack>
  );
};

export const CuentaForm = memo(CuentaFormComponent);