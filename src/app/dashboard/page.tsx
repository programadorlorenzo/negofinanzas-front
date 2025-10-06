"use client"

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  AppShell,
  Container,
  Group,
  Title,
  Button,
  Card,
  Text,
  Stack,
  Badge,
  Loader,
  Center,
  ActionIcon,
  useMantineColorScheme,
  SimpleGrid,
  NavLink
} from '@mantine/core'
import { IconLogout, IconBuildingBank, IconSun, IconMoon, IconMapPin, IconHome, IconChartBar } from '@tabler/icons-react'

export default function Dashboard() {
  const { session, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

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

  const handleSignOut = async () => {
    await signOut()
  }



  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <IconBuildingBank size={28} />
            <Title order={3}>NegoFinanzas</Title>
          </Group>
          <Group>
            <Text size="sm">
              {session.user?.firstName} {session.user?.lastName}
            </Text>
            <Badge variant="light" color="blue">
              {session.user?.role || 'Usuario'}
            </Badge>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <Button
              leftSection={<IconLogout size={16} />}
              variant="outline"
              onClick={handleSignOut}
            >
              Cerrar Sesión
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Text fw={500} size="sm" c="dimmed" mb="xs">
            NAVEGACIÓN
          </Text>
          <NavLink
            href="/dashboard"
            label="Inicio"
            leftSection={<IconHome size="1rem" stroke={1.5} />}
            active
          />
          <NavLink
            href="/sucursales"
            label="Sucursales"
            leftSection={<IconMapPin size="1rem" stroke={1.5} />}
          />
          <NavLink
            href="#"
            label="Reportes"
            leftSection={<IconChartBar size="1rem" stroke={1.5} />}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
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
      </AppShell.Main>
    </AppShell>
  )
}