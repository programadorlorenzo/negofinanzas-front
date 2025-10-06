'use client';

import { 
  Table, 
  Paper, 
  Group, 
  Badge, 
  ActionIcon, 
  Text,
  Pagination,
  Stack,
  Loader,
  Center,
  Tooltip
} from '@mantine/core';
import { 
  IconEdit, 
  IconTrash, 
  IconToggleLeft, 
  IconToggleRight 
} from '@tabler/icons-react';
import { Sucursal, PaginatedSucursales } from '@/types/sucursales';

interface SucursalTableProps {
  data: PaginatedSucursales | null;
  loading: boolean;
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (sucursal: Sucursal) => void;
  onToggleStatus: (sucursal: Sucursal) => void;
  onPageChange: (page: number) => void;
}

export function SucursalTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange
}: SucursalTableProps) {
  
  if (loading) {
    return (
      <Paper p="xl" shadow="sm">
        <Center>
          <Stack align="center" gap="sm">
            <Loader size="lg" />
            <Text c="dimmed">Cargando sucursales...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Paper p="xl" shadow="sm">
        <Center>
          <Stack align="center" gap="sm">
            <Text size="lg" fw={500} c="dimmed">
              No hay sucursales para mostrar
            </Text>
            <Text size="sm" c="dimmed">
              Intenta ajustar los filtros o crear una nueva sucursal
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Stack gap="md">
      <Paper shadow="sm">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Código</Table.Th>
              <Table.Th>Dirección</Table.Th>
              <Table.Th>Teléfono</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Creado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.data.map((sucursal) => (
              <Table.Tr key={sucursal.id}>
                <Table.Td>
                  <Text fw={500}>{sucursal.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text c="dimmed" size="sm">
                    {sucursal.code || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>
                    {sucursal.address || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {sucursal.phone || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={sucursal.isActive ? 'green' : 'red'}
                    variant="light"
                  >
                    {sucursal.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {formatDate(sucursal.createdAt)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Editar">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => onEdit(sucursal)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label={sucursal.isActive ? 'Desactivar' : 'Activar'}>
                      <ActionIcon
                        variant="light"
                        color={sucursal.isActive ? 'orange' : 'green'}
                        onClick={() => onToggleStatus(sucursal)}
                      >
                        {sucursal.isActive ? 
                          <IconToggleLeft size={16} /> : 
                          <IconToggleRight size={16} />
                        }
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Eliminar">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => onDelete(sucursal)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {data.totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={data.totalPages}
            value={data.page}
            onChange={onPageChange}
            size="sm"
          />
        </Group>
      )}

      <Text size="sm" c="dimmed" ta="center">
        Mostrando {data.data.length} de {data.total} sucursales
      </Text>
    </Stack>
  );
}