import React, { useEffect, useState } from 'react';
import { 
  Card, Title, Text, Button, Badge, Group, SimpleGrid, Image, 
  Modal, Table, Divider, Stack, ActionIcon, Radio, Stepper, 
  Paper, Box, ScrollArea, Center, Loader, useMantineTheme, useMantineColorScheme 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, Trash, ShoppingCart, CreditCard, 
  DeviceMobile, Cash, MapPin, Check, ChevronRight,
  Star, Clock, Search, AlertCircle
} from 'tabler-icons-react';
import { notifications } from '@mantine/notifications';
import api from '../../services/api';

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menu, setMenu] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const [checkoutOpened, { open: openCheckout, close: closeCheckout }] = useDisclosure(false);
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await api.get('/customers/vendors');
      setVendors(response.data.items || []);
    } catch (error) {
      console.error('Failed to load vendors', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorMenu = async (vendorId) => {
    try {
      const response = await api.get(`/customers/vendors/${vendorId}/menu`);
      setMenu(response.data.data);
      const vendor = vendors.find(v => v.id === vendorId);
      setSelectedVendor(vendor);
      open();
    } catch (error) {
      console.error('Failed to load vendor menu', error);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        vendorId: selectedVendor.id,
        paymentMethod,
        items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity }))
      };
      await api.post('/orders', orderData);
      setCart([]);
      setActiveStep(2); // Success step
    } catch (error) {
      notifications.show({
        title: 'Order Failed',
        message: 'Could not place your order. Please try again.',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCheckout = () => {
    close();
    setActiveStep(0);
    openCheckout();
  };

  if (loading) return (
    <Center h={400}>
      <Loader color="orange" size="xl" type="bars" />
    </Center>
  );

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Box>
          <Title order={2} fw={900} style={{ letterSpacing: -0.5 }}>{t('user_dashboard')}</Title>
          <Text size="sm" c="dimmed">Discover the best food near you</Text>
        </Box>
        <Button 
          onClick={openCheckout} 
          variant="filled" 
          bg="premium-orange" 
          leftSection={<ShoppingCart size={20} />}
          radius="md"
          size="md"
          disabled={cart.length === 0}
          shadow="sm"
        >
          Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
        </Button>
      </Group>

      <Title order={3} size="h4" c="dimmed">{t('available_vendors')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {vendors.map((vendor) => (
          <Card 
            key={vendor.id} 
            shadow="sm" 
            padding="0" 
            radius="lg" 
            withBorder 
            className="food-card"
            onClick={() => loadVendorMenu(vendor.id)}
          >
            <Card.Section>
              <Box style={{ position: 'relative' }}>
                <Image 
                  src={vendor.coverImage ? (typeof vendor.coverImage === 'string' ? vendor.coverImage : `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, vendor.coverImage.data))}`) : (vendor.imageUrl || `https://source.unsplash.com/featured/?restaurant,food&${vendor.id}`)} 
                  height={180} 
                  alt={vendor.restaurantName} 
                />
                <Badge 
                  style={{ position: 'absolute', top: 12, right: 12 }} 
                  color="green" 
                  variant="filled" 
                  radius="md"
                  shadow="sm"
                >
                  LIVE
                </Badge>
              </Box>
            </Card.Section>
            
            <Box p="lg">
              <Group justify="space-between" wrap="nowrap">
                <Text fw={800} size="lg" lineClamp={1}>{vendor.restaurantName}</Text>
                <Group gap={4}>
                  <Star size={16} fill="#FFC107" color="#FFC107" />
                  <Text fw={700} size="sm">4.2</Text>
                </Group>
              </Group>
              
              <Text size="xs" c="dimmed" lineClamp={1} mt={4}>{vendor.description || 'Gourmet Indian Cuisine • Street Food • North Indian'}</Text>
              
              <Divider my="md" variant="dashed" />
              
              <Group justify="space-between">
                <Group gap={4}>
                  <Clock size={14} color="gray" />
                  <Text size="xs" c="dimmed">25-35 mins</Text>
                </Group>
                <Text fw={700} size="sm" c="premium-orange">View Menu</Text>
              </Group>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      {vendors.length === 0 && (
        <Center p={50}>
          <Text c="dimmed">No vendors available at the moment. Check back later!</Text>
        </Center>
      )}

      {/* Vendor Menu Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={
          <Group gap="xs">
            <Text fw={800} size="xl">{selectedVendor?.restaurantName}</Text>
            <Badge variant="dot" color="green">Menu</Badge>
          </Group>
        } 
        size="lg" 
        radius="lg"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <ScrollArea h={600} offsetScrollbars p="md">
          {Object.entries(menu).map(([category, items]) => (
            <Box key={category} mb="xl">
              <Title order={4} mb="md" c="orange">{category}</Title>
              <Stack gap="md">
                {items.map((item) => {
                  const cartItem = cart.find(i => i.id === item.id);
                  return (
                    <Paper 
                      key={item.id} 
                      p="lg" 
                      withBorder 
                      radius="lg" 
                      style={{ 
                        backgroundColor: cartItem 
                          ? (isDark ? 'rgba(252, 128, 25, 0.05)' : '#fffaf5') 
                          : 'transparent',
                        borderColor: cartItem ? '#FC8019' : undefined
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                          <Text fw={700} size="md">{item.name}</Text>
                          <Text size="xs" c="dimmed" mt={4}>{item.description || 'Freshly prepared with authentic ingredients'}</Text>
                          <Text fw={900} size="lg" mt={8} c="orange">₹{item.price}</Text>
                        </Box>
                        
                        {cartItem ? (
                          <Group gap={8} p={4} style={{ 
                            backgroundColor: isDark ? theme.colors.dark[8] : '#fff', 
                            borderRadius: 12, 
                            border: `1px solid ${isDark ? theme.colors.dark[4] : '#eee'}`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                          }}>
                            <ActionIcon 
                              variant="subtle" 
                              color="orange" 
                              onClick={() => updateQuantity(item.id, -1)}
                              size="md"
                            >
                              <Minus size={16} />
                            </ActionIcon>
                            <Text size="md" fw={800} w={24} ta="center">{cartItem.quantity}</Text>
                            <ActionIcon 
                              variant="subtle" 
                              color="orange" 
                              onClick={() => updateQuantity(item.id, 1)}
                              size="md"
                            >
                              <Plus size={16} />
                            </ActionIcon>
                          </Group>
                        ) : (
                          <Button 
                            variant="light" 
                            color="orange" 
                            radius="md" 
                            size="sm"
                            onClick={() => addToCart(item)}
                            leftSection={<Plus size={16} />}
                            fw={700}
                          >
                            Add
                          </Button>
                        )}
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </ScrollArea>
        
        <Box mt="xl" pt="md" style={{ borderTop: isDark ? '1px solid #373A40' : '1px solid #eee' }}>
          <Button 
            fullWidth 
            size="lg"
            color="orange"
            radius="md"
            onClick={handleCheckout} 
            disabled={cart.length === 0}
            rightSection={<ChevronRight size={20} />}
          >
            Checkout (₹{getCartTotal()})
          </Button>
        </Box>
      </Modal>

      {/* Checkout Stepper Modal */}
      <Modal 
        opened={checkoutOpened} 
        onClose={closeCheckout} 
        title={<Text fw={800} size="xl">Checkout</Text>}
        size="lg"
        radius="lg"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <Stepper active={activeStep} onStepClick={setActiveStep} color="orange" size="sm" allowNextStepsSelect={false}>
          <Stepper.Step label="Cart" description="Review items" icon={<ShoppingCart size={18} />}>
            <Stack gap="md" mt="xl">
              <ScrollArea h={300}>
                <Table verticalSpacing="sm">
                  <Table.Tbody>
                    {cart.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <Text fw={600}>{item.name}</Text>
                          <Text size="xs" c="dimmed">₹{item.price} × {item.quantity}</Text>
                        </Table.Td>
                        <Table.Td ta="right">
                          <Text fw={700}>₹{item.price * item.quantity}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
              <Paper 
                p="xl" 
                withBorder 
                radius="lg" 
                bg={isDark ? 'dark.6' : 'gray.0'}
                shadow="xs"
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="md" fw={500}>Subtotal</Text>
                    <Text size="md" fw={700}>₹{getCartTotal()}</Text>
                  </Group>
                  {paymentMethod === 'COD' && (
                    <Group justify="space-between">
                      <Text size="md" c="orange" fw={500}>COD Surcharge</Text>
                      <Text size="md" c="orange" fw={700}>+ ₹30</Text>
                    </Group>
                  )}
                  <Divider my="md" />
                  <Group justify="space-between">
                    <Title order={3} fw={900}>Total Payable</Title>
                    <Title order={2} fw={900} c="orange">₹{getCartTotal() + (paymentMethod === 'COD' ? 30 : 0)}</Title>
                  </Group>
                </Stack>
              </Paper>
              <Button 
                fullWidth 
                size="lg" 
                radius="md" 
                bg="premium-orange" 
                onClick={() => setActiveStep(1)}
                mt="md"
              >
                Continue to Payment
              </Button>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Payment" description="Select method" icon={<CreditCard size={18} />}>
            <Stack gap="md" mt="xl">
              <Paper p="md" withBorder radius="md">
                <Group gap="sm" mb="md">
                  <MapPin size={20} color="gray" />
                  <Box>
                    <Text fw={700} size="sm">Delivery Address</Text>
                    <Text size="xs" c="dimmed">Your default address will be used.</Text>
                  </Box>
                </Group>
              </Paper>

              <Text fw={700} size="sm">Select Payment Method</Text>
              <Radio.Group value={paymentMethod} onChange={setPaymentMethod}>
                <Stack gap="xs">
                  <Paper withBorder p="md" radius="md">
                    <Radio value="UPI" label={
                      <Group gap="xs">
                        <DeviceMobile size={18} />
                        <Text fw={600}>UPI (GPay, PhonePe, Paytm)</Text>
                      </Group>
                    } />
                  </Paper>
                  <Paper withBorder p="md" radius="md">
                    <Radio value="CARD" label={
                      <Group gap="xs">
                        <CreditCard size={18} />
                        <Text fw={600}>Credit / Debit Card</Text>
                      </Group>
                    } />
                  </Paper>
                  <Paper withBorder p="md" radius="md">
                    <Radio value="COD" label={
                      <Group gap="xs">
                        <Cash size={18} />
                        <Text fw={600}>Cash on Delivery</Text>
                      </Group>
                    } />
                  </Paper>
                </Stack>
              </Radio.Group>

              <Button 
                fullWidth 
                size="lg" 
                radius="md" 
                color="orange" 
                mt="xl"
                loading={placingOrder}
                onClick={placeOrder}
              >
                Place Order (₹{getCartTotal() + (paymentMethod === 'COD' ? 30 : 0)})
              </Button>
              <Button variant="subtle" color="gray" onClick={() => setActiveStep(0)}>Back to Cart</Button>
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Center h={400}>
              <Stack align="center" gap="md">
                <Box style={{ backgroundColor: isDark ? '#0d3321' : '#e6fcf5', padding: 20, borderRadius: '50%' }}>
                  <Check size={50} color="#099268" />
                </Box>
                <Title order={2} ta="center">Order Placed Successfully!</Title>
                <Text c="dimmed" ta="center">Your delicious meal from {selectedVendor?.restaurantName} is on its way.</Text>
                <Button variant="light" color="orange" radius="md" mt="xl" onClick={() => {
                  closeCheckout();
                  navigate('/orders');
                }}>
                  Track Order Status
                </Button>
              </Stack>
            </Center>
          </Stepper.Completed>
        </Stepper>
      </Modal>
    </Stack>
  );
};

export default UserDashboard;