'use client';

import { useEffect } from 'react';
import { 
  Modal, 
  TextInput, 
  Textarea, 
  Switch, 
  Button, 
  Stack, 
  Group,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Sucursal, CreateSucursalDto, UpdateSucursalDto } from '@/types/sucursales';

interface SucursalFormProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSucursalDto | UpdateSucursalDto) => Promise<void>;
  sucursal?: Sucursal | null;
  loading?: boolean;
}

export function SucursalForm({
  opened,
  onClose,
  onSubmit,
  sucursal,
  loading = false
}: SucursalFormProps) {
  const isEditing = !!sucursal;

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      isActive: true,
    },
    validate: {
      name: (value) => {
        if (!value || value.trim().length === 0) {
          return 'El nombre es requerido';
        }
        if (value.trim().length > 100) {
          return 'El nombre no puede tener más de 100 caracteres';
        }
        return null;
      },
      code: (value) => {
        if (value && value.length > 20) {
          return 'El código no puede tener más de 20 caracteres';
        }
        return null;
      },
      phone: (value) => {
        if (value && value.length > 20) {
          return 'El teléfono no puede tener más de 20 caracteres';
        }
        return null;
      },
    },
  });

  // Llenar el formulario cuando se edita una sucursal
  useEffect(() => {
    if (sucursal) {
      form.setValues({
        name: sucursal.name || '',
        code: sucursal.code || '',
        address: sucursal.address || '',
        phone: sucursal.phone || '',
        isActive: sucursal.isActive,
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursal]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const submitData = {
        name: values.name.trim(),
        code: values.code?.trim() || undefined,
        address: values.address?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        isActive: values.isActive,
      };

      await onSubmit(submitData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text size="lg" fw={600}>
          {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </Text>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Nombre de la sucursal"
            required
            {...form.getInputProps('name')}
            disabled={loading}
          />

          <TextInput
            label="Código"
            placeholder="Código único (opcional)"
            {...form.getInputProps('code')}
            disabled={loading}
          />

          <Textarea
            label="Dirección"
            placeholder="Dirección de la sucursal (opcional)"
            minRows={3}
            maxRows={5}
            {...form.getInputProps('address')}
            disabled={loading}
          />

          <TextInput
            label="Teléfono"
            placeholder="Teléfono de contacto (opcional)"
            {...form.getInputProps('phone')}
            disabled={loading}
          />

          <Switch
            label="Sucursal activa"
            description="Las sucursales inactivas no aparecerán en las listas de selección"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
            disabled={loading}
          />

          <Group justify="flex-end" mt="md">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              loading={loading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}