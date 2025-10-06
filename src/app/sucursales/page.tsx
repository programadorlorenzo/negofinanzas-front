'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Title, 
  Button, 
  Group, 
  Stack,
  Paper
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { 
  SucursalFiltersComponent, 
  SucursalTable, 
  SucursalForm, 
  DeleteSucursalModal 
} from '@/components/sucursales';
import { sucursalesApi } from '@/services/sucursales';
import { 
  Sucursal, 
  SucursalFilters, 
  PaginatedSucursales,
  CreateSucursalDto,
  UpdateSucursalDto
} from '@/types/sucursales';

export default function SucursalesPage() {
  // Estados principales
  const [sucursales, setSucursales] = useState<PaginatedSucursales | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState<SucursalFilters>({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'ASC'
  });

  // Estados de modales
  const [formModalOpened, setFormModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);

  // Cargar sucursales
  const loadSucursales = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sucursalesApi.getAll(filters);
      setSucursales(data);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las sucursales',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar sucursales al montar el componente o cambiar filtros
  useEffect(() => {
    loadSucursales();
  }, [loadSucursales]);

  // Manejar cambios en filtros
  const handleFiltersChange = useCallback((newFilters: SucursalFilters) => {
    setFilters(newFilters);
  }, []);

  // Manejar cambio de página
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Abrir modal para crear nueva sucursal
  const handleCreate = () => {
    setSelectedSucursal(null);
    setFormModalOpened(true);
  };

  // Abrir modal para editar sucursal
  const handleEdit = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setFormModalOpened(true);
  };

  // Manejar envío del formulario (crear/editar)
  const handleFormSubmit = async (data: CreateSucursalDto | UpdateSucursalDto) => {
    try {
      setActionLoading(true);
      
      if (selectedSucursal) {
        // Editar
        await sucursalesApi.update(selectedSucursal.id, data as UpdateSucursalDto);
        notifications.show({
          title: 'Éxito',
          message: 'Sucursal actualizada correctamente',
          color: 'green',
        });
      } else {
        // Crear
        await sucursalesApi.create(data as CreateSucursalDto);
        notifications.show({
          title: 'Éxito',
          message: 'Sucursal creada correctamente',
          color: 'green',
        });
      }

      await loadSucursales();
      setFormModalOpened(false);
      setSelectedSucursal(null);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
      notifications.show({
        title: 'Error',
        message: selectedSucursal 
          ? 'No se pudo actualizar la sucursal' 
          : 'No se pudo crear la sucursal',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setDeleteModalOpened(true);
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!selectedSucursal) return;

    try {
      setActionLoading(true);
      await sucursalesApi.delete(selectedSucursal.id);
      
      notifications.show({
        title: 'Éxito',
        message: 'Sucursal eliminada correctamente',
        color: 'green',
      });

      await loadSucursales();
      setDeleteModalOpened(false);
      setSelectedSucursal(null);
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar la sucursal',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Cambiar estado (activo/inactivo)
  const handleToggleStatus = async (sucursal: Sucursal) => {
    try {
      setActionLoading(true);
      await sucursalesApi.toggleStatus(sucursal.id);
      
      notifications.show({
        title: 'Éxito',
        message: `Sucursal ${sucursal.isActive ? 'desactivada' : 'activada'} correctamente`,
        color: 'green',
      });

      await loadSucursales();
    } catch (error) {
      console.error('Error al cambiar estado de sucursal:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo cambiar el estado de la sucursal',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Paper p="md" shadow="sm">
          <Group justify="space-between" align="center">
            <Title order={2}>Gestión de Sucursales</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCreate}
              disabled={loading || actionLoading}
            >
              Nueva Sucursal
            </Button>
          </Group>
        </Paper>

        {/* Filtros */}
        <SucursalFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading || actionLoading}
        />

        {/* Tabla */}
        <SucursalTable
          data={sucursales}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onPageChange={handlePageChange}
        />

        {/* Modal de formulario */}
        <SucursalForm
          opened={formModalOpened}
          onClose={() => {
            setFormModalOpened(false);
            setSelectedSucursal(null);
          }}
          onSubmit={handleFormSubmit}
          sucursal={selectedSucursal}
          loading={actionLoading}
        />

        {/* Modal de eliminación */}
        <DeleteSucursalModal
          opened={deleteModalOpened}
          onClose={() => {
            setDeleteModalOpened(false);
            setSelectedSucursal(null);
          }}
          onConfirm={handleDeleteConfirm}
          sucursal={selectedSucursal}
          loading={actionLoading}
        />
      </Stack>
    </Container>
  );
}