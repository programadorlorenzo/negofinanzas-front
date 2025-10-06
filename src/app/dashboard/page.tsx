"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  AppShell,
  Container,
  Group,
  Title,
  Button,
  Grid,
  Card,
  Text,
  Stack,
  Badge,
  Loader,
  Center,
  ActionIcon,
  useMantineColorScheme
} from '@mantine/core'
import { IconLogout, IconUser, IconBuildingBank, IconSettings, IconFileText, IconSun, IconMoon } from '@tabler/icons-react'
import { SessionUser } from '@/types/next-auth'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const user = session?.user as SessionUser

  if (status === 'loading') {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <AppShell
      header={{ height: 70 }}
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
              Bienvenido, {user?.firstName || user?.lastName ? `${user.firstName} ${user.lastName}` : 'Usuario'}
            </Text>
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

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between" align="center">
              <Title order={1}>Dashboard</Title>
              <Badge color="green" size="lg">
                Sistema Activo
              </Badge>
            </Group>

            {/* User Info */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="xs">
                <IconUser size={20} />
                <Text fw={500}>Información del Usuario</Text>
              </Group>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Email:</Text>
                  <Text>{user?.email}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Nombre:</Text>
                  <Text>{user?.firstName} {user?.lastName}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Rol:</Text>
                  <Badge variant="light">
                    {user?.role}
                  </Badge>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">ID:</Text>
                  <Text>{user?.id}</Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Session Info */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group mb="xs">
                <IconSettings size={20} />
                <Text fw={500}>Información de Sesión</Text>
              </Group>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Sesión Activa: {session ? "✅ Sí" : "❌ No"}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Access Token: {session.accessToken ? "✅ Present" : "❌ Missing"}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Refresh Token: {session.refreshToken ? "✅ Present" : "❌ Missing"}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Action Cards */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Group justify="center" mb="md">
                    <IconBuildingBank size={40} stroke={1.5} />
                  </Group>
                  <Text ta="center" fw={500} mb="xs">
                    Cuentas
                  </Text>
                  <Text ta="center" size="sm" c="dimmed" mb="md">
                    Gestionar cuentas bancarias y financieras
                  </Text>
                  <Button fullWidth variant="light">
                    Ver Cuentas
                  </Button>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Group justify="center" mb="md">
                    <IconFileText size={40} stroke={1.5} />
                  </Group>
                  <Text ta="center" fw={500} mb="xs">
                    Reportes
                  </Text>
                  <Text ta="center" size="sm" c="dimmed" mb="md">
                    Generar reportes financieros
                  </Text>
                  <Button fullWidth variant="light">
                    Ver Reportes
                  </Button>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Group justify="center" mb="md">
                    <IconSettings size={40} stroke={1.5} />
                  </Group>
                  <Text ta="center" fw={500} mb="xs">
                    Configuración
                  </Text>
                  <Text ta="center" size="sm" c="dimmed" mb="md">
                    Ajustes del sistema
                  </Text>
                  <Button fullWidth variant="light">
                    Configurar
                  </Button>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}