'use client';

import { memo } from 'react';
import { 
  Group, 
  Title, 
  Button, 
  Text, 
  Badge, 
  ActionIcon, 
  useMantineColorScheme 
} from '@mantine/core';
import { 
  IconLogout, 
  IconBuildingBank, 
  IconSun, 
  IconMoon 
} from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';

const HeaderComponent = () => {
  const { session, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!session) return null;

  return (
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
  );
};

// Usar memo para evitar re-renders innecesarios
export const Header = memo(HeaderComponent);