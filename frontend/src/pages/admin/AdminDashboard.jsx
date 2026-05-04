import React, { useEffect, useState } from 'react';
import { Card, Title, Text, SimpleGrid, Group, Table, Badge, Paper, Stack, Center, Loader } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, ShoppingCart, CurrencyRupee, TrendingUp } from 'tabler-icons-react';
import api from '../../services/api';

import { useMantineColorScheme, Box } from '@mantine/core';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard/admin');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', traffic: 400 },
    { name: 'Tue', traffic: 300 },
    { name: 'Wed', traffic: 600 },
    { name: 'Thu', traffic: 800 },
    { name: 'Fri', traffic: 500 },
    { name: 'Sat', traffic: 900 },
    { name: 'Sun', traffic: 700 },
  ];

  if (loading) return (
    <Center h={400}>
      <Loader color="orange" size="xl" type="bars" />
    </Center>
  );

  return (
    <Stack gap="xl">
      <Title order={2} fw={900}>{t('admin_dashboard')}</Title>
      
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Card withBorder radius="md" padding="xl" shadow="sm">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Total Users</Text>
            <Users size={24} color="#FC8019" />
          </Group>
          <Group align="flex-end" gap="xs" mt="sm">
            <Text size="xl" fw={700}>{stats?.totalUsers || 1240}</Text>
            <Text c="green" size="sm" fw={500}>+12%</Text>
          </Group>
          <Text size="xs" c="dimmed" mt={7}>Compared to last month</Text>
        </Card>

        <Card withBorder radius="md" padding="xl" shadow="sm">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">New Orders</Text>
            <ShoppingCart size={24} color="#FC8019" />
          </Group>
          <Group align="flex-end" gap="xs" mt="sm">
            <Text size="xl" fw={700}>{stats?.todayOrders || 45}</Text>
            <Text c="green" size="sm" fw={500}>+5%</Text>
          </Group>
          <Text size="xs" c="dimmed" mt={7}>Since yesterday</Text>
        </Card>

        <Card withBorder radius="md" padding="xl" shadow="sm">
          <Group justify="space-between">
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">Revenue</Text>
            <CurrencyRupee size={24} color="#FC8019" />
          </Group>
          <Group align="flex-end" gap="xs" mt="sm">
            <Text size="xl" fw={700}>₹{stats?.todayRevenue?.toLocaleString() || '12,450'}</Text>
            <Text c="red" size="sm" fw={500}>-2%</Text>
          </Group>
          <Text size="xs" c="dimmed" mt={7}>Compared to average</Text>
        </Card>
      </SimpleGrid>

      <Paper withBorder radius="md" p="xl" shadow="sm">
        <Title order={4} mb="lg">Traffic Overview</Title>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FC8019" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#FC8019" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="traffic" stroke="#FC8019" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Paper>

      <Paper withBorder radius="md" p="0" style={{ overflow: 'hidden' }} shadow="sm">
        <Box p="xl">
          <Title order={4}>Recent Activity</Title>
        </Box>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg={isDark ? 'dark.6' : 'gray.0'}>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Action</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td><Text size="sm" fw={600}>Rahul Sharma</Text></Table.Td>
                <Table.Td><Text size="sm">Placed new order #4521</Text></Table.Td>
                <Table.Td><Text size="sm" c="dimmed">2 mins ago</Text></Table.Td>
                <Table.Td><Badge color="green" variant="light">Completed</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="sm" fw={600}>Vendor: Spice Hut</Text></Table.Td>
                <Table.Td><Text size="sm">Updated menu items</Text></Table.Td>
                <Table.Td><Text size="sm" c="dimmed">15 mins ago</Text></Table.Td>
                <Table.Td><Badge color="blue" variant="light">Pending</Badge></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td><Text size="sm" fw={600}>Amit Verma</Text></Table.Td>
                <Table.Td><Text size="sm">Profile update</Text></Table.Td>
                <Table.Td><Text size="sm" c="dimmed">1 hour ago</Text></Table.Td>
                <Table.Td><Badge color="gray" variant="light">System</Badge></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Stack>
  );
};

export default AdminDashboard;