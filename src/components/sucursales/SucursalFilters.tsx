'use client';

import { useState, memo } from 'react';
import { 
  Paper, 
  Group, 
  TextInput, 
  Select, 
  Stack 
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { SucursalFilters } from '@/types/sucursales';

interface SucursalFiltersProps {
  filters: SucursalFilters;
  onFiltersChange: (filters: SucursalFilters) => void;
  loading?: boolean;
}

const SucursalFiltersComponentBase = ({ 
  filters, 
  onFiltersChange, 
  loading = false 
}: SucursalFiltersProps) => {
  const [localName, setLocalName] = useState(filters.name || '');

  const handleNameChange = (value: string) => {
    setLocalName(value);
    const newFilters = { ...filters, name: value || undefined, page: 1 };
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key: keyof SucursalFilters, value: string | number | boolean | undefined | null) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    onFiltersChange(newFilters);
  };

  return (
    <Paper p="md" shadow="sm" mb="md">
      <Stack gap="md">
        <Group grow>
          <TextInput
            placeholder="Buscar por nombre..."
            value={localName}
            onChange={(event) => handleNameChange(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
          />
          
          <Select
            placeholder="Estado"
            value={filters.isActive?.toString() || ''}
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
        </Group>
      </Stack>
    </Paper>
  );
};

// Memorizar el componente para evitar re-renders innecesarios
export const SucursalFiltersComponent = memo(SucursalFiltersComponentBase);