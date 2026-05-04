import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { 
  Group, Button, Text, ActionIcon, Badge, Menu, Avatar, 
  Container, UnstyledButton, Box 
} from '@mantine/core';
import { 
  ShoppingCart, User, Logout, 
  LayoutDashboard, History, Settings, ChevronDown 
} from 'tabler-icons-react';

const Navbar = ({ openLogin }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDiscover = () => {
    if (isAuthenticated) {
      navigate('/browse');
    } else {
      openLogin();
    }
  };

  return (
    <Box 
      component="nav" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        height: 70
      }}
    >
      <Container size="xl" h="100%" px="md">
        <Group justify="space-between" h="100%">
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

          <Group gap="xl">
            <UnstyledButton 
              onClick={handleDiscover} 
              visibleFrom="sm"
              style={{ fontWeight: 700, fontSize: 14, color: '#444' }}
            >
              Discover
            </UnstyledButton>
            
            {isAuthenticated ? (
              <Menu shadow="md" width={200} radius="md">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={8}>
                      <Avatar color="orange" radius="xl" size={32}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <ChevronDown size={14} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item leftSection={<History size={16} />} component={Link} to="/orders">
                    Order History
                  </Menu.Item>
                  
                  {user?.role === 'VENDOR' && (
                    <Menu.Item leftSection={<LayoutDashboard size={16} />} component={Link} to="/vendor/dashboard">
                      Vendor Dashboard
                    </Menu.Item>
                  )}
                  
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <Menu.Item leftSection={<Settings size={16} />} component={Link} to="/admin/dashboard">
                      Admin Console
                    </Menu.Item>
                  )}

                  <Menu.Divider />
                  
                  <Menu.Item 
                    leftSection={<User size={16} />} 
                    component={Link} 
                    to="/profile"
                  >
                    Profile
                  </Menu.Item>

                  <Menu.Item
                    color="red"
                    leftSection={<Logout size={16} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="sm">
                <Button 
                  variant="subtle" 
                  color="dark" 
                  fw={700}
                  onClick={openLogin}
                >
                  Login
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Navbar;
