import React, { useEffect, useState } from 'react';
import { Card, Title, Text, SimpleGrid, Group, Table, Badge, Paper, Stack, Button, Box, ActionIcon, Center, Loader, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { 
  BuildingStore, Users, Truck, ShoppingCart, 
  CurrencyRupee, Map2, Settings, Download, Refresh
} from 'tabler-icons-react';
import api from '../../services/api';

const SuperAdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard/superadmin');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const userStats = [
    { name: 'Active', value: 850, color: '#FC8019' },
    { name: 'Inactive', value: 240, color: '#adb5bd' },
    { name: 'Suspended', value: 50, color: '#fa5252' },
  ];

  if (loading) return (
    <Center h={400}>
      <Loader color="orange" size="xl" type="bars" />
    </Center>
  );

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={2}>Super Admin Dashboard</Title>
          <Text c="dimmed">Complete system overview and global controls</Text>
        </div>
        <Group>
          <Button leftSection={<Download size={16} />} variant="light" color="orange">Export Report</Button>
          <ActionIcon size="lg" variant="light" color="orange" onClick={loadDashboard}>
            <Refresh size={18} />
          </ActionIcon>
        </Group>
      </Group>
      
      <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
        <Card withBorder radius="md" padding="xl">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Restaurants</Text>
            <BuildingStore size={24} color="#FC8019" />
          </Group>
          <Text size="xl" fw={700} mt="sm">{stats?.totalVendors || 156}</Text>
          <Text size="xs" c="green" fw={500} mt={5}>+8 new this month</Text>
        </Card>

        <Card withBorder radius="md" padding="xl">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Active Users</Text>
            <Users size={24} color="#FC8019" />
          </Group>
          <Text size="xl" fw={700} mt="sm">{stats?.totalUsers || 2840}</Text>
          <Text size="xs" c="green" fw={500} mt={5}>+15% growth</Text>
        </Card>

        <Card withBorder radius="md" padding="xl">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Deliveries</Text>
            <Truck size={24} color="#FC8019" />
          </Group>
          <Text size="xl" fw={700} mt="sm">1,245</Text>
          <Text size="xs" c="green" fw={500} mt={5}>98% on-time rate</Text>
        </Card>

        <Card withBorder radius="md" padding="xl">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Revenue</Text>
            <CurrencyRupee size={24} color="#FC8019" />
          </Group>
          <Text size="xl" fw={700} mt="sm">₹{stats?.totalRevenue?.toLocaleString() || '4,52,000'}</Text>
          <Text size="xs" c="green" fw={500} mt={5}>+22% vs last year</Text>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder radius="md" p="xl">
          <Title order={4} mb="lg">Revenue Growth</Title>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#FC8019" fill="#FC8019" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Paper>

        <Paper withBorder radius="md" p="xl">
          <Title order={4} mb="lg">User Distribution</Title>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {userStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="xl">
        <Group justify="space-between" mb="lg">
          <Title order={4}>Live Delivery Map</Title>
          <Badge color="orange" variant="light">Live Track (Mock)</Badge>
        </Group>
        <Box 
          style={{ 
            height: 300, 
            backgroundColor: isDark ? '#25262b' : '#e9ecef', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Map2 size={48} color="#adb5bd" />
          <Text c="dimmed" mt="sm">Interactive Map View Placeholder</Text>
          <Text size="xs" c="dimmed">Integration with Google Maps API pending</Text>
        </Box>
      </Paper>
    </Stack>
  );
};

export default SuperAdminDashboard;