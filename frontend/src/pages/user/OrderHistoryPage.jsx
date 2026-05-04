import React, { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Card, Group, Badge, Stack, 
  Timeline, Paper, Divider, Loader, Center, Button, ScrollArea
} from '@mantine/core';
import { 
  Clock, Check, Package, Bike, Home, AlertCircle, ShoppingBag 
} from 'tabler-icons-react';
import api from '../../services/api';

const OrderHistoryPage = () => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED': return <Clock size={16} />;
      case 'ACCEPTED': return <Check size={16} />;
      case 'PREPARING': return <Package size={16} />;
      case 'READY_FOR_DELIVERY': return <ShoppingBag size={16} />;
      case 'OUT_FOR_DELIVERY': return <Bike size={16} />;
      case 'DELIVERED': return <Home size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) return (
    <Center h={400}>
      <Loader color="orange" size="xl" type="bars" />
    </Center>
  );

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={2} style={{ letterSpacing: -1 }}>My Orders</Title>

        {orders.length === 0 ? (
          <Paper p={50} withBorder radius="md" style={{ textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <ShoppingBag size={50} color="#ccc" style={{ marginBottom: 15 }} />
            <Text c="dimmed">You haven't placed any orders yet.</Text>
            <Button variant="light" color="orange" mt="md" onClick={() => window.location.href='/user/dashboard'}>
              Order Now
            </Button>
          </Paper>
        ) : (
          orders.map((order) => (
            <Card key={order.id} shadow="sm" radius="md" withBorder p="xl">
              <Group justify="space-between" mb="lg">
                <Box>
                  <Text fw={800} size="xl">Order #{order.id.slice(-6).toUpperCase()}</Text>
                  <Text size="xs" c="dimmed">{new Date(order.created_at_datetime).toLocaleString()}</Text>
                </Box>
                <Badge size="lg" radius="sm" color={getStatusColor(order.status)} variant="filled">
                  {order.status}
                </Badge>
              </Group>

              <Divider mb="lg" />

              <Group align="flex-start" grow>
                <Stack gap="xs">
                  <Text fw={700} size="sm" c="dimmed">ITEMS</Text>
                  {order.items?.map((item, idx) => (
                    <Group key={idx} justify="space-between">
                      <Text size="sm">{item.quantity}x {item.menuItem?.name || 'Item'}</Text>
                      <Text size="sm" fw={600}>₹{item.price * item.quantity}</Text>
                    </Group>
                  ))}
                  <Divider my="sm" variant="dashed" />
                  <Group justify="space-between">
                    <Text fw={700}>Total Amount</Text>
                    <Text fw={800} color="orange" size="lg">₹{order.totalAmount}</Text>
                  </Group>
                </Stack>

                <Stack gap="xs">
                  <Text fw={700} size="sm" c="dimmed">TRACKING</Text>
                  <Timeline active={order.history?.length - 1} bulletSize={24} lineWidth={2} color="orange">
                    {order.history?.map((log, idx) => (
                      <Timeline.Item 
                        key={idx} 
                        bullet={getStatusIcon(log.status)} 
                        title={<Text fw={700} size="sm">{log.status}</Text>}
                      >
                        <Text c="dimmed" size="xs">{new Date(log.created_at_datetime).toLocaleTimeString()}</Text>
                        {log.comment && <Text size="xs" mt={4}>{log.comment}</Text>}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Stack>
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};

// Simple Box replacement since I didn't import it
const Box = ({ children }) => <div>{children}</div>;

export default OrderHistoryPage;
