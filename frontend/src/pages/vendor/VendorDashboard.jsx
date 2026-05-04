import React, { useEffect, useState } from 'react';
import { Card, Title, Text, Button, Table, Group, Badge, Modal, TextInput, NumberInput, Select, Switch, Stack, SimpleGrid, Box, ActionIcon, Skeleton, useMantineTheme, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { Check, Trash, Plus, Clock, ExternalLink, AlertCircle } from 'tabler-icons-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const VendorDashboard = () => {
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ startTime: '', endTime: '' });
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isAvailable: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes, profileRes] = await Promise.all([
        api.get('/vendors/menu'),
        api.get('/vendors/categories'),
        api.get('/vendors/profile')
      ]);
      setMenuItems(menuRes.data.data);
      setCategories(catRes.data.data.map(c => ({ value: String(c.id), label: c.name })));
      setProfile({
        startTime: profileRes.data.data.startTime?.substring(0, 5) || '08:00',
        endTime: profileRes.data.data.endTime?.substring(0, 5) || '22:00'
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put('/vendors/profile', profile);
      notifications.show({
        title: 'Success',
        message: 'Store timings updated successfully',
        color: 'green',
        icon: <Check size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update store timings',
        color: 'red',
        icon: <AlertCircle size={16} />,
      });
    }
  };

  const loadMenu = async () => {
    try {
      const response = await api.get('/vendors/menu');
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Failed to load menu', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendors/menu', form);
      close();
      loadMenu();
      setForm({ name: '', description: '', price: 0, categoryId: '', isAvailable: true });
    } catch (error) {
      console.error('Failed to add menu item', error);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/vendors/menu/${id}`, { isAvailable: !currentStatus });
      loadMenu();
    } catch (error) {
      console.error('Failed to update availability', error);
    }
  };

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: 'Confirm deletion',
      children: (
        <Text size="sm">
          Are you sure you want to delete this item? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete item', cancel: "No, keep it" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await api.delete(`/vendors/menu/${id}`);
          notifications.show({
            title: 'Deleted',
            message: 'Menu item has been removed',
            color: 'blue',
          });
          loadMenu();
        } catch (error) {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete item',
            color: 'red',
          });
        }
      },
    });
  };

  if (loading) return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Skeleton h={40} w={200} />
        <Skeleton h={40} w={150} />
      </Group>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Skeleton h={150} radius="md" />
        <Skeleton h={150} radius="md" />
      </SimpleGrid>
      <Skeleton h={400} radius="md" />
    </Stack>
  );

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Box>
          <Title order={2} fw={900}>{t('vendor_dashboard')}</Title>
          <Text c="dimmed" size="sm">Manage your restaurant menu and operational settings</Text>
        </Box>
        <Button 
          leftSection={<Plus size={18} />} 
          onClick={open}
          size="md"
          radius="md"
          bg="premium-orange"
        >
          {t('add_menu_item')}
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card shadow="sm" padding="xl" withBorder radius="lg">
          <Group mb="md" gap="xs">
            <ThemeIcon color="orange" variant="light" size="lg" radius="md">
              <Clock size={20} />
            </ThemeIcon>
            <Title order={4}>Operational Hours</Title>
          </Group>
          <Group align="flex-end" gap="md">
            <TextInput 
              label="Opening Time" 
              type="time" 
              value={profile.startTime} 
              onChange={(e) => setProfile({ ...profile, startTime: e.target.value })} 
              flex={1}
            />
            <TextInput 
              label="Closing Time" 
              type="time" 
              value={profile.endTime} 
              onChange={(e) => setProfile({ ...profile, endTime: e.target.value })} 
              flex={1}
            />
            <Button variant="filled" color="orange" onClick={handleUpdateProfile}>Update</Button>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">Orders will only be visible to customers during these hours.</Text>
        </Card>
        
        <Card shadow="sm" padding="xl" withBorder radius="lg">
          <Group mb="md" gap="xs">
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              <ExternalLink size={20} />
            </ThemeIcon>
            <Title order={4}>Store Status</Title>
          </Group>
          <Group justify="space-between">
            <Box>
              <Text fw={600}>Store Visibility</Text>
              <Text size="xs" c="dimmed">Your restaurant is currently live</Text>
            </Box>
            <Badge size="xl" color="green" variant="filled" radius="md">ONLINE</Badge>
          </Group>
        </Card>
      </SimpleGrid>

      <Card shadow="sm" padding="0" withBorder radius="lg" style={{ overflow: 'hidden' }}>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="md" horizontalSpacing="xl">
            <Table.Thead bg={isDark ? 'dark.6' : 'gray.0'}>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {menuItems.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Text fw={600}>{item.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="dot" color="blue">{item.category?.name || '-'}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={700} c="orange">₹{item.price}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Switch 
                      checked={item.isAvailable} 
                      onChange={() => toggleAvailability(item.id, item.isAvailable)}
                      color="green"
                      size="sm"
                      label={item.isAvailable ? 'Available' : 'Hidden'}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <ActionIcon 
                        variant="light" 
                        color="red" 
                        onClick={() => handleDelete(item.id)}
                        size="lg"
                        radius="md"
                      >
                        <Trash size={18} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {menuItems.length === 0 && (
          <Box p={60} style={{ textAlign: 'center' }}>
            <Text c="dimmed">No menu items yet. Add your first item!</Text>
          </Box>
        )}
      </Card>

      <Modal opened={opened} onClose={close} title={t('add_menu_item')}>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            mb="sm"
          />
          <TextInput
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            mb="sm"
          />
          <NumberInput
            label="Price (₹)"
            value={form.price}
            onChange={(val) => setForm({ ...form, price: val })}
            min={0}
            required
            mb="sm"
          />
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(val) => setForm({ ...form, categoryId: val })}
            data={categories}
            required
            mb="sm"
          />
          <Switch
            label="Available"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            mb="md"
          />
          <Button type="submit" fullWidth>{t('save')}</Button>
        </form>
      </Modal>
    </Stack>
  );
};

export default VendorDashboard;