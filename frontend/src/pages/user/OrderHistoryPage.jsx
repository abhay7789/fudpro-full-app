import React, { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Card, Group, Badge, Stack, 
  Timeline, Paper, Divider, Loader, Center, Button, Box, ThemeIcon, SimpleGrid,
  useMantineColorScheme
} from '@mantine/core';
import { 
  Clock, Check, Package, Bike, Home, AlertCircle, ShoppingBag, ChevronRight, Refresh 
} from 'tabler-icons-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={2} fw={900}>My Orders</Title>
            <Text c="dimmed" size="sm">Track and manage your recent orders</Text>
          </Box>
          <Button 
            variant="light" 
            color="orange" 
            leftSection={<Refresh size={18} />} 
            onClick={loadOrders}
            loading={loading}
          >
            Refresh
          </Button>
        </Group>

        {orders.length === 0 ? (
          <Paper p={80} withBorder radius="lg" shadow="sm" style={{ textAlign: 'center' }}>
            <Center mb="md">
              <ThemeIcon size={80} radius={100} color="gray.1" variant="light">
                <ShoppingBag size={40} color="#adb5bd" />
              </ThemeIcon>
            </Center>
            <Title order={3} mb="xs">No orders yet</Title>
            <Text c="dimmed" mb="xl">Hungry? Explore our partner restaurants and place your first order!</Text>
            <Button size="lg" radius="md" bg="premium-orange" onClick={() => navigate('/user/dashboard')}>
              Order Now
            </Button>
          </Paper>
        ) : (
          orders.map((order) => (
            <Card key={order.id} shadow="sm" radius="lg" withBorder p="0" style={{ overflow: 'hidden' }}>
              <Box p="lg">
                <Group justify="space-between" mb="md" wrap="nowrap">
                  <Box>
                    <Text fw={900} size="lg">Order #{order.id.slice(-6).toUpperCase()}</Text>
                    <Text size="xs" c="dimmed" fw={600}>{new Date(order.created_at_datetime).toLocaleString()}</Text>
                  </Box>
                  <Badge size="lg" radius="md" color={getStatusColor(order.status)} variant="filled">
                    {order.status}
                  </Badge>
                </Group>

                <Divider mb="lg" variant="dashed" />

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                  <Stack gap="md">
                    <Text fw={800} size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>Items Summary</Text>
                    <Stack gap="xs">
                      {order.items?.map((item, idx) => (
                        <Group key={idx} justify="space-between">
                          <Text size="sm" fw={500}>{item.quantity}x {item.menuItem?.name || 'Item'}</Text>
                          <Text size="sm" fw={700}>₹{item.price * item.quantity}</Text>
                        </Group>
                      ))}
                    </Stack>
                    <Divider my="xs" variant="dashed" />
                    <Group justify="space-between">
                      <Text fw={800}>Total Amount</Text>
                      <Text fw={900} c="orange" size="xl">₹{order.totalAmount}</Text>
                    </Group>
                  </Stack>

                  <Stack gap="md">
                    <Text fw={800} size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>Live Tracking</Text>
                    <Timeline active={order.history?.length - 1} bulletSize={28} lineWidth={2} color="orange" p="xs">
                      {order.history?.map((log, idx) => (
                        <Timeline.Item 
                          key={idx} 
                          bullet={getStatusIcon(log.status)} 
                          title={<Text fw={800} size="sm">{log.status}</Text>}
                        >
                          <Text c="dimmed" size="xs" fw={500}>{new Date(log.created_at_datetime).toLocaleTimeString()}</Text>
                          {log.comment && <Text size="xs" mt={4} fw={500}>{log.comment}</Text>}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Stack>
                </SimpleGrid>
              </Box>
              
              {order.status === 'DELIVERED' && (
                <Box bg={isDark ? 'dark.6' : 'gray.0'} p="md" style={{ borderTop: isDark ? '1px solid #373A40' : '1px solid #eee' }}>
                  <Button variant="subtle" color="orange" fullWidth rightSection={<ChevronRight size={16} />}>
                    Re-order Items
                  </Button>
                </Box>
              )}
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default OrderHistoryPage;
