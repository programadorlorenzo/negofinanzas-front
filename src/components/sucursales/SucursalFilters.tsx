'use client';

import { useState } from 'react';
import { 
  Paper, 
  Group, 
  TextInput, 
  Select, 
  Button, 
  Stack 
} from '@mantine/core';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import { SucursalFilters } from '@/types/sucursales';

interface SucursalFiltersProps {
  filters: SucursalFilters;
  onFiltersChange: (filters: SucursalFilters) => void;
  loading?: boolean;
}

export function SucursalFiltersComponent({ 
  filters, 
  onFiltersChange, 
  loading = false 
}: SucursalFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SucursalFilters>(filters);

  const handleFilterChange = (key: keyof SucursalFilters, value: string | number | boolean | undefined | null) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: SucursalFilters = {
      page: 1,
      limit: filters.limit || 10,
      sortBy: 'name',
      sortOrder: 'ASC'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = !!(
    localFilters.name || 
    localFilters.isActive !== undefined
  );

  return (
    <Paper p="md" shadow="sm" mb="md">
      <Stack gap="md">
        <Group grow>
          <TextInput
            placeholder="Buscar por nombre..."
            value={localFilters.name || ''}
            onChange={(event) => handleFilterChange('name', event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            disabled={loading}
          />
          
          <Select
            placeholder="Estado"
            value={localFilters.isActive?.toString() || ''}
            onChange={(value) => {
              if (value === '') {
                handleFilterChange('isActive', undefined);
              } else {
                handleFilterChange('isActive', value === 'true');
              }
            }}
            data={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
            disabled={loading}
            clearable
          />

          <Select
            placeholder="Ordenar por"
            value={localFilters.sortBy || 'name'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            data={[
              { value: 'name', label: 'Nombre' },
              { value: 'code', label: 'Código' },
              { value: 'createdAt', label: 'Fecha de creación' },
              { value: 'updatedAt', label: 'Última actualización' },
            ]}
            disabled={loading}
          />

          <Select
            placeholder="Orden"
            value={localFilters.sortOrder || 'ASC'}
            onChange={(value) => handleFilterChange('sortOrder', value)}
            data={[
              { value: 'ASC', label: 'Ascendente' },
              { value: 'DESC', label: 'Descendente' },
            ]}
            disabled={loading}
          />
        </Group>

        {hasActiveFilters && (
          <Group justify="flex-end">
            <Button
              variant="light"
              leftSection={<IconFilterOff size={16} />}
              onClick={handleClearFilters}
              disabled={loading}
            >
              Limpiar filtros
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}