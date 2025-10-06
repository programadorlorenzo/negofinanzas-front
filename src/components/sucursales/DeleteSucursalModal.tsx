'use client';

import { Modal, Text, Button, Group, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Sucursal } from '@/types/sucursales';

interface DeleteSucursalModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sucursal: Sucursal | null;
  loading?: boolean;
}

export function DeleteSucursalModal({
  opened,
  onClose,
  onConfirm,
  sucursal,
  loading = false
}: DeleteSucursalModalProps) {
  
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" />
          <Text size="lg" fw={600}>
            Confirmar eliminación
          </Text>
        </Group>
      }
      size="sm"
      centered
    >
      <Stack gap="md">
        <Text>
          ¿Estás seguro de que deseas eliminar la sucursal{' '}
          <Text component="span" fw={600}>
            {sucursal?.name}
          </Text>
          ?
        </Text>
        
        <Text size="sm" c="dimmed">
          Esta acción no se puede deshacer y todos los datos relacionados 
          con esta sucursal podrían verse afectados.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            color="red" 
            onClick={handleConfirm}
            loading={loading}
          >
            Eliminar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}