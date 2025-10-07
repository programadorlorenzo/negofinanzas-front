'use client';

import { memo } from 'react';
import { Grid, TextInput, Select, NumberInput, Button, Group } from '@mantine/core';
import { IconSearch, IconFilter, IconFilterOff } from '@tabler/icons-react';
import { PagoFilters, StatusPagoLabels, MonedaPagoLabels } from '@/types/pago';

interface PagoFiltersProps {
	filters: PagoFilters;
	onFiltersChange: (filters: PagoFilters) => void;
	onClearFilters: () => void;
	sucursales: Array<{ id: number; name: string; code?: string }>;
	loading?: boolean;
}

export const PagoFiltersComponent = memo(function PagoFiltersComponent({
	filters,
	onFiltersChange,
	onClearFilters,
	sucursales,
	loading = false,
}: PagoFiltersProps) {
	const handleFilterChange = (key: keyof PagoFilters, value: string | number | undefined | null) => {
		onFiltersChange({
			...filters,
			[key]: value,
			page: 1, // Reset page when filters change
		});
	};

	const statusOptions = Object.entries(StatusPagoLabels).map(([value, label]) => ({
		value,
		label,
	}));

	const monedaOptions = Object.entries(MonedaPagoLabels).map(([value, label]) => ({
		value,
		label,
	}));

	const sucursalOptions = sucursales.map((sucursal) => ({
		value: sucursal.id.toString(),
		label: `${sucursal.name} ${sucursal.code ? `(${sucursal.code})` : ''}`.trim(),
	}));

	return (
		<Grid>
			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<TextInput
					label="Buscar"
					placeholder="Buscar por descripción..."
					value={filters.search || ''}
					onChange={(e) => handleFilterChange('search', e.target.value)}
					leftSection={<IconSearch size={16} />}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<Select
					label="Estado"
					placeholder="Todos los estados"
					data={statusOptions}
					value={filters.status || null}
					onChange={(value) => handleFilterChange('status', value)}
					clearable
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<Select
					label="Moneda"
					placeholder="Todas las monedas"
					data={monedaOptions}
					value={filters.moneda || null}
					onChange={(value) => handleFilterChange('moneda', value)}
					clearable
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<Select
					label="Sucursal"
					placeholder="Todas las sucursales"
					data={sucursalOptions}
					value={filters.sucursalId?.toString() || null}
					onChange={(value) => handleFilterChange('sucursalId', value ? parseInt(value) : undefined)}
					clearable
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<NumberInput
					label="Monto mínimo"
					placeholder="0.00"
					value={filters.montoMin || ''}
					onChange={(value) => handleFilterChange('montoMin', typeof value === 'number' ? value : undefined)}
					min={0}
					decimalScale={2}
					thousandSeparator=","
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<NumberInput
					label="Monto máximo"
					placeholder="0.00"
					value={filters.montoMax || ''}
					onChange={(value) => handleFilterChange('montoMax', typeof value === 'number' ? value : undefined)}
					min={0}
					decimalScale={2}
					thousandSeparator=","
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<TextInput
					label="Fecha desde"
					placeholder="YYYY-MM-DD"
					type="date"
					value={filters.fechaDesde || ''}
					onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
				<TextInput
					label="Fecha hasta"
					placeholder="YYYY-MM-DD"
					type="date"
					value={filters.fechaHasta || ''}
					onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
					disabled={loading}
				/>
			</Grid.Col>

			<Grid.Col span={{ base: 12, md: 4 }}>
				<Group mt="xl" gap="sm">
					<Button
						variant="light"
						leftSection={<IconFilter size={16} />}
						onClick={() => {}} // This triggers the search automatically due to the filters
						disabled={loading}
					>
						Filtrar
					</Button>
					<Button
						variant="subtle"
						leftSection={<IconFilterOff size={16} />}
						onClick={onClearFilters}
						disabled={loading}
					>
						Limpiar
					</Button>
				</Group>
			</Grid.Col>
		</Grid>
	);
});