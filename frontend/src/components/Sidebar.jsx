import React from 'react';
import { Stack, UnstyledButton, Group, Text, ThemeIcon, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home, Users, Box, ShoppingCart,
  Settings, ChartBar, BuildingStore, Truck,
  CreditCard, MapPin, History
} from 'tabler-icons-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <UnstyledButton
      onClick={() => navigate(path)}
      style={{
        display: 'block',
        width: '100%',
        borderRadius: '12px',
        backgroundColor: active
          ? 'rgba(9, 6, 4, 0.1)'
          : 'transparent',
        color: active
          ? '#FC8019'
          : isDark ? theme.colors.dark[0] : theme.colors.gray[7],
        transition: 'all 0.2s ease',
      }}
    >
      <Group p="12px 16px" gap="md">
        <ThemeIcon
          variant={active ? 'filled' : 'light'}
          color={active ? 'orange' : 'gray'}
          radius="md"
          size="md"
        >
          <Icon size={18} stroke={2} />
        </ThemeIcon>
        <Text size="sm" fw={active ? 800 : 500}>{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const Sidebar = ({ currentPath, role }) => {
  const getItemsByRole = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { icon: Home, label: 'Dashboard', path: '/superadmin/dashboard' },
          { icon: BuildingStore, label: 'Restaurants', path: '/superadmin/restaurants' },
          { icon: Users, label: 'Customers', path: '/superadmin/customers' },
          { icon: Truck, label: 'Drivers', path: '/superadmin/drivers' },
          { icon: ShoppingCart, label: 'Orders', path: '/superadmin/orders' },
          { icon: CreditCard, label: 'Payments', path: '/superadmin/payments' },
          { icon: ChartBar, label: 'Analytics', path: '/superadmin/analytics' },
        ];
      case 'ADMIN':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Box, label: 'Products/Menu', path: '/admin/menu' },
          { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
          { icon: ChartBar, label: 'Reports', path: '/admin/reports' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      case 'VENDOR':
        return [
          { icon: Home, label: 'Dashboard', path: '/vendor/dashboard' },
          { icon: Box, label: 'Menu Management', path: '/vendor/menu' },
          { icon: ShoppingCart, label: 'Active Orders', path: '/vendor/orders' },
          { icon: History, label: 'Order History', path: '/vendor/history' },
          { icon: Settings, label: 'Store Settings', path: '/vendor/settings' },
        ];
      case 'USER':
        return [
          { icon: LayoutDashboard, label: 'Find Food', path: '/user/dashboard' },
          { icon: History, label: 'My Orders', path: '/orders' },
          { icon: MapPin, label: 'My Addresses', path: '/addresses' },
          { icon: Settings, label: 'Profile Settings', path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const items = getItemsByRole();

  return (
    <Stack gap="xs">
      {items.map((item) => (
        <SidebarItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          active={currentPath === item.path}
        />
      ))}
    </Stack>
  );
};

export default Sidebar;
