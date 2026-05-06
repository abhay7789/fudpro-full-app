import React, { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Group, Badge, Stack, 
  Button, Divider, Loader, Center, Paper, Table, Box, ActionIcon,
  useMantineColorScheme
} from '@mantine/core';
import { ShoppingBag, Check, X, Truck, Package, Bike, Refresh } from 'tabler-icons-react';
import { notifications } from '@mantine/notifications';
import api from '../../services/api';

const VendorOrdersPage = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      const activeOrders = (response.data.items || []).filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
      setOrders(activeOrders);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { 
        status: newStatus,
        comment: `Order updated to ${newStatus.replace(/_/g, ' ')}`
      });
      notifications.show({
        title: 'Status Updated',
        message: `Order #${orderId.slice(-6).toUpperCase()} is now ${newStatus.replace(/_/g, ' ')}`,
        color: 'green',
      });
      loadOrders();
    } catch (error) {
      notifications.show({
        title: 'Update Failed',
        message: 'Could not update order status. Please try again.',
        color: 'red',
      });
    } finally {
      setUpdating(null);
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
        <Group justify="space-between">
          <Box>
            <Title order={2} fw={900}>Order Management</Title>
            <Text c="dimmed" size="sm">Manage incoming orders and delivery status</Text>
          </Box>
          <ActionIcon size="lg" variant="light" color="orange" onClick={loadOrders}>
            <Refresh size={20} />
          </ActionIcon>
        </Group>

        {orders.length === 0 ? (
          <Paper p={80} withBorder radius="lg" shadow="sm" style={{ textAlign: 'center' }}>
            <ShoppingBag size={50} color="#ccc" style={{ marginBottom: 15 }} />
            <Text c="dimmed" size="lg" fw={600}>No orders received yet.</Text>
            <Text size="sm" c="dimmed">Keep your menu updated to attract more customers!</Text>
          </Paper>
        ) : (
          <Paper withBorder radius="lg" shadow="sm" style={{ overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={1000}>
              <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
                <Table.Thead bg={isDark ? 'dark.6' : 'gray.0'}>
                  <Table.Tr>
                    <Table.Th>Order ID</Table.Th>
                    <Table.Th>Customer & Time</Table.Th>
                    <Table.Th>Order Summary</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {orders.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text fw={800} size="sm">#{order.id.slice(-6).toUpperCase()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} size="sm">{order.customerName || 'Customer'}</Text>
                        <Text size="xs" c="dimmed">{new Date(order.created_at_datetime).toLocaleString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          {order.items?.map((item, idx) => (
                            <Text key={idx} size="xs" fw={500}>• {item.quantity}x {item.menuItem?.name || 'Item'}</Text>
                          ))}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={800} size="md">₹{order.totalAmount}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)} variant="dot" fw={800}>
                          {order.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          {order.status === 'PLACED' && (
                            <Button 
                              size="xs" 
                              variant="filled" 
                              bg="green" 
                              leftSection={<Check size={14} />} 
                              onClick={() => updateStatus(order.id, 'ACCEPTED')}
                              loading={updating === order.id}
                            >
                              Accept
                            </Button>
                          )}
                          {order.status === 'ACCEPTED' && (
                            <Button 
                              size="xs" 
                              variant="filled" 
                              bg="orange" 
                              leftSection={<Package size={14} />} 
                              onClick={() => updateStatus(order.id, 'PREPARING')}
                              loading={updating === order.id}
                            >
                              Prepare
                            </Button>
                          )}
                          {order.status === 'PREPARING' && (
                            <Button 
                              size="xs" 
                              variant="filled" 
                              bg="yellow" 
                              leftSection={<ShoppingBag size={14} />} 
                              onClick={() => updateStatus(order.id, 'READY_FOR_DELIVERY')}
                              loading={updating === order.id}
                            >
                              Ready
                            </Button>
                          )}
                          {order.status === 'READY_FOR_DELIVERY' && (
                            <Button 
                              size="xs" 
                              variant="filled" 
                              bg="indigo" 
                              leftSection={<Bike size={14} />} 
                              onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}
                              loading={updating === order.id}
                            >
                              Deliver
                            </Button>
                          )}
                          {order.status === 'OUT_FOR_DELIVERY' && (
                            <Button 
                              size="xs" 
                              variant="filled" 
                              bg="green" 
                              leftSection={<Check size={14} />} 
                              onClick={() => updateStatus(order.id, 'DELIVERED')}
                              loading={updating === order.id}
                            >
                              Complete
                            </Button>
                          )}
                          {order.status === 'DELIVERED' && (
                            <Badge color="green" variant="light" p="md">Completed</Badge>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default VendorOrdersPage;
