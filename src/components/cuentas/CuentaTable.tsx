'use client';

import { memo } from 'react';
import {
  Table,
  Paper,
  Badge,
  ActionIcon,
  Group,
  Loader,
  Text,
  Center,
  Pagination,
  Stack
} from '@mantine/core';
import { IconEdit, IconTrash, IconEye, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { Cuenta, getTipoCuentaLabel, getMonedaLabel } from '@/types/cuentas';

interface CuentaTableProps {
  cuentas: Cuenta[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onEdit: (cuenta: Cuenta) => void;
  onDelete: (cuenta: Cuenta) => void;
  onView: (cuenta: Cuenta) => void;
  onToggleStatus: (cuenta: Cuenta) => void;
  onPageChange: (page: number) => void;
}

const CuentaTableComponent = ({
  cuentas,
  loading,
  pagination,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onPageChange
}: CuentaTableProps) => {
  if (loading) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Cargando cuentas...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  if (cuentas.length === 0) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Text c="dimmed">No se encontraron cuentas</Text>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Titular</Table.Th>
            <Table.Th>Número</Table.Th>
            <Table.Th>Banco</Table.Th>
            <Table.Th>Sucursal</Table.Th>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Moneda</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cuentas.map((cuenta) => (
            <Table.Tr key={cuenta.id}>
              <Table.Td>{cuenta.titular || '-'}</Table.Td>
              <Table.Td>{cuenta.numeroCuenta || '-'}</Table.Td>
              <Table.Td>{cuenta.banco || '-'}</Table.Td>
              <Table.Td>
                <Badge variant="light" color={cuenta.sucursal ? 'blue' : 'gray'}>
                  {cuenta.sucursal ? cuenta.sucursal.name : 'Cuenta Global'}
                </Badge>
              </Table.Td>
              <Table.Td>
                {cuenta.tipo ? getTipoCuentaLabel(cuenta.tipo) : '-'}
              </Table.Td>
              <Table.Td>
                {cuenta.moneda ? getMonedaLabel(cuenta.moneda) : '-'}
              </Table.Td>
              <Table.Td>
                <Badge color={cuenta.isActive ? 'green' : 'red'}>
                  {cuenta.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => onView(cuenta)}
                    title="Ver detalles"
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="orange"
                    onClick={() => onEdit(cuenta)}
                    title="Editar"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color={cuenta.isActive ? 'orange' : 'green'}
                    onClick={() => onToggleStatus(cuenta)}
                    title={cuenta.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {cuenta.isActive ? <IconToggleLeft size={16} /> : <IconToggleRight size={16} />}
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => onDelete(cuenta)}
                    title="Eliminar"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Center p="md">
          <Pagination
            total={pagination.totalPages}
            value={pagination.page}
            onChange={onPageChange}
          />
        </Center>
      )}
    </Paper>
  );
};

export const CuentaTable = memo(CuentaTableComponent);