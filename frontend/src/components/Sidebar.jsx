import React from 'react';
import { Stack, UnstyledButton, Group, Text, ThemeIcon } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Box, ShoppingCart, 
  Settings, ChartBar, BuildingStore, Truck, 
  CreditCard, MapPin, History
} from 'tabler-icons-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      onClick={() => navigate(path)}
      style={(theme) => ({
        display: 'block',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: active ? 'rgba(252, 128, 25, 0.1)' : 'transparent',
        color: active ? '#FC8019' : '#495057',
        '&:hover': {
          backgroundColor: '#F1F3F5',
        },
        transition: 'all 0.2s ease',
      })}
    >
      <Group p="12px 16px">
        <Icon size={20} stroke={2} />
        <Text size="sm" fw={active ? 700 : 500}>{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

const Sidebar = ({ currentPath, role }) => {
  const getItemsByRole = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
          { icon: BuildingStore, label: 'Restaurants', path: '/superadmin/restaurants' },
          { icon: Users, label: 'Customers', path: '/superadmin/customers' },
          { icon: Truck, label: 'Drivers', path: '/superadmin/drivers' },
          { icon: ShoppingCart, label: 'Orders', path: '/superadmin/orders' },
          { icon: CreditCard, label: 'Payments', path: '/superadmin/payments' },
          { icon: ChartBar, label: 'Analytics', path: '/superadmin/analytics' },
        ];
      case 'ADMIN':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Box, label: 'Products/Menu', path: '/admin/menu' },
          { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
          { icon: ChartBar, label: 'Reports', path: '/admin/reports' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      case 'VENDOR':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/vendor/dashboard' },
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
