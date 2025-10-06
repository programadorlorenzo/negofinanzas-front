'use client'

import { MantineProvider } from '@mantine/core'
import { theme } from '@/theme'
import { ReactNode } from 'react'

interface ClientMantineProviderProps {
  children: ReactNode
}

export function ClientMantineProvider({ children }: ClientMantineProviderProps) {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  )
}