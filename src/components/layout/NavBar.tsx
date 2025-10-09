'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Stack, Text, UnstyledButton, Group, Box } from '@mantine/core';
import { getMenuItems } from '@/config/menu';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { useAuth } from '@/hooks/useAuth';
import classes from './NavBar.module.css';

const NavBarComponent = () => {
  const { isActive } = useActiveRoute();
  const { user } = useAuth();
  const menuItems = getMenuItems(user?.role, user?.permissions);

  return (
    <Stack gap="xs" p="md">
      <Text fw={500} size="sm" c="dimmed" mb="xs">
        NAVEGACIÓN
      </Text>
      
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
            <UnstyledButton
              className={`${classes.navLink} ${active ? classes.active : ''}`}
              w="100%"
              p="sm"
            >
              <Group gap="sm">
                <Icon size="1rem" stroke={1.5} />
                <Box flex={1}>
                  <Text size="sm" fw={active ? 600 : 400}>
                    {item.label}
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>
          </Link>
        );
      })}
    </Stack>
  );
};

// Usar memo para evitar re-renders innecesarios
export const NavBar = memo(NavBarComponent);