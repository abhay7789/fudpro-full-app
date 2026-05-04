import React, { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Card, Group, Badge, Stack, 
  Button, Divider, Loader, Center, Paper, Table, Select
} from '@mantine/core';
import { ShoppingBag, Check, X, Truck, Package, Bike } from 'tabler-icons-react';
import api from '../../services/api';

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.items || []);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { 
        status: newStatus,
        comment: `Order updated to ${newStatus.replace(/_/g, ' ')}`
      });
      loadOrders();
    } catch (error) {
      console.error('Failed to update status', error);
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
        <Title order={2} style={{ letterSpacing: -1 }}>Order Management</Title>

        {orders.length === 0 ? (
          <Paper p={50} withBorder radius="md" style={{ textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <ShoppingBag size={50} color="#ccc" style={{ marginBottom: 15 }} />
            <Text c="dimmed">No orders received yet. Make sure your menu is active!</Text>
          </Paper>
        ) : (
          <Table verticalSpacing="md" horizontalSpacing="md" withBorder withColumnBorders>
            <Table.Thead style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Tr>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>Date & Time</Table.Th>
                <Table.Th>Items</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>
                    <Text fw={700}>#{order.id.slice(-6).toUpperCase()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{new Date(order.created_at_datetime).toLocaleString()}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap={2}>
                      {order.items?.map((item, idx) => (
                        <Text key={idx} size="xs">{item.quantity}x {item.menuItem?.name || 'Item'}</Text>
                      ))}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={700}>₹{order.totalAmount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getStatusColor(order.status)} variant="light">
                      {order.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {order.status === 'PLACED' && (
                        <Button size="xs" color="green" leftSection={<Check size={14} />} onClick={() => updateStatus(order.id, 'ACCEPTED')}>
                          Accept
                        </Button>
                      )}
                      {order.status === 'ACCEPTED' && (
                        <Button size="xs" color="orange" leftSection={<Package size={14} />} onClick={() => updateStatus(order.id, 'PREPARING')}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button size="xs" color="yellow" leftSection={<ShoppingBag size={14} />} onClick={() => updateStatus(order.id, 'READY_FOR_DELIVERY')}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'READY_FOR_DELIVERY' && (
                        <Button size="xs" color="indigo" leftSection={<Bike size={14} />} onClick={() => updateStatus(order.id, 'OUT_FOR_DELIVERY')}>
                          Out for Delivery
                        </Button>
                      )}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <Button size="xs" color="green" leftSection={<Check size={14} />} onClick={() => updateStatus(order.id, 'DELIVERED')}>
                          Mark Delivered
                        </Button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <Text size="xs" c="green" fw={700}>Completed</Text>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
};

export default VendorOrdersPage;
