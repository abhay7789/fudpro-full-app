import React from 'react';
import { AppShell, Burger, Group, Text, Avatar, Menu, UnstyledButton, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Logout, Settings, LayoutDashboard, 
  ChevronDown, Bell, Search, History, MapPin 
} from 'tabler-icons-react';
import useAuthStore from '../store/useAuthStore';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: '#F8F9FA'
        }
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <UnstyledButton component={Link} to="/">
              <Group gap="xs">
                <Box 
                  style={{ 
                    background: 'linear-gradient(135deg, #FC8019, #f59e0b)',
                    width: 35, height: 35, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Text c="white" fw={900} size="xl">f</Text>
                </Box>
                <Text size="xl" fw={900} style={{ letterSpacing: -1 }}>
                  fud<Text span c="orange" inherit>Pro</Text>
                </Text>
              </Group>
            </UnstyledButton>
          </Group>

          <Group gap="lg">
            <Menu shadow="md" width={220} radius="md" transitionProps={{ transition: 'pop-top-right' }}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={8}>
                    <Avatar color="orange" radius="xl" size={36} src={user?.image}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box visibleFrom="md" style={{ flex: 1 }}>
                      <Text size="sm" fw={700}>{user?.name}</Text>
                      <Text size="xs" c="dimmed">{user?.role?.replace('_', ' ')}</Text>
                    </Box>
                    <Box visibleFrom="md" display="flex" style={{ alignItems: 'center' }}>
                      <ChevronDown size={14} />
                    </Box>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item 
                  leftSection={<User size={16} />} 
                  onClick={() => navigate('/profile')}
                >
                  My Profile
                </Menu.Item>
                {user?.role === 'USER' && (
                  <Menu.Item 
                    leftSection={<MapPin size={16} />} 
                    onClick={() => navigate('/addresses')}
                  >
                    Manage Addresses
                  </Menu.Item>
                )}
                <Menu.Item leftSection={<Settings size={16} />}>
                  Account Settings
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Item
                  color="red"
                  leftSection={<Logout size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar currentPath={location.pathname} role={user?.role} />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
