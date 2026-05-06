import React, { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Card, Group, Badge, Stack, 
  Timeline, Paper, Divider, Loader, Center, Button, Box, ThemeIcon, SimpleGrid,
  useMantineColorScheme, Table, ScrollArea
} from '@mantine/core';
import { 
  Clock, Check, Package, Bike, Home, AlertCircle, ShoppingBag, Refresh, ClipboardList
} from 'tabler-icons-react';
import api from '../../services/api';

const VendorOrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      const historyOrders = (response.data.items || []).filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));
      setOrders(historyOrders);
    } catch (error) {
      console.error('Failed to load orders', error);
      // Fallback if vendor history endpoint doesn't exist yet
      try {
        const fallbackRes = await api.get('/orders');
        setOrders(fallbackRes.data.items.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED'));
      } catch (e) {
        console.error('Fallback failed', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'blue';
      case 'ACCEPTED': return 'cyan';
      case 'PREPARING': return 'orange';
      case 'READY_FOR_DELIVERY': return 'yellow';
      case 'OUT_FOR_DELIVERY': return 'indigo';
      case 'DELIVERED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  if (loading) return (
    <Center h={400}>
      <Loader color="orange" size="xl" type="bars" />
    </Center>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2} fw={900}>Order History</Title>
            <Text c="dimmed" size="sm">Past orders and fulfillment records</Text>
          </Box>
          <Button 
            variant="light" 
            color="orange" 
            leftSection={<Refresh size={18} />}
            onClick={loadOrders}
          >
            Refresh
          </Button>
        </Group>

        {orders.length === 0 ? (
          <Paper p={80} withBorder radius="lg" shadow="sm" style={{ textAlign: 'center' }}>
            <Center mb="md">
              <ThemeIcon size={80} radius={100} color="gray.1" variant="light">
                <ClipboardList size={40} color="#adb5bd" />
              </ThemeIcon>
            </Center>
            <Title order={3} mb="xs">No past orders</Title>
            <Text c="dimmed">Complete your first delivery to see history here!</Text>
          </Paper>
        ) : (
          <Paper withBorder radius="lg" shadow="sm" style={{ overflow: 'hidden' }}>
            <ScrollArea h={600}>
              <Table verticalSpacing="md" horizontalSpacing="xl" highlightOnHover>
                <Table.Thead bg={isDark ? 'dark.7' : 'gray.0'}>
                  <Table.Tr>
                    <Table.Th>Order ID</Table.Th>
                    <Table.Th>Date & Time</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Total Amount</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {orders.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text fw={700} size="sm">#{order.id.slice(-6).toUpperCase()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{new Date(order.created_at_datetime).toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600} size="sm">{order.user?.name || 'Customer'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs">
                          {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={800} color="orange">₹{order.totalAmount}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)} variant="light">
                          {order.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default VendorOrderHistoryPage;
