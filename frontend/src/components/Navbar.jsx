import React, { memo, useState } from 'react';
import { 
  Group, Text, Button, ActionIcon, Box, 
  useMantineColorScheme, UnstyledButton,
  Drawer, Stack, Divider, Burger
} from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Home, Compass, ShoppingBag, Settings } from 'tabler-icons-react';
import useAuthStore from '../store/useAuthStore';
import { getDashboardRoute } from '../utils/routeUtils';

const Navbar = memo(({ openLogin, openRegister, isLanding = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => setColorScheme(isDark ? 'light' : 'dark');

  const isOnDashboard = location.pathname.includes('dashboard') || 
    location.pathname.includes('admin') || 
    location.pathname.includes('vendor') || 
    location.pathname.includes('superadmin');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = isLanding ? [
    { label: 'Discover', icon: <Compass size={16} />, action: () => { navigate('/'); setMobileOpen(false); } },
  ] : [];

  return (
    <>
      <Box 
        component="nav"
        aria-label="Main navigation"
        style={{
          position: isLanding ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '14px 24px',
          transition: 'all 0.3s ease',
          background: isDark 
            ? 'rgba(16, 17, 19, 0.75)' 
            : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
        }}
      >
        <Group justify="space-between" maw={1200} mx="auto">
          {/* Logo */}
          <UnstyledButton onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isOnDashboard && (
              <ActionIcon variant="subtle" color="orange" radius="xl" mr="xs" aria-label="Go back" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
                <ArrowLeft size={18} />
              </ActionIcon>
            )}
            <img src="/logo.jpg" alt="fudPro logo" style={{ height: 30, width: 'auto', borderRadius: 6 }} />
            <Text size="lg" fw={900} style={{ letterSpacing: -1, color: isDark ? '#fff' : '#1A1A1A' }}>
              fud<Text span c="orange" inherit>Pro</Text>
            </Text>
          </UnstyledButton>

          {/* Desktop Nav Links */}
          <Group gap="md" visibleFrom="md">
            {navLinks.map((link) => (
              <UnstyledButton key={link.label} onClick={link.action}>
                <Group gap={6}>
                  {link.icon}
                  <Text size="sm" fw={700} c={isDark ? 'gray.3' : 'gray.7'}>{link.label}</Text>
                </Group>
              </UnstyledButton>
            ))}
          </Group>

          {/* Right Section */}
          <Group gap="sm">
            <ActionIcon 
              variant="subtle" 
              radius="xl" 
              size="lg"
              onClick={toggleTheme}
              color={isDark ? 'yellow' : 'gray'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ transition: 'transform 0.2s' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </ActionIcon>

            {isAuthenticated ? (
              <>
                <Button 
                  variant="subtle" 
                  color="orange" 
                  radius="xl" 
                  size="sm"
                  visibleFrom="md"
                  onClick={() => navigate(getDashboardRoute(user?.role))}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="light" 
                  color="red" 
                  radius="xl" 
                  size="sm"
                  visibleFrom="md"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : isLanding ? (
              <>
                <Button 
                  variant="subtle" 
                  color="orange"
                  radius="xl" 
                  size="sm" 
                  fw={700}
                  onClick={openLogin}
                >
                  Login
                </Button>
                <Button 
                  color="orange"
                  variant="filled"
                  radius="xl" 
                  size="sm" 
                  fw={700}
                  onClick={openRegister}
                  style={{ boxShadow: '0 4px 12px rgba(252, 128, 25, 0.2)' }}
                >
                  Sign Up
                </Button>
              </>
            ) : null}

            {/* Mobile Burger */}
            <Burger 
              opened={mobileOpen} 
              onClick={() => setMobileOpen(!mobileOpen)} 
              hiddenFrom="md"
              size="sm"
              color={isDark ? '#ccc' : '#333'}
              aria-label="Toggle navigation menu"
            />
          </Group>
        </Group>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={
          <Group gap={8}>
            <img src="/logo.jpg" alt="fudPro" style={{ height: 24, borderRadius: 4 }} />
            <Text fw={900} style={{ letterSpacing: -1 }}>fud<Text span c="orange" inherit>Pro</Text></Text>
          </Group>
        }
        position="right"
        size="80%"
        padding="lg"
        radius="lg"
        overlayProps={{ blur: 3, opacity: 0.4 }}
        styles={{ body: { paddingTop: 20 } }}
      >
        <Stack gap="md">
          {navLinks.map((link) => (
            <UnstyledButton key={link.label} onClick={link.action} style={{ padding: 12, borderRadius: 12 }}>
              <Group gap="sm">
                {link.icon}
                <Text fw={700}>{link.label}</Text>
              </Group>
            </UnstyledButton>
          ))}

          <Divider />

          {isAuthenticated ? (
            <>
              <Button 
                variant="light" 
                color="orange"
                radius="xl"
                size="md"
                fullWidth
                onClick={() => { navigate(getDashboardRoute(user?.role)); setMobileOpen(false); }}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="light" 
                color="red"
                radius="xl"
                size="md"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="light"
                color="orange"
                radius="xl"
                size="md"
                fullWidth
                onClick={() => { openLogin?.(); setMobileOpen(false); }}
              >
                Login
              </Button>
              <Button 
                bg="premium-orange"
                radius="xl"
                size="md"
                fullWidth
                onClick={() => { openRegister?.(); setMobileOpen(false); }}
                style={{ boxShadow: '0 4px 12px rgba(252, 128, 25, 0.2)' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
