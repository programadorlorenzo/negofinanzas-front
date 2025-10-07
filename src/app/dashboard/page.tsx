"use client"

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Container,
  Group,
  Title,
  Card,
  Text,
  Stack,
  Loader,
  Center,
  SimpleGrid,
} from '@mantine/core'
import { IconBuildingBank, IconMapPin } from '@tabler/icons-react'

export default function Dashboard() {
  const { session, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Mensaje de Bienvenida */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group justify="center" mb="md">
            <IconBuildingBank size={48} color="var(--mantine-color-blue-6)" />
          </Group>
          <Title order={1} ta="center" mb="md">
            ¡Bienvenido, {session.user.firstName} {session.user.lastName}!
          </Title>
          <Text ta="center" size="lg" c="dimmed">
            Tienes acceso a {session.user.sucursales?.length || 0} sucursales
          </Text>
        </Card>

        {/* Cards de Estadísticas */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="sm" c="dimmed" fw={500}>
                SUCURSALES ACTIVAS
              </Text>
              <IconBuildingBank size={32} stroke={1.5} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>
              {session.user.sucursales?.length || 0}
            </Text>
            <Text size="sm" c="dimmed">
              Total de ubicaciones
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="sm" c="dimmed" fw={500}>
                USUARIO ACTIVO
              </Text>
              <IconBuildingBank size={32} stroke={1.5} color="var(--mantine-color-blue-6)" />
            </Group>
            <Text size="xl" fw={700}>
              {session.user.role || 'Usuario'}
            </Text>
            <Text size="sm" c="dimmed">
              Rol del sistema
            </Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="sm" c="dimmed" fw={500}>
                ESTADO
              </Text>
              <IconBuildingBank size={32} stroke={1.5} color="var(--mantine-color-green-6)" />
            </Group>
            <Text size="xl" fw={700}>
              Activo
            </Text>
            <Text size="sm" c="dimmed">
              Sistema operativo
            </Text>
          </Card>
        </SimpleGrid>

        {/* Lista de Sucursales */}
        {session.user.sucursales && session.user.sucursales.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {session.user.sucursales.map((sucursal: string, index: number) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Group justify="center" mb="md">
                  <IconMapPin size={32} stroke={1.5} color="var(--mantine-color-green-6)" />
                </Group>
                <Text ta="center" fw={500} size="lg">
                  {sucursal}
                </Text>
                <Text ta="center" size="sm" c="dimmed" mt="xs">
                  Sucursal activa
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Text ta="center" c="dimmed" size="lg">
              No tienes sucursales asignadas
            </Text>
          </Card>
        )}
      </Stack>
    </Container>
  )
}