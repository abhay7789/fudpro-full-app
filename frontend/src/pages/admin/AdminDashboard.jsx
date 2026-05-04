import React, { useEffect, useState } from 'react';
import { Card, Title, Text, SimpleGrid, Group, Table, Badge, Paper, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, ShoppingCart, CurrencyRupee, TrendingUp } from 'tabler-icons-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const { t } = useTranslation();
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

  if (loading) return <div>Loading...</div>;

  return (
    <Stack gap="xl">
      <Title order={2}>{t('admin_dashboard')}</Title>
      
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        <Card withBorder radius="md" padding="xl">
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

        <Card withBorder radius="md" padding="xl">
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

        <Card withBorder radius="md" padding="xl">
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

      <Paper withBorder radius="md" p="xl">
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

      <Paper withBorder radius="md" p="xl">
        <Title order={4} mb="lg">Recent Activity</Title>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Rahul Sharma</Table.Td>
              <Table.Td>Placed new order #4521</Table.Td>
              <Table.Td>2 mins ago</Table.Td>
              <Table.Td><Badge color="green">Completed</Badge></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Vendor: Spice Hut</Table.Td>
              <Table.Td>Updated menu items</Table.Td>
              <Table.Td>15 mins ago</Table.Td>
              <Table.Td><Badge color="blue">Pending</Badge></Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Amit Verma</Table.Td>
              <Table.Td>Profile update</Table.Td>
              <Table.Td>1 hour ago</Table.Td>
              <Table.Td><Badge color="gray">System</Badge></Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default AdminDashboard;