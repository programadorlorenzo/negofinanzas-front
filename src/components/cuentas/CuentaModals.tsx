'use client';

import { memo } from 'react';
import {
  Modal,
  Stack,
  Text,
  Group,
  Button,
  Badge,
  Card,
  SimpleGrid,
  Divider
} from '@mantine/core';
import { 
  Cuenta, 
  CreateCuentaDto, 
  UpdateCuentaDto,
  getTipoCuentaLabel,
  getMonedaLabel
} from '@/types/cuentas';
import { Sucursal } from '@/types/sucursales';
import { CuentaForm } from './CuentaForm';

interface CuentaModalsProps {
  // Estados de modales
  createModal: boolean;
  editModal: boolean;
  viewModal: boolean;
  deleteModal: boolean;
  
  // Datos
  selectedCuenta: Cuenta | null;
  formData: CreateCuentaDto | UpdateCuentaDto;
  sucursales: Sucursal[];
  
  // Estados de carga
  submitting: boolean;
  
  // Handlers de modales
  onCreateClose: () => void;
  onEditClose: () => void;
  onViewClose: () => void;
  onDeleteClose: () => void;
  
  // Handlers de formulario
  onFormDataChange: (data: CreateCuentaDto | UpdateCuentaDto) => void;
  onSubmitCreate: () => void;
  onSubmitEdit: () => void;
  onConfirmDelete: () => void;
}

const CuentaModalsComponent = ({
  createModal,
  editModal,
  viewModal,
  deleteModal,
  selectedCuenta,
  formData,
  sucursales,
  submitting,
  onCreateClose,
  onEditClose,
  onViewClose,
  onDeleteClose,
  onFormDataChange,
  onSubmitCreate,
  onSubmitEdit,
  onConfirmDelete
}: CuentaModalsProps) => {
  return (
    <>
      {/* Modal Crear */}
      <Modal
        opened={createModal}
        onClose={onCreateClose}
        title="Nueva Cuenta Bancaria"
        size="lg"
      >
        <CuentaForm
          formData={formData}
          sucursales={sucursales}
          onFormDataChange={onFormDataChange}
          onSubmit={onSubmitCreate}
          onCancel={onCreateClose}
          loading={submitting}
          isEditing={false}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        opened={editModal}
        onClose={onEditClose}
        title="Editar Cuenta Bancaria"
        size="lg"
      >
        <CuentaForm
          formData={formData}
          sucursales={sucursales}
          onFormDataChange={onFormDataChange}
          onSubmit={onSubmitEdit}
          onCancel={onEditClose}
          loading={submitting}
          isEditing={true}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        opened={viewModal}
        onClose={onViewClose}
        title="Detalles de la Cuenta"
        size="md"
      >
        {selectedCuenta && (
          <Stack gap="md">
            <Card withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={500}>Estado</Text>
                  <Badge color={selectedCuenta.isActive ? 'green' : 'red'}>
                    {selectedCuenta.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </Group>
                
                <Group justify="space-between">
                  <Text fw={500}>Sucursal</Text>
                  <Badge variant="light" color={selectedCuenta.sucursal ? 'blue' : 'gray'}>
                    {selectedCuenta.sucursal ? selectedCuenta.sucursal.name : 'Cuenta Global'}
                  </Badge>
                </Group>
              </Stack>
            </Card>

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" c="dimmed">Titular</Text>
                <Text fw={500}>{selectedCuenta.titular || '-'}</Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed">Banco</Text>
                <Text fw={500}>{selectedCuenta.banco || '-'}</Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed">Número de Cuenta</Text>
                <Text fw={500}>{selectedCuenta.numeroCuenta || '-'}</Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed">CCI</Text>
                <Text fw={500}>{selectedCuenta.cci || '-'}</Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed">Tipo</Text>
                <Text fw={500}>
                  {selectedCuenta.tipo ? getTipoCuentaLabel(selectedCuenta.tipo) : '-'}
                </Text>
              </div>
              
              <div>
                <Text size="sm" c="dimmed">Moneda</Text>
                <Text fw={500}>
                  {selectedCuenta.moneda ? getMonedaLabel(selectedCuenta.moneda) : '-'}
                </Text>
              </div>
            </SimpleGrid>

            {selectedCuenta.esEmpresa && (
              <>
                <Divider />
                <Badge variant="light" color="blue" size="lg">
                  Cuenta de Empresa
                </Badge>
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onViewClose}>
                Cerrar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        opened={deleteModal}
        onClose={onDeleteClose}
        title="Confirmar Eliminación"
        size="sm"
      >
        {selectedCuenta && (
          <Stack gap="md">
            <Text>
              ¿Estás seguro de que deseas eliminar la cuenta de{' '}
              <Text component="span" fw={500}>
                {selectedCuenta.titular || 'sin titular'}
              </Text>
              {selectedCuenta.banco && (
                <>
                  {' '}en{' '}
                  <Text component="span" fw={500}>
                    {selectedCuenta.banco}
                  </Text>
                </>
              )}
              ?
            </Text>
            
            <Text size="sm" c="dimmed">
              Esta acción no se puede deshacer.
            </Text>

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button color="red" onClick={onConfirmDelete} loading={submitting}>
                Eliminar
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export const CuentaModals = memo(CuentaModalsComponent);