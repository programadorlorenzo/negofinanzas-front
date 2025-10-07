'use client'

import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { theme } from '@/theme'
import { ReactNode } from 'react'

interface ClientMantineProviderProps {
  children: ReactNode
}

export function ClientMantineProvider({ children }: ClientMantineProviderProps) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  )
}