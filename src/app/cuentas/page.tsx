'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container, Title, Group, Button, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';

// Services
import { cuentasApi } from '@/services/cuentas';
import { sucursalesApi } from '@/services/sucursales';

// Types
import {
  Cuenta,
  CreateCuentaDto,
  UpdateCuentaDto,
  CuentaFilters as ICuentaFilters,
} from '@/types/cuentas';
import { Sucursal } from '@/types/sucursales';

// Components
import { CuentaFilters, CuentaTable, CuentaModals } from '@/components/cuentas';

export default function CuentasPage() {
  // Estados principales
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Paginación
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Filtros
  const [filters, setFilters] = useState<ICuentaFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // Modales
  const [createModal, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editModal, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [viewModal, { open: openView, close: closeView }] = useDisclosure(false);
  const [deleteModal, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Formulario y selección
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
  const [formData, setFormData] = useState<CreateCuentaDto | UpdateCuentaDto>({});

  // Cargar sucursales
  const loadSucursales = useCallback(async () => {
    try {
      const response = await sucursalesApi.getAll({ limit: 100, isActive: true });
      setSucursales(response.data);
    } catch (error) {
      console.error('Error loading sucursales:', error);
    }
  }, []);

  // Cargar cuentas
  const loadCuentas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cuentasApi.getAll(filters);
      setCuentas(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading cuentas:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las cuentas',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Efectos
  useEffect(() => {
    loadSucursales();
  }, [loadSucursales]);

  useEffect(() => {
    loadCuentas();
  }, [loadCuentas]);

  // Handlers de filtros y paginación
  const handleFiltersChange = useCallback((newFilters: ICuentaFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Handlers de modales
  const handleCreate = () => {
    setFormData({});
    setSelectedCuenta(null);
    openCreate();
  };

  const handleEdit = (cuenta: Cuenta) => {
    setFormData({
      titular: cuenta.titular,
      numeroCuenta: cuenta.numeroCuenta,
      cci: cuenta.cci,
      moneda: cuenta.moneda,
      tipo: cuenta.tipo,
      banco: cuenta.banco,
      esEmpresa: cuenta.esEmpresa,
      isActive: cuenta.isActive,
      sucursalId: cuenta.sucursalId,
    });
    setSelectedCuenta(cuenta);
    openEdit();
  };

  const handleView = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    openView();
  };

  const handleDelete = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    openDelete();
  };

  // Handlers de formulario
  const handleSubmitCreate = async () => {
    try {
      setSubmitting(true);
      await cuentasApi.create(formData as CreateCuentaDto);
      notifications.show({
        title: 'Éxito',
        message: 'Cuenta creada exitosamente',
        color: 'green',
      });
      closeCreate();
      setFormData({});
      loadCuentas();
    } catch (error) {
      console.error('Error creating cuenta:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo crear la cuenta',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedCuenta) return;

    try {
      setSubmitting(true);
      await cuentasApi.update(selectedCuenta.id, formData as UpdateCuentaDto);
      notifications.show({
        title: 'Éxito',
        message: 'Cuenta actualizada exitosamente',
        color: 'green',
      });
      closeEdit();
      setFormData({});
      loadCuentas();
    } catch (error) {
      console.error('Error updating cuenta:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar la cuenta',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCuenta) return;

    try {
      setSubmitting(true);
      await cuentasApi.delete(selectedCuenta.id);
      notifications.show({
        title: 'Éxito',
        message: 'Cuenta eliminada exitosamente',
        color: 'green',
      });
      closeDelete();
      loadCuentas();
    } catch (error) {
      console.error('Error deleting cuenta:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar la cuenta',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (cuenta: Cuenta) => {
    try {
      setSubmitting(true);
      await cuentasApi.update(cuenta.id, { isActive: !cuenta.isActive });
      notifications.show({
        title: 'Éxito',
        message: `Cuenta ${!cuenta.isActive ? 'activada' : 'desactivada'} exitosamente`,
        color: 'green',
      });
      loadCuentas();
    } catch (error) {
      console.error('Error toggling cuenta status:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo cambiar el estado de la cuenta',
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Gestión de Cuentas Bancarias</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Nueva Cuenta
          </Button>
        </Group>

        {/* Filtros */}
        <CuentaFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          sucursales={sucursales}
          loading={loading}
        />

        {/* Tabla */}
        <CuentaTable
          cuentas={cuentas}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
          onPageChange={handlePageChange}
        />

        {/* Modales */}
        <CuentaModals
          createModal={createModal}
          editModal={editModal}
          viewModal={viewModal}
          deleteModal={deleteModal}
          selectedCuenta={selectedCuenta}
          formData={formData}
          sucursales={sucursales}
          submitting={submitting}
          onCreateClose={closeCreate}
          onEditClose={closeEdit}
          onViewClose={closeView}
          onDeleteClose={closeDelete}
          onFormDataChange={setFormData}
          onSubmitCreate={handleSubmitCreate}
          onSubmitEdit={handleSubmitEdit}
          onConfirmDelete={handleConfirmDelete}
        />
      </Stack>
    </Container>
  );
}