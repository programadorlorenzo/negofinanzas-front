'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Alert,
  Center,
  Stack,
  Loader
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (value.length < 1 ? 'Contraseña requerida' : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas. Por favor, intenta de nuevo.')
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Center style={{ height: '100vh' }}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ width: '100%' }}>
          <Title order={2} ta="center" mb="md">
            NegoFinanzas
          </Title>
          <Text ta="center" mb="xl" c="dimmed">
            Inicia sesión en tu cuenta
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                required
                label="Correo electrónico"
                placeholder="tu@email.com"
                {...form.getInputProps('email')}
              />

              <PasswordInput
                required
                label="Contraseña"
                placeholder="Tu contraseña"
                {...form.getInputProps('password')}
              />

              <Button
                type="submit"
                fullWidth
                mt="xl"
                size="md"
                loading={isLoading}
                leftSection={isLoading ? <Loader size="sm" /> : null}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </Container>
  )
}