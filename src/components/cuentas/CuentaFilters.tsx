'use client';

import { memo } from 'react';
import { 
  Paper, 
  Grid, 
  TextInput, 
  Select 
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { CuentaFilters as ICuentaFilters, TIPO_CUENTA_OPTIONS, MONEDA_OPTIONS } from '@/types/cuentas';
import { Sucursal } from '@/types/sucursales';

interface CuentaFiltersProps {
  filters: ICuentaFilters;
  onFiltersChange: (filters: ICuentaFilters) => void;
  sucursales: Sucursal[];
  loading?: boolean;
}

const CuentaFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  sucursales,
  loading = false 
}: CuentaFiltersProps) => {
  const handleFilterChange = (key: keyof ICuentaFilters, value: string | number | boolean | undefined | null) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    onFiltersChange(newFilters);
  };

  // Opciones para el selector de sucursal
  const sucursalOptions = [
    { value: '', label: 'Todas las sucursales' },
    { value: 'null', label: 'Cuentas Globales' },
    ...sucursales.map(sucursal => ({
      value: sucursal.id.toString(),
      label: sucursal.name + (sucursal.code ? ` (${sucursal.code})` : '')
    }))
  ];

  return (
    <Paper p="md" withBorder mb="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TextInput
            label="Buscar"
            placeholder="Titular, número, CCI o banco..."
            leftSection={<IconSearch size={16} />}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            disabled={loading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select
            label="Sucursal"
            placeholder="Todas"
            data={sucursalOptions}
            value={filters.sucursalId?.toString() || ''}
            onChange={(value) => {
              if (value === 'null') {
                handleFilterChange('sucursalId', null);
              } else if (value === '') {
                handleFilterChange('sucursalId', undefined);
              } else {
                handleFilterChange('sucursalId', value ? parseInt(value) : undefined);
              }
            }}
            disabled={loading}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select
            label="Moneda"
            placeholder="Todas"
            data={[
              { value: '', label: 'Todas' },
              ...MONEDA_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
            ]}
            value={filters.moneda || ''}
            onChange={(value) => handleFilterChange('moneda', value)}
            disabled={loading}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Select
            label="Tipo"
            placeholder="Todos"
            data={[
              { value: '', label: 'Todos' },
              ...TIPO_CUENTA_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
            ]}
            value={filters.tipo || ''}
            onChange={(value) => handleFilterChange('tipo', value)}
            disabled={loading}
            clearable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <TextInput
            label="Banco"
            placeholder="Filtrar por banco..."
            value={filters.banco || ''}
            onChange={(e) => handleFilterChange('banco', e.target.value)}
            disabled={loading}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 1 }}>
          <Select
            label="Estado"
            data={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Activas' },
              { value: 'false', label: 'Inactivas' }
            ]}
            value={filters.isActive?.toString() || ''}
            onChange={(value) => handleFilterChange('isActive', value === '' ? undefined : value === 'true')}
            disabled={loading}
            clearable
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

// Memorizar el componente para evitar re-renders innecesarios
export const CuentaFilters = memo(CuentaFiltersComponent);