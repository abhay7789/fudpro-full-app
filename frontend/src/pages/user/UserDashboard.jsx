import React, { useEffect, useState } from 'react';
import { 
  Card, Title, Text, Button, Badge, Group, SimpleGrid, Image, 
  Modal, Table, Divider, Stack, ActionIcon, Radio, Stepper, 
  Paper, Box, ScrollArea, Center, Loader
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, Trash, ShoppingCart, CreditCard, 
  DeviceMobile, Cash, MapPin, Check, ChevronRight 
} from 'tabler-icons-react';
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
      console.error('Failed to place order', error);
      alert('Failed to place order');
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
        <Title order={2} style={{ letterSpacing: -0.5 }}>{t('user_dashboard')}</Title>
        <Button 
          onClick={openCheckout} 
          variant="filled" 
          color="orange" 
          leftSection={<ShoppingCart size={18} />}
          radius="xl"
          disabled={cart.length === 0}
        >
          View Cart ({cart.length})
        </Button>
      </Group>

      <Title order={3} size="h4" c="dimmed">{t('available_vendors')}</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {vendors.map((vendor) => (
          <Card 
            key={vendor.id} 
            shadow="xs" 
            padding="lg" 
            radius="md" 
            withBorder 
            style={{ 
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onClick={() => loadVendorMenu(vendor.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Card.Section>
              <Image 
                src={vendor.coverImage ? (typeof vendor.coverImage === 'string' ? vendor.coverImage : `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, vendor.coverImage.data))}`) : (vendor.imageUrl || `https://source.unsplash.com/featured/?restaurant,food&${vendor.id}`)} 
                height={160} 
                alt={vendor.restaurantName} 
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={700} size="lg">{vendor.restaurantName}</Text>
              <Badge color="green" variant="light" radius="sm">Live</Badge>
            </Group>
            <Text size="sm" c="dimmed" lineClamp={2} mb="md">{vendor.description}</Text>
            <Button fullWidth variant="light" color="orange" radius="md">
              View Menu
            </Button>
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
        <ScrollArea h={500} offsetScrollbars>
          {Object.entries(menu).map(([category, items]) => (
            <Box key={category} mb="xl">
              <Divider my="md" label={<Text fw={700} c="orange" size="sm">{category}</Text>} labelPosition="left" />
              <Stack gap="xs">
                {items.map((item) => {
                  const cartItem = cart.find(i => i.id === item.id);
                  return (
                    <Paper key={item.id} p="md" withBorder radius="md" style={{ backgroundColor: cartItem ? '#fffaf5' : 'transparent' }}>
                      <Group justify="space-between" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                          <Text fw={600} size="md">{item.name}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>{item.description}</Text>
                          <Text fw={800} size="sm" mt={4}>₹{item.price}</Text>
                        </Box>
                        
                        {cartItem ? (
                          <Group gap={8} p={4} style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
                            <ActionIcon 
                              variant="subtle" 
                              color="orange" 
                              onClick={() => updateQuantity(item.id, -1)}
                              size="sm"
                            >
                              <Minus size={14} />
                            </ActionIcon>
                            <Text size="sm" fw={700} w={20} ta="center">{cartItem.quantity}</Text>
                            <ActionIcon 
                              variant="subtle" 
                              color="orange" 
                              onClick={() => updateQuantity(item.id, 1)}
                              size="sm"
                            >
                              <Plus size={14} />
                            </ActionIcon>
                            <Divider orientation="vertical" />
                            <ActionIcon 
                              variant="subtle" 
                              color="gray" 
                              onClick={() => removeFromCart(item.id)}
                              size="sm"
                            >
                              <Trash size={14} />
                            </ActionIcon>
                          </Group>
                        ) : (
                          <Button 
                            variant="light" 
                            color="orange" 
                            radius="md" 
                            size="xs"
                            onClick={() => addToCart(item)}
                            leftSection={<Plus size={14} />}
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
        
        <Box mt="xl" pt="md" style={{ borderTop: '1px solid #eee' }}>
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
              <Paper p="md" withBorder radius="md" style={{ backgroundColor: '#f9f9f9' }}>
                <Stack gap={4}>
                  <Group justify="space-between">
                    <Text size="sm">Subtotal</Text>
                    <Text size="sm">₹{getCartTotal()}</Text>
                  </Group>
                  {paymentMethod === 'COD' && (
                    <Group justify="space-between">
                      <Text size="sm" c="orange">COD Surcharge</Text>
                      <Text size="sm" c="orange">+ ₹30</Text>
                    </Group>
                  )}
                  <Divider my={4} />
                  <Group justify="space-between">
                    <Text fw={700} size="lg">Total Payable</Text>
                    <Text fw={800} size="xl" c="orange">₹{getCartTotal() + (paymentMethod === 'COD' ? 30 : 0)}</Text>
                  </Group>
                </Stack>
              </Paper>
              <Button fullWidth size="lg" radius="md" color="orange" onClick={() => setActiveStep(1)}>
                Choose Payment Method
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
                <Box style={{ backgroundColor: '#e6fcf5', padding: 20, borderRadius: '50%' }}>
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